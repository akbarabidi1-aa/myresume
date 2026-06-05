document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     0.  GSAP PLUGIN REGISTRATION
  ───────────────────────────────────────────── */
  gsap.registerPlugin(ScrollTrigger);

  /* ─────────────────────────────────────────────
     1.  ELITE CUSTOM CURSOR  (dot + ring + glow + trail)
  ───────────────────────────────────────────── */
  const curDot   = document.getElementById('cur');
  const curRing  = document.getElementById('cur-ring');
  const trailCon = document.getElementById('cur-trail-container');
  let mx = 0, my = 0, ringX = 0, ringY = 0;
  const TRAIL_COUNT = 12;
  const trails = [];

  // Build trail dots
  if (trailCon) {
    for (let i = 0; i < TRAIL_COUNT; i++) {
      const d = document.createElement('div');
      d.className = 'cur-trail';
      d.style.cssText = `opacity:${1 - i / TRAIL_COUNT}; width:${8 - i * 0.4}px; height:${8 - i * 0.4}px;`;
      trailCon.appendChild(d);
      trails.push({ el: d, x: 0, y: 0 });
    }
  }

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (curDot) { curDot.style.left = mx + 'px'; curDot.style.top = my + 'px'; }
  });

  let prevTrailPositions = Array(TRAIL_COUNT).fill({ x: 0, y: 0 });

  function tickCursor() {
    // Smooth ring follow
    ringX += (mx - ringX) * 0.1;
    ringY += (my - ringY) * 0.1;
    if (curRing) { curRing.style.left = ringX + 'px'; curRing.style.top = ringY + 'px'; }

    // Trail lag effect
    let px = mx, py = my;
    trails.forEach((t, i) => {
      t.x += (px - t.x) * (0.3 - i * 0.018);
      t.y += (py - t.y) * (0.3 - i * 0.018);
      t.el.style.left = t.x + 'px';
      t.el.style.top  = t.y + 'px';
      px = t.x; py = t.y;
    });
    requestAnimationFrame(tickCursor);
  }
  tickCursor();

  // Hover state for interactive elements
  document.querySelectorAll('a, button, .proj-row, .tilt-card, .magnetic').forEach(el => {
    el.addEventListener('mouseenter', () => curRing && curRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => curRing && curRing.classList.remove('hovering'));
  });

  /* ─────────────────────────────────────────────
     2.  MAGNETIC BUTTON EFFECT
  ───────────────────────────────────────────── */
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width  / 2;
      const cy = r.top  + r.height / 2;
      const dx = (e.clientX - cx) * 0.35;
      const dy = (e.clientY - cy) * 0.35;
      gsap.to(el, { x: dx, y: dy, duration: 0.3, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.4)' });
    });
  });

  /* ─────────────────────────────────────────────
     3.  PAGE LOADER  (cinematic count-up)
  ───────────────────────────────────────────── */
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-pct');
  let pct = 0;
  const lInt = setInterval(() => {
    pct += Math.floor(Math.random() * 8) + 3;
    if (pct >= 100) {
      pct = 100;
      clearInterval(lInt);
      setTimeout(() => {
        gsap.to('#loader', {
          yPercent: -100, duration: 1, ease: 'power4.inOut',
          onComplete: () => {
            const l = document.getElementById('loader');
            if (l) l.style.display = 'none';
            bootHero();
          }
        });
      }, 300);
    }
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = String(pct).padStart(3, '0');
  }, 40);

  /* ─────────────────────────────────────────────
     4.  SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    if (progressBar) {
      const prog = window.scrollY / (document.body.scrollHeight - window.innerHeight);
      progressBar.style.width = (prog * 100) + '%';
    }
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });

  /* ─────────────────────────────────────────────
     5.  ROTATING ORBIT TEXT (like alimoshen.com)
  ───────────────────────────────────────────── */
  const orbit = document.getElementById('hero-orbit');
  let orbitAngle = 0;
  function spinOrbit() {
    orbitAngle += 0.18;
    if (orbit) orbit.style.transform = `rotate(${orbitAngle}deg)`;
    requestAnimationFrame(spinOrbit);
  }
  spinOrbit();

  /* ─────────────────────────────────────────────
     6.  AURORA LIGHT BEAMS
  ───────────────────────────────────────────── */
  const beamCon = document.getElementById('light-stream-container');
  if (beamCon) {
    for (let i = 0; i < 60; i++) {
      const b = document.createElement('div');
      b.className = 'light-beam';
      const rise = (Math.random() * 2 + 4).toFixed(2);
      const drop = (Math.random() * 3 + 3).toFixed(2);
      b.style.cssText = `left:${Math.random()*100}%;width:${Math.floor(Math.random()*3)+1}px;animation-delay:${(Math.random()*5).toFixed(2)}s;animation-duration:${rise}s,${rise}s,${drop}s;`;
      beamCon.appendChild(b);
    }
  }

  /* ─────────────────────────────────────────────
     7.  TYPEWRITER
  ───────────────────────────────────────────── */
  const taglines = ['ASP.NET Core Specialist', 'Full Stack Engineer', 'AI & ML Enthusiast', 'Backend Architecture Expert', 'Cloud Solutions Builder'];
  let tIdx = 0, charIdx = 0, deleting = false;
  const tText = document.getElementById('ttext');
  function runTypewriter() {
    if (!tText) return;
    const str = taglines[tIdx];
    tText.textContent = deleting ? str.slice(0, --charIdx) : str.slice(0, ++charIdx);
    let spd = deleting ? 28 : 72;
    if (!deleting && charIdx === str.length)       { spd = 2400; deleting = true; }
    else if (deleting && charIdx === 0) { deleting = false; tIdx = (tIdx + 1) % taglines.length; spd = 450; }
    setTimeout(runTypewriter, spd);
  }

  /* ─────────────────────────────────────────────
     8.  SPLIT-TEXT CHAR ANIMATION (heading letters)
  ───────────────────────────────────────────── */
  function splitAndAnimate(el, delay = 0) {
    if (!el) return;
    // Preserve inner HTML (em tags) while splitting plain-text nodes
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    let node;
    while ((node = walker.nextNode())) textNodes.push(node);

    textNodes.forEach(tn => {
      const frag = document.createDocumentFragment();
      [...tn.textContent].forEach(ch => {
        const s = document.createElement('span');
        s.className = 'char';
        s.textContent = ch === ' ' ? '\u00A0' : ch;
        frag.appendChild(s);
      });
      tn.parentNode.replaceChild(frag, tn);
    });

    gsap.from(el.querySelectorAll('.char'), {
      opacity: 0, y: 60, rotateX: -90,
      duration: 0.7, ease: 'back.out(2)',
      stagger: 0.03, delay
    });
  }

  /* ─────────────────────────────────────────────
     9.  COUNTER ANIMATION
  ───────────────────────────────────────────── */
  function animateCounters() {
    document.querySelectorAll('.val[data-count]').forEach(el => {
      const target = +el.dataset.count;
      gsap.to({ n: 0 }, {
        n: target, duration: 2.5, ease: 'power2.out',
        onUpdate: function() { el.textContent = '+' + Math.floor(this.targets()[0].n); },
        onComplete: () => { el.textContent = '+' + target; }
      });
    });
  }

  /* ─────────────────────────────────────────────
     10. HERO BOOT SEQUENCE
  ───────────────────────────────────────────── */
  function bootHero() {
    runTypewriter();

    // Badge pop in
    gsap.fromTo('#hero-badge', { opacity: 0, scale: 0.7, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)' });

    // Title chars
    const titleEl = document.getElementById('hero-title');
    if (titleEl) {
      gsap.set(titleEl, { opacity: 1 });
      splitAndAnimate(titleEl, 0.15);
    }

    // Cascade reveals
    gsap.fromTo('.hero-typing',  { opacity: 0 },       { opacity: 1, duration: 0.6, delay: 0.6 });
    gsap.fromTo('#hero-desc',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', delay: 0.75 });
    gsap.fromTo('#hero-btns',    { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.9 });
    gsap.fromTo('#hero-stats',   { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 1.05,
      onComplete: animateCounters });
    gsap.fromTo('.hero-fc',      { opacity: 0, x: 60, rotateY: 15 },
      { opacity: 1, x: 0, rotateY: 0, duration: 1, ease: 'power3.out', stagger: 0.2, delay: 0.5 });

    // Scroll indicator bob
    gsap.to('.scroll-line', {
      scaleY: 1.6, opacity: 0, duration: 1,
      repeat: -1, ease: 'power1.inOut', yoyo: true, delay: 1.5
    });
  }

  /* ─────────────────────────────────────────────
     11. 3-D TILT CARDS  (like premium sites)
  ───────────────────────────────────────────── */
  document.querySelectorAll('.tilt-card').forEach(card => {
    const shine = card.querySelector('.tilt-shine');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const xRel = (e.clientX - r.left) / r.width  - 0.5;
      const yRel = (e.clientY - r.top)  / r.height - 0.5;
      gsap.to(card, {
        rotateX: -yRel * 14, rotateY: xRel * 14,
        transformPerspective: 800,
        duration: 0.3, ease: 'power2.out'
      });
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${e.clientX - r.left}px ${e.clientY - r.top}px, rgba(255,210,166,0.18) 0%, transparent 60%)`;
      }
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
      if (shine) shine.style.background = 'none';
    });
  });

  /* ─────────────────────────────────────────────
     12. SCROLL-TRIGGERED REVEALS
         .reveal-up  /  .reveal-left  /  .reveal-right
  ───────────────────────────────────────────── */
  gsap.utils.toArray('.reveal-up').forEach((el, i) => {
    gsap.fromTo(el,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }, delay: (i % 4) * 0.08 }
    );
  });
  gsap.utils.toArray('.reveal-left').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: -60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });
  gsap.utils.toArray('.reveal-right').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, x: 60 },
      { opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' } }
    );
  });

  // Split-heading scroll trigger
  document.querySelectorAll('.split-heading').forEach(el => {
    ScrollTrigger.create({
      trigger: el, start: 'top 85%',
      onEnter: () => splitAndAnimate(el)
    });
  });

  /* ─────────────────────────────────────────────
     13. PARALLAX  (section backgrounds on scroll)
  ───────────────────────────────────────────── */
  gsap.utils.toArray('.parallax-bg').forEach(el => {
    gsap.to(el, {
      yPercent: -25,
      ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  // Subtle hero parallax
  gsap.to('#hero .hero-grid', {
    yPercent: 20, ease: 'none',
    scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ─────────────────────────────────────────────
     14. HORIZONTAL SKILL MARQUEE  (speed control on hover)
  ───────────────────────────────────────────── */
  document.querySelectorAll('.marquee-wrap').forEach(wrap => {
    const fwd = wrap.querySelector('.marquee-fwd');
    const rev = wrap.querySelector('.marquee-rev');
    wrap.addEventListener('mouseenter', () => {
      if (fwd) fwd.style.animationPlayState = 'paused';
      if (rev) rev.style.animationPlayState = 'paused';
    });
    wrap.addEventListener('mouseleave', () => {
      if (fwd) fwd.style.animationPlayState = 'running';
      if (rev) rev.style.animationPlayState = 'running';
    });
  });

  /* ─────────────────────────────────────────────
     15. PARTICLE CANVAS  (floating ambient particles)
  ───────────────────────────────────────────── */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resizeCanvas() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const COLORS = ['rgba(255,138,91,', 'rgba(255,210,166,', 'rgba(255,243,233,'];
    function mkParticle() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.8 + 0.4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.4 + 0.1),
        alpha: Math.random() * 0.5 + 0.1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      };
    }
    for (let i = 0; i < 90; i++) particles.push(mkParticle());

    function drawParticles() {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -4 || p.x < -4 || p.x > W + 4) {
          Object.assign(p, mkParticle(), { y: H + 4 });
        }
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  /* ─────────────────────────────────────────────
     16. SKILL CARD  NUMBER HOVER RIPPLE
  ───────────────────────────────────────────── */
  document.querySelectorAll('.sk-tag').forEach(tag => {
    tag.addEventListener('mouseenter', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const r = this.getBoundingClientRect();
      ripple.style.cssText = `left:${e.clientX-r.left}px;top:${e.clientY-r.top}px;`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
  /* ─────────────────────────────────────────────
     17. PROJECT ROW  hover ink-spread + bento open
  ───────────────────────────────────────────── */
  const bentoPanel = document.getElementById('bento-panel');
  const bTitle     = document.getElementById('b-panel-title');
  const bTech      = document.getElementById('b-panel-tech');
  const bOverview  = document.getElementById('b-panel-overview');
  const bLinkLive  = document.getElementById('b-link-live');
  const bLinkGit   = document.getElementById('b-link-git');

  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('click', () => {
      const title = row.querySelector('.proj-row-title')?.textContent || '';
      const desc  = row.querySelector('.proj-row-desc')?.textContent  || '';
      if (bTitle)   bTitle.innerHTML = `${title} <em>Matrix</em>`;
      if (bOverview) bOverview.textContent = desc;
      if (bTech) {
        bTech.innerHTML = '';
        row.querySelectorAll('.proj-tags .t').forEach(t => {
          const s = document.createElement('span'); s.className = 'bento-tch';
          s.textContent = t.textContent; bTech.appendChild(s);
        });
      }
      const live = row.querySelector('.proj-links a[href*="http"]');
      const git  = row.querySelector('.proj-links a');
      if (bLinkLive) { bLinkLive.href = live?.href || '#'; bLinkLive.style.display = live ? 'inline-flex' : 'none'; }
      if (bLinkGit)  { bLinkGit.href  = git?.href  || '#'; bLinkGit.style.display  = git  ? 'inline-flex' : 'none'; }

      if (bentoPanel) {
        bentoPanel.style.display = 'flex';
        gsap.fromTo(bentoPanel, { opacity: 0, y: 50, scaleY: 0.95 },
          { opacity: 1, y: 0, scaleY: 1, duration: 0.65, ease: 'power3.out' });
        setTimeout(() => bentoPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
      }
    });
  });

  document.getElementById('bento-close-btn')?.addEventListener('click', () => {
    if (bentoPanel) {
      gsap.to(bentoPanel, { opacity: 0, y: 30, scaleY: 0.95, duration: 0.4,
        onComplete: () => bentoPanel.style.display = 'none' });
    }
  });
  // Bento card spotlight
  document.querySelectorAll('.b-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--bx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--by', (e.clientY - r.top)  + 'px');
    });
  });
  /* ─────────────────────────────────────────────
     18. SECTION STAGGER  (each section slides in on enter)
  ───────────────────────────────────────────── */
  gsap.utils.toArray('.section').forEach(sec => {
    gsap.fromTo(sec,
      { opacity: 0 },
      { opacity: 1, duration: 0.4,
        scrollTrigger: { trigger: sec, start: 'top 95%', toggleActions: 'play none none none' } }
    );
  });
  /* ─────────────────────────────────────────────
     19. CONTACT FORM
  ───────────────────────────────────────────── */
  document.getElementById('c-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn   = document.getElementById('form-submit');
    const toast = document.getElementById('form-toast');
    if (btn) btn.disabled = true;
    if (toast) {
      Object.assign(toast.style, { display: 'block', background: 'rgba(255,210,166,0.1)', color: 'var(--cyan)' });
      toast.textContent = 'Encrypting transmission packets...';
    }
    setTimeout(() => {
      if (toast) { toast.style.background = 'rgba(255,138,91,0.1)'; toast.style.color = '#fff';
        toast.textContent = 'Message delivered to engineering node ✓'; }
      this.reset(); if (btn) btn.disabled = false;
      setTimeout(() => { if (toast) gsap.to(toast, { opacity: 0, duration: 0.4,
        onComplete: () => { toast.style.display = 'none'; toast.style.opacity = '1'; } }); }, 4000);
    }, 1800);
  });
  /* ─────────────────────────────────────────────
     20. MOBILE NAV
  ───────────────────────────────────────────── */
  const hamburger  = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  hamburger?.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('active', open);
    gsap.fromTo('.mm-link',
      { opacity: 0, x: -30 },
      { opacity: 1, x: 0, stagger: 0.07, duration: 0.4, ease: 'power2.out' }
    );
  });
  document.querySelectorAll('.mm-link').forEach(l => l.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger?.classList.remove('active');
  }));
  /* ─────────────────────────────────────────────
     21. GLOWING NUMBER HOVER  (education GPA, stats)
  ───────────────────────────────────────────── */
  document.querySelectorAll('.gpa-val, .h-stat .val').forEach(el => {
    el.addEventListener('mouseenter', () => gsap.to(el, { scale: 1.12, duration: 0.25, ease: 'back.out(2)' }));
    el.addEventListener('mouseleave', () => gsap.to(el, { scale: 1, duration: 0.35, ease: 'elastic.out(1,0.5)' }));
  });
  /* ─────────────────────────────────────────────
     22. SMOOTH NAV LINK GLITCH EFFECT
  ───────────────────────────────────────────── */
  document.querySelectorAll('.nav-links a[data-text]').forEach(link => {
    link.addEventListener('mouseenter', () => {
      const txt = link.dataset.text;
      let i = 0;
      const chars = '!@#$%^&*<>';
      const interval = setInterval(() => {
        link.textContent = txt.split('').map((c, idx) =>
          idx < i ? c : chars[Math.floor(Math.random() * chars.length)]
        ).join('');
        if (++i > txt.length) { link.textContent = txt; clearInterval(interval); }
      }, 40);
    });
  });

});
