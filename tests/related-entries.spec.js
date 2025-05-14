import { test } from './helpers.js';
import { expect } from '@playwright/test';

// 関連記事のスクリーンショット撮影テスト
test('関連記事のスタイルを確認する', async ({ page }) => {
  // リトライを含めたページナビゲーション
  await page.retryAction(async () => {
    await page.goto('/entry/2025/05/10/204601'); // 記事ページに移動
  });

  // 関連記事セクション全体を取得 - first()を使用して最初の要素のみを選択
  const relatedEntriesModule = await page.locator('.hatena-module.hatena-module-related-entries').first();

  // 関連記事セクションをスクリーンショット
  await relatedEntriesModule.screenshot({ path: 'screenshots/related-entries.png' });

  // 関連記事の個別アイテムをスクリーンショット
  const relatedEntryItem = await page.locator('.related-entries-item').first();
  await relatedEntryItem.screenshot({ path: 'screenshots/related-entry-item.png' });  // HTML構造を確認
  const html = await page.evaluate(() => {
    const element = document.querySelector('.related-entries-item');
    return element ? element.outerHTML : 'Not found';
  });
  
  // ファイルに書き出す
  const fs = await import('fs/promises');
  await fs.writeFile('screenshots/related-entries-html.txt', html);
  
  console.log('関連記事のHTML構造:');
  console.log(html);
});
