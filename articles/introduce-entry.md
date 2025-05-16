# CodeFocus - コードと記事に集中できるはてなブログデザインテーマ

はてなブログをもっとシンプルに、もっと読みやすく。CodeFocusテーマは、[Zenn](https://zenn.dev/)スタイルからインスピレーションを得た、プログラミングブログに最適なシングルカラムデザインのはてなブログテーマです。

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

### PCでの表示

PCでは、コンテンツを中心に配置し、十分な余白を持たせることで読みやすさを重視しています。サイドバーが下部に移動することで、記事本文に集中できる環境を提供します。

![PC表示のスクリーンショット](screenshots/pc-article-top.png)

### タブレットでの表示

タブレットでは、PCと同様のレイアウトを保ちながらも、画面サイズに合わせて最適化されています。コンテンツの読みやすさはそのままに、タッチ操作にも対応しています。

![タブレット表示のスクリーンショット](screenshots/tablet-article-top.png)

### スマートフォンでの表示

スマートフォンでは、限られた画面サイズを最大限に活用するレイアウトに自動調整されます。不要な要素を省き、本文を読むことに集中できるデザインになっています。

![スマートフォン表示のスクリーンショット](screenshots/smartphone-article-top.png)

## コードハイライトとタグクラウド

CodeFocusテーマはプログラミング記事に最適なスタイルを提供します。

### コードハイライト表示

プログラミング言語のコードブロックを見やすく表示します。複数言語に対応し、長いコードでも読みやすいデザインです。

以下は、Python、C#、Goで同一処理を記述したコードの表示例です：

Pythonコードハイライト

```python
#!/usr/bin/env python3
from dataclasses import dataclass
from typing import List

# 2-D immutable point
@dataclass(frozen=True)
class Point:
    x: float; y: float
    def __add__(self, o: "Point") -> "Point":
        return Point(self.x + o.x, self.y + o.y)

def sum_points(ps: List[Point]) -> Point:
    total = Point(0, 0)
    for p in ps:
        total += p
    return total

if __name__ == "__main__":
    pts = [Point(i, (i * i) % 5) for i in range(5)]
    print(sum_points(pts))
```

C#コードハイライト

```cs
using System;
using System.Collections.Generic;
using System.Linq;

var points = Enumerable.Range(0, 5)
    .Select(i => new Point(i, (i * i) % 5));
Console.WriteLine($"Total = {Sum(points)}");

static Point Sum(IEnumerable<Point> pts)
    => pts.Aggregate(new Point(0, 0), (acc, p) => acc + p);

// immutable value object
public readonly record struct Point(double X, double Y)
{
    public static Point operator +(Point a, Point b) => new(a.X + b.X, a.Y + b.Y);
}
```

Goコードハイライト

```go
package main

import "fmt"

// Point is a simple 2-D vector
type Point struct{ X, Y int }

func (p Point) Add(o Point) Point { return Point{p.X + o.X, p.Y + o.Y} }

func Sum(ps []Point) (t Point) {
	for _, p := range ps { t = t.Add(p) }
	return
}

func main() {
	pts := make([]Point, 5)
	for i := range pts { pts[i] = Point{i, (i * i) % 5} }
	fmt.Printf("Total = %+v\n", Sum(pts))
}
```

### タグクラウドスタイル

カテゴリーを記事数に応じて視覚的に表示します。記事数が多いカテゴリーほど大きく表示されるため、ブログの主要テーマが一目でわかります。

![カテゴリー表示のスクリーンショット](screenshots/pc-category-container.png)

## 便利な目次機能

CodeFocusテーマでは、2種類の目次表示方法を提供しています：

### 1. 記事内目次

※ テーマ導入後、後述するJavaScriptの設定が必要です。

記事の`[:contents]`に対する目次を操作しやすくスタイリングしました。クリックで開閉可能な目次は、長い記事でも読者が迷わずに読み進められるようサポートします。

![記事内目次のスクリーンショット](screenshots/pc-toc.png)

### 2. フローティング目次ボタン

※ テーマ導入後、後述するJavaScriptの設定が必要です。

記事右上に常に表示される目次ボタンを提供します。このボタンをクリックすると、いつでも目次を表示できるため、長い記事でも迷子になることがありません。目次ボタンは、ページトップから少しスクロールすると表示されます。

![フローティング目次ボタンのスクリーンショット](screenshots/pc-toc-button.png)
![フローティング目次コンテンツのスクリーンショット](screenshots/pc-floating-toc.png)

## テーマの導入方法

1. [HatenaBlog-Theme](https://github.com/guitarrapc/HatenaBlog-Theme) リポジトリから最新版の `style.css` をダウンロード
2. はてなブログの管理画面から「デザイン設定」→「カスタマイズ」→「デザインCSS」にCSSをコピー＆ペースト
3. 「保存」ボタンをクリックしてテーマを適用

## テーマ導入後の設定

### レスポンシブデザイン設定

CodeFocusテーマはレスポンシブデザインに完全対応していますが、正しく表示するには以下の設定が必要です：

1. はてなブログの管理画面から「設定」→「詳細設定」に進む
2. 「スマートフォン向けデザイン」のセクションで「レスポンシブデザインを適用する」にチェック
3. 変更を保存

### 目次開閉機能を利用する

記事中の目次を開閉する機能を使用するには、以下の設定を行ってください：

1. [toc-toggle.html](https://github.com/guitarrapc/HatenaBlog-Theme/blob/master/toc-toggle.html) ファイルの内容をコピー
2. はてなブログの管理画面から「デザイン」→「カスタマイズ」→「記事」→「記事上HTML（記事本文上）」に貼り付け
3. 変更を保存

### 目次ボタン機能を利用する

ページ右上に固定される目次ボタンを使用するには、以下の設定を行ってください：

1. [toc-button.html](https://github.com/guitarrapc/HatenaBlog-Theme/blob/master/toc-button.html) ファイルの内容をコピー
2. はてなブログの管理画面から「デザイン」→「カスタマイズ」→「記事」→「記事上HTML（記事本文上）」に貼り付け
3. 変更を保存

### はてなブログPro契約者向け設定

はてなブログProをご利用の方は、以下の設定をおすすめします：

1. 「設定」→「詳細設定」でヘッダーとフッターを非表示に設定
2. 「デザイン」→「カスタマイズ」→「レイアウト」で「トップページを一覧形式にする」を選択
3. 変更を保存

トップページを一覧形式に設定することで、CodeFocusテーマの美しいアーカイブ表示を活用できます。いくつかの記事を一覧で表示することで、読者は興味のある記事にすぐにアクセスできます。

![アーカイブ表示のスクリーンショット](screenshots/pc-archive-grid.png)

## カスタマイズ方法

CodeFocusテーマは、カスタマイズしやすい構造になっています。CSSの知識があれば、以下のような部分を簡単にカスタマイズできます：

### 色の変更

```css
:root {
  --primary-color: #3366ff; /* メインカラー */
  --text-color: #333333; /* 文字色 */
  --link-color: #0066cc; /* リンク色 */
  --background-color: #ffffff; /* 背景色 */
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
.table-of-contents {
  border-radius: 8px;
  background-color: #f8f9fa;
}
```

### カテゴリーの表示スタイル変更

カテゴリーは丸みを帯びたタグスタイルで表示されます。ホバー時の挙動も設定可能です。

```css
.entry-categories .entry-category-link {
  border-radius: 16px;
  padding: 3px 10px;
}
```

通常表示:
![カテゴリー表示のスクリーンショット](screenshots/pc-category-item.png)

ホバー時:
![カテゴリーホバーのスクリーンショット](screenshots/pc-category-item-hover.png)

### コメントセクションのカスタマイズ

CodeFocusテーマでは、コメントセクションもZennのDiscussionスタイルに似た美しいデザインになっています。ユーザー名や日付が見やすく配置され、コメント内容も読みやすくレイアウトされています。

![コメントセクションのスクリーンショット](screenshots/pc-comment-section.png)

より高度なカスタマイズをしたい方は、[GitHub リポジトリ](https://github.com/guitarrapc/HatenaBlog-Theme)からSCSSファイルをダウンロードして、ローカルで開発することもできます。

## 開発者向け情報

テーマをさらにカスタマイズしたい開発者の方々へ、CodeFocusテーマは以下のような構造でSCSSファイルが分割されています：

- `_variable.scss` - カラーやフォントなどの変数定義
- `_core.scss` - 全体のベーススタイル
- `_table_of_contents.scss` - 記事内目次のスタイル
- `_table_of_contents_toggle.scss` - 目次開閉機能のスタイル
- `_table_of_contents_button.scss` - 目次ボタンのスタイル
- `_related_entries.scss` - 関連記事のスタイル
- `_functions.scss` - SCSSで使用する関数定義

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

これにより、SCSSの変更がリアルタイムでブログに反映され、即座に効果を確認できます。

## 関連記事の表示

CodeFocusテーマでは、関連記事もレイアウトされています。サムネイル画像とタイトル、日付が見やすく配置されており、読者が関連コンテンツを探しやすくなっています。

![関連記事表示のスクリーンショット](screenshots/pc-related-entries.png)

## まとめ

CodeFocusテーマは、美しく読みやすいブログを簡単に実現できる、モダンなはてなブログテーマです。特にプログラミングやコード記事を書くブロガーにおすすめのデザインで、コンテンツの表示を最適化しています。

シンプルなデザインながらも必要な機能をすべて備えており、ブログ執筆に集中できる環境を提供します。レスポンシブデザインにより、あらゆるデバイスからの閲覧にも対応しています。

ぜひあなたのブログに取り入れて、読者に快適な読書体験を提供してください！

---

*CodeFocusテーマに関するフィードバックやご質問は、[GitHub Issues](https://github.com/guitarrapc/HatenaBlog-Theme/issues)にてお待ちしております。*
