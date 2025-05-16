// @ts-check
import { test as baseTest, expect } from '@playwright/test';
import { test, url } from './helpers';

test.describe('Screenshot Capture', () => {
  // Surface Pro 7 (912x1368)
  test('Surface Pro 7 - PC screenshots', async ({ page }) => {
    // ページ上部のスクリーンショット
    await page.goto(url('/entry/2025/05/10/204601'));
    await page.setViewportSize({ width: 912, height: 1368 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/pc-article-top.png' });

    // 目次のスクリーンショット
    const tocExists = await page.locator('ul.table-of-contents').isVisible();
    if (tocExists) {      // 目次が閉じている場合は開く
      // 目次コンテナを確認
      const tocContainerClosed = await page.evaluate(() => {
        const tocContainer = document.querySelector('.toc-container');
        return tocContainer && tocContainer.classList.contains('toc-closed');
      });

      if (tocContainerClosed) {
        // 目次のトグルをクリックして開く（正しいクラス名は toc-title）
        await page.evaluate(() => {
          const tocTitle = document.querySelector('.toc-title');
          if (tocTitle) tocTitle.click();
        });
        await page.waitForTimeout(500); // アニメーション待機
      }

      // 記事内目次のスクリーンショット
      await page.locator('ul.table-of-contents').screenshot({ path: 'articles/screenshots/pc-toc.png' });

      // スクロールして目次ボタンを表示させる（200px以上スクロールが必要）
      await page.evaluate(() => {
        window.scrollBy(0, 250);
      });
      await page.waitForTimeout(1000);

      // 目次ボタンが表示されるか確認
      const tocButton = page.locator('.toc-button');
      let isButtonVisible = false;

      await expect(tocButton).toBeVisible({ timeout: 15000 });
      isButtonVisible = true;

      // フローティング目次ボタンと目次のスクリーンショット
      await page.locator('.toc-button').screenshot({ path: 'articles/screenshots/pc-toc-button.png' });
      // iframeの干渉を避けるためにJavaScriptを使用して目次ボタンをクリック
      await page.evaluate(() => {
        const tocButton = document.querySelector('.toc-button');
        if (tocButton) tocButton.click();
      });
      // ボタンクリック後に目次が表示されるまで少し待つ
      await page.waitForTimeout(500);
      await page.locator('.floating-toc').screenshot({ path: 'articles/screenshots/pc-floating-toc.png' });
    }

    // コードハイライトのスクリーンショット
    await page.goto(url('/entry/2025/05/12/131258'));
    await page.waitForLoadState('networkidle');

    // コードブロックを探して撮影
    const codeBlocks = await page.locator('pre').all();
    if (codeBlocks.length > 0) {
      // Python, C#, Goのコードブロックをそれぞれ撮影
      await codeBlocks[0].screenshot({ path: 'articles/screenshots/pc-code-python.png' });

      if (codeBlocks.length > 1) {
        await codeBlocks[1].screenshot({ path: 'articles/screenshots/pc-code-csharp.png' });
      }

      if (codeBlocks.length > 2) {
        await codeBlocks[2].screenshot({ path: 'articles/screenshots/pc-code-go.png' });
      }
    }
  });

  // iPad Pro 12.9 (1024x1366)
  test('iPad Pro 12.9 - Tablet screenshots', async ({ page }) => {
    await page.goto(url('/entry/2025/05/10/204601'));
    await page.setViewportSize({ width: 1024, height: 1366 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/tablet-article-top.png' });
  });

  // iPhone 14 Pro Max (430x932)
  test('iPhone 14 Pro Max - Smartphone screenshots', async ({ page }) => {
    await page.goto(url('/entry/2025/05/10/204601'));
    await page.setViewportSize({ width: 430, height: 932 });
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/smartphone-article-top.png' });
  });
});
