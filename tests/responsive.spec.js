import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('レスポンシブデザインのテスト', () => {
  test('デスクトップでのレイアウト確認', async ({ page }) => {
    // ビューポートをデスクトップサイズに設定
    await page.setViewportSize({ width: 1280, height: 800 });

    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();
    await page.waitForTimeout(2000);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-desktop.png', fullPage: true });

    // コンテナが存在することを確認
    await expect(page.locator('#container')).toBeAttached();
    // メインコンテンツが存在することを確認
    await expect(page.locator('#main')).toBeAttached();
  });

  test('タブレットでのレイアウト確認', async ({ page }) => {
    // ビューポートをタブレットサイズに設定
    await page.setViewportSize({ width: 768, height: 1024 });

    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();
    await page.waitForTimeout(2000);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-tablet.png', fullPage: true });

    // コンテナが存在することを確認
    await expect(page.locator('#container')).toBeAttached();
    // メインコンテンツが存在することを確認
    await expect(page.locator('#main')).toBeAttached();
  });

  test('スマートフォンでのレイアウト確認', async ({ page }) => {
    // ビューポートをスマートフォンサイズに設定
    await page.setViewportSize({ width: 414, height: 896 });

    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();
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

    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();
    await page.waitForTimeout(2000);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/responsive-smartphone-article.png', fullPage: true });

    // 記事要素が存在することを確認
    await expect(page.locator('.entry-title')).toBeAttached();
    await expect(page.locator('.entry-content')).toBeAttached();
  });
});
