---
title: dark theme color spec base
date: 2026-02-12
effective: actives since v1.11.0
updated: 2026-09-22
---

# アクセシブルなライト/ダークテーマ仕様（WCAG 2.2 + 実務知見）

このドキュメントは、技術系ブログテーマの **ライトテーマ / ダークテーマ** を設計するための仕様案です。
特に「ダークが黒すぎる」問題を解消しつつ、**色弱（色覚多様性）** を含む多様なユーザーに配慮することを目的とします。

> NOTE: 本仕様は「ダークモード専用のWCAG項目」ではなく、WCAGが求める **測定可能な条件（コントラスト、色だけに頼らない、非テキストコントラスト、フォーカス可視性）** をダーク/ライト配色に落とし込んだものです。


---

## 1. 目的 / ゴール

- ダークテーマの背景を **純黒 (#000)** にせず、読み疲れ（眩しさ/ハレーション）を軽減する
- WCAGの要点（特にコントラスト・色依存の回避）を満たす
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
- **状態/重要情報** を **色だけ** で伝えない
- 本文中リンクは、次のどちらかで周りの文字と区別できるようにする
  - 下線等の非色の手がかりを常に付ける
  - 色だけで示す場合は、達成方法G183の3条件を満たす（リンク色と本文色が **3:1 以上**、リンク色と背景色が **4.5:1 以上**、hover/focus時に下線等を出す）。3:1に届かない色で、hover時だけ下線を出すのはNG（F73）
- 本テーマは後者を採用する（§4.3）

参照:
- Understanding SC 1.4.1 Use of Color
  https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- Failure F73: Identifying links only by color
  https://www.w3.org/TR/WCAG20-TECHS/F73.html
- Technique G183: Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on hover and focus
  https://www.w3.org/WAI/WCAG22/Techniques/general/G183

### 2.4 フォーカス可視性（実務で強く推奨）
- WCAG 2.2 の 2.4.13 Focus Appearance は **AAA** だが、ダークテーマでは特に有用。
- 最低限: `:focus-visible` で視認性の高いアウトラインを出す。

参照:
- WCAG 2.2（該当節 2.4.13）
  https://www.w3.org/TR/WCAG22/

---

## 3. 実務上の推奨（黒すぎ問題と色弱対策）

### 3.1 背景は純黒にしない（#000 を避ける）
- 例: `#121212` のような「ほぼ黒」にして、白文字との強烈な対比を避ける
- 読み疲れの軽減、階層（面）の表現がしやすくなる

参照（実務ガイド例）:
- Material系のダークテーマ設計（Google Codelabs）
  https://codelabs.developers.google.com/codelabs/design-material-darktheme

### 3.2 階層は「影」より「明度差」で作る
- ダークでは影が見えにくいことが多いため、カード/コードブロックは **背景より少し明るい面** を置く

### 3.3 本文中リンクは下線を引かず、色のコントラストで担保する
- 一般には下線をデフォルトにするのが最も確実（リンク色を過度に高彩度にする必要が減り、色弱でも判別しやすい）
- ただし本テーマはZenn / noteのスタイルに倣い、本文中リンクに常時の下線を引かない。見た目の方針として意図的に選んでいる
- その代わり、リンク色を本文色から3:1以上離し、hover/focusで下線を出す（§2.3のG183）

### 3.4 高彩度色の多用を避ける
- 暗背景で高彩度の青/紫/赤はにじみやチカつきが出やすい
- リンク色は「明るいが彩度は抑えめ」にするのが実務的に安定
- ただし下線なしのリンク（§3.3）では、明るい本文色から3:1離すためにリンクを暗めにする必要があり、この推奨とはトレードオフになる（§4.3）

---

## 4. カラートークン例（ライト/ダーク）

本例は、以下の最低トークンを定義する。

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

### 4.2 Dark theme（推奨値）
- `bg`: `#121212`（純黒回避）
- `fg`: `#E6E6E6`（純白回避）
- `link`: `#8AB4F8`
- `link-visited`: `#C58AF9`
- `link-hover`: `#AECBFA`
- `code-bg`: `#1E1E1E`（背景より少し明るい面）
- `border` (推奨): `#3A3A3A`
- `focus` (推奨): `#AECBFA`

### 4.3 採用値（本文中リンク / ダーク）

本文中リンクは下線なしで色だけで示すため（§3.3）、本文 `#E6EDF3` と背景 `#1A1F27`（`dark-theme-color-review.md` の案B）の両方に対する条件を満たす色を採用する。ライトテーマの採用値は `light-theme-accessibility-spec.md` §4.2 を参照。

| トークン | 値 | 本文との比 | 背景との比 |
|---|---|---|---|
| `link` | `#1A85FF` | 3.04:1 | 4.60:1 |
| `link-visited` | `#9E69F7` | 3.05:1 | 4.58:1 |
| `link-hover` | `#58A6FF` | —（hover時は下線で区別） | 6.55:1 |

理由と経緯:
- 以前の `#58A6FF`（GitHub Dark風の淡い青）は、背景に対して6.55:1あったが、本文に対して2.14:1しかなかった
- ダークでは本文が明るいため、「本文と3:1」と「背景と4.5:1」の両方を満たすのは、相対輝度でおよそ0.236〜0.246の狭い範囲に限られる。淡い青はどれも範囲から外れ、以前より暗く鮮やかな青になる
- §4.2の推奨値 `#8AB4F8` も本文に対して1.78:1で、下線なしの運用では使えない。推奨値は常時下線を前提にした値である
- §3.4（高彩度を避ける）とのトレードオフは、下線なしの方針を優先して受け入れた。範囲を広げるには、背景を暗くする（`#1A1F27` の輝度を下げる）必要がある
- hoverは下線で区別できるため本文との差は要らない。以前のリンク色 `#58A6FF` に明るくして反応を示す
- 訪問済みの以前の値は、リンク色から明度と彩度を下げて算出していた。リンク色を暗くすると背景比が4.5:1を割るため、条件を満たす紫を個別に定義した

### 4.4 コードハイライト

ハイライト色はライトテーマと共通にしている（両テーマともコードブロックの背景が暗いため）。値と理由は `light-theme-accessibility-spec.md` §4.3 を参照。

### 4.5 補助テキスト・境界線・スクロールバー

本文より下の階層の使い分けはライトテーマと同じ（`light-theme-accessibility-spec.md` §4.4）。

| トークン | 値 | 背景 `#1A1F27` との比 |
|---|---|---|
| `--text-low-priority` | `#8B949E` | 5.38:1 |
| `--text-light` | `#868686` | 4.54:1 |
| `--border` | `#30363D` | 1.36:1 |
| `--border-light` | `#2A3039` | 1.25:1 |

理由と経緯:
- `#868686` は、暗い背景で4.5:1を満たす最も暗いグレー。`#808080` は4.19:1で届かない
- `--border-light` は、ライトの `--border-light`（`#D6E3ED`、背景 `#FAFAFA` に対して1.25:1）と同じ見え方にしつつ、`--border` より控えめという関係をダークでも保つ値。以前の候補 `#21262D` は1.09:1で背景とほぼ同色になり、線を引いても見えなかった
- 境界線はhoverで一段明るくして反応を示す。ライトでは一段濃くするが、暗い背景では濃くすると背景に沈むため逆にする
- スクロールバーのつまみ（`--scrollbar-thumb`）は、暗いパネルの上では黒の半透明が見えないため、白の半透明（`rgba(255, 255, 255, 0.25)`）にする

---

## 5. スタイル仕様（SCSS例）

> NOTE: 以下は常時下線を前提にした一般的な例。本テーマの本文中リンクは下線を引かず、色のコントラストで担保する（§4.3）。

> ダーク/ライト切替はテーマ側で行う前提。以下は `data-theme="dark"` を例に示す。
> `prefers-color-scheme` を使う場合は同様に差し替え可能。
> 参照: https://developer.mozilla.org/en-US/docs/Web/CSS/%40media/prefers-color-scheme

```scss
// ---- Theme tokens ----
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

$theme-dark: (
  bg: #121212,
  fg: #E6E6E6,
  link: #8AB4F8,
  link-visited: #C58AF9,
  link-hover: #AECBFA,
  code-bg: #1E1E1E,
  border: #3A3A3A,
  focus: #AECBFA
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

// ---- Apply (your switcher can change data-theme) ----
:root {
  @include theme-vars($theme-light);
  color-scheme: light; // UAフォーム部品の整合
}

:root[data-theme="dark"] {
  @include theme-vars($theme-dark);
  color-scheme: dark;
}

// ---- Base styles ----
body {
  background: var(--color-bg);
  color: var(--color-fg);
}

// リンクは「色だけに頼らない」ため下線をデフォルトにする（F73回避）
a {
  color: var(--color-link);
  text-decoration: underline;
  text-decoration-thickness: 0.08em;
  text-underline-offset: 0.18em;
}

a:visited {
  color: var(--color-link-visited);
  // 任意: 訪問済みを非色でも示したい場合
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
- [ ] 本文中リンクは、リンク色と本文色が3:1以上、リンク色と背景色が4.5:1以上あり、hover/focus時に下線が出る（§4.3、ライトは`light-theme-accessibility-spec.md` §4.2）
- [ ] 状態（エラー/成功/選択中）を色だけで表さない（アイコン/テキスト/形でも担保）

参照:
- https://www.w3.org/TR/WCAG20-TECHS/F73.html
- https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html

### 6.3 フォーカス可視性
- [ ] キーボード操作時、フォーカスリングが明確に視認できる（`:focus-visible`）
- [ ] ダーク/ライト双方でリングが背景に溶けない

参照:
- https://www.w3.org/TR/WCAG22/

---

## 7. 参考リンク（URLはそのまま）

```text
WCAG 2.2
https://www.w3.org/TR/WCAG22/

forms.app: dark mode statistics
https://forms.app/en/blog/dark-mode-statistics

MDN: prefers-color-scheme
https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme

Medium: Designing accessible dark mode (記事)
https://medium.com/@design.ebuniged/designing-accessible-dark-mode-a-wcag-compliant-interface-redesign-0e0225833aa4

Understanding SC 1.4.3 Contrast (Minimum)
https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html

Understanding SC 1.4.11 Non-text Contrast
https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html

Understanding SC 1.4.1 Use of Color
https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html

Failure F73: Identifying links only by color
https://www.w3.org/TR/WCAG20-TECHS/F73.html

Material dark theme (実務ガイド例)
https://codelabs.developers.google.com/codelabs/design-material-darktheme
```
