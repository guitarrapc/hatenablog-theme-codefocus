import { test as base } from '@playwright/test';

// 1回のナビゲーション(goto + waitForLoadState)の上限
// navigateToの3回の試行と試行間の待機(1秒+2秒)が、playwright.config.jsのテストのタイムアウト(90秒)に収まるようにする
export const NAVIGATION_TIMEOUT = 20000;

/**
 * @typedef {import('@playwright/test').Page & {
 *   navigateTo: (path: string, options?: { waitFor?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit' }) => Promise<void>,
 *   retryAction: (action: () => Promise<any>, maxRetries?: number, delay?: number) => Promise<any>,
 *   waitForElementToBeVisible: (selector: string, timeoutMs?: number) => Promise<void>,
 *   waitForPageToLoad: () => Promise<void>
 * }} CustomPage
 */

/**
 * テスト環境を強化するためのカスタムフィクスチャ
 * ネットワークタイムアウトやリトライの設定を含む
 * @type {import('@playwright/test').TestType<{page: CustomPage}, import('@playwright/test').PlaywrightTestArgs & import('@playwright/test').PlaywrightTestOptions>}
 */
export const test = base.extend({
  context: async ({ browser }, use) => {
    // Chromium 141+のPrivate Network Access対応
    // HTTPS公開サイトからHTTP localhostへのリソース読み込みに必要
    const context = await browser.newContext({
      permissions: ['local-network-access']
    });
    await use(context);
    await context.close();
  },
  page: async ({ context }, use) => {
    const page = await context.newPage();

    // 1回のナビゲーションが長引いてもテストのタイムアウト内でリトライできるよう、上限を設ける
    page.setDefaultNavigationTimeout(NAVIGATION_TIMEOUT);
    page.setDefaultTimeout(30000);

    // リトライ機構の実装
    const retry = async (action, maxRetries = 3, delay = 1000) => {
      let lastError;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await action();
        } catch (error) {
          lastError = error;
          if (attempt === maxRetries) {
            break;
          }
          console.log(`Attempt ${attempt} failed, retrying after ${delay}ms...`);
          await page.waitForTimeout(delay);
          // 次の試行で遅延を2倍に
          delay *= 2;
        }
      }
      throw lastError;
    };

    // DOM要素が表示されるまで待機する関数を追加
    const waitForElementToBeVisible = async (selector, timeoutMs = 10000) => {
      try {
        const locator = page.locator(selector);
        await locator.waitFor({ state: 'visible', timeout: timeoutMs });
        return true;
      } catch (error) {
        console.log(`Element ${selector} not visible after ${timeoutMs}ms`);
        return false;
      }
    };

    // 統合ナビゲーション関数 - retryAction + goto + waitForLoadStateを1つに
    const navigateTo = async (path, options = {}) => {
      const {
        waitFor = 'domcontentloaded', // 'domcontentloaded' | 'networkidle' | 'load'
        fullUrl = null // 完全なURLを指定する場合
      } = options;

      const targetUrl = fullUrl || url(path);

      await retry(async () => {
        // gotoはloadまで待ってからwaitForで指定した状態を待つ。1回の試行の合計がNAVIGATION_TIMEOUTに収まるよう期限を共有する
        const deadline = Date.now() + NAVIGATION_TIMEOUT;
        await page.goto(targetUrl, { timeout: NAVIGATION_TIMEOUT });
        await page.waitForLoadState(waitFor, { timeout: Math.max(1, deadline - Date.now()) });
      });
    };

    // 拡張されたページオブジェクトを提供
    page.retryAction = retry;
    page.waitForElementToBeVisible = waitForElementToBeVisible;
    page.navigateTo = navigateTo;

    // ページ読み込みを待機する便利な関数（後方互換性のため残す）
    page.waitForPageToLoad = async () => {
      await page.waitForLoadState('domcontentloaded');
      await page.waitForLoadState('networkidle');
    };
    await use(page);
  },
});

// テストブログのURLを生成するヘルパー関数
export const url = (path = '/') => {
  // テストブログのベースURL
  const baseUrl = 'https://guitarrapc-theme.hatenablog.com';
  // パスが/で始まっていない場合は追加する
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
