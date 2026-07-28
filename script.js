/* ═══════════════════════════════════════════════════════════════
   Ali Akbar Portfolio — script.js (PERFORMANCE-OPTIMIZED)
   Same visuals & behavior as original. Changes are purely internal:
   - rAF-batched cursor + scroll handling (no per-event style writes)
   - cached getBoundingClientRect for eye tracking (updated on
     resize/scroll instead of every single mousemove)
   - merged nav + scroll-progress into one throttled scroll handler
   - passive event listeners where no preventDefault is needed
   - starfield pauses when tab is hidden (saves CPU/battery)
═══════════════════════════════════════════════════════════════ */

// ─────────────────────────────────────────────────────────────
// INIT ALL
// ─────────────────────────────────────────────────────────────
function initAll() {
  try { initLoader();            } catch(e) { console.warn('loader',     e); }
  try { initCursor();            } catch(e) { console.warn('cursor',     e); }
  try { initStarfield();         } catch(e) { console.warn('starfield',  e); }
  try { initScrollHandlers();    } catch(e) { console.warn('scroll',     e); }
  try { initMobileMenu();        } catch(e) { console.warn('mm',         e); }
  try { initTypewriter();        } catch(e) { console.warn('typewriter', e); }
  try { initHoverEffects();      } catch(e) { console.warn('hover',      e); }
  try { initEyeTracking();       } catch(e) { console.warn('eyes',       e); }
  try { initProjectCarousel();   } catch(e) { console.warn('carousel',   e); }
  try { initCarouselBlueprint(); } catch(e) { console.warn('blueprint',  e); }
  try { initFormHandler();       } catch(e) { console.warn('form',       e); }
}

// ─────────────────────────────────────────────────────────────
// LOADER
// ─────────────────────────────────────────────────────────────
function initLoader() {
  const loader = document.getElementById('loader');
  const bar = document.getElementById('ld-bar');
  const pct = document.getElementById('ld-pct');

  if (!loader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 30;
    if (progress > 100) progress = 100;

    if (bar) bar.style.width = progress + '%';
    if (pct) pct.textContent = Math.floor(progress).toString().padStart(3, '0');

    if (progress >= 100) {
      clearInterval(interval);
      setTimeout(() => {
        loader.style.opacity = '0';
        loader.style.pointerEvents = 'none';
      }, 400);
    }
  }, 100);
}

// ─────────────────────────────────────────────────────────────
// CUSTOM CURSOR — rAF-batched (no direct style writes per event)
// ─────────────────────────────────────────────────────────────
function initCursor() {
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let scheduled = false;

  function paint() {
    scheduled = false;
    dot.style.left = mouseX - 2.5 + 'px';
    dot.style.top = mouseY - 2.5 + 'px';
    ring.style.left = mouseX - 15 + 'px';
    ring.style.top = mouseY - 15 + 'px';
  }

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(paint);
    }
  }, { passive: true });

  document.addEventListener('mousedown', () => {
    ring.classList.add('clk');
  }, { passive: true });

  document.addEventListener('mouseup', () => {
    ring.classList.remove('clk');
  }, { passive: true });

  document.querySelectorAll('[data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hov'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
  });
}

// ─────────────────────────────────────────────────────────────
// STARFIELD BACKGROUND — pauses when tab is hidden
// ─────────────────────────────────────────────────────────────
function initStarfield() {
  const canvas = document.getElementById('stars-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const stars = [];
  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
      op: Math.random() * 0.5 + 0.2,
      spd: Math.random() * 0.3
    });
  }

  let rafId = null;
  let running = false;

  function draw() {
    ctx.fillStyle = 'rgba(13, 12, 10, 1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach(star => {
      ctx.fillStyle = `rgba(201, 168, 76, ${star.op})`;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
      ctx.fill();

      star.op += star.spd;
      if (star.op > 0.8 || star.op < 0.2) star.spd *= -1;
    });

    rafId = requestAnimationFrame(draw);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(draw);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  start();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }, 150);
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// NAV + SCROLL PROGRESS — merged into one throttled scroll handler
// ─────────────────────────────────────────────────────────────
function initScrollHandlers() {
  const nav = document.getElementById('nav');
  const track = document.getElementById('sp');

  if (!nav && !track) return;

  let cachedScrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  let ticking = false;

  function recalcHeight() {
    cachedScrollHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  }

  function update() {
    ticking = false;
    const y = window.scrollY;

    if (nav) {
      if (y > 50) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    }

    if (track) {
      const scrolled = (y / cachedScrollHeight) * 100;
      track.style.width = scrolled + '%';
    }
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(recalcHeight, 150);
  }, { passive: true });

  // Smooth-scroll nav links (unchanged behavior)
  document.querySelectorAll('nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  update();
}

// ─────────────────────────────────────────────────────────────
// MOBILE MENU
// ─────────────────────────────────────────────────────────────
function initMobileMenu() {
  const ham = document.getElementById('nav-ham');
  const menu = document.getElementById('mob-menu');

  if (!ham || !menu) return;

  ham.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    ham.setAttribute('aria-expanded', isOpen);
  });

  document.querySelectorAll('#mob-menu a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !ham.contains(e.target)) {
      menu.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
    }
  });
}

// ─────────────────────────────────────────────────────────────
// TYPEWRITER EFFECT
// ─────────────────────────────────────────────────────────────
function initTypewriter() {
  const ttext = document.getElementById('ttext');
  if (!ttext) return;

  const roles = [
    'Full-Stack Engineer',
    'AI/ML Enthusiast',
    'System Architect',
    'Data Scientist'
  ];

  let roleIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const role = roles[roleIdx];
    if (isDeleting) {
      ttext.textContent = role.substring(0, charIdx - 1);
      charIdx--;
    } else {
      ttext.textContent = role.substring(0, charIdx + 1);
      charIdx++;
    }

    if (!isDeleting && charIdx === role.length) {
      isDeleting = true;
      setTimeout(type, 2000);
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      roleIdx = (roleIdx + 1) % roles.length;
      setTimeout(type, 500);
    } else {
      setTimeout(type, 50);
    }
  }

  type();
}

// ─────────────────────────────────────────────────────────────
// HOVER EFFECTS
// ─────────────────────────────────────────────────────────────
function initHoverEffects() {
  document.querySelectorAll('[data-hover]').forEach(el => {
    el.style.cursor = 'pointer';
  });
}

// ─────────────────────────────────────────────────────────────
// ROBOT EYE TRACKING — cached bounding rect (updated on
// resize/scroll instead of forcing layout on every mousemove)
// ─────────────────────────────────────────────────────────────
function initEyeTracking() {
  const svg = document.getElementById('robot-svg');
  if (!svg) return;

  const leftEls = ['pupil-L-glow','pupil-L-ring','pupil-L','pupil-L-dot']
    .map(id => document.getElementById(id)).filter(Boolean);
  const rightEls = ['pupil-R-glow','pupil-R-ring','pupil-R','pupil-R-dot']
    .map(id => document.getElementById(id)).filter(Boolean);

  if (!leftEls.length || !rightEls.length) return;

  const EYE_L = { x: 138, y: 120 };
  const EYE_R = { x: 202, y: 120 };
  const VB_W = 340, VB_H = 460;
  const MAX_OFFSET = 7;

  const leftOrigins = leftEls.map(el => ({
    cx: parseFloat(el.getAttribute('cx')),
    cy: parseFloat(el.getAttribute('cy'))
  }));
  const rightOrigins = rightEls.map(el => ({
    cx: parseFloat(el.getAttribute('cx')),
    cy: parseFloat(el.getAttribute('cy'))
  }));

  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let rafId = null;

  // Cache the SVG's bounding rect instead of measuring on every mousemove.
  let rect = svg.getBoundingClientRect();
  function refreshRect() { rect = svg.getBoundingClientRect(); }
  refreshRect();

  window.addEventListener('resize', refreshRect, { passive: true });
  window.addEventListener('scroll', refreshRect, { passive: true });

  function applyOffset() {
    for (let i = 0; i < leftEls.length; i++) {
      leftEls[i].setAttribute('cx', leftOrigins[i].cx + currentX);
      leftEls[i].setAttribute('cy', leftOrigins[i].cy + currentY);
    }
    for (let i = 0; i < rightEls.length; i++) {
      rightEls[i].setAttribute('cx', rightOrigins[i].cx + currentX);
      rightEls[i].setAttribute('cy', rightOrigins[i].cy + currentY);
    }
  }

  function tick() {
    currentX += (targetX - currentX) * 0.18;
    currentY += (targetY - currentY) * 0.18;

    if (Math.abs(targetX - currentX) < 0.05) currentX = targetX;
    if (Math.abs(targetY - currentY) < 0.05) currentY = targetY;

    applyOffset();

    if (currentX !== targetX || currentY !== targetY) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = null;
    }
  }

  function startTick() {
    if (!rafId) rafId = requestAnimationFrame(tick);
  }

  document.addEventListener('mousemove', (e) => {
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    if (rect.width === 0 || rect.height === 0) return;

    const scaleX = rect.width / VB_W;
    const scaleY = rect.height / VB_H;

    const midSvgX = (EYE_L.x + EYE_R.x) / 2;
    const midSvgY = (EYE_L.y + EYE_R.y) / 2;
    const midScreenX = rect.left + midSvgX * scaleX;
    const midScreenY = rect.top  + midSvgY * scaleY;

    const dx = e.clientX - midScreenX;
    const dy = e.clientY - midScreenY;
    const dist = Math.min(MAX_OFFSET, Math.hypot(dx, dy) / 60);
    const angle = Math.atan2(dy, dx);

    targetX = Math.cos(angle) * dist;
    targetY = Math.sin(angle) * dist;
    startTick();
  }, { passive: true });
}

// ─────────────────────────────────────────────────────────────
// PROJECT CAROUSEL — SCROLL-JACKING (PIN + HORIZONTAL TRANSLATE)
// ─────────────────────────────────────────────────────────────
function initProjectCarousel() {
  const wrap = document.querySelector('.proj-carousel-wrap');
  const carousel = document.querySelector('.proj-carousel');
  if (!wrap || !carousel) return;

  const hint = document.querySelector('.carousel-hint');
  let hintHidden = false;

  function hideHint() {
    if (hintHidden || !hint) return;
    hintHidden = true;
    hint.style.opacity = '0';
    hint.style.pointerEvents = 'none';
  }

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  // ── Fallback: native horizontal scroll for touch / no-GSAP ──
  if (isTouch || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
    let hasScrolled = false;
    carousel.addEventListener('scroll', () => {
      if (!hasScrolled) { hideHint(); hasScrolled = true; }
    }, { passive: true });

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      const r = carousel.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const dir = e.key === 'ArrowLeft' ? -1 : 1;
      carousel.scrollBy({ left: dir * 400, behavior: 'smooth' });
    });
    return;
  }

  // ── Scroll-jacking mode: pin wrap, translate carousel horizontally ──
  gsap.registerPlugin(ScrollTrigger);

  carousel.style.overflow = 'visible';
  carousel.style.overflowX = 'visible';

  const getDistance = () => Math.max(0, carousel.scrollWidth - carousel.offsetWidth);

  gsap.to(carousel, {
    x: () => -getDistance(),
    ease: 'none',
    scrollTrigger: {
      trigger: wrap,
      start: 'top top',
      end: () => `+=${getDistance()}`,
      pin: true,
      scrub: 1,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onUpdate: () => hideHint()
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const r = wrap.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const dir = e.key === 'ArrowLeft' ? -1 : 1;
    window.scrollBy({ top: dir * 320, behavior: 'smooth' });
  });
}

// ─────────────────────────────────────────────────────────────
// CAROUSEL BLUEPRINT PANEL
// ─────────────────────────────────────────────────────────────
function initCarouselBlueprint() {
  const cards = document.querySelectorAll('.proj-card');
  const panel = document.getElementById('bp-panel');
  const bpTitle = document.getElementById('bp-title');
  const bpTech = document.getElementById('bp-tech');
  const bpOv = document.getElementById('bp-ov');
  const bpGit = document.getElementById('bp-git');
  const bpClose = document.getElementById('bp-close');

  if (!panel) return;

  const projectData = {
    'Sidekick Child Development Centre': {
      desc: 'A full-stack healthcare web platform featuring dynamic intake & screening forms, responsive UI assets, and custom Node.js/cPanel SSR deployment with enterprise-grade security.',
      tags: ['Next.js', 'React', 'Node.js', 'cPanel', 'Healthcare', 'Full-Stack'],
      github: 'https://github.com/akbarabidi1-aa'
    },
    'AI Research Paper Analyzer': {
      desc: 'Summarizes and cross-references academic papers using an ASP.NET Core API and a Python NLP pipeline deployed on Azure with advanced vector embeddings.',
      tags: ['ASP.NET Core', 'Python', 'Azure', 'NLP', 'Machine Learning', 'API'],
      github: 'https://github.com/akbarabidi1-aa'
    },
    'Doctor–Patient System': {
      desc: 'Appointment and records platform built on ASP.NET MVC with a lightweight ML triage suggestion module for predictive healthcare.',
      tags: ['ASP.NET MVC', 'C#', 'Machine Learning', 'Healthcare', 'Database', 'UI/UX'],
      github: 'https://github.com/akbarabidi1-aa'
    },
    'Stock Price Prediction System': {
      desc: 'ML trained on Apple & Meta historical data using LSTM and LinearRegression with smart caching and hybrid AI chat engine for trading insights.',
      tags: ['Python', 'LSTM', 'Machine Learning', 'Time-Series', 'yfinance', 'Data Science'],
      github: 'https://github.com/akbarabidi1-aa'
    },
    'Student Management System': {
      desc: 'Classic OOP CRUD system in Java for managing student records, grades, and attendance with enterprise-grade architecture and relational database design.',
      tags: ['Java', 'OOP', 'CRUD', 'Database', 'GUI', 'Enterprise'],
      github: 'https://github.com/akbarabidi1-aa'
    }
  };

  function openBlueprint(card) {
    const title = card.querySelector('.proj-card-title')?.textContent || 'Project';
    const data = projectData[title] || {
      desc: card.querySelector('.proj-card-desc')?.textContent || '',
      tags: Array.from(card.querySelectorAll('.proj-card-tag')).map(t => t.textContent),
      github: card.querySelector('.proj-card-link')?.href || '#'
    };

    if (bpTitle) bpTitle.innerHTML = `${title} <em>Blueprint</em>`;
    if (bpOv) bpOv.textContent = data.desc;
    if (bpTech) {
      bpTech.innerHTML = '';
      data.tags.forEach(tag => {
        const span = document.createElement('span');
        span.className = 'bp-tt';
        span.textContent = tag;
        bpTech.appendChild(span);
      });
    }
    if (bpGit) bpGit.href = data.github;

    panel.style.display = 'flex';
    panel.setAttribute('aria-hidden', 'false');

    if (typeof gsap !== 'undefined') {
      gsap.fromTo(panel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .5, ease: 'power3.out' });
    }

    setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
  }

  cards.forEach((card) => {
    card.addEventListener('click', () => openBlueprint(card));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openBlueprint(card);
      }
    });
  });

  bpClose?.addEventListener('click', () => {
    const close = () => {
      panel.style.display = 'none';
      panel.setAttribute('aria-hidden', 'true');
    };
    if (typeof gsap !== 'undefined') {
      gsap.to(panel, { opacity: 0, y: 30, duration: .35, ease: 'power2.in', onComplete: close });
    } else {
      close();
    }
  });
}

// ─────────────────────────────────────────────────────────────
// FORM HANDLER
// ─────────────────────────────────────────────────────────────
function initFormHandler() {
  const form = document.getElementById('c-form');
  const btn = document.getElementById('f-btn');
  const toast = document.getElementById('f-toast');
  const lbl = document.getElementById('f-lbl');

  if (!form || !btn || !toast) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#fn')?.value.trim();
    const email = form.querySelector('#fe')?.value.trim();
    const message = form.querySelector('#fm')?.value.trim();

    if (!name || !email || !message) {
      showToast(toast, 'Please fill all fields', 'error');
      return;
    }

    btn.disabled = true;
    if (lbl) lbl.textContent = 'Sending...';

    try {
      // Simulate sending (replace with your actual backend)
      await new Promise(resolve => setTimeout(resolve, 1500));

      showToast(toast, '✓ Message sent! I\'ll reply within 24h.', 'success');
      form.reset();
    } catch (err) {
      showToast(toast, 'Error sending message. Try again.', 'error');
    } finally {
      btn.disabled = false;
      if (lbl) lbl.textContent = 'Send Message';
    }
  });

  function showToast(el, msg, type) {
    el.textContent = msg;
    el.style.display = 'block';
    el.style.background = type === 'success' ? 'rgba(76, 175, 80, .15)' : 'rgba(244, 67, 54, .15)';
    el.style.color = type === 'success' ? '#4CAF50' : '#F44336';
    el.style.borderLeft = `3px solid ${type === 'success' ? '#4CAF50' : '#F44336'}`;

    setTimeout(() => {
      el.style.display = 'none';
    }, 4000);
  }
}

// ─────────────────────────────────────────────────────────────
// INITIALIZE ON DOM READY
// ─────────────────────────────────────────────────────────────
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAll);
} else {
  initAll();
}
