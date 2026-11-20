// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, TIMEOUTS } from './constants.js';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const darkModeJs = fs.readFileSync(path.resolve(__dirname, '../js/dark-mode.js'), 'utf-8');

// サンプル記事にはMarkdownのGistだけが埋め込まれているため、コードのGistはGitHubが書き出すHTMLを再現して差し込む。
// GitHubのCSS(gist-embed-*.css)は記事のGistが読み込んだものがそのまま効く
const CODE_GIST_FIXTURE = `
<div id="gist-fixture" class="gist">
  <div class="gist-file" translate="no" data-color-mode="light" data-light-theme="light">
    <div class="gist-data">
      <div class="js-gist-file-update-container js-task-list-container">
        <div id="file-fixture-cs" class="file my-2">
          <div itemprop="text" class="Box-body p-0 blob-wrapper data type-c# ">
            <div class="js-check-hidden-unicode js-blob-code-container blob-code-content">
              <table data-hpc class="highlight tab-size js-file-line-container" data-tab-size="4" data-paste-markdown-skip data-tagsearch-path="fixture.cs">
                <tbody>
                  <tr>
                    <td id="file-fixture-cs-L1" class="blob-num js-line-number js-blob-rnum" data-line-number="1"></td>
                    <td id="file-fixture-cs-LC1" class="blob-code blob-code-inner js-file-line"><span class="pl-k">public</span> <span class="pl-k">class</span> <span class="pl-en">Sample</span></td>
                  </tr>
                  <tr>
                    <td id="file-fixture-cs-L2" class="blob-num js-line-number js-blob-rnum" data-line-number="2"></td>
                    <td id="file-fixture-cs-LC2" class="blob-code blob-code-inner js-file-line">{</td>
                  </tr>
                  <tr>
                    <td id="file-fixture-cs-L3" class="blob-num js-line-number js-blob-rnum" data-line-number="3"></td>
                    <td id="file-fixture-cs-LC3" class="blob-code blob-code-inner js-file-line">    <span class="pl-k">var</span> <span class="pl-s1">text</span> <span class="pl-c1">=</span> <span class="pl-s">"Hello"</span><span class="pl-kos">;</span> <span class="pl-c">// comment</span></td>
                  </tr>
                  <tr>
                    <td id="file-fixture-cs-L4" class="blob-num js-line-number js-blob-rnum" data-line-number="4"></td>
                    <td id="file-fixture-cs-LC4" class="blob-code blob-code-inner js-file-line">}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="gist-meta">
      <a href="#gist-fixture" style="float:right" class="Link--inTextBlock">view raw</a>
      <a href="#gist-fixture" class="Link--inTextBlock">fixture.cs</a>
      hosted with &#10084; by <a class="Link--inTextBlock" href="#gist-fixture">GitHub</a>
    </div>
  </div>
</div>`;

// GitHubのライト配色(Primer light)とテーマが補うダーク配色(Primer dark)。_gist.scss と同じ値
const GITHUB_COLORS = {
  light: {
    background: 'rgb(255, 255, 255)',
    text: 'rgb(31, 35, 40)',
    keyword: 'rgb(207, 34, 46)',
    string: 'rgb(10, 48, 105)',
  },
  dark: {
    background: 'rgb(13, 17, 23)',
    text: 'rgb(240, 246, 252)',
    keyword: 'rgb(255, 123, 114)',
    string: 'rgb(165, 214, 255)',
  },
};

/**
 * サンプル記事を開き、ダークモードのJSとコードのGistを差し込む
 * @param {import('./helpers.js').CustomPage} page
 */
const setup = async (page) => {
  await page.navigateTo(TEST_URLS.SAMPLE_ARTICLE, { waitFor: 'networkidle' });
  await page.evaluate(darkModeJs);
  await page.evaluate((html) => {
    const gist = document.querySelector('.entry-content .gist');
    if (!gist) throw new Error('サンプル記事にGistがありません');
    gist.insertAdjacentHTML('afterend', html);
  }, CODE_GIST_FIXTURE);
};

/**
 * @param {import('@playwright/test').Page} page
 * @param {'light' | 'dark'} theme
 */
const applyTheme = async (page, theme) => {
  await page.evaluate((t) => {
    const win = /** @type {Window & {darkModeJs?: {applyTheme: (theme: string) => void}}} */ (window);
    win.darkModeJs?.applyTheme(t);
  }, theme);
  await page.waitForTimeout(TIMEOUTS.SHORT);
};

/**
 * Gistの各部分の見た目を集める。画面外の本文は描画が後回しになるため、スクロールしてから測る
 * @param {import('@playwright/test').Page} page
 */
const collectStyles = async (page) => {
  await page.locator('#gist-fixture').scrollIntoViewIfNeeded();
  return page.evaluate(() => {
    /** @param {string} selector */
    const style = (selector) => {
      const el = document.querySelector(selector);
      if (!el) throw new Error(`${selector} がありません`);
      return getComputedStyle(el);
    };
    const root = getComputedStyle(document.documentElement);
    const markdownGist = '.entry-content .gist:not(#gist-fixture)';
    return {
      bodyText: root.getPropertyValue('--text-body').trim(),
      codeFrameBorder: style('#gist-fixture .gist-file').borderTopWidth,
      codeBackground: style('#gist-fixture .gist-data').backgroundColor,
      codeText: style('#file-fixture-cs-LC2').color,
      codeLetterSpacing: style('#file-fixture-cs-LC2').letterSpacing,
      keyword: style('#file-fixture-cs-LC1 .pl-k').color,
      string: style('#file-fixture-cs-LC3 .pl-s').color,
      lineNumberBorder: style('#file-fixture-cs-L1').borderTopWidth,
      lineNumberUserSelect: style('#file-fixture-cs-L1').userSelect,
      lineNumberOpacity: style('#file-fixture-cs-L1').opacity,
      lineNumberLineHeight: style('#file-fixture-cs-L1').lineHeight,
      codeLineHeight: style('#file-fixture-cs-LC1').lineHeight,
      firstLineNumberPaddingTop: style('#file-fixture-cs-L1').paddingTop,
      firstLineCodePaddingTop: style('#file-fixture-cs-LC1').paddingTop,
      lastLineCodePaddingBottom: style('#file-fixture-cs-LC4').paddingBottom,
      markdownText: style(`${markdownGist} .markdown-body`).color,
      markdownBackground: style(`${markdownGist} .Box-body.readme`).backgroundColor,
      markdownFrameBorder: style(`${markdownGist} .gist-file`).borderTopWidth,
      markdownH1Size: parseFloat(style(`${markdownGist} .markdown-body h1`).fontSize),
      articleH2Size: parseFloat(style('.entry-content > h2').fontSize),
      anchorDisplay: style(`${markdownGist} .markdown-body .anchor`).display,
      tableAligns: [...document.querySelectorAll(`${markdownGist} .markdown-body th`)].map((th) => getComputedStyle(th).textAlign),
      themeBackground: root.getPropertyValue('--background').trim(),
    };
  });
};

/**
 * 色の文字列(#rrggbb)を、getComputedStyleが返す rgb() の形にする
 * @param {string} hex
 */
const hexToRgb = (hex) => {
  const value = hex.replace('#', '');
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(value.slice(i, i + 2), 16));
  return `rgb(${r}, ${g}, ${b})`;
};

test.describe('Gist埋め込み', () => {
  for (const theme of /** @type {const} */ (['light', 'dark'])) {
    test(`${theme}: コードのGistがGitHubの配色に追従し、本文のスタイルが混ざらない`, async ({ page }) => {
      await setup(page);
      await applyTheme(page, theme);
      const styles = await collectStyles(page);
      const colors = GITHUB_COLORS[theme];

      expect(styles.codeBackground).toBe(colors.background);
      expect(styles.codeText).toBe(colors.text);
      expect(styles.keyword).toBe(colors.keyword);
      expect(styles.string).toBe(colors.string);

      // GitHubのCSSが未定義の変数で枠線を引くため、テーマが補った枠線が出ていること
      expect(styles.codeFrameBorder).toBe('1px');
      // 本文の表の罫線や字間が行番号とコードに混ざらないこと
      expect(styles.lineNumberBorder).toBe('0px');
      expect(styles.codeLetterSpacing).toBe('normal');
      // 行番号はコピー時に選択されない
      expect(styles.lineNumberUserSelect).toBe('none');
      // 行番号は透明度で薄くしない(ダークで実効コントラスト比が4.5:1を下回るため)
      expect(styles.lineNumberOpacity).toBe('1');
      // 行番号はコードより小さい文字でも、行の高さがそろって各行と同じ高さに並ぶ
      expect(styles.lineNumberLineHeight).toBe(styles.codeLineHeight);
      // 先頭行・末尾行の上下の余白は、行番号とコードのセルでそろう(GitHubのCSSの!importantに負けない)
      expect(styles.firstLineCodePaddingTop).toBe('10px');
      expect(styles.firstLineCodePaddingTop).toBe(styles.firstLineNumberPaddingTop);
      expect(styles.lastLineCodePaddingBottom).toBe('10px');

      await page.locator('#gist-fixture').screenshot({ path: `screenshots/gist-code-${theme}.png` });
    });

    test(`${theme}: MarkdownのGistが本文と同じ文字色のカードとして表示される`, async ({ page }) => {
      await setup(page);
      await applyTheme(page, theme);
      const markdownGist = page.locator('.entry-content .gist:not(#gist-fixture)');
      await markdownGist.scrollIntoViewIfNeeded();
      const styles = await collectStyles(page);

      expect(styles.markdownText).toBe(hexToRgb(styles.bodyText));
      expect(styles.markdownBackground).toBe(hexToRgb(styles.themeBackground));
      expect(styles.markdownFrameBorder).toBe('1px');
      // Gistの見出しは記事の見出しより小さく、入れ子の文書だとわかる
      expect(styles.markdownH1Size).toBeLessThan(styles.articleH2Size);
      // GitHub上のページ内リンク(パーマリンク)は出さない
      expect(styles.anchorDisplay).toBe('none');
      // Markdownの表の列揃え(:--- / :---: / ---:)が本文の表の左揃えに負けない
      expect(styles.tableAligns).toEqual(['left', 'center', 'right']);

      // はてなブログが引用の末尾に足す引用ボタンがあっても、引用の下に余白が残らない
      const quoteGap = await page.evaluate(() => {
        const quote = document.querySelector('.entry-content .gist:not(#gist-fixture) .markdown-body blockquote');
        const last = quote?.lastElementChild;
        if (!quote || !last) throw new Error('Gistに引用がありません');
        const button = document.createElement('span');
        button.className = 'js-requote-button';
        quote.appendChild(button);
        const gap = getComputedStyle(last).marginBottom;
        button.remove();
        return gap;
      });
      expect(quoteGap).toBe('0px');

      await markdownGist.screenshot({ path: `screenshots/gist-markdown-${theme}.png` });
    });
  }
});
