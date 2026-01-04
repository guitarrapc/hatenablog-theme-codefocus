---
title: 目次をカスタマイズする方法
---

## 概要

CodeFocusテーマの目次を、任意のデザインにカスタマイズできます。
テーマ本体は変更せず、はてなブログの「デザインCSS」に追加するだけで実装できます。

## カスタマイズ方法

はてなブログの管理画面から、以下の手順で設定してください。

1. 「デザイン」→「カスタマイズ」→「デザインCSS」を開く
2. 下記のCSSコードをコピーして貼り付ける
3. 「変更を保存する」をクリック

---

## レストランメニュー

レストランメニューのような、二重線フレームとゴールドアクセントのデザイン。

```css
/* ========================================
   目次カスタマイズ - レストランメニュー
   ======================================== */

/* 基本フレーム - 記事内だけ適用 */
ul.table-of-contents {
    background: linear-gradient(to bottom, #fdfcfb 0%, #f7f5f0 100%);
    border: 3px double #c9a875;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
    padding: 0.5em 1.0em !important;
    margin: 0.5em auto !important;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none !important;
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

/* ::beforeのリセット（タイトル表示はしない） */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    content: '' !important;
    display: none !important;
    /* 元の縦線スタイルを完全にリセット */
    position: static !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
    top: auto !important;
    bottom: auto !important;
    background-color: transparent !important;
    border: none !important;
}

/* 従来の目次タイトルをスタイリング */
/* 記事内の目次タイトル */
.toc-title {
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;
    font-size: 1.2em !important;
    font-weight: bold !important;
    padding: 0.8em 1em !important;
    padding-bottom: 0.8em !important;
    border-bottom: 1px solid #c9a875 !important;
    color: #8b6f47 !important;
    background-color: transparent !important;
    width: 100% !important;
    margin-bottom: 1.2em !important;
    cursor: pointer !important;
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
    margin-left: 0.5em !important;
    width: 12px !important;
    height: 12px !important;
    position: relative !important;
    display: inline-block !important;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "" !important;
    position: absolute !important;
    background-color: #8b6f47 !important;
    transition: all 0.3s ease !important;
}

.toc-title .toc-toggle-icon::before {
    width: 100% !important;
    height: 2px !important;
    top: 5px !important;
    left: 0 !important;
}

.toc-title .toc-toggle-icon::after {
    width: 2px !important;
    height: 100% !important;
    top: 0 !important;
    left: 5px !important;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #a0826d !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #a0826d !important;
    }
}

html[data-theme="dark"] .toc-title {
    border-bottom-color: #6b5a3d !important;
    color: #a0826d !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        border-bottom-color: #6b5a3d !important;
        color: #a0826d !important;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: bold !important;
    color: #8b6f47 !important;
}

html[data-theme="dark"] .toc-button-text {
    color: #a0826d !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #a0826d !important;
    }
}

/* h1項目 - ローマ数字風装飾 */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    counter-increment: toc-section;
    padding-left: 2em !important;
}

ul.table-of-contents > li::before,
ul.floating-toc-list > li::before {
    content: '§';
    position: absolute;
    left: 0.3em !important;
    top: -0.2em !important;
    width: auto !important;
    height: auto !important;
    background-color: transparent !important;
    border: none !important;
    border-radius: 0 !important;
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
    color: #333 !important;
    font-size: 1.05rem !important;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #e6edf3 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #e6edf3 !important;
    }
}

/* h2項目 - マーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none !important;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #666 !important;
    font-size: 0.95rem !important;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e !important;
    }
}

/* ホバー効果 */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: rgba(201, 168, 117, 0.15) !important;
    transform: translateX(5px) !important;
}
```

---

## モダン・カード

各セクションをカード化し、クリーンで現代的なデザイン。

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
    padding: 0.5em 0.8em !important;
    margin: 0.5em auto !important;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none !important;
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

/* ::beforeのリセット（タイトル表示はしない） */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    content: '' !important;
    display: none !important;
    /* 元の縦線スタイルを完全にリセット */
    position: static !important;
    left: auto !important;
    width: auto !important;
    height: auto !important;
    top: auto !important;
    bottom: auto !important;
    background-color: transparent !important;
    border: none !important;
}

/* 従来の目次タイトルをスタイリング */
/* 記事内の目次タイトル */
.toc-title {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    font-size: 1.3em !important;
    font-weight: 700 !important;
    padding: 0.8em 1em !important;
    padding-bottom: 0.6em !important;
    border-bottom: 2px solid #0366d6 !important;
    color: #24292e !important;
    background-color: transparent !important;
    width: 100% !important;
    margin-bottom: 1em !important;
    cursor: pointer !important;
}

html[data-theme="dark"] .toc-title {
    border-bottom-color: #58a6ff !important;
    color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        border-bottom-color: #58a6ff !important;
        color: #c9d1d9 !important;
    }
}

/* 開閉アイコンのスタイル */
.toc-title .toc-toggle-icon {
    width: 12px !important;
    height: 12px !important;
    position: relative !important;
    display: inline-block !important;
    flex-shrink: 0 !important;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "" !important;
    position: absolute !important;
    background-color: #24292e !important;
    transition: all 0.3s ease !important;
}

.toc-title .toc-toggle-icon::before {
    width: 100% !important;
    height: 2px !important;
    top: 5px !important;
    left: 0 !important;
}

.toc-title .toc-toggle-icon::after {
    width: 2px !important;
    height: 100% !important;
    top: 0 !important;
    left: 5px !important;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #c9d1d9 !important;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: 700 !important;
    color: #24292e !important;
}

html[data-theme="dark"] .toc-button-text {
    color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #c9d1d9 !important;
    }
}

/* h1項目 - カードスタイル */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    background: #f6f8fa;
    border-radius: 6px;
    padding: 0.8em 1em !important;
    margin: 0.6em 0 !important;
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
    display: none !important;
}

/* h1リンク */
ul.table-of-contents > li > a,
ul.floating-toc-list > li > a {
    font-weight: 600;
    color: #0366d6 !important;
    font-size: 1.05rem !important;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #58a6ff !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #58a6ff !important;
    }
}

/* h2項目 */
ul.table-of-contents > li > ul,
ul.floating-toc-list > li > ul {
    background: transparent;
    padding-top: 0.5em !important;
}

/* h2項目のマーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none !important;
}

/* h2項目にインデントを追加 */
ul.table-of-contents > li > ul li,
ul.floating-toc-list > li > ul li {
    padding-left: 1em !important;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #586069 !important;
    font-size: 0.95rem !important;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e !important;
    }
}

/* ホバー効果 */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: transparent !important;
    color: #0366d6 !important;
    text-decoration: underline !important;
    transform: none !important;
}

html[data-theme="dark"] ul.table-of-contents > li > a:hover,
html[data-theme="dark"] ul.table-of-contents > li > ul li a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a:hover {
    color: #58a6ff !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a:hover,
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a:hover {
        color: #58a6ff !important;
    }
}
```

---

## ミニマル

シンプルで読みやすい、装飾を最小限に抑えたデザイン。

```css
/* ========================================
   目次カスタマイズ - ミニマル
   ======================================== */

/* 基本フレーム - 記事内とフローティング目次の両方に適用 */
ul.table-of-contents,
ul.floating-toc-list {
    background: transparent !important;
    border: none !important;
    border-radius: 0 !important;
    box-shadow: none !important;
    padding: 0.5em 0.8em !important;
    margin: 0.5em 0 !important;
}

/* 元のテーマの縦線を完全に削除 */
ul.table-of-contents::before,
ul.floating-toc-list::before {
    display: none !important;
}

ul.table-of-contents::after,
ul.floating-toc-list::after {
    display: none !important;
}

/* 記事内の目次タイトル */
.toc-title {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
    font-size: 1.1em !important;
    font-weight: 400 !important;
    padding: 0.8em 1em !important;
    padding-bottom: 0.5em !important;
    color: #24292e !important;
    background-color: transparent !important;
    border: none !important;
    margin-bottom: 0.8em !important;
    cursor: pointer !important;
}

html[data-theme="dark"] .toc-title {
    color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title {
        color: #c9d1d9 !important;
    }
}

/* 開閉アイコンのスタイル */
.toc-title .toc-toggle-icon {
    width: 12px !important;
    height: 12px !important;
    position: relative !important;
    display: inline-block !important;
    flex-shrink: 0 !important;
}

.toc-title .toc-toggle-icon::before,
.toc-title .toc-toggle-icon::after {
    content: "" !important;
    position: absolute !important;
    background-color: #24292e !important;
    transition: all 0.3s ease !important;
}

.toc-title .toc-toggle-icon::before {
    width: 100% !important;
    height: 2px !important;
    top: 5px !important;
    left: 0 !important;
}

.toc-title .toc-toggle-icon::after {
    width: 2px !important;
    height: 100% !important;
    top: 0 !important;
    left: 5px !important;
}

html[data-theme="dark"] .toc-title .toc-toggle-icon::before,
html[data-theme="dark"] .toc-title .toc-toggle-icon::after {
    background-color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::before,
    html:not([data-theme="light"]) .toc-title .toc-toggle-icon::after {
        background-color: #c9d1d9 !important;
    }
}

/* フローティング目次のボタンテキスト */
.toc-button-text {
    font-weight: 400 !important;
    color: #24292e !important;
}

html[data-theme="dark"] .toc-button-text {
    color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) .toc-button-text {
        color: #c9d1d9 !important;
    }
}

/* h1項目 */
ul.table-of-contents > li,
ul.floating-toc-list > li {
    margin: 0.5em 0 !important;
    padding-left: 0 !important;
    list-style: none !important;
}

/* h1項目のマーカーを非表示 */
ul.table-of-contents > li::before,
ul.floating-toc-list > li::before {
    display: none !important;
}

/* h1リンク */
ul.table-of-contents > li > a,
ul.floating-toc-list > li > a {
    font-weight: 400 !important;
    color: #24292e !important;
    font-size: 1rem !important;
    text-align: left !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    background-color: transparent !important;
    border-radius: 0 !important;
}

html[data-theme="dark"] ul.table-of-contents > li > a,
html[data-theme="dark"] ul.floating-toc-list > li > a {
    color: #c9d1d9 !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a {
        color: #c9d1d9 !important;
    }
}

/* h2項目 */
ul.table-of-contents > li > ul,
ul.floating-toc-list > li > ul {
    margin: 0.3em 0 0 1em !important;
    padding: 0 !important;
}

ul.table-of-contents > li > ul li,
ul.floating-toc-list > li > ul li {
    margin: 0.3em 0 !important;
    padding-left: 0 !important;
    list-style: none !important;
}

/* h2項目のマーカーを非表示 */
ul.table-of-contents > li > ul li::before,
ul.floating-toc-list > li > ul li::before {
    display: none !important;
}

/* h2リンク */
ul.table-of-contents > li > ul li a,
ul.floating-toc-list > li > ul li a {
    color: #57606a !important;
    font-size: 0.95rem !important;
    font-weight: 300 !important;
    text-align: left !important;
    display: block !important;
    padding: 0 !important;
    margin: 0 !important;
    background-color: transparent !important;
    border-radius: 0 !important;
}

html[data-theme="dark"] ul.table-of-contents > li > ul li a,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a {
    color: #8b949e !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a {
        color: #8b949e !important;
    }
}

/* ホバー効果 - 控えめに */
ul.table-of-contents > li > a:hover,
ul.table-of-contents > li > ul li a:hover,
ul.floating-toc-list > li > a:hover,
ul.floating-toc-list > li > ul li a:hover {
    background-color: transparent !important;
    color: #0969da !important;
    text-decoration: none !important;
    transform: none !important;
    border-radius: 0 !important;
}

html[data-theme="dark"] ul.table-of-contents > li > a:hover,
html[data-theme="dark"] ul.table-of-contents > li > ul li a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > a:hover,
html[data-theme="dark"] ul.floating-toc-list > li > ul li a:hover {
    color: #58a6ff !important;
}

@media (prefers-color-scheme: dark) {
    html:not([data-theme="light"]) ul.table-of-contents > li > a:hover,
    html:not([data-theme="light"]) ul.table-of-contents > li > ul li a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > a:hover,
    html:not([data-theme="light"]) ul.floating-toc-list > li > ul li a:hover {
        color: #58a6ff !important;
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
