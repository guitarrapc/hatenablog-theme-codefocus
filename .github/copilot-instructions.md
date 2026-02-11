# はてなブログテーマ CodeFocus 開発ガイド

このリポジトリは、はてなブログのデザインテーマ「CodeFocus」を作成するためのリポジトリです。

## あなたの役割

あなたは、フロントエンドエキスパートとして、はてなブログのデザインテーマを作成するための指示を受けます。
ユーザーとのやり取りは日本語で行います。

## 基本方針

* ファイルのインデントは、.editorconfigに沿ってください。
* デザインテーマの開発には、[README.md](../README.md)に記載されているnpmコマンドでローカル開発サーバーが起動されています。
* 開発サーバーが起動していることで、変更されたSCSSやJavaScriptは自動的にブログへ反映されます。
* ターミナル環境: Windowsなら`cmd.exe`、Macなら`Terminal.app`、Linuxは`bash`を想定しています。

## ドキュメント構成

プロジェクトの詳細な仕様は、以下のドキュメントに分割されています。必要に応じて参照してください。

### 基礎知識

* [プロジェクト構造](agent-docs/project-structure.md) - ディレクトリ構成とファイル構成
* [開発ワークフロー](agent-docs/development-workflow.md) - 開発環境、E2Eテスト、CI/CD
* [実装ルール](agent-docs/implementation-rules.md) - CSS/JavaScriptの実装ルール

### はてなブログの仕様

* [はてなブログHTML構造](agent-docs/hatena-blog-html-structure.md) - はてなブログのHTML構造の詳細
* [はてなブログ公式ガイド](agent-docs/hatena-official-guide.md) - はてなブログ公式のデザインテーマ制作の手引き

### デザイン仕様

* [テーマデザイン仕様](agent-docs/theme-design-spec.md) - 記事ページ、アーカイブ、フッターのデザイン仕様
* [個別コンポーネント仕様](agent-docs/component-specs.md) - 目次、タグクラウド、コードコピー、ダークモード等の個別機能仕様

### プロダクト要件

* [プロダクト要件](agent-docs/product-requirements.md) - テーマストア対応、紹介記事の作成要件

## 開発時の重要な注意事項

開発を進める際は、以下のドキュメントを参照してください:

1. **コードを書く前に**
   - [実装ルール](agent-docs/implementation-rules.md) - CSS/JavaScriptのコーディングルールを確認
   - [プロジェクト構造](agent-docs/project-structure.md) - ファイル配置を確認

2. **デザインを実装する際は**
   - [テーマデザイン仕様](agent-docs/theme-design-spec.md) - 全体のデザイン仕様を確認
   - [個別コンポーネント仕様](agent-docs/component-specs.md) - 特定の機能の詳細仕様を確認
   - [はてなブログHTML構造](agent-docs/hatena-blog-html-structure.md) - HTML構造を理解

3. **テストとデプロイ**
   - [開発ワークフロー](agent-docs/development-workflow.md) - E2Eテスト実行方法とCI/CDの仕組みを確認

4. **テーマストア公開準備**
   - [プロダクト要件](agent-docs/product-requirements.md) - キャッチ画像と紹介記事の要件を確認
   - [はてなブログ公式ガイド](agent-docs/hatena-official-guide.md) - はてなブログの公式ガイドラインを確認
