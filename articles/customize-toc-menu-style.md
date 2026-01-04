---
title: 目次をカスタマイズする方法
---

## 概要

CodeFocusテーマの目次は、テーマ本体は変更せずはてなブログの「デザインCSS」に追加するだけでカスタマイズ可能です。

## カスタマイズ方法

はてなブログの管理画面から、以下の手順で設定してください。

1. 「デザイン」→「カスタマイズ」→「デザインCSS」を開く
2. 下記のCSSコードをコピーして貼り付ける
3. 「変更を保存する」をクリック

---

## レストランメニュー

レストランメニューのような、二重線フレームとゴールドアクセントの目次デザインです。

![レストランメニュー目次の表示例](image.png)<!--customize-toc-menu-style-image.png-->

以下のCSSコードを「デザインCSS」に貼り付けてください。

```css
/* ========================================
   目次カスタマイズ - レストランメニュー
   ======================================== */

/* 基本フレーム - 記事内だけ適用してフローティング目次にフレームはつけない */
ul.table-of-contents {
    background: linear-gradient(to bottom, #fdfcfb 0%, #f7f5f0 100%);
    border: 3px double #c9a875;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    padding: 0.5em 1.0em;
    margin: 0.5em auto;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    display: none;
}

ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none;
}

/* ダークモード対応 */
html[data-theme="dark"] ul.table-of-contents,
html[data-theme="dark"] ul.floating-toc-list {
    background: linear-gradient(to bottom, #1a1612 0%, #231f1a 100%);
    border-color: #6b5a3d;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents,
    html:not([data-theme="light"]) ul.floating-toc-list {
        background: linear-gradient(to bottom, #1a1612 0%, #231f1a 100%);
        border-color: #6b5a3d;
    }
}

/* 従来の目次タイトルをスタイリング */
/* 記事内の目次タイトル */
.toc-title {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2em;
    font-weight: bold;
    padding: 0.8em 1em;
    padding-bottom: 0.8em;
    border-bottom: 1px solid #c9a875;
    color: #8b6f47;
    background-color: transparent;
    width: 100%;
    margin-bottom: 1.2em;
    cursor: pointer;
}

.toc-title::before {
    content: '◆ ';
    margin-right: 0.3em;
}

.toc-title::after {
    content: ' ◆';
    margin-left: 0.3em;
}

/* 開閉アイコンのスタイル */
.toc-title .toc-toggle-icon {
    margin-left: 0.5em;
    width: 12px;
    height: 12px;
    position: relative;
    display: inline-block;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "";
    position: absolute;
    background-color: #8b6f47;
    transition: all 0.3s ease;
}

.toc-title .toc-toggle-icon::before {
    width: 100%;
    height: 2px;
    top: 5px;
    left: 0;
}

.toc-title .toc-toggle-icon::after {
    width: 2px;
    height: 100%;
    top: 0;
    left: 5px;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #a0826d;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #a0826d;
    }
}

html[data-theme="dark"] .toc-title {
    border-bottom-color: #6b5a3d;
    color: #a0826d;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        border-bottom-color: #6b5a3d;
        color: #a0826d;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: bold;
    color: #8b6f47;
}

html[data-theme="dark"] .toc-button-text {
    color: #a0826d;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #a0826d;
    }
}

/* h1項目 - ローマ数字風装飾 */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    counter-increment: toc-section;
    padding-left: 2em;
}

ul.table-of-contents > li::before,
ul.floating-toc-list > li::before {
    content: '§';
    position: absolute;
    left: 0.3em;
    top: -0.2em;
    width: auto;
    height: auto;
    background-color: transparent;
    border: none;
    border-radius: 0;
    font-size: 1.1em;
    line-height: 1.4;
    color: #c9a875;
}

html[data-theme="dark"] ul.table-of-contents > li::before,
html[data-theme="dark"] ul.floating-toc-list > li::before {
    color: #6b5a3d;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li::before,
    html:not([data-theme="light"]) ul.floating-toc-list > li::before {
        color: #6b5a3d;
    }
}

/* h1リンク */
ul.table-of-contents > li > a,
ul.floating-toc-list > li > a {
    font-weight: 700;
    color: #333;
    font-size: 1.05rem;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #e6edf3;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #e6edf3;
    }
}

/* h2項目 - マーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #666;
    font-size: 0.95rem;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e;
    }
}

/* ホバー効果 */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: rgba(201, 168, 117, 0.15);
    transform: translateX(5px);
}
```

---

## モダンカード

各セクションをカード化し、クリーンな目次デザインです。次のような見た目になります。

![モダンカード目次の表示例](image-1.png)<!--customize-toc-menu-style-image-1.png-->

以下のCSSコードを「デザインCSS」に貼り付けてください。

```css
/* ========================================
   目次カスタマイズ - モダン・カード
   ======================================== */

/* 基本フレーム - 記事内とフローティング目次の両方に適用 */
ul.table-of-contents,
ul.floating-toc-list {
    background: #ffffff;
    border: 1px solid #e1e4e8;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    padding: 0.5em 0.8em;
    margin: 0.5em auto;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    display: none;
}

ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none;
}

/* ダークモード対応 */
html[data-theme="dark"] ul.table-of-contents,
html[data-theme="dark"] ul.floating-toc-list {
    background: #161b22;
    border-color: #30363d;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents,
    html:not([data-theme="light"]) ul.floating-toc-list {
        background: #161b22;
        border-color: #30363d;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
}

/* 従来の目次タイトルをスタイリング */
/* 記事内の目次タイトル */
.toc-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.3em;
    font-weight: 700;
    padding: 0.8em 1em;
    padding-bottom: 0.6em;
    border-bottom: 2px solid #0366d6;
    color: #24292e;
    background-color: transparent;
    width: 100%;
    margin-bottom: 1em;
    cursor: pointer;
}

html[data-theme="dark"] .toc-title {
    border-bottom-color: #58a6ff;
    color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        border-bottom-color: #58a6ff;
        color: #c9d1d9;
    }
}

/* 開閉アイコンのスタイル */
.toc-title .toc-toggle-icon {
    width: 12px;
    height: 12px;
    position: relative;
    display: inline-block;
    flex-shrink: 0;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "";
    position: absolute;
    background-color: #24292e;
    transition: all 0.3s ease;
}

.toc-title .toc-toggle-icon::before {
    width: 100%;
    height: 2px;
    top: 5px;
    left: 0;
}

.toc-title .toc-toggle-icon::after {
    width: 2px;
    height: 100%;
    top: 0;
    left: 5px;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #c9d1d9;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: 700;
    color: #24292e;
}

html[data-theme="dark"] .toc-button-text {
    color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #c9d1d9;
    }
}

/* h1項目 - カードスタイル */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 0.8em 1em;
    margin: 0.6em 0;
    transition: all 0.2s ease;
}

html[data-theme="dark"] ul.table-of-contents > li,
html[data-theme="dark"] ul.floating-toc-list > li {
    background: #1c2128;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li,
    html:not([data-theme="light"]) ul.floating-toc-list > li {
        background: #1c2128;
    }
}

ul.table-of-contents > li:hover,
ul.floating-toc-list > li:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
}

/* h1項目のマーカーを非表示 */
ul.table-of-contents > li::before,
ul.floating-toc-list > li::before {
    display: none;
}

/* h1リンク */
ul.table-of-contents > li > a,
ul.floating-toc-list > li > a {
    font-weight: 600;
    color: #0366d6;
    font-size: 1.05rem;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #58a6ff;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #58a6ff;
    }
}

/* h2項目 */
ul.table-of-contents > li > ul,
ul.floating-toc-list > li > ul {
    background: transparent;
    padding-top: 0.5em;
}

/* h2項目のマーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none;
}

/* h2項目にインデントを追加 */
ul.table-of-contents > li > ul li,
ul.floating-toc-list > li > ul li {
    padding-left: 1em;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #586069;
    font-size: 0.95rem;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e;
    }
}

/* ホバー効果 */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: transparent;
    color: #0366d6;
    text-decoration: underline;
    transform: none;
}

html[data-theme="dark"] ul.table-of-contents > li > a:hover,
html[data-theme="dark"] ul.table-of-contents > li > ul li a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a:hover {
    color: #58a6ff;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a:hover,
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a:hover {
        color: #58a6ff;
    }
}
```

---

## ミニマル

シンプルで読みやすい、装飾を最小限に抑えた目次デザインです。次のような見た目になります。

![ミニマルの適用例](image-2.png)<!--customize-toc-menu-style-image-2.png-->

以下のCSSコードを「デザインCSS」に貼り付けてください。

```css
/* ========================================
   目次カスタマイズ - ミニマル
   ======================================== */

/* 基本フレーム - 記事内とフローティング目次の両方に適用 */
ul.table-of-contents,
ul.floating-toc-list {
    background: transparent;
    border: none;
    border-radius: 0;
    box-shadow: none;
    padding: 0.5em 0.8em;
    margin: 0.5em 0;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    display: none;
}

ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none;
}

/* 記事内の目次タイトル */
.toc-title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 1.1em;
    font-weight: 400;
    padding: 0.8em 1em;
    padding-bottom: 0.5em;
    color: #24292e;
    background-color: transparent;
    border: none;
    margin-bottom: 0.8em;
    cursor: pointer;
}

html[data-theme="dark"] .toc-title {
    color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        color: #c9d1d9;
    }
}

/* 開閉アイコンのスタイル */
.toc-title .toc-toggle-icon {
    width: 12px;
    height: 12px;
    position: relative;
    display: inline-block;
    flex-shrink: 0;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "";
    position: absolute;
    background-color: #24292e;
    transition: all 0.3s ease;
}

.toc-title .toc-toggle-icon::before {
    width: 100%;
    height: 2px;
    top: 5px;
    left: 0;
}

.toc-title .toc-toggle-icon::after {
    width: 2px;
    height: 100%;
    top: 0;
    left: 5px;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #c9d1d9;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: 400;
    color: #24292e;
}

html[data-theme="dark"] .toc-button-text {
    color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #c9d1d9;
    }
}

/* h1項目 */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    margin: 0.5em 0;
    padding-left: 0;
    list-style: none;
}

/* h1項目のマーカーを非表示 */
ul.table-of-contents > li::before,
ul.floating-toc-list > li::before {
    display: none;
}

/* h1リンク */
ul.table-of-contents > li > a,
ul.floating-toc-list > li > a {
    font-weight: 400;
    color: #24292e;
    font-size: 1rem;
    text-align: left;
    display: block;
    padding: 0;
    margin: 0;
    background-color: transparent;
    border-radius: 0;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #c9d1d9;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #c9d1d9;
    }
}

/* h2項目 */
ul.table-of-contents > li > ul,
ul.floating-toc-list > li > ul {
    margin: 0.3em 0 0 1em;
    padding: 0;
}

ul.table-of-contents > li > ul li,
ul.floating-toc-list > li > ul li {
    margin: 0.3em 0;
    padding-left: 0;
    list-style: none;
}

/* h2項目のマーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #57606a;
    font-size: 0.95rem;
    font-weight: 300;
    text-align: left;
    display: block;
    padding: 0;
    margin: 0;
    background-color: transparent;
    border-radius: 0;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e;
    }
}

/* ホバー効果 - 控えめに */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: transparent;
    color: #0969da;
    text-decoration: none;
    transform: none;
    border-radius: 0;
}

html[data-theme="dark"] ul.table-of-contents > li > a:hover,
html[data-theme="dark"] ul.table-of-contents > li > ul li a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a:hover {
    color: #58a6ff;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a:hover,
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a:hover {
        color: #58a6ff;
    }
}
```

---

## 注意事項

### 適用範囲

これらのCSSは以下に適用されます：
- ✅ 記事本文中の目次（`ul.table-of-contents`）
- ✅ フローティング目次ボタン内の目次（`ul.floating-toc-list`）

**すべてのスタイル**（レストランメニュー、モダン・カード、ミニマル）が記事内目次とフローティング目次の両方に自動的に適用されます。

### ダークモード対応

すべてのスタイルにダークモード対応を含めています：
- 自動切り替え：`@media (prefers-color-scheme: dark)`
- 手動切り替え：`html[data-theme="dark"]`

### カスタマイズのヒント

1. **色の変更**：`border-color`や`color`の値を変更することで、好みの色に調整できます
2. **間隔の調整**：`padding`や`margin`の値を変更して、余白を調整できます
3. **複数スタイルの組み合わせ**：異なるスタイルの要素を組み合わせることも可能

---

## トラブルシューティング

### スタイルが適用されない場合

1. **ブラウザキャッシュのクリア**：ブラウザのキャッシュをクリアしてから確認してください
2. **プレビューで確認**：はてなブログのプレビュー機能で確認してください
3. **複数スタイルの競合**：一度に1つのスタイルのみを適用してください

### ダークモードで色がおかしい

ダークモード用の色指定が不足している可能性があります。上記のサンプルコードには両方の対応が含まれています。

---

## まとめ

はてなブログの「デザインCSS」に上記のコードを貼り付けるだけで、目次を好みのスタイルにカスタマイズできます。

お好みのスタイルを選んで、ぜひ試してみてください！
