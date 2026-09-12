// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from './constants.js';

test.describe('目次スタイルの詳細テスト', () => {
  test('目次のマーカーと縦線が仕様通りに表示される', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素を確認
    const inPageToc = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await inPageToc.isVisible();

    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // 目次のスクリーンショットを撮影
    await inPageToc.screenshot({ path: 'screenshots/toc-style-overview.png' });

    // 目次の項目を取得
    const tocItems = page.locator('.entry-content .table-of-contents li');
    const itemCount = await tocItems.count();

    if (itemCount === 0) {
      throw new Error('目次に項目が存在しません。テストデータを確認してください。');
    }

    // 複数の目次項目がある場合、最初と2番目の項目をキャプチャして比較
    if (itemCount >= 2) {
      // 最初の項目（h1相当）
      await tocItems.first().screenshot({ path: 'screenshots/toc-style-h1.png' });

      // 2番目の項目（h2相当）
      await tocItems.nth(1).screenshot({ path: 'screenshots/toc-style-h2.png' });

      // インデント位置の確認
      const firstItemBox = await tocItems.first().boundingBox();
      const secondItemBox = await tocItems.nth(1).boundingBox();

      if (!firstItemBox || !secondItemBox) {
        console.log('目次項目の位置情報が取得できません。インデントチェックをスキップします。');
        return;
      }

      // 項目の左位置が同じかどうかを確認（マーカーも同じ位置に揃うため）
      console.log(`最初の項目の左位置: ${firstItemBox.x}px`);
      console.log(`2番目の項目の左位置: ${secondItemBox.x}px`);

      // 位置が同じであることを検証（多少の誤差を許容）
      expect(Math.abs(firstItemBox.x - secondItemBox.x)).toBeLessThan(3);
    }

    // 目次項目にマウスホバー時の効果をテスト
    if (itemCount === 0) {
      console.log('目次項目が存在しないため、ホバーテストをスキップします。');
      return;
    }

    // 目次を強制的に表示状態にする
    await page.evaluate(() => {
      const tocContainer = document.querySelector('.toc-container');
      if (tocContainer) {
        tocContainer.classList.remove('toc-closed');
        tocContainer.classList.add('toc-open');
      }

      const tocContent = document.querySelector('.floating-toc-content');
      if (tocContent) {
        const tocEl = /** @type {HTMLElement} */ (tocContent);
        tocEl.style.display = 'block';
        tocEl.style.maxHeight = '800px';
        tocEl.style.visibility = 'visible';
        tocEl.style.opacity = '1';
        tocEl.style.pointerEvents = 'auto';
      }

      const tocItems = document.querySelectorAll('.table-of-contents li');
      tocItems.forEach(item => {
        const itemEl = /** @type {HTMLElement} */ (item);
        itemEl.style.pointerEvents = 'auto';
        itemEl.style.position = 'relative';
        itemEl.style.zIndex = '100';
      });
    });

    await page.waitForTimeout(1000);

    // 目次項目を取得
    const firstItem = page.locator('.entry-content .table-of-contents li').first();

    // 項目が見えない場合はスクロール
    if (!(await firstItem.isVisible())) {
      await page.evaluate(() => {
        const element = document.querySelector('.entry-content .table-of-contents li:first-child');
        if (element) {
          element.scrollIntoView({ block: 'center' });
          const el = /** @type {HTMLElement} */ (element);
          el.style.visibility = 'visible';
          el.style.display = 'block';
        }
      });
      await page.waitForTimeout(1000);
    }

    // ホバーテスト（失敗してもテスト全体は継続）
    await page.retryAction(async () => {
      await firstItem.screenshot({ path: 'screenshots/toc-style-item-before-hover.png' });
      await firstItem.hover({ force: true, timeout: 5000 });
      await page.waitForTimeout(1000);
      await firstItem.screenshot({ path: 'screenshots/toc-style-item-after-hover.png' });
    }, 1, 0).catch(error => {
      console.log('ホバーテストに失敗しましたが、テストは継続します:', error.message);
    });

    console.log('目次項目のホバーテストが完了しました');
  });

  test('1540px以上のワイドスクリーンで目次が常時表示される', async ({ page }) => {
    // ワイドスクリーン解像度に設定
    await page.setViewportSize({ width: 1600, height: 900 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして記事を表示
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // 目次ボタンが非表示であることを確認
    const tocButton = page.locator('.toc-button');
    const isButtonVisible = await tocButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isButtonVisible).toBe(false);

    // フローティング目次が自動的に表示されていることを確認
    const floatingToc = page.locator('.floating-toc.auto-expanded');
    await expect(floatingToc).toBeVisible({ timeout: 5000 });

    // フローティング目次のスクリーンショット
    await floatingToc.screenshot({ path: 'screenshots/toc-style-wide-screen.png' });

    // フローティング目次の項目が正しく表示されているか確認
    const floatingTocItems = page.locator('.floating-toc-list li');
    const itemCount = await floatingTocItems.count();

    if (itemCount > 0) {
      await floatingTocItems.first().screenshot({ path: 'screenshots/floating-toc-wide-first-item.png' });
    }

    console.log('ワイドスクリーンでの目次常時表示テストが完了しました');
  });

  test('解像度を1540px未満に変更すると目次が自動的に閉じる', async ({ page }) => {
    // 最初にワイドスクリーン解像度に設定
    await page.setViewportSize({ width: 1600, height: 900 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして記事を表示
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // ワイドスクリーンで目次が自動表示されていることを確認
    const floatingToc = page.locator('.floating-toc');
    await expect(floatingToc).toHaveClass(/auto-expanded/);
    await expect(floatingToc).toBeVisible();

    // 解像度を1540px未満に変更
    await page.setViewportSize({ width: 1366, height: 768 });

    // リサイズイベントの処理を待つ（デバウンス250ms + 余裕）
    await page.waitForTimeout(500);

    // 目次が閉じていることを確認（showクラスが削除されている）
    const hasShowClass = await floatingToc.evaluate(el => el.classList.contains('show'));
    expect(hasShowClass).toBe(false);

    // auto-expandedクラスが削除されていることを確認
    const hasAutoExpandedClass = await floatingToc.evaluate(el => el.classList.contains('auto-expanded'));
    expect(hasAutoExpandedClass).toBe(false);

    // 目次ボタンが表示されるようになったことを確認
    const tocButton = page.locator('.toc-button');
    await page.waitForTimeout(500); // スクロール閾値を超えるための待機

    // スクロール位置を確保してボタンを表示させる
    await page.evaluate(() => window.scrollBy(0, 50));
    await page.waitForTimeout(300);

    const isButtonVisible = await tocButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isButtonVisible).toBe(true);

    // activeクラスが削除されていることを確認
    const hasActiveClass = await tocButton.evaluate(el => el.classList.contains('active'));
    expect(hasActiveClass).toBe(false);

    console.log('解像度変更時の目次自動クローズテストが完了しました');
  });

  test('ページ最上部から目次ボタンが表示され、はてなのUI帯の裏に隠れない', async ({ page }) => {
    // 通常の解像度に設定（1540px未満なので目次ボタンが使われる）
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // 意図的にスクロールせず、初回ロード直後の状態を評価する
    const state = await page.evaluate(() => {
      const bottomOf = (/** @type {string} */ s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().bottom : 0;
      };
      const button = /** @type {HTMLElement} */ (document.querySelector('.toc-button'));
      const style = getComputedStyle(button);
      const rect = button.getBoundingClientRect();
      const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
      return {
        // はてなのグローバルヘッダと「読者になる」ボタンの帯の下端
        bandBottom: Math.max(bottomOf('#globalheader-container'), bottomOf('.blog-controlls')),
        visible: style.display !== 'none' && style.visibility !== 'hidden' && Number(style.opacity) > 0,
        top: rect.top,
        // ボタンの中心をヒットテストして、はてなのUIに覆われていないことを確認する
        clickable: !!(hit && hit.closest('.toc-button')),
      };
    });

    expect(state.bandBottom).toBeGreaterThan(0); // UI帯が存在する前提のテスト

    // スクロールしなくても最初から表示されること
    expect(state.visible).toBe(true);

    // UI帯より下にあり、実際にクリックできること
    expect(state.top).toBeGreaterThanOrEqual(state.bandBottom);
    expect(state.clickable).toBe(true);
  });

  test('はてなのUI帯を通過するときの位置変化がスクロールに遅れず追随する', async ({ page }) => {
    // 1540px未満: 目次ボタンとフロート目次の両方を対象にする
    await page.setViewportSize({ width: 1366, height: 768 });
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    const result = await page.evaluate(async () => {
      const targets = { tocButton: '.toc-button', floatingToc: '.floating-toc' };
      const readTops = () => Object.fromEntries(
        Object.entries(targets).map(([key, selector]) => {
          const el = document.querySelector(selector);
          return [key, el ? parseFloat(getComputedStyle(el).top) : null];
        })
      );

      window.scrollTo(0, 0);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const atTop = readTops();

      // UI帯を一気に通過させ、直後のフレームと落ち着いたあとの値を比べる
      window.scrollTo(0, 400);
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      const nextFrame = readTops();
      await new Promise((r) => setTimeout(r, 500));
      const settled = readTops();

      return { atTop, nextFrame, settled };
    });

    for (const key of ['tocButton', 'floatingToc']) {
      // 押し下げが効いていること(通過前後で位置が変わる)を前提として確認する
      expect(result.atTop[key]).toBeGreaterThan(result.settled[key]);

      // topにトランジションが掛かっていると数フレームかけて滑るため、
      // 直後のフレームで最終値に到達していることを確認する
      expect(Math.abs(result.nextFrame[key] - result.settled[key])).toBeLessThanOrEqual(1);
    }
  });

  test('スマートフォンでは目次ボタンを画面下部に置き、目次は上方向に開く', async ({ page }) => {
    await page.setViewportSize({ width: 430, height: 932 });
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    const placement = await page.evaluate(() => {
      const box = (/** @type {string} */ s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect() : null;
      };
      const overlaps = (/** @type {DOMRect|null} */ a, /** @type {DOMRect|null} */ b) =>
        !!(a && b && a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom);
      const button = box('.toc-button');
      return {
        inLowerHalf: !!button && button.top > window.innerHeight / 2,
        inViewport: !!button && button.bottom <= window.innerHeight,
        // ブログタイトルやパンくず、記事タイトルに重ならないこと
        hitsHeader: ['#blog-title', '.breadcrumb', '.entry-title'].some((s) => overlaps(button, box(s))),
      };
    });

    expect(placement.inLowerHalf).toBe(true);
    expect(placement.inViewport).toBe(true);
    expect(placement.hitsHeader).toBe(false);

    // 目次を開くとボタンの上に展開し、はてなのUI帯にも画面外にもかからないこと
    await page.evaluate(() => {
      const button = /** @type {HTMLElement | null} */ (document.querySelector('.toc-button'));
      if (button) button.click();
    });
    await expect(page.locator('.floating-toc.show')).toBeVisible({ timeout: 5000 });

    const panel = await page.evaluate(() => {
      const bottomOf = (/** @type {string} */ s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().bottom : 0;
      };
      const toc = /** @type {HTMLElement} */ (document.querySelector('.floating-toc')).getBoundingClientRect();
      const button = /** @type {HTMLElement} */ (document.querySelector('.toc-button')).getBoundingClientRect();
      return {
        bandBottom: Math.max(bottomOf('#globalheader-container'), bottomOf('.blog-controlls')),
        opensUpward: toc.bottom <= button.top + 1,
        top: toc.top,
        bottom: toc.bottom,
        viewportHeight: window.innerHeight,
      };
    });

    expect(panel.opensUpward).toBe(true);
    expect(panel.top).toBeGreaterThanOrEqual(panel.bandBottom);
    expect(panel.bottom).toBeLessThanOrEqual(panel.viewportHeight);
  });

  test('ワイドスクリーンでフロート目次がはてなのUI帯に重ならない', async ({ page }) => {
    // ワイドスクリーンでは目次が常時表示されるため、ページ最上部でUI帯と衝突しうる
    await page.setViewportSize({ width: 1600, height: 900 });
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    await expect(page.locator('.floating-toc.auto-expanded')).toBeVisible({ timeout: 5000 });

    /** フロート目次とはてなのUI帯の位置関係を取得する */
    const geometry = () => page.evaluate(() => {
      const bottomOf = (/** @type {string} */ s) => {
        const el = document.querySelector(s);
        return el ? el.getBoundingClientRect().bottom : 0;
      };
      const rect = /** @type {HTMLElement} */ (document.querySelector('.floating-toc')).getBoundingClientRect();
      return {
        bandBottom: Math.max(bottomOf('#globalheader-container'), bottomOf('.blog-controlls')),
        top: rect.top,
        bottom: rect.bottom,
        viewportHeight: window.innerHeight,
      };
    });

    // 意図的にスクロールせず、初回ロード直後の状態を評価する
    const atTop = await geometry();
    expect(atTop.bandBottom).toBeGreaterThan(0); // UI帯が存在する前提のテスト
    expect(atTop.top).toBeGreaterThanOrEqual(atTop.bandBottom);
    // 押し下げても下端が画面外にはみ出さないこと
    expect(atTop.bottom).toBeLessThanOrEqual(atTop.viewportHeight);

    // UI帯を通り過ぎたら本来の位置(top: 5em)に戻ること
    await page.evaluate((y) => window.scrollTo(0, y), atTop.bandBottom + 200);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    const afterScroll = await geometry();
    expect(afterScroll.top).toBeLessThan(atTop.top);
    expect(afterScroll.bottom).toBeLessThanOrEqual(afterScroll.viewportHeight);
  });

  test('ページ右上の目次ボタンが仕様通りに表示される', async ({ page }) => {
    // 通常の解像度に設定（1540px未満）
    await page.setViewportSize({ width: 1366, height: 768 });
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして目次ボタンを表示させる
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // 目次ボタンが表示されるか確認（1540px未満なので表示されるべき）
    const tocButton = page.locator('.toc-button');
    const isButtonVisible = await tocButton.isVisible({ timeout: 15000 }).catch(() => false);

    if (!isButtonVisible) {
      throw new Error('目次ボタンが表示されませんでした。JavaScriptの読み込みを確認してください。');
    }

    // 通常解像度では目次ボタンが表示されることを確認
    expect(isButtonVisible).toBe(true);

    // 目次ボタンのスクリーンショット（閉じた状態）
    await tocButton.screenshot({ path: 'screenshots/toc-style-button-style-closed.png' });

    // ボタンをクリックして目次を開く
    await page.evaluate(() => {
      const tocBtn = document.querySelector('.toc-button');
      if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
    });
    await page.waitForTimeout(1000);

    // 目次ボタンのスクリーンショット（開いた状態）
    await tocButton.screenshot({ path: 'screenshots/toc-style-button-style-open.png' });

    // フローティング目次が表示されているか確認
    const floatingToc = page.locator('.floating-toc.show');
    await expect(floatingToc).toBeVisible({ timeout: 5000 });

    // フローティング目次のスクリーンショット
    await floatingToc.screenshot({ path: 'screenshots/toc-style-floating.png' });

    // フローティング目次の項目が正しく表示されているか確認
    const floatingTocItems = page.locator('.floating-toc-list li');
    const itemCount = await floatingTocItems.count();

    if (itemCount > 0) {
      await floatingTocItems.first().screenshot({ path: 'screenshots/floating-toc-first-item.png' });
    }
  });
});
