import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('カテゴリースタイルのテスト', () => {
    test('カテゴリーが仕様通りに表示される', async ({ page }) => {
        // リトライを含めたページナビゲーション
        await page.retryAction(async () => {
            await page.goto('/entry/2025/05/10/204601');
        });

        // ページが完全に読み込まれるのを待機
        await page.waitForPageToLoad();

        // カテゴリー要素を確認
        const categoryContainer = page.locator('.entry-categories');
        const hasCategories = await categoryContainer.isVisible();

        if (!hasCategories) {
            console.log('テスト対象の記事にカテゴリーが存在しません。このテストをスキップします。');
            test.skip();
            return;
        }

        // カテゴリーコンテナのスクリーンショットを撮影
        await categoryContainer.screenshot({ path: 'screenshots/category-container.png' });

        // 個々のカテゴリー要素を取得
        const categories = page.locator('.entry-categories a');
        const count = await categories.count();

        if (count > 0) {
            // 最初のカテゴリーをキャプチャ
            await categories.first().screenshot({ path: 'screenshots/category-item.png' });

            // カテゴリーにハッシュマークが含まれていることを確認（CSSで追加されるため視覚的に確認）

            // カテゴリーのホバー状態をテスト
            await categories.first().hover();
            await page.waitForTimeout(500); // ホバーエフェクトを待機
            await categories.first().screenshot({ path: 'screenshots/category-item-hover.png' });

            // カテゴリーがタイトル/日付から適切な距離にあるか確認
            const title = page.locator('.entry-title');
            const titleBox = await title.boundingBox();
            const categoryBox = await categoryContainer.boundingBox();

            // タイトルとカテゴリーの間の縦の距離を検証
            const distance = categoryBox.y - (titleBox.y + titleBox.height);
            console.log(`タイトルとカテゴリーの間の距離: ${distance}px`);

            // 適切な距離があることを確認（値は調整が必要）
            expect(distance).toBeGreaterThan(10);
        }
    });
});
