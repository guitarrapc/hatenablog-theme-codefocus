---
title: light theme color spec base
date: 2026-02-12
effective: actives since v1.11.0
updated: 2026-09-22
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
- **状態/重要情報** を **色だけ** で伝えない
- 本文中リンクは、次のどちらかで周りの文字と区別できるようにする
  - 下線等の非色の手がかりを常に付ける
  - 色だけで示す場合は、達成方法G183の3条件を満たす（リンク色と本文色が **3:1 以上**、リンク色と背景色が **4.5:1 以上**、hover/focus時に下線等を出す）。3:1に届かない色で、hover時だけ下線を出すのはNG（F73）
- 本テーマは後者を採用する（§4.2）

参照:
- Understanding SC 1.4.1 Use of Color
  https://www.w3.org/WAI/WCAG21/Understanding/use-of-color.html
- Failure F73: Identifying links only by color
  https://www.w3.org/TR/WCAG20-TECHS/F73.html
- Technique G183: Using a contrast ratio of 3:1 with surrounding text and providing additional visual cues on hover and focus
  https://www.w3.org/WAI/WCAG22/Techniques/general/G183

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

### 3.3 本文中リンクは下線を引かず、色のコントラストで担保する
- 一般には下線をデフォルトにするのが最も確実（色弱でも判別しやすく、リンク色を派手にする必要もない）
- ただし本テーマはZenn / noteのスタイルに倣い、本文中リンクに常時の下線を引かない。見た目の方針として意図的に選んでいる
- その代わり、リンク色を本文色から3:1以上離し、hover/focusで下線を出す（§2.3のG183）

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

### 4.2 採用値（本文中リンク）

本文中リンクは下線なしで色だけで示すため（§3.3）、本文 `#1B1B1B` と背景 `#FAFAFA` の両方に対する条件を満たす色を採用する。

| トークン | 値 | 本文との比 | 背景との比 |
|---|---|---|---|
| `link` | `#0969DA` | 3.32:1 | 4.97:1 |
| `link-visited` | `#8250DF` | 3.41:1 | 4.83:1 |
| `link-hover` | `#05458A` | —（hover時は下線で区別） | 9.04:1 |

理由と経緯:
- 以前の `#0656AC`（訪問済み `#6F2DBD`）は背景に対して6.86:1あったが、本文に対して2.41:1しかなく、Lighthouse（axe）のlink-in-text-blockで指摘された。hover時だけ下線を出す運用は、この状態だとF73に当たる
- 本文がほぼ黒なので、リンクを暗くするほど本文に近づく。両条件を満たすのは、相対輝度でおよそ0.13〜0.17の範囲に限られる
- §4.1の推奨値 `#0B57D0` も本文に対して2.70:1で、下線なしの運用では使えない。推奨値は常時下線を前提にした値である
- 範囲内にあるGitHubのリンク色を採用した。テーマに既にあるアラート色（`$color-alert-blue-500` / `$color-alert-purple-500`）と同じ値で、新しい色を増やさずに済む
- 当初は常時下線で対応したが、Zenn / noteに倣う方針に合わないため取りやめ、色で担保する方式にした

### 4.3 コードハイライト

コードブロックはライトテーマでも暗い背景（`#1A2638`）を使うため、ハイライト色はダークテーマ（背景 `#272F3B`）と共通にする。すべての色が、両方の背景に対して4.5:1以上になるようにする。

| 対象 | はてな記法のクラス | 値 | ライト背景との比 | ダーク背景との比 |
|---|---|---|---|---|
| 地の文字 | — | `#FFFFFF` | 15.24:1 | 13.50:1 |
| キーワード（`class` / `def` / `return`） | `synStatement` / `synType` | `#FF8FA3` | 7.04:1 | 6.24:1 |
| import / `#include` / デコレータの`@` | `synPreProc` | `#BC8CFF` | 6.05:1 | 5.36:1 |
| 関数名 | `synIdentifier` | `#38C7FF` | 7.82:1 | 6.93:1 |
| 記号 | `synSpecial` | `#939BC1` | 5.59:1 | 4.95:1 |
| 数値・文字列 | `synConstant` | `#FFC56D` | 9.77:1 | 8.65:1 |
| コメント | `synComment` | `#959EA8` | 5.61:1 | 4.97:1 |

理由と経緯:
- はてな記法のハイライトは、テーマが色を決めていないクラスがあると、はてな側の既定色がそのまま出る。`synPreProc` は定義が漏れていて、はてなの `#9355E6` のまま背景に対して3.0:1しかなかった。記事に現れる `syn*` クラスはすべてテーマで色を決める
- コメントの以前の値 `#8B949E` は、ダークのコードブロック背景に対して4.39:1で、わずかに届かなかった。色相はそのままで少し明るくした
- `synPreProc` は一度キーワードと同じ色にしたが、import宣言とclass宣言の見分けがつかなくなったため、専用の色にした
- 暗い背景でAAを満たす明るさに揃えると、ハイライト色どうしの明度差はほとんど残らない（色どうしのコントラスト比は1.0〜1.2程度）。そのため色相と彩度で区別する。`synPreProc` ははてなの既定色と同じ紫系で鮮やかにし、ピンクのキーワード、灰色がかった記号と見分けられるようにした
- 印刷時は白地で、キーワードが紫（`#8250DF`）になるため、`synPreProc` は赤（`#D1242F`、白地に5.24:1）にして区別する

### 4.4 補助テキスト・境界線・スクロールバー

本文より下の階層は2つある。

| トークン | 用途 | 値 | 背景 `#FAFAFA` との比 |
|---|---|---|---|
| `--text-low-priority` | 記事内の補助テキスト（引用 / 投稿日時 / ページ内目次のリンクなど） | `#6C6C6C` | 5.03:1 |
| `--text-light` | ページの付帯情報（記事下フッタ / ページ末尾フッタ / ページャーの矢印） | `#737373` | 4.54:1 |

理由と経緯:
- どちらも小さい文字（12.8〜14.4px）で、WCAGの大きいテキストの例外に当たらないため、4.5:1以上が要る
- `#737373` は、明るい背景で4.5:1を満たす最も薄いグレー。一つ薄い `#747474` は4.48:1でわずかに届かないため、本文より下の階層はここから濃い側を使う。`--text-low-priority` はそこから一段濃くしている
- 以前の `--text-light` は2.73:1まで薄く、大きいテキストの3:1にすら届いていなかった
- 本文（16.50:1）と4.5:1の間に、見分けられる2段を置く余地はない（2色の明度差ΔL*は2.8しかない）。「階層が色で見える」ことは狙わず、意味の切り分けと文字サイズ（本文16pxに対し12.8〜14.4px）に任せる
- はてな側のCSSが「最近のコメント」の日時（`.recent-comment-time`）に `opacity: 0.7` を当てている。このclassは括弧の `span` と中身の `time` の両方に付くため、0.49まで乗算される。指定色は5.03:1でも、実際に描かれるのは1.99:1で、大きいテキストの3:1すら下回っていた。テーマは不透明度を打ち消し、薄さは色（`--text-low-priority`）だけで表現する。コントラストは指定色ではなく、祖先の不透明度まで含めた実際の描画色で確かめる
- 境界線はhoverで一段濃くして反応を示す（ダークでは逆に一段明るくする）
- スクロールバーのつまみ（`--scrollbar-thumb`）は、明るいパネルの上で見えるよう黒の半透明（`rgba(0, 0, 0, 0.2)`）にする

### 4.5 コードブロック上のフォーカスリング

コードブロックのボタン（コピー / 折り返し切り替え）のフォーカスリングは、テーマにかかわらず明るい青 `#58A6FF` に固定する。

- コードブロックはライト/ダークどちらでも背景が暗い（`#1A2638` / `#272F3B`）。`#58A6FF` はそれぞれに対して6.03:1 / 5.34:1あり、非テキストの3:1を満たす
- ライトテーマの `--link`（`#0969DA`）は、ライトのコードブロック背景に対して2.93:1しかなく、リングが見えない

### 4.6 印刷

- 紙は白地で、印刷ダイアログの「背景のグラフィック」は既定でオフになっている。そのため、暗い背景に載せる前提のコード配色は使えない
- 印刷時は、画面のテーマにかかわらずライトの配色に戻す。コードの配色には、ライト背景で4.5:1以上を満たすことを確認済みのアラート系の色を流用する（§4.3の表とは別の値になる）
- ライトの配色は、画面表示と印刷の両方から同じ定義を使う。定義を2か所に書くと片方だけ更新されて崩れるため、1つにまとめる

---

## 5. スタイル仕様（SCSS例）

> NOTE: 以下は常時下線を前提にした一般的な例。本テーマの本文中リンクは下線を引かず、色のコントラストで担保する（§4.2）。

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
- [ ] 本文中リンクは、リンク色と本文色が3:1以上、リンク色と背景色が4.5:1以上あり、hover/focus時に下線が出る（§4.2）
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
- 色覚シミュレーション（protan/deutan/tritan）での視認性チェック手順を追記
