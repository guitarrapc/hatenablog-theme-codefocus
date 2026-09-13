// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, TIMEOUTS } from './constants.js';

/**
 * 本文より下の階層(補助テキスト)のコントラストを検証する。
 *
 * これらは「目立たせない」ことが目的の色なので、薄くしすぎて WCAG AA を割りやすい。
 * 実際 --text-light はライトで 2.73:1 (AA Largeの3:1すら不足) まで薄くなっていた。
 */

const AA_TEXT = 4.5; // WCAG 1.4.3 通常サイズのテキスト
const AA_NON_TEXT = 3.0; // WCAG 1.4.11 アイコンなどの非テキスト

/** 対象はいずれも12.8-14.4pxで、大きなテキストの例外(24px / 太字18.66px)には当たらない */
const TARGETS = {
  本文: '.entry-content p',
  記事の投稿日時: '.entry-date a, .date a',
  コメント日時: '.comment-metadata',
  記事下フッタ: '.entry-footer-section',
  記事下フッタのリンク: '.entry-footer-section a',
  引用: '.entry-content blockquote',
  ページ内目次のリンク: '.entry-content .table-of-contents a',
  // はてな側のCSSがopacity: 0.7を当てており、spanとtimeに入れ子で掛かって0.49になる。
  // 指定色ではなく実際に描かれる色で見ないと見逃す
  最近のコメントの日時: '.hatena-module-recent-comments time.recent-comment-time',
  ページ末尾フッタ: '#footer p',
  // #footerの最初のリンクははてなが置く「はてなブログをはじめる(無料)」ボタンで、
  // 白文字に緑背景をはてな側のCSSが当てている。テーマが色を決めていないので対象にしない
  ページ末尾フッタのリンク: '#footer .services a',
};

const measure = (/** @type {any} */ page, /** @type {Record<string,string>} */ targets) => page.evaluate((targets) => {
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
  // 半透明の背景を持つ要素があるため、実際に色が乗っている祖先まで遡る
  const effectiveBackground = (/** @type {Element | null} */ el) => {
    let node = el;
    while (node) {
      const color = getComputedStyle(node).backgroundColor;
      if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
      node = node.parentElement;
    }
    return getComputedStyle(document.body).backgroundColor;
  };
  // opacityは祖先のぶんも掛かる。
  // 実際に「最近のコメント」の日時は、はてな側のopacity: 0.7がspanとtimeに二重に効いて0.49になり、
  // colorだけを見ると5.03:1に見えるのに描かれているのは1.99:1だった
  const effectiveOpacity = (/** @type {Element | null} */ el) => {
    let node = el;
    let opacity = 1;
    while (node && node !== document.documentElement) {
      opacity *= Number(getComputedStyle(node).opacity);
      node = node.parentElement;
    }
    return opacity;
  };
  /** opacityぶんだけ背景と混ぜて、実際に画面に出る色を求める */
  const flatten = (/** @type {number[]} */ fg, /** @type {number[]} */ bg, /** @type {number} */ opacity) =>
    fg.map((v, i) => v * opacity + bg[i] * (1 - opacity));
  const toRgb = (/** @type {number[]} */ c) => `rgb(${c.map((v) => Math.round(v)).join(', ')})`;

  /** @type {Record<string, {color: string, rendered: string, background: string, opacity: number, ratio: number, fontSize: string} | null>} */
  const result = {};
  for (const [name, selector] of Object.entries(targets)) {
    const el = document.querySelector(selector);
    if (!el) { result[name] = null; continue; }
    const style = getComputedStyle(el);
    const background = effectiveBackground(el);
    const opacity = effectiveOpacity(el);
    const rendered = flatten(channels(style.color), channels(background), opacity);
    result[name] = {
      color: style.color,
      rendered: toRgb(rendered),
      background,
      opacity: Number(opacity.toFixed(2)),
      ratio: contrast(rendered, channels(background)),
      fontSize: style.fontSize,
    };
  }

  // ページャーの矢印はSVGのstrokeに色を焼き込んでいるため、contentの文字列から色を取り出す。
  // CSS変数ではなくSCSS変数を使っており、テーマで切り替わらないので両テーマで確認する
  const pager = document.querySelector('.pager-prev a');
  let arrow = null;
  if (pager) {
    const content = getComputedStyle(pager, '::before').content;
    const matched = content.match(/stroke='(#[0-9a-fA-F]{3,6})'/) || content.match(/stroke='%23([0-9a-fA-F]{3,6})'/);
    if (matched) {
      const hex = matched[1].startsWith('#') ? matched[1] : `#${matched[1]}`;
      const full = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
      const rgb = [full.slice(1, 3), full.slice(3, 5), full.slice(5, 7)].map((v) => parseInt(v, 16));
      arrow = { color: full, ratio: contrast(rgb, channels(effectiveBackground(pager))) };
    }
  }
  return { result, arrow, background: getComputedStyle(document.body).backgroundColor };
}, targets);

/**
 * テストブログ側の背景設定を打ち消して、テーマ本来の背景に戻す。
 *
 * はてなの「デザイン > カスタマイズ > 背景」で背景色を設定すると、テーマの配色は
 * その色の上に載る (ユーザーが自由に決められるのが正しい挙動。背景の項目を参照)。
 * ただしここで見たいのは「テーマが持つ配色がAAを満たすか」なので、
 * ブログの設定に左右されないようテーマの既定背景へ戻してから測る。
 *
 * head末尾に足すのでusercssより後になり、確実に勝つ。
 *
 * @param {any} page
 */
const resetToThemeBackground = (page) => page.addStyleTag({ content: 'html, body { background: var(--background); }' });

/** ダークモードのJavaScriptがテーマを適用し終えるまで待つ */
const waitForDarkTheme = (/** @type {any} */ page) =>
  page.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark',
    null, { timeout: TIMEOUTS.VERY_LONG });

test.describe('補助テキストのコントラスト', () => {
  for (const theme of ['light', 'dark']) {
    test(`本文より下の階層もWCAG AAを満たす(${theme})`, async ({ page }) => {
      if (theme === 'dark') {
        await page.addInitScript(() => localStorage.setItem('codefocus-theme-preference', 'dark'));
      }
      await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
      await expect(page.locator('#footer').first()).toBeAttached({ timeout: TIMEOUTS.VERY_LONG });
      if (theme === 'dark') await waitForDarkTheme(page);
      await resetToThemeBackground(page);

      const { result, arrow } = await measure(page, TARGETS);

      for (const [name, measured] of Object.entries(result)) {
        expect(measured, `${name} が見つからない。テストデータかセレクタを確認する`).not.toBeNull();
        // 失敗時に「指定色は足りているが描画色が足りない」を読み取れるよう、両方を出す
        expect(measured?.ratio,
          `${name}: 指定 ${measured?.color} / opacity ${measured?.opacity} → 描画 ${measured?.rendered} on ${measured?.background} (${measured?.fontSize})`)
          .toBeGreaterThanOrEqual(AA_TEXT);
      }

      // ページャーの矢印は非テキストなので1.4.11の3:1で見る
      expect(arrow, 'ページャーの矢印の色を取り出せない').not.toBeNull();
      expect(arrow?.ratio, `ページャーの矢印 (${arrow?.color})`).toBeGreaterThanOrEqual(AA_NON_TEXT);
    });
  }

  test('記事の投稿日時とコメントの投稿日時は同じ色で描かれる', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.comment-metadata').first()).toBeAttached({ timeout: TIMEOUTS.VERY_LONG });

    const { result } = await measure(page, {
      記事の投稿日時: TARGETS.記事の投稿日時,
      コメント日時: TARGETS.コメント日時,
    });

    // 同じ種類の情報なので同じ変数を使う。
    // 以前は記事側が--text-low-priority、コメント側が--text-lightで色が違っていた
    expect(result.記事の投稿日時?.color).toBe(result.コメント日時?.color);
  });
});
