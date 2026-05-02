/* ── Mintt Shared JS — dark mode + auth nav ── */
(function () {
  'use strict';

  /* ── DARK MODE ── */
  var ROOT = document.documentElement;
  var STORAGE_KEY = 'mintt-theme';

  function applyTheme(dark) {
    ROOT.setAttribute('data-theme', dark ? 'dark' : 'light');
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.innerHTML = dark ? '☀️' : '🌙';
  }

  // Apply saved theme immediately (before paint)
  var saved = localStorage.getItem(STORAGE_KEY);
  var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved === 'dark' || (!saved && prefersDark));

  window.toggleTheme = function () {
    applyTheme(ROOT.getAttribute('data-theme') !== 'dark');
  };

  /* ── AUTH NAV STATE ── */
  function updateNavAuth() {
    var user = null;
    try { user = JSON.parse(localStorage.getItem('mintt-user')); } catch (e) {}
    var loginLink = document.getElementById('nav-login');
    var dashLink  = document.getElementById('nav-dashboard');
    var userPill  = document.getElementById('nav-user-pill');
    if (user && user.name) {
      if (loginLink)  loginLink.style.display  = 'none';
      if (dashLink)   dashLink.style.display   = 'inline-flex';
      if (userPill) { userPill.style.display   = 'inline-flex'; userPill.textContent = user.name.split(' ')[0]; }
    } else {
      if (loginLink)  loginLink.style.display  = 'inline-flex';
      if (dashLink)   dashLink.style.display   = 'none';
      if (userPill)   userPill.style.display   = 'none';
    }
  }

  window.minttLogout = function () {
    localStorage.removeItem('mintt-user');
    window.location.href = 'index.html';
  };

  document.addEventListener('DOMContentLoaded', function () {
    updateNavAuth();
    // Wire toggle button if present
    var btn = document.getElementById('theme-toggle');
    if (btn) btn.addEventListener('click', window.toggleTheme);
  });
})();
