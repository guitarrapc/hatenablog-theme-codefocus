[![Build](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/build.yaml)
[![Release](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml/badge.svg)](https://github.com/guitarrapc/hatenablog-theme-codefocus/actions/workflows/release.yaml)

<div align="center">

# <img src="./assets/logo_mark.png" alt="" height="32"> CodeFocus

**技術記事の執筆しやすさを追求したシングルカラムのテーマ**

[English](README.md) | 日本語

</div>

レスポンシブデザインで、モバイル・タブレット・PCすべての画面サイズで最適表示されます。

記事の読みやすさを最優先に、余計な装飾を省いたデザインで文章に集中できます。
コードブロックは見やすい配色で、コピー機能も提供しておりプログラミングコードを扱う技術ブログに最適です。
JavaScriptカスタマイズを行うことで、特徴的な目次機能（ページ内目次・固定目次ボタン）、コードブロックコピー機能、GitHubと同じアラート記法を追加して長文記事も快適に読めます。
また、ダークモード対応で、システム設定に合わせた自動切り替えや手動での切り替えも可能です。

デモページ
https://codefocus.hatenablog.jp/entry/2025/05/17/015533

カスタマイズの方法はこちらの記事を参考にしてください
https://codefocus.hatenablog.jp/entry/2025/05/20/221750

## 利用方法

可能ならば、はてなブログテーマストアからの導入を推奨します。

### はてなブログテーマストアから導入する

はてなブログテーマストアから「CodeFocus」を検索してインストールしてください。
JavaScriptカスタマイズを利用する場合は、以下の手順で設定を行ってください。

### JavaScriptカスタマイズの設定手順

最新のバージョンの`theme-バージョン.zip`をダウンロードしてください。 例えば、バージョンがv1.6.1の場合は`theme-1.6.1.zip`となります。

- https://github.com/guitarrapc/HatenaBlog-Theme/releases/latest

中には、スタイルシート`style.css`と、テーマの設定を行うためのHTMLファイルが含まれています。スタイルシートはテーマストアからテーマをインストールした場合自動的に適用されるため、style.cssを手動で貼り付ける必要はありません。

#### コードブロックにコピーボタンと折り返し切り替えボタンを提供する機能

コードブロックの使いやすさを向上させるために、以下の機能を提供します。
- コードブロック右上に「コピーアイコン」ボタンが表示され、クリックするとコードブロックをコピーします。
- コードブロック右上に「折り返し切り替え」ボタンが表示され、クリックすると折り返し表示と横スクロール表示を切り替えられます。デフォルトでは折り返しなしで横スクロール可能な表示になっています。

> [!TIP]
> [customize-codeblock.html](customize-codeblock.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

#### ダークモード機能

記事ページの右上にダークモードを切り替えるボタンが表示されます。ユーザーの選択は次回訪問時も記憶され、システム設定を自動で追従するので夜間の閲覧も快適です。
- 太陽アイコン: ライトモードに固定します
- 月アイコン: ダークモードに固定します
- モニターアイコン: システム設定に合わせて自動切り替えします（デフォルト）

> [!TIP]
> [customize-dark-mode.html](customize-dark-mode.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

#### タグクラウド機能

カテゴリを記事数によってサイズを変えて表示します。

> [!TIP]
> [customize-tag-cloud.html](customize-tag-cloud.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

#### 記事中の目次開閉機能

記事中の目次を開閉できるようになります。記事内に目次（table-of-contents）がない場合は、目次自体が表示されません。

> [!TIP]
> [customize-toc-toggle.html](customize-toc-toggle.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

#### ページ右上に固定表示される「目次」ボタンの機能

記事ページの右上に「目次」ボタンが固定表示され、クリックすると目次が表示されるようになります。記事内に目次（table-of-contents）がない場合は、ボタンは表示されません。

> [!TIP]
> [customize-toc-button.html](customize-toc-button.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

#### アラート記法の機能

GitHubのアラート記法をアラート表示にします。引用の1行目に`[!NOTE]`、`[!TIP]`、`[!IMPORTANT]`、`[!WARNING]`、`[!CAUTION]`のいずれかを書きます。同じ原稿はGitHubでもアラートとして表示され、スクリプトが動かない環境(RSSリーダーなど)では通常の引用として表示されます。

```markdown
> [!NOTE]
> 流し読みでも把握しておいてほしい情報です。
```

GitHubと同じく、アラートは空行で区切って続けて書けます。また、`[!NOTE]`だけで本文のない引用はアラートにせずそのまま表示します。

ただし、はてなブログは空行で区切った連続する引用を1つの引用にまとめて出力するため、次の点がGitHubと異なります。

- アラートの直後に空行だけで区切って通常の引用を書くと、その引用もアラートの本文に含まれます。間に通常の段落を書いてください。
- 引用の途中に、`[!NOTE]`などで始まり本文が続く段落があると、そこから新しいアラートになります。`[!NOTE]`だけの引用の直後に空行で区切って通常の引用を書いた場合も、1つのアラートになります。

> [!TIP]
> [customize-alert.html](customize-alert.html)を、はてなブログの「デザイン」->「カスタマイズ」->「ヘッダ」->「ブログタイトル下」に貼り付けます。

## 開発環境を構築する

SCSSで開発する場合は、下記の手順でリポジトリのcloneとモジュールのインストールを行います。
必須コンポーネントは、以下の通りです。

- [Node.js](https://nodejs.org/)

### モジュールのインストール

```shell
$ git clone https://github.com/guitarrapc/hatenablog-theme-codefocus.git
$ cd hatenablog-theme-codefocus
$ npm install
$ npx playwright install
```

### 開発用ブログに開発サーバーを設定する

開発サーバーを利用することで、SCSSの変更をリアルタイムにブログに反映させながらテーマの開発を行えます。

まずは[はてなブログ](https://blog.hatena.ne.jp/)の設定を行います。

1. テーマの動作確認に使うブログを1つ用意します。（普段お使いのブログとは別にブログを作成してください。）
2. 1.のブログの「デザイン設定」にアクセスし、「カスタマイズ」タブの「デザインCSS」の内容を下記に置き換えて保存します。
    ``` css
    /* Responsive: yes */
    ```
3. 1.のブログの「設定」->「詳細設定」にアクセスし、「`head`要素にメタデータを追加」に次のスクリプトタグを追加します。
    ``` html
    <script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
    <link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/style.scss" crossorigin="anonymous" />
    <script type="text/javascript" src="http://localhost:5173/js/codeblock.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/dark-mode.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/tag-cloud.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/toc-toggle.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/toc-button.js" crossorigin="anonymous"></script>
    <script type="text/javascript" src="http://localhost:5173/js/alert.js" crossorigin="anonymous"></script>
    ```

### 開発サーバーを起動する

下記のコマンドで、開発サーバーを起動します。`BLOG_DOMAIN_NAME` の部分には、上で用意した動作確認に使うブログのドメイン名 (例: `example.hatenablog.com`) を入力してください。

```shell
$ npm start -- guitarrapc-theme.hatenablog.com
```

以上が完了すると、動作確認用のブログに開発中のテーマが反映されます。ブログにアクセスし、表示を確認しながらテーマの開発を行なってください。

### 開発コードをテストする

別ターミナルでサーバーを起動しておきます。
テストを実行します。

```shell
$ npm run test
```

### 本番用にコンパイルする

テーマの開発が完了したら、下記のコマンドでSCSSをコンパイルします。コンパイルの結果は `build/style.css` に出力されます。

```shell
$ npm run build
```

コンパイルされたCSSは、はてなブログの「デザイン」->「カスタマイズ」->「デザインCSS」に貼り付けて利用することができます。
ストアにアップロードするCSSも同様に `build/style.css` の内容を利用してください。

### Lighthouseで計測する

開発用ブログの記事に対してLighthouseを実行し、スコアとレポートを `lighthouse-report/` に出力します。Chromeが必要です。

```shell
$ npm run lighthouse
```

既定では本番相当の状態を計測します。はてなブログの設定は変更せず、ローカルのHTTPSプロキシで開発用ブログの応答を次のように書き換えます。

- `head`要素に追加した `http://localhost:5173` のタグを取り除く
- 「デザインCSS」の中身を `build/style.css` に差し替える
- `customize-*.html` を「ブログタイトル下」に挿入する

開発サーバーを起動しておく必要はありません。プロキシの自己署名証明書を作るため`openssl`を使います(Git for Windowsに同梱されています)。

計測するURL、端末、回数を指定できます。複数回実行した場合は、Performanceスコアが中央値の回のレポートを保存します。

```shell
$ npm run lighthouse -- https://guitarrapc-theme.hatenablog.com/entry/2025/05/17/015533 --form=desktop --runs=3
```

開発サーバーから読み込んだ状態をそのまま計測する場合は `npm run lighthouse:dev` を使います。ただし未圧縮のSCSS/JSや`@vite/client`を読み込むため、Performanceは本番と一致しません。
