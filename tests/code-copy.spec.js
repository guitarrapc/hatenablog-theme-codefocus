// @ts-check
import { test, url, NAVIGATION_TIMEOUT } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, TIMEOUTS } from './constants.js';

test.describe('Code Copy Feature', () => {
  test('Copy button appears on hover and is clickable', async ({ page }) => {
    await page.navigateTo(TEST_URLS.CODE_HIGHLIGHT, { waitFor: 'networkidle' });

    // 最初のコードブロックを取得
    const codeBlock = page.locator('pre.code').first();
    const hasCodeBlock = await codeBlock.count();

    if (hasCodeBlock === 0) {
      throw new Error('コードハイライト記事にコードブロックが存在しません。テストデータを確認してください。');
    }

    await expect(codeBlock).toBeVisible();

    // コピーボタンが初期状態では非表示か透明であることを確認
    const copyButton = await page.locator('.code-copy-button').first();

    // ホバー前のスタイルを確認（不可視か透明）
    const opacityBeforeHover = await copyButton.evaluate(btn => {
      return window.getComputedStyle(btn).opacity;
    });

    expect(parseFloat(opacityBeforeHover)).toBeLessThan(0.1);

    // コードブロックにホバー
    await codeBlock.hover();
    await page.waitForTimeout(500); // ホバーアニメーション待機

    // ホバー後のボタンスタイルを確認（表示される）
    const opacityAfterHover = await copyButton.evaluate(btn => {
      return window.getComputedStyle(btn).opacity;
    });

    expect(parseFloat(opacityAfterHover)).toBeGreaterThan(0.5);

    // ボタンのツールチップがないことを確認
    const tooltipBeforeClick = await copyButton.getAttribute('title');
    expect(tooltipBeforeClick).toBe(null);

    // ボタンがクリック可能であることを確認（実際にはクリックせず）
    await expect(copyButton).toBeEnabled();

    // ボタンのスクリーンショット撮影
    await copyButton.screenshot({ path: 'screenshots/code-copy-button-hover.png' });
  });

  test('Copy buttons exist for all code blocks', async ({ page }) => {
    await page.navigateTo(TEST_URLS.CODE_HIGHLIGHT, { waitFor: 'networkidle' });

    // すべてのコードブロックにコピーボタンがあることを確認
    const codeBlocks = await page.locator('pre.code').all();
    const copyButtons = await page.locator('.code-copy-button').all();

    // コードハイライト記事には必ずコードブロックが存在するべき
    if (codeBlocks.length === 0) {
      throw new Error('コードハイライト記事にコードブロックが存在しません。テストデータを確認してください。');
    }

    expect(copyButtons.length).toEqual(codeBlocks.length);
    expect(codeBlocks.length).toBeGreaterThan(0);

    // 最初のコードブロックにホバーして確認
    await codeBlocks[0].hover();
    await page.waitForTimeout(500);
  });

  test('ホバーできる端末ではボタンのための余白を取らない', async ({ page }) => {
    await page.navigateTo(TEST_URLS.CODE_HIGHLIGHT, { waitFor: 'networkidle' });
    await page.waitForSelector('.code-block-wrapper', { timeout: TIMEOUTS.VERY_LONG });

    const layout = await page.evaluate(() => {
      const pre = document.querySelector('.code-block-wrapper pre.code');
      if (!pre) return null;
      return { hoverNone: window.matchMedia('(hover: none)').matches, paddingTop: getComputedStyle(pre).paddingTop };
    });

    // 前提: ホバーできる端末として扱われていること(ここが崩れると下の検証が意味を失う)
    expect(layout?.hoverNone).toBe(false);
    // ボタンは一時的にしか出ないため、素のpreと同じ余白のままでよい
    expect(layout?.paddingTop).toBe('15px');
  });
});

/**
 * ホバーできない端末(スマートフォン / タブレット)を再現したページで検証する。
 *
 * helpers.jsのcontextフィクスチャはプロジェクト設定のisMobile / hasTouchを引き継がないため、
 * ここだけは専用のコンテキストを起こす。hasTouchを付けるとChromiumが
 * hover / any-hover / pointer をまとめてタッチ側へ倒す
 *
 * @param {import('@playwright/test').Browser} browser
 * @param {(page: import('@playwright/test').Page) => Promise<void>} body
 */
const withTouchDevice = async (browser, body) => {
  const context = await browser.newContext({
    viewport: { width: 430, height: 932 },
    isMobile: true,
    hasTouch: true,
    permissions: ['local-network-access'],
  });
  try {
    const page = await context.newPage();
    await page.goto(url(TEST_URLS.CODE_HIGHLIGHT), { waitUntil: 'load', timeout: NAVIGATION_TIMEOUT });
    await page.waitForSelector('.code-block-wrapper', { timeout: TIMEOUTS.VERY_LONG });
    await body(page);
  } finally {
    await context.close();
  }
};

test.describe('タッチ端末のコードブロックのボタン', () => {
  test('ホバーできない端末ではボタンが最初から見える', async ({ browser }) => {
    await withTouchDevice(browser, async (page) => {
      const state = await page.evaluate(() => {
        const copy = document.querySelector('.code-copy-button');
        const wrap = document.querySelector('.code-wrap-toggle');
        if (!copy || !wrap) return null;
        return {
          hoverNone: window.matchMedia('(hover: none)').matches,
          copyOpacity: parseFloat(getComputedStyle(copy).opacity),
          wrapOpacity: parseFloat(getComputedStyle(wrap).opacity),
          // 指で押す端末では小さくしない。WCAG 2.5.8の最小値24pxを下回らせない
          copySize: copy.getBoundingClientRect().width,
        };
      });

      // 前提: ホバーできない端末として扱われていること
      expect(state?.hoverNone).toBe(true);
      // ホバーもフォーカスも起きていない状態で見えていること(これが本来の不具合)
      expect(state?.copyOpacity).toBeGreaterThan(0.5);
      expect(state?.wrapOpacity).toBeGreaterThan(0.5);
      expect(state?.copySize).toBeGreaterThanOrEqual(24);
    });
  });

  test('ホバーできない端末ではボタンがコードの1行目に重ならない', async ({ browser }) => {
    await withTouchDevice(browser, async (page) => {
      const blocks = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('.code-block-wrapper')).map((wrapper) => {
          const pre = wrapper.querySelector('pre.code');
          const buttons = Array.from(wrapper.querySelectorAll('.code-copy-button, .code-wrap-toggle'));
          const buttonBottom = Math.max(...buttons.map((b) => b.getBoundingClientRect().bottom));
          // 1行目の位置はテキストノードの矩形から取る。preのpaddingでは行の高さを含められない
          const walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
          const node = walker.nextNode();
          const range = document.createRange();
          range.selectNodeContents(node);
          const firstRow = range.getClientRects()[0];
          return { buttonBottom, firstRowTop: firstRow ? firstRow.top : null };
        });
      });

      expect(blocks.length).toBeGreaterThan(0);
      for (const block of blocks) {
        expect(block.firstRowTop).not.toBeNull();
        expect(block.firstRowTop).toBeGreaterThanOrEqual(block.buttonBottom);
      }
    });
  });

  test('印刷ではボタンのための余白が残らない', async ({ browser }) => {
    await withTouchDevice(browser, async (page) => {
      const read = () => page.evaluate(() => {
        const pre = document.querySelector('.code-block-wrapper pre.code');
        const copy = document.querySelector('.code-copy-button');
        if (!pre || !copy) return null;
        return { paddingTop: getComputedStyle(pre).paddingTop, display: getComputedStyle(copy).display };
      });

      const onScreen = await read();
      expect(onScreen?.display).not.toBe('none');

      await page.emulateMedia({ media: 'print' });
      const onPrint = await read();

      // 紙ではボタンが消えるため、そのために空けた余白も戻す。
      // 残ると理由のない空白がコードブロックの上に刷られる
      expect(onPrint?.display).toBe('none');
      expect(onPrint?.paddingTop).toBe('15px');
      expect(onPrint?.paddingTop).not.toBe(onScreen?.paddingTop);
    });
  });
});
