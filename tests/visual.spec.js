// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, SCROLL, TIMEOUTS } from './constants.js';

test.describe('ビジュアル確認テスト', () => {
  test('トップページのビジュアル確認', async ({ page }) => {
    await page.navigateTo(TEST_URLS.HOME, { waitFor: 'networkidle' });
    await page.screenshot({ path: 'screenshots/visual-home.png', fullPage: true });
  });

  test('記事ページのビジュアル確認', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await page.screenshot({ path: 'screenshots/visual-article.png', fullPage: true });
  });

  test('目次機能のビジュアル確認', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素を確認
    const inPageToc = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await inPageToc.isVisible();

    if (!hasToc) {
      console.log('テスト対象の記事に目次が存在しません。このテストをスキップします。');
      test.skip();
      return;
    }

    // 記事内目次のキャプチャ
    const tocBox = await inPageToc.boundingBox();
    if (!tocBox) {
      console.log('目次の位置情報が取得できません。スクリーンショットをスキップします。');
      return;
    }

    await page.screenshot({
      path: 'screenshots/visual-in-page-toc.png', fullPage: false, clip: {
        x: tocBox.x,
        y: tocBox.y,
        width: tocBox.width,
        height: tocBox.height + 50 // 少し余白を取る
      }
    });

    // スクロールして目次ボタンを表示
    await page.evaluate((scrollAmount) => {
      window.scrollBy(0, scrollAmount);
    }, SCROLL.TO_SHOW_TOC_BUTTON);
    await page.waitForTimeout(TIMEOUTS.SHORT);

    // 目次ボタンが表示されたらキャプチャ
    const tocButton = page.locator(SELECTORS.TOC_BUTTON);
    if (await tocButton.isVisible()) {
      await page.screenshot({ path: 'screenshots/visual-toc-button.png', fullPage: false });

      // 目次ボタンをクリック - iframe干渉を回避するためJavaScriptで直接クリック
      await page.evaluate((selector) => {
        const tocBtn = document.querySelector(selector);
        if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
      }, SELECTORS.TOC_BUTTON);
      await page.waitForTimeout(TIMEOUTS.SHORT);

      // 目次コンテンツが表示されたらキャプチャ
      await page.screenshot({ path: 'screenshots/visual-toc-content.png', fullPage: false });
    }
  });
});
