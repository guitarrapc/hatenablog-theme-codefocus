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

    // 1. フローティング目次のスクリーンショット
    console.log('フローティング目次のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // スクロールして目次ボタンを表示させる
    await page.retryAction(async () => {
      await page.evaluate(() => {
        window.scrollBy(0, 250);
      });
      await page.waitForTimeout(2000);
    });

    // 目次ボタンを見つけてクリック
    const tocButton = await page.locator('.toc-button');
    if (await tocButton.isVisible()) {
      // クリック前のボタンのスクリーンショット（すでに取得済み）
      // await tocButton.screenshot({ path: 'articles/screenshots/pc-toc-button.png' });

      // 目次ボタンをクリックするときに発生する可能性のあるエラーを回避
      try {
        await page.evaluate(() => {
          // JavaScriptでクリックイベントを発火させる
          document.querySelector('.toc-button').click();
        });
        console.log('目次ボタンをクリックしました');

        // フローティング目次が表示されるまで少し待機
        await page.waitForTimeout(500);

        const floatingToc = await page.locator('.floating-toc');
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

    const relatedEntries = await page.locator('.hatena-module-related-entries');
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
