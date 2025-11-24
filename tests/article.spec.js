// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, SCROLL, TIMEOUTS } from './constants.js';

test.describe('記事ページのテスト', () => {
  test('最新記事ページが正しくレンダリングされる', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/article-page.png', fullPage: true });

    // 基本的な記事要素が存在することを確認
    await expect(page.locator(SELECTORS.ENTRY_TITLE)).toBeVisible();
    await expect(page.locator(SELECTORS.ENTRY_CONTENT)).toBeVisible();

    // 日付が表示されていることを確認
    await expect(page.locator(SELECTORS.ENTRY_DATE)).toBeVisible();

    // カテゴリーが表示されていることを確認（カテゴリーがある場合）
    const hasCategories = await page.locator(SELECTORS.ENTRY_CATEGORIES).isVisible();
    if (hasCategories) {
      // カテゴリー要素を確認
      await expect(page.locator(SELECTORS.ENTRY_CATEGORIES)).toBeVisible();
    }
  });

  test('目次ボタンが記事ページに表示される', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 目次が記事内に存在するか確認
    const tableOfContents = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await tableOfContents.isVisible();

    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして目次ボタンを表示させる
    await page.retryAction(async () => {
      await page.evaluate((scrollAmount) => {
        window.scrollBy(0, scrollAmount);
      }, SCROLL.TO_SHOW_TOC_BUTTON);
      await page.waitForTimeout(1000);
    });

    // 目次ボタンが表示されているか確認
    const tocButton = page.locator(SELECTORS.TOC_BUTTON);
    const isButtonVisible = await tocButton.isVisible({ timeout: TIMEOUTS.VERY_LONG }).catch(() => false);

    if (!isButtonVisible) {
      throw new Error('目次ボタンが表示されませんでした。JavaScriptの読み込みを確認してください。');
    }

    // スクリーンショットを撮影（目次ボタン閉じた状態）
    await page.screenshot({ path: 'screenshots/article-toc-button-closed.png', fullPage: false });

    // 目次ボタンをクリックして目次を表示 - iframe干渉を回避するためJavaScriptで直接クリック
    await page.retryAction(async () => {
      await page.evaluate((selector) => {
        const tocBtn = document.querySelector(selector);
        if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
      }, SELECTORS.TOC_BUTTON);
      await page.waitForTimeout(TIMEOUTS.MEDIUM); // アニメーションの完了を待つ
    });

    // 目次コンテンツが表示されているか確認
    await expect(page.locator(SELECTORS.FLOATING_TOC_SHOW)).toBeVisible({ timeout: TIMEOUTS.LONG });

    // スクリーンショットを撮影（目次ボタン開いた状態）
    await page.screenshot({ path: 'screenshots/article-toc-button-open.png', fullPage: false });
  });
});
