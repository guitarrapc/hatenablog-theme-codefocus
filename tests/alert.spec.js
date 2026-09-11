// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS } from './constants.js';
import * as fs from 'fs';
import * as http from 'http';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const alertJs = fs.readFileSync(path.resolve(__dirname, '../js/alert.js'), 'utf-8');

const ALERT_TYPES = ['note', 'tip', 'important', 'warning', 'caution'];

// component-specs.mdの配色表と同じ値
const ALERT_COLORS = {
  light: {
    note: 'rgb(9, 105, 218)',
    tip: 'rgb(26, 127, 55)',
    important: 'rgb(130, 80, 223)',
    warning: 'rgb(154, 103, 0)',
    caution: 'rgb(209, 36, 47)',
  },
  dark: {
    note: 'rgb(68, 147, 248)',
    tip: 'rgb(63, 185, 80)',
    important: 'rgb(171, 125, 248)',
    warning: 'rgb(210, 153, 34)',
    caution: 'rgb(248, 81, 73)',
  },
};

// component-specs.mdの表で決めた種類ごとのアイコンの形(丸にi、電球、吹き出し、三角、八角形)を表すSVG要素
const ICON_SHAPES = {
  note: "<circle cx='8' cy='8' r='6.25'/>",
  tip: "<path d='M5.75 10.5A4.5 4.5 0 1 1 10.25 10.5V12h-4.5z'/>",
  important: "<path d='M2.5 3.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7.5L4.5 14v-2.5h-1a1 1 0 0 1-1-1z'/>",
  warning: "<path d='M7.13 2.5a1 1 0 0 1 1.74 0l5.63 9.99a1 1 0 0 1-.87 1.49H2.37a1 1 0 0 1-.87-1.49z'/>",
  caution: "<path d='M5.3 1.75h5.4l3.55 3.55v5.4l-3.55 3.55H5.3l-3.55-3.55V5.3z'/>",
};

// はてなブログのMarkdownが`> [!NOTE]`から出力するHTMLを再現したもの
// 改行は設定や行末スペースにより`<br />`になる場合と改行文字のままの場合がある
// 空行で区切った連続する引用は、はてなブログでは1つのblockquoteに結合される(#merged, #merged-empty)
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
<blockquote id="alert-newline-inline"><p>[!NOTE]
<strong>強調</strong>で始まる本文のケース</p></blockquote>
<blockquote id="alert-space-br"><p>[!TIP] <br />
マーカーの後に空白があるbrのケース</p></blockquote>
<blockquote id="alert-space-newline"><p>[!IMPORTANT]\u0020
マーカーの後に空白がある改行のケース</p></blockquote>
<blockquote id="alert-trailing-spaces"><p>[!WARNING]  </p>
<p>段落の末尾に複数の空白が残るケース</p></blockquote>
<blockquote id="alert-tab"><p>[!NOTE]\t
マーカーの後にタブがあるケース</p></blockquote>
<blockquote id="alert-nbsp-body"><p>[!NOTE]<br />
&nbsp;</p></blockquote>
<blockquote id="alert-nbsp-newline"><p>[!TIP]
&nbsp;</p></blockquote>
<blockquote id="alert-mixed-case"><p>[!Note]<br />
大文字小文字が混ざったケース</p></blockquote>
<blockquote id="alert-marker-list"><p>[!TIP]</p>
<ul><li>リストの本文</li></ul></blockquote>
<blockquote id="alert-marker-code"><p>[!IMPORTANT]</p>
<pre class="code">コードの本文</pre></blockquote>
<blockquote id="alert-image"><p>[!WARNING]<br />
<span itemscope><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="画像"></span></p></blockquote>
<blockquote id="alert-leading-space">
<p>[!CAUTION]<br />
段落の前に空白があるケース</p></blockquote>
<blockquote id="alert-marker-like-body"><p>[!NOTE]
[!TIP]
本文の1行目がマーカーのケース</p></blockquote>
<blockquote id="alert-marker-br-only"><p>[!WARNING]<br />
</p>
<p>マーカーとbrだけの段落のケース</p></blockquote>
<div id="merged-start"></div>
<blockquote id="merged" cite="https://example.com/"><p>普通の引用</p>

<p>[!NOTE]
結合された1つ目</p>

<p>[!TIP]
結合された2つ目</p>

<p>[!WARNING]</p>

<p>マーカーだけの段落のあとの本文</p>

<p>続きの段落</p></blockquote>
<div id="merged-end"></div>
<div id="merged-first-start"></div>
<blockquote id="merged-first"><p>[!NOTE]
先頭がマーカーの1つ目</p>

<p>[!TIP]
先頭がマーカーの2つ目</p></blockquote>
<div id="merged-first-end"></div>
<div id="merged-blocks-start"></div>
<blockquote id="merged-blocks"><p>[!NOTE]
1つ目</p>

<p>[!TIP]</p>

<ul><li>リストの本文</li></ul>

<p>[!IMPORTANT]</p>

<pre class="code">コードの本文</pre></blockquote>
<div id="merged-blocks-end"></div>
<div id="merged-trailing-empty-start"></div>
<blockquote id="merged-trailing-empty"><p>[!NOTE]
アラートの本文</p>

<p>[!TIP]</p>

<p>[!WARNING]
次のアラートの本文</p></blockquote>
<div id="merged-trailing-empty-end"></div>
<div id="merged-empty-start"></div>
<blockquote id="merged-empty"><p>[!NOTE]</p>

<p>[!TIP]
本文のあるアラート</p></blockquote>
<div id="merged-empty-end"></div>
<blockquote id="neg-trailing"><p>[!NOTE] 同じ行に本文があるケース</p></blockquote>
<blockquote id="neg-trailing-newline"><p>[!NOTE] 同じ行に本文があり
2行目が続くケース</p></blockquote>
<blockquote id="neg-trailing-br"><p>[!NOTE] 同じ行に本文があり<br />
brで2行目が続くケース</p></blockquote>
<blockquote id="neg-trailing-paragraph"><p>[!NOTE] 同じ行に本文があり</p>
<p>次の段落が続くケース</p></blockquote>
<blockquote id="neg-inline"><p>[!NOTE]<strong>強調が直後に続くケース</strong></p></blockquote>
<blockquote id="neg-inline-text"><p>[!NOTE]<strong>強調</strong>の後に本文が続くケース</p></blockquote>
<blockquote id="neg-pre"><pre>[!NOTE]
コードブロックのケース</pre></blockquote>
<blockquote id="neg-heading"><h4>[!NOTE]</h4><p>見出しのケース</p></blockquote>
<blockquote id="neg-br-only"><p>[!NOTE]<br /></p></blockquote>
<blockquote id="alert-br-body"><p>[!NOTE]<br /><br /></p></blockquote>
<blockquote id="neg-comment"><p>[!NOTE]</p><!-- コメントだけのケース --></blockquote>
<blockquote id="neg-middle"><p>書き方は [!NOTE]
のように書くケース</p></blockquote>
<blockquote id="neg-later-line"><p>GitHubでは次の2行で書く
[!NOTE]
マーカーが2行目にあるケース</p></blockquote>
<blockquote id="neg-fullwidth-after"><p>[!NOTE]\u3000
マーカーの後に全角スペースがあるケース</p></blockquote>
<blockquote id="neg-fullwidth-before"><p>\u3000[!NOTE]<br />
マーカーの前に全角スペースがあるケース</p></blockquote>
<blockquote id="neg-nbsp-before"><p>&nbsp;[!NOTE]<br />
マーカーの前にnbspがあるケース</p></blockquote>
<blockquote id="neg-nbsp-after"><p>[!NOTE]&nbsp;<br />
マーカーの後にnbspがあるケース</p></blockquote>
<blockquote id="neg-unknown"><p>[!INFO]<br />
未定義の種類</p></blockquote>
<blockquote id="neg-empty"><p>[!NOTE]</p></blockquote>
<blockquote id="neg-plain"><p>普通の引用</p></blockquote>
<blockquote id="neg-embed" class="twitter-tweet"><p lang="ja">[!NOTE]<br />
埋め込みツイート</p></blockquote>
<ul><li><blockquote id="neg-nested"><p>[!NOTE]<br />
リスト内の引用</p></blockquote></li></ul>
`;

/**
 * 記事末尾にフィクスチャを追加し、アラート変換スクリプトを実行する
 * @param {import('./helpers.js').CustomPage} page
 */
const setupFixture = async (page) => {
  // 広告などの読み込み完了(networkidle)は待たず、テーマのCSSが適用されるまで待つ
  await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'domcontentloaded' });
  await page.waitForFunction(() => getComputedStyle(document.documentElement).getPropertyValue('--alert-note') !== '');
  await page.evaluate((html) => {
    document.querySelector('.entry-content')?.insertAdjacentHTML('beforeend', html);
    // 変換後も本文の要素が作り直されず同じノードのまま残るか確認するため、変換前のノードを覚えておく
    /** @type {any} */ (window).bodyNodes = ['#alert-multi a', '#alert-multi code', '#alert-newline-inline strong', '#alert-image img']
      .map((selector) => ({ selector, node: document.querySelector(selector) }));
  }, FIXTURE);
  await page.evaluate(alertJs);
};

/**
 * アラートのアイコン(タイトル左の1em四方)が実際に描画されているかを、アイコンを隠した状態と画素で比較して確かめる
 * @param {import('@playwright/test').Page} page
 * @param {string} type
 */
const isIconPainted = async (page, type) => {
  const title = page.locator(`.entry-content > .markdown-alert-${type} > .markdown-alert-title`).first();
  await title.scrollIntoViewIfNeeded();
  const clip = await title.evaluate((el) => {
    const rect = el.getBoundingClientRect();
    const size = parseFloat(getComputedStyle(el).fontSize);
    return { x: rect.left + window.scrollX, y: rect.top + window.scrollY + (rect.height - size) / 2, width: size, height: size };
  });
  const withIcon = await page.screenshot({ clip, fullPage: true });
  await page.evaluate(() => {
    const style = document.createElement('style');
    style.id = 'hide-alert-icon';
    style.textContent = '.markdown-alert-title::before { visibility: hidden; }';
    document.head.appendChild(style);
  });
  const withoutIcon = await page.screenshot({ clip, fullPage: true });
  await page.evaluate(() => document.getElementById('hide-alert-icon')?.remove());
  return !withIcon.equals(withoutIcon);
};

/**
 * 開始マーカーから終了マーカーまでの兄弟要素を、クラスと直下の段落テキストの一覧にする
 * @param {import('@playwright/test').Page} page
 * @param {string} startId
 * @param {string} endId
 */
const collectBlocks = (page, startId, endId) => page.evaluate(([start, end]) => {
  const result = [];
  let node = document.getElementById(start)?.nextElementSibling;
  while (node && node.id !== end) {
    result.push({
      className: node.className,
      id: node.id,
      cite: node.getAttribute('cite'),
      paragraphs: Array.from(node.querySelectorAll(':scope > p')).map((p) => p.textContent?.trim()),
    });
    node = node.nextElementSibling;
  }
  return result;
}, [startId, endId]);

/**
 * アラートの種類ごとに、枠線・タイトル・アイコンの計算済みスタイルを取得する
 * @param {import('@playwright/test').Page} page
 */
const getAlertStyles = (page) => page.evaluate((types) => types.map((type) => {
  const alert = /** @type {HTMLElement} */ (document.querySelector(`.entry-content > .markdown-alert-${type}`));
  const title = /** @type {HTMLElement} */ (alert.querySelector('.markdown-alert-title'));
  const icon = getComputedStyle(title, '::before');
  // タイトル文字の左端がアイコンの幅だけ右にずれていれば、アイコンが描画されている
  const text = document.createRange();
  text.selectNodeContents(title);
  return {
    type,
    iconContent: icon.content,
    textOffsetEm: (text.getBoundingClientRect().left - title.getBoundingClientRect().left) / parseFloat(getComputedStyle(title).fontSize),
    borderColor: getComputedStyle(alert).borderLeftColor,
    borderWidth: getComputedStyle(alert).borderLeftWidth,
    titleColor: getComputedStyle(title).color,
    bodyColor: getComputedStyle(/** @type {HTMLElement} */ (title.nextElementSibling)).color,
    iconMask: icon.maskImage || icon.getPropertyValue('-webkit-mask-image'),
    iconBackground: icon.backgroundColor,
    iconPrintColorAdjust: icon.getPropertyValue('print-color-adjust') || icon.getPropertyValue('-webkit-print-color-adjust'),
  };
}), ALERT_TYPES);

test.describe('アラート記法', () => {
  test('はてなブログが出力する引用をアラートに変換する', async ({ page }) => {
    await setupFixture(page);

    const expected = [
      { id: 'alert-br', type: 'note', title: 'Note', body: 'brで改行されたケース' },
      { id: 'alert-newline', type: 'tip', title: 'Tip', body: '改行文字のままのケース' },
      { id: 'alert-multi', type: 'important', title: 'Important', body: '<a href="#alert-multi">リンク</a>と<code>code</code>を含むケース' },
      { id: 'alert-marker-only', type: 'warning', title: 'Warning', body: 'マーカーだけの段落のケース' },
      { id: 'alert-lowercase', type: 'caution', title: 'Caution', body: '小文字マーカーのケース' },
      { id: 'alert-newline-inline', type: 'note', title: 'Note', body: '<strong>強調</strong>で始まる本文のケース' },
      { id: 'alert-space-br', type: 'tip', title: 'Tip', body: 'マーカーの後に空白があるbrのケース' },
      { id: 'alert-space-newline', type: 'important', title: 'Important', body: 'マーカーの後に空白がある改行のケース' },
      { id: 'alert-tab', type: 'note', title: 'Note', body: 'マーカーの後にタブがあるケース' },
      // `> [!WARNING]␣␣` の後に`>`だけの行を挟むと、段落の末尾に空白が残る
      { id: 'alert-trailing-spaces', type: 'warning', title: 'Warning', body: '段落の末尾に複数の空白が残るケース' },
      // &nbsp;だけの本文も本文として扱う(GitHubと同じ)
      { id: 'alert-nbsp-body', type: 'note', title: 'Note', body: '&nbsp;' },
      // マーカーの行末の<br>の後にある<br>も本文として扱う(GitHubと同じ)
      { id: 'alert-br-body', type: 'note', title: 'Note', body: '<br>' },
      { id: 'alert-nbsp-newline', type: 'tip', title: 'Tip', body: '&nbsp;' },
      { id: 'alert-mixed-case', type: 'note', title: 'Note', body: '大文字小文字が混ざったケース' },
      { id: 'alert-image', type: 'warning', title: 'Warning', body: '<span itemscope=""><img src="data:image/gif;base64,R0lGODlhAQABAAAAACw=" alt="画像"></span>' },
      { id: 'alert-leading-space', type: 'caution', title: 'Caution', body: '段落の前に空白があるケース' },
      // GitHubと同じく、本文の1行目は2つ目のマーカーでも本文として扱う
      { id: 'alert-marker-like-body', type: 'note', title: 'Note', body: '[!TIP]\n本文の1行目がマーカーのケース' },
    ];

    for (const { id, type, title, body } of expected) {
      const alert = page.locator(`#${id}`);
      await expect(alert, id).toHaveClass(`markdown-alert markdown-alert-${type}`);

      // タイトルが先頭に1つだけ挿入される
      await expect(alert.locator('.markdown-alert-title'), id).toHaveCount(1);
      await expect(alert.locator(':scope > :first-child'), id).toHaveText(title);

      // マーカーと直後の改行(<br>)は消え、本文の要素はそのまま残る
      const bodyHtml = await alert.locator(':scope > .markdown-alert-title + p').evaluate((p) => p.innerHTML.trim());
      expect(bodyHtml, id).toBe(body);
    }

    // 2段落目はそのまま残り、マーカーだけの段落(改行やbrだけが残る段落も)は取り除かれる
    await expect(page.locator('#alert-multi > p')).toHaveCount(3);
    await expect(page.locator('#alert-marker-only > p')).toHaveCount(2);
    await expect(page.locator('#alert-marker-br-only > p')).toHaveCount(2);
    await expect(page.locator('#alert-marker-br-only > .markdown-alert-title + p')).toHaveText('マーカーとbrだけの段落のケース');

    // はてなブログの「引用して記事を書く」は子要素のテキストをつなげて取り出すため、タイトルと本文の間に改行が残る
    for (const id of ['alert-br', 'alert-newline', 'alert-newline-inline']) {
      const requoteText = await page.locator(`#${id}`).evaluate((el) => Array.from(el.children)
        .filter((child) => !child.matches('cite, .js-requote-button'))
        .map((child) => child.textContent)
        .join(''));
      expect(requoteText, id).toMatch(/^(Note|Tip)\n/);
    }

    // マーカーだけの段落の後のリストやコードブロックも本文になる
    await expect(page.locator('#alert-marker-list')).toHaveClass('markdown-alert markdown-alert-tip');
    await expect(page.locator('#alert-marker-list > .markdown-alert-title + ul')).toHaveText('リストの本文');
    await expect(page.locator('#alert-marker-code')).toHaveClass('markdown-alert markdown-alert-important');
    await expect(page.locator('#alert-marker-code > .markdown-alert-title + pre')).toHaveText('コードの本文');

    // 段落の前に空白があっても、空の引用を残さず元の引用がアラートになる
    await expect(page.locator('.entry-content > blockquote:not(:has(*))')).toHaveCount(0);

    // 本文のリンクや画像などの要素は作り直さず、変換前と同じノードのまま残る
    const bodyNodes = await page.evaluate(() => /** @type {any} */ (window).bodyNodes.map(
      (/** @type {{ selector: string, node: Element }} */ { selector, node }) => ({ selector, kept: node.isConnected && document.querySelector(selector) === node })));
    for (const { selector, kept } of bodyNodes) {
      expect(kept, selector).toBe(true);
    }
  });

  test('結合された引用をマーカーごとのアラートに分割する', async ({ page }) => {
    await setupFixture(page);

    expect(await collectBlocks(page, 'merged-start', 'merged-end')).toEqual([
      // マーカーより前の段落は通常の引用のまま残り、idも元の引用に残る
      { className: '', id: 'merged', cite: 'https://example.com/', paragraphs: ['普通の引用'] },
      // 分割した引用も元の属性(cite)を引き継ぐが、idは重複しないよう引き継がない
      { className: 'markdown-alert markdown-alert-note', id: '', cite: 'https://example.com/', paragraphs: ['Note', '結合された1つ目'] },
      { className: 'markdown-alert markdown-alert-tip', id: '', cite: 'https://example.com/', paragraphs: ['Tip', '結合された2つ目'] },
      // 次のマーカーまでの段落は同じアラートに含まれる
      { className: 'markdown-alert markdown-alert-warning', id: '', cite: 'https://example.com/', paragraphs: ['Warning', 'マーカーだけの段落のあとの本文', '続きの段落'] },
    ]);

    // 先頭の段落がマーカーなら、元の引用が1つ目のアラートになりidを持つ
    expect(await collectBlocks(page, 'merged-first-start', 'merged-first-end')).toEqual([
      { className: 'markdown-alert markdown-alert-note', id: 'merged-first', cite: null, paragraphs: ['Note', '先頭がマーカーの1つ目'] },
      { className: 'markdown-alert markdown-alert-tip', id: '', cite: null, paragraphs: ['Tip', '先頭がマーカーの2つ目'] },
    ]);

    // 段落以外の本文(リストやコードブロック)も、それぞれのマーカーのアラートに移る
    const blocks = await page.evaluate(() => {
      const result = [];
      let node = document.getElementById('merged-blocks-start')?.nextElementSibling;
      while (node && node.id !== 'merged-blocks-end') {
        result.push({ className: node.className, children: Array.from(node.children).map((child) => `${child.tagName}:${child.textContent?.trim()}`) });
        node = node.nextElementSibling;
      }
      return result;
    });
    expect(blocks).toEqual([
      { className: 'markdown-alert markdown-alert-note', children: ['P:Note', 'P:1つ目'] },
      { className: 'markdown-alert markdown-alert-tip', children: ['P:Tip', 'UL:リストの本文'] },
      { className: 'markdown-alert markdown-alert-important', children: ['P:Important', 'PRE:コードの本文'] },
    ]);
  });

  test('本文のないマーカーはアラートにせず、そのまま表示する', async ({ page }) => {
    await setupFixture(page);

    await expect(page.locator('#neg-empty')).not.toHaveClass(/markdown-alert/);
    await expect(page.locator('#neg-empty')).toHaveText('[!NOTE]');

    expect(await collectBlocks(page, 'merged-empty-start', 'merged-empty-end')).toEqual([
      { className: '', id: 'merged-empty', cite: null, paragraphs: ['[!NOTE]'] },
      { className: 'markdown-alert markdown-alert-tip', id: '', cite: null, paragraphs: ['Tip', '本文のあるアラート'] },
    ]);

    // アラートの後にある本文のないマーカーは分割せず、直前のアラートの本文にテキストのまま含める
    expect(await collectBlocks(page, 'merged-trailing-empty-start', 'merged-trailing-empty-end')).toEqual([
      { className: 'markdown-alert markdown-alert-note', id: 'merged-trailing-empty', cite: null, paragraphs: ['Note', 'アラートの本文', '[!TIP]'] },
      { className: 'markdown-alert markdown-alert-warning', id: '', cite: null, paragraphs: ['Warning', '次のアラートの本文'] },
    ]);
  });

  test('アラート記法でない引用は変換しない', async ({ page }) => {
    await setupFixture(page);

    const negatives = {
      'neg-trailing': '[!NOTE] 同じ行に本文があるケース',
      'neg-trailing-newline': '[!NOTE] 同じ行に本文があり\n2行目が続くケース',
      'neg-trailing-br': '[!NOTE] 同じ行に本文があり\nbrで2行目が続くケース',
      'neg-trailing-paragraph': '[!NOTE] 同じ行に本文があり\n次の段落が続くケース',
      'neg-inline': '[!NOTE]強調が直後に続くケース',
      'neg-inline-text': '[!NOTE]強調の後に本文が続くケース',
      'neg-middle': '書き方は [!NOTE]\nのように書くケース',
      'neg-later-line': 'GitHubでは次の2行で書く\n[!NOTE]\nマーカーが2行目にあるケース',
      'neg-pre': '[!NOTE]\nコードブロックのケース',
      'neg-heading': '[!NOTE]見出しのケース',
      'neg-fullwidth-after': '[!NOTE]\u3000\nマーカーの後に全角スペースがあるケース',
      'neg-fullwidth-before': '[!NOTE]\nマーカーの前に全角スペースがあるケース',
      'neg-nbsp-before': '[!NOTE]\nマーカーの前にnbspがあるケース',
      'neg-nbsp-after': '[!NOTE]\u00a0\nマーカーの後にnbspがあるケース',
      'neg-unknown': '[!INFO]\n未定義の種類',
      'neg-br-only': '[!NOTE]',
      'neg-comment': '[!NOTE]',
      'neg-plain': '普通の引用',
      'neg-embed': '[!NOTE]\n埋め込みツイート',
      'neg-nested': '[!NOTE]\nリスト内の引用',
    };
    for (const [id, text] of Object.entries(negatives)) {
      const blockquote = page.locator(`#${id}`);
      await expect(blockquote, id).not.toHaveClass(/markdown-alert/);
      await expect(blockquote.locator('.markdown-alert-title'), id).toHaveCount(0);
      // 中身は書き換えない
      expect(await blockquote.evaluate((el) => el.textContent?.trim()), id).toBe(text);
    }
  });

  test('スクリプトを複数回実行しても結果が変わらない', async ({ page }) => {
    await setupFixture(page);

    // 埋め込みツイートのwidgets.jsなど他のスクリプトが非同期にDOMを変えても影響しないよう、
    // 再実行の前後の取得を1回の同期的な評価の中で行う
    const [before, after] = await page.evaluate(`(() => {
      const entry = document.querySelector('.entry-content');
      const before = entry.innerHTML;
      ${alertJs}
      return [before, entry.innerHTML];
    })()`);

    expect(after).toBe(before);
  });

  test('記事より前に置いたスクリプトが、ページの読み込み完了を待たずにアラートを変換する', async ({ page }) => {
    // 記事の後ろにある同期スクリプト(はてなブログのページ末尾のスクリプト相当)の読み込みを止めて、DOMContentLoaded前の状態を作る
    /** @type {() => void} */
    let releaseScript = () => {};
    const blocked = new Promise((resolve) => { releaseScript = () => resolve(undefined); });
    await page.route('https://alert.test/', (route) => route.fulfill({
      contentType: 'text/html; charset=utf-8',
      // 途中のscriptは、その時点で変換済みのアラート数を記録する(パーサーはscriptの実行前にMutationObserverの処理を済ませる)
      body: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<script>${alertJs}</script>
<script>window.alertCounts = [];</script>
<div class="entry-content"><blockquote><p>[!NOTE]
1つ目</p>

<p>[!TIP]
2つ目</p></blockquote>
<p>本文</p>
<script>window.alertCounts.push(document.querySelectorAll('.markdown-alert').length);</script>
<blockquote><p>[!WARNING]
記事の最後の引用</p></blockquote></div>
<script>window.alertCounts.push(document.querySelectorAll('.markdown-alert').length);</script>
<script src="https://alert.test/slow.js"></script>
</body></html>`,
    }));
    await page.route('https://alert.test/slow.js', async (route) => {
      await blocked;
      await route.fulfill({ contentType: 'text/javascript', body: '' });
    });

    try {
      await page.goto('https://alert.test/', { waitUntil: 'commit' });

      // 記事の途中でも閉じた引用から順に変換され、記事の後ではすべて変換済み
      await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).alertCounts?.length)).toBe(2);
      expect(await page.evaluate(() => /** @type {any} */ (window).alertCounts)).toEqual([2, 3]);
      expect(await page.evaluate(() => document.readyState)).toBe('loading');
    } finally {
      releaseScript();
    }
    await page.waitForLoadState('domcontentloaded');
    await expect(page.locator('.entry-content > blockquote.markdown-alert')).toHaveCount(3);
    await expect(page.locator('.entry-content')).not.toContainText('[!');
  });

  test('ページを分割して受信しても、閉じる前の引用は途中で変換しない', async ({ page }) => {
    // 結合された引用の途中までを送った状態で止め、パーサーが引用を閉じる前に変換しないことを確認する
    /** @type {() => void} */
    let sendRest = () => {};
    const restReady = new Promise((resolve) => { sendRest = () => resolve(undefined); });
    const server = http.createServer(async (_req, res) => {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write(`<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
<script>${alertJs}</script>
<!-- ${'padding '.repeat(1000)} -->
<div class="entry-content"><blockquote id="streamed"><p>[!NOTE]
1つ目</p>

`);
      await restReady;
      res.end(`<p>[!TIP]
2つ目</p></blockquote>
<p>本文</p></div>
</body></html>`);
    });
    await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
    const { port } = /** @type {import('net').AddressInfo} */ (server.address());

    try {
      await page.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'commit' });
      await expect(page.locator('#streamed > p')).toHaveCount(1);
      await expect(page.locator('#streamed')).not.toHaveClass(/markdown-alert/);

      sendRest();
      await page.waitForLoadState('domcontentloaded');
      const alerts = page.locator('.entry-content > blockquote.markdown-alert');
      await expect(alerts).toHaveCount(2);
      await expect(alerts.nth(0)).toHaveClass('markdown-alert markdown-alert-note');
      await expect(alerts.nth(1)).toHaveClass('markdown-alert markdown-alert-tip');
    } finally {
      sendRest();
      server.close();
    }
  });

  test('DOMContentLoadedで残りを変換して監視をやめ、読み込み後に実行しても変換する', async ({ page }) => {
    // 記事の最後の引用の後ろに何もないため、パーサーが閉じたか判断できず、DOMContentLoadedで変換される
    // 画像の読み込みを止めてloadイベントを遅らせ、DOMContentLoaded後・load前(readyState=interactive)の状態を作る
    /** @type {() => void} */
    let releaseImage = () => {};
    const blocked = new Promise((resolve) => { releaseImage = () => resolve(undefined); });
    await page.route('https://alert.test/', (route) => route.fulfill({
      contentType: 'text/html; charset=utf-8',
      // alert.jsより後に登録したDOMContentLoadedのリスナーで、その時点の変換結果を記録する
      body: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><script>${alertJs}</script><script>document.addEventListener('DOMContentLoaded', () => { window.classAtDomContentLoaded = document.getElementById('last').className; });</script><img src="https://alert.test/slow.png" alt=""><div class="entry-content"><blockquote id="last"><p>[!NOTE]
ページ末尾の引用</p></blockquote></div></body></html>`,
    }));
    await page.route('https://alert.test/slow.png', async (route) => {
      await blocked;
      await route.fulfill({ status: 404 });
    });

    try {
      await page.goto('https://alert.test/', { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => /** @type {any} */ (window).classAtDomContentLoaded)).toBe('markdown-alert markdown-alert-note');

      // 監視をやめているため、読み込み後に追加された引用は(閉じた状態でも)変換しない
      await page.evaluate(() => {
        document.querySelector('.entry-content')?.insertAdjacentHTML('beforeend', `<blockquote id="added"><p>[!TIP]
読み込み後に追加した引用</p></blockquote><p>後続の段落</p><blockquote id="added-last"><p>[!WARNING]
後ろに何もない引用</p></blockquote>`);
      });
      await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 0)));
      await expect(page.locator('#added')).not.toHaveClass(/markdown-alert/);

      // DOMContentLoaded後(load前)にスクリプトを実行すると、後ろに何もない引用もすぐに変換する
      expect(await page.evaluate(() => document.readyState)).toBe('interactive');
      await page.evaluate(alertJs);
      expect(await page.evaluate(() => [document.getElementById('added')?.className, document.getElementById('added-last')?.className]))
        .toEqual(['markdown-alert markdown-alert-tip', 'markdown-alert markdown-alert-warning']);
    } finally {
      releaseImage();
    }
  });

  test('分割したアラートに移したiframeは読み込み直さない', async ({ page }) => {
    // 2つ目以降のアラートの本文は新しい引用へ移動するため、移動でiframeが再読み込みされないことを確認する
    await page.route('https://alert.test/', (route) => route.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div class="entry-content"><blockquote><p>[!NOTE]
1つ目</p>

<p>[!TIP]
2つ目 <iframe id="embed" srcdoc="埋め込み" onload="window.embedLoads = (window.embedLoads || 0) + 1"></iframe></p></blockquote>
</div></body></html>`,
    }));
    await page.goto('https://alert.test/', { waitUntil: 'load' });
    await expect.poll(() => page.evaluate(() => /** @type {any} */ (window).embedLoads)).toBe(1);

    await page.evaluate(alertJs);
    await expect(page.locator('.entry-content > blockquote.markdown-alert-tip #embed')).toHaveCount(1);
    await page.evaluate(() => new Promise((resolve) => setTimeout(resolve, 500)));
    expect(await page.evaluate(() => /** @type {any} */ (window).embedLoads)).toBe(1);
  });

  test('moveBeforeのないブラウザでも結合された引用を分割する', async ({ page }) => {
    // Safariなどmoveに対応していないブラウザでは、appendChildで分割した引用へノードを移す
    await page.addInitScript(() => {
      // @ts-ignore
      delete Element.prototype.moveBefore;
    });
    await page.route('https://alert.test/', (route) => route.fulfill({
      contentType: 'text/html; charset=utf-8',
      body: `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body><div class="entry-content"><blockquote><p>普通の引用</p>

<p>[!NOTE]
1つ目</p>

<p>[!TIP]</p>

<p>2つ目の1段落目</p>

<ul><li>2つ目のリスト</li></ul></blockquote>
</div></body></html>`,
    }));
    await page.goto('https://alert.test/', { waitUntil: 'load' });
    expect(await page.evaluate(() => typeof (/** @type {any} */ (Element.prototype)).moveBefore)).toBe('undefined');

    await page.evaluate(alertJs);
    const blocks = await page.evaluate(() => Array.from(document.querySelectorAll('.entry-content > blockquote')).map((node) => ({
      className: node.className,
      children: Array.from(node.children).map((child) => `${child.tagName}:${child.textContent?.trim()}`),
    })));
    expect(blocks).toEqual([
      { className: '', children: ['P:普通の引用'] },
      { className: 'markdown-alert markdown-alert-note', children: ['P:Note', 'P:1つ目'] },
      { className: 'markdown-alert markdown-alert-tip', children: ['P:Tip', 'P:2つ目の1段落目', 'UL:2つ目のリスト'] },
    ]);
  });

  test('種類ごとに色とアイコンが適用される', async ({ page }) => {
    await setupFixture(page);

    const textBody = await page.evaluate(() => {
      const el = document.createElement('span');
      el.style.color = 'var(--text-body)';
      document.body.appendChild(el);
      const rgb = getComputedStyle(el).color;
      el.remove();
      return rgb;
    });
    const styles = await getAlertStyles(page);

    for (const s of styles) {
      // 枠線・タイトル・アイコンが種類の色になる
      const color = ALERT_COLORS.light[/** @type {keyof typeof ALERT_COLORS.light} */ (s.type)];
      expect(s.borderColor, s.type).toBe(color);
      expect(s.borderWidth, s.type).toBe('3px');
      expect(s.titleColor, s.type).toBe(color);
      expect(s.iconBackground, s.type).toBe(color);
      expect(s.iconMask, s.type).toContain('data:image/svg+xml');
      // アイコン(1em)と余白(0.5em)の分だけタイトル文字が右にあり、アイコンが実際に描画されている
      expect(s.iconContent, s.type).toBe('""');
      expect(s.textOffsetEm, s.type).toBeCloseTo(1.5, 1);
      expect(await isIconPainted(page, s.type), s.type).toBe(true);
      // 本文は通常の引用の薄い色ではなく本文色
      expect(s.bodyColor, s.type).toBe(textBody);
      // 印刷時に背景色で描いたアイコンが省略されない
      expect(s.iconPrintColorAdjust, s.type).toBe('exact');
    }
    // 種類ごとに、component-specs.mdの表で決めた形のアイコンが使われる
    for (const s of styles) {
      const iconSvg = decodeURIComponent(s.iconMask.replace(/^url\("data:image\/svg\+xml,/, '').replace(/"\)$/, ''));
      expect(iconSvg, s.type).toContain(ICON_SHAPES[/** @type {keyof typeof ICON_SHAPES} */ (s.type)]);
    }
    expect(new Set(styles.map((s) => s.iconMask)).size).toBe(ALERT_TYPES.length);

    // 段落以外の本文(リスト)も本文色になる
    expect(await page.locator('#alert-marker-list li').evaluate((el) => getComputedStyle(el).color)).toBe(textBody);

    await page.locator('#alert-br').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/alert-light.png', fullPage: false });
  });

  test('ダークモードではダーク用の色になる', async ({ page }) => {
    await setupFixture(page);

    // 枠線・タイトル・アイコンが種類のダーク用の色になり、本文がダーク用の本文色になる
    const expectDarkColors = async (/** @type {string} */ label) => {
      const textBody = await page.evaluate(() => {
        const el = document.createElement('span');
        el.style.color = 'var(--text-body)';
        document.body.appendChild(el);
        const rgb = getComputedStyle(el).color;
        el.remove();
        return rgb;
      });
      // ダーク用の本文色(_variable.scssの$dark-text-body)
      expect(textBody, label).toBe('rgb(230, 237, 243)');
      for (const s of await getAlertStyles(page)) {
        const color = ALERT_COLORS.dark[/** @type {keyof typeof ALERT_COLORS.dark} */ (s.type)];
        expect(s.borderColor, `${label} ${s.type}`).toBe(color);
        expect(s.titleColor, `${label} ${s.type}`).toBe(color);
        expect(s.iconBackground, `${label} ${s.type}`).toBe(color);
        expect(s.bodyColor, `${label} ${s.type}`).toBe(textBody);
      }
      expect(await page.locator('#alert-marker-list li').evaluate((el) => getComputedStyle(el).color), label).toBe(textBody);
    };

    // 明示的なダークモード
    await page.evaluate(() => {
      document.documentElement.setAttribute('data-enable-dark-mode', 'true');
      document.documentElement.setAttribute('data-theme', 'dark');
    });
    await expectDarkColors('data-theme=dark');

    await page.locator('#alert-br').scrollIntoViewIfNeeded();
    await page.screenshot({ path: 'screenshots/alert-dark.png', fullPage: false });

    // システム設定に追従するダークモード
    await page.evaluate(() => document.documentElement.removeAttribute('data-theme'));
    await page.emulateMedia({ colorScheme: 'dark' });
    await expectDarkColors('prefers-color-scheme');
  });

  test('ハイコントラストモードでもアイコンが文字色で表示される', async ({ page }) => {
    await setupFixture(page);
    await page.emulateMedia({ forcedColors: 'active' });

    for (const s of await getAlertStyles(page)) {
      expect(s.iconBackground, s.type).toBe(s.titleColor);
      expect(await isIconPainted(page, s.type), s.type).toBe(true);
    }
  });

  test('配布用のcustomize-alert.htmlはjs/alert.jsと同じ処理である', () => {
    const html = fs.readFileSync(path.resolve(__dirname, '../customize-alert.html'), 'utf-8');
    const script = html.match(/<script>([\s\S]*?)<\/script>/)?.[1] ?? '';

    // インデントとコメント行を除いて比較する
    const normalize = (/** @type {string} */ code) => code
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith('//') && !line.startsWith('/**') && !line.startsWith('*'))
      .join('\n');
    expect(normalize(script)).toBe(normalize(alertJs));
  });

  for (const [label, url] of [['日本語', TEST_URLS.SAMPLE_ARTICLE], ['英語', TEST_URLS.SAMPLE_ARTICLE_EN]]) {
    test(`サンプル記事(${label})のアラート記法がページの読み込みで変換される`, async ({ page }) => {
      // テストブログのheadで読み込んだjs/alert.jsの変換結果をそのまま確認する
      await page.navigateTo(url, { waitFor: 'networkidle' });

      const alerts = page.locator('.entry-content > blockquote.markdown-alert');
      await expect(alerts).toHaveCount(ALERT_TYPES.length);
      for (const [index, type] of ALERT_TYPES.entries()) {
        await expect(alerts.nth(index)).toHaveClass(`markdown-alert markdown-alert-${type}`);
        await expect(alerts.nth(index)).not.toContainText('[!');
      }
    });
  }
});
