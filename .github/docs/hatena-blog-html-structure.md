# はてなブログのHTML構造

これははてなブログのHTMLの要素についての説明です。はてなブログのHTMLは、ページごとに以下のような構成になっています。

## 全体構造

* ページは大きく分けて、記事部分`<div id="wrapper">`、ブログフッター部分`<aside id="box">`の2つのブロックで構成されます。記事部分の下に、ブログフッター部分があります。
* 記事部分は、記事ページ、アーカイブページ、アバウトページで構造が異なります。それぞれは別セクションで説明します。

## ブログフッター部分

* ブログフッター部分は、ブログパーツを配置する`<div id="box2-inner">`があり、flexboxでブログパーツを配置します。flexboxは、横に最大3つ配置されます。ブログパーツはユーザーがカスタマイズ可能です。
* ブログパーツは、それぞれ`<div class="hatena-module hatena-module-XXXXX">`で構成されます。ブログパーツごとにXXXXはユーザーがカスタマイズ可能です。ブログテーマとしてはXXXXに入る文字は予想できず静的に決め打つ必要があります。テーマカスタマイズのため、XXXXはユーザーに提示する必要があります。
* ブログパーツの中身は、モジュールタイトル`<div class="hatena-module-title">`、モジュールの中身`<div class="hatena-module-body">`で構成されます。

### 主なブログパーツ

* 検索: `<div class="hatena-module hatena-module-search-box">`
* カテゴリー: `<div class="hatena-module hatena-module-category">`
* リンク: `<div class="hatena-module hatena-module-links">`
* 最新記事: `<div class="hatena-module hatena-module-recent-entries">`
* 月別アーカイブ: `<div class="hatena-module hatena-module-archive">`
* 関連記事: `<div class="hatena-module hatena-module-related-entries">`
* プロフィール: `<div class="hatena-module hatena-module-profile">`
* 注目記事: `<div class="hatena-module hatena-module-entries-access-ranking">`
* 最近のコメント: `<div class="hatena-module hatena-module-entries-recent-comments">`
* 最近の参加グループ: `<div class="hatena-module hatena-module-entries-circles">`
* 最近の執筆者リスト: `<div class="hatena-module hatena-module-authors-list">`

## 記事ページ

### 記事全体構造

記事全体(記事全体コンテンツ)は以下のように構成されます:

```html
<div id="main">
  <div id="main-inner">
    <article class="entry ...">記事の数分</article>
    <div class="pager pager-permalink permalink"></div>
  </div>
</div>
```

### 記事コンテンツ

記事全体コンテンツは、各記事(記事コンテンツ)が以下で構成されます:
* トップページ: `<article>`要素は複数存在
* 記事ページ: `<article>`要素は1つだけ存在

```html
<article class="entry ...">
  <div class="entry-inner">
    <!-- 記事ごとの構成要素 -->
  </div>
</article>
```

### 記事の構成要素

記事ごとの構成要素は、以下の3つのブロックで構成されます:

1. **記事ヘッダー** `<header class="entry-header">`
   * 記事タイトル: `<h1 class="entry-title">` (トップページでは`<div class="entry-title">`)
   * 作成日付: `<time class="date entry-date first">`
   * 更新日付: `<span class="date-last-updated">` (トップページでは省略される)
   * カテゴリ: `<div class="entry-categories categories">` (0-複数ありえる)

2. **記事本文** `<div class="entry-content hatenablog-entry">`
   * 記事本文は、このブロックに直接配置されます

3. **記事フッター** `<footer class="entry-footer">`
   * 描画されていないタグラッパー: `<div class="entry-tags-wrapper">`
   * 著者と記事日付: `<div class="entry-footer-selection">`
   * ソーシャルボタン: `<div class="social-buttons">`
   * カスタマイズフッター: `<div class="customized-footer">`
   * コメント: `<div class="comment-box js-comment-box">`

### カスタマイズフッターの関連記事

記事詳細では関連記事が表示されます(トップページでは描画されない):

```html
<div class="hatena-module hatena-module-related-entries">
  <div class="hatena-module-title">関連記事のタイトル</div>
  <div class="hatena-module-body">
    <ul class="related-entries hatena-urllist urllist-with-thumbnails">
      <!-- 関連記事のliが並ぶ -->
    </ul>
  </div>
</div>
```

各関連記事: `<li class="urllist-item related-entries-item">`
* サムネイル: `<a class="urllist-image-link related-entries-image-link"><img class="urllist-image related-entries-image"></a>`
* タイトル: `<a class="urllist-title-link related-entries-title-link urllist-title related-entries-title">`
* 日付: `<div class="urllist-date-link related-entries-date-link">`
* 記事冒頭部: `<div class="urllist-entry-body related-entries-entry-body">`

### コメント

```html
<div class="comment-box js-comment-box">
  <ul class="comment js-comment">
    <li class="entry-comment js-entry-comment">
      <!-- コメント内容 -->
    </li>
  </ul>
  <a class="leave-comment-title js-leave-comment-title">コメントボタン</a>
</div>
```

コメントがない場合は、コメント用のボタンのみ表示され、`<ul class="comment">`は描画されません。

各コメント(`<li class="entry-comment js-entry-comment">`)の構成:
* ユーザー名: `<p class="comment-user-name">`
* コメント本文: `<p class="comment-content">`
* 投稿日付: `<p class="comment-metadata">`
* コメント削除ボタン: `<a class="comment-delete-button js-comment-delete-button">` (管理者のみ)

### ページャー

記事コンテンツの下に配置されます:

```html
<div class="pager pager-permalink permalink">
  <span class="prev-entry">前の記事へのリンク</span>
  <span class="next-entry">次の記事へのリンク</span>
</div>
```

* 前の記事がなければ`<span class="prev-entry">`は描画されません
* 次の記事がなければ`<span class="next-entry">`は描画されません

## アーカイブページ

### アーカイブ全体構造

```html
<div id="main">
  <div id="main-inner">
    <div class="archive-entries">
      <section class="archive-entry">...</section>
      <!-- アーカイブ記事分のsection要素 -->
    </div>
  </div>
</div>
```

### アーカイブ記事の構成要素

```html
<section class="archive-entry">
  <div class="archive-entry-header">
    <h1 class="entry-title">記事タイトル</h1>
    <div class="date archive-date">作成日付</div>
  </div>
  <div class="categories">
    <a class="archive-category-link">カテゴリー</a>
    <!-- 0-複数ありえる -->
  </div>
  <a class="entry-thumb-link">サムネイル</a>
  <div class="entry-body">
    <p class="entry-description">記事冒頭部分</p>
    <div class="archive-entry-tags-wrapper">タグラッパー</div>
    <span class="social-buttons">ソーシャルボタン</span>
  </div>
</section>
```

## アバウトページ

### アバウト全体構造

```html
<div id="main">
  <div id="main-inner">
    <article class="entry">
      <div class="entry-inner">
        <div class="entry-content">
          <!-- ユーザーが自由に記述したHTML -->
          <dl>
            <dt>プロフィール</dt>
            <dd>
              <a href="プロフィールリンク">
                <img>サムネイル画像
                <span>ユーザー名</span>
              </a>
              <a href="プロリンク">
                <i class="badge-type-pro">はてなブログPro</i>
              </a>
            </dd>
            <dt>ブログ投稿数</dt>
            <dd>n 記事</dd>
            <dt>ブログ投稿日数</dt>
            <dd>n 日</dd>
          </dl>
        </div>
      </div>
    </article>
  </div>
</div>
```

Note: 記事本文は、ユーザーが自由に記述できるため、HTMLの構造は決まっていません。ユーザーが自由に記述したHTMLがそのまま表示されます。
