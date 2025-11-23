import { test, expect } from '@playwright/test';
import { url } from './helpers';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('目次ページトップボタンのテスト', () => {
  test('ページトップへボタンが表示され、クリックするとトップにスクロールする', async ({ page }) => {
    // JSファイルを読み込んでaddInitScriptで追加（ドキュメント作成後、スクリプト実行前に実行される）
    const jsPath = path.resolve(__dirname, '../js/toc-button.js');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    await page.addInitScript(jsContent);

    // サンプル記事を開く（addInitScript後にナビゲート）
    await page.goto(url('/entry/2025/05/10/204601'));

    // ページが完全に読み込まれるまで待機
    await page.waitForLoadState('networkidle');

    // DOMContentLoadedイベントが発火してスクリプトが実行されるまで待機
    await page.waitForTimeout(500);    // 少しスクロールして目次ボタンを表示させる
    await page.evaluate(() => {
      window.scrollBy(0, 500);
    });

    // 目次ボタンが表示されるまで待機
    const tocButton = page.locator('.toc-button');
    await tocButton.waitFor({ state: 'visible' });

    // スクリーンショットを撮影（ボタンが表示された状態）
    await page.screenshot({ path: 'screenshots/toc-button-visible.png' });

    // 目次ボタンをクリック（force: trueでbodyのインターセプトを回避）
    await tocButton.click({ force: true });

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

    // 「ページトップへ」ボタンをクリック（force: trueでインターセプトを回避）
    await pageTopButton.click({ force: true });

    // スムーズスクロールの完了を待つ（scrollY値が安定するまで）
    await page.waitForFunction(
      () => {
        return window.scrollY < 50;
      },
      { timeout: 3000 }
    );

    // トップにスクロールしたことを確認
    const scrollYAfter = await page.evaluate(() => window.scrollY);
    expect(scrollYAfter).toBeLessThan(50); // ほぼトップにスクロールしていることを確認

    // スクリーンショットを撮影（トップにスクロールした状態）
    await page.screenshot({ path: 'screenshots/page-scrolled-to-top.png' });
  });
});
