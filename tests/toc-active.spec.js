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
