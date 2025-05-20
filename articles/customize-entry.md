# CodeFocusテーマのカスタマイズガイド

CodeFocusテーマをインストールして基本設定を行ったら、次はあなた好みにカスタマイズしてみましょう。このガイドでは、CodeFocusテーマをカスタマイズするための様々な方法を紹介します。

[:contents]

## カスタマイズの基本

CodeFocusテーマは、カスタマイズしやすい構造になっています。はてなブログの管理画面から「デザイン設定」→「カスタマイズ」→「デザインCSS」に追加のCSSを記述することで、様々な部分をカスタマイズできます。

## 色のカスタマイズ

### メイン文字色と背景色の変更

```css
/* 文字色の変更 */
body {
  color: #333333; /* 文字色 */
}

/* 背景色の変更 */
body {
  background-color: #ffffff; /* 背景色 */
}
```

### リンク色の変更

```css
/* リンク色の変更 */
a {
  color: #3366ff; /* リンク色 */
}

a:hover {
  color: #0044cc; /* ホバー時のリンク色 */
}
```

### カテゴリー色の変更

カテゴリーの色を変更するには、以下のようなCSSを追加します：

```css
/* カテゴリーの色変更 */
.categories a {
  color: #555555; /* カテゴリーテキスト色 */
  border-color: #cccccc; /* カテゴリー枠線色 */
}

.categories a:hover {
  background-color: #f0f0f0; /* ホバー時の背景色 */
}
```

### 目次関連の色変更

目次の色をカスタマイズするには、以下のようなCSSを追加します：

```css
/* 目次の色変更 */
.table-of-contents {
  background-color: #f8f9fa; /* 目次背景色 */
  border-color: #e9ecef; /* 目次枠線色 */
}

/* 目次ボタンの色変更 */
.toc-button {
  background-color: #ffffff; /* 目次ボタン背景色 */
  color: #444444; /* 目次ボタン文字色 */
  border-color: #e9ecef; /* 目次ボタン枠線色 */
}
```

## フォントの変更

### 本文フォントの変更

```css
body {
  font-family: 'Helvetica Neue', Arial, 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;
}
```

### 見出しフォントの変更

```css
.entry-content h1,
.entry-content h2,
.entry-content h3,
.entry-content h4,
.entry-content h5,
.entry-content h6 {
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
}
```

### Webフォントの利用

Google Fontsなどのウェブフォントを利用する場合は、以下のようにCSSを記述します：

```css
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap');

body {
  font-family: 'Noto Sans JP', sans-serif;
}

.entry-content h1,
.entry-content h2,
.entry-content h3 {
  font-family: 'Noto Sans JP', sans-serif;
  font-weight: 700;
}
```

## コードブロックのカスタマイズ

### コードブロックのスタイル変更

```css
/* コードブロックの背景色と文字色を変更 */
pre.code {
  background-color: #282c34; /* 背景色をより暗く */
  color: #abb2bf; /* 文字色を明るく */
}

/* コードブロックの枠線スタイル */
pre.code {
  border: 1px solid #3e4451; /* 枠線色を調整 */
  border-radius: 6px; /* 角の丸みを増やす */
}
```

### シンタックスハイライトの調整

```css
/* クラス名などの特定の構文要素色を変更 */
pre.code span.synIdentifier {
  color: #e06c75; /* クラス名など */
}

pre.code span.synStatement {
  color: #c678dd; /* キーワード */
}

pre.code span.synConstant {
  color: #98c379; /* 文字列 */
}

pre.code span.synComment {
  color: #7f848e; /* コメント */
}
```

### コードコピーボタンのカスタマイズ

```css
/* コピーボタンの色を変更 */
.code-copy-button {
  background-color: #465670; /* ボタンの背景色 */
  border-color: #465670; /* ボタンの枠線色 */
}

/* コピーボタンのホバー時の表示 */
.code-copy-button:hover {
  opacity: 1;
  background-color: #566b8c; /* ホバー時の背景色 */
}

/* ツールチップのスタイル変更 */
.code-copy-button[title]:hover::after {
  content: attr(title);
  position: absolute;
  top: -35px;
  right: 0;
  padding: 4px 10px; /* 内側の余白を大きく */
  background-color: rgba(0, 0, 0, 0.8); /* ツールチップの背景色を濃く */
  color: white;
  border-radius: 6px; /* 角の丸みを増やす */
  font-size: 12px;
  white-space: nowrap;
  z-index: 10;
}
```

## 目次のカスタマイズ

### 記事内目次のスタイル変更

```css
ul.table-of-contents {
  border-radius: 8px;
  background-color: #f8f9fa;
  padding: 1.5em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* 目次のタイトル部分 */
.table-of-contents-header {
  font-weight: bold;
  margin-bottom: 1em;
  font-size: 1.1em;
}
```

### フローティング目次ボタンのカスタマイズ

```css
/* 目次ボタンのスタイル変更 */
.toc-button {
  border-radius: 30px; /* より丸いボタン */
  box-shadow: 0 2px 8px rgba(0,0,0,0.15); /* より目立つ影 */
  padding: 8px 15px; /* 内側の余白を拡大 */
}

/* 目次コンテンツのスタイル変更 */
.floating-toc {
  border-radius: 10px;
  box-shadow: 0 3px 10px rgba(0,0,0,0.2);
}
```

### 目次マーカーとラインのカスタマイズ

```css
/* 目次のマーカーの色と大きさを変更 */
.floating-toc li:before,
.table-of-contents li:before {
  background-color: #5c9ee7; /* マーカーの色を変更 */
  width: 10px; /* マーカーを大きく */
  height: 10px;
}

/* 目次の縦線の色を変更 */
.floating-toc ul:after,
.table-of-contents ul:after {
  background-color: #d1e1f9; /* 縦線の色を薄く */
}

/* アクティブな項目のマーカーを目立たせる */
.floating-toc li.active:before {
  background-color: #2e7dd1; /* アクティブマーカーの色 */
  transform: scale(1.2); /* やや大きく */
}
```

## カテゴリーのカスタマイズ

### 記事内カテゴリーのスタイル変更

記事内のカテゴリーは丸みを帯びたタグスタイルで表示されます。

[f:id:guitarrapc_tech:20250517235245p:plain:alt=記事タイトル下のカテゴリー表示のスクリーンショット] <!-- screenshots/pc-category-container.png -->

```css
.categories a {
  border-radius: 16px; /* 丸みの調整 */
  padding: 3px 10px; /* 内側の余白 */
  font-size: 0.85em; /* 文字サイズを少し小さく */
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

## コメントセクションのカスタマイズ

CodeFocusテーマでは、コメントセクションもZennのDiscussionスタイルに似たデザインになっています。これをさらにカスタマイズできます。

[f:id:guitarrapc_tech:20250517235429p:plain:alt=コメントセクションのスクリーンショット] <!-- screenshots/pc-comment-section.png -->

```css
/* コメントセクションの全体スタイル */
.comment-box {
  background-color: #fafafa; /* 背景色を変更 */
  border-radius: 12px; /* 角の丸みを増やす */
  padding: 20px; /* 内側の余白を増やす */
}

/* コメント間の区切り線 */
.comment-box .comment li + li {
  border-top: 1px dashed #e0e0e0; /* 点線にする */
  padding-top: 1.5em; /* 上の余白を増やす */
}

/* コメントユーザー名 */
.comment-user-name {
  font-weight: bold;
  color: #333333;
}

/* コメント日時 */
.comment-metadata {
  color: #888888;
  font-size: 0.85em;
}

/* コメント本文 */
.comment-content {
  line-height: 1.7; /* 行間を広げる */
}
```

## レイアウトのカスタマイズ

### コンテンツ幅の調整

```css
/* メインコンテンツの最大幅 */
#wrapper {
  max-width: 900px; /* 幅を広げる */
}

/* 記事本文の最大幅 */
.entry-content {
  max-width: 800px; /* 記事の幅を調整 */
  margin: 0 auto; /* 中央寄せ */
}
```

### 余白の調整

```css
/* 記事と記事の間隔 */
.entry + .entry {
  margin-top: 3em; /* 余白を増やす */
}

/* 記事内の段落間隔 */
.entry-content p {
  margin-bottom: 1.5em; /* 段落間の余白を増やす */
}

/* 見出し周りの余白 */
.entry-content h2 {
  margin-top: 2.5em; /* 見出し上の余白を増やす */
  margin-bottom: 1em; /* 見出し下の余白を調整 */
}
```

### フッターブログパーツのレイアウト調整

```css
/* フッターブログパーツの配置調整 */
#box2-inner {
  display: flex;
  flex-wrap: wrap;
  gap: 2em; /* モジュール間の間隔を増やす */
}

/* 各ブログパーツの幅調整 */
.hatena-module {
  width: calc(33.333% - 1.5em); /* 3カラムレイアウト */
}

/* スマホでの表示調整 */
@media (max-width: 768px) {
  .hatena-module {
    width: 100%; /* モバイルでは1カラムに */
  }
}
```

## テーマカラーの変更

全体的なテーマカラーを変更するには、主要な色を一括で変更するとよいでしょう。以下の例では、ブルーベースからグリーンベースに変更するCSSを示します：

```css
/* メインカラーの変更（青→緑） */
a {
  color: #2c9a7a; /* リンク色 */
}

a:hover {
  color: #1d6b54; /* ホバー時のリンク色 */
}

/* ボタン系要素の色変更 */
.toc-button,
.code-copy-button,
button.hatena-bookmark-button,
.comment-box .leave-comment-title {
  background-color: #2c9a7a;
  border-color: #2c9a7a;
}

/* アクセントカラー（弱い緑） */
blockquote,
.table-of-contents,
.floating-toc {
  border-color: #d0e9e1;
  background-color: #f5faf8;
}

/* 目次マーカーの色変更 */
.floating-toc li:before,
.table-of-contents li:before {
  background-color: #2c9a7a;
}
.floating-toc ul:after,
.table-of-contents ul:after {
  background-color: #d0e9e1;
}
```

## モバイル向けのカスタマイズ

モバイルデバイスでの表示を最適化するには、メディアクエリを使用して特定の画面サイズでのみ適用されるスタイルを定義します：

```css
/* スマートフォン向け調整 (767px以下) */
@media screen and (max-width: 767px) {
  /* フォントサイズを調整 */
  body {
    font-size: 15px;
  }

  /* 見出しのサイズを調整 */
  .entry-content h1 {
    font-size: 1.7em;
  }
  .entry-content h2 {
    font-size: 1.5em;
  }

  /* 余白を調整 */
  #wrapper,
  #box2 {
    padding-left: 15px;
    padding-right: 15px;
  }

  /* コードブロックの調整 */
  pre.code {
    font-size: 0.9em;
    padding: 10px;
  }
}

/* タブレット向け調整 (768px-1024px) */
@media screen and (min-width: 768px) and (max-width: 1024px) {
  /* タブレット特有の調整 */
  #wrapper {
    padding-left: 25px;
    padding-right: 25px;
  }

  /* 画像サイズの最適化 */
  .entry-content img {
    max-width: 90%;
    height: auto;
  }
}
```

## 高度なカスタマイズ

### ダークモードの追加

メディアクエリを使用して、システムのダークモード設定に応じて自動的に切り替わるダークモードを実装できます：

```css
@media (prefers-color-scheme: dark) {
  /* ダークモードの基本カラー */
  body {
    background-color: #1a1a1a;
    color: #e0e0e0;
  }

  /* コンテンツ背景 */
  .entry,
  #box2-inner .hatena-module {
    background-color: #2d2d2d;
  }

  /* リンク色 */
  a {
    color: #88c0ff;
  }
  a:hover {
    color: #aad4ff;
  }

  /* 見出し */
  .entry-content h1,
  .entry-content h2,
  .entry-content h3 {
    color: #ffffff;
    border-color: #555555;
  }

  /* 目次 */
  .table-of-contents,
  .floating-toc {
    background-color: #333333;
    border-color: #444444;
  }

  /* コードブロック */
  pre.code {
    background-color: #1e1e1e;
    border-color: #383838;
    color: #d4d4d4;
  }

  /* その他要素の調整 */
  input, textarea, select {
    background-color: #3a3a3a;
    color: #e0e0e0;
    border-color: #555555;
  }

  /* 区切り線 */
  hr, .pager {
    border-color: #444444;
  }
}
```

### アニメーション効果の追加

hover時などのアニメーション効果を追加して、よりインタラクティブなデザインにできます：

```css
/* リンクのホバーアニメーション */
a {
  transition: color 0.3s ease, background-color 0.3s ease;
}

/* ボタンのホバーアニメーション */
.toc-button,
button.hatena-bookmark-button {
  transition: all 0.3s ease;
}
.toc-button:hover,
button.hatena-bookmark-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0,0,0,0.15);
}

/* 目次項目のホバーアニメーション */
.floating-toc li a {
  transition: transform 0.2s ease;
}
.floating-toc li a:hover {
  transform: translateX(3px);
}

/* カテゴリータグのホバーアニメーション */
.categories a {
  transition: all 0.3s ease;
}
.categories a:hover {
  transform: scale(1.05);
}
```

### カスタムフォントアイコンの追加

Font Awesomeなどのフォントアイコンを利用して、より視覚的に豊かなデザインにできます：

```css
/* Font Awesomeの読み込み */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');

/* 見出しにアイコンを追加 */
.entry-content h2:before {
  font-family: 'Font Awesome 6 Free';
  content: '\f138'; /* アイコンのコード */
  font-weight: 900;
  margin-right: 0.5em;
  color: #3366ff; /* アイコンの色 */
}

/* リンクにアイコンを追加 */
.entry-content a[href^="http"]:after {
  font-family: 'Font Awesome 6 Free';
  content: '\f08e'; /* 外部リンクアイコン */
  font-weight: 900;
  margin-left: 0.3em;
  font-size: 0.8em;
  vertical-align: super;
}

/* 特定のセクションにアイコンを追加 */
.hatena-module-title:before {
  font-family: 'Font Awesome 6 Free';
  content: '\f0c9'; /* リストアイコン */
  font-weight: 900;
  margin-right: 0.5em;
}
```

## まとめ

CodeFocusテーマは、基本的なスタイリングからアニメーション効果の追加、ダークモードの実装まで、様々なカスタマイズが可能です。このガイドで紹介したテクニックを組み合わせて、あなただけのオリジナルブログデザインを作り上げてください。

一度に多くの変更を行うと予期せぬ問題が発生することがあるため、少しずつ変更を加えて効果を確認することをおすすめします。また、CSSの変更は適用前に別環境でテストするか、バックアップを取っておくと安心です。

より高度なカスタマイズには、[GitHub リポジトリ](https://github.com/guitarrapc/HatenaBlog-Theme)からSCSSファイルをダウンロードして、ローカル開発環境での編集をおすすめします。進化するウェブ技術を取り入れながら、読者にとって快適で魅力的なブログを目指しましょう。

---

*カスタマイズに関するご質問やアイデアの共有は、[GitHub Issues](https://github.com/guitarrapc/HatenaBlog-Theme/issues)にてお待ちしております。*
