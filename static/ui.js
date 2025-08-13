// Theme toggle and mobile navigation interactions
(function () {
  // Language preference helpers
  function canon(label) {
    if (!label) return '';
    const s = String(label).trim().toLowerCase();
    if (['node', 'nodejs', 'node.js', 'js', 'javascript'].includes(s)) return 'node.js';
    if (['py', 'python'].includes(s)) return 'python';
    if (['java'].includes(s)) return 'java';
    // Handle Go/Golang/Galang labels
    if (['go', 'golang', 'galang'].includes(s)) return 'go';
    return s;
  }

  function getPreferredLanguage() {
    try {
      const v = localStorage.getItem('preferred-language');
      return v || 'node.js';
    } catch (_) {
      return 'node.js';
    }
  }

  function setPreferredLanguage(value) {
    const c = canon(value);
    try { localStorage.setItem('preferred-language', c); } catch (_) {}
    const ev = new CustomEvent('preferred-language-changed', { detail: { value: c } });
    document.dispatchEvent(ev);
  }
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-color-scheme', theme);
    const toggle = document.getElementById('themeToggle');
    if (toggle) {
      const icon = toggle.querySelector('.theme-icon');
      if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
    try { sessionStorage.setItem('theme', theme); } catch (_) {}
  }

  function initTheme() {
    let saved = 'light';
    try { saved = sessionStorage.getItem('theme') || 'light'; } catch (_) {}
    applyTheme(saved);
  }

  function initToggle() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      const current = document.documentElement.getAttribute('data-color-scheme') || 'light';
      applyTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  function initSidebarToggle() {
    const btn = document.getElementById('sidebarToggle');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;
    
    // Load saved state
    let isCollapsed = false;
    try {
      isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    } catch (_) {}
    
    if (isCollapsed) {
      sidebar.classList.add('collapsed');
    }
    
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('collapsed');
      const collapsed = sidebar.classList.contains('collapsed');
      
      // Save state
      try {
        localStorage.setItem('sidebar-collapsed', collapsed.toString());
      } catch (_) {}
    });
  }

  function initMobileNav() {
    const btn = document.getElementById('mobileNavToggle');
    const sidebar = document.querySelector('.sidebar');
    if (!btn || !sidebar) return;
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      sidebar.classList.toggle('open');
    });
    document.addEventListener('click', function (e) {
      if (!e.target.closest('.sidebar') && !e.target.closest('#mobileNavToggle')) {
        sidebar.classList.remove('open');
      }
    });
  }

  function initLanguageSelect() {
    const select = document.getElementById('globalLanguageSelect');
    if (!select) return;
    // Set initial value from storage
    const pref = getPreferredLanguage();
    select.value = pref;
    select.addEventListener('change', function () {
      setPreferredLanguage(select.value);
    });
    // Keep the select in sync if user clicks a tab
    document.addEventListener('preferred-language-changed', function (e) {
      const val = e.detail && e.detail.value ? e.detail.value : getPreferredLanguage();
      if (select.value !== val) select.value = val;
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initToggle();
    initSidebarToggle();
    initMobileNav();
    initLanguageSelect();
  });
})();
