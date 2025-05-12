import { defineConfig } from '@playwright/test';

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
    testDir: './tests',
    timeout: 60 * 1000, // メイン全体のタイムアウトを60秒に拡張
    expect: {
        timeout: 10000 // 期待値の検証タイムアウトを10秒に拡張
    }, fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 3 : 1, // テストの失敗時に再試行する回数を増やす
    workers: process.env.CI ? 1 : undefined,
    use: {
        actionTimeout: 30000, // アクションタイムアウトを30秒に設定
        baseURL: 'https://guitarrapc-theme.hatenablog.com',
        trace: 'on-first-retry', // 最初の再試行時にトレースを取得
        screenshot: 'only-on-failure', // 失敗時のみスクリーンショットを取得
    },
    reporter: [
        ['html'],
        ['list']
    ],
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
                viewport: { width: 1280, height: 720 },
            },
        },
        {
            name: 'mobile',
            use: {
                browserName: 'chromium',
                viewport: { width: 414, height: 896 },
                deviceScaleFactor: 2,
                isMobile: true,
            },
        },
    ],
});
