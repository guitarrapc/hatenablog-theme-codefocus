# プロジェクト構造

## リポジトリのディレクトリ構成

ファイルの参照や変更の際は、以下のディレクトリ構成を参考にしてください。

| パス | 説明 |
| ---- | ---- |
| .github/ | GitHub Actionsの設定ファイルとCopilot指示ドキュメント |
| .vscode/ | VSCodeの設定ファイル(scssのインデント調整に利用) |
| articles/ | はてなブログのエントリー記事 |
| build/ | ビルド成果物となるテーマ、本番はてなブログにはこのファイルを配布する |
| js/ | はてなブログ向けのJavaScriptのソースコード |
| node_modules/ | npmのモジュール |
| screenshots/ | Playwrightで取得したスクリーンショット |
| scss/ | はてなブログ向けのSCSSのソースコード |
| test-results/ | PlaywrightのE2Eテスト結果 |
| tests/ | PlaywrightのE2Eテストコード |
| .editorconfig | エディタ設定ファイル(インデント等の統一) |
| .gitignore | Gitの無視リスト |
| capture-all-screenshots.js | 紹介記事向けのスクリーンショットを取得するスクリプト |
| capture-theme-store-catch.js | テーマストアキャッチ画像をキャプチャするスクリプト |
| customize-*.html | はてなブログのカスタマイズ用HTML |
| LICENSE | ライセンスファイル |
| logo.png | テーマのロゴ画像 |
| logo_large.png | テーマのロゴ画像(大) |
| package-lock.json | npmのパッケージロックファイル |
| package.json | npmのパッケージファイル |
| playwright.config.js | Playwrightの設定ファイル |
| README.md | このリポジトリの説明(英語) |
| README-ja.md | このリポジトリの説明(日本語) |
| server.js | ローカル開発サーバーの動作ファイル |
| theme-store-catch.html | テーマストアキャッチ画像用HTML |
| theme-store-catch.png | テーマストアキャッチ画像 |
| vite.config.js | Viteの設定ファイル |

## SCSSファイル構成

scssは以下のように分割して実装します。

| パス | 説明 |
| ---- | ---- |
| `style.scss` | SCSSのビルドに必要なスタイルを定義します。 |
| `lib/_functions.scss` | SCSS関数を定義します。 |
| `lib/_core.scss` | 全体のスタイルを定義します。 |
| `lib/_codeblock.scss` | コードブロックのコピーボタンのスタイルを定義します。 |
| `lib/_dark_mode.scss` | ダークモードのスタイルを定義します。 |
| `lib/_table_of_contents.scss` | 記事本文中の目次のスタイルを定義します。 |
| `lib/_table_of_contents_toggle.scss` | 記事本文中の目次開閉スタイルを定義します。 |
| `lib/_table_of_contents_button.scss` | 目次ボタンとそのスタイルを定義します。 |
| `lib/_tag_cloud.scss` | タグクラウドのスタイルを定義します。 |
| `lib/_variable.scss` | カラー、サイズ、SVGなどの変数を定義します。 |
