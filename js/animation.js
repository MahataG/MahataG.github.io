/**
 * animation.js — Scroll-driven animations, particles, typed text
 * Ganesh Mahata Portfolio | MahataG.github.io
 */

(function () {
  'use strict';

  /* ============================================================
     INTERSECTION OBSERVER — scroll reveal
     ============================================================ */
  function initScrollReveal() {
    const items = document.querySelectorAll(
      '.reveal, .reveal-left, .reveal-right, .reveal-scale'
    );
    if (!items.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // fire once
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );

    items.forEach(el => observer.observe(el));
  }

  /* ============================================================
     SKILL PROGRESS BARS
     ============================================================ */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar-fill');
    if (!bars.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const bar     = entry.target;
            const target  = bar.dataset.percent || '0';
            bar.style.width = target + '%';
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.5 }
    );

    bars.forEach(bar => observer.observe(bar));
  }

  /* ============================================================
     TYPED TEXT EFFECT
     ============================================================ */
  function initTyped() {
    const el = document.querySelector('.typed-text');
    if (!el) return;

    const phrases = el.dataset.phrases
      ? JSON.parse(el.dataset.phrases)
      : [
          'B.Tech Student at IIT Delhi',
          'Biotechnology Enthusiast',
          'Embedded Systems Developer',
          'IoT & Automation Builder',
          'Full Stack Web Developer',
          'AI & ML Learner',
          'Open Source Contributor',
        ];

    let phIdx  = 0;
    let chIdx  = 0;
    let deleting = false;
    const TYPING_SPEED  = 75;
    const ERASE_SPEED   = 40;
    const PAUSE_AFTER   = 2200;
    const PAUSE_BEFORE  = 400;

    function type() {
      const current = phrases[phIdx];

      if (!deleting) {
        // Typing
        el.textContent = current.slice(0, chIdx + 1);
        chIdx++;

        if (chIdx === current.length) {
          // Pause then start deleting
          setTimeout(() => { deleting = true; type(); }, PAUSE_AFTER);
          return;
        }
        setTimeout(type, TYPING_SPEED);
      } else {
        // Erasing
        el.textContent = current.slice(0, chIdx - 1);
        chIdx--;

        if (chIdx === 0) {
          deleting = false;
          phIdx = (phIdx + 1) % phrases.length;
          setTimeout(type, PAUSE_BEFORE);
          return;
        }
        setTimeout(type, ERASE_SPEED);
      }
    }

    type();
  }

  /* ============================================================
     COUNTER ANIMATION (hero stats)
     ============================================================ */
  function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const el      = entry.target;
          const target  = parseInt(el.dataset.count, 10);
          const suffix  = el.dataset.suffix || '';
          const duration = 1600;
          const start   = performance.now();

          function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const ease = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target) + suffix;
            if (progress < 1) requestAnimationFrame(update);
          }

          requestAnimationFrame(update);
          observer.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach(el => observer.observe(el));
  }

  /* ============================================================
     PARTICLES CANVAS
     ============================================================ */
  function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;

    const ctx    = canvas.getContext('2d');
    let   W, H, particles = [], animId;

    function resize() {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    }

    function createParticle() {
      return {
        x:  Math.random() * W,
        y:  Math.random() * H,
        r:  Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        o:  Math.random() * 0.4 + 0.15,
      };
    }

    function getColor() {
      const dark = document.documentElement.getAttribute('data-theme') === 'dark';
      return dark ? '140, 144, 255' : '99, 102, 241';
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      const color = getColor();
      const CON_DIST = 120;

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        // Draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color}, ${p.o})`;
        ctx.fill();

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const q  = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d  = Math.sqrt(dx * dx + dy * dy);

          if (d < CON_DIST) {
            const alpha = (1 - d / CON_DIST) * 0.15;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(${color}, ${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      });

      animId = requestAnimationFrame(draw);
    }

    // Init
    resize();
    const COUNT = Math.min(60, Math.floor((W * H) / 18000));
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());

    draw();
    window.addEventListener('resize', () => { resize(); });

    // Pause when not visible (performance)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        draw();
      }
    });
  }

  /* ============================================================
     TILT EFFECT on cards
     ============================================================ */
  function initTilt() {
    const cards = document.querySelectorAll('.project-card, .research-card');
    const MAX   = 8; // max tilt degrees

    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const dx    = (e.clientX - cx) / (rect.width  / 2);
        const dy    = (e.clientY - cy) / (rect.height / 2);
        card.style.transform = `perspective(800px) rotateY(${dx * MAX}deg) rotateX(${-dy * MAX}deg) translateZ(8px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  /* ============================================================
     FLOATING LABELS on form inputs
     ============================================================ */
  function initFormAnimations() {
    const controls = document.querySelectorAll('.form-control');
    controls.forEach(ctrl => {
      ctrl.addEventListener('focus', () => ctrl.classList.add('focused'));
      ctrl.addEventListener('blur',  () => ctrl.classList.remove('focused'));
    });
  }

  /* ============================================================
     CURSOR SPARKLE (subtle)
     ============================================================ */
  function initCursorSparkle() {
    if (window.matchMedia('(hover: none)').matches) return; // skip touch

    const sparkles = [];
    const MAX_SPARKLES = 12;

    document.addEventListener('mousemove', e => {
      if (Math.random() > 0.3) return; // only some moves

      const spark = document.createElement('div');
      spark.className = 'cursor-spark';
      spark.style.cssText = `
        position: fixed;
        left: ${e.clientX}px;
        top:  ${e.clientY}px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: var(--primary);
        pointer-events: none;
        z-index: 9998;
        transition: transform 0.5s ease, opacity 0.5s ease;
        transform: translate(-50%, -50%) scale(1);
        opacity: 0.6;
      `;
      document.body.appendChild(spark);
      sparkles.push(spark);

      if (sparkles.length > MAX_SPARKLES) {
        const old = sparkles.shift();
        if (old.parentNode) old.parentNode.removeChild(old);
      }

      requestAnimationFrame(() => {
        spark.style.transform  = 'translate(-50%, -50%) scale(0)';
        spark.style.opacity    = '0';
      });

      setTimeout(() => {
        if (spark.parentNode) spark.parentNode.removeChild(spark);
      }, 500);
    });
  }

  /* ============================================================
     ACTIVE NAV LINK HIGHLIGHT based on scroll position
     ============================================================ */
  function initActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const navLinks = document.querySelectorAll('.nav-link[href]');
    const mobLinks = document.querySelectorAll('.mobile-nav-link[href]');

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          [...navLinks, ...mobLinks].forEach(link => {
            const href = link.getAttribute('href');
            if (href === '#' + id || href.endsWith('#' + id)) {
              link.classList.add('active');
            } else {
              link.classList.remove('active');
            }
          });
        });
      },
      { threshold: 0.35 }
    );

    sections.forEach(s => observer.observe(s));
  }

  /* ============================================================
     PROJECT CARD FILTER
     ============================================================ */
  function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const cards      = document.querySelectorAll('.project-card[data-category]');
    if (!filterBtns.length) return;

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        cards.forEach(card => {
          if (filter === 'all' || card.dataset.category === filter) {
            card.style.display = '';
            card.classList.remove('hidden-card');
          } else {
            card.classList.add('hidden-card');
            setTimeout(() => {
              if (card.classList.contains('hidden-card')) {
                card.style.display = 'none';
              }
            }, 300);
          }
        });
      });
    });
  }

  /* ============================================================
     SMOOTH PAGE TRANSITION FADE
     ============================================================ */
  function initPageTransitions() {
    document.querySelectorAll('a[href]').forEach(a => {
      const href = a.getAttribute('href');
      // Only internal links, skip anchors and external
      if (!href || href.startsWith('#') || href.startsWith('http') ||
          href.startsWith('mailto') || href.startsWith('tel') ||
          a.target === '_blank') return;

      a.addEventListener('click', e => {
        e.preventDefault();
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.25s ease';
        setTimeout(() => {
          window.location.href = href;
        }, 250);
      });
    });
  }

  /* ============================================================
     INIT ALL
     ============================================================ */
  function init() {
    initScrollReveal();
    initSkillBars();
    initTyped();
    initCounters();
    initParticles();
    initTilt();
    initFormAnimations();
    initActiveNav();
    initProjectFilter();
    // Cursor sparkle — nice-to-have, enable if desired
    // initCursorSparkle();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Re-run scroll reveal after theme change (colors may affect observer)
  document.addEventListener('themechange', () => {
    initScrollReveal();
  });

})();
