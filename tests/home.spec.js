import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('ホームページのテスト', () => {
  test('トップページが正しくレンダリングされる', async ({ page }) => {    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/home-page.png', fullPage: true });    // 基本的なページ要素が存在することを確認
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#container')).toBeVisible();
    await expect(page.locator('#main')).toBeVisible();
  });
});
