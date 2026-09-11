// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS } from './constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const alertJs = fs.readFileSync(path.resolve(__dirname, '../js/alert.js'), 'utf-8');

const ALERT_TYPES = ['note', 'tip', 'important', 'warning', 'caution'];

// はてなブログのMarkdownが`> [!NOTE]`から出力するHTMLを再現したもの
// 改行は設定や行末スペースにより`<br />`になる場合と改行文字のままの場合がある
// 空行で区切った連続する引用は、はてなブログでは1つのblockquoteに結合される(#merged)
const FIXTURE = `
<blockquote id="alert-br"><p>[!NOTE]<br />
brで改行されたケース</p></blockquote>
<blockquote id="alert-newline"><p>[!TIP]
改行文字のままのケース</p></blockquote>
<blockquote id="alert-multi"><p>[!IMPORTANT]<br />
<a href="#alert-multi">リンク</a>と<code>code</code>を含むケース</p>
<p>2段落目</p></blockquote>
<blockquote id="alert-marker-only"><p>[!WARNING]</p>
<p>マーカーだけの段落のケース</p></blockquote>
<blockquote id="alert-lowercase"><p>[!caution]<br />
小文字マーカーのケース</p></blockquote>
<div id="merged-start"></div>
<blockquote id="merged"><p>普通の引用</p>

<p>[!NOTE]
結合された1つ目</p>

<p>[!TIP]
結合された2つ目</p>

<p>[!WARNING]</p>

<p>マーカーだけの段落のあとの本文</p>

<p>続きの段落</p></blockquote>
<div id="merged-end"></div>
<blockquote id="neg-trailing"><p>[!NOTE] 同じ行に本文があるケース</p></blockquote>
<blockquote id="neg-inline"><p>[!NOTE]<strong>強調が直後に続くケース</strong></p></blockquote>
<blockquote id="neg-unknown"><p>[!INFO]<br />
未定義の種類</p></blockquote>
<blockquote id="neg-plain"><p>普通の引用</p></blockquote>
<ul><li><blockquote id="neg-nested"><p>[!NOTE]<br />
リスト内の引用</p></blockquote></li></ul>
`;

/**
 * 記事末尾にフィクスチャを追加し、アラート変換スクリプトを実行する
 * @param {import('./helpers.js').CustomPage} page
 */
const setupFixture = async (page) => {
  await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
  await page.evaluate((html) => {
    document.querySelector('.entry-content')?.insertAdjacentHTML('beforeend', html);
  }, FIXTURE);
  await page.evaluate(alertJs);
};

test.describe('アラート記法', () => {
  test('はてなブログが出力する引用をアラートに変換する', async ({ page }) => {
    await setupFixture(page);

    const expected = [
      { id: 'alert-br', type: 'note', title: 'Note', body: 'brで改行されたケース' },
      { id: 'alert-newline', type: 'tip', title: 'Tip', body: '改行文字のままのケース' },
      { id: 'alert-multi', type: 'important', title: 'Important', body: 'リンクとcodeを含むケース' },
      { id: 'alert-marker-only', type: 'warning', title: 'Warning', body: 'マーカーだけの段落のケース' },
      { id: 'alert-lowercase', type: 'caution', title: 'Caution', body: '小文字マーカーのケース' },
    ];

    for (const { id, type, title, body } of expected) {
      const alert = page.locator(`#${id}`);
      await expect(alert).toHaveClass(`markdown-alert markdown-alert-${type}`);

      // タイトルが先頭に1つだけ挿入される
      await expect(alert.locator('.markdown-alert-title')).toHaveCount(1);
      await expect(alert.locator(':scope > :first-child')).toHaveText(title);

      // マーカーは消え、本文はタイトルの次の段落に残る
      await expect(alert).not.toContainText('[!');
      await expect(alert.locator(':scope > .markdown-alert-title + p')).toHaveText(body);
    }

    // 本文中のリンクや2段落目はそのまま残る
    await expect(page.locator('#alert-multi a[href="#alert-multi"]')).toHaveText('リンク');
    await expect(page.locator('#alert-multi > p')).toHaveCount(3);

    // マーカーだけの段落は取り除かれる
    await expect(page.locator('#alert-marker-only > p')).toHaveCount(2);
  });

  test('結合された引用をマーカーごとのアラートに分割する', async ({ page }) => {
    await setupFixture(page);

    const blocks = await page.evaluate(() => {
      const result = [];
      let node = document.getElementById('merged-start')?.nextElementSibling;
      while (node && node.id !== 'merged-end') {
        result.push({
          className: node.className,
          paragraphs: Array.from(node.querySelectorAll(':scope > p')).map((p) => p.textContent?.trim()),
        });
        node = node.nextElementSibling;
      }
      return result;
    });

    expect(blocks).toEqual([
      // マーカーより前の段落は通常の引用のまま残る
      { className: '', paragraphs: ['普通の引用'] },
      { className: 'markdown-alert markdown-alert-note', paragraphs: ['Note', '結合された1つ目'] },
      { className: 'markdown-alert markdown-alert-tip', paragraphs: ['Tip', '結合された2つ目'] },
      // 次のマーカーまでの段落は同じアラートに含まれる
      { className: 'markdown-alert markdown-alert-warning', paragraphs: ['Warning', 'マーカーだけの段落のあとの本文', '続きの段落'] },
    ]);
  });

  test('アラート記法でない引用は変換しない', async ({ page }) => {
    await setupFixture(page);

    for (const id of ['neg-trailing', 'neg-inline', 'neg-unknown', 'neg-plain', 'neg-nested']) {
      const blockquote = page.locator(`#${id}`);
      await expect(blockquote).not.toHaveClass(/markdown-alert/);
      await expect(blockquote.locator('.markdown-alert-title')).toHaveCount(0);
    }
    await expect(page.locator('#neg-trailing')).toContainText('[!NOTE]');
  });

  test('スクリプトを複数回実行しても結果が変わらない', async ({ page }) => {
    await setupFixture(page);
    const before = await page.locator('.entry-content').innerHTML();

    await page.evaluate(alertJs);

    expect(await page.locator('.entry-content').innerHTML()).toBe(before);
  });

  test('種類ごとに色とアイコンが適用される', async ({ page }) => {
    await setupFixture(page);

    const styles = await page.evaluate((types) => {
      const root = getComputedStyle(document.documentElement);
      const toRgb = (/** @type {string} */ color) => {
        const el = document.createElement('span');
        el.style.color = color;
        document.body.appendChild(el);
        const rgb = getComputedStyle(el).color;
        el.remove();
        return rgb;
      };
      return types.map((type) => {
        const alert = /** @type {HTMLElement} */ (document.querySelector(`.entry-content > .markdown-alert-${type}`));
        const title = /** @type {HTMLElement} */ (alert.querySelector('.markdown-alert-title'));
        const icon = getComputedStyle(title, '::before');
        return {
          type,
          expectedColor: toRgb(root.getPropertyValue(`--alert-${type}`).trim()),
          borderColor: getComputedStyle(alert).borderLeftColor,
          titleColor: getComputedStyle(title).color,
          bodyColor: getComputedStyle(/** @type {HTMLElement} */ (title.nextElementSibling)).color,
          textBodyColor: toRgb(root.getPropertyValue('--text-body').trim()),
          iconMask: icon.maskImage || icon.getPropertyValue('-webkit-mask-image'),
          iconBackground: icon.backgroundColor,
        };
      });
    }, ALERT_TYPES);

    const colors = new Set();
    for (const s of styles) {
      // 枠線・タイトル・アイコンが同じ種類の色になる
      expect(s.borderColor, s.type).toBe(s.expectedColor);
      expect(s.titleColor, s.type).toBe(s.expectedColor);
      expect(s.iconBackground, s.type).toBe(s.expectedColor);
      expect(s.iconMask, s.type).toContain('data:image/svg+xml');
      // 本文は通常の引用の薄い色ではなく本文色
      expect(s.bodyColor, s.type).toBe(s.textBodyColor);
      colors.add(s.expectedColor);
    }
    expect(colors.size).toBe(ALERT_TYPES.length);

    await page.locator('#alert-br').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/alert-light.png', fullPage: false });
  });

  test('ダークモードではダーク用の色になる', async ({ page }) => {
    await setupFixture(page);

    const lightColor = await page.locator('#alert-br').evaluate((el) => getComputedStyle(el).borderLeftColor);
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-enable-dark-mode', 'true');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    const darkColor = await page.locator('#alert-br').evaluate((el) => getComputedStyle(el).borderLeftColor);

    expect(darkColor).not.toBe(lightColor);

    await page.locator('#alert-br').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/alert-dark.png', fullPage: false });
  });

  for (const [label, url] of [['日本語', TEST_URLS.SAMPLE_ARTICLE], ['英語', TEST_URLS.SAMPLE_ARTICLE_EN]]) {
    test(`サンプル記事(${label})のアラート記法が変換される`, async ({ page }) => {
      await page.navigateTo(url, { waitFor: 'networkidle' });
      await page.evaluate(alertJs);

      const alerts = page.locator('.entry-content > blockquote.markdown-alert');
      await expect(alerts).toHaveCount(ALERT_TYPES.length);
      for (const [index, type] of ALERT_TYPES.entries()) {
        await expect(alerts.nth(index)).toHaveClass(`markdown-alert markdown-alert-${type}`);
        await expect(alerts.nth(index)).not.toContainText('[!');
      }
    });
  }
});
