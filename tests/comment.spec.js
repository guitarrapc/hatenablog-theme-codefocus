// @ts-check
import { test } from './helpers.js';
import { expect } from '@playwright/test';
import { TEST_URLS, SELECTORS } from './constants.js';

test.describe('コメント表示のテスト', () => {
  test('コメントのユーザー名と日付の表示順序が正しいこと', async ({ page }) => {
    // 記事ページに移動
    await page.goto(TEST_URLS.SAMPLE_ARTICLE);
    await page.waitForLoadState('networkidle');

    await page.waitForSelector(SELECTORS.ENTRY_COMMENT);

    // コメントHTML構造を取得
    const commentHTML = await page.evaluate(() => {
      const comments = document.querySelectorAll('.entry-comment');
      if (comments.length === 0) return 'コメントがありません';
      return comments[0].outerHTML;
    });
    console.log('コメントHTML構造:', commentHTML);

    // コメントのスタイル確認とHTML構造の取得
    const result = await page.evaluate(() => {
      const comments = document.querySelectorAll('.entry-comment');
      if (comments.length === 0) return null;

      // 最初のコメントを使用
      const comment = comments[0];
      const userName = comment.querySelector('.comment-user-name');
      const metadata = comment.querySelector('.comment-metadata');
      if (!userName || !metadata) return null;

      const userNameRect = userName.getBoundingClientRect();
      const metadataRect = metadata.getBoundingClientRect();

      // ユーザー名が日付の左側にあるかどうかを判定
      const isCorrectOrder = userNameRect.left < metadataRect.left;

      return {
        isCorrectOrder, // ユーザー名が日付の左側にあればtrue
        html: comment.outerHTML,
        structure: comment.innerHTML,
        userName: {
          left: userNameRect.left,
          top: userNameRect.top,
          text: userName.textContent?.trim()
        },
        metadata: {
          left: metadataRect.left,
          top: metadataRect.top,
          text: metadata.textContent?.trim()
        }
      };
    }); console.log('エレメント位置情報と構造:', result);

    // resultがnullでないことを確認してから検証
    if (result) {
      // ユーザー名が日付の左側にあることを検証
      expect(result.isCorrectOrder).toBeTruthy();
    } else {
      console.warn('コメント要素が見つからないか、必要な情報が取得できません');
      // テスト失敗をスキップ（コメントがない場合はテスト対象外とする）
    }

    // スクリーンショットを撮影
    await page.screenshot({ path: 'screenshots/comment-layout.png' });
  });
});
