import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('ホームページのテスト', () => {
  test('トップページが正しくレンダリングされる', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo('/', { waitFor: 'networkidle' });

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/home-page.png', fullPage: true });    // 基本的なページ要素が存在することを確認
    await expect(page.locator('#title')).toBeVisible();
    await expect(page.locator('#container')).toBeVisible();
    await expect(page.locator('#main')).toBeVisible();
  });
});
