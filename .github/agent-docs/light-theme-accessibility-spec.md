---
title: light theme color spec base
date: 2026-02-12
effective: actives since v1.11.0
---

# アクセシブルなライトテーマ仕様（WCAG 2.2 + 実務知見）

このドキュメントは、技術系ブログテーマの **ライトテーマ** を設計するための仕様案です。
色弱（色覚多様性）を含む多様なユーザーに配慮しつつ、ライトテーマ特有の「白すぎて眩しい」「リンクが色だけで分かりにくい」問題を避けることを目的とします。

> NOTE: WCAGはライト/ダークを区別しません。本仕様は **WCAGの測定可能な要件** をライトテーマの色設計へ落とし込んだものです。


---

## 1. 目的 / ゴール

- 背景を **純白 (#fff)** にせず、眩しさ・読み疲れを軽減する
- WCAGの要点（コントラスト、色だけに頼らない、非テキストコントラスト）を満たす
- 本文・リンク・コードブロック等、主要UIの配色トークンを明確化する
- 色弱ユーザーが「リンク」「状態」「操作」を **色だけ** で判別しなくて良い設計にする

---

## 2. WCAG 2.2 の要件として守ること

### 2.1 テキストと背景のコントラスト（必須）
- 通常サイズの本文テキスト: **4.5:1 以上**
- 大きい文字（概ね 18pt 以上、または太字 14pt 以上）: **3:1 以上**

参照:
- WCAG 2.2 / Understanding SC 1.4.3 Contrast (Minimum)
  https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

### 2.2 非テキスト（UI境界・アイコン等）のコントラスト（必須）
- 入力欄の枠線、ボタン境界、アイコン、グラフ線など（非アクティブ除く）: **3:1 以上**

参照:
- Understanding SC 1.4.11 Non-text Contrast
  https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

### 2.3 色だけに頼らない（必須・色弱配慮の中心）
- **リンク/状態/重要情報** を **色だけ** で伝えない
- 本文中リンクは「色差」だけでなく **下線等の非色の手がかり** を付ける（hover時だけ下線はNG）

参照:
- Understanding SC 1.4.1 Use of Color
  https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- Failure F73: Identifying links only by color
  https://www.w3.org/TR/WCAG20-TECHS/F73.html

---

## 3. 実務上の推奨（ライトテーマ特有の配慮）

### 3.1 背景は純白にしない（#fff を避ける）
- 例: `#FAFAFA` や `#F7F7F5` のような「少し落ち着いた白」にする
- ユーザーによっては純白が眩しさ・グレアを誘発しやすい

参考（実務的な解説例）:
- The problem with white backgrounds（白背景の眩しさ問題の説明）
  https://accessbydesign.uk/the-problem-with-white-backgrounds/

### 3.2 本文文字色も純黒にしない（#000 を避ける）
- `#1B1B1B` のような「ほぼ黒」にすると、コントラストを確保しつつ刺激を減らせる

参考（コントラスト実務の解説例）:
- Colour contrast（適切な色選びの考え方）
  https://accessibilityinnovations.com/blogs/colour-contrast/

### 3.3 リンクは「色」ではなく「形」で担保する
- 下線をデフォルトにし、リンク色は過度に派手にしない
- 色弱でもリンク判別がしやすい（WCAG的にも強い）

参考（リンク識別が色だけにならない運用例）:
- Link identified only by color（注意喚起）
  https://www.hawaii.edu/access/2019/04/17/37-link-identified-only-by-color/

---

## 4. カラートークン仕様（ライトテーマ）

本テーマは、以下の最低トークンを定義する。

- `bg` : 背景色（ページ全体）
- `fg` : 主要文字色（本文）
- `link` : リンク色（未訪問）
- `link-visited` : 訪問済みリンク色
- `link-hover` : リンク hover/focus の色
- `code-bg` : コードブロック背景色（`pre`, `code`）

> 追加推奨（UI安定のため）
> - `border` : 入力枠や区切り線の境界色（非テキスト 3:1 を狙う）
> - `focus` : `:focus-visible` のアウトライン色

### 4.1 Light theme（推奨値）
- `bg`: `#FAFAFA`
- `fg`: `#1B1B1B`
- `link`: `#0B57D0`
- `link-visited`: `#6F2DBD`
- `link-hover`: `#0842A0`
- `code-bg`: `#F6F8FA`
- `border` (推奨): `#C7C7C7`
- `focus` (推奨): `#0B57D0`

---

## 5. スタイル仕様（SCSS例）

> テーマ切替はテーマ側で行う前提。以下はライトテーマを `:root` に適用する例。
> `prefers-color-scheme` を使う場合の参考:
> https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-color-scheme

```scss
// Light theme tokens (color-vision friendly + WCAG-oriented)
$theme-light: (
  bg: #FAFAFA,
  fg: #1B1B1B,
  link: #0B57D0,
  link-visited: #6F2DBD,
  link-hover: #0842A0,
  code-bg: #F6F8FA,
  border: #C7C7C7,
  focus: #0B57D0
);

@mixin theme-vars($t) {
  --color-bg: #{map-get($t, bg)};
  --color-fg: #{map-get($t, fg)};
  --color-link: #{map-get($t, link)};
  --color-link-visited: #{map-get($t, link-visited)};
  --color-link-hover: #{map-get($t, link-hover)};
  --color-code-bg: #{map-get($t, code-bg)};
  --color-border: #{map-get($t, border)};
  --color-focus: #{map-get($t, focus)};
}

:root {
  @include theme-vars($theme-light);
  color-scheme: light;
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
}

// 色だけに頼らない：本文中リンクは下線をデフォルトに（F73回避）
a {
  color: var(--color-link);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

a:visited {
  color: var(--color-link-visited);
  // 任意: 訪問済みを非色でも少し示す
  text-decoration-style: dotted;
}

a:hover,
a:focus-visible {
  color: var(--color-link-hover);
  text-decoration-thickness: 0.12em;
}

// 非テキスト境界: 3:1 を意識（入力枠等）
input, textarea, select, button {
  border: 1px solid var(--color-border);
}

// フォーカス可視性（実務推奨）
:focus-visible {
  outline: 2px solid var(--color-focus);
  outline-offset: 2px;
}

// コードブロック背景
pre, code {
  background: var(--color-code-bg);
}

pre {
  padding: 0.9rem 1rem;
  border-radius: 0.6rem;
  overflow: auto;
}
```

---

## 6. 受け入れ基準（チェックリスト）

### 6.1 コントラスト
- [ ] 本文（通常サイズ）の `fg` と `bg` のコントラスト比が **4.5:1 以上**
- [ ] 見出し・大きい文字は **3:1 以上**（ただし本文と統一して 4.5:1 を満たすのが安全）
- [ ] 入力欄枠線・区切り線・アイコン等は背景に対して **3:1 以上**

参照:
- https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html
- https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

### 6.2 色だけに依存しない
- [ ] 本文中リンクは常時下線等で識別可能（hover時だけ下線はNG）
- [ ] 状態（エラー/成功/選択中）を色だけで表さない（アイコン/テキスト/形でも担保）

参照:
- https://www.w3.org/TR/WCAG20-TECHS/F73.html
- https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html

### 6.3 フォーカス可視性（推奨）
- [ ] キーボード操作時、フォーカスリングが明確に視認できる（`:focus-visible`）
- [ ] ライトテーマでリングが背景に溶けない

参照:
- https://www.w3.org/TR/WCAG22/

---

## 7. 参考リンク（URLはそのまま）

```text
WCAG 2.2
https://www.w3.org/TR/WCAG22/

Understanding SC 1.4.3 Contrast (Minimum)
https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Understanding SC 1.4.11 Non-text Contrast
https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

Understanding SC 1.4.1 Use of Color
https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html

Failure F73: Identifying links only by color
https://www.w3.org/TR/WCAG20-TECHS/F73.html

The problem with white backgrounds
https://accessbydesign.uk/the-problem-with-white-backgrounds/

Colour contrast
https://accessibilityinnovations.com/blogs/colour-contrast/

Link identified only by color
https://www.hawaii.edu/access/2019/04/17/37-link-identified-only-by-color/

MDN: prefers-color-scheme
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
```

---

## 8. 今後の拡張（任意）
- `surface` / `surface-2`（カード背景）や `muted-fg`（補助テキスト）を追加し、階層表現をトークン化
- コードブロックのシンタックスハイライト色を追加（色だけに依存しない設計で）
- 色覚シミュレーション（protan/deutan/tritan）での視認性チェック手順を追記
