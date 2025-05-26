// @ts-check
import { chromium } from '@playwright/test';

/**
 * 紹介記事用スクリーンショット取得スクリプト
 * すべてのスクリーンショット取得処理がこの1ファイルにまとまっています
 *
 * 対応デバイス:
 * - PC (大き目ラップトップ): 1440x1440
 * - タブレット (iPad Pro 12.9): 1024x1366
 * - スマートフォン (iPhone 14 Pro Max): 430x932
 *
 */
(async () => {
  try {
    console.log('紹介記事用スクリーンショット取得スクリプト開始');

    // ブラウザを起動
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    // リトライ機能を自前で実装
    const retryAction = async (action, maxRetries = 3, delay = 1000) => {
      let lastError;
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await action();
        } catch (error) {
          lastError = error;
          console.log(`試行 ${attempt} 回目失敗、${delay}ms 後に再試行...`);
          await page.waitForTimeout(delay);
          // 次の試行で遅延を2倍に
          delay *= 2;
        }
      }
      throw lastError;
    };

    // ==========================================
    // PC (FullHD, 1440x1440) 解像度のスクリーンショット
    // ==========================================
    console.log('PC解像度のスクリーンショット取得を開始...');
    await page.setViewportSize({ width: 1440, height: 1440 });

    // 記事ページの上部キャプチャ
    console.log('記事ページの上部のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/pc-article-top.png' });
    console.log('✓ 記事ページの上部のスクリーンショットを保存しました');

    // ダークモードの記事ページの上部キャプチャ
    console.log('ダークモードの記事ページの上部のスクリーンショット取得中...');
    // ダークモードに切り替え
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('dark');
        return true;
      }
      return false;
    }).then(result => {
      if (!result) console.log('警告: ダークモードのJavaScript関数が見つかりませんでした');
    });
    await page.waitForTimeout(1000); // テーマ切り替えのアニメーションを待つ
    await page.screenshot({ path: 'articles/screenshots/pc-article-top-dark.png' });
    console.log('✓ ダークモードの記事ページの上部のスクリーンショットを保存しました');

    // ライトモードに切り替え
    console.log('ライトモードのタブレット記事ページに戻しています...');
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('light');
        return true;
      }
      return false;
    }).then(result => {
      if (!result) console.log('警告: ライトモードのJavaScript関数が見つかりませんでした');
    });
    await page.waitForTimeout(1000); // テーマ切り替えのアニメーションを待つ

    // 目次のスクリーンショット
    console.log('目次のスクリーンショット取得中...');
    const tocExists = await page.locator('ul.table-of-contents').isVisible();

    if (tocExists) {
      console.log('目次が存在します');

      // 目次が閉じている場合は開く
      const tocContainerClosed = await page.evaluate(() => {
        const tocContainer = document.querySelector('.toc-container');
        // 必ず boolean を返すように修正
        return tocContainer ? tocContainer.classList.contains('toc-closed') : false;
      });

      if (tocContainerClosed) {
        console.log('目次が閉じています。開きます...');

        // 目次のトグルをクリックして開く（JavaScriptを使用してiframeの干渉を回避）
        await page.evaluate(() => {
          const tocTitle = document.querySelector('.toc-title');
          if (tocTitle instanceof HTMLElement) {
            // MouseEventを用いてクリックイベントを生成
            const event = new MouseEvent('click', {
              view: window,
              bubbles: true,
              cancelable: true
            });
            tocTitle.dispatchEvent(event);
          }
        });

        // アニメーション待機
        await page.waitForTimeout(1500);

        // 目次が実際に開いたか確認（最大3回まで試行）
        let isOpen = false;
        for (let attempt = 0; attempt < 3; attempt++) {
          isOpen = await page.evaluate(() => {
            const tocContainer = document.querySelector('.toc-container');
            // 必ず boolean を返すように修正
            return tocContainer ? tocContainer.classList.contains('toc-open') : false;
          });

          if (isOpen) {
            console.log('目次が正常に開きました');
            break;
          } else {
            console.log(`警告: 目次が開いていない可能性があります（試行: ${attempt + 1}）`);
            // 再度開く試み
            await page.evaluate(() => {
              const tocTitle = document.querySelector('.toc-title');
              if (tocTitle instanceof HTMLElement) {
                const event = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                tocTitle.dispatchEvent(event);
              }
            });
            await page.waitForTimeout(1000 * (attempt + 1)); // 待機時間を徐々に増やす
          }
        }

        if (!isOpen) {
          console.log('警告: 3回試行しても目次が開きませんでした');
        }
      } else {
        console.log('目次はすでに開いています');
      }

      // 目次が表示されていることを再確認
      const tocContentVisible = await page.evaluate(() => {
        const tocContent = document.querySelector('.toc-content');
        if (tocContent) {
          return window.getComputedStyle(tocContent).display !== 'none';
        }
        return false;
      });

      if (tocContentVisible) {
        console.log('目次コンテンツが表示されています');

        // 目次コンテナ全体（タイトルを含む）の位置とサイズを取得
        const tocContainerBox = await page.locator('.toc-container').boundingBox();
        if (tocContainerBox) {
          console.log(`目次コンテナの位置: x=${tocContainerBox.x}, y=${tocContainerBox.y}, width=${tocContainerBox.width}, height=${tocContainerBox.height}`);
        } else {
          console.log('目次コンテナの位置情報が取得できませんでした');
        }

        // 記事内目次のスクリーンショット（タイトルを含む全体）
        await page.locator('.toc-container').screenshot({
          path: 'articles/screenshots/pc-toc.png',
          timeout: 5000
        });
        console.log('✓ 記事内目次（全体）のスクリーンショットを保存しました');
      } else {
        console.log('目次コンテンツが表示されていません');
      }

      // フローティング目次ボタンのスクリーンショット
      console.log('フローティング目次ボタンのスクリーンショット取得中...');
      // スクロールして目次ボタンを表示させる
      await retryAction(async () => {
        // より確実にスクロールして目次ボタンを表示させる
        await page.evaluate(() => {
          // 画面の少し下までスクロール（目次ボタンが表示される位置まで）
          window.scrollBy(0, 300);
        });
        await page.waitForTimeout(2000);

        // 目次ボタンが表示されているか確認
        const isVisible = await page.locator('.toc-button').isVisible();
        if (!isVisible) {
          throw new Error('目次ボタンがまだ表示されていません');
        }
      });

      // 目次ボタンを見つけてクリック
      const tocButton = await page.locator('.toc-button');
      if (await tocButton.isVisible()) {
        // クリック前のボタンのスクリーンショット
        await tocButton.screenshot({ path: 'articles/screenshots/pc-toc-button.png' });
        console.log('✓ 目次ボタンのスクリーンショットを撮影しました');

        // 目次ボタンをクリックするときに発生する可能性のあるエラーを回避
        try {
          // 直接DOMを操作してクリックイベントを発火させる（iframeの影響を避ける）
          await page.evaluate(() => {
            // クリックイベントを手動で作成して発火
            const button = document.querySelector('.toc-button');
            if (button instanceof HTMLElement) {
              console.log('ボタン要素を発見、クリックを実行します');
              try {
                const event = new MouseEvent('click', {
                  view: window,
                  bubbles: true,
                  cancelable: true
                });
                button.dispatchEvent(event);
                console.log('クリックイベントをディスパッチしました');
              } catch (err) {
                console.error('クリックイベントのディスパッチに失敗:', err);
              }
            } else {
              console.log('目次ボタン要素が適切な型ではありません');
            }
          });
          console.log('目次ボタンをクリックしました');

          // フローティング目次が表示されるまで十分待機（長めに設定）
          await page.waitForTimeout(2000);

          // フローティング目次を探す
          const floatingToc = await page.locator('.floating-toc');

          // 表示されるまで少し待つ
          await retryAction(async () => {
            const isVisible = await floatingToc.isVisible();
            if (!isVisible) {
              throw new Error('フローティング目次がまだ表示されていません');
            }
            return true;
          }, 3, 500);

          if (await floatingToc.isVisible()) {
            await floatingToc.screenshot({ path: 'articles/screenshots/pc-floating-toc.png' });
            console.log('✓ フローティング目次のスクリーンショットを撮影しました');

            // アクティブな目次項目のスクリーンショットを撮影する追加処理
            console.log('アクティブな目次項目のスクリーンショット取得中...');

            // 目次内の最初の項目を取得してターゲットIDを特定
            const firstTocItem = await page.locator('.floating-toc-list > li').first();

            try {
              // 目次項目内のリンクを取得
              const firstTocLink = await firstTocItem.locator('a').first();
              const href = await firstTocLink.getAttribute('href');

              if (href) {
                // href属性からIDを抽出
                const targetId = href.substring(1); // '#'を除去
                console.log(`最初の目次項目のターゲットID: ${targetId}`);

                // 対応する見出し要素へスクロール（instantで瞬時に移動）
                await page.evaluate((id) => {
                  const element = document.getElementById(id);
                  if (element) {
                    console.log(`ID: ${id}の要素へスクロール`);
                    element.scrollIntoView({ behavior: 'instant', block: 'start' });
                  } else {
                    console.log(`ID: ${id}の要素が見つかりません`);
                  }
                }, targetId);

                // スクロール位置が安定するまで待機（十分な時間を確保）
                await page.waitForTimeout(2000);

                // アクティブアイテムのハイライトが適用されるのを確認
                const isActiveHighlighted = await page.evaluate(() => {
                  const activeItem = document.querySelector('.floating-toc-list .toc-active');
                  return activeItem != null;
                });

                if (isActiveHighlighted) {
                  console.log('目次アクティブハイライトが適用されました');
                } else {
                  console.log('警告: 目次アクティブハイライトが適用されていない可能性があります');
                }

                // 記事と目次の状態を同時に表示したスクリーンショット
                await page.screenshot({ path: 'articles/screenshots/toc-first-section-scrolled.png', fullPage: false });
                console.log('✓ 記事と目次の状態を同時に表示したスクリーンショットを撮影しました');

                // アクティブな目次項目を含む目次全体のスクリーンショットを撮影
                if (await floatingToc.isVisible()) {
                  await floatingToc.screenshot({ path: 'articles/screenshots/toc-active-first-section.png' });
                  console.log('✓ アクティブな目次項目のスクリーンショットを撮影しました');
                }
              } else {
                console.log('目次リンクのhref属性が見つかりません');
              }
            } catch (error) {
              console.error('アクティブな目次項目のスクリーンショット取得中にエラーが発生しました:', error);
            }
          } else {
            console.log('フローティング目次が表示されませんでした');
          }
        } catch (error) {
          console.error('目次ボタンのクリック中にエラーが発生しました:', error);
        }
      } else {
        console.log('目次ボタンが見つかりませんでした');
      }
    } else {
      console.log('目次が見つかりませんでした');
    }

    // カテゴリー表示のスクリーンショット
    console.log('カテゴリー表示のスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    const categorySection = await page.locator('.entry-categories');
    if (await categorySection.isVisible()) {
      await categorySection.screenshot({ path: 'articles/screenshots/pc-category-container.png' });
      console.log('✓ カテゴリーセクションのスクリーンショットを撮影しました');

      // 個別のカテゴリー要素
      const categoryLinks = await page.locator('.entry-category-link').all();
      if (categoryLinks.length > 0) {
        await categoryLinks[0].screenshot({ path: 'articles/screenshots/pc-category-item.png' });
        console.log('✓ カテゴリーアイテムのスクリーンショットを撮影しました');

        // ホバー時のスクリーンショット
        await categoryLinks[0].hover();
        await page.waitForTimeout(500); // ホバーエフェクトが適用されるのを待つ
        await categoryLinks[0].screenshot({ path: 'articles/screenshots/pc-category-item-hover.png' });
        console.log('✓ カテゴリーアイテムのホバー時スクリーンショットを撮影しました');
      }
    } else {
      console.log('カテゴリーセクションが見つかりませんでした');
    }

    // コードハイライトのスクリーンショット
    console.log('コードハイライトのスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/12/131258');
    await page.waitForLoadState('networkidle');

    // コードブロックを探してスクリーンショット
    const codeBlocks = await page.locator('pre').all();
    console.log(`${codeBlocks.length}個のコードブロックが見つかりました`);

    if (codeBlocks.length > 0) {
      // Python, C#, Goのコードブロックをそれぞれ撮影
      await codeBlocks[0].screenshot({ path: 'articles/screenshots/pc-code-python.png' });
      console.log('✓ Pythonコードのスクリーンショットを撮影しました');

      if (codeBlocks.length > 1) {
        await codeBlocks[1].screenshot({ path: 'articles/screenshots/pc-code-csharp.png' });
        console.log('✓ C#コードのスクリーンショットを撮影しました');
      }

      if (codeBlocks.length > 2) {
        await codeBlocks[2].screenshot({ path: 'articles/screenshots/pc-code-go.png' });
        console.log('✓ Goコードのスクリーンショットを撮影しました');
      }

      // コードコピーボタンのスクリーンショット取得
      console.log('コードコピーボタンのスクリーンショット取得中...');

      try {
        // 最初のコードブロックを使用（Pythonコード）
        const firstCodeBlock = codeBlocks[0];
        await firstCodeBlock.scrollIntoViewIfNeeded();

        // ホバー前のスクリーンショット
        await firstCodeBlock.screenshot({ path: 'articles/screenshots/pc-code-block-before-hover.png' });
        console.log('✓ ホバー前のコードブロックのスクリーンショットを保存しました');

        // コードブロックにホバー
        await firstCodeBlock.hover();
        await page.waitForTimeout(500); // アニメーションを待つ

        // コードブロックラッパーを見つける
        const codeBlockWrapper = await page.locator('.code-block-wrapper').first();

        if (await codeBlockWrapper.isVisible()) {
          // ホバー後のスクリーンショット（コピーボタンが表示される）
          await codeBlockWrapper.screenshot({ path: 'articles/screenshots/pc-code-block-with-copy-button.png' });
          console.log('✓ コピーボタン表示状態のスクリーンショットを保存しました');

          // コピーボタンにホバーしてツールチップを表示
          const copyButton = await page.locator('.code-copy-button').first();

          if (await copyButton.isVisible()) {
            await copyButton.hover();
            await page.waitForTimeout(300);

            // ツールチップ表示のスクリーンショット - ページスクリーンショットを使用
            const boundingBox = await codeBlockWrapper.boundingBox();
            if (boundingBox) {
              await page.screenshot({
                path: 'articles/screenshots/pc-code-block-tooltip.png',
                clip: {
                  x: boundingBox.x - 20,
                  y: boundingBox.y - 50, // ツールチップの分、上側に余白を追加
                  width: boundingBox.width + 40,
                  height: boundingBox.height + 70 // ツールチップ用に高さを増やす
                }
              });
              console.log('✓ ツールチップ表示状態のスクリーンショットを保存しました');
            }

            // コピー成功状態のシミュレーション
            await page.evaluate(() => {
              const button = document.querySelector('.code-copy-button');
              if (button instanceof HTMLElement) {
                button.title = 'Copied!';
                button.classList.add('copied');
              }
            });

            await page.waitForTimeout(300);

            // コピー成功状態のスクリーンショット - ページスクリーンショットを使用
            if (boundingBox) {
              await page.screenshot({
                path: 'articles/screenshots/pc-code-block-copied.png',
                clip: {
                  x: boundingBox.x - 20,
                  y: boundingBox.y - 50,
                  width: boundingBox.width + 40,
                  height: boundingBox.height + 70
                }
              });
              console.log('✓ コピー成功状態のスクリーンショットを保存しました');
            }
          } else {
            console.log('コピーボタンが見つかりませんでした');
          }
        } else {
          console.log('コードブロックラッパーが見つかりませんでした');
        }
      } catch (error) {
        console.error('コードコピーボタンのスクリーンショット取得中にエラーが発生しました:', error);
      }
    } else {
      console.log('コードブロックが見つかりませんでした');
    }

    // コメントセクションのスクリーンショット
    console.log('コメントセクションのスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // コメントセクションまでスクロール
    await page.evaluate(() => {
      const commentBox = document.querySelector('.comment-box');
      if (commentBox) {
        commentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000); // スクロールアニメーション完了を待つ

    const commentBox = await page.locator('.comment-box');
    if (await commentBox.isVisible()) {
      await commentBox.screenshot({ path: 'articles/screenshots/pc-comment-section.png' });
      console.log('✓ コメントセクションのスクリーンショットを撮影しました');
    } else {
      console.log('コメントセクションが見つかりませんでした');
    }

    // 関連記事のスクリーンショット
    console.log('関連記事のスクリーンショット取得中...');
    // 指定された正確なセレクタを使用（.customized-footer内の関連記事）
    const relatedEntries = await page.locator('.customized-footer .hatena-module-related-entries');
    if (await relatedEntries.isVisible()) {
      await relatedEntries.screenshot({ path: 'articles/screenshots/pc-related-entries.png' });
      console.log('✓ 関連記事のスクリーンショットを撮影しました');
    } else {
      console.log('関連記事が見つかりませんでした');
    }

    // アーカイブページのスクリーンショット
    console.log('アーカイブページのスクリーンショット取得中...');
    await page.goto('https://guitarrapc-theme.hatenablog.com/archive/author/guitarrapc_tech');
    await page.waitForLoadState('networkidle');

    // 他のデバイスと統一するため、ページ全体をキャプチャ
    await page.screenshot({ path: 'articles/screenshots/pc-archive-top.png' });
    console.log('✓ アーカイブページのスクリーンショットを撮影しました');

    // サイドバーのタグクラウドのスクリーンショット
    console.log('サイドバーのタグクラウドのスクリーンショット取得中...');

    // トップページに移動（タグクラウドが確実に表示されるため）
    await page.goto('https://guitarrapc-theme.hatenablog.com/');
    await page.waitForLoadState('networkidle');

    // フッターセクションまでスクロール
    await page.evaluate(() => {
      const footer = document.getElementById('box2');
      if (footer) {
        footer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
    await page.waitForTimeout(1000);

    // サイドバーのカテゴリーモジュールを取得（より具体的なセレクタを使用）
    const categoryModule = await page.locator('#box2 .hatena-module-category');
    if (await categoryModule.isVisible()) {
      await categoryModule.screenshot({ path: 'articles/screenshots/pc-sidebar-tag-cloud.png' });
      console.log('✓ サイドバーのタグクラウドのスクリーンショットを撮影しました');
    } else {
      console.log('サイドバーのタグクラウドが見つかりませんでした');
    }

    // ==========================================
    // タブレット (iPad Pro 12.9, 1024x1366) 解像度のスクリーンショット
    // ==========================================
    console.log('タブレット解像度のスクリーンショット取得を開始...');
    await page.setViewportSize({ width: 1024, height: 1366 });

    // タブレット記事ページ
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/tablet-article-top.png' });
    console.log('✓ タブレット記事ページのスクリーンショットを保存しました');

    // ダークモードのタブレット記事ページ
    console.log('ダークモードのタブレット記事ページのスクリーンショット取得中...');
    // ダークモードに切り替え
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('dark');
        return true;
      }
      return false;
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'articles/screenshots/tablet-article-top-dark.png' });
    console.log('✓ ダークモードのタブレット記事ページのスクリーンショットを保存しました');

    // ライトモードのタブレット記事ページに戻す
    console.log('ライトモードのタブレット記事ページに戻しています...');
    // ダークモードに切り替え
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('light');
        return true;
      }
      return false;
    });
    await page.waitForTimeout(1000);

    // タブレットアーカイブページ
    await page.goto('https://guitarrapc-theme.hatenablog.com/archive/author/guitarrapc_tech');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/tablet-archive-top.png' });
    console.log('✓ タブレットアーカイブページのスクリーンショットを保存しました');

    // タブレット目次ボタン
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // スクロールして目次ボタンを表示
    await page.evaluate(() => window.scrollBy(0, 300));
    await page.waitForTimeout(1000);

    const tabletTocButton = await page.locator('.toc-button');
    if (await tabletTocButton.isVisible()) {
      await tabletTocButton.screenshot({ path: 'articles/screenshots/tablet-toc-button.png' });
      console.log('✓ タブレット目次ボタンのスクリーンショットを保存しました');
    }

    // タブレットのコメントセクション
    console.log('タブレットのコメントセクションのスクリーンショット取得中...');
    // コメントセクションまでスクロール
    await page.evaluate(() => {
      const commentBox = document.querySelector('.comment-box');
      if (commentBox) {
        commentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
    await page.waitForTimeout(1000); // スクロールアニメーション完了を待つ

    const tabletCommentBox = await page.locator('.comment-box');
    if (await tabletCommentBox.isVisible()) {
      await tabletCommentBox.screenshot({ path: 'articles/screenshots/tablet-comment-section.png' });
      console.log('✓ タブレットのコメントセクションのスクリーンショットを撮影しました');
    } else {
      console.log('タブレットのコメントセクションが見つかりませんでした');
    }

    // ==========================================
    // スマートフォン (iPhone 14 Pro Max, 430x932) 解像度のスクリーンショット
    // ==========================================
    console.log('スマートフォン解像度のスクリーンショット取得を開始...');
    await page.setViewportSize({ width: 430, height: 932 });

    // スマートフォン記事ページ
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/smartphone-article-top.png' });
    console.log('✓ スマートフォン記事ページのスクリーンショットを保存しました');

    // ダークモードのスマートフォン記事ページ
    console.log('ダークモードのスマートフォン記事ページのスクリーンショット取得中...');
    // ダークモードに切り替え
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('dark');
        return true;
      }
      return false;
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'articles/screenshots/smartphone-article-top-dark.png' });
    console.log('✓ ダークモードのスマートフォン記事ページのスクリーンショットを保存しました');

    console.log('ライトモードのスマートフォン記事ページに戻しています...');
    // ダークモードに切り替え
    await page.evaluate(() => {
      // @ts-ignore
      if (window.darkModeJs && typeof window.darkModeJs.applyTheme === 'function') {
        // @ts-ignore
        window.darkModeJs.applyTheme('light');
        return true;
      }
      return false;
    });
    await page.waitForTimeout(1000);

    // スマートフォンアーカイブページ
    await page.goto('https://guitarrapc-theme.hatenablog.com/archive/author/guitarrapc_tech');
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: 'articles/screenshots/smartphone-archive-top.png' });
    console.log('✓ スマートフォンアーカイブページのスクリーンショットを保存しました');

    // スマートフォン目次ボタン
    await page.goto('https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601');
    await page.waitForLoadState('networkidle');

    // スクロールして目次ボタンを表示
    await page.evaluate(() => window.scrollBy(0, 200));
    await page.waitForTimeout(1000);

    const smartphoneTocButton = await page.locator('.toc-button');
    if (await smartphoneTocButton.isVisible()) {
      await smartphoneTocButton.screenshot({ path: 'articles/screenshots/smartphone-toc-button.png' });
      console.log('✓ スマートフォン目次ボタンのスクリーンショットを保存しました');
    }

    // スマートフォンのコメントセクション
    await page.evaluate(() => {
      const commentBox = document.querySelector('.comment-box');
      if (commentBox) commentBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    await page.waitForTimeout(1000);

    const smartphoneCommentBox = await page.locator('.comment-box');
    if (await smartphoneCommentBox.isVisible()) {
      await smartphoneCommentBox.screenshot({ path: 'articles/screenshots/smartphone-comment-section.png' });
      console.log('✓ スマートフォンコメントセクションのスクリーンショットを保存しました');
    }

    // ブラウザを閉じる
    await browser.close();
    console.log('すべてのスクリーンショット撮影が完了しました！');

  } catch (error) {
    console.error('エラーが発生しました:', error);
    process.exit(1);
  } finally {
    console.log('スクリプト実行を終了します');
  }
})();

/**
 * このスクリプトの実行方法:
 *
 * ```
 * node capture-all-screenshots.js
 * ```
 *
 * 実行すると、articles/screenshots/ フォルダに以下のスクリーンショットが生成されます:
 *
 * PC解像度 (Surface Pro 7):
 * - pc-article-top.png: 記事ページの上部
 * - pc-article-top-dark.png: ダークモードの記事ページの上部
 * - pc-toc.png: 記事内目次
 * - pc-toc-button.png: 目次ボタン
 * - pc-floating-toc.png: フローティング目次
 * - pc-category-container.png: カテゴリーセクション全体
 * - pc-category-item.png: 個別のカテゴリー
 * - pc-category-item-hover.png: ホバー時のカテゴリー
 * - pc-code-python.png: Pythonコードハイライト
 * - pc-code-csharp.png: C#コードハイライト
 * - pc-code-go.png: Goコードハイライト
 * - pc-code-block-before-hover.png: ホバー前のコードブロック
 * - pc-code-block-with-copy-button.png: コピーボタン表示状態
 * - pc-code-block-tooltip.png: ツールチップ表示状態
 * - pc-code-block-copied.png: コピー成功状態
 * - pc-comment-section.png: コメントセクション
 * - pc-related-entries.png: 関連記事
 * - pc-archive-grid.png: アーカイブページのグリッド
 * - pc-sidebar-tag-cloud.png: サイドバーのタグクラウド
 *
 * タブレット解像度 (iPad Pro 12.9):
 * - tablet-article-top.png: 記事ページの上部
 * - tablet-article-top-dark.png: ダークモードの記事ページの上部
 * - tablet-archive-top.png: アーカイブページの上部
 * - tablet-toc-button.png: 目次ボタン
 *
 * スマートフォン解像度 (iPhone 14 Pro Max):
 * - smartphone-article-top.png: 記事ページの上部
 * - smartphone-article-top-dark.png: ダークモードの記事ページの上部
 * - smartphone-archive-top.png: アーカイブページの上部
 * - smartphone-toc-button.png: 目次ボタン
 * - smartphone-comment-section.png: コメントセクション
 */
