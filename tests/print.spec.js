// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS } from './constants.js';

/**
 * 印刷スタイルのテスト
 *
 * 紙は横スクロールも開閉操作もできないため、画面と同じ描画では内容が欠落する。
 * 画面表示に影響していないことも同時に確認する。
 */
test.describe('印刷スタイルのテスト', () => {
  /** 印刷時に問題になる箇所をまとめて測る */
  const measure = (/** @type {any} */ page) => page.evaluate(() => {
    const displayOf = (/** @type {string} */ selector) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el).display : 'なし';
    };
    const codeBlocks = [...document.querySelectorAll('.entry-content pre.code')];
    const details = [...document.querySelectorAll('.entry-content details:not([open])')];
    return {
      // 紙幅をはみ出している量。0でなければその分が印刷されない
      codeOverflow: codeBlocks.map((el) => Math.round(el.scrollWidth - el.clientWidth)),
      codeBackground: codeBlocks.length ? getComputedStyle(codeBlocks[0]).backgroundColor : null,
      // 閉じたdetailsの高さ。summaryだけだと中身が印刷されない
      closedDetailsHeights: details.map((el) => Math.round(el.getBoundingClientRect().height)),
      hidden: {
        tocButton: displayOf('.toc-button'),
        floatingToc: displayOf('.floating-toc'),
        themeToggle: displayOf('.theme-toggle-container'),
        codeCopyButton: displayOf('.code-copy-button'),
        codeWrapToggle: displayOf('.code-wrap-toggle'),
        sidebar: displayOf('#box2'),
        entryFooterModules: displayOf('#entry-footer-secondary-modules'),
      },
    };
  });

  test('印刷時にコードブロックが紙幅で折り返され、白地でも読める配色になる', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.entry-content pre.code').first()).toBeVisible({ timeout: 15000 });

    // 前提: 画面では横スクロールする作りであること(ここが変わると以降の検証が意味を失う)
    const screen = await measure(page);
    expect(Math.max(...screen.codeOverflow)).toBeGreaterThan(0);

    await page.emulateMedia({ media: 'print' });
    const print = await measure(page);

    // 紙では1文字も欠けない
    expect(print.codeOverflow.every((over) => over === 0)).toBe(true);
    // 印刷ダイアログの「背景のグラフィック」は既定でオフなので、紙では白地にする
    expect(print.codeBackground).toBe('rgb(255, 255, 255)');
  });

  test('印刷時に閉じたdetailsの中身も出力される', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.entry-content details').first()).toBeVisible({ timeout: 15000 });

    const screen = await measure(page);
    // 前提: 閉じたdetailsが存在すること
    expect(screen.closedDetailsHeights.length).toBeGreaterThan(0);

    await page.emulateMedia({ media: 'print' });
    const print = await measure(page);

    // summaryだけの高さから増えていること(中身が展開されている)
    print.closedDetailsHeights.forEach((height, i) => {
      expect(height).toBeGreaterThan(screen.closedDetailsHeights[i]);
    });
  });

  test('印刷時に操作専用のUIとサイドバーが出力されない', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.toc-button')).toBeVisible({ timeout: 15000 });

    // 前提: 画面では表示されていること
    const screen = await measure(page);
    Object.entries(screen.hidden).forEach(([name, display]) => {
      expect(display, `画面で${name}が表示されていない`).not.toBe('none');
    });

    await page.emulateMedia({ media: 'print' });
    const print = await measure(page);

    // position: fixedの要素はChromeの印刷では全ページに繰り返し出力されるため必ず隠す
    Object.entries(print.hidden).forEach(([name, display]) => {
      expect(display, `印刷時に${name}が隠れていない`).toBe('none');
    });
  });

  // 紙は白地固定なので、画面のテーマに関わらずライトの配色で刷る。
  // ダークモードの本文色は白に近く、背景が印刷されないと白紙に白文字になる。
  const CONTRAST_MIN = 4.5; // WCAG AAの本文コントラスト比

  /** 白紙(白背景)に対するコントラスト比を測る */
  const measureContrastOnPaper = (/** @type {any} */ page) => page.evaluate(() => {
    const relativeLuminance = (/** @type {string} */ rgb) => {
      const [r, g, b] = (rgb.match(/\d+(\.\d+)?/g) || []).slice(0, 3).map(Number)
        .map((v) => {
          const c = v / 255;
          return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratioOnWhite = (/** @type {string} */ color) => {
      const a = relativeLuminance(color) + 0.05;
      const b = relativeLuminance('rgb(255,255,255)') + 0.05;
      return Number((Math.max(a, b) / Math.min(a, b)).toFixed(2));
    };
    const colorOf = (/** @type {string} */ selector) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el).color : null;
    };
    /** @type {Record<string, number|null>} */
    const out = {};
    for (const [name, selector] of Object.entries({
      本文: '.entry-content p',
      見出し: '.entry-content h1',
      コード: '.entry-content pre.code',
      テーブル見出し: '.entry-content table th',
    })) {
      const color = colorOf(selector);
      out[name] = color ? ratioOnWhite(color) : null;
    }
    return out;
  });

  test('ダークモードでも印刷はライトの配色になり白紙で読める', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('codefocus-theme-preference', 'dark'));
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.entry-content p').first()).toBeVisible({ timeout: 15000 });

    // 前提: 画面はダークモードになっていること(ここが崩れると以降の検証が意味を失う)
    const theme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'));
    expect(theme).toBe('dark');
    // 前提: 画面のままでは白紙に対して読めない配色であること
    const screen = await measureContrastOnPaper(page);
    expect(screen.本文).toBeLessThan(CONTRAST_MIN);

    await page.emulateMedia({ media: 'print' });
    const print = await measureContrastOnPaper(page);

    Object.entries(print).forEach(([name, ratio]) => {
      expect(ratio, `印刷時に${name}が白紙で読めない`).toBeGreaterThanOrEqual(CONTRAST_MIN);
    });
  });

  test('印刷の配色はライトモードとダークモードで一致する', async ({ page, browser }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const light = await measureContrastOnPaper(page);

    const darkContext = await browser.newContext({ permissions: ['local-network-access'] });
    const darkPage = await darkContext.newPage();
    await darkPage.addInitScript(() => localStorage.setItem('codefocus-theme-preference', 'dark'));
    await darkPage.goto(`https://guitarrapc-theme.hatenablog.com${TEST_URLS.SAMPLE_ARTICLE}`, { waitUntil: 'load' });
    await darkPage.waitForTimeout(3000);
    await darkPage.emulateMedia({ media: 'print' });
    const dark = await measureContrastOnPaper(darkPage);
    await darkContext.close();

    expect(dark).toEqual(light);
  });
});
