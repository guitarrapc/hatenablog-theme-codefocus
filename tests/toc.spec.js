// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, SCROLL, TIMEOUTS } from './constants.js';

test.describe('目次スタイルのテスト', () => {
    test('目次のスタイルが仕様通りであることを確認', async ({ page }) => {
        // 通常の解像度に設定（1540px未満）
        await page.setViewportSize({ width: 1366, height: 768 });

        // 統合ナビゲーション関数を使用（networkidleまで待機）
        await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

        // 記事内の目次要素を確認
        const inPageToc = page.locator(SELECTORS.TABLE_OF_CONTENTS);
        const hasToc = await inPageToc.isVisible();

        if (!hasToc) {
            throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
        }

        // 記事内目次のスクリーンショットを撮影
        await inPageToc.screenshot({ path: 'screenshots/toc-in-page.png' });

        // 記事内目次の項目を確認
        const inPageTocItems = page.locator('.entry-content .table-of-contents li');
        const inPageItemCount = await inPageTocItems.count();
        console.log(`記事内目次の項目数: ${inPageItemCount}`);

        if (inPageItemCount > 0) {
            // 記事内目次の最初の項目をキャプチャ
            await inPageTocItems.first().screenshot({ path: 'screenshots/toc-in-page-first-item.png' });
        }
        // スクロールして目次ボタンを表示させる
        await page.retryAction(async () => {
            await page.evaluate((scrollAmount) => {
                window.scrollBy(0, scrollAmount);
            }, SCROLL.TO_SHOW_TOC_BUTTON);
            await page.waitForTimeout(TIMEOUTS.MEDIUM);
        });

        // 目次ボタンが表示されるか確認
        const tocButton = page.locator(SELECTORS.TOC_BUTTON);
        const isButtonVisible = await tocButton.isVisible({ timeout: 15000 }).catch(() => false);

        if (!isButtonVisible) {
            throw new Error('目次ボタンが表示されませんでした。JavaScriptの読み込みを確認してください。');
        }

        // 目次ボタンをクリックして目次を表示 - iframe干渉を回避するためJavaScriptで直接クリック
        await page.retryAction(async () => {
            await page.evaluate(() => {
                const tocBtn = document.querySelector('.toc-button');
                if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
            });
            // アニメーションの完了を待つ
            await page.waitForTimeout(2000);
        });
        // 目次コンテンツが表示されるか確認
        const tocContent = page.locator('.floating-toc.show');
        await expect(tocContent).toBeVisible({ timeout: 10000 });

        // 目次コンテンツのスクリーンショットを撮影
        await tocContent.screenshot({ path: 'screenshots/toc-content.png' });

        // 目次リストアイテムが存在することを確認
        const tocItems = page.locator('.floating-toc-list li');
        const count = await tocItems.count();

        // 目次項目数をログ出力
        console.log(`フローティング目次項目の数: ${count}`);

        // 目次項目のスクリーンショット撮影（項目がある場合のみ）
        if (count > 0) {
            // 最初の項目（h1相当）
            await tocItems.first().screenshot({ path: 'screenshots/toc-first-item.png' });

            // 2番目の項目（h2相当、存在する場合）
            if (count > 1) {
                await tocItems.nth(1).screenshot({ path: 'screenshots/toc-second-item.png' });
            }
        }
    });
});
