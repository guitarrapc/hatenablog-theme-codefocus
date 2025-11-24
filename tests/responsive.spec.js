import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, VIEWPORTS, TIMEOUTS } from './constants.js';

test.describe('レスポンシブデザインのテスト', () => {
  test('デスクトップでのレイアウト確認', async ({ page }) => {
    // ビューポートをデスクトップサイズに設定
    await page.setViewportSize(VIEWPORTS.DESKTOP);

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.HOME, { waitFor: 'networkidle' });
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-desktop.png', fullPage: true });

    // コンテナが存在することを確認
    await expect(page.locator('#container')).toBeAttached();
    // メインコンテンツが存在することを確認
    await expect(page.locator('#main')).toBeAttached();
  });

  test('タブレットでのレイアウト確認', async ({ page }) => {
    // ビューポートをタブレットサイズに設定
    await page.setViewportSize(VIEWPORTS.TABLET);

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.HOME, { waitFor: 'networkidle' });
    await page.waitForTimeout(TIMEOUTS.MEDIUM);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-tablet.png', fullPage: true });

    // コンテナが存在することを確認
    await expect(page.locator('#container')).toBeAttached();
    // メインコンテンツが存在することを確認
    await expect(page.locator('#main')).toBeAttached();
  });

  test('スマートフォンでのレイアウト確認', async ({ page }) => {
    // ビューポートをスマートフォンサイズに設定
    await page.setViewportSize(VIEWPORTS.MOBILE);

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo('/', { waitFor: 'networkidle' });
    await page.waitForTimeout(2000);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-smartphone.png', fullPage: true });

    // コンテナが存在することを確認
    await expect(page.locator('#container')).toBeAttached();
    // メインコンテンツが存在することを確認
    await expect(page.locator('#main')).toBeAttached();
  });

  test('スマートフォンでの記事ページ確認', async ({ page }) => {
    // ビューポートをスマートフォンサイズに設定
    await page.setViewportSize({ width: 414, height: 896 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo('/entry/2025/05/10/204601', { waitFor: 'networkidle' });
    await page.waitForTimeout(2000);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-smartphone-article.png', fullPage: true });

    // 記事要素が存在することを確認
    await expect(page.locator('.entry-title')).toBeAttached();
    await expect(page.locator('.entry-content')).toBeAttached();
  });
});
