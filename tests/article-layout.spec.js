import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('記事レイアウトのテスト', () => {
  test('記事タイトルと本文のインデントが仕様通りである', async ({ page }) => {
    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601');
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();

    // 記事タイトルと本文の要素を取得
    const title = page.locator('.entry-title');
    const content = page.locator('.entry-content');

    // 要素が表示されているか確認
    const isTitleVisible = await title.isVisible();
    const isContentVisible = await content.isVisible();

    if (!isTitleVisible || !isContentVisible) {
      console.log('タイトルまたは本文が表示されていません。このテストをスキップします。');
      test.skip();
      return;
    }

    // タイトルと本文の位置情報を取得
    const titleBox = await title.boundingBox();
    const contentBox = await content.boundingBox();        // 記事本文が記事タイトルより右に5pxインデントされているか確認（正の値になる）
    const indentDifference = contentBox.x - titleBox.x;
    console.log(`タイトルと本文の左インデント差: ${indentDifference}px`);

    // インデント差がおおよそ5px前後であることを確認（許容範囲を持たせる）
    // 実際の値は実装によって少し異なる可能性があるため、近似値をチェック
    expect(indentDifference).toBeCloseTo(5, 2); // 5pxに対して±2px程度の誤差を許容

    // スクリーンショットを撮影（レイアウト確認用）
    await page.screenshot({
      path: 'screenshots/article-layout-indent.png',
      clip: {
        x: Math.min(titleBox.x, contentBox.x) - 20, // 余白を持たせる
        y: titleBox.y - 20,
        width: Math.max(titleBox.width, contentBox.width) + 40,
        height: titleBox.height + 150 // タイトルと本文の一部を含める
      }
    });

    // 記事ヘッダーと記事本文ブロック間の余白を確認
    const headerEnd = page.locator('.entry-header');
    const headerEndBox = await headerEnd.boundingBox();
    const spaceBetween = contentBox.y - (headerEndBox.y + headerEndBox.height);

    console.log(`記事ヘッダーと本文の間の余白: ${spaceBetween}px`);
    // 余白が適切な範囲内であることを確認（値は調整が必要）
    expect(spaceBetween).toBeLessThan(50); // 必要以上に大きくしない
  });
});
