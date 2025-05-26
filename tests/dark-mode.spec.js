// @ts-check
import { test, expect } from '@playwright/test';

test.describe('ダークモード機能のテスト', () => {
    test('ダークモードボタンが表示されスタイルが適用される', async ({ page }) => {
        // 記事ページに移動
        await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');

        // スクリプトを挿入してダークモード機能を有効化
        await page.addScriptTag({ url: 'http://localhost:5173/js/dark-mode.js' });

        // ダークモードボタンコンテナが表示されるまで待機
        await page.waitForSelector('.theme-switch-container');

        // 表示されたボタンの数を確認
        const buttons = await page.locator('.theme-switch-button').count();
        expect(buttons).toBe(3);

        // ライトモードを適用して確認
        await page.evaluate(() => window.darkModeJs.applyTheme('light'));
        const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(lightTheme).toBe('light');

        // スクリーンショット取得
        await page.screenshot({ path: 'screenshots/dark-mode-light-theme.png', fullPage: true });

        // ダークモードを適用して確認
        await page.evaluate(() => window.darkModeJs.applyTheme('dark'));
        const darkTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(darkTheme).toBe('dark');

        // スクリーンショット取得
        await page.screenshot({ path: 'screenshots/dark-mode-dark-theme.png', fullPage: true });

        // 背景色が変わっていることを確認（ダークモード）
        const darkBgColor = await page.evaluate(() =>
            getComputedStyle(document.documentElement).getPropertyValue('--background')
        );
        expect(darkBgColor.trim()).not.toBe('#fff');

        // システム設定モードを適用して確認
        await page.evaluate(() => window.darkModeJs.applyTheme('auto'));
        const autoTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
        expect(autoTheme).toBe(null);

        // スクリーンショット取得
        await page.screenshot({ path: 'screenshots/dark-mode-auto-theme.png', fullPage: true });
    });
});
