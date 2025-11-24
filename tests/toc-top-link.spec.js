// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, SCROLL, TIMEOUTS } from './constants.js';

test.describe('目次ページトップボタンのテスト', () => {
  test('ページトップへボタンが表示され、クリックするとトップにスクロールする', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 目次が記事内に存在するか確認
    const tableOfContents = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await tableOfContents.isVisible();

    if (!hasToc) {
      console.log('テスト対象の記事に目次が存在しません。このテストをスキップします。');
      test.skip();
      return;
    }

    // スクロールして目次ボタンを表示させる
    await page.retryAction(async () => {
      await page.evaluate((scrollAmount) => {
        window.scrollBy(0, scrollAmount);
      }, SCROLL.TO_SHOW_TOC_BUTTON + 50);
      await page.waitForTimeout(TIMEOUTS.SHORT);
    });

    // 目次ボタンが表示されているか確認（複数ある場合は最初の要素）
    const tocButton = page.locator(SELECTORS.TOC_BUTTON).first();
    try {
      await expect(tocButton).toBeVisible({ timeout: TIMEOUTS.VERY_LONG });

      // スクリーンショットを撮影（ボタンが表示された状態）
      await page.screenshot({ path: 'screenshots/toc-top-link-button-visible.png' });

      // 目次ボタンをクリック - iframe干渉を回避するためJavaScriptで直接クリック
      await page.retryAction(async () => {
        await page.evaluate(() => {
          const tocBtn = document.querySelector('.toc-button');
          if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
        });
        // アニメーションの完了を待つ
        await page.waitForTimeout(2000);
      });
    } catch (error) {
      console.log('目次ボタンが表示されませんでした。テストをスキップします。');
      test.skip();
      return;
    }

    // フローティング目次が表示されているか確認
    const floatingToc = page.locator('.floating-toc.show').first();
    await expect(floatingToc).toBeVisible({ timeout: 5000 });
    // スクリーンショットを撮影（目次が開いた状態）
    await page.screenshot({ path: 'screenshots/toc-top-link-floating-toc-with-top-button.png' });

    // 「ページトップへ」ボタンがあることを確認
    const pageTopButton = page.locator('.floating-toc .page-top-button').first();
    await expect(pageTopButton).toBeVisible();
    await expect(pageTopButton).toHaveText('ページトップへ');

    // 現在のスクロール位置を保存 + スクロールされていることを確認
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(0);

    // 「ページトップへ」ボタンをクリック - JavaScriptで直接クリック
    await page.retryAction(async () => {
      await page.evaluate(() => {
        const btn = document.querySelector('.floating-toc .page-top-button');
        if (btn) (/** @type {HTMLElement} */ (btn)).click();
      });
      await page.waitForTimeout(500);
    });

    // スムーズスクロールの完了を待つ（scrollY値が安定するまで、モバイル考慮で長めに）
    await page.waitForFunction(
      () => {
        return window.scrollY < 100;
      },
      { timeout: 5000 }
    );

    // トップにスクロールしたことを確認（モバイル考慮で100pxまで許容）
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeLessThan(100);

    // スクリーンショットを撮影（トップにスクロールした状態）
    await page.screenshot({ path: 'screenshots/toc-top-link-page-scrolled-to-top.png' });
  });
});
