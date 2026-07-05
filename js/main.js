/**
 * main.js — Core site utilities
 * Ganesh Mahata Portfolio | MahataG.github.io
 *
 * Handles:
 *   - Page loader / fade-in
 *   - Navbar scroll effects
 *   - Mobile nav drawer
 *   - Back-to-top button
 *   - Smooth anchor scrolling
 *   - Active nav link on page load
 *   - Contact form validation & submission
 *   - Toast notifications
 *   - Clipboard copy
 *   - Keyboard accessibility (Escape key)
 */

(function () {
  'use strict';

  /* ============================================================
     UTILITIES
     ============================================================ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  function on(el, evt, fn, opts) {
    if (!el) return;
    el.addEventListener(evt, fn, opts);
  }

  /* ============================================================
     PAGE LOADER
     ============================================================ */
  function initLoader() {
    const loader = $('#page-loader');
    if (!loader) return;

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.opacity = '1';
      }, 400);
    });
  }

  /* ============================================================
     BODY FADE-IN
     ============================================================ */
  function initFadeIn() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.45s ease';

    window.addEventListener('load', () => {
      setTimeout(() => {
        document.body.style.opacity = '1';
      }, 100);
    });
  }

  /* ============================================================
     NAVBAR — scroll class + transparent→solid
     ============================================================ */
  function initNavbar() {
    const navbar = $('.navbar');
    if (!navbar) return;

    let lastY = 0;

    function handleScroll() {
      const y = window.scrollY;
      navbar.classList.toggle('scrolled', y > 20);

      // Hide on scroll down, show on scroll up (optional UX)
      // navbar.classList.toggle('nav-hidden', y > lastY && y > 100);
      lastY = y;
    }

    on(window, 'scroll', handleScroll, { passive: true });
    handleScroll(); // initial
  }

  /* ============================================================
     MOBILE NAV DRAWER
     ============================================================ */
  function initMobileNav() {
    const hamburger = $('#hamburger');
    const mobileNav = $('#mobile-nav');
    if (!hamburger || !mobileNav) return;

    function open() {
      hamburger.classList.add('open');
      mobileNav.classList.add('open');
      document.body.classList.add('no-scroll');
      hamburger.setAttribute('aria-expanded', 'true');
    }

    function close() {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.classList.remove('no-scroll');
      hamburger.setAttribute('aria-expanded', 'false');
    }

    function toggle() {
      mobileNav.classList.contains('open') ? close() : open();
    }

    on(hamburger, 'click', toggle);

    // Close when a mobile link is clicked
    $$('.mobile-nav-link').forEach(link =>
      on(link, 'click', close)
    );

    // Close on backdrop click
    on(document, 'click', e => {
      if (mobileNav.classList.contains('open') &&
          !mobileNav.contains(e.target) &&
          !hamburger.contains(e.target)) {
        close();
      }
    });

    // Escape key
    on(document, 'keydown', e => {
      if (e.key === 'Escape') close();
    });
  }

  /* ============================================================
     ACTIVE NAV LINK — mark current page
     ============================================================ */
  function initActiveNavPage() {
    const path = window.location.pathname;
    $$('.nav-link, .mobile-nav-link, .footer-link').forEach(link => {
      const href = link.getAttribute('href') || '';
      // Match exact or same file name
      const isHome   = (href === './' || href === '../' || href === '/' || href === 'index.html');
      const isActive = href && (
        path.endsWith(href) ||
        (isHome && (path === '/' || path.endsWith('/index.html') || path.endsWith('/')))
      );
      if (isActive) link.classList.add('active');
    });
  }

  /* ============================================================
     BACK TO TOP
     ============================================================ */
  function initBackToTop() {
    const btn = $('#back-to-top');
    if (!btn) return;

    on(window, 'scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    on(btn, 'click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ============================================================
     SMOOTH ANCHOR SCROLLING
     ============================================================ */
  function initSmoothAnchors() {
    $$('a[href^="#"]').forEach(a => {
      on(a, 'click', e => {
        const id  = a.getAttribute('href').slice(1);
        const target = document.getElementById(id);
        if (!target) return;
        e.preventDefault();

        const navH = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-height'), 10
        ) || 72;

        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      });
    });
  }

  /* ============================================================
     TOAST NOTIFICATIONS
     ============================================================ */
  function showToast(msg, icon = '✅', duration = 3500) {
    let toast = $('#site-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'site-toast';
      toast.className = 'toast';
      toast.innerHTML = `<span class="toast-icon"></span><span class="toast-msg"></span>`;
      document.body.appendChild(toast);
    }

    toast.querySelector('.toast-icon').textContent = icon;
    toast.querySelector('.toast-msg').textContent  = msg;
    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), duration);
  }

  window.showToast = showToast; // expose globally

  /* ============================================================
     CONTACT FORM
     ============================================================ */
  function initContactForm() {
    const form = $('#contact-form');
    if (!form) return;

    on(form, 'submit', async e => {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      const status    = form.querySelector('.form-status');

      const data = {
        name:    form.querySelector('#name')?.value.trim()    || '',
        email:   form.querySelector('#email')?.value.trim()   || '',
        subject: form.querySelector('#subject')?.value.trim() || '',
        message: form.querySelector('#message')?.value.trim() || '',
      };

      // Basic validation
      if (!data.name || !data.email || !data.message) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = '⚠️ Please fill in all required fields.';
        }
        return;
      }

      const emailRx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRx.test(data.email)) {
        if (status) {
          status.className = 'form-status error';
          status.textContent = '⚠️ Please enter a valid email address.';
        }
        return;
      }

      // Disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (status) status.className = 'form-status';

      /* ── Formspree / mailto fallback ──
         To use Formspree: replace YOUR_FORM_ID with your actual ID.
         Otherwise, this gracefully opens mailto.
      */
      const FORMSPREE_ID = 'YOUR_FORM_ID'; // ← replace this

      if (FORMSPREE_ID !== 'YOUR_FORM_ID') {
        try {
          const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
            body: JSON.stringify(data),
          });

          if (res.ok) {
            if (status) {
              status.className = 'form-status success';
              status.textContent = '✅ Message sent! I\'ll get back to you soon.';
            }
            form.reset();
            showToast('Message sent successfully!', '📬');
          } else {
            throw new Error('Server error');
          }
        } catch (_) {
          if (status) {
            status.className = 'form-status error';
            status.textContent = '❌ Something went wrong. Please try again.';
          }
        }
      } else {
        // Mailto fallback
        const subject = encodeURIComponent(data.subject || 'Portfolio Contact');
        const body    = encodeURIComponent(
          `Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`
        );
        window.location.href = `mailto:your@email.com?subject=${subject}&body=${body}`;

        if (status) {
          status.className = 'form-status success';
          status.textContent = '✅ Opening your email client…';
        }
        showToast('Opening your email app…', '📧');
      }

      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
      }
    });
  }

  /* ============================================================
     CLIPBOARD COPY (for email, etc.)
     ============================================================ */
  function initCopyButtons() {
    $$('[data-copy]').forEach(btn => {
      on(btn, 'click', () => {
        const text = btn.dataset.copy;
        navigator.clipboard.writeText(text).then(() => {
          showToast(`Copied: ${text}`, '📋');
        }).catch(() => {
          showToast('Copy not supported', '⚠️');
        });
      });
    });
  }

  /* ============================================================
     RESUME DOWNLOAD BUTTON
     ============================================================ */
  function initResumeBtn() {
    $$('[data-resume-download]').forEach(btn => {
      on(btn, 'click', () => {
        showToast('Downloading resume…', '📄');
      });
    });
  }

  /* ============================================================
     LAZY-LOAD IMAGES
     ============================================================ */
  function initLazyImages() {
    const imgs = $$('img[data-src]');
    if (!imgs.length || !('IntersectionObserver' in window)) {
      imgs.forEach(img => { img.src = img.dataset.src; });
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img   = entry.target;
          img.src     = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });

    imgs.forEach(img => observer.observe(img));
  }

  /* ============================================================
     KEYBOARD ACCESSIBILITY
     ============================================================ */
  function initA11y() {
    // Add focus-visible class for keyboard navigation
    document.addEventListener('keydown', e => {
      if (e.key === 'Tab') document.body.classList.add('keyboard-nav');
    });
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-nav');
    });
  }

  /* ============================================================
     CURRENT YEAR in footer
     ============================================================ */
  function initYear() {
    $$('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  function init() {
    initLoader();
    initNavbar();
    initMobileNav();
    initActiveNavPage();
    initBackToTop();
    initSmoothAnchors();
    initContactForm();
    initCopyButtons();
    initResumeBtn();
    initLazyImages();
    initA11y();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Fade-in: run before DOMContentLoaded to start early
  initFadeIn();

})();
