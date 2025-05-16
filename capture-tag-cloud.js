import { chromium } from '@playwright/test';

(async () => {
  try {
    console.log('サイドバータグクラウドのスクリーンショット取得スクリプト開始');

    // ブラウザを起動
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      viewport: { width: 912, height: 1368 } // Surface Pro 7サイズ
    });
    const page = await context.newPage();

    // トップページに移動
    console.log('トップページに移動しています...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/');
    await page.waitForLoadState('networkidle');

    console.log('サイドバーのカテゴリーモジュールを探しています...');

    // フッターセクションまでスクロール
    await page.evaluate(() => {
      const footer = document.getElementById('box2');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    await page.waitForTimeout(1000);

    // サイドバーのカテゴリーモジュールを取得
    const categoryModule = page.locator('#box2 .hatena-module-category');

    if (await categoryModule.isVisible()) {
      console.log('カテゴリーモジュールを見つけました');

      // スクリーンショットを撮影
      await categoryModule.screenshot({
        path: 'd:/github/guitarrapc/hatenablog-theme/articles/screenshots/pc-sidebar-tag-cloud.png'
      });
      console.log('スクリーンショットを撮影しました: pc-sidebar-tag-cloud.png');
    } else {
      console.log('カテゴリーモジュールが見つかりませんでした');
    }

    // ブラウザを閉じる
    await browser.close();
    console.log('スクリプト完了');
  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  }
})();
