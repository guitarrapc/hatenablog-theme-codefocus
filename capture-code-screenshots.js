import { chromium } from '@playwright/test';

(async () => {
    try {
        console.log('スクリプト開始');
        // ブラウザを起動
        const browser = await chromium.launch({ headless: true });
        const context = await browser.newContext();
        const page = await context.newPage();

        // テストブログのコードハイライトページにアクセス
        await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/12/131258');
        await page.setViewportSize({ width: 912, height: 1368 });
        await page.waitForLoadState('networkidle');

        // コードブロックを探してスクリーンショット
        const codeBlocks = await page.locator('pre').all();
        console.log(`${codeBlocks.length}個のコードブロックが見つかりました`);

        if (codeBlocks.length > 0) {
            // Python, C#, Goのコードブロックをそれぞれ撮影
            await codeBlocks[0].screenshot({ path: 'articles/screenshots/pc-code-python.png' });
            console.log('Pythonコードのスクリーンショットを撮影しました');

            if (codeBlocks.length > 1) {
                await codeBlocks[1].screenshot({ path: 'articles/screenshots/pc-code-csharp.png' });
                console.log('C#コードのスクリーンショットを撮影しました');
            }

            if (codeBlocks.length > 2) {
                await codeBlocks[2].screenshot({ path: 'articles/screenshots/pc-code-go.png' });
                console.log('Goコードのスクリーンショットを撮影しました');
            }
        } else {
            console.log('コードブロックが見つかりませんでした');
        }

        // フローティング目次コンテンツのスクリーンショット
        await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
        await page.waitForLoadState('networkidle');

        const tocButton = await page.locator('.toc-button');
        if (await tocButton.isVisible()) {
            await tocButton.click();
            console.log('目次ボタンをクリックしました');

            const floatingToc = await page.locator('.floating-toc');
            if (await floatingToc.isVisible()) {
                await floatingToc.screenshot({ path: 'articles/screenshots/pc-floating-toc.png' });
                console.log('フローティング目次のスクリーンショットを撮影しました');
            }
        }
        // ブラウザを閉じる
        await browser.close();
        console.log('スクリプト終了');
    } catch (error) {
        console.error('エラーが発生しました:', error);
    }
})();
