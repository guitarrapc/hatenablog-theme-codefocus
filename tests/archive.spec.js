// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, VALUES } from './constants.js';

test.describe('アーカイブページのテスト', () => {
  test('アーカイブページが正しくレンダリングされる', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.ARCHIVE, { waitFor: 'networkidle' });

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/archive-page.png', fullPage: true });

    // 基本的なページ要素が存在することを確認
    await expect(page.locator('.page-archive')).toBeVisible();
    await expect(page.locator('.archive-entries')).toBeVisible();
  });

  test('アーカイブページのグリッドレイアウトが正しく表示される', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.ARCHIVE, { waitFor: 'networkidle' });

    // アーカイブエントリーのグリッドコンテナを確認
    const archiveEntries = page.locator(SELECTORS.ARCHIVE_ENTRIES);
    await expect(archiveEntries).toBeVisible();

    // スクリーンショットを撮影
    await archiveEntries.screenshot({ path: 'screenshots/archive-grid.png' });

    // 個別のアーカイブエントリーを確認
    const entries = page.locator(SELECTORS.ARCHIVE_ENTRY);
    const count = await entries.count();

    if (count > 0) {
      // 最初のエントリーをキャプチャ
      await entries.first().screenshot({ path: 'screenshots/archive-first-entry.png' });

      // グリッドレイアウトが適用されているか確認
      const computedStyle = await page.evaluate(() => {
        const container = document.querySelector('.archive-entries');
        if (!container) return {};

        const style = window.getComputedStyle(container);
        return {
          display: style.display,
          gridTemplateColumns: style.gridTemplateColumns
        };
      });

      console.log('アーカイブエントリーのコンピュートスタイル:', computedStyle);

      // グリッドレイアウトが適用されていることを確認（デスクトップ表示）
      expect(computedStyle.display).toBe('grid');
    } else {
      console.log('アーカイブエントリーが存在しません');
      test.skip();
    }
  });

  test('アーカイブエントリーの要素が仕様通りに配置されている', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo('/archive/author/guitarrapc_tech', { waitFor: 'networkidle' });

    // 個別のエントリーを取得
    const entries = page.locator('.archive-entry');
    const count = await entries.count();

    if (count === 0) {
      console.log('テスト対象のアーカイブエントリーがありません。このテストをスキップします。');
      test.skip();
      return;
    }

    // 最初のエントリーの要素構造を確認
    const firstEntry = entries.first();

    // サムネイル、タイトル、日付、カテゴリーが存在することを確認
    await expect(firstEntry.locator('.entry-thumb-link')).toBeVisible();
    await expect(firstEntry.locator('.archive-entry-header')).toBeVisible();
    await expect(firstEntry.locator('.entry-title')).toBeVisible();    // カテゴリーの存在を確認
    const categories = firstEntry.locator('.categories');
    const isVisible = await categories.isVisible();

    if (isVisible) {
      // カテゴリーの位置が絶対配置されているか確認
      const categoryStyle = await page.evaluate(() => {
        const catElement = document.querySelector('.archive-entry .categories');
        if (!catElement) return {};

        const style = window.getComputedStyle(catElement);
        return {
          position: style.position,
          zIndex: style.zIndex
        };
      });

      console.log('カテゴリー要素のスタイル:', categoryStyle);
      expect(categoryStyle.position).toBe('static');

      // カテゴリーをキャプチャ
      await categories.screenshot({ path: 'screenshots/archive-category.png' });
    }
  });

  test('アーカイブページのレスポンシブデザインが機能している', async ({ page }) => {
    // スマートフォンサイズに設定
    await page.setViewportSize({ width: 414, height: 896 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo('/archive/author/guitarrapc_tech', { waitFor: 'networkidle' });

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/archive-responsive-mobile.png', fullPage: true });

    // アーカイブエントリーのグリッドレイアウトがモバイル表示に切り替わっていることを確認
    const computedStyle = await page.evaluate(() => {
      const container = document.querySelector('.archive-entries');
      if (!container) return {};

      const style = window.getComputedStyle(container);
      return {
        display: style.display,
        gridTemplateColumns: style.gridTemplateColumns
      };
    });

    console.log('モバイル表示時のアーカイブエントリーのコンピュートスタイル:', computedStyle);

    // モバイル表示でのグリッドレイアウト設定を確認
    expect(computedStyle.display).toBe('grid');    // エントリーがフレックスボックスの向きを確認（モバイルでは横並び）
    const firstEntryStyle = await page.evaluate(() => {
      const entry = document.querySelector('.archive-entry');
      if (!entry) return {};

      const style = window.getComputedStyle(entry);
      return {
        flexDirection: style.flexDirection
      };
    });

    console.log('モバイル表示時のアーカイブエントリーの方向:', firstEntryStyle);
    expect(firstEntryStyle.flexDirection).toBe('row');
  });
});
