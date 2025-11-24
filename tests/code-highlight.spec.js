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

    // 代表的なコードブロックを撮影（Python）
    await codeBlocks[0].screenshot({ path: 'screenshots/code-highlight-pc-code-python.png' });
    console.log('コードハイライトのスクリーンショットを撮影しました');
  });
});
