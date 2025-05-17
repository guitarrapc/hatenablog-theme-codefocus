// @ts-check
import { test, expect } from '@playwright/test';
import { url } from './helpers';

test.describe('Code Highlight Screenshots', () => {
  // Surface Pro 7 (912x1368)
  test('Capture code highlight on PC', async ({ page }) => {
    // コードハイライトのスクリーンショット
    await page.goto(url('/entry/2025/05/12/131258'));
    await page.setViewportSize({ width: 912, height: 1368 });
    await page.waitForLoadState('networkidle');

    // コードブロックを探して撮影
    const codeBlocks = await page.locator('pre').all();
    if (codeBlocks.length > 0) {
      // Python, C#, Goのコードブロックをそれぞれ撮影
      await codeBlocks[0].screenshot({ path: 'screenshots/pc-code-python.png' });
      console.log('Pythonコードのスクリーンショットを撮影しました');

      if (codeBlocks.length > 1) {
        await codeBlocks[1].screenshot({ path: 'screenshots/pc-code-csharp.png' });
        console.log('C#コードのスクリーンショットを撮影しました');
      }

      if (codeBlocks.length > 2) {
        await codeBlocks[2].screenshot({ path: 'screenshots/pc-code-go.png' });
        console.log('Goコードのスクリーンショットを撮影しました');
      }
    } else {
      console.log('コードブロックが見つかりませんでした');
    }
  });
});
