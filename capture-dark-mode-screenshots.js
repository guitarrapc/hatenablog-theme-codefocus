import { chromium } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
}

// 取得するスクリーンショットの設定
const screenshots = [
    {
        name: 'visual-dark-mode-article',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601',
        selector: '.entry',
        script: 'window.darkModeJs.applyTheme("dark");', // ダークモードに切り替え
        viewport: { width: 1440, height: 800 }
    },
    {
        name: 'dark-mode-button-light',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601',
        selector: '.theme-switch-container',
        script: 'window.darkModeJs.applyTheme("light");',
        viewport: { width: 1440, height: 800 }
    },
    {
        name: 'dark-mode-button-dark',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601',
        selector: '.theme-switch-container',
        script: 'window.darkModeJs.applyTheme("dark");',
        viewport: { width: 1440, height: 800 }
    },
    {
        name: 'dark-mode-button-auto',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601',
        selector: '.theme-switch-container',
        script: 'window.darkModeJs.applyTheme("auto");',
        viewport: { width: 1440, height: 800 }
    },
    {
        name: 'dark-mode-code-block',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/12/131258',
        selector: '.entry-content .code',
        script: 'window.darkModeJs.applyTheme("dark");',
        viewport: { width: 1440, height: 800 }
    },
    {
        name: 'dark-mode-mobile-article',
        url: 'https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601',
        selector: '.entry',
        script: 'window.darkModeJs.applyTheme("dark");',
        viewport: { width: 430, height: 932 }
    }
];

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    for (const screenshot of screenshots) {
        console.log(`Capturing ${screenshot.name}...`);

        const page = await context.newPage();

        // ビューポートを設定
        await page.setViewportSize(screenshot.viewport);

        // ページに移動
        await page.goto(screenshot.url, { waitUntil: 'networkidle' });

        // 指定されたスクリプトを実行（テーマ切り替えなど）
        if (screenshot.script) {
            await page.evaluate(screenshot.script);

            // スクリプト実行後、少し待機してテーマが適用されるのを待つ
            await page.waitForTimeout(500);
        }

        // スクリーンショットを撮影
        const element = await page.$(screenshot.selector);
        if (element) {
            await element.screenshot({
                path: path.join(screenshotsDir, `${screenshot.name}.png`),
                omitBackground: true
            });
        } else {
            console.error(`Element with selector "${screenshot.selector}" not found for ${screenshot.name}`);
        }

        await page.close();
    }

    await browser.close();
    console.log('All screenshots captured successfully!');
})().catch(error => {
    console.error('Error capturing screenshots:', error);
    process.exit(1);
});
