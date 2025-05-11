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

        // 目次テキストとアイコンを含む要素を作成
        const buttonText = document.createElement('span');
        buttonText.className = 'toc-button-text';
        buttonText.textContent = '目次';

        // アイコン要素を作成
        const buttonIcon = document.createElement('span');
        buttonIcon.className = 'toc-button-icon';

        // ボタンに要素を追加
        tocButton.appendChild(buttonText);
        tocButton.appendChild(buttonIcon);

        // フローティング目次コンテナを作成
        const floatingToc = document.createElement('div');
        floatingToc.className = 'floating-toc';

        // 目次のタイトル要素を作成
        const tocTitle = document.createElement('h4');
        tocTitle.className = 'floating-toc-title';
        tocTitle.textContent = '目次';        // 目次のクローンを作成
        const tocClone = tableOfContents.cloneNode(true);

        // フローティング目次用のクラスを追加
        tocClone.classList.add('floating-toc-list');

        // フローティング目次に要素を追加
        floatingToc.appendChild(tocTitle);
        floatingToc.appendChild(tocClone);

        // bodyに要素を追加
        document.body.appendChild(tocButton);
        document.body.appendChild(floatingToc);

        // クリックイベントを設定
        tocButton.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            floatingToc.classList.toggle('show');
            tocButton.classList.toggle('active');
        });

        // 目次内のリンクがクリックされたときの処理
        const tocLinks = floatingToc.querySelectorAll('a');
        tocLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                // 目次を閉じる
                floatingToc.classList.remove('show');
                tocButton.classList.remove('active');
            });
        });

        // 画面外をクリックしたときに目次を閉じる
        document.addEventListener('click', function (event) {
            if (!floatingToc.contains(event.target) && event.target !== tocButton && !tocButton.contains(event.target)) {
                floatingToc.classList.remove('show');
                tocButton.classList.remove('active');
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
                tocButton.classList.remove('active'); // ボタンの状態もリセット
            }

            lastScrollTop = scrollTop;
        });
    });
})();
