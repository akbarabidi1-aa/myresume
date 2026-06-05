document.addEventListener("DOMContentLoaded", () => {

  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  const taglines = ["ASP.NET Core Specialist", "Full Stack Engineer", "AI & ML Enthusiast", "Backend Architecture Expert"];

  // ── Custom magnetic ring cursor engine ──
  const cur     = document.getElementById('cur');
  const curRing = document.getElementById('cur-ring');
  const curGlow = document.getElementById('cur-glow');
  let mx = 0, my = 0, cx = 0, cy = 0, rx = 0, ry = 0;

  window.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    if (cur) { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; }
  });

  function renderCursor() {
    cx += (mx - cx) * 0.12; cy += (my - cy) * 0.12;
    rx += (mx - rx) * 0.08; ry += (my - ry) * 0.08;
    if (curGlow) { curGlow.style.left = cx + 'px'; curGlow.style.top = cy + 'px'; }
    if (curRing) { curRing.style.left = rx + 'px'; curRing.style.top = ry + 'px'; }
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  document.querySelectorAll('a, button, .proj-row').forEach(el => {
    el.addEventListener('mouseenter', () => curRing && curRing.classList.add('hovering'));
    el.addEventListener('mouseleave', () => curRing && curRing.classList.remove('hovering'));
  });

  // ── Page Loader ──
  let pct = 0;
  const loaderBar = document.getElementById('loader-bar');
  const loaderPct = document.getElementById('loader-pct');
  const lInterval = setInterval(() => {
    pct += Math.floor(Math.random() * 9) + 2;
    if (pct >= 100) {
      pct = 100;
      clearInterval(lInterval);
      gsap.to('#loader', {
        opacity: 0, duration: 0.7, ease: "power4.inOut",
        onComplete: () => {
          const loader = document.getElementById('loader');
          if (loader) loader.style.display = 'none';
          triggerHeroSequencer();
        }
      });
    }
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = String(pct).padStart(3, '0');
  }, 45);

  // ── Typewriter ──
  let tIdx = 0, charIdx = 0, isDeleting = false;
  const tText = document.getElementById('ttext');

  function runTypewriter() {
    if (!tText) return;
    const currentStr = taglines[tIdx];
    if (isDeleting) {
      tText.textContent = currentStr.substring(0, charIdx - 1);
      charIdx--;
    } else {
      tText.textContent = currentStr.substring(0, charIdx + 1);
      charIdx++;
    }
    let speed = isDeleting ? 30 : 75;
    if (!isDeleting && charIdx === currentStr.length) { speed = 2200; isDeleting = true; }
    else if (isDeleting && charIdx === 0) { isDeleting = false; tIdx = (tIdx + 1) % taglines.length; speed = 400; }
    setTimeout(runTypewriter, speed);
  }

  // ── Hero sequence ──
  function triggerHeroSequencer() {
    runTypewriter();

    // Badge
    gsap.fromTo('#hero-badge',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.8, ease: "elastic.out(1, 0.75)" }
    );

    // Title word split
    const titleEl = document.getElementById('hero-title');
    if (titleEl) {
      const parts = titleEl.innerHTML.split('<br>');
      let finalHTML = '';
      parts.forEach((p, pi) => {
        if (p.includes('<em>')) {
          finalHTML += p;
        } else {
          p.trim().split(' ').forEach(w => {
            if (w) finalHTML += `<span class="word"><span class="word-inner">${w}</span></span> `;
          });
        }
        if (pi < parts.length - 1) finalHTML += '<br>';
      });
      titleEl.innerHTML = finalHTML;
      gsap.from('#hero-title .word-inner', { y: "110%", duration: 0.9, ease: "power4.out", stagger: 0.08, delay: 0.1 });
    }

    // Reveal other hero elements
    gsap.fromTo('.hero-typing', { opacity: 0 }, { opacity: 1, duration: 0.5, delay: 0.45 });
    gsap.fromTo('#hero-desc',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.9, delay: 0.55 });
    gsap.fromTo('#hero-btns',   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.65 });
    gsap.fromTo('#hero-stats',  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.75 });
    gsap.fromTo('.hero-fc',     { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8, stagger: 0.18, ease: "power3.out", delay: 0.5 });
  }

  // ── Nav scroll ──
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('nav');
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ── Scroll reveal for .sr elements ──
  gsap.utils.toArray('.sr').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%" }
      }
    );
  });

  // ── Bento panel ──
  const bentoPanel = document.getElementById('bento-panel');
  const bTitle     = document.getElementById('b-panel-title');
  const bTech      = document.getElementById('b-panel-tech');
  const bOverview  = document.getElementById('b-panel-overview');
  const bLinkLive  = document.getElementById('b-link-live');
  const bLinkGit   = document.getElementById('b-link-git');

  document.querySelectorAll('.proj-row').forEach(row => {
    row.addEventListener('click', () => {
      const title = row.querySelector('.proj-row-title')?.textContent || "Case Study Blueprint";
      const desc  = row.querySelector('.proj-row-desc')?.textContent || "";

      if (bTitle)   bTitle.innerHTML = `${title} <em>Matrix</em>`;
      if (bOverview) bOverview.textContent = desc;

      if (bTech) {
        bTech.innerHTML = '';
        row.querySelectorAll('.proj-tags .t').forEach(tag => {
          const span = document.createElement('span');
          span.className = 'bento-tch';
          span.textContent = tag.textContent;
          bTech.appendChild(span);
        });
      }

      const rowLive = row.querySelector('.proj-links a[href*="http"]');
      const rowGit  = row.querySelector('.proj-links a');
      if (bLinkLive) {
        bLinkLive.setAttribute('href', rowLive ? rowLive.getAttribute('href') : '#');
        bLinkLive.style.display = rowLive ? 'inline-flex' : 'none';
      }
      if (bLinkGit) {
        bLinkGit.setAttribute('href', rowGit ? rowGit.getAttribute('href') : '#');
        bLinkGit.style.display = rowGit ? 'inline-flex' : 'none';
      }

      if (bentoPanel) {
        bentoPanel.style.display = 'flex';
        gsap.fromTo(bentoPanel, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
        setTimeout(() => bentoPanel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
      }
    });
  });

  document.getElementById('bento-close-btn')?.addEventListener('click', () => {
    if (bentoPanel) {
      gsap.to(bentoPanel, { opacity: 0, y: 30, duration: 0.4, onComplete: () => bentoPanel.style.display = 'none' });
    }
  });

  // ── Contact form ──
  document.getElementById('c-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn   = document.getElementById('form-submit');
    const toast = document.getElementById('form-toast');
    if (btn) btn.disabled = true;
    if (toast) {
      toast.style.display = 'block';
      toast.style.background = 'rgba(255,210,166,0.1)';
      toast.style.color = 'var(--cyan)';
      toast.textContent = 'Encrypting sequence transmission packets...';
    }
    setTimeout(() => {
      if (toast) {
        toast.style.background = 'rgba(255,138,91,0.1)';
        toast.style.color = '#fff';
        toast.textContent = 'Transmission payload securely delivered to engineering node.';
      }
      this.reset();
      if (btn) btn.disabled = false;
      setTimeout(() => {
        if (toast) gsap.to(toast, { opacity: 0, duration: 0.4, onComplete: () => { toast.style.display = 'none'; toast.style.opacity = '1'; } });
      }, 5000);
    }, 1800);
  });

  // ── Bento card spotlight ──
  document.querySelectorAll('.b-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--bx', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--by', (e.clientY - rect.top) + 'px');
    });
  });

});