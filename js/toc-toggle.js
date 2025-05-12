/**
 * はてなブログ記事内の目次（table-of-contents）に開閉機能を追加するスクリプト
 */
(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        // 記事内の目次を検索
        const tocElements = document.querySelectorAll('.table-of-contents');

        tocElements.forEach(function (toc) {
            // すでに処理済みの目次はスキップ
            if (toc.classList.contains('toc-processed')) {
                return;
            }

            // 目次をコンテナで囲む
            const tocContainer = document.createElement('div');
            tocContainer.className = 'toc-container';
            toc.parentNode.insertBefore(tocContainer, toc);
            tocContainer.appendChild(toc);

            // 目次のタイトルを作成
            const tocTitle = document.createElement('div');
            tocTitle.className = 'toc-title';
            tocTitle.innerHTML = '目次 <span class="toc-toggle-icon"></span>';
            tocContainer.insertBefore(tocTitle, toc);

            // 目次のコンテンツ部分をdivで囲む
            const tocContent = document.createElement('div');
            tocContent.className = 'toc-content';
            tocContent.appendChild(toc.cloneNode(true));
            tocContainer.replaceChild(tocContent, toc);

            // 目次を開閉するための状態を設定（デフォルトは開いた状態）
            tocContainer.classList.add('toc-open');

            // クリックイベントの設定
            tocTitle.addEventListener('click', function () {
                if (tocContainer.classList.contains('toc-open')) {
                    // 現在開いている場合は閉じる
                    tocContainer.classList.remove('toc-open');
                    tocContainer.classList.add('toc-closed');
                } else {
                    // 現在閉じている場合は開く
                    tocContainer.classList.remove('toc-closed');
                    tocContainer.classList.add('toc-open');
                }
            });

            // 処理済みとしてマーク
            tocContent.querySelector('.table-of-contents').classList.add('toc-processed');
        });
    });
})();
