/**
 * 目次ボタンと目次表示機能のスクリプト
 */
(function () {
    'use strict';

    // DOMの読み込み完了後に実行
    document.addEventListener('DOMContentLoaded', function () {
        // 記事ページ（エントリーページ）かどうかをチェック
        const entryContent = document.querySelector('.entry-content');
        if (!entryContent) return; // 記事ページでなければ何もしない

        // 目次の要素を取得
        const tableOfContents = document.querySelector('.entry-content .table-of-contents');
        if (!tableOfContents) return; // 目次がなければ何もしない

        // 目次ボタンを作成
        const tocButton = document.createElement('button');
        tocButton.className = 'toc-button';
        tocButton.textContent = '目次';

        // フローティング目次コンテナを作成
        const floatingToc = document.createElement('div');
        floatingToc.className = 'floating-toc';

        // 目次のタイトル要素を作成
        const tocTitle = document.createElement('h4');
        tocTitle.className = 'floating-toc-title';
        tocTitle.textContent = '目次';

        // 目次のクローンを作成
        const tocClone = tableOfContents.cloneNode(true);

        // フローティング目次に要素を追加
        floatingToc.appendChild(tocTitle);
        floatingToc.appendChild(tocClone);

        // bodyに要素を追加
        document.body.appendChild(tocButton);
        document.body.appendChild(floatingToc);

        // クリックイベントを設定
        tocButton.addEventListener('click', function () {
            floatingToc.classList.toggle('show');
        });

        // 目次内のリンクがクリックされたときの処理
        const tocLinks = floatingToc.querySelectorAll('a');
        tocLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                // 目次を閉じる
                floatingToc.classList.remove('show');
            });
        });

        // 画面外をクリックしたときに目次を閉じる
        document.addEventListener('click', function (event) {
            if (!floatingToc.contains(event.target) && event.target !== tocButton) {
                floatingToc.classList.remove('show');
            }
        });

        // スクロールイベントを設定
        let lastScrollTop = 0;
        const scrollThreshold = 200; // スクロールしきい値（px）

        window.addEventListener('scroll', function () {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // スクロール方向を判定（上下）
            const isScrollingDown = scrollTop > lastScrollTop;

            // 記事が表示されているエリアかどうかをチェック
            const entryRect = entryContent.getBoundingClientRect();
            const isEntryVisible = entryRect.top < window.innerHeight && entryRect.bottom > 0;

            // 記事エリアが表示されていて、スクロール位置が一定以上なら目次ボタンを表示
            if (isEntryVisible && scrollTop > scrollThreshold) {
                tocButton.style.display = 'block';
            } else {
                tocButton.style.display = 'none';
                floatingToc.classList.remove('show'); // 非表示エリアでは目次も閉じる
            }

            lastScrollTop = scrollTop;
        });
    });
})();
