// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, SCROLL, TIMEOUTS } from './constants.js';

test.describe('目次アクティブハイライトのテスト', () => {
  test('スクロール時に現在のセクションが強調表示される', async ({ page }) => {
    console.log('テスト開始: 目次アクティブハイライトのテスト');

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 目次が記事内に存在するか確認
    const tableOfContents = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await tableOfContents.isVisible();

    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして目次ボタンを表示させる
    await page.retryAction(async () => {
      await page.evaluate((scrollAmount) => {
        window.scrollBy(0, scrollAmount);
      }, SCROLL.TO_SHOW_TOC_BUTTON + 50);
      await page.waitForTimeout(1000);
    });

    // 目次ボタンが表示されているか確認（複数ある場合は最初の要素）
    const tocButton = page.locator(SELECTORS.TOC_BUTTON).first();
    const isButtonVisible = await tocButton.isVisible({ timeout: TIMEOUTS.VERY_LONG }).catch(() => false);

    if (!isButtonVisible) {
      throw new Error('目次ボタンが表示されませんでした。JavaScriptの読み込みを確認してください。');
    }

    // 目次ボタンをクリック - iframe干渉を回避するためJavaScriptで直接クリック
    await page.retryAction(async () => {
      await page.evaluate(() => {
        const tocBtn = document.querySelector('.toc-button');
        if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
      });
      await page.waitForTimeout(2000); // アニメーションの完了を待つ
    });

    // フローティング目次が表示されているか確認
    await expect(page.locator('.floating-toc.show').first()).toBeVisible({ timeout: 5000 });

    // 目次内の最初の項目を取得
    const firstTocItem = await page.locator('.floating-toc-list > li').first();
    if (!firstTocItem) {
      console.log('目次項目が見つかりません');
      return;
    }

    // 目次項目内のリンクを取得
    const firstTocLink = await firstTocItem.locator('a').first();
    const href = await firstTocLink.getAttribute('href');

    if (href) {
      // href属性からIDを抽出 ('#'を除去)
      const targetId = href.substring(1);

      // 対応する見出し要素へスクロール
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'instant', block: 'start' });
        }
      }, targetId);

      // スクロール位置が安定するまで少し待つ
      await page.waitForTimeout(1000);

      // アクティブ要素があるかどうかを確認するためのスクリーンショット
      await page.screenshot({ path: 'screenshots/toc-active-first-section.png', fullPage: false });

    }

    // TOC内の2番目の項目を取得 (入れ子構造の場合は子要素を探す)
    let secondTocLink;

    // まず2番目のトップレベルの要素を探す
    const secondLiElement = await page.locator('.floating-toc-list > li').nth(1);
    if (await secondLiElement.count() > 0) {
      secondTocLink = await secondLiElement.locator('a').first();
    } else {
      // トップレベルの要素が1つしかない場合は、子リストの最初の要素を探す
      secondTocLink = await page.locator('.floating-toc-list > li > ul > li').first().locator('a');
    }

    if (await secondTocLink.count() > 0) {
      const href = await secondTocLink.getAttribute('href');

      if (href) {
        const targetId = href.substring(1); // '#'を除去

        // 対応する見出し要素へスクロール
        await page.evaluate((id) => {
          const element = document.getElementById(id);
          if (element) {
            element.scrollIntoView({ behavior: 'instant', block: 'start' });
          }
        }, targetId);

        // スクロール位置が安定するまで少し待つ
        await page.waitForTimeout(1000);

        // スクリーンショットを撮影
        await page.screenshot({ path: 'screenshots/toc-active-second-section-scrolled.png' });
      }
    }

    // テスト完了を記録
    console.log('テスト完了: 目次アクティブハイライトのテスト');

    // 最終確認としてページ全体のスクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/toc-active-test-complete.png', fullPage: true });
  });
});

test.describe('アクティブな目次項目への自動スクロール', () => {
  // 目次が画面の高さの上限(広い画面は80vh)を超えて、目次の中でスクロールする大きさ
  const SHORT_WIDE = { width: 1600, height: 360 };

  /** 画面外の本文の描画後回し(content-visibility: auto)が解けて高さが変わると、ブラウザがページのスクロール位置を直すので、先に全部描く */
  const RENDER_ALL = '.entry-content > * { content-visibility: visible !important; }';

  /** フロート目次の項目のうち、目次の中での位置(0〜1)にあるものが指す見出しへ、ページをスクロールする */
  const readSection = async (/** @type {import('@playwright/test').Page} */ page, /** @type {number} */ position) => {
    const scrolledTo = await page.evaluate((position) => {
      const links = [...document.querySelectorAll('.floating-toc-list > li > a')];
      const link = links[Math.min(links.length - 1, Math.floor(links.length * position))];
      const heading = document.getElementById((link.getAttribute('href') ?? '').substring(1));
      if (!heading) return null;
      heading.scrollIntoView({ behavior: 'instant', block: 'start' });
      return Math.round(window.scrollY);
    }, position);
    expect(scrolledTo, '前提: 目次の項目が指す見出しが本文にあること').not.toBeNull();
    return /** @type {number} */ (scrolledTo);
  };

  const followState = (/** @type {import('@playwright/test').Page} */ page) => page.evaluate(() => {
    const panel = /** @type {HTMLElement} */ (document.querySelector('.floating-toc'));
    const active = panel.querySelector('a.active');
    const top = panel.getBoundingClientRect().top + panel.clientTop;
    const rect = active?.getBoundingClientRect();
    return {
      hasActive: !!active,
      activeVisible: !!rect && rect.top >= top - 1 && rect.bottom <= top + panel.clientHeight + 1,
      panelScrollTop: Math.round(panel.scrollTop),
      panelOverflows: panel.scrollHeight > panel.clientHeight,
      panelBelowScreen: panel.getBoundingClientRect().top >= window.innerHeight,
      scrollY: Math.round(window.scrollY),
    };
  });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize(SHORT_WIDE);
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.floating-toc.show .floating-toc-list > li > a').first()).toBeVisible({ timeout: TIMEOUTS.VERY_LONG });
    await page.addStyleTag({ content: RENDER_ALL });
  });

  test('目次の中だけをスクロールして項目を見せ、ページは動かさない', async ({ page }) => {
    expect((await followState(page)).panelOverflows, '前提: 目次が中でスクロールする長さであること').toBe(true);

    // 最後の節まで読み進めると、目次の中が下へスクロールして、その項目が見える
    const last = await readSection(page, 1);
    await expect.poll(async () => (await followState(page)).activeVisible).toBe(true);
    const atLast = await followState(page);
    expect(atLast.panelScrollTop).toBeGreaterThan(0);
    expect(atLast.scrollY).toBe(last);

    // 最初の節へ戻ると、目次の中も上へ戻る
    const first = await readSection(page, 0);
    await expect.poll(async () => (await followState(page)).panelScrollTop).toBeLessThan(atLast.panelScrollTop);
    await expect.poll(async () => (await followState(page)).activeVisible).toBe(true);
    expect((await followState(page)).scrollY).toBe(first);
  });

  // フロート目次のスタイルを持たないテーマに切り替えても、ブログに貼ったスクリプトは残る(テーマストアのプレビューなど)。
  // 目次は画面に固定されずページの最下部に並ぶので、項目を scrollIntoView で見せると、スクロールするたびにページごと最下部へ流れる
  test('フロート目次が画面に固定されていなくても、ページを目次まで流さない', async ({ page }) => {
    await page.addStyleTag({
      content: '.floating-toc { position: static !important; max-height: none !important; overflow: visible !important; }',
    });
    expect((await followState(page)).panelBelowScreen, '前提: 目次が画面の外(ページの最下部)にあること').toBe(true);

    const scrolledTo = await readSection(page, 0.5);
    await expect.poll(async () => (await followState(page)).hasActive, { message: '前提: 読んでいる節の項目がアクティブになること' }).toBe(true);
    // なめらかなスクロールが始まっていれば、この間に動く
    await page.waitForTimeout(TIMEOUTS.SHORT);

    expect((await followState(page)).scrollY).toBe(scrolledTo);
  });
});
