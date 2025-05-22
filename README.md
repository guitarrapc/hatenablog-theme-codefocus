# CodeFocus

技術記事の執筆しやすさを追求したシングルカラムのテーマです。
レスポンシブデザインで、モバイル・タブレット・PCすべての画面サイズで最適表示されます。

記事の読みやすさを最優先に、余計な装飾を省いたデザインで文章に集中できます。
コードブロックは見やすい配色で、コピー機能も提供しておりプログラミングコードを扱う技術ブログに最適です。
JavaScriptカスタマイズを行うことで、特徴的な目次機能（ページ内目次・固定目次ボタン）、コードブロックコピー機能を追加して長文記事も快適に読めます。

デモページ
https://codefocus.hatenablog.jp/entry/2025/05/17/015533

カスタマイズの方法はこちらの記事を参考にしてください
https://codefocus.hatenablog.jp/entry/2025/05/20/221750

# CSSのダウンロード

最新のバージョンから `style.css` をダウンロードしてください。

- https://github.com/guitarrapc/HatenaBlog-Theme/releases

# セットアップ

SCSSで開発する場合は、下記の手順でリポジトリのcloneとモジュールのインストールを行います。

## 必須コンポーネント

- [Node.js](https://nodejs.org/)

## モジュールのインストール

```shell
$ git clone https://github.com/guitarrapc/hatenablog-theme-codefocus.git
$ cd hatenablog-theme-codefocus
$ npm install
$ npx playwright install
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
3. 1.のブログの「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」に次のスクリプトタグを追加します。
    ``` html
    <script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/style.scss" crossorigin="anonymous" />
    ```

つづいて下記のコマンドで、開発サーバーを起動します。`BLOG_DOMAIN_NAME` の部分には、上で用意した動作確認に使うブログのドメイン名 (例: `example.hatenablog.com`) を入力してください。

```shell
$ npm start -- BLOG_DOMAIN_NAME
```

コマンド実行例:

```shell
$ npm start -- guitarrapc-theme.hatenablog.com
```

以上が完了すると、動作確認用のブログに開発中のテーマが反映されます。ブログにアクセスし、表示を確認しながらテーマの開発を行なってください。

### 記事中の目次開閉機能を使用する場合

本テーマには、記事中の目次を開閉する機能が含まれています。この機能を使用するには、上記の設定に加えて以下の手順を行ってください。

1. 「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」に次のスクリプトタグを追加します。

   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/toc-toggle.js" crossorigin="anonymous"></script>
   ```

2. 本番環境で使用する場合は、[customize-toc-toggle.html](customize-toc-toggle.html) ファイルの内容をコピーして「デザイン」->「カスタマイズ」->「記事」->「記事上HTML（記事本文上）」に貼り付けてください。

   この設定により、記事ページの右上に「目次」ボタンが表示され、クリックすると目次が表示されるようになります。記事内に目次（table-of-contents）がない場合は、ボタンは表示されません。


### 目次ボタン機能を使用する場合

本テーマには、ページ右上に固定表示される「目次」ボタンの機能が含まれています。この機能を使用するには、上記の設定に加えて以下の手順を行ってください。

1. 「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」に次のスクリプトタグを追加します。
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/toc-button.js" crossorigin="anonymous"></script>
   ```

2. 本番環境で使用する場合は、[customize-toc-button.html](customize-toc-button.html) ファイルの内容をコピーして「デザイン」->「カスタマイズ」->「記事」->「記事上HTML（記事本文上）」に貼り付けてください。

   この設定により、記事ページの右上に「目次」ボタンが表示され、クリックすると目次が表示されるようになります。記事内に目次（table-of-contents）がない場合は、ボタンは表示されません。

### コードコピーボタン機能を使用する場合

本テーマには、コードブロック右上に表示されるコピーボタンの機能が含まれています。この機能を使用するには、上記の設定に加えて以下の手順を行ってください。

1. 「設定」->「詳細設定」にアクセスし、「&lt;head&gt;要素にメタデータを追加」に次のスクリプトタグを追加します。
   ``` html
   <script type="text/javascript" src="http://localhost:5173/js/code-copy.js" crossorigin="anonymous"></script>
   ```

2. 本番環境で使用する場合は、[customize-code-copy.html](customize-code-copy.html) ファイルの内容をコピーして「デザイン」->「カスタマイズ」->「記事」->「記事上HTML（記事本文上）」に貼り付けてください。

   この設定により、記事ページのコードブロック右上に「コピーアイコン」ボタンが表示され、クリックするとコードブロックをコピーします。

## コンパイル

テーマの開発が完了したら、下記のコマンドでSCSSをコンパイルします。コンパイルの結果は `build/style.css` に出力されます。

```shell
$ npm run build
```

# 構成

```
.
┣┳ scss/
┃┗┳ lib/
┃ ┗ style.scss
┗┳ build/
 ┗ style.css
```
