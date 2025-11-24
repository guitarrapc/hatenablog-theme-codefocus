// @ts-check

/**
 * テストで使用する定数定義
 */

// テスト対象URL
export const TEST_URLS = {
  /** サンプル記事（目次あり） */
  SAMPLE_ARTICLE: '/entry/2025/05/10/204601',
  /** コードハイライト記事 */
  CODE_HIGHLIGHT: '/entry/2025/05/12/131258',
  /** アーカイブページ */
  ARCHIVE: '/archive/author/guitarrapc_tech',
  /** トップページ */
  HOME: '/',
};

// ビューポートサイズ
export const VIEWPORTS = {
  /** デスクトップ（大きめラップトップ） */
  DESKTOP: { width: 1440, height: 1440 },
  /** デスクトップ（標準） */
  DESKTOP_STANDARD: { width: 1280, height: 800 },
  /** タブレット（iPad Pro 12.9インチ） */
  TABLET: { width: 1024, height: 1366 },
  /** タブレット（標準） */
  TABLET_STANDARD: { width: 768, height: 1024 },
  /** スマートフォン（iPhone 14 Pro Max） */
  MOBILE: { width: 430, height: 932 },
  /** スマートフォン（標準） */
  MOBILE_STANDARD: { width: 414, height: 896 },
  /** Surface Pro 7 */
  SURFACE_PRO: { width: 912, height: 1368 },
};

// CSSセレクタ
export const SELECTORS = {
  // 記事関連
  ENTRY_TITLE: '.entry-title',
  ENTRY_CONTENT: '.entry-content',
  ENTRY_DATE: '.entry-date',
  ENTRY_CATEGORIES: '.entry-categories',
  ENTRY_HEADER: '.entry-header',

  // 目次関連
  TABLE_OF_CONTENTS: '.entry-content .table-of-contents',
  TOC_BUTTON: '.toc-button',
  FLOATING_TOC: '.floating-toc',
  FLOATING_TOC_SHOW: '.floating-toc.show',
  FLOATING_TOC_LIST: '.floating-toc-list',
  PAGE_TOP_BUTTON: '.floating-toc .page-top-button',

  // コードブロック関連
  CODE_BLOCK: 'pre.code',
  CODE_COPY_BUTTON: '.code-copy-button',

  // ダークモード関連
  THEME_TOGGLE_CONTAINER: '.theme-toggle-container',
  THEME_TOGGLE_MAIN: '.theme-toggle-main',

  // レイアウト関連
  CONTAINER: '#container',
  MAIN: '#main',
  BLOG_TITLE: '#title',
  TITLE: '#title',
  FOOTER: '#box2',
  BOX2: '#box2',

  // アーカイブ関連
  PAGE_ARCHIVE: '.page-archive',
  ARCHIVE_ENTRIES: '.archive-entries',
  ARCHIVE_ENTRY: '.archive-entry',
  ARCHIVE_ENTRY_HEADER: '.archive-entry-header',

  // フッター関連
  HATENA_MODULE_TITLE: '.hatena-module-title',

  // 関連記事
  RELATED_ENTRIES_MODULE: '.hatena-module.hatena-module-related-entries',
  HATENA_MODULE_RELATED_ENTRIES: '.hatena-module.hatena-module-related-entries',
  RELATED_ENTRIES_ITEM: '.related-entries-item',

  // コメント
  ENTRY_COMMENT: '.entry-comment',
  COMMENT_USER_NAME: '.comment-user-name',
  COMMENT_METADATA: '.comment-metadata',
};

// タイムアウト値（ミリ秒）
export const TIMEOUTS = {
  /** 短い待機（アニメーション） */
  SHORT: 1000,
  /** 中程度の待機 */
  MEDIUM: 2000,
  /** 長い待機（要素の表示） */
  LONG: 5000,
  /** 非常に長い待機（目次ボタンなど） */
  VERY_LONG: 15000,
};

// スクロール量
export const SCROLL = {
  /** 目次ボタンを表示するためのスクロール量 */
  TO_SHOW_TOC_BUTTON: 250,
  /** 目次ボタン表示の最小スクロール量 */
  MIN_FOR_TOC_BUTTON: 200,
  /** トップと判断するスクロール位置 */
  TOP_THRESHOLD: 100,
};

// その他の数値
export const VALUES = {
  /** カテゴリーとタイトルの最小距離（px） */
  MIN_CATEGORY_DISTANCE: 10,
  /** 記事ヘッダーと本文の最大余白（px） */
  MAX_HEADER_CONTENT_SPACE: 50,
  /** インデント許容誤差（px） */
  INDENT_TOLERANCE: 2,
  /** ホバー時のopacity閾値 */
  HOVER_OPACITY_THRESHOLD: 0.5,
  /** 非表示時のopacity閾値 */
  HIDDEN_OPACITY_THRESHOLD: 0.1,
};
