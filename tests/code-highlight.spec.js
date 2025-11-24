// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, VIEWPORTS } from './constants.js';

test.describe('Code Highlight Screenshots', () => {
  // Surface Pro 7 (912x1368)
  test('Capture code highlight on PC', async ({ page }) => {
    // コードハイライトのスクリーンショット
    await page.navigateTo(TEST_URLS.CODE_HIGHLIGHT, { waitFor: 'networkidle' });
    await page.setViewportSize(VIEWPORTS.SURFACE_PRO);

    // コードブロックを探して撮影
    const codeBlocks = await page.locator('pre').all();

    if (codeBlocks.length === 0) {
      throw new Error('コードハイライト記事にコードブロックが存在しません。テストデータを確認してください。');
    }

    // Python, C#, Goのコードブロックをそれぞれ撮影
    await codeBlocks[0].screenshot({ path: 'screenshots/code-highlight-pc-code-python.png' });
    console.log('Pythonコードのスクリーンショットを撮影しました');

    if (codeBlocks.length > 1) {
      await codeBlocks[1].screenshot({ path: 'screenshots/code-highlight-pc-code-csharp.png' });
      console.log('C#コードのスクリーンショットを撮影しました');
    }

    if (codeBlocks.length > 2) {
      await codeBlocks[2].screenshot({ path: 'screenshots/code-highlight-pc-code-go.png' });
      console.log('Goコードのスクリーンショットを撮影しました');
    }
  });
});
