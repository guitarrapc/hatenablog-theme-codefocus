/**
 * ダークモード切り替え機能
 * ユーザーがテーマを切り替えられるボタンを提供
 */
(function () {
  // 既存のdarkModeJsが存在する場合は処理をスキップ
  if (window.darkModeJs) {
    console.log('Dark mode JS already initialized');
    return;
  }

  // テーマの定数
  const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    AUTO: 'auto'
  };

  // SVGアイコンの定義
  const ICONS = {
    SUN: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`,
    MOON: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`,
    MONITOR: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect><line x1="8" y1="21" x2="16" y2="21"></line><line x1="12" y1="17" x2="12" y2="21"></line></svg>`
  };

  // ローカルストレージキー
  const STORAGE_KEY = 'codefocus-theme-preference';

  // 現在のテーマを取得
  function getCurrentTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme && [THEMES.LIGHT, THEMES.DARK, THEMES.AUTO].includes(savedTheme)) {
      return savedTheme;
    }
    return THEMES.AUTO; // デフォルトはシステム設定に合わせる
  }

  // テーマを適用
  function applyTheme(theme) {
    if (theme === THEMES.AUTO) {
      // システム設定に合わせる場合は、data-theme属性を削除
      document.documentElement.removeAttribute('data-theme');
    } else {
      // 明示的なテーマの場合は、data-theme属性を設定
      document.documentElement.setAttribute('data-theme', theme);
    }

    // ローカルストレージに保存
    localStorage.setItem(STORAGE_KEY, theme);
  }

  // テーマ切り替えボタンのコンテナを作成
  function createThemeSwitcher() {
    const container = document.createElement('div');
    container.className = 'theme-switch-container';

    // ライトモードボタン
    const lightButton = document.createElement('button');
    lightButton.className = 'theme-switch-button';
    lightButton.title = 'ライトモード';
    lightButton.innerHTML = ICONS.SUN;
    lightButton.addEventListener('click', () => {
      applyTheme(THEMES.LIGHT);
      updateActiveButtonStyle();
    });

    // ダークモードボタン
    const darkButton = document.createElement('button');
    darkButton.className = 'theme-switch-button';
    darkButton.title = 'ダークモード';
    darkButton.innerHTML = ICONS.MOON;
    darkButton.addEventListener('click', () => {
      applyTheme(THEMES.DARK);
      updateActiveButtonStyle();
    });

    // システム設定ボタン
    const autoButton = document.createElement('button');
    autoButton.className = 'theme-switch-button';
    autoButton.title = 'システム設定に合わせる';
    autoButton.innerHTML = ICONS.MONITOR;
    autoButton.addEventListener('click', () => {
      applyTheme(THEMES.AUTO);
      updateActiveButtonStyle();
    });

    // アクティブなボタンのスタイルを更新する関数
    function updateActiveButtonStyle() {
      const currentTheme = getCurrentTheme();

      // すべてのボタンからアクティブスタイルをクリア
      [lightButton, darkButton, autoButton].forEach(btn => {
        btn.style.opacity = '0.6';
        btn.style.transform = 'scale(1)';
      });

      // 現在のテーマに合わせてアクティブスタイルを適用
      switch (currentTheme) {
        case THEMES.LIGHT:
          lightButton.style.opacity = '1';
          lightButton.style.transform = 'scale(1.1)';
          break;
        case THEMES.DARK:
          darkButton.style.opacity = '1';
          darkButton.style.transform = 'scale(1.1)';
          break;
        case THEMES.AUTO:
          autoButton.style.opacity = '1';
          autoButton.style.transform = 'scale(1.1)';
          break;
      }
    }

    // ボタンをコンテナに追加
    container.appendChild(lightButton);
    container.appendChild(darkButton);
    container.appendChild(autoButton);

    // 初期状態のアクティブボタンスタイルを適用
    updateActiveButtonStyle();

    return container;
  }

  // 初期化処理
  function initialize() {
    // 現在のテーマを適用
    applyTheme(getCurrentTheme());

    // テーマ切り替えUIを追加
    const switcher = createThemeSwitcher();
    document.body.appendChild(switcher);
  }

  // DOMContentLoaded後に初期化
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // グローバルオブジェクトに登録
  window.darkModeJs = {
    applyTheme,
    getCurrentTheme,
  };
})();
