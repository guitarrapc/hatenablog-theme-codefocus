import { chromium } from '@playwright/test';

(async () => {
  try {
    console.log('追加スクリーンショット取得スクリプト開始');

    // ブラウザを起動
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // PC解像度（Surface Pro 7: 912x1368）を設定
    await page.setViewportSize({ width: 912, height: 1368 });

    // retry機能を自前で実装
    const retryAction = async (action, maxRetries = 3, delay = 1000) => {
      let lastError;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await action();
        } catch (error) {
          lastError = error;
          console.log(`Attempt ${attempt} failed, retrying after ${delay}ms...`);
          await page.waitForTimeout(delay);
          // 次の試行で遅延を2倍に
          delay *= 2;
        }
      }
      throw lastError;
    };

    // 1. フローティング目次のスクリーンショット
    console.log('フローティング目次のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // スクロールして目次ボタンを表示させる
    await retryAction(async () => {
      // より確実にスクロールして目次ボタンを表示させる
      await page.evaluate(() => {
        // 画面の少し下までスクロール（目次ボタンが表示される位置まで）
        window.scrollBy(0, 300);
      });
      await page.waitForTimeout(2000);

      // 目次ボタンが表示されているか確認
      const isVisible = await page.locator('.toc-button').isVisible();
      if (!isVisible) {
        throw new Error('目次ボタンがまだ表示されていません');
      }
    });

    // 目次ボタンを見つけてクリック
    const tocButton = await page.locator('.toc-button');
    if (await tocButton.isVisible()) {
      // クリック前のボタンのスクリーンショット（すでに取得済み）
      await tocButton.screenshot({ path: 'articles/screenshots/pc-toc-button.png' });
      console.log('目次ボタンのスクリーンショットを撮影しました');

      // 目次ボタンをクリックするときに発生する可能性のあるエラーを回避
      try {
        // 直接DOMを操作してクリックイベントを発火させる（iframeの影響を避ける）
        await page.evaluate(() => {
          // クリックイベントを手動で作成して発火
          const button = document.querySelector('.toc-button');
          if (button) {
            const event = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            button.dispatchEvent(event);
          }
        });
        console.log('目次ボタンをクリックしました');

        // フローティング目次が表示されるまで十分待機（長めに設定）
        await page.waitForTimeout(2000);

        // フローティング目次を探す
        const floatingToc = await page.locator('.floating-toc');

        // 表示されるまで少し待つ
        await retryAction(async () => {
          const isVisible = await floatingToc.isVisible();
          if (!isVisible) {
            throw new Error('フローティング目次がまだ表示されていません');
          }
          return true;
        }, 3, 500);

        if (await floatingToc.isVisible()) {
          await floatingToc.screenshot({ path: 'articles/screenshots/pc-floating-toc.png' });
          console.log('フローティング目次のスクリーンショットを撮影しました');
        } else {
          console.log('フローティング目次が表示されませんでした');
        }
      } catch (error) {
        console.error('目次ボタンのクリック中にエラーが発生しました:', error);
      }
    } else {
      console.log('目次ボタンが見つかりませんでした');
    }

    // 2. カテゴリー表示のスクリーンショット
    console.log('カテゴリー表示のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    const categorySection = await page.locator('.entry-categories');
    if (await categorySection.isVisible()) {
      await categorySection.screenshot({ path: 'articles/screenshots/pc-category-container.png' });
      console.log('カテゴリーセクションのスクリーンショットを撮影しました');

      // 個別のカテゴリー要素
      const categoryLinks = await page.locator('.entry-category-link').all();
      if (categoryLinks.length > 0) {
        await categoryLinks[0].screenshot({ path: 'articles/screenshots/pc-category-item.png' });
        console.log('カテゴリーアイテムのスクリーンショットを撮影しました');

        // ホバー時のスクリーンショット
        await categoryLinks[0].hover();
        await page.waitForTimeout(300); // ホバーエフェクトを待つ
        await categoryLinks[0].screenshot({ path: 'articles/screenshots/pc-category-item-hover.png' });
        console.log('カテゴリーホバーのスクリーンショットを撮影しました');
      }
    } else {
      console.log('カテゴリーセクションが見つかりませんでした');
    }

    // 3. コメントセクションのスクリーンショット
    console.log('コメントセクションのスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    const commentSection = await page.locator('.comment-box');
    if (await commentSection.isVisible()) {
      await commentSection.screenshot({ path: 'articles/screenshots/pc-comment-section.png' });
      console.log('コメントセクションのスクリーンショットを撮影しました');
    } else {
      console.log('コメントセクションが見つかりませんでした');
    }

    // 4. アーカイブ表示のスクリーンショット
    console.log('アーカイブ表示のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/archive/author/guitarrapc_tech');
    await page.waitForLoadState('networkidle');

    const archiveEntries = await page.locator('.archive-entries');
    if (await archiveEntries.isVisible()) {
      await archiveEntries.screenshot({ path: 'articles/screenshots/pc-archive-grid.png' });
      console.log('アーカイブ表示のスクリーンショットを撮影しました');
    } else {
      console.log('アーカイブ表示が見つかりませんでした');
    }

    // 5. 関連記事表示のスクリーンショット
    console.log('関連記事表示のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // 記事フッターまでスクロール
    await page.evaluate(() => {
      const footer = document.querySelector('.entry-footer');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    await page.waitForTimeout(1000);

    // より具体的なセレクタを使用
    const relatedEntries = await page.locator('.entry-footer .customized-footer .hatena-module-related-entries').first();
    if (await relatedEntries.isVisible()) {
      await relatedEntries.screenshot({ path: 'articles/screenshots/pc-related-entries.png' });
      console.log('関連記事表示のスクリーンショットを撮影しました');
    } else {
      console.log('関連記事表示が見つかりませんでした');
    }

    // ブラウザを閉じる
    await browser.close();
    console.log('追加スクリーンショット取得スクリプト完了');
  } catch (error) {
    console.error('スクリプト実行中にエラーが発生しました:', error);
  }
})();
