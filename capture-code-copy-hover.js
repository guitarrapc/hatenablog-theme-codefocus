import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// ESモジュール用の__dirnameの定義
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 保存先ディレクトリの確認と作成
const screenshotsDir = path.join(__dirname, 'articles', 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

async function captureCodeCopyHover() {
  const browser = await chromium.launch({
    headless: true // ヘッドレスモードで実行
  });

  try {
    const context = await browser.newContext({
      viewport: { width: 912, height: 600 }, // Surface Pro7の幅
      deviceScaleFactor: 1.5 // より高解像度で撮影
    });
    const page = await context.newPage();

    console.log('コードコピー機能のホバー状態スクリーンショットを取得します...');

    // コードハイライトページに移動
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/12/131258');
    await page.waitForLoadState('networkidle');
    console.log('ページの読み込みが完了しました');

    // 最初のコードブロックを探す
    const firstCodeBlock = await page.locator('pre.code').first();
    await firstCodeBlock.scrollIntoViewIfNeeded();

    // ホバー前のスクリーンショット
    await page.screenshot({
      path: path.join(screenshotsDir, 'code-block-before-hover.png'),
      clip: {
        x: await firstCodeBlock.boundingBox().then(box => box.x - 20),
        y: await firstCodeBlock.boundingBox().then(box => box.y - 20),
        width: await firstCodeBlock.boundingBox().then(box => box.width + 40),
        height: await firstCodeBlock.boundingBox().then(box => box.height + 40)
      }
    });
    console.log('ホバー前のスクリーンショットを保存しました');

    // コードブロックにホバー
    await firstCodeBlock.hover();
    await page.waitForTimeout(500); // アニメーションを待つ

    // ホバー後のスクリーンショット
    await page.screenshot({
      path: path.join(screenshotsDir, 'code-block-with-copy-button.png'),
      clip: {
        x: await firstCodeBlock.boundingBox().then(box => box.x - 20),
        y: await firstCodeBlock.boundingBox().then(box => box.y - 20),
        width: await firstCodeBlock.boundingBox().then(box => box.width + 40),
        height: await firstCodeBlock.boundingBox().then(box => box.height + 40)
      }
    });
    console.log('コピーボタン表示状態のスクリーンショットを保存しました');

    // コピーボタンにホバーしてツールチップを表示
    const copyButton = await page.locator('.code-copy-button').first();

    // コピーボタンが存在することを確認
    if (await copyButton.count() === 0) {
      console.error('コピーボタンが見つかりません。記事のコードブロックに実装されているか確認してください。');
      return;
    }

    await copyButton.hover();
    await page.waitForTimeout(500); // ツールチップの表示を待つ

    // ツールチップ表示のスクリーンショット
    await page.screenshot({
      path: path.join(screenshotsDir, 'code-block-tooltip.png'),
      clip: {
        x: await firstCodeBlock.boundingBox().then(box => box.x - 20),
        y: await firstCodeBlock.boundingBox().then(box => box.y - 50), // ツールチップの分、上側に余白を追加
        width: await firstCodeBlock.boundingBox().then(box => box.width + 40),
        height: await firstCodeBlock.boundingBox().then(box => box.height + 70) // ツールチップ用に高さを増やす
      }
    });
    console.log('ツールチップ表示状態のスクリーンショットを保存しました');

    // コピー成功状態のシミュレーション
    await page.evaluate(() => {
      // タイトルを変更してツールチップの内容を更新
      const button = document.querySelector('.code-copy-button');
      button.title = 'Copied!';

      // コピー成功クラスを追加
      button.classList.add('copied');
    });

    await page.waitForTimeout(300);

    // コピー成功状態のスクリーンショット
    await page.screenshot({
      path: path.join(screenshotsDir, 'code-block-copied.png'),
      clip: {
        x: await firstCodeBlock.boundingBox().then(box => box.x - 20),
        y: await firstCodeBlock.boundingBox().then(box => box.y - 50),
        width: await firstCodeBlock.boundingBox().then(box => box.width + 40),
        height: await firstCodeBlock.boundingBox().then(box => box.height + 70)
      }
    });
    console.log('コピー成功状態のスクリーンショットを保存しました');

  } finally {
    await browser.close();
    console.log('スクリーンショット取得が完了しました');
  }
}

// 実行
captureCodeCopyHover().catch(err => {
  console.error('エラーが発生しました:', err);
  process.exit(1);
});
