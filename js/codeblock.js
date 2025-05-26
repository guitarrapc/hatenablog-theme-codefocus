/**
 * コードブロック機能（コピー & 折り返し切り替え）を提供するスクリプト
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // コードブロックを全て取得
    const codeBlocks = document.querySelectorAll('pre.code');

    // 各コードブロックにボタンを追加
    codeBlocks.forEach(function (codeBlock) {
      // コードブロック用のラッパーを作成
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // コピーボタンを作成
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.removeAttribute('title'); // 初期状態ではタイトル属性を削除
      copyButton.setAttribute('aria-label', 'Copy code');

      // 折り返し切り替えボタンを作成
      const wrapToggleButton = document.createElement('button');
      wrapToggleButton.className = 'code-wrap-toggle';
      wrapToggleButton.title = 'Toggle Wrap';
      wrapToggleButton.setAttribute('aria-label', 'Toggle code wrapping');

      // コードブロックを親要素から取り出して、ラッパーに移動
      const parent = codeBlock.parentNode;
      parent.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);

      // 初期状態は折り返しなし (デフォルト)
      codeBlock.classList.add('nowrap');

      // ラッパーにボタンを追加（順番重要: 右からコピー、折り返し）
      wrapper.appendChild(copyButton);
      wrapper.appendChild(wrapToggleButton);

      // コピーボタンのクリックイベントを設定
      copyButton.addEventListener('click', function () {
        // コピーする前にボタンテキストを一時的に隠す
        const originalDisplay = copyButton.style.display;
        copyButton.style.display = 'none';

        // コードブロックのテキストを取得
        const code = codeBlock.textContent;

        // ボタンの表示を元に戻す
        copyButton.style.display = originalDisplay;

        // クリップボードにコピー
        navigator.clipboard.writeText(code).then(function () {
          // コピー成功
          copyButton.title = 'Copied';
          copyButton.classList.add('copied');

          // 一定時間後に元に戻す
          setTimeout(function () {
            copyButton.removeAttribute('title'); // タイトル属性を削除
            copyButton.classList.remove('copied');
          }, 2000);
        }).catch(function (err) {
          // コピー失敗
          console.error('Copy failed:', err);
          copyButton.title = 'Copy failed';
          copyButton.classList.add('copy-error');

          // 一定時間後に元に戻す
          setTimeout(function () {
            copyButton.removeAttribute('title'); // タイトル属性を削除
            copyButton.classList.remove('copy-error');
          }, 2000);
        });
      });

      // 折り返し切り替えボタンのクリックイベントを設定
      wrapToggleButton.addEventListener('click', function () {
        codeBlock.classList.toggle('nowrap');
        codeBlock.classList.toggle('wrap');

        // ボタンのツールチップを更新
        if (codeBlock.classList.contains('nowrap')) {
          wrapToggleButton.title = 'Enable Wrap';
        } else {
          wrapToggleButton.title = 'Disable Wrap';
        }
      });
    });
  });
})();
