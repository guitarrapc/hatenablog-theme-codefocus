// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, TIMEOUTS } from './constants.js';

/**
 * コードハイライトの文字色がコードブロックの背景に対してWCAG AA(4.5:1)を満たすかを検証する。
 *
 * コメント(#8b949e)はダークのコードブロック(#272f3b)で4.39:1しかなく、
 * テーマで色を決めていなかったsynPreProcは、はてな側の#9355e6で3:1しかなかった。
 * テーマが色を決めていないクラスがあると、はてな側の色がそのまま出るので、
 * 記事に現れるsyn*クラスをすべて測る。
 */

const AA_TEXT = 4.5;

/** synPreProc(import等)とsynCommentを含む記事を両方見る */
const URLS = [TEST_URLS.CODE_HIGHLIGHT, '/entry/2025/05/17/015533'];

const measure = (/** @type {any} */ page) => page.evaluate(() => {
  const channels = (/** @type {string} */ rgb) => (rgb.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number);
  const luminance = (/** @type {number[]} */ rgb) => {
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const contrast = (/** @type {number[]} */ fg, /** @type {number[]} */ bg) => {
    const a = luminance(fg) + 0.05;
    const b = luminance(bg) + 0.05;
    return Number((Math.max(a, b) / Math.min(a, b)).toFixed(2));
  };

  /** @type {Record<string, {color: string, background: string, ratio: number}>} */
  const result = {};
  for (const span of document.querySelectorAll('pre.code span[class^="syn"]')) {
    const name = span.className;
    if (result[name]) continue;
    const color = getComputedStyle(span).color;
    const background = getComputedStyle(/** @type {Element} */ (span.closest('pre'))).backgroundColor;
    result[name] = { color, background, ratio: contrast(channels(color), channels(background)) };
  }
  return result;
});

test.describe('コードハイライトのコントラスト', () => {
  for (const theme of ['light', 'dark']) {
    test(`すべてのハイライト色がWCAG AAを満たす(${theme})`, async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem('codefocus-theme-preference', t), theme);

      /** @type {Record<string, {color: string, background: string, ratio: number}>} */
      const all = {};
      for (const url of URLS) {
        await page.navigateTo(url, { waitFor: 'networkidle' });
        await page.waitForFunction((t) => document.documentElement.getAttribute('data-theme') === t,
          theme, { timeout: TIMEOUTS.VERY_LONG });
        Object.assign(all, await measure(page));
      }

      expect(Object.keys(all), 'テストデータにsynComment / synPreProc / synStatementが含まれていない')
        .toEqual(expect.arrayContaining(['synComment', 'synPreProc', 'synStatement']));
      for (const [name, { color, background, ratio }] of Object.entries(all)) {
        expect(ratio, `${name}: ${color} on ${background}`).toBeGreaterThanOrEqual(AA_TEXT);
      }
      // import宣言(synPreProc)とclass / def宣言(synStatement)を色で見分けられること
      expect(all.synPreProc.color, 'synPreProcとsynStatementが同じ色').not.toBe(all.synStatement.color);
    });
  }
});
