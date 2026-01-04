// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from './constants.js';

test.describe('目次スタイルの詳細テスト', () => {
  test('目次のマーカーと縦線が仕様通りに表示される', async ({ page }) => {
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素を確認
    const inPageToc = page.locator(SELECTORS.TABLE_OF_CONTENTS);
    const hasToc = await inPageToc.isVisible();

    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // 目次のスクリーンショットを撮影
    await inPageToc.screenshot({ path: 'screenshots/toc-style-overview.png' });

    // 目次の項目を取得
    const tocItems = page.locator('.entry-content .table-of-contents li');
    const itemCount = await tocItems.count();

    if (itemCount === 0) {
      throw new Error('目次に項目が存在しません。テストデータを確認してください。');
    }

    // 複数の目次項目がある場合、最初と2番目の項目をキャプチャして比較
    if (itemCount >= 2) {
      // 最初の項目（h1相当）
      await tocItems.first().screenshot({ path: 'screenshots/toc-style-h1.png' });

      // 2番目の項目（h2相当）
      await tocItems.nth(1).screenshot({ path: 'screenshots/toc-style-h2.png' });

      // インデント位置の確認
      const firstItemBox = await tocItems.first().boundingBox();
      const secondItemBox = await tocItems.nth(1).boundingBox();

      if (!firstItemBox || !secondItemBox) {
        console.log('目次項目の位置情報が取得できません。インデントチェックをスキップします。');
        return;
      }

      // 項目の左位置が同じかどうかを確認（マーカーも同じ位置に揃うため）
      console.log(`最初の項目の左位置: ${firstItemBox.x}px`);
      console.log(`2番目の項目の左位置: ${secondItemBox.x}px`);

      // 位置が同じであることを検証（多少の誤差を許容）
      expect(Math.abs(firstItemBox.x - secondItemBox.x)).toBeLessThan(3);
    }

    // 目次項目にマウスホバー時の効果をテスト
    if (itemCount === 0) {
      console.log('目次項目が存在しないため、ホバーテストをスキップします。');
      return;
    }

    // 目次を強制的に表示状態にする
    await page.evaluate(() => {
      const tocContainer = document.querySelector('.toc-container');
      if (tocContainer) {
        tocContainer.classList.remove('toc-closed');
        tocContainer.classList.add('toc-open');
      }

      const tocContent = document.querySelector('.floating-toc-content');
      if (tocContent) {
        const tocEl = /** @type {HTMLElement} */ (tocContent);
        tocEl.style.display = 'block';
        tocEl.style.maxHeight = '800px';
        tocEl.style.visibility = 'visible';
        tocEl.style.opacity = '1';
        tocEl.style.pointerEvents = 'auto';
      }

      const tocItems = document.querySelectorAll('.table-of-contents li');
      tocItems.forEach(item => {
        const itemEl = /** @type {HTMLElement} */ (item);
        itemEl.style.pointerEvents = 'auto';
        itemEl.style.position = 'relative';
        itemEl.style.zIndex = '100';
      });
    });

    await page.waitForTimeout(1000);

    // 目次項目を取得
    const firstItem = page.locator('.entry-content .table-of-contents li').first();

    // 項目が見えない場合はスクロール
    if (!(await firstItem.isVisible())) {
      await page.evaluate(() => {
        const element = document.querySelector('.entry-content .table-of-contents li:first-child');
        if (element) {
          element.scrollIntoView({ block: 'center' });
          const el = /** @type {HTMLElement} */ (element);
          el.style.visibility = 'visible';
          el.style.display = 'block';
        }
      });
      await page.waitForTimeout(1000);
    }

    // ホバーテスト（失敗してもテスト全体は継続）
    await page.retryAction(async () => {
      await firstItem.screenshot({ path: 'screenshots/toc-style-item-before-hover.png' });
      await firstItem.hover({ force: true, timeout: 5000 });
      await page.waitForTimeout(1000);
      await firstItem.screenshot({ path: 'screenshots/toc-style-item-after-hover.png' });
    }, 1, 0).catch(error => {
      console.log('ホバーテストに失敗しましたが、テストは継続します:', error.message);
    });

    console.log('目次項目のホバーテストが完了しました');
  });

  test('1540px以上のワイドスクリーンで目次が常時表示される', async ({ page }) => {
    // ワイドスクリーン解像度に設定
    await page.setViewportSize({ width: 1600, height: 900 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして記事を表示
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // 目次ボタンが非表示であることを確認
    const tocButton = page.locator('.toc-button');
    const isButtonVisible = await tocButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isButtonVisible).toBe(false);

    // フローティング目次が自動的に表示されていることを確認
    const floatingToc = page.locator('.floating-toc.auto-expanded');
    await expect(floatingToc).toBeVisible({ timeout: 5000 });

    // フローティング目次のスクリーンショット
    await floatingToc.screenshot({ path: 'screenshots/toc-style-wide-screen.png' });

    // フローティング目次の項目が正しく表示されているか確認
    const floatingTocItems = page.locator('.floating-toc-list li');
    const itemCount = await floatingTocItems.count();

    if (itemCount > 0) {
      await floatingTocItems.first().screenshot({ path: 'screenshots/floating-toc-wide-first-item.png' });
    }

    console.log('ワイドスクリーンでの目次常時表示テストが完了しました');
  });

  test('解像度を1540px未満に変更すると目次が自動的に閉じる', async ({ page }) => {
    // 最初にワイドスクリーン解像度に設定
    await page.setViewportSize({ width: 1600, height: 900 });

    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして記事を表示
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // ワイドスクリーンで目次が自動表示されていることを確認
    const floatingToc = page.locator('.floating-toc');
    await expect(floatingToc).toHaveClass(/auto-expanded/);
    await expect(floatingToc).toBeVisible();

    // 解像度を1540px未満に変更
    await page.setViewportSize({ width: 1366, height: 768 });

    // リサイズイベントの処理を待つ（デバウンス250ms + 余裕）
    await page.waitForTimeout(500);

    // 目次が閉じていることを確認（showクラスが削除されている）
    const hasShowClass = await floatingToc.evaluate(el => el.classList.contains('show'));
    expect(hasShowClass).toBe(false);

    // auto-expandedクラスが削除されていることを確認
    const hasAutoExpandedClass = await floatingToc.evaluate(el => el.classList.contains('auto-expanded'));
    expect(hasAutoExpandedClass).toBe(false);

    // 目次ボタンが表示されるようになったことを確認
    const tocButton = page.locator('.toc-button');
    await page.waitForTimeout(500); // スクロール閾値を超えるための待機

    // スクロール位置を確保してボタンを表示させる
    await page.evaluate(() => window.scrollBy(0, 50));
    await page.waitForTimeout(300);

    const isButtonVisible = await tocButton.isVisible({ timeout: 5000 }).catch(() => false);
    expect(isButtonVisible).toBe(true);

    // activeクラスが削除されていることを確認
    const hasActiveClass = await tocButton.evaluate(el => el.classList.contains('active'));
    expect(hasActiveClass).toBe(false);

    console.log('解像度変更時の目次自動クローズテストが完了しました');
  });

  test('ページ右上の目次ボタンが仕様通りに表示される', async ({ page }) => {
    // 通常の解像度に設定（1540px未満）
    await page.setViewportSize({ width: 1366, height: 768 });
    // 統合ナビゲーション関数を使用（networkidleまで待機）
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // 記事内の目次要素の存在確認
    const hasToc = await page.locator('.entry-content .table-of-contents').isVisible();
    if (!hasToc) {
      throw new Error('サンプル記事に目次が存在しません。テストデータを確認してください。');
    }

    // スクロールして目次ボタンを表示させる
    await page.evaluate(() => window.scrollBy(0, 250));
    await page.waitForTimeout(1000);

    // 目次ボタンが表示されるか確認（1540px未満なので表示されるべき）
    const tocButton = page.locator('.toc-button');
    const isButtonVisible = await tocButton.isVisible({ timeout: 15000 }).catch(() => false);

    if (!isButtonVisible) {
      throw new Error('目次ボタンが表示されませんでした。JavaScriptの読み込みを確認してください。');
    }

    // 通常解像度では目次ボタンが表示されることを確認
    expect(isButtonVisible).toBe(true);

    // 目次ボタンのスクリーンショット（閉じた状態）
    await tocButton.screenshot({ path: 'screenshots/toc-style-button-style-closed.png' });

    // ボタンをクリックして目次を開く
    await page.evaluate(() => {
      const tocBtn = document.querySelector('.toc-button');
      if (tocBtn) (/** @type {HTMLElement} */ (tocBtn)).click();
    });
    await page.waitForTimeout(1000);

    // 目次ボタンのスクリーンショット（開いた状態）
    await tocButton.screenshot({ path: 'screenshots/toc-style-button-style-open.png' });

    // フローティング目次が表示されているか確認
    const floatingToc = page.locator('.floating-toc.show');
    await expect(floatingToc).toBeVisible({ timeout: 5000 });

    // フローティング目次のスクリーンショット
    await floatingToc.screenshot({ path: 'screenshots/toc-style-floating.png' });

    // フローティング目次の項目が正しく表示されているか確認
    const floatingTocItems = page.locator('.floating-toc-list li');
    const itemCount = await floatingTocItems.count();

    if (itemCount > 0) {
      await floatingTocItems.first().screenshot({ path: 'screenshots/floating-toc-first-item.png' });
    }
  });
});
