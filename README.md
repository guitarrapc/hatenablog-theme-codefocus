# Hatena-Blog-Theme-Boilerplate

Boilerplate は、はてなブログのデザインCSSカスタマイズの土台に適したデザインテーマです。

はてなブログの必要最小限の見た目が調整されています。「オリジナルテーマの制作にチャレンジしたいけど、0から作るのが大変」という方は、このデザインテーマをもとにしてCSSを書くと比較的楽にテーマが作れます。

*Boilerplateは自己責任でご利用ください。お問い合わせははてなブログのサポートフォームではなく、本リポジトリのIssueにお願いします。*

デザインテーマの制作にあたっては下記ヘルプページも参考にしてください。

- [デザインテーマ制作の手引き - はてなブログ ヘルプ](https://help.hatenablog.com/entry/theme/custom-theme)

# CSSのダウンロード

最新のバージョンから `boilerplate.css` をダウンロードしてください。

- <https://github.com/hatena/Hatena-Blog-Theme-Boilerplate/releases>

# セットアップ

SCSSで開発する場合は、下記の手順でリポジトリのcloneとモジュールのインストールを行います。

## 必須コンポーネント

- [Node.js](https://nodejs.org/)

## モジュールのインストール

``` console
$ git clone https://github.com/hatena/Hatena-Blog-Theme-Boilerplate.git
$ cd Hatena-Blog-Theme-Boilerplate
$ npm install
```

# テーマ開発の手順

## 開発サーバーの利用

開発サーバーを利用することで、SCSSの変更をリアルタイムにブログに反映させながらテーマの開発を行えます。

まずは[はてなブログ](https://blog.hatena.ne.jp/)の設定を行います。

1. テーマの動作確認に使うブログを1つ用意します。（普段お使いのブログとは別にブログを作成してください。）
2. 1.のブログの「デザイン設定」にアクセスし、「カスタマイズ」タブの「デザインCSS」の内容を下記に置き換えて保存します。
    ``` css
    /* Responsive: yes */
    ```
3. 1.のブログの「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」を下記に置き換えて保存します。
    ``` html
    <script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/boilerplate.scss" crossorigin="anonymous" />
    ```

### 目次ボタン機能を使用する場合

本テーマには、ページ右上に固定表示される「目次」ボタンの機能が含まれています。この機能を使用するには、上記の設定に加えて以下の手順を行ってください。

1. 「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」に次のスクリプトタグを追加します。
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/table-of-contents.js" crossorigin="anonymous"></script>
   ```

2. 本番環境で使用する場合は、下記の `toc-script.html` ファイルの内容をコピーして「&lt;head&gt;要素にメタデータを追加」に貼り付けてください。
   ``` html
   <!-- 目次ボタン用のJavaScriptコード -->
   <script>
   // このスクリプトは目次ボタンと目次表示を実装します
   (function() {
     'use strict';
     document.addEventListener('DOMContentLoaded', function() {
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
       tocButton.style.display = 'none'; // 初期状態は非表示
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
       tocButton.addEventListener('click', function(e) {
         e.preventDefault();
         e.stopPropagation();
         floatingToc.classList.toggle('show');
       });
       // 目次内のリンクがクリックされたときの処理
       const tocLinks = floatingToc.querySelectorAll('a');
       tocLinks.forEach(function(link) {
         link.addEventListener('click', function() {
           // 目次を閉じる
           floatingToc.classList.remove('show');
         });
       });
       // 画面外をクリックしたときに目次を閉じる
       document.addEventListener('click', function(event) {
         if (!floatingToc.contains(event.target) && event.target !== tocButton) {
           floatingToc.classList.remove('show');
         }
       });
       // スクロールイベントを設定
       let lastScrollTop = 0;
       const scrollThreshold = 200; // スクロールしきい値（px）
       window.addEventListener('scroll', function() {
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
   </script>
   <!-- 目次ボタン用のスタイルを適用するためのダミー要素 -->
   <div class="js-table-of-contents-script"></div>
   ```

   この設定により、記事ページの右上に「目次」ボタンが表示され、クリックすると目次が表示されるようになります。記事内に目次（table-of-contents）がない場合は、ボタンは表示されません。

つづいて下記のコマンドで、開発サーバーを起動します。`BLOG_DOMAIN_NAME` の部分には、上で用意した動作確認に使うブログのドメイン名 (例: `example.hatenablog.com`) を入力してください。

``` console
$ npm start -- BLOG_DOMAIN_NAME
```

コマンド実行例:

``` console
$ npm start -- guitarrapc-theme.hatenablog.com
```

以上が完了すると、動作確認用のブログに開発中のテーマが反映されます。ブログにアクセスし、表示を確認しながらテーマの開発を行なってください。

## コンパイル

テーマの開発が完了したら、下記のコマンドでSCSSをコンパイルします。コンパイルの結果は `build/boilderplate.css` に出力されます。

``` console
$ npm run build
```

# 構成

```
boilerplate/
┣┳ scss/
┃┗┳ lib/
┃ ┗ boilerplate.scss
┗┳ build/
 ┗ boilerplate.css
```

# ライセンス

このCSSおよびSCSSファイルはMITライセンスのもと自由に複製・再配布できます。 記事本文の書式やコメント欄のスタイルなど、必要な部分だけをコピーして使ってもかまいません。 このデザインテーマをもとにしたテーマの配布も自由です。

# 過去のバージョン

- <https://github.com/hatena/Hatena-Blog-Theme-Boilerplate-Less>
  - BoilerplateのLessバージョンです。（開発終了）
