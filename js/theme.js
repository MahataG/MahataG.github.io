/**
 * theme.js — Dark / Light Mode Theme Manager
 * Ganesh Mahata Portfolio | MahataG.github.io
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'gm-theme';
  const DARK        = 'dark';
  const LIGHT       = 'light';

  // ── Detect system preference ──────────────────────────────────
  const prefersDark = () =>
    window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  // ── Get stored preference or system default ────────────────────
  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === DARK || stored === LIGHT) return stored;
    return prefersDark() ? DARK : LIGHT;
  }

  // ── Apply theme to <html> ──────────────────────────────────────
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateToggleIcons(theme);
    updateMetaTheme(theme);
  }

  // ── Save preference ────────────────────────────────────────────
  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (_) { /* ignore */ }
  }

  // ── Update all toggle button icons ────────────────────────────
  function updateToggleIcons(theme) {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      const sun  = btn.querySelector('.icon-sun');
      const moon = btn.querySelector('.icon-moon');
      if (sun)  sun.style.display  = theme === DARK  ? 'flex' : 'none';
      if (moon) moon.style.display = theme === LIGHT ? 'flex' : 'none';
      btn.setAttribute('aria-label',
        theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title',
        theme === DARK ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  // ── Update <meta name="theme-color"> ─────────────────────────
  function updateMetaTheme(theme) {
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'theme-color';
      document.head.appendChild(meta);
    }
    meta.content = theme === DARK ? '#0d0f17' : '#f8fafc';
  }

  // ── Toggle between dark and light ────────────────────────────
  function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme') || LIGHT;
    const next    = current === DARK ? LIGHT : DARK;
    applyTheme(next);
    saveTheme(next);

    // Dispatch custom event so other scripts can react
    document.dispatchEvent(new CustomEvent('themechange', { detail: { theme: next } }));
  }

  // ── Bind all toggle buttons ───────────────────────────────────
  function bindToggles() {
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });
  }

  // ── Watch system preference changes ──────────────────────────
  function watchSystem() {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    mq.addEventListener('change', e => {
      // Only auto-switch if user hasn't manually chosen
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? DARK : LIGHT);
      }
    });
  }

  // ── Init ──────────────────────────────────────────────────────
  function init() {
    const theme = getPreferred();
    applyTheme(theme);

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        bindToggles();
        watchSystem();
      });
    } else {
      bindToggles();
      watchSystem();
    }
  }

  // Expose globally so other scripts can call ThemeManager.toggle()
  window.ThemeManager = { toggle: toggleTheme, apply: applyTheme };

  // Run immediately to avoid FOUC (flash of wrong theme)
  init();
})();
