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
    // 要素が無いときはnullを返す。'none'などの文字列を返すとセレクタの誤りが
    // 「隠れている」と区別できず、間違ったセレクタのまま通ってしまう
    const displayOf = (/** @type {string} */ selector) => {
      const el = document.querySelector(selector);
      return el ? getComputedStyle(el).display : null;
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
        globalHeader: displayOf('#globalheader-container'),
        blogControlls: displayOf('.blog-controlls'),
        entryHeaderMenu: displayOf('.entry-header-menu'),
        star: displayOf('.hatena-star-container'),
        socialButtons: displayOf('.social-buttons'),
        pager: displayOf('.pager'),
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

  test('印刷時は画面外の本文も描画される', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    // 画面外にある最後の段落を測る。描画を後回しにしている間は仮の高さ(contain-intrinsic-size)になる。
    // 中身のテキストにRangeを張っても高さが返ってくる(実測17px)ので、要素自身の高さで見分ける
    const measureLast = () => page.evaluate(() => {
      const paragraphs = [...document.querySelectorAll('.entry-content > p')].filter((el) => el.textContent?.trim());
      const el = paragraphs[paragraphs.length - 1];
      return {
        offscreen: el.getBoundingClientRect().top > innerHeight,
        contentVisibility: getComputedStyle(el).contentVisibility,
        height: el.getBoundingClientRect().height,
      };
    });
    const screen = await measureLast();
    // 前提: 画面では画面外の段落の描画を後回しにしていること
    expect(screen.offscreen).toBe(true);
    expect(screen.contentVisibility).toBe('auto');

    await page.emulateMedia({ media: 'print' });
    const print = await measureLast();
    // 画面用のセレクタより詳細度が低いと戻せない(theme-design-spec.md の「描画の後回し」を参照)
    expect(print.contentVisibility).toBe('visible');
    // 仮の高さから実際の高さに変わっていること
    expect(print.height).not.toBe(screen.height);
  });

  test('印刷時に操作専用のUIとサイドバーが出力されない', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.toc-button')).toBeVisible({ timeout: 15000 });

    // 記事の編集ボタンはブログ主のログイン時のみ描画されるため、同じclassのダミーで代替する
    await page.evaluate(() => {
      const el = document.createElement('div');
      el.className = 'entry-header-menu';
      document.querySelector('.entry-header')?.appendChild(el);
    });

    // 前提: 対象がページに存在し、画面では表示されていること。
    // 存在チェックを先に置くことで、セレクタを間違えたときに印刷側ではなくここで落ちる
    const screen = await measure(page);
    Object.entries(screen.hidden).forEach(([name, display]) => {
      expect(display, `${name}がページに存在しない(セレクタの誤り、またはこのブログの構成に無い)`).not.toBeNull();
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

  /** ダークモードのJavaScriptがテーマを適用し終えるまで待つ */
  const waitForDarkTheme = (/** @type {any} */ target) =>
    target.waitForFunction(() => document.documentElement.getAttribute('data-theme') === 'dark',
      null, { timeout: 15000 });

  /**
   * 紙に乗る色を測る。
   * コントラスト比だけだと輝度が同じ別の色を見分けられないため、算出された色そのものも返す。
   */
  const measurePrintColors = (/** @type {any} */ page) => page.evaluate(() => {
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

    /** @type {Record<string, {color: string, ratioOnWhite: number} | null>} */
    const text = {};
    for (const [name, selector] of Object.entries({
      本文: '.entry-content p',
      見出し: '.entry-content h1',
      コード: '.entry-content pre.code',
      テーブル見出し: '.entry-content table th',
      カテゴリ: '.entry-categories a',
    })) {
      const el = document.querySelector(selector);
      const color = el ? getComputedStyle(el).color : null;
      text[name] = color ? { color, ratioOnWhite: ratioOnWhite(color) } : null;
    }

    // 印刷用に差し替えている6種のシンタックスハイライト色。
    // 変数の値は色名や記法がテーマ側と揃わないことがあるので、描画色に正規化して比較する
    const pre = document.querySelector('.entry-content pre.code');
    const probe = document.createElement('span');
    if (pre) pre.appendChild(probe);
    /** @type {Record<string, {color: string, ratioOnWhite: number} | null>} */
    const codeTokens = {};
    for (const token of ['text', 'keyword', 'function', 'punctuation', 'number', 'comment']) {
      if (!pre) { codeTokens[token] = null; continue; }
      probe.style.color = `var(--codeblock-language-colors-${token})`;
      const color = getComputedStyle(probe).color;
      codeTokens[token] = { color, ratioOnWhite: ratioOnWhite(color) };
    }
    probe.remove();

    return { text, codeTokens, codeBackground: pre ? getComputedStyle(pre).backgroundColor : null };
  });

  test('ダークモードでも印刷はライトの配色になり白紙で読める', async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('codefocus-theme-preference', 'dark'));
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await expect(page.locator('.entry-content p').first()).toBeVisible({ timeout: 15000 });

    // 前提: 画面はダークモードになっていること(ここが崩れると以降の検証が意味を失う)
    await waitForDarkTheme(page);
    // 前提: 画面のままでは白紙に対して読めない配色であること
    const screen = await measurePrintColors(page);
    expect(screen.text.本文?.ratioOnWhite).toBeLessThan(CONTRAST_MIN);

    await page.emulateMedia({ media: 'print' });
    const print = await measurePrintColors(page);

    Object.entries(print.text).forEach(([name, measured]) => {
      expect(measured?.ratioOnWhite, `印刷時に${name}が白紙で読めない`).toBeGreaterThanOrEqual(CONTRAST_MIN);
    });
    // 印刷用のハイライト色も白地で読めること
    Object.entries(print.codeTokens).forEach(([token, measured]) => {
      expect(measured?.ratioOnWhite, `印刷時にコードの${token}が白紙で読めない`).toBeGreaterThanOrEqual(CONTRAST_MIN);
    });
  });

  test('印刷の配色はライトモードとダークモードで一致する', async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await page.emulateMedia({ media: 'print' });
    const light = await measurePrintColors(page);

    // 同じページでテーマだけを切り替える。別コンテキストを立てるより待ち合わせが確実
    await page.evaluate(() => localStorage.setItem('codefocus-theme-preference', 'dark'));
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
    await waitForDarkTheme(page);
    const dark = await measurePrintColors(page);

    // 色そのものを比較する。コントラスト比だけでは輝度が同じ別の色を見分けられない
    expect(dark).toEqual(light);
    // 比較対象が本当に取れていること(全部nullでも一致してしまうため)
    expect(light.text.本文?.color).toBeTruthy();
    expect(Object.values(light.codeTokens).every((t) => !!t?.color)).toBe(true);
  });
});
