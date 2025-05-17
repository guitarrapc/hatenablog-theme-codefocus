# CodeFocus - コードと記事に集中できるはてなブログデザインテーマ

はてなブログをもっとシンプルに、もっと読みやすく。CodeFocusテーマは、[Zenn](https://zenn.dev/)スタイルからインスピレーションを得た、プログラミングブログに最適なシングルカラムデザインのはてなブログテーマです。

[:contents]

## テーマの特徴

CodeFocusテーマは、以下の特徴を持つ現代的なデザインテーマです：

- **シンプルなシングルカラムレイアウト** - コンテンツに集中できる余白と配置を重視したデザイン
- **美しいコードハイライト** - プログラミング記事に最適な読みやすいコード表示
- **便利な目次機能** - 記事内の目次とフローティング目次の両方をサポート
- **完全レスポンシブデザイン** - PC、タブレット、スマートフォンすべてで最適表示
- **タグクラウドスタイル** - カテゴリーを記事数に応じて視覚的に分類
- **Zenn風コメントデザイン** - スッキリと読みやすいディスカッション表示

## デザインと見た目

CodeFocusテーマは、すべてのデバイスで美しく表示されるよう設計されています。

CodeFocusテーマは複数のデバイスサイズに最適化されており、それぞれのデバイスで読みやすく美しい表示を実現しています。

### デバイス別の記事表示

各デバイスでの表示の違いを以下に示します。PCでは十分な余白を持ったレイアウト、タブレットではタッチ操作に適したサイズ調整、スマートフォンでは限られた画面サイズを最大限に活用するレイアウトになっています。

PCでは、コンテンツを中心に配置し、サイドバーが下部に移動することで、記事本文に集中できる環境を提供します。タブレットとスマートフォンでは、デバイスの特性に合わせて余白やフォントサイズが自動調整され、それぞれのデバイスに最適化された読みやすさを実現しています。

| PC表示 | タブレット表示 | スマートフォン表示 |
| --- | --- | --- |
| [f:id:guitarrapc_tech:20250517234003p:plain:alt=PC表示] | [f:id:guitarrapc_tech:20250517234019p:plain:alt=タブレット表示] | [f:id:guitarrapc_tech:20250517234031p:plain:alt=スマートフォン表示] |

<!-- | screenshots/pc-article-top.png | screenshots/tablet-article-top.png | screenshots/smartphone-article-top.png | -->

## コードハイライトとタグクラウド

CodeFocusテーマはプログラミング記事に最適なスタイルを提供します。

### コードハイライト表示

プログラミング言語のコードブロックを見やすく表示します。色彩がはっきりしており、長いコードでも読みやすいデザインです。

以下は、Python、C#、Goで同一処理を記述したコードの表示例です：

Pythonコードハイライト

[f:id:guitarrapc_tech:20250517234158p:plain:alt=Pythonコードハイライトのスクリーンショット] <!-- screenshots/pc-code-python.png -->

C#コードハイライト

[f:id:guitarrapc_tech:20250517234210p:plain:alt=C#コードハイライトのスクリーンショット] <!-- screenshots/pc-code-csharp.png -->

Goコードハイライト

[f:id:guitarrapc_tech:20250517234232p:plain:alt=Goコードハイライトのスクリーンショット] <!-- screenshots/pc-code-go.png -->

### タグクラウドスタイル

サイドバーのカテゴリーモジュールは、タグクラウドスタイルになっており記事数に応じて視覚的に表示します。記事数が多いカテゴリーほど大きく表示されるため、ブログの主要テーマが一目でわかります。

具体的な記事数に応じた表示は以下のようになっています：

- **1～5記事**: 小さめのフォント (0.8em)
- **6～10記事**: やや小さめのフォント (0.9em)
- **11～20記事**: 標準サイズ (1em)
- **21～50記事**: やや大きめのフォント (1.1～1.2em)、太字
- **51記事以上**: 大きめのフォント (1.3em)、太字

[f:id:guitarrapc_tech:20250517234514p:plain:alt=サイドバーのタグクラウド表示] <!-- screenshots/pc-sidebar-tag-cloud.png -->

## 便利な目次機能

CodeFocusテーマでは、2種類の目次表示方法を提供しています：

※ テーマ導入後、後述するJavaScriptの設定が必要です。

### 1. 記事内目次

記事の`[:contents]`で生成される目次をスタイリングしました。タイトル部分をクリックすることで開閉可能な目次は、長い記事でも読者が迷わずに読み進められるようサポートします。

[f:id:guitarrapc_tech:20250517234600p:plain:alt=記事内目次のスクリーンショット] <!-- screenshots/pc-toc.png -->

### 2. フローティング目次ボタン

記事右上に常に表示される目次ボタンを提供します。このボタンをクリックするといつでも目次を表示できるため、長い記事でも迷子になることがありません。

[f:id:guitarrapc_tech:20250517234703p:plain:alt=フローティング目次ボタンのスクリーンショット] <!-- screenshots/pc-toc-button.png -->

目次スタイルはシンプルでありながらも機能的です。

[f:id:guitarrapc_tech:20250517234722p:plain:alt=フローティング目次コンテンツのスクリーンショット] <!-- screenshots/pc-floating-toc.png -->

フローティング目次には、閲覧体験を向上させる機能が搭載されています：

#### 1. 自動スクロールポジション追従

記事をスクロールすると、現在読んでいるセクションに対応する目次項目が自動でハイライトされます。これにより、長い記事でも現在どのセクションを読んでいるかが一目でわかります。

[f:id:guitarrapc_tech:20250517234755p:plain:alt=現在のセクションがハイライトされた目次] <!-- screenshots/toc-first-section-scrolled.png -->

#### 2. ワンクリックでページトップへ移動

フローティング目次の上部には「ページトップへ」ボタンを設置。長い記事を読み終えた後、このボタンをクリックするだけで、スムーズにページ最上部へ移動できます。

#### 3. インテリジェントな表示制御

フローティング目次ボタンは、以下のような表示制御を行います：

- 記事の冒頭部分（スクロール位置が浅い場合）では表示されず、一定量スクロールした後に表示
- 目次内のリンクをクリックすると自動的に目次が閉じ、記事の該当セクションにスムーズに移動
- 画面外をクリックすると目次が自動的に閉じる

これらの機能により、記事の閲覧に集中しながらも、必要なときにすぐに目次にアクセスできる快適な読書体験を実現しています。

## テーマの導入方法

はてなブログのテーマストア(推奨)か、GitHubから直接ダウンロードして導入できます。

### テーマストアからの導入

1. [テーマストア](https://blog.hatena.ne.jp/-/store/theme/)から、「CodeFocus」を選択
2. 自分のブログにインストール

### GitHubからの導入

1. [HatenaBlog-Theme](https://github.com/guitarrapc/HatenaBlog-Theme) リポジトリから最新版の `style.css` をダウンロード
2. はてなブログの管理画面から「デザイン設定」→「カスタマイズ」→「デザインCSS」にCSSをコピー＆ペースト
3. 「保存」ボタンをクリックしてテーマを適用

## テーマ導入後の設定

### レスポンシブデザイン設定

CodeFocusテーマはレスポンシブデザインに完全対応していますが、正しく表示するには以下の設定が必要です：

1. はてなブログの管理画面から「デザイン設定」→「スマートフォン」に進む
2. 「詳細設定」のセクションで「レスポンシブデザインを適用する」にチェック
3. 変更を保存

[f:id:guitarrapc_tech:20250517234922p:plain:alt=デザイン設定からスマートフォンをレスポンシブデザイン設定のスクリーンショット] <!-- screenshots/smartphone-responsive-design.png -->

### 目次開閉機能を利用する

記事中の目次を開閉する機能を使用するには、以下の設定を行ってください：

1. [toc-toggle.html](https://github.com/guitarrapc/HatenaBlog-Theme/blob/master/toc-toggle.html) ファイルの内容をコピー
2. はてなブログの管理画面から「詳細設定」→「`<head>要素にメタデータを追加`」に貼り付け
3. 変更を保存

### 目次ボタン機能を利用する

ページ右上に固定される目次ボタンを使用するには、以下の設定を行ってください：

1. [toc-button.html](https://github.com/guitarrapc/HatenaBlog-Theme/blob/master/toc-button.html) ファイルの内容をコピー
2. はてなブログの管理画面から「詳細設定」→「`<head>要素にメタデータを追加`」に貼り付け
3. 変更を保存

### はてなブログPro契約者向け設定

はてなブログProをご利用の方は、トップページを一覧形式に設定することで、多くの記事を一度に見やすいアーカイブ表示を活用できます。いくつかの記事を一覧で表示することで、読者は興味のある記事にすぐにアクセスできます。

1. 「設定」→「詳細設定」でヘッダーとフッターを非表示に設定
2. 「デザイン」→「カスタマイズ」→「レイアウト」で「トップページを一覧形式にする」を選択
3. 変更を保存

| PC表示 | タブレット表示 | スマートフォン表示 |
| --- | --- | --- |
|[f:id:guitarrapc_tech:20250517235000p:plain:alt=PC表示の一覧スクリーンショット] | [f:id:guitarrapc_tech:20250517235046p:plain:alt=タブレット表示の一覧スクリーンショット] | [f:id:guitarrapc_tech:20250517235104p:plain:alt=スマートフォン表示の一覧スクリーンショット] |

<!-- | ![PC表示の一覧スクリーンショット](screenshots/pc-archive-top.png) | ![タブレット表示の一覧スクリーンショット](screenshots/tablet-archive-top.png) | ![スマートフォン表示の一覧スクリーンショット](screenshots/smartphone-archive-top.png) | -->

## カスタマイズ方法

CodeFocusテーマは、カスタマイズしやすい構造になっています。CSSの知識があれば、以下のような部分を簡単にカスタマイズできます：

### 色の変更

```css
/* 文字色の変更 */
body {
  color: #333333; /* 文字色 */
}

/* リンク色の変更 */
a {
  color: #3366ff; /* リンク色 */
}
a:hover {
  color: #0044cc; /* ホバー時のリンク色 */
}

/* 背景色の変更 */
body {
  background-color: #ffffff; /* 背景色 */
}
```

### フォントの変更

```css
body {
  font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
}
```

### 目次スタイルのカスタマイズ

```css
ul.table-of-contents {
  border-radius: 8px;
  background-color: #f8f9fa;
}
```

### カテゴリーの表示スタイル変更

記事内のカテゴリーは丸みを帯びたタグスタイルで表示されます。

[f:id:guitarrapc_tech:20250517235245p:plain:alt=記事タイトル下のカテゴリー表示のスクリーンショット] <!-- screenshots/pc-category-container.png -->

ホバー時の挙動も設定可能です。

```css
.categories a {
  border-radius: 16px;
  padding: 3px 10px;
}
```

通常表示:
[f:id:guitarrapc_tech:20250517235312p:plain:alt=カテゴリー表示のスクリーンショット] <!-- screenshots/pc-category-item.png -->

ホバー時:
[f:id:guitarrapc_tech:20250517235325p:plain:alt=カテゴリーホバーのスクリーンショット] <!-- screenshots/pc-category-item-hover.png -->

### タグクラウドのカスタマイズ

サイドバーのカテゴリーモジュールはタグクラウドスタイルで表示されます。記事数に応じたフォントサイズの変化やホバー効果をカスタマイズできます。

```css
/* タグクラウドのベーススタイル */
.hatena-module-category .hatena-module-body .hatena-urllist li a {
  display: inline-block;
  padding: 0.3em 0.6em;
  border-radius: 20px;
  text-decoration: none;
  border: 1px solid #d6e3ed; /* border-light変数の値 */
  transition: all 0.2s ease;
}

/* 記事数による大きさの調整 */
/* 1-5記事 (小) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(1)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(2)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(3)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(4)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(5)"] {
  font-size: 0.8em;
}

/* 6-10記事 (やや小) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(6)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(7)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(8)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(9)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(10)"] {
  font-size: 0.9em;
}

/* 11-20記事 (標準) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(11)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(12)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(13)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(14)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(15)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(16)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(17)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(18)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(19)"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(20)"] {
  font-size: 1em;
}

/* 21-50記事 (やや大) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(2"][href$=")"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(3"][href$=")"],
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(4"][href$=")"] {
  font-size: 1.1em;
  font-weight: bold;
}

/* 21-50記事のうち、2桁以上の記事数 (除外条件付き) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(2"][href$=")"]:not([href*="(2)"]):not([href*="(3)"]):not([href*="(4)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(3"][href$=")"]:not([href*="(2)"]):not([href*="(3)"]):not([href*="(4)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(4"][href$=")"]:not([href*="(2)"]):not([href*="(3)"]):not([href*="(4)"]) {
  font-size: 1.2em;
}

/* 51記事以上 (大) */
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(5"][href$=")"]:not([href*="(5)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(6"][href$=")"]:not([href*="(6)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(7"][href$=")"]:not([href*="(7)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(8"][href$=")"]:not([href*="(8)"]),
.hatena-module-category .hatena-module-body .hatena-urllist li a[href*="(9"][href$=")"]:not([href*="(9)"]) {
  font-size: 1.3em;
  font-weight: bold;
}

/* ホバー効果 */
.hatena-module-category .hatena-module-body .hatena-urllist li a:hover {
  background-color: #f5f5f5; /* テーマのbtn-hover変数の値 */
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.1);
}
```

### コメントセクションのカスタマイズ

CodeFocusテーマでは、コメントセクションもZennのDiscussionスタイルに似たデザインになっています。ユーザー名や日付が見やすく配置され、コメント内容も読みやすくレイアウトされています。

| PC表示 | タブレット表示 | スマートフォン表示 |
| --- | --- | --- |
| [f:id:guitarrapc_tech:20250517235429p:plain:alt=PC表示のコメントセクションのスクリーンショット] | [f:id:guitarrapc_tech:20250517235508p:plain:alt=タブレット表示のコメントセクションのスクリーンショット] | [f:id:guitarrapc_tech:20250517235524p:plain:alt=スマートフォン表示のコメントセクションのスクリーンショット] |

<!-- | screenshots/pc-comment-section.png | screenshots/tablet-comment-section.png | screenshots/smartphone-comment-section.png | -->

より高度なカスタマイズをしたい方は、[GitHub リポジトリ](https://github.com/guitarrapc/HatenaBlog-Theme)からSCSSファイルをダウンロードして、ローカルで開発することもできます。

## 開発者向け情報

テーマをさらにカスタマイズしたい開発者の方々へ、CodeFocusテーマは以下のような構造でSCSSファイルが分割されています：

- `_variable.scss` - カラーやフォントなどの変数定義
- `_core.scss` - 全体のベーススタイル
- `_functions.scss` - SCSSで使用する関数定義
- `_related_entries.scss` - 関連記事のスタイル
- `_table_of_contents.scss` - 記事内目次のスタイル
- `_table_of_contents_toggle.scss` - 目次開閉機能のスタイル
- `_table_of_contents_button.scss` - 目次ボタンのスタイル

この構造により、特定の部分だけを変更したい場合も簡単に対応できます。

### ローカル開発環境の構築

開発環境を構築することで、リアルタイムで変更を確認しながらテーマをカスタマイズできます：

```bash
# リポジトリのクローン
git clone https://github.com/guitarrapc/HatenaBlog-Theme.git
cd HatenaBlog-Theme

# 必要なモジュールをインストール
npm install

# 開発サーバーの起動（ブログドメイン名を指定）
npm start -- your-blog.hatenablog.com
```

ブログ記事で開発サーバーのスタイルを参照させるため、はてなブログ → 詳細設定 → `<head>要素にメタデータを追加` に以下を追加してください：

```html
<script type="module" src="http://localhost:5173/@vite/client" crossorigin="anonymous"></script>
<link rel="stylesheet" type="text/css" href="http://localhost:5173/scss/style.scss" crossorigin="anonymous" />
```

これにより、SCSSの変更がリアルタイムでブログに反映され、即座に効果を確認できます。

## 関連記事の表示

CodeFocusテーマでは、関連記事もレイアウトされています。サムネイル画像とタイトル、日付が見やすく配置されており、読者が関連コンテンツを探しやすくなっています。

[f:id:guitarrapc_tech:20250517235646p:plain:alt=関連記事表示のスクリーンショット] <!-- screenshots/pc-related-entries.png -->

## まとめ

CodeFocusテーマは、美しく読みやすいブログを簡単に実現できる、モダンなはてなブログテーマです。特にプログラミングやコード記事を書くブロガーにおすすめのデザインで、コンテンツの表示を最適化しています。

シンプルなデザインながらも必要な機能をすべて備えており、ブログ執筆に集中できる環境を提供します。レスポンシブデザインにより、あらゆるデバイスからの閲覧にも対応しています。

ぜひあなたのブログに取り入れて、読者に快適な読書体験を提供してください！

---

*CodeFocusテーマに関するフィードバックやご質問は、[GitHub Issues](https://github.com/guitarrapc/HatenaBlog-Theme/issues)にてお待ちしております。*
