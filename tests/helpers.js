import { test as base } from '@playwright/test';

/**
 * テスト環境を強化するためのカスタムフィクスチャ
 * ネットワークタイムアウトやリトライの設定を含む
 */
export const test = base.extend({
    page: async ({ page }, use) => {
        // ネットワークタイムアウトを延長
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(30000);

        // リトライ機構の実装
        const retry = async (action, maxRetries = 3, delay = 1000) => {
            let lastError;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    return await action();
                } catch (error) {
                    lastError = error;
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

        // 拡張されたページオブジェクトを提供
        page.retryAction = retry;
        page.waitForElementToBeVisible = waitForElementToBeVisible;

        // ページ読み込みを待機する便利な関数
        page.waitForPageToLoad = async () => {
            await page.waitForLoadState('domcontentloaded');
            await page.waitForLoadState('networkidle');
        };

        await use(page);
    },
});
