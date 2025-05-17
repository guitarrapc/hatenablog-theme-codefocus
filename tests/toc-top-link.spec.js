import { test, expect } from '@playwright/test';
import { url } from './helpers';

test.describe('目次ページトップボタンのテスト', () => {
  test('ページトップへボタンが表示され、クリックするとトップにスクロールする', async ({ page }) => {
    // サンプル記事を開く
    await page.goto(url('/entry/2025/05/10/204601'));

    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle');

    // 少しスクロールして目次ボタンを表示させる
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    // 目次ボタンが表示されるまで待機
    const tocButton = page.locator('.toc-button');
    await tocButton.waitFor({ state: 'visible' });

    // スクリーンショットを撮影（ボタンが表示された状態）
    await page.screenshot({ path: 'screenshots/toc-button-visible.png' });

    // 目次ボタンをクリック
    await tocButton.click();

    // フローティング目次が表示されるまで待機
    const floatingToc = page.locator('.floating-toc');
    await floatingToc.waitFor({ state: 'visible' });    // 「ページトップへ」ボタンがあることを確認
    const pageTopButton = page.locator('.floating-toc .page-top-button');
    await expect(pageTopButton).toBeVisible();
    await expect(pageTopButton).toHaveText('ページトップへ');

    // スクリーンショットを撮影（フローティング目次が表示された状態）
    await page.screenshot({ path: 'screenshots/floating-toc-with-top-button.png' });

    // 現在のスクロール位置を保存
    const scrollYBefore = await page.evaluate(() => window.scrollY);
    expect(scrollYBefore).toBeGreaterThan(0); // スクロールされていることを確認

    // 「ページトップへ」ボタンをクリック
    await pageTopButton.click();

    // スムーズスクロールの完了を待つ
    await page.waitForTimeout(1000);

    // トップにスクロールしたことを確認
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeLessThan(50); // ほぼトップにスクロールしていることを確認

    // 目次が閉じていることを確認
    await expect(floatingToc).not.toBeVisible();

    // スクリーンショットを撮影（トップにスクロールした状態）
    await page.screenshot({ path: 'screenshots/page-scrolled-to-top.png' });
  });
});
