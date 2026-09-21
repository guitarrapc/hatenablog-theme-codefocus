// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS } from './constants.js';

/**
 * WCAG 2.2 SC 2.5.8 Target Size (Minimum) の検証。
 *
 * 小さな文字のリンクはタップ領域が24x24pxを下回り、スマホでは隣のリンクと近接して
 * 間隔の例外も満たせなかった(日付 50x11、短いカテゴリ 18x12、ブックマーク0件のカウンター 5.5x17)。
 */

const MIN_SIZE = 24;
/** 間隔の例外: 小さいターゲットの中心から半径12pxの円に、他のターゲットが入らないこと */
const SPACING_RADIUS = MIN_SIZE / 2;

/** テーマ側でタップ領域を24x24px以上に広げた要素 */
const SIZED_TARGETS = [
  { name: '記事一覧のカテゴリ', url: TEST_URLS.HOME, selector: '.archive-entry .categories a' },
  { name: 'サイドバー最新記事の日付', url: TEST_URLS.HOME, selector: '#box2-inner .urllist-date-link a' },
  { name: '関連記事の日付', url: TEST_URLS.SAMPLE_ARTICLE, selector: '.entry-footer .related-entries .urllist-date-link a' },
];

test.describe('タップ領域のサイズ (WCAG 2.5.8)', () => {
  for (const { name, url, selector } of SIZED_TARGETS) {
    test(`${name}が${MIN_SIZE}x${MIN_SIZE}px以上ある`, async ({ page }) => {
      await page.navigateTo(url, { waitFor: 'networkidle' });

      const sizes = await page.locator(selector).evaluateAll(els => els
        .map(el => el.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0)
        .map(r => ({ width: r.width, height: r.height })));

      expect(sizes.length, `${selector} が表示されていない`).toBeGreaterThan(0);
      for (const size of sizes) {
        expect(size.width, `${selector} の幅`).toBeGreaterThanOrEqual(MIN_SIZE);
        expect(size.height, `${selector} の高さ`).toBeGreaterThanOrEqual(MIN_SIZE);
      }
    });
  }

  // ブックマーク0件だとカウンター画像が1x1pxになり、幅を24px確保すると空白でスターがずれる。
  // そのため幅は確保せず、右のスター・左のサムネイル(スマホ)との間隔で例外を満たしている
  test('記事一覧のブックマーク数が24x24px以上か、隣接するリンクと十分離れている', async ({ page }) => {
    await page.navigateTo(TEST_URLS.HOME, { waitFor: 'networkidle' });

    const results = await page.locator('.archive-entry').evaluateAll(entries => entries.flatMap(entry => {
      // .bookmark-widget-counterはラッパーではなく<a>そのもの(<a class="bookmark-widget-counter"><img></a>)
      const counter = entry.querySelector('.social-buttons a.bookmark-widget-counter')?.getBoundingClientRect();
      if (!counter || counter.width === 0) {
        return [];
      }
      const cx = counter.left + counter.width / 2;
      const cy = counter.top + counter.height / 2;
      return [
        ['スター', entry.querySelector('.social-buttons .star-container')],
        ['サムネイル', entry.querySelector('.entry-thumb-link')],
      ].flatMap(([neighbor, el]) => {
        const r = el?.getBoundingClientRect();
        if (!r || r.width === 0) {
          return [];
        }
        const dx = Math.max(r.left - cx, 0, cx - r.right);
        const dy = Math.max(r.top - cy, 0, cy - r.bottom);
        return [{ neighbor, width: counter.width, height: counter.height, distance: Math.hypot(dx, dy) }];
      });
    }));

    expect(results.length, 'ブックマーク数が表示されていない').toBeGreaterThan(0);
    for (const { neighbor, width, height, distance } of results) {
      expect(height, 'ブックマーク数の高さ').toBeGreaterThanOrEqual(MIN_SIZE);
      if (width < MIN_SIZE) {
        expect(distance, `幅${width}pxのブックマーク数と${neighbor}の距離`).toBeGreaterThanOrEqual(SPACING_RADIUS);
      }
    }
  });
});
