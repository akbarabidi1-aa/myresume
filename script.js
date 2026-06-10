document.addEventListener('DOMContentLoaded', () => {

 gsap.registerPlugin(ScrollTrigger);

 const isMobile = window.innerWidth < 768 || ('ontouchstart' in window);
 if (isMobile) {
 const aScene = document.getElementById('aurora-scene');
 if (aScene) aScene.style.display = 'none';
 const sc = document.getElementById('light-stream-container');
 if (sc) sc.innerHTML = '';
 }

 const CORAL = 0xFF8A5B;
 const CREAM = 0xFFD2A6;
 const TAGLINES = [
 'ASP.NET Core Specialist',
 'Full Stack Engineer',
 'AI & ML Enthusiast',
 'Cloud Architect'
 ];

 const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2, nx: 0, ny: 0 };
 let mouseTick = false;

 window.addEventListener('mousemove', e => {
 if (mouseTick) return; 
 mouseTick = true;
 requestAnimationFrame(() => {
 mouse.x = e.clientX;
 mouse.y = e.clientY;
 mouse.nx = (e.clientX / window.innerWidth - 0.5) * 2;
 mouse.ny = (e.clientY / window.innerHeight - 0.5) * 2;
 mouseTick = false;
 });
 }, { passive: true });

 const streamContainer = document.getElementById('light-stream-container');
 if (streamContainer) {
 const frag = document.createDocumentFragment(); 
 for (let i = 0; i < 30; i++) { 
 const b = document.createElement('div');
 b.className = 'light-beam';
 const rise = (Math.random() * 2 + 4).toFixed(2);
 const drop = (Math.random() * 3 + 3).toFixed(2);
 b.style.cssText =
 `left:${(Math.random()*100).toFixed(1)}%;` +
 `width:${Math.floor(Math.random()*2)+1}px;` +
 `animation-delay:${(Math.random()*8).toFixed(2)}s;` +
 `animation-duration:${rise}s,${rise}s,${drop}s;`;
 frag.appendChild(b);
 }
 streamContainer.appendChild(frag); 
 }

 const loaderBar = document.getElementById('loader-bar');
 const loaderPct = document.getElementById('loader-pct');
 let pct = 0;
 function stepLoader() {
 pct = Math.min(pct + Math.floor(Math.random() * 8) + 3, 100);
 if (loaderBar) loaderBar.style.width = pct + '%';
 if (loaderPct) loaderPct.textContent = String(pct).padStart(3,'0');
 if (pct < 100) { setTimeout(stepLoader, 38); return; }
 setTimeout(() => {
 gsap.to('#loader',{opacity:0,duration:0.6,ease:'power3.inOut',onComplete:()=>{
 const l=document.getElementById('loader');
 if(l)l.style.display='none';
 initHero();
 }});
 }, 200);
 }
 setTimeout(stepLoader, 80);

 const curDot = document.getElementById('cur-dot');
 const curCircle = document.getElementById('cur-circle');
 let cx = mouse.x, cy = mouse.y;

 function tickCursor() {
 
 cx += (mouse.x - cx) * 0.10;
 cy += (mouse.y - cy) * 0.10;
 if (curDot) {
 curDot.style.transform = `translate(${mouse.x - 3}px,${mouse.y - 3}px)`; 
 }
 if (curCircle) {
 curCircle.style.transform = `translate(${cx - 18}px,${cy - 18}px)`;
 }
 requestAnimationFrame(tickCursor);
 }
 requestAnimationFrame(tickCursor);

 document.addEventListener('mousedown', () => curCircle?.classList.add('clicking'));
 document.addEventListener('mouseup', () => curCircle?.classList.remove('clicking'));
 document.querySelectorAll('a,button,.proj-row,.glass').forEach(el => {
 el.addEventListener('mouseenter', () => curCircle?.classList.add('hovering'), { passive:true });
 el.addEventListener('mouseleave', () => curCircle?.classList.remove('hovering'), { passive:true });
 });

 const progressBar = document.getElementById('scroll-progress');
 const navEl = document.getElementById('nav');
 window.addEventListener('scroll', () => {
 const scrolled = window.scrollY;
 const total = document.body.scrollHeight - window.innerHeight;
 if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';
 navEl?.classList.toggle('scrolled', scrolled > 50);
 }, { passive: true });

 const hamburger = document.getElementById('nav-hamburger');
 const mobileMenu = document.getElementById('mobile-menu');
 hamburger?.addEventListener('click', () => {
 mobileMenu?.classList.toggle('open');
 document.body.classList.toggle('no-scroll');
 });
 document.querySelectorAll('.mm-link').forEach(l =>
 l.addEventListener('click', () => {
 mobileMenu?.classList.remove('open');
 document.body.classList.remove('no-scroll');
 })
 );

 function initThreeHero() {
 const canvas = document.getElementById('hero-three');
 if (!canvas || typeof THREE === 'undefined') return;

 const wrap = canvas.parentElement;
 let W = wrap.clientWidth, H = wrap.clientHeight;

 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(55, W / H, 0.1, 60);
 camera.position.z = 5;

 const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false }); 
 renderer.setSize(W, H);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
 renderer.setClearColor(0x000000, 0);

 const group = new THREE.Group();
 scene.add(group);

 const icoMesh = new THREE.Mesh(
 new THREE.IcosahedronGeometry(1.15, 1),
 new THREE.MeshBasicMaterial({ color: CORAL, wireframe: true, transparent: true, opacity: 0.16 })
 );
 group.add(icoMesh);

 const coreMesh = new THREE.Mesh(
 new THREE.SphereGeometry(0.58, 24, 24), 
 new THREE.MeshStandardMaterial({
 color: 0x1a1a22, metalness: 0.85, roughness: 0.18,
 emissive: new THREE.Color(CORAL), emissiveIntensity: 0.2
 })
 );
 group.add(coreMesh);

 const ring1 = new THREE.Mesh(
 new THREE.TorusGeometry(1.52, 0.007, 6, 80), 
 new THREE.MeshBasicMaterial({ color: CORAL, transparent: true, opacity: 0.5 })
 );
 ring1.rotation.x = Math.PI * 0.35;
 group.add(ring1);

 const ring2 = new THREE.Mesh(
 new THREE.TorusGeometry(1.82, 0.005, 6, 80),
 new THREE.MeshBasicMaterial({ color: CREAM, transparent: true, opacity: 0.28 })
 );
 ring2.rotation.x = Math.PI * 0.6;
 ring2.rotation.y = Math.PI * 0.2;
 group.add(ring2);

 const nodeMat = new THREE.MeshBasicMaterial({ color: CORAL });
 const nodeGeo = new THREE.SphereGeometry(0.055, 6, 6); 
 const nodeData = [
 [1.9, 0.3, 0.1], [-1.85, 0.6, -0.3],
 [0.3, 2.0, 0.4], [0.5, -1.8, 0.6],
 ];
 const nodes = nodeData.map(([x,y,z]) => {
 const m = new THREE.Mesh(nodeGeo, nodeMat);
 m.position.set(x, y, z);
 group.add(m);
 return m;
 });

 const pCount = 120;
 const pPos = new Float32Array(pCount * 3);
 for (let i = 0; i < pCount; i++) {
 pPos[i*3] = (Math.random() - 0.5) * 7;
 pPos[i*3+1] = (Math.random() - 0.5) * 7;
 pPos[i*3+2] = (Math.random() - 0.5) * 7;
 }
 const pGeo = new THREE.BufferGeometry();
 pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
 const particles = new THREE.Points(
 pGeo,
 new THREE.PointsMaterial({ color: CREAM, size: 0.025, transparent: true, opacity: 0.4 })
 );
 group.add(particles);

 scene.add(new THREE.AmbientLight(0xffffff, 0.4));
 const pLight1 = new THREE.PointLight(CORAL, 2, 7);
 pLight1.position.set(3, 2, 3);
 scene.add(pLight1);
 const pLight2 = new THREE.PointLight(CREAM, 1, 7);
 pLight2.position.set(-3, -1, 2);
 scene.add(pLight2);

 let currRotX = 0, currRotY = 0;

 let resizeTimer;
 window.addEventListener('resize', () => {
 clearTimeout(resizeTimer);
 resizeTimer = setTimeout(() => {
 W = wrap.clientWidth; H = wrap.clientHeight;
 camera.aspect = W / H;
 camera.updateProjectionMatrix();
 renderer.setSize(W, H);
 }, 200);
 });

 let t = 0;
 function animate() {
 requestAnimationFrame(animate);
 t += 0.007;

 currRotX += (mouse.ny * 0.5 - currRotX) * 0.05;
 currRotY += (mouse.nx * 0.5 - currRotY) * 0.05;
 group.rotation.x = currRotX;
 group.rotation.y = currRotY;

 icoMesh.rotation.y += 0.003;
 icoMesh.rotation.z += 0.0015;
 ring1.rotation.z += 0.005;
 ring2.rotation.x += 0.004;
 ring2.rotation.y += 0.0025;
 particles.rotation.y += 0.001;

 const sc = 1 + Math.sin(t * 1.5) * 0.22;
 nodes.forEach(n => n.scale.setScalar(sc));

 pLight1.position.x = Math.sin(t * 0.6) * 3;
 pLight1.position.y = Math.cos(t * 0.45) * 2;

 renderer.render(scene, camera);
 }
 animate();
 }

 let tIdx = 0, charIdx = 0, deleting = false;
 const tEl = document.getElementById('ttext');
 function typewriter() {
 if (!tEl) return;
 const str = TAGLINES[tIdx];
 tEl.textContent = deleting
 ? str.substring(0, --charIdx)
 : str.substring(0, ++charIdx);
 let delay = deleting ? 28 : 72;
 if (!deleting && charIdx === str.length) { delay = 2200; deleting = true; }
 else if (deleting && charIdx === 0) { deleting = false; tIdx = (tIdx+1) % TAGLINES.length; delay = 380; }
 setTimeout(typewriter, delay);
 }

 function initHero() {
 initThreeHero();
 typewriter();

 const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
 tl.to('#hero-badge', { opacity:1, y:0, duration:0.7 })
 .to('.line-inner', { y:'0%', duration:1.0, stagger:0.11, ease:'power4.out' }, '-=0.3')
 .to('#hero-title', { opacity:1, duration:0.01 }, '<')
 .to('#hero-role', { opacity:1, duration:0.5 }, '-=0.4')
 .to('#hero-desc', { opacity:1, duration:0.7 }, '-=0.3')
 .to('#hero-btns', { opacity:1, duration:0.6 }, '-=0.4')
 .to('#hero-stats', { opacity:1, duration:0.6 }, '-=0.3')
 .to('#hero-canvas-wrap', { opacity:1, duration:0.9, ease:'power2.out' }, '-=0.7');

 setTimeout(() => {
 document.querySelectorAll('.val[data-target]').forEach(el => {
 const target = parseInt(el.dataset.target);
 const prefix = el.querySelector('.val-prefix')?.outerHTML || '';
 let cur = 0;
 const step = target / 35;
 const iv = setInterval(() => {
 cur = Math.min(cur + step, target);
 el.innerHTML = prefix + Math.ceil(cur);
 if (cur >= target) clearInterval(iv);
 }, 35);
 });
 }, 1200);
 }

 const revealObserver = new IntersectionObserver((entries) => {
 entries.forEach(entry => {
 if (!entry.isIntersecting) return;
 const el = entry.target;
 gsap.to(el, {
 opacity:1, y:0, x:0, duration:0.85, ease:'power3.out',
 delay: parseFloat(el.dataset.delay || 0)
 });
 revealObserver.unobserve(el); 
 });
 }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

 document.querySelectorAll('.reveal-up,.s-eyebrow,.s-title,.s-sub').forEach((el, i) => {
 el.dataset.delay = ((i % 4) * 0.07).toFixed(2);
 revealObserver.observe(el);
 });

 document.querySelectorAll('.glass').forEach(card => {
 let tiltFrame = false;
 card.addEventListener('mousemove', e => {
 if (tiltFrame) return;
 tiltFrame = true;
 requestAnimationFrame(() => {
 const r = card.getBoundingClientRect();
 const xPct = (e.clientX - r.left) / r.width - 0.5;
 const yPct = (e.clientY - r.top) / r.height - 0.5;
 card.style.transform =
 `perspective(900px) rotateY(${xPct*7}deg) rotateX(${-yPct*7}deg) translateY(-8px)`;
 card.style.setProperty('--bx', (e.clientX - r.left) + 'px');
 card.style.setProperty('--by', (e.clientY - r.top) + 'px');
 tiltFrame = false;
 });
 }, { passive:true });
 card.addEventListener('mouseleave', () => {
 card.style.transform = '';
 });
 });

 let parallaxFrame = false;
 window.addEventListener('mousemove', () => {
 if (parallaxFrame) return;
 parallaxFrame = true;
 requestAnimationFrame(() => {
 const nx = mouse.nx, ny = mouse.ny;
 const r1 = document.querySelector('.canvas-ring');
 const r2 = document.querySelector('.canvas-ring-2');
 const a1 = document.querySelector('.amb-1');
 const a2 = document.querySelector('.amb-2');
 if (r1) r1.style.transform = `rotate(0deg) translate(${nx*12}px,${ny*12}px)`;
 if (r2) r2.style.transform = `rotate(0deg) translate(${nx*-7}px,${ny*-7}px)`;
 if (a1) a1.style.transform = `translate(${nx*22}px,${ny*22}px)`;
 if (a2) a2.style.transform = `translate(${nx*-15}px,${ny*-15}px)`;
 parallaxFrame = false;
 });
 }, { passive:true });

 const bentoPanel = document.getElementById('bento-panel');
 const bTitle = document.getElementById('b-panel-title');
 const bTech = document.getElementById('b-panel-tech');
 const bOverview = document.getElementById('b-panel-overview');
 const bLinkLive = document.getElementById('b-link-live');
 const bLinkGit = document.getElementById('b-link-git');

 document.querySelectorAll('.proj-row').forEach(row => {
 row.addEventListener('click', () => {
 const title = row.querySelector('.proj-row-title')?.textContent || 'Blueprint';
 const desc = row.querySelector('.proj-row-desc')?.textContent || '';
 if (bTitle) bTitle.innerHTML = `${title} <em>Matrix</em>`;
 if (bOverview) bOverview.textContent = desc;
 if (bTech) {
 bTech.innerHTML = '';
 row.querySelectorAll('.proj-tags .t').forEach(t => {
 const s = document.createElement('span');
 s.className = 'bento-tch'; s.textContent = t.textContent;
 bTech.appendChild(s);
 });
 }
 const rowGit = row.querySelector('.proj-links a');
 if (bLinkLive) bLinkLive.style.display = 'none';
 if (bLinkGit) { bLinkGit.href = rowGit?.href || '#'; bLinkGit.style.display = rowGit ? 'inline-flex':'none'; }
 if (bentoPanel) {
 bentoPanel.style.display = 'flex';
 gsap.fromTo(bentoPanel, { opacity:0, y:50 }, { opacity:1, y:0, duration:0.6, ease:'power3.out' });
 setTimeout(() => bentoPanel.scrollIntoView({ behavior:'smooth', block:'start' }), 80);
 }
 });
 });

 document.getElementById('bento-close-btn')?.addEventListener('click', () => {
 gsap.to(bentoPanel, { opacity:0, y:40, duration:0.38, ease:'power2.in',
 onComplete: () => { if (bentoPanel) bentoPanel.style.display = 'none'; }
 });
 });

 document.querySelectorAll('.b-card').forEach(c => {
 let bf = false;
 c.addEventListener('mousemove', e => {
 if (bf) return; bf = true;
 requestAnimationFrame(() => {
 const r = c.getBoundingClientRect();
 c.style.setProperty('--bx', (e.clientX - r.left) + 'px');
 c.style.setProperty('--by', (e.clientY - r.top) + 'px');
 bf = false;
 });
 }, { passive:true });
 });

 document.getElementById('c-form')?.addEventListener('submit', function(e) {
 e.preventDefault();
 const btn = document.getElementById('form-submit');
 const toast = document.getElementById('form-toast');
 if (btn) btn.disabled = true;
 if (toast) {
 toast.style.cssText = 'display:block;background:rgba(255,210,166,.08);color:var(--coral)';
 toast.textContent = 'Encrypting payload…';
 }
 setTimeout(() => {
 if (toast) {
 toast.style.cssText = 'display:block;background:rgba(255,138,91,.08);color:#fff';
 toast.textContent = "Message delivered. I'll be in touch soon!";
 }
 this.reset();
 if (btn) btn.disabled = false;
 setTimeout(() => {
 if (toast) gsap.to(toast, { opacity:0, duration:.4, onComplete: () => {
 toast.style.display='none'; toast.style.opacity='1';
 }});
 }, 5000);
 }, 1800);
 });

}); 

 document.addEventListener('visibilitychange', () => {
 if (document.hidden) {
 document.querySelectorAll('.marquee-track').forEach(el => {
 el.style.animationPlayState = 'paused';
 });
 } else {
 document.querySelectorAll('.marquee-track').forEach(el => {
 el.style.animationPlayState = 'running';
 });
 }
 });