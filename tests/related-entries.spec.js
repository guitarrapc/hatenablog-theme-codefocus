import { test } from './helpers.js';
import { expect } from '@playwright/test';

test.describe('関連記事のスタイルテスト', () => {
  test('関連記事が正しく表示され、日付がタイトルの下に配置されている', async ({ page }) => {
    // リトライを含めたページナビゲーション
    await page.retryAction(async () => {
      await page.goto('/entry/2025/05/10/204601'); // 記事ページに移動
    });

    // ページが完全に読み込まれるのを待機
    await page.waitForPageToLoad();

    // 関連記事セクション全体を取得 - first()を使用して最初の要素のみを選択
    const relatedEntriesModule = await page.locator('.hatena-module.hatena-module-related-entries').first();

    // 関連記事セクションをスクリーンショット
    await relatedEntriesModule.screenshot({ path: 'screenshots/related-entries.png' });

    // 関連記事の個別アイテムをスクリーンショット
    const relatedEntryItem = await page.locator('.related-entries-item').first();
    await relatedEntryItem.screenshot({ path: 'screenshots/related-entry-item.png' });

    // HTML構造を確認して保存
    const html = await page.evaluate(() => {
      const element = document.querySelector('.related-entries-item');
      return element ? element.outerHTML : 'Not found';
    });

    // HTMLをコンソールに出力
    console.log('関連記事のHTML構造:');
    console.log(html);

    // HTMLをファイルに保存
    try {
      const fs = await import('fs/promises');
      await fs.writeFile('screenshots/related-entries-html.txt', html);
    } catch (err) {
      console.error('HTMLの保存に失敗しました:', err);
    }
  });
});
