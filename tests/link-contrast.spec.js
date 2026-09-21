// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TIMEOUTS } from './constants.js';

/**
 * 本文中のリンクが周りの文字と区別できるかを検証する (WCAG 1.4.1 / 達成方法G183)。
 *
 * ZennやNoteに倣って本文中のリンクには下線を引かないため、色だけで区別できる必要がある。
 * - リンク色と本文色: 3:1以上 (以前はライト2.41:1 / ダーク2.14:1で、Lighthouseのlink-in-text-blockで指摘された)
 * - リンク色と背景色: 4.5:1以上 (通常のテキストとしてのコントラスト)
 * - ホバー時は下線を出して反応を示す
 * 訪問済みの色はgetComputedStyleから読めないため、CSS変数の値で確かめる。
 */

const AA_TEXT = 4.5;
const DISTINCT_FROM_TEXT = 3.0;
const ARTICLE = '/entry/2025/05/17/015533';

const measure = (/** @type {any} */ page) => page.evaluate(() => {
  const channels = (/** @type {string} */ c) => {
    // CSS変数は#rrggbbのまま返るので、どちらの形式でも読めるようにする
    const hex = c.trim().match(/^#([0-9a-f]{6})$/i);
    if (hex) return [0, 2, 4].map((i) => parseInt(hex[1].slice(i, i + 2), 16));
    return (c.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  };
  const luminance = (/** @type {number[]} */ rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (/** @type {string} */ fg, /** @type {string} */ bg) => {
    const a = luminance(channels(fg)) + 0.05;
    const b = luminance(channels(bg)) + 0.05;
    return Number((Math.max(a, b) / Math.min(a, b)).toFixed(2));
  };

  const link = /** @type {Element} */ (document.querySelector('.entry-content p > a'));
  const paragraph = /** @type {Element} */ (link.parentElement);
  const root = getComputedStyle(document.documentElement);
  const background = root.getPropertyValue('--background');
  const body = getComputedStyle(paragraph).color;
  const colors = {
    リンク: getComputedStyle(link).color,
    訪問済みリンク: root.getPropertyValue('--link-visited'),
  };
  return {
    decoration: getComputedStyle(link).textDecorationLine,
    results: Object.entries(colors).map(([name, color]) => ({
      name, color, body, background,
      vsText: contrast(color, body),
      vsBackground: contrast(color, background),
    })),
  };
});

test.describe('本文中のリンクの見分けやすさ', () => {
  for (const theme of ['light', 'dark']) {
    test(`下線なしでも色で本文と区別できる(${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('codefocus-theme-preference', t), theme);
      await page.navigateTo(ARTICLE, { waitFor: 'networkidle' });
      await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t,
        theme, { timeout: TIMEOUTS.VERY_LONG });

      const { decoration, results } = await measure(page);
      expect(decoration, 'Zenn / Noteに倣い、通常時は下線を引かない').toBe('none');
      for (const { name, color, body, background, vsText, vsBackground } of results) {
        expect(vsText, `${name} ${color} と本文 ${body}`).toBeGreaterThanOrEqual(DISTINCT_FROM_TEXT);
        expect(vsBackground, `${name} ${color} と背景 ${background}`).toBeGreaterThanOrEqual(AA_TEXT);
      }
    });
  }

  test('ホバーすると下線が出る', async ({ page }) => {
    await page.navigateTo(ARTICLE, { waitFor: 'networkidle' });
    const link = page.locator('.entry-content p > a').first();
    await link.hover();
    await expect(link).toHaveCSS('text-decoration-line', 'underline');
  });
});
