---
title: CodeFocusテーマのカスタマイズガイド
---

[CodeFocusテーマ](https://blog.hatena.ne.jp/-/store/theme/6802418398435013379)をインストールして基本設定を行ったら、次はあなた好みにカスタマイズしてみましょう。このガイドでは、CodeFocusテーマをカスタマイズするための様々な方法を紹介します。

[:contents]

## カスタマイズとは

CodeFocusテーマは、基本的なスタイリングからアニメーション効果の追加、ダークモードの実装まで、様々な調整が可能です。このガイドで紹介したテクニックを組み合わせて、あなただけのオリジナルブログデザインを作り上げることができます。

一度に多くの変更を行うと予期せぬ問題が発生することがあるため、少しずつ変更を加えて効果を確認することをおすすめします。また、CSSの変更は適用前に別環境でテストするか、バックアップを取っておくと安心です。

## カスタマイズの基本

はてなブログの管理画面から「デザイン設定」→「カスタマイズ」→「デザインCSS」に追加のCSSを記述することで、様々な部分をカスタマイズできます。

## 色のカスタマイズ

CodeFocusテーマは、CSS変数（カスタムプロパティ）を使用して色を管理しています。これにより、簡単にテーマ全体の色を統一的に変更できます。

テーマ側で色を設定しているため、残念ながらはてなブログの「デザイン設定」→「カスタマイズ」→「背景色」からの色変更は反映されません。色をカスタマイズするには、以下の方法でCSS変数を上書きしてください。

### CSS変数の上書き方法

色をカスタマイズする最も効率的な方法は、`:root`セレクタでCSS変数を上書きすることです。以下に主要なCSS変数の一覧を示します：

```css
:root {
  /* 背景色 */
  --background: #ffffff;           /* メインの背景色 */
  --bg-light: #f8f9fa;            /* 薄い背景色 */
  --bg-code: #f6f8fa;             /* コードブロックの背景色 */
  --bg-span: #f3f4f6;             /* インラインコードの背景色 */
  --bg-toc-hover: #e3f2fd10;      /* 目次項目ホバー時の背景色 */
  --bg-btn-hover: #e3f2fd30;      /* ボタンホバー時の背景色 */

  /* テキスト色 */
  --text-body: #24292f;           /* 本文テキスト色 */
  --text-low-priority: #57606a;   /* 低優先度テキスト（日付など） */
  --text-light: #6e7781;          /* ライトテキスト色 */
  --text-header: #1f2328;         /* 見出しテキスト色 */

  /* リンク色 */
  --link: #0969da;                /* リンク色 */
  --link-hover: #0550ae;          /* リンクホバー時の色 */
  --link-visited: #8250df;        /* 訪問済みリンク色 */

  /* ボーダー色 */
  --border: #d0d7de;              /* 標準ボーダー色 */
  --border-light: #e5e5e5;        /* 薄いボーダー色 */

  /* 目次関連 */
  --toc-border-bg: #e3f2fd50;     /* 目次のボーダー背景色 */
  --toc-marker: #1976d2;          /* 目次マーカー色 */

  /* テーブル */
  --table-th-bg: #f6f8fa;         /* テーブルヘッダー背景色 */
  --table-border: #d0d7de;        /* テーブルボーダー色 */
}
```

### テーマカラーの一括変更

全体的なテーマカラーを変更するには、複数のCSS変数を一括で変更します。以下の例では、ブルーベースからグリーンベースに変更するCSSを示します：

```css
:root {
  /* リンク色をグリーン系に変更 */
  --link: #2c9a7a;
  --link-hover: #1d6b54;

  /* ボーダー色をグリーン系に変更 */
  --border: #2c9a7a;
  --border-light: #d0e9e1;

  /* ボタンホバー時の背景色 */
  --bg-btn-hover: #2c9a7a0a;

  /* 目次関連の色をグリーン系に変更 */
  --toc-border-bg: #f5faf8;
  --toc-marker: #2c9a7a;
}
```

### 背景色の変更例

背景色を変更するには、以下のようにCSS変数を上書きします：

```css
:root {
  --background: #aacc99;  /* 背景色を薄緑に変更 */
}
```

**注意**: CodeFocusテーマは、はてなブログの「デザイン設定」→「カスタマイズ」→「背景画像」で設定した背景画像にも対応しています。目次などの要素は半透明または透明の背景になっており、背景画像が透けて見えるようになっています。

### リンク色の変更例

リンク色を変更するには、以下のようにCSS変数を上書きします：

```css
:root {
  --link: #33aaff;        /* リンク色 */
  --link-hover: #0044cc;  /* ホバー時のリンク色 */
  --link-visited: #8833ff; /* 訪問済みリンク色 */
}
```

### カテゴリー色の変更例

カテゴリーの枠線色やホバー時の背景色を変更するには、以下のようにCSS変数を上書きします：

```css
:root {
  --border: #30cc33;           /* カテゴリー枠線色 */
  --bg-btn-hover: #aaf1ab30;   /* ホバー時の背景色 */
}
```

カテゴリーテキストの色を個別に変更したい場合は、直接スタイルを指定することもできます：

```css
.entry-categories a {
  color: #550055; /* カテゴリーテキスト色 */
}
```

### 目次関連の色変更例

目次の色をカスタマイズするには、以下のようにCSS変数を上書きします：

```css
:root {
  --toc-border-bg: #f8f9fa;    /* 目次背景色 */
  --toc-marker: #d4ffcc;       /* 目次マーカー色 */
  --bg-toc-hover: #e9ecef20;   /* 目次項目ホバー時の背景色 */
}
```

目次ボタンの色を個別に変更したい場合は、直接スタイルを指定することもできます：

```css
.toc-button {
  background-color: #aa00aa50; /* 目次ボタン背景色 */
  color: #a44444;             /* 目次ボタン文字色 */
  border-color: #892222;      /* 目次ボタン枠線色 */
}
```


## フォントの変更

CodeFocusテーマでは、読みやすさを重視したフォント設定がデフォルトで適用されています：

- **本文・見出し**: システムフォント（Apple系デバイスではSan Francisco、WindowsではSegoe UI、日本語はヒラギノ角ゴ/Noto Sans JP/メイリオ）
- **コードブロック**: Monaco、Consolas、Courier Newなどの等幅フォント

フォントをカスタマイズすることで、ブログの印象を大きく変えることができます。

### 本文フォントの変更

本文のフォントを変更するには、`body`要素に対してフォントファミリーを指定します：

```css
body {
  font-family: "Yu Gothic", "Hiragino Kaku Gothic ProN", "Noto Sans JP", Meiryo, sans-serif;
}
```

### 見出しフォントの変更

見出しのフォントを個別に変更できます：

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic ProN', "Noto Sans JP", Meiryo, sans-serif;
}
```

### Webフォントの利用

Google Fontsなどのウェブフォントを利用する場合は、まず「デザイン」→「カスタマイズ」→「ヘッダ」→「ブログタイトル下」にフォントを読み込みます：

```html
<!-- Googleフォントを読み込む -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap" rel="stylesheet">
```

次に、CSSでフォントファミリーを指定します：

```css
/* 本文と見出しにNoto Sans JPを適用 */
body,
h1, h2, h3, h4, h5, h6 {
  font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans", sans-serif;
}

/* ブログタイトルにKaushan Scriptを適用 */
#title a {
  font-family: 'Kaushan Script', cursive, -apple-system, BlinkMacSystemFont, sans-serif;
}
```


## コードブロックのカスタマイズ

CodeFocusテーマでは、コードブロックの表示をCSS変数で管理しています。これにより、背景色、文字色、シンタックスハイライトの色を簡単にカスタマイズできます。

### コードブロックの色をCSS変数で変更

コードブロック関連の主要なCSS変数は以下の通りです：

```css
:root {
  /* コードブロックの背景色と関連色 */
  --bg-code: #f6f8fa;              /* コードブロックの背景色 */
  --bg-code-light: #f8f9fa;        /* コードブロックのライト背景色 */
  --bg-span: #f3f4f6;              /* インラインコードの背景色 */

  /* シンタックスハイライトの色 */
  --codeblock-language-colors-text: #fff;          /* コード全体のテキスト色 */
  --codeblock-language-colors-keyword: #ff8fa3;    /* キーワード色 */
  --codeblock-language-colors-function: #38c7ff;   /* 関数色 */
  --codeblock-language-colors-punctuation: #939bc1; /* 句読点色 */
  --codeblock-language-colors-number: #ffc56d;     /* 数値色 */
  --codeblock-language-colors-comment: #94a1b3;    /* コメント色 */
}
```

### コードブロックの背景色と文字色の変更例

コードブロックの背景色とテキスト色を変更するには、CSS変数を上書きします：

```css
:root {
  --bg-code: #282c34;                      /* 背景色をより暗く */
  --codeblock-language-colors-text: #abb2bf; /* 文字色を明るく */
}
```

### シンタックスハイライトの色の変更例

各シンタックス要素の色をカスタマイズできます：

```css
:root {
  --codeblock-language-colors-keyword: #c678dd;    /* キーワード色 */
  --codeblock-language-colors-function: #61afef;   /* 関数色 */
  --codeblock-language-colors-number: #98c379;     /* 数値・文字列色 */
  --codeblock-language-colors-comment: #7f848e;    /* コメント色 */
}
```

### コードブロックのその他のスタイル変更

枠線や角の丸みなど、CSS変数で管理されていない要素は直接指定できます：

```css
/* コードブロックの枠線スタイル */
pre.code {
  border: 1px solid #3e4451; /* 枠線色を調整 */
  border-radius: 6px; /* 角の丸みを増やす */
}
```

## 目次のカスタマイズ

目次のスタイルはデザインCSSでカスタマイズできます。目次全体のレイアウトやデザインを大きく変更したい場合は、[目次カスタマイズの記事](https://codefocus.hatenablog.jp/entry/2026/01/05/003554)を参考にしてください。

ごく一部を変更したい場合は、以下の例を参考にしてください。

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

目次のマーカー色はCSS変数で管理されています。色を変更するには変数を上書きします：

```css
:root {
  --toc-marker: #5c9ee7;       /* マーカーの色を変更 */
  --toc-border-bg: #d1e1f9;    /* 縦線の色を変更 */
}
```

マーカーのサイズなど、CSS変数で管理されていない要素は直接指定できます：

```css
/* マーカーのサイズを変更 */
.floating-toc li:before,
.table-of-contents li:before {
  width: 10px;
  height: 10px;
}

/* アクティブな項目のマーカーを強調 */
.floating-toc li.active:before {
  transform: scale(1.2);
}
```


## カテゴリーのカスタマイズ

### 記事内カテゴリーのスタイル変更

記事内のカテゴリーは丸みを帯びたタグスタイルで表示されます。

[f:id:guitarrapc_tech:20260212181926p:plain:alt=記事タイトル下のカテゴリー表示のスクリーンショット] <!-- screenshots/pc-category-container.png -->



```css
.categories a {
  border-radius: 16px; /* 丸みの調整 */
  padding: 3px 10px; /* 内側の余白 */
  font-size: 0.85em; /* 文字サイズを少し小さく */
}
```

通常表示:
[f:id:guitarrapc_tech:20260212181947p:plain:alt=カテゴリー表示のスクリーンショット] <!-- screenshots/pc-category-item.png -->



ホバー時:
[f:id:guitarrapc_tech:20260212181958p:plain:alt=カテゴリーホバーのスクリーンショット] <!-- screenshots/pc-category-item-hover.png -->



### サイドバーのタグクラウドカスタマイズ

サイドバーのカテゴリーモジュールは、タグクラウドスタイルで表示され、記事数に応じてフォントサイズが自動的に調整されます。このタグクラウドのサイズや見た目をカスタマイズできます。

```css
/* タグクラウド全体のレイアウト調整 */
.category-cloud {
  gap: 0.7rem; /* カテゴリー間の間隔を広げる */
}

/* 各カテゴリーアイテムのスタイル調整 */
.category-cloud-item a {
  padding: 0.2rem 0.5rem; /* 内側の余白を変更 */
  border-radius: 15px; /* 角の丸みを調整 */
  border: 1px solid #aaddff; /* 枠線の色を変更 */
}

/* フォントサイズの段階をカスタマイズ */
.category-cloud-item .category-size-1 { font-size: 80% !important; } /* 最小サイズ */
.category-cloud-item .category-size-5 { font-size: 125% !important; } /* 中間サイズ */
.category-cloud-item .category-size-10 { font-size: 200% !important; } /* 最大サイズ */

/* ホバー時の背景色変更 */
.category-cloud-item a:hover {
  background-color: #f0f8ff; /* ホバー時の背景色 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* ホバー時の影を追加 */
}
```

タグクラウドは10段階のサイズクラス（category-size-1 から category-size-10）で構成されています。それぞれのサイズクラスに対して個別にフォントサイズを指定することで、よりカスタマイズされた視覚的階層を作れます。

```css
/* すべてのサイズクラスをカスタマイズする例 */
.category-cloud-item .category-size-1 { font-size: 80% !important; }
.category-cloud-item .category-size-2 { font-size: 90% !important; }
.category-cloud-item .category-size-3 { font-size: 100% !important; }
.category-cloud-item .category-size-4 { font-size: 110% !important; }
.category-cloud-item .category-size-5 { font-size: 120% !important; }
.category-cloud-item .category-size-6 { font-size: 135% !important; }
.category-cloud-item .category-size-7 { font-size: 150% !important; }
.category-cloud-item .category-size-8 { font-size: 165% !important; }
.category-cloud-item .category-size-9 { font-size: 180% !important; }
.category-cloud-item .category-size-10 { font-size: 200% !important; }
```

より高度なカスタマイズでは、記事数の多いカテゴリを強調するために色や太さも変更できます：

```css
/* 記事数の多いカテゴリを強調 */
.category-cloud-item .category-size-8,
.category-cloud-item .category-size-9,
.category-cloud-item .category-size-10 {
  font-weight: bold; /* 太字にする */
  color: #0066cc; /* 色を変更 */
}
```

## コメントセクションのカスタマイズ

CodeFocusテーマでは、コメントセクションもZennのDiscussionスタイルに似たデザインになっています。コメント関連の色もCSS変数で管理されているため、簡単にカスタマイズできます。

| PC表示 | タブレット表示 | スマートフォン表示 |
| --- | --- | --- |
| [f:id:guitarrapc_tech:20260212181416p:plain:alt=PC表示のコメントセクションのスクリーンショット] | [f:id:guitarrapc_tech:20260212181437p:plain:alt=タブレット表示のコメントセクションのスクリーンショット] | [f:id:guitarrapc_tech:20260212181453p:plain:alt=スマートフォン表示のコメントセクションのスクリーンショット] |

<!-- | screenshots/pc-comment-section.png | screenshots/tablet-comment-section.png | screenshots/smartphone-comment-section.png | -->



### コメント関連のCSS変数

コメントセクションでは、以下のCSS変数が使用されています：

```css
:root {
  --text-body: #24292f;           /* コメント本文、ユーザー名の色 */
  --text-light: #6e7781;          /* コメント日時の色 */
  --text-low-priority: #57606a;   /* コメントボタンの色 */
  --border: #d0d7de;              /* ボーダー色 */
  --bg-btn-hover: #e3f2fd30;      /* コメントボタンホバー時の背景色 */
}
```

### コメントセクションの色をCSS変数で変更

コメントセクションの色を変更するには、CSS変数を上書きします：

```css
:root {
  --text-body: #1a1a1a;           /* コメント本文を濃いグレーに */
  --text-light: #888888;          /* コメント日時を薄いグレーに */
  --border: #e0e0e0;              /* ボーダーを明るいグレーに */
}
```

### コメントセクションのレイアウトカスタマイズ

背景色や角の丸み、余白など、CSS変数で管理されていない要素は直接指定できます：

```css
/* コメントセクションの全体スタイル */
.comment-box {
  background-color: #fafafa; /* 背景色を変更 */
  border-radius: 12px; /* 角の丸みを増やす */
  padding: 20px; /* 内側の余白を増やす */
}

/* コメント間の区切り線 */
.comment-box .entry-comment {
  border-bottom: 1px dashed var(--border); /* 点線にする */
  padding-bottom: 1.5em; /* 下の余白を増やす */
}

/* コメント本文の行間 */
.comment-content {
  line-height: 1.7; /* 行間を広げる */
}
```

## レイアウトのカスタマイズ

### 記事コンテンツ部分の横幅カスタマイズ

```css
@media (min-width: 992px) {
    #container, #footer {
        max-width: 750px; /* 横幅を750pxに設定 */
    }
}

@media (min-width: 768px) {
    #container, #footer {
        max-width: 700px; /* 横幅を700pxに設定 */
        padding-left: 10px; /* 左側の余白を追加 */
        padding-right: 10px; /* 右側の余白を追加 */
    }
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

### 1行あたりの高さ

```css
body {
  line-height: 1.6; /* 行間を狭める */
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

## ダークモードのカスタマイズ

ダークモードの色をカスタマイズしたい場合は、CSS変数を上書きすることで実現できます。なお、ダークモードは JavaScript が有効な場合にのみ適用されます。

ダークモード時には、以下のHTML属性が設定されます：
- 明示的にダークモードを選択した場合: `html[data-theme="dark"]`
- システム設定に従う場合（ダークモード時）: メディアクエリ `@media (prefers-color-scheme: dark)` が適用

### 明示的なダークモード選択時のカスタマイズ

```css
/* ダークモードの色をカスタマイズ */
html[data-theme="dark"] {
  --background: #1a1a2e;         /* 背景色をより深い青に */
  --text-body: #e2e2e2;          /* 本文テキストをより明るく */
  --link: #64b5f6;               /* リンク色を水色系に */
  --link-hover: #90caf9;         /* ホバー時はより明るく */
  --border: #414165;             /* ボーダー色を青系に合わせる */
  --border-light: #2d2d50;       /* 薄いボーダー色 */
  --bg-code: #252540;            /* コードブロック背景色 */
  --toc-marker: #64b5f6;         /* 目次マーカー色 */
}
```

### システム設定に従う場合のカスタマイズ

システムのダークモード設定に従う場合（自動切り替えモード時）は、以下のように設定します：

```css
/* システム設定に合わせる場合 */
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) {
    --background: #1a1a2e;
    --text-body: #e2e2e2;
    --link: #64b5f6;
    --link-hover: #90caf9;
    --border: #414165;
    --border-light: #2d2d50;
    --bg-code: #252540;
    --toc-marker: #64b5f6;
  }
}
```

### 両方に対応したカスタマイズ

明示的な選択とシステム設定の両方に対応する場合は、以下のように記述します：

```css
/* 明示的にダークモードを選択した場合 */
html[data-theme="dark"] {
  --background: #1a1a2e;
  --text-body: #e2e2e2;
  --link: #64b5f6;
  /* その他の変数... */
}

/* システム設定に従う場合（ライトモード固定でない場合） */
@media (prefers-color-scheme: dark) {
  html:not([data-theme="light"]) {
    --background: #1a1a2e;
    --text-body: #e2e2e2;
    --link: #64b5f6;
    /* 上記と同じ変数を設定 */
  }
}
```

### ダークモードボタンの位置調整

ダークモードの切り替えボタンの位置を調整したい場合は、以下のようなCSSを追加できます：

```css
/* ダークモード切り替えボタンの位置調整 */
.theme-switch-container {
  top: 5rem;         /* 上からの位置を調整 */
  right: 2rem;       /* 右からの位置を調整 */
}

/* モバイル向けの調整 */
@media (max-width: 767px) {
  .theme-switch-container {
    top: 4rem;
    right: 1rem;
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

---

*カスタマイズに関するご質問やアイデアの共有は、[GitHub Issues](https://github.com/guitarrapc/HatenaBlog-Theme/issues)にてお待ちしております。*
