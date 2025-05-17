import { test, expect } from '@playwright/test';
import { openUrl } from './helpers';

test.describe('目次アクティブハイライトのテスト', () => {
  test('スクロール時に現在のセクションが強調表示される', async ({ page }) => {
    // サンプル記事を開く
    await openUrl(page, '/entry/2025/05/10/204601');

    // 目次ボタンが表示されるようにスクロール
    await page.evaluate(() => {
      window.scrollBy(0, 300);
    });

    // 目次ボタンをクリックして目次を表示
    await page.locator('.toc-button').click();

    // 最初のセクションに移動して、アクティブ状態をチェック
    const firstHeading = await page.locator('h1').first();
    const firstHeadingId = await firstHeading.getAttribute('id');

    if (firstHeadingId) {
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, firstHeadingId);

      // スクロール位置が安定するまで少し待つ
      await page.waitForTimeout(500);

      // 対応する目次項目にアクティブクラスがあることを確認
      const tocLink = page.locator(`.floating-toc a[href="#${firstHeadingId}"]`);
      await expect(tocLink).toHaveClass(/active/);

      // スクリーンショットを撮影
      await page.screenshot({ path: 'screenshots/toc-active-first-section.png', fullPage: false });
    }

    // 別のセクションにスクロールして、アクティブ状態が変わることをチェック
    const secondHeading = await page.locator('h2').nth(1); // 2番目のh2要素
    const secondHeadingId = await secondHeading.getAttribute('id');

    if (secondHeadingId) {
      await page.evaluate((id) => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'instant', block: 'start' });
      }, secondHeadingId);

      // スクロール位置が安定するまで少し待つ
      await page.waitForTimeout(500);

      // 対応する目次項目にアクティブクラスがあることを確認
      const tocLink = page.locator(`.floating-toc a[href="#${secondHeadingId}"]`);
      await expect(tocLink).toHaveClass(/active/);

      // スクリーンショットを撮影
      await page.screenshot({ path: 'screenshots/toc-active-second-section.png', fullPage: false });
    }
  });
});
