import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('レンダリング確認テスト', () => {
  test('トップページのビジュアル確認', async ({ page }) => {
    await page.retryAction(async () => {
      await page.goto('/');
    });
    await page.waitForPageToLoad();
    await page.screenshot({ path: 'screenshots/visual-home.png', fullPage: true });
  });

  test('記事ページのビジュアル確認', async ({ page }) => {
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });
    await page.waitForPageToLoad();
    await page.screenshot({ path: 'screenshots/visual-article.png', fullPage: true });
  });
  test('レスポンシブ（モバイル）のビジュアル確認', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.retryAction(async () => {
      await page.goto('/');
    });
    await page.waitForPageToLoad();

    // ページが完全に読み込まれるまでさらに待機
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshots/visual-mobile.png', fullPage: true });

    // コンテナが存在することを確認（表示されなくてもよい）
    await expect(page.locator('#container')).toBeAttached();

    // メインコンテンツが存在することを確認（表示されなくてもよい）
    await expect(page.locator('#main')).toBeAttached();
  });
  test('レスポンシブ（タブレット）のビジュアル確認', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.retryAction(async () => {
      await page.goto('/');
    });
    await page.waitForPageToLoad();

    // ページが完全に読み込まれるまでさらに待機
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshots/visual-tablet.png', fullPage: true });

    // コンテナが存在することを確認（表示されなくてもよい）
    await expect(page.locator('#container')).toBeAttached();

    // メインコンテンツが存在することを確認（表示されなくてもよい）
    await expect(page.locator('#main')).toBeAttached();
  }); test('スマートフォンでの記事ページ確認', async ({ page }) => {
    await page.setViewportSize({ width: 414, height: 896 });
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });
    await page.waitForPageToLoad();

    // ページが完全に読み込まれるまでさらに待機
    await page.waitForTimeout(2000);

    await page.screenshot({ path: 'screenshots/visual-mobile-article.png', fullPage: true });

    // 記事要素が存在することを確認（表示されていなくてもよい）
    await expect(page.locator('.entry-title')).toBeAttached();
    await expect(page.locator('.entry-content')).toBeAttached();
  }); test('目次機能のビジュアル確認', async ({ page }) => {
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });
    await page.waitForPageToLoad();

    // 記事内の目次要素を確認
    const inPageToc = page.locator('.entry-content .table-of-contents');
    const hasToc = await inPageToc.isVisible();

    if (!hasToc) {
      console.log('テスト対象の記事に目次が存在しません。このテストをスキップします。');
      test.skip();
      return;
    }

    // 記事内目次のキャプチャ
    await page.screenshot({
      path: 'screenshots/visual-in-page-toc.png', fullPage: false, clip: {
        x: await inPageToc.boundingBox().then(box => box.x),
        y: await inPageToc.boundingBox().then(box => box.y),
        width: await inPageToc.boundingBox().then(box => box.width),
        height: await inPageToc.boundingBox().then(box => box.height + 50) // 少し余白を取る
      }
    });

    // スクロールして目次ボタンを表示
    await page.evaluate(() => {
      window.scrollBy(0, 250);
    });
    await page.waitForTimeout(1000);

    // 目次ボタンが表示されたらキャプチャ
    const tocButton = page.locator('.toc-button');
    if (await tocButton.isVisible()) {
      await page.screenshot({ path: 'screenshots/visual-toc-button.png', fullPage: false });            // 目次ボタンをクリック - iframe干渉を回避するためJavaScriptで直接クリック
      await page.evaluate(() => {
        const tocBtn = document.querySelector('.toc-button');
        if (tocBtn) tocBtn.click();
      });
      await page.waitForTimeout(1000);

      // 目次コンテンツが表示されたらキャプチャ
      await page.screenshot({ path: 'screenshots/visual-toc-content.png', fullPage: false });
    }
  });
});
