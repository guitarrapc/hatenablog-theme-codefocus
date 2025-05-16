import { chromium } from '@playwright/test';

(async () => {
  try {
    console.log('目次スクリーンショット取得スクリプト開始');

    // ブラウザを起動
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // PC解像度（Surface Pro 7: 912x1368）を設定
    await page.setViewportSize({ width: 912, height: 1368 });

    // テストブログの記事ページにアクセス
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');
    console.log('ページロード完了');

    // 目次が存在するか確認
    const tocExists = await page.locator('ul.table-of-contents').isVisible();

    if (tocExists) {
      console.log('目次が存在します');

      // 目次が閉じている場合は開く
      const tocContainerClosed = await page.evaluate(() => {
        const tocContainer = document.querySelector('.toc-container');
        return tocContainer && tocContainer.classList.contains('toc-closed');
      });

      if (tocContainerClosed) {
        console.log('目次が閉じています。開きます...');
        // 目次のトグルをクリックして開く（正しいクラス名は toc-title）
        await page.evaluate(() => {
          const tocTitle = document.querySelector('.toc-title');
          if (tocTitle) tocTitle.click();
        });
        // アニメーション待機
        await page.waitForTimeout(1000);

        // 目次が実際に開いたか確認
        const tocIsOpen = await page.evaluate(() => {
          const tocContainer = document.querySelector('.toc-container');
          return tocContainer && tocContainer.classList.contains('toc-open');
        });

        if (tocIsOpen) {
          console.log('目次が正常に開きました');
        } else {
          console.log('警告: 目次が開いていない可能性があります');
          // 再度開く試み
          await page.evaluate(() => {
            const tocTitle = document.querySelector('.toc-title');
            if (tocTitle) tocTitle.click();
          });
          await page.waitForTimeout(1000);
        }
      } else {
        console.log('目次はすでに開いています');
      }

      // 目次が表示されていることを再確認
      const tocContentVisible = await page.evaluate(() => {
        const tocContent = document.querySelector('.toc-content');
        if (tocContent) {
          return window.getComputedStyle(tocContent).display !== 'none';
        }
        return false;
      });

      if (tocContentVisible) {
        console.log('目次コンテンツが表示されています');

        // 目次コンテナ全体（タイトルを含む）の位置とサイズを取得
        const tocContainerBox = await page.locator('.toc-container').boundingBox();
        console.log(`目次コンテナの位置: x=${tocContainerBox.x}, y=${tocContainerBox.y}, width=${tocContainerBox.width}, height=${tocContainerBox.height}`);

        // 記事内目次のスクリーンショット（タイトルを含む全体）
        await page.locator('.toc-container').screenshot({
          path: 'articles/screenshots/pc-toc.png',
          timeout: 5000
        });
        console.log('記事内目次（全体）のスクリーンショットを保存しました');
      } else {
        console.log('目次コンテンツが表示されていません');
      }
    } else {
      console.log('目次が見つかりませんでした');
    }

    // ブラウザを閉じる
    await browser.close();
    console.log('スクリプト終了');

  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
})();
