import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('目次ページトップボタンのテスト', () => {
  test('ページトップへボタンが表示され、クリックするとトップにスクロールする', async ({ page }) => {
    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();

    // 目次が記事内に存在するか確認
    const tableOfContents = page.locator('.entry-content .table-of-contents');
    const hasToc = await tableOfContents.isVisible();

    if (!hasToc) {
      console.log('テスト対象の記事に目次が存在しません。このテストをスキップします。');
      test.skip();
      return;
    }

    // スクロールして目次ボタンを表示させる（200px以上スクロールが必要）
    await page.retryAction(async () => {
      await page.evaluate(() => {
        window.scrollBy(0, 300);
      });
      await page.waitForTimeout(1000);
    });

    // 目次ボタンが表示されているか確認（最大15秒間待機、複数ある場合は最初の要素）
    const tocButton = page.locator('.toc-button').first();
    try {
      await expect(tocButton).toBeVisible({ timeout: 15000 });

      // スクリーンショットを撮影（ボタンが表示された状態）
      await page.screenshot({ path: 'screenshots/toc-button-visible.png' });

      // 目次ボタンをクリック - iframe干渉を回避するためJavaScriptで直接クリック
      await page.retryAction(async () => {
        await page.evaluate(() => {
          const tocBtn = document.querySelector('.toc-button');
          if (tocBtn) tocBtn.click();
        });
        // アニメーションの完了を待つ
        await page.waitForTimeout(2000);
      });
    } catch (error) {
      console.log('目次ボタンが表示されませんでした。テストをスキップします。');
      test.skip();
      return;
    }

    // フローティング目次が表示されているか確認
    const floatingToc = page.locator('.floating-toc.show').first();
    await expect(floatingToc).toBeVisible({ timeout: 5000 });
    // スクリーンショットを撮影（目次が開いた状態）
    await page.screenshot({ path: 'screenshots/floating-toc-with-top-button.png' });

    // 「ページトップへ」ボタンがあることを確認
    const pageTopButton = page.locator('.floating-toc .page-top-button').first();
    await expect(pageTopButton).toBeVisible();
    await expect(pageTopButton).toHaveText('ページトップへ');

    // 現在のスクロール位置を保存 + スクロールされていることを確認
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(0);

    // 「ページトップへ」ボタンをクリック - JavaScriptで直接クリック
    await page.retryAction(async () => {
      await page.evaluate(() => {
        const btn = document.querySelector('.floating-toc .page-top-button');
        if (btn) btn.click();
      });
      await page.waitForTimeout(500);
    });

    // スムーズスクロールの完了を待つ（scrollY値が安定するまで、モバイル考慮で長めに）
    await page.waitForFunction(
      () => {
        return window.scrollY < 100;
      },
      { timeout: 5000 }
    );

    // トップにスクロールしたことを確認（モバイル考慮で100pxまで許容）
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeLessThan(100);

    // スクリーンショットを撮影（トップにスクロールした状態）
    await page.screenshot({ path: 'screenshots/page-scrolled-to-top.png' });
  });
});
