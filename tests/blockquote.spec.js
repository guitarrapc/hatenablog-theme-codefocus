// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS } from './constants.js';

// 最後の要素が段落・リスト・コードブロック・ネストしたリストの引用
const FIXTURE = `
<blockquote id="bq-paragraph"><p>1段落目</p><p>最後の段落</p></blockquote>
<blockquote id="bq-list"><p>次の点に注意してください。</p><ul><li>項目1</li><li>項目2</li></ul></blockquote>
<blockquote id="bq-nested-list"><ul><li>項目1<ul><li>ネストした項目</li></ul></li></ul></blockquote>
<blockquote id="bq-code"><p>次のコマンドを実行します。</p><pre class="code">npm run build</pre></blockquote>
<p id="bq-end">ここまで</p>
`;

/**
 * 引用の上端から最初の要素、最後の要素から下端までの距離と、段落と次の要素の間隔を測る
 * @param {import('@playwright/test').Page} page
 * @param {string} id
 */
const measure = (page, id) => page.locator(`#${id}`).evaluate((el) => {
  const box = el.getBoundingClientRect();
  const children = Array.from(el.children).filter((child) => !child.matches('.js-requote-button'));
  const first = children[0];
  const last = children[children.length - 1];
  const intro = children.length > 1 && first.tagName === 'P' ? first : null;
  // リストは最後の項目、コードブロックは見た目の下端を最後の要素の下端とする
  const lastBottom = Math.max(...Array.from(last.querySelectorAll('*')).concat(last).map((node) => node.getBoundingClientRect().bottom));
  return {
    top: Math.round(first.getBoundingClientRect().top - box.top),
    bottom: Math.round(box.bottom - lastBottom),
    introGap: intro ? Math.round(children[1].getBoundingClientRect().top - intro.getBoundingClientRect().bottom) : null,
    height: box.height,
  };
});

test.describe('引用の余白', () => {
  test.beforeEach(async ({ page }) => {
    await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'domcontentloaded' });
    await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--border-bq') !== '');
    await page.evaluate((html) => document.querySelector('.entry-content')?.insertAdjacentHTML('beforeend', html), FIXTURE);
  });

  test('最後の要素が段落以外でも、引用の上下の余白が揃う', async ({ page }) => {
    for (const id of ['bq-paragraph', 'bq-list', 'bq-nested-list', 'bq-code']) {
      const { top, bottom } = await measure(page, id);
      expect(bottom, id).toBe(top);
    }
  });

  test('引用の中の段落と、続くリストやコードブロックの間に余白がある', async ({ page }) => {
    for (const id of ['bq-list', 'bq-code']) {
      const { introGap } = await measure(page, id);
      expect(introGap, id).toBeGreaterThan(0);
    }
  });

  test('はてなブログの引用ボタンが追加されても引用の高さが変わらない', async ({ page }) => {
    // はてなブログはホバー時に引用の末尾へ引用ボタン(div.requote-button.js-requote-button, position: absolute)を追加する
    for (const id of ['bq-paragraph', 'bq-list', 'bq-code']) {
      const before = await measure(page, id);
      await page.locator(`#${id}`).evaluate((el) => {
        const button = document.createElement('div');
        button.className = 'requote-button js-requote-button';
        button.style.position = 'absolute';
        el.appendChild(button);
      });
      const after = await measure(page, id);
      expect(after.height, id).toBe(before.height);
      expect(after.bottom, id).toBe(before.top);
    }
  });
});
