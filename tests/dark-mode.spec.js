// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, TIMEOUTS } from './constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test.describe('ダークモード機能のテスト', () => {
  test('ダークモードボタンが表示されスタイルが適用される', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // JSファイルを読み込んで直接実行（ローカルテスト用）
    const jsPath = path.resolve(__dirname, '../js/dark-mode.js');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    await page.evaluate(jsContent);
    await page.waitForTimeout(TIMEOUTS.SHORT);

    // ダークモードボタンが表示されることを確認
    await page.waitForSelector(SELECTORS.THEME_TOGGLE_CONTAINER);
    const buttons = await page.locator(SELECTORS.THEME_TOGGLE_MAIN).count();
    expect(buttons).toBe(1);

    /**
     * テーマ適用のヘルパー関数
     * @param {string} theme - 'light', 'dark', 'auto'
     * @returns {Promise<boolean>}
     */
    const applyTheme = async (theme) => {
      const success = await page.evaluate((t) => {
        const win = /** @type {Window & {darkModeJs?: {applyTheme: (theme: string) => void}}} */ (window);
        if (win.darkModeJs && typeof win.darkModeJs.applyTheme === 'function') {
          win.darkModeJs.applyTheme(t);
          return true;
        }
        return false;
      }, theme);
      if (!success) {
        console.log(`警告: ${theme}モードの適用に失敗しました`);
      }
      await page.waitForTimeout(TIMEOUTS.MEDIUM);
      return success;
    };

    // ライトモード
    await applyTheme('light');
    const lightTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(lightTheme).toBe('light');

    // スクリーンショット取得 (ライトモード)
    await page.screenshot({ path: 'screenshots/dark-mode-light-theme.png', fullPage: true });

    // ダークモード
    await applyTheme('dark');
    const darkTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(darkTheme).toBe('dark');

    // 背景色がライトモードと異なることを確認
    const darkBgColor = await page.evaluate(() =>
      getComputedStyle(document.documentElement).getPropertyValue('--background')
    );
    expect(darkBgColor.trim()).not.toBe('#fff');

    // スクリーンショット（ダークモード）
    await page.screenshot({ path: 'screenshots/dark-mode-dark-theme.png', fullPage: true });

    // 自動切り替えモード（data-theme属性がnull）
    await applyTheme('auto');
    const autoTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(autoTheme).toBe(null);

    // スクリーンショット（自動切り替えモード）
    await page.screenshot({ path: 'screenshots/dark-mode-auto-theme.png', fullPage: true });
  });

  test('ページ最上部でもダークモードボタンがはてなのUI帯に隠れない', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });

    // JSファイルを読み込んで直接実行（ローカルテスト用）
    const jsPath = path.resolve(__dirname, '../js/dark-mode.js');
    const jsContent = fs.readFileSync(jsPath, 'utf-8');
    await page.evaluate(jsContent);
    await page.waitForTimeout(TIMEOUTS.SHORT);
    await page.waitForSelector(SELECTORS.THEME_TOGGLE_CONTAINER);

    /**
     * はてなのUI帯の下端と、ダークモードボタンの位置・クリック可否を取得する
     * @param {number} scrollY
     */
    const measure = async (scrollY) => {
      await page.evaluate((y) => window.scrollTo(0, y), scrollY);
      // スクロール駆動アニメーションの反映を待つ
      await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
      return page.evaluate((selector) => {
        const bottomOf = (/** @type {string} */ s) => {
          const el = document.querySelector(s);
          return el ? el.getBoundingClientRect().bottom : 0;
        };
        const container = /** @type {HTMLElement} */ (document.querySelector(selector));
        const rect = container.getBoundingClientRect();
        const hit = document.elementFromPoint(rect.x + rect.width / 2, rect.y + rect.height / 2);
        return {
          // はてなのグローバルヘッダと「読者になる」ボタンの帯の下端
          bandBottom: Math.max(bottomOf('#globalheader-container'), bottomOf('.blog-controlls')),
          top: rect.top,
          // ボタンの中心をヒットテストして、はてなのUIに覆われていないことを確認する
          clickable: !!(hit && hit.closest(selector)),
          supportsScrollTimeline: CSS.supports('animation-timeline: scroll(root block)'),
        };
      }, SELECTORS.THEME_TOGGLE_CONTAINER);
    };

    // ページ最上部: はてなのUI帯を避けた位置にあり、クリックできる
    const atTop = await measure(0);
    expect(atTop.bandBottom).toBeGreaterThan(0); // UI帯が存在する前提のテスト
    expect(atTop.top).toBeGreaterThanOrEqual(atTop.bandBottom);
    expect(atTop.clickable).toBe(true);

    // UI帯をスクロールで通り過ぎたあと: 本来の位置(top: 1rem)に戻り、引き続きクリックできる
    const afterScroll = await measure(atTop.bandBottom + 200);
    expect(afterScroll.clickable).toBe(true);
    if (afterScroll.supportsScrollTimeline) {
      expect(afterScroll.top).toBeCloseTo(16, 0);
    }

    // 最上部に戻すと再び退避すること（アニメーションが一方向に振り切らない）
    const backToTop = await measure(0);
    expect(backToTop.top).toBeCloseTo(atTop.top, 0);
    expect(backToTop.clickable).toBe(true);
  });
});
