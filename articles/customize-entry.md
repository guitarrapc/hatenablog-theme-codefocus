---
title: CodeFocusテーマのカスタマイズガイド
---

CodeFocusテーマをインストールして基本設定を行ったら、次はあなた好みにカスタマイズしてみましょう。このガイドでは、CodeFocusテーマをカスタマイズするための様々な方法を紹介します。

[:contents]

## カスタマイズとは

CodeFocusテーマは、基本的なスタイリングからアニメーション効果の追加、ダークモードの実装まで、様々な調整が可能です。このガイドで紹介したテクニックを組み合わせて、あなただけのオリジナルブログデザインを作り上げることができます。

一度に多くの変更を行うと予期せぬ問題が発生することがあるため、少しずつ変更を加えて効果を確認することをおすすめします。また、CSSの変更は適用前に別環境でテストするか、バックアップを取っておくと安心です。

## カスタマイズの基本

はてなブログの管理画面から「デザイン設定」→「カスタマイズ」→「デザインCSS」に追加のCSSを記述することで、様々な部分をカスタマイズできます。

## 色のカスタマイズ

### メイン文字色と背景色の変更

```css
/* 文字色の変更 */
body {
  color: #333333; /* 文字色 */
}

/* 背景色の変更 */
body {
  background-color: #88ccaa; /* 背景色 */
}
```

### リンク色の変更

```css
/* リンク色の変更 */
a {
  color: #33aaff; /* リンク色 */
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
  color: #550055; /* カテゴリーテキスト色 */
  border-color: #30cc33; /* カテゴリー枠線色 */
}

.categories a:hover {
  background-color: #aaf1ab30; /* ホバー時の背景色 */
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
  background-color: #aa00aa50; /* 目次ボタン背景色 */
  color: #a44444; /* 目次ボタン文字色 */
  border-color: #892222; /* 目次ボタン枠線色 */
}

.toc-button .toc-button-icon {
  &:before {
    border-top: 2px solid #d4ffcc; /* ^アイコンの色 */
    border-right: 2px solid #d4ffcc; /* ^アイコンの色 */
  }
}
```

## フォントの変更

### 本文フォントの変更

```css
body {
  font-family: Meiryo, sans-serif;
}
```

### 見出しフォントの変更

```css
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: 'Yu Gothic', 'Hiragino Kaku Gothic ProN', Meiryo, sans-serif;
}
```

### Webフォントの利用

Google Fontsなどのウェブフォントを利用する場合は、まず`詳細設定 > <head>要素にメタデータを追加`にフォントを読み込ませます。

```html
<!-- 詳細設定 > <head>要素にメタデータを追加 -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&display=swap" rel="stylesheet">
<link href="https://fonts.googleapis.com/css2?family=Kaushan+Script&display=swap" rel="stylesheet">
```

以下のようにCSSを記述します：

```css
/* 全体のフォントファミリーをNoto Sans JPに設定 */
body {
  font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans", 'Helvetica Neue', 'Helvetica', 'Meiryo', sans-serif, "Segoe UI Emoji";
}

/* 見出しのフォントファミリーをNoto Sans JPに設定 */
h1,
h2,
h3,
h4,
h5,
h6 {
  font-family: "Noto Sans JP", -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans", 'Helvetica Neue', 'Helvetica', 'Meiryo', sans-serif, "Segoe UI Emoji";
}

/* タイトルのフォントファミリーをKaushan Scriptに設定 */
#title a {
  font-family: 'Kaushan Script', cursive, -apple-system, BlinkMacSystemFont, "Hiragino Kaku Gothic ProN", "Hiragino Sans", 'Helvetica Neue', 'Helvetica', 'Meiryo', sans-serif, "Segoe UI Emoji";
}
```

フォントは任意ですが、フォントファミリーの順序を適切に設定することで、ユーザーの環境に応じて最適なフォントが選択されます。

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
pre.code {
  color: #abb2bf; /* コード全体の文字色 */
}

/* クラス名などの特定の構文要素色を変更 */
pre.code span.synIdentifier {
  color: #e06c75; /* クラス名など */
}

pre.code span.synSpecial {
  color: #61afef; /* 特殊な構文 */
}

pre.code span.synStatement,
pre.code span.synType {
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

  &.copied {
    background-color: #28a745; /* コピー成功時の色 */
  }

  &.copy-error {
    background-color: #dc3545; /* コピー失敗時の色 */
  }
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

## 記事コンテンツ部分の横幅カスタマイズ

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
  background-color: #2c9a7a0a;
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
  background-color: #2c9a7a0a;
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

## ダークモードのカスタマイズ

### ダークモード機能の無効化

ダークモード機能をブログ上で無効化する方法はいくつかあります：

1. **完全に無効化する方法**：
   ダークモード用のJavaScriptを`<head>要素にメタデータを追加`から排除します。これにより、ダークモード機能とUIボタンが完全に削除されます。

2. **JavaScriptで無効化する方法**：
   ブラウザのコンソールに以下のコードを実行すると、次回からダークモード機能が無効になり、ダークモード切り替えボタンも表示されなくなります。

   ```javascript
   localStorage.setItem('codefocus-disable-dark-mode', 'true');
   ```

   再度有効化するには：

   ```javascript
   localStorage.removeItem('codefocus-disable-dark-mode');
   ```

3. **CSSで明示的にライトモードに固定する方法**：
   CSSを追加して、常にライトモードの色を使用するように設定できます。

   ```css
   html {
     --background: #ffffff !important;
     --text-body: #333333 !important;
     /* 他の変数も必要に応じて上書き */
   }
   ```

### ダークモードのカスタマイズ

ダークモードの色をカスタマイズしたい場合は、CSSの変数を上書きすることで実現できます。なお、ダークモードは JavaScript が有効な場合にのみ適用されます。

```css
/* ダークモードの色をカスタマイズ */
html[data-enable-dark-mode="true"][data-theme="dark"] {
  --background: #1a1a2e;         /* 背景色をより深い青に */
  --text-body: #e2e2e2;          /* 本文テキストをより明るく */
  --link: #64b5f6;               /* リンク色を水色系に */
  --link-hover: #90caf9;         /* ホバー時はより明るく */
  --border: #414165;             /* ボーダー色を青系に合わせる */
}

/* システム設定に合わせる場合 */
@media (prefers-color-scheme: dark) {
  html[data-enable-dark-mode="true"]:not([data-theme="light"]):not([data-theme="dark"]) {
    /* 上記と同じ変数を設定 */
    --background: #1a1a2e;
    --text-body: #e2e2e2;
    --link: #64b5f6;
    --link-hover: #90caf9;
    --border: #414165;
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
