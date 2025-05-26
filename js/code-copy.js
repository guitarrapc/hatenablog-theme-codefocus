/**
 * コードブロックにコピーボタンを追加するスクリプト
 */
(function () {
  'use strict';
  document.addEventListener('DOMContentLoaded', function () {
    // コードブロックを全て取得
    const codeBlocks = document.querySelectorAll('pre.code');

    // 各コードブロックにコピーボタンを追加
    codeBlocks.forEach(function (codeBlock) {
      // コードブロック用のラッパーを作成
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-wrapper';

      // コピーボタンを作成
      const copyButton = document.createElement('button');
      copyButton.className = 'code-copy-button';
      copyButton.removeAttribute('tltle');

      // コードブロックを親要素から取り出して、ラッパーに移動
      const parent = codeBlock.parentNode;
      parent.insertBefore(wrapper, codeBlock);
      wrapper.appendChild(codeBlock);

      // ラッパーにボタンを追加
      wrapper.appendChild(copyButton);

      // ボタンのクリックイベントを設定
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
            copyButton.removeAttribute('title');
            copyButton.classList.remove('copied');
          }, 2000);
        }).catch(function (err) {
          // コピー失敗
          console.error('Copy failed:', err);
          copyButton.title = 'Copy failed';
          copyButton.classList.add('copy-error');

          // 一定時間後に元に戻す
          setTimeout(function () {
            copyButton.removeAttribute('title');
            copyButton.classList.remove('copy-error');
          }, 2000);
        });
      });
    });
  });
})();
