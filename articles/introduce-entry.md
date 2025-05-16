# CodeFocus - シンプルで美しいはてなブログデザインテーマ

はてなブログをもっとシンプルに、もっと読みやすく。CodeFocusテーマは、[Zenn](https://zenn.dev/)からインスピレーションを得た、コンテンツに集中できるミニマルデザインのはてなブログテーマです。

## テーマの特徴

CodeFocusテーマは、以下の特徴を持つ現代的なデザインテーマです：

- **シンプルなシングルカラムレイアウト** - コンテンツを中心に置いたデザイン
- **美しい目次表示機能** - 記事内の目次とフローティング目次の両方をサポート
- **完全レスポンシブデザイン** - あらゆるデバイスで最適な表示
- **洗練されたタイポグラフィ** - 読みやすさを追求したフォント設定
- **カスタマイズしやすい構造** - 自分好みにアレンジ可能

## デザインと見た目

CodeFocusテーマは、すべてのデバイスで美しく表示されるよう設計されています。

### PCでの表示

PCでは、コンテンツを中心に配置し、十分な余白を持たせることで読みやすさを重視しています。サイドバーが下部に移動することで、記事本文に集中できる環境を提供します。

![PC表示のスクリーンショット](screenshots/visual-article.png)

### タブレットでの表示

タブレットでは、PCと同様のレイアウトを保ちながらも、画面サイズに合わせて最適化されています。コンテンツの読みやすさはそのままに、タッチ操作にも対応しています。

![タブレット表示のスクリーンショット](screenshots/visual-tablet.png)

### スマートフォンでの表示

スマートフォンでは、限られた画面サイズを最大限に活用するレイアウトに自動調整されます。不要な要素を省き、本文を読むことに集中できるデザインになっています。

![スマートフォン表示のスクリーンショット](screenshots/visual-mobile.png)

記事ページのスマートフォン表示では、読みやすさを最優先したレイアウトになっています。

![スマートフォン記事表示のスクリーンショット](screenshots/visual-mobile-article.png)

## 特別機能：目次表示

CodeFocusテーマでは、2種類の目次表示方法を提供しています：

### 1. 記事内目次

記事内に目次を自動的に表示します。クリックで開閉可能な目次は、長い記事でも読者が迷わずに読み進められるようサポートします。

![記事内目次のスクリーンショット](screenshots/visual-in-page-toc.png)

### 2. フローティング目次ボタン

記事右上に常に表示される目次ボタンを提供します。このボタンをクリックすると、いつでも目次を表示できるため、長い記事でも迷子になることがありません。

![フローティング目次ボタンのスクリーンショット](screenshots/visual-toc-button.png)
![目次コンテンツのスクリーンショット](screenshots/visual-toc-content.png)

## テーマの導入方法

1. [Hatena-Blog-Theme-Boilerplate](https://github.com/hatena/Hatena-Blog-Theme-Boilerplate) リポジトリから最新版の `codefocus.css` をダウンロード
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

1. [toc-toggle.html](https://github.com/hatena/Hatena-Blog-Theme-Boilerplate/blob/master/toc-toggle.html) ファイルの内容をコピー
2. はてなブログの管理画面から「デザイン」→「カスタマイズ」→「記事」→「記事上HTML（記事本文上）」に貼り付け
3. 変更を保存

### 目次ボタン機能を利用する

ページ右上に固定される目次ボタンを使用するには：

1. [toc-button.html](https://github.com/hatena/Hatena-Blog-Theme-Boilerplate/blob/master/toc-button.html) ファイルの内容をコピー
2. はてなブログの管理画面から「デザイン」→「カスタマイズ」→「記事」→「記事上HTML（記事本文上）」に貼り付け
3. 変更を保存

### はてなブログPro契約者向け設定

はてなブログProをご利用の方は、以下の設定をおすすめします：

1. 「設定」→「詳細設定」でヘッダーとフッターを非表示に設定
2. 「デザイン」→「カスタマイズ」→「レイアウト」で「トップページを一覧形式にする」を選択
3. 変更を保存

トップページを一覧形式に設定することで、CodeFocusテーマの美しいアーカイブ表示を活用できます。

![アーカイブ表示のスクリーンショット](screenshots/archive-grid.png)

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

```css
.entry-categories .entry-category-link {
  border-radius: 16px;
  padding: 3px 10px;
}
```

![カテゴリー表示のスクリーンショット](screenshots/category-item.png)

### コメントセクションのカスタマイズ

CodeFocusテーマでは、コメントセクションもZennのDiscussionスタイルに似た美しいデザインになっています。

![コメントセクションのスクリーンショット](screenshots/comment-section.png)

より高度なカスタマイズをしたい方は、[GitHub リポジトリ](https://github.com/hatena/Hatena-Blog-Theme-Boilerplate)からSCSSファイルをダウンロードして、ローカルで開発することもできます。

## 開発者向け情報

テーマをさらにカスタマイズしたい開発者の方々へ、CodeFocusテーマは以下のような構造でSCSSファイルが分割されています：

- `_variable.scss` - カラーやフォントなどの変数定義
- `_core.scss` - 全体のベーススタイル
- `_table_of_contents.scss` - 目次のスタイル
- `_table_of_contents_toggle.scss` - 目次開閉機能のスタイル
- `_table_of_contents_button.scss` - 目次ボタンのスタイル
- `_related_entries.scss` - 関連記事のスタイル

この構造により、特定の部分だけを変更したい場合も簡単に対応できます。

## まとめ

CodeFocusテーマは、美しく読みやすいブログを簡単に実現できる、モダンなはてなブログテーマです。シンプルなデザインながらも必要な機能をすべて備えており、ブログ執筆に集中できる環境を提供します。

ぜひあなたのブログに取り入れて、読者に快適な読書体験を提供してください！

---

*CodeFocusテーマに関するフィードバックやご質問は、[GitHub Issues](https://github.com/hatena/Hatena-Blog-Theme-Boilerplate/issues)にてお待ちしております。*
