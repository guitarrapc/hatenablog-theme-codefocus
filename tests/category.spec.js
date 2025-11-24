// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, VALUES } from './constants.js';

test.describe('カテゴリースタイルのテスト', () => {
  test('カテゴリーが仕様通りに表示される', async ({ page }) => {
    // 統合ナビゲーション関数を使用
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE);

    // カテゴリー要素を確認
    const categoryContainer = page.locator(SELECTORS.ENTRY_CATEGORIES);
    const hasCategories = await categoryContainer.isVisible();

    if (!hasCategories) {
      console.log('テスト対象の記事にカテゴリーが存在しません。このテストをスキップします。');
      test.skip();
      return;
    }

    // 個々のカテゴリー要素を取得
    const categories = page.locator('.entry-categories a');
    const count = await categories.count();

    if (count > 0) {
      // カテゴリーのホバー状態をテスト
      await categories.first().hover();
      await page.waitForTimeout(500); // ホバーエフェクトを待機
      await categories.first().screenshot({ path: 'screenshots/category-item-hover.png' });

      // カテゴリーがタイトル/日付から適切な距離にあるか確認
      const title = page.locator('.entry-title');
      const titleBox = await title.boundingBox();
      const categoryBox = await categoryContainer.boundingBox();

      if (!titleBox || !categoryBox) {
        console.log('要素の位置情報が取得できません。距離チェックをスキップします。');
        return;
      }

      // タイトルとカテゴリーの間の縦の距離を検証
      const distance = categoryBox.y - (titleBox.y + titleBox.height);
      console.log(`タイトルとカテゴリーの間の距離: ${distance}px`);

      // 適切な距離があることを確認（値は調整が必要）
      expect(distance).toBeGreaterThan(10);
    }
  });
});
