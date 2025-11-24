// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('ダークモード機能のテスト', () => {
  test('ダークモードボタンが表示されスタイルが適用される', async ({ page }) => {
    // 記事ページに移動
    await page.goto('/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // JSファイルを読み込んで直接実行（page.addScriptTagの代替）
    const jsPath = path.resolve(__dirname, '../js/dark-mode.js');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    await page.evaluate(jsContent);

    // スクリプト実行完了を待機
    await page.waitForTimeout(1000);

    // ダークモードボタンコンテナが表示されるまで待機
    await page.waitForSelector('.theme-toggle-container');

    // 表示されたボタンの数を確認
    const buttons = await page.locator('.theme-toggle-main').count();
    expect(buttons).toBe(1);

    // ライトモードを適用して確認
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('light');
        return true;
      }
      return false;
    }).then(result => {
      if (!result) console.log('警告: ライトモードのJavaScript関数が見つかりませんでした');
    });
    await page.waitForTimeout(1000); // テーマ切り替えのアニメーションを待つ
    const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(lightTheme).toBe('light');

    // スクリーンショット取得
    await page.screenshot({ path: 'screenshots/dark-mode-light-theme.png', fullPage: true });

    // ダークモードを適用して確認
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('dark');
        return true;
      }
      return false;
    }).then(result => {
      if (!result) console.log('警告: ダークモードのJavaScript関数が見つかりませんでした');
    });
    await page.waitForTimeout(1000); // テーマ切り替えのアニメーションを待つ
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
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('auto');
        return true;
      }
      return false;
    }).then(result => {
      if (!result) console.log('警告: システムモードのJavaScript関数が見つかりませんでした');
    });
    await page.waitForTimeout(1000); // テーマ切り替えのアニメーションを待つ
    const autoTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(autoTheme).toBe(null);

    // スクリーンショット取得
    await page.screenshot({ path: 'screenshots/dark-mode-auto-theme.png', fullPage: true });
  });
});
