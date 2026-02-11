# 開発ワークフロー

## 開発環境

* デザインテーマの確認には、[README.md](../../README.md)に記載されているnpmコマンドを実行してローカル開発サーバーを立ち上げる必要がありますが、あなたに指示する前に実行されているものとします。
* 開発サーバーを起動しておくことで、変更されたscssやJSは自動的にブログへ反映されます。反映のための`npm run build`は不要です。
* Copilotが用いるターミナルは、Windowsなら`cmd.exe`、Macなら`Terminal.app`、Linuxは`bash`を想定しています。実行するコマンドは、各ターミナルが扱える文法に適合したものを選択してください。
* ファイルのインデントは、.editorconfigに沿ってください。

## E2Eテスト

* テーマのレンダリング結果は、[トップページ](https://guitarrapc-theme.hatenablog.com/)の個別記事、及び[最新の記事](https://guitarrapc-theme.hatenablog.com/entry/2025/05/10/204601)、[アーカイブ](https://guitarrapc-theme.hatenablog.com/archive/author/guitarrapc_tech)、[アバウト](https://guitarrapc-theme.hatenablog.com/about)を参照してください。
* SCSSやJavaScriptの変更をした場合、PlaywrightでE2Eテストを実行します。
  * E2Eテストは`npm run test`で実行し、コマンドが終了するまでテスト結果の判断を待ってください。テスト結果`test-results/`でエラーが発生しているかどうかを確認できます。
  * E2Eテストは自動化、繰り返し実行を前提とするため、ユーザープロンプトやキャンセルをしないと完了しないようなテストコマンドは使用しないでください。
  * E2Eテストのレンダリング結果を適宜スクリーンショットで確認してください。スクリーンショットは`screenshots/`に保存されます。
  * E2EテストのPlaywrightコードは、`tests/`以下に配置されています。
  * E2Eテスト結果は、`test-results/`に保存されます。エラーが発生すると、`test-results/`にエラーの詳細が保存されます。

## CI/CD

GitHub ActionsでCIを実行して、SCSSやJavaScriptの動作を担保します。

### ビルドワークフロー

* `main`ブランチにpushした、PRが作成された際に自動で実行されます。
* `npm run build`でビルドを実行します。
* `npm run test`でE2Eテストを実行します。

### リリースワークフロー

* タグがpushされた際に自動で実行されます。
* `npm run build`でビルドを実行します。
* [gh](https://cli.github.com/manual/gh_release_create)コマンドを使ってGitHubリリースをドラフトで作成します。
  * リリース文章は`--generate-notes`オプションを指定して自動生成します。
  * リリースアーティファクトとして、`build/`以下のファイル + `customize-*.html`ファイルをzip圧縮してリリースに添付します。
