import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from './constants.js';

test.describe('ホームページのテスト', () => {
  test('トップページが正しくレンダリングされる', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.HOME, { waitFor: 'networkidle' });

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/home-page.png', fullPage: true });    // 基本的なページ要素が存在することを確認
    await expect(page.locator(SELECTORS.BLOG_TITLE)).toBeVisible();
    await expect(page.locator(SELECTORS.CONTAINER)).toBeVisible();
    await expect(page.locator(SELECTORS.MAIN)).toBeVisible();
  });
});
