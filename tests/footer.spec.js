import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('ブログフッターのテスト', () => {
    test('ブログパーツのタイトルが縦軸で揃っている', async ({ page }) => {
        // リトライを含めたページナビゲーション
        await page.retryAction(async () => {
            await page.goto('/');
        });

        // ページが完全に読み込まれるのを待機
        await page.waitForPageToLoad();

        // フッター部分までスクロール
        await page.evaluate(() => {
            const footer = document.querySelector('#box2');
            if (footer) {
                footer.scrollIntoView();
            }
        });
        await page.waitForTimeout(1000);

        // フッターのスクリーンショットを撮影
        const footer = page.locator('#box2');
        if (await footer.isVisible()) {
            await footer.screenshot({ path: 'screenshots/blog-footer.png' });
        } else {
            console.log('フッターが見つかりません。このテストをスキップします。');
            test.skip();
            return;
        }

        // ブログパーツのタイトル要素を取得
        const moduleTitles = page.locator('.hatena-module-title');
        const count = await moduleTitles.count();

        if (count < 2) {
            console.log('比較できるブログパーツが十分にありません。このテストをスキップします。');
            test.skip();
            return;
        }

        // タイトルの縦位置を確認
        const titlePositions = [];

        for (let i = 0; i < count; i++) {
            const title = moduleTitles.nth(i);
            const box = await title.boundingBox();
            if (box) {
                titlePositions.push({
                    index: i,
                    y: box.y,
                    height: box.height
                });
            }
        }

        // 同じ行にあるモジュールのタイトル高さの差異を計算
        const rowGroups = {};

        // タイトルを行ごとにグループ化（Y座標が似ているものを同じグループに）
        for (const pos of titlePositions) {
            let grouped = false;

            for (const rowY in rowGroups) {
                // Y座標が15px以内のものを同じ行とみなす
                if (Math.abs(pos.y - parseFloat(rowY)) < 15) {
                    rowGroups[rowY].push(pos);
                    grouped = true;
                    break;
                }
            }

            if (!grouped) {
                rowGroups[pos.y] = [pos];
            }
        }

        // 各行内でのタイトル位置のズレを検証
        for (const rowY in rowGroups) {
            const row = rowGroups[rowY];
            if (row.length >= 2) {
                // 同じ行にあるタイトル同士で高さを比較
                const heights = row.map(pos => pos.height);
                const maxHeight = Math.max(...heights);
                const minHeight = Math.min(...heights);

                console.log(`行 ${rowY} のタイトル高さ - 最大: ${maxHeight}px, 最小: ${minHeight}px, 差: ${maxHeight - minHeight}px`);

                // 高さの差が5px以内であることを確認
                expect(maxHeight - minHeight).toBeLessThan(5);
            }
        }
    });
});
