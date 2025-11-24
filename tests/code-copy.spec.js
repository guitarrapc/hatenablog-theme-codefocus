// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS, VIEWPORTS, TIMEOUTS, VALUES } from './constants.js';

test.describe('Code Copy Feature', () => {
  test('Copy button appears on hover and is clickable', async ({ page }) => {
    await page.navigateTo(TEST_URLS.CODE_HIGHLIGHT, { waitFor: 'networkidle' });

    // 最初のコードブロックを取得
    const codeBlock = await page.locator('pre.code').first();
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

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/code-copy-button-visible.png' });

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

    expect(copyButtons.length).toEqual(codeBlocks.length);

    // 少なくともいくつかのコードブロックがあることを確認
    expect(codeBlocks.length).toBeGreaterThan(0);

    // 最初のコードブロックにホバーしてスクリーンショットを撮影
    await codeBlocks[0].hover();
    await page.waitForTimeout(500);

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/code-copy-all-blocks.png' });
  });
});
