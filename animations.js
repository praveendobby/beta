/* ══════════════════════════════════════════════
   BETA STUDIO — ANIMATIONS.JS
   Cinematic Scroll System — Full Upgrade
══════════════════════════════════════════════ */

(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ═══════════════════════════════════════════
     § 0 — SHARED EASES & HELPERS
  ═══════════════════════════════════════════ */
  const EASE_CINEMA  = 'expo.out';          // silky, cinematic deceleration
  const EASE_SMOOTH  = 'power4.out';        // strong then soft
  const EASE_SPRING  = 'elastic.out(1,.8)'; // bouncy spring for avatars
  const EASE_RUBBER  = 'back.out(1.4)';     // slight overshoot

  /* Clip-path shorthand */
  const CLIP_HIDDEN  = 'inset(0 0 100% 0)';
  const CLIP_VISIBLE = 'inset(0 0 0% 0)';

  /* ═══════════════════════════════════════════
     § 1 — LOADER
  ═══════════════════════════════════════════ */
  const loaderWords  = ['initializing', 'crafting', 'brewing ideas', 'almost there', 'ready'];
  let   loaderWordIdx = 0;
  const loaderBar    = document.getElementById('loader-bar');
  const loaderNum    = document.getElementById('loader-num');
  const loaderWordEl = document.getElementById('loader-word');
  const loader       = document.getElementById('loader');

  let progress = 0;
  const loaderInterval = setInterval(() => {
    progress += Math.random() * 14 + 4;
    if (progress >= 100) {
      progress = 100;
      clearInterval(loaderInterval);
      setTimeout(hideLoader, 400);
    }
    if (loaderBar) loaderBar.style.width = progress + '%';
    if (loaderNum) loaderNum.textContent = Math.round(progress);
    const wi = Math.min(Math.floor(progress / 25), loaderWords.length - 1);
    if (wi !== loaderWordIdx && loaderWordEl) {
      loaderWordIdx = wi;
      gsap.fromTo(loaderWordEl,
        { opacity: 0, y: 10, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: EASE_SMOOTH }
      );
      loaderWordEl.textContent = loaderWords[wi];
    }
  }, 120);

  function hideLoader() {
    if (!loader) return;
    gsap.to(loader, {
      yPercent: -100,
      duration: 1.1,
      ease: EASE_SMOOTH,
      onComplete: () => {
        loader.style.display = 'none';
        playHeroEntrance();
      }
    });
  }

  /* ═══════════════════════════════════════════
     § 2 — HERO ENTRANCE (cinematic)
  ═══════════════════════════════════════════ */
  function playHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: EASE_CINEMA } });

    /* badge fades in with blur */
    tl.fromTo('#h-badge',
      { opacity: 0, y: 20, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
      0
    )

    /* headline lines: clip-path wipe upward */
    .fromTo('#ht1',
      { clipPath: CLIP_HIDDEN, y: 40, opacity: 0 },
      { clipPath: CLIP_VISIBLE, y: 0, opacity: 1, duration: 1.0 },
      0.2
    )
    .fromTo('#ht2',
      { clipPath: CLIP_HIDDEN, y: 50, opacity: 0 },
      { clipPath: CLIP_VISIBLE, y: 0, opacity: 1, duration: 1.0 },
      0.38
    )
    .fromTo('#ht3',
      { clipPath: CLIP_HIDDEN, y: 50, opacity: 0 },
      { clipPath: CLIP_VISIBLE, y: 0, opacity: 1, duration: 1.0 },
      0.55
    )

    /* subhead + CTAs blur-in */
    .fromTo('#h-sub',
      { opacity: 0, y: 30, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 },
      0.72
    )
    .fromTo('#h-ctas',
      { opacity: 0, y: 24, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 },
      0.88
    )

    /* scroll hint */
    .fromTo('#hero-scroll',
      { opacity: 0, x: -12 },
      { opacity: 1, x: 0, duration: 0.7 },
      1.05
    )

    /* floating tags cascade */
    .fromTo(['#ft1','#ft2','#ft3','#ft4'],
      { opacity: 0, scale: 0.85, y: 20, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', stagger: 0.14, duration: 0.7 },
      0.95
    );
  }

  /* ═══════════════════════════════════════════
     § 3 — SCROLL PROGRESS & NAV
  ═══════════════════════════════════════════ */
  const scrollProg = document.getElementById('scroll-prog');
  const nav        = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    const st = window.pageYOffset;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProg && dh > 0) scrollProg.style.width = (st / dh * 100) + '%';
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ═══════════════════════════════════════════
     § 4 — UNIVERSAL REVEAL ENGINE
     Each .reveal element gets a staggered,
     per-section cinematic entrance.
  ═══════════════════════════════════════════ */

  /* Helper: register one reveal */
  function revealEl(el, opts = {}) {
    const from = Object.assign({
      opacity: 0, y: 48, filter: 'blur(8px)'
    }, opts.from || {});
    const to = Object.assign({
      opacity: 1, y: 0, filter: 'blur(0px)',
      duration: 0.9, ease: EASE_CINEMA
    }, opts.to || {});
    gsap.fromTo(el, from, {
      ...to,
      scrollTrigger: {
        trigger: el,
        start: opts.start || 'top 88%',
        toggleActions: 'play none none none',
        once: true,
        ...(opts.trigger && { trigger: opts.trigger })
      }
    });
  }

  /* Section labels — clip-path line-wipe */
  document.querySelectorAll('.section-label').forEach(el => {
    gsap.fromTo(el,
      { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
      {
        clipPath: 'inset(0 0% 0 0)', opacity: 1,
        duration: 0.85, ease: EASE_SMOOTH,
        scrollTrigger: { trigger: el, start: 'top 90%', once: true }
      }
    );

    /* glitch text scramble after reveal */
    const orig  = el.textContent;
    const chars = '!@#$%^&*▲◎⬡✦βΣΩ';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => {
        let iter = 0;
        const iv = setInterval(() => {
          el.textContent = orig.split('').map((c, i) =>
            i < iter ? c : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
          ).join('');
          if (iter >= orig.length) clearInterval(iv);
          iter += 0.9;
        }, 30);
      }
    });
  });

  /* Section titles — word-level stagger */
  document.querySelectorAll('.section-title, .story-title, .contact-title').forEach(title => {
    /* Wrap words in spans if not already reveal-lines */
    if (!title.querySelector('.reveal-line')) {
      title.innerHTML = title.innerHTML
        .split(/(<br\s*\/?>|<em>.*?<\/em>)/gi)
        .map(part => {
          if (part.match(/<br/i)) return '<br/>';
          if (part.match(/<em>/i)) return `<span class="reveal-line" style="display:block;overflow:hidden">${part}</span>`;
          if (part.trim()) return `<span class="reveal-line" style="display:block;overflow:hidden"><span class="rl-inner" style="display:inline-block">${part}</span></span>`;
          return part;
        }).join('');
    }

    title.querySelectorAll('.reveal-line, .rl-inner').forEach((line, i) => {
      const inner = line.querySelector('.rl-inner') || line;
      gsap.fromTo(inner,
        { y: '105%', opacity: 0 },
        {
          y: '0%', opacity: 1,
          duration: 1.05, ease: EASE_CINEMA,
          delay: i * 0.12,
          scrollTrigger: { trigger: title, start: 'top 86%', once: true }
        }
      );
    });
  });

  /* Generic .reveal — per parent section */
  document.querySelectorAll('.reveal').forEach(el => {
    revealEl(el);
  });

  /* ═══════════════════════════════════════════
     § 5 — STORY SECTION
  ═══════════════════════════════════════════ */

  /* Story text block slides in from left */
  gsap.fromTo('.story-text',
    { x: -60, opacity: 0, filter: 'blur(10px)' },
    {
      x: 0, opacity: 1, filter: 'blur(0px)',
      duration: 1.1, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.story-grid', start: 'top 76%', once: true }
    }
  );

  /* Story paragraphs stagger */
  gsap.fromTo('.story-p',
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0,
      stagger: 0.18, duration: 0.85, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.story-text', start: 'top 80%', once: true }
    }
  );

  /* Story values items: slide in with stagger */
  gsap.fromTo('.sv-item',
    { opacity: 0, x: -28, filter: 'blur(4px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)',
      stagger: 0.13, duration: 0.75, ease: EASE_SMOOTH,
      scrollTrigger: { trigger: '.story-values', start: 'top 84%', once: true }
    }
  );

  /* Story visual: scale + fade from right */
  gsap.fromTo('.story-visual',
    { x: 60, opacity: 0, scale: 0.96, filter: 'blur(10px)' },
    {
      x: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
      duration: 1.1, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.story-grid', start: 'top 76%', once: true }
    }
  );

  /* Stat items: sequential rise with blur */
  gsap.fromTo('.stat-item',
    { opacity: 0, y: 36, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      stagger: { amount: 0.5, ease: 'power2.inOut' },
      duration: 0.85, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.stats-row', start: 'top 84%', once: true }
    }
  );

  /* ═══════════════════════════════════════════
     § 6 — NUMBER COUNTERS (fixed)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;

    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          onUpdate() { el.textContent = Math.round(obj.val); },
          onComplete() { el.textContent = target; }
        });
      }
    });
  });

  /* ═══════════════════════════════════════════
     § 7 — SERVICES — cinematic row reveal
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.svc-item').forEach((item, i) => {
    const icon = item.querySelector('.svc-icon');
    const name = item.querySelector('.svc-name');
    const desc = item.querySelector('.svc-desc');
    const num  = item.querySelector('.svc-num');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 88%',
        once: true
      }
    });

    /* Number label fades from left */
    tl.fromTo(num,
      { opacity: 0, x: -16 },
      { opacity: 1, x: 0, duration: 0.5, ease: EASE_SMOOTH },
      0
    )

    /* Icon drops in with spring */
    .fromTo(icon,
      { opacity: 0, scale: 0.5, rotate: -20, y: 20 },
      { opacity: 1, scale: 1, rotate: 0, y: 0, duration: 0.7, ease: EASE_SPRING },
      0.1
    )

    /* Service name clips up */
    .fromTo(name,
      { clipPath: CLIP_HIDDEN, y: 16, opacity: 0 },
      { clipPath: CLIP_VISIBLE, y: 0, opacity: 1, duration: 0.65, ease: EASE_CINEMA },
      0.2
    )

    /* Desc fades in with blur */
    .fromTo(desc,
      { opacity: 0, y: 12, filter: 'blur(4px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: EASE_SMOOTH },
      0.35
    );
  });

  /* ═══════════════════════════════════════════
     § 8 — WORK GRID — cinematic scale reveal
  ═══════════════════════════════════════════ */

  /* Section header */
  gsap.fromTo('.work-header > div',
    { opacity: 0, y: 40, filter: 'blur(8px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.work-header', start: 'top 85%', once: true }
    }
  );

  document.querySelectorAll('.work-card').forEach((card, i) => {
    /* Calculate stagger based on position */
    const col = i % 2;
    const row = Math.floor(i / 2);

    gsap.fromTo(card,
      {
        opacity: 0,
        y: 60 + row * 20,
        x: col === 0 ? -30 : 30,
        scale: 0.93,
        filter: 'blur(10px)'
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        duration: 1.0,
        ease: EASE_CINEMA,
        delay: i * 0.12,
        scrollTrigger: {
          trigger: '.work-grid',
          start: 'top 82%',
          once: true
        }
      }
    );

    /* Tilt on mouse */
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) *  8;
      const ry = ((cx - e.clientX) / rect.width)  *  8;
      gsap.to(card, { rotateX: rx, rotateY: ry, duration: 0.35, ease: 'power2.out', transformPerspective: 900 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: EASE_SPRING });
    });
  });

  /* ═══════════════════════════════════════════
     § 9 — TEAM SECTION ★ (most love)
  ═══════════════════════════════════════════ */

  /* Section headline — dramatic scale-up */
  gsap.fromTo('.team-section .section-title',
    { opacity: 0, y: 60, scale: 0.94, filter: 'blur(12px)' },
    {
      opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
      duration: 1.1, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.team-section .section-title', start: 'top 85%', once: true }
    }
  );

  /* Each team card: orchestrated multi-layer entrance */
  document.querySelectorAll('.team-card').forEach((card, i) => {
    const avatar   = card.querySelector('.tc-avatar');
    const initials = card.querySelector('.tc-initials');
    const name     = card.querySelector('.tc-name');
    const role     = card.querySelector('.tc-role');
    const bio      = card.querySelector('.tc-bio');
    const links    = card.querySelector('.tc-links');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '.team-grid',
        start: 'top 80%',
        once: true
      },
      delay: i * 0.18   /* cascade: left → center → right */
    });

    /* 1. Card frame rises in */
    tl.fromTo(card,
      { opacity: 0, y: 70, scale: 0.92, filter: 'blur(14px)' },
      { opacity: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.95, ease: EASE_CINEMA },
      0
    )

    /* 2. Avatar: circular clip-path expand from center */
    .fromTo(avatar,
      { clipPath: 'circle(0% at 50% 50%)', scale: 0.6, opacity: 0 },
      { clipPath: 'circle(60% at 50% 50%)', scale: 1, opacity: 1, duration: 0.75, ease: EASE_SPRING },
      0.22
    )

    /* 3. Initials letter-pop */
    .fromTo(initials,
      { opacity: 0, scale: 0.4, filter: 'blur(6px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.5, ease: EASE_RUBBER },
      0.52
    )

    /* 4. Name slides up from bottom */
    .fromTo(name,
      { clipPath: 'inset(100% 0 0 0)', y: 16, opacity: 0 },
      { clipPath: 'inset(0% 0 0 0)', y: 0, opacity: 1, duration: 0.6, ease: EASE_CINEMA },
      0.55
    )

    /* 5. Role tag fades + slides */
    .fromTo(role,
      { opacity: 0, x: -14, filter: 'blur(4px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, ease: EASE_SMOOTH },
      0.68
    )

    /* 6. Bio text cascades in */
    .fromTo(bio,
      { opacity: 0, y: 18, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.65, ease: EASE_CINEMA },
      0.78
    )

    /* 7. Link buttons pop in last */
    .fromTo(links ? links.querySelectorAll('.tc-link') : [],
      { opacity: 0, scale: 0.8, y: 10 },
      { opacity: 1, scale: 1, y: 0, stagger: 0.1, duration: 0.45, ease: EASE_RUBBER },
      0.90
    );

    /* Hover: 3D tilt on team cards */
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) *  7;
      const ry = ((cx - e.clientX) / rect.width)  * -7;
      gsap.to(card, {
        rotateX: rx, rotateY: ry,
        scale: 1.03,
        duration: 0.4, ease: 'power2.out',
        transformPerspective: 800,
        transformOrigin: 'center center'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0, rotateY: 0, scale: 1,
        duration: 0.9, ease: EASE_SPRING,
        transformOrigin: 'center center'
      });
    });
  });

  /* ═══════════════════════════════════════════
     § 10 — CONTACT SECTION
  ═══════════════════════════════════════════ */

  /* Left column: staggered slide from left */
  gsap.fromTo('.contact-left > *',
    { opacity: 0, x: -50, filter: 'blur(8px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)',
      stagger: 0.12, duration: 0.9, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.contact-inner', start: 'top 80%', once: true }
    }
  );

  /* Contact links stagger */
  gsap.fromTo('.cl-item',
    { opacity: 0, x: -24, filter: 'blur(4px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)',
      stagger: 0.1, duration: 0.65, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.contact-links', start: 'top 85%', once: true }
    }
  );

  /* Form: slides in from right + reveals rows sequentially */
  gsap.fromTo('.contact-form',
    { opacity: 0, x: 60, filter: 'blur(12px)' },
    {
      opacity: 1, x: 0, filter: 'blur(0px)',
      duration: 1.0, ease: EASE_CINEMA,
      scrollTrigger: { trigger: '.contact-form', start: 'top 82%', once: true }
    }
  );

  gsap.fromTo('.form-group',
    { opacity: 0, y: 28, filter: 'blur(6px)' },
    {
      opacity: 1, y: 0, filter: 'blur(0px)',
      stagger: 0.1, duration: 0.7, ease: EASE_SMOOTH,
      scrollTrigger: { trigger: '.contact-form', start: 'top 80%', once: true }
    }
  );

  gsap.fromTo('.btn-submit',
    { opacity: 0, scale: 0.88, y: 20 },
    {
      opacity: 1, scale: 1, y: 0,
      duration: 0.65, ease: EASE_RUBBER,
      scrollTrigger: { trigger: '.btn-submit', start: 'top 92%', once: true }
    }
  );

  /* ═══════════════════════════════════════════
     § 11 — PARALLAX (blobs + float tags)
  ═══════════════════════════════════════════ */
  document.querySelectorAll('.blob').forEach((blob, i) => {
    const speed = i % 2 === 0 ? 0.22 : -0.14;
    gsap.to(blob, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
    });
  });

  document.querySelectorAll('.float-tag').forEach((tag, i) => {
    const yMult = i % 2 === 0 ? -40 : -60;
    gsap.to(tag, {
      y: yMult,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.2 }
    });
  });

  /* ═══════════════════════════════════════════
     § 12 — MARQUEE
  ═══════════════════════════════════════════ */
  const items = [
    'Product Design', '3D & XR', 'Web Engineering', 'AI Products',
    'Brand Identity', 'Growth Strategy', 'Motion Design', 'Design Systems'
  ];
  const track = document.getElementById('mq-track');
  if (track) {
    const repeated = [...items, ...items, ...items, ...items];
    repeated.forEach(txt => {
      const div = document.createElement('div');
      div.className = 'mq-item';
      div.innerHTML = `<span class="mq-dot"></span>${txt}`;
      track.appendChild(div);
    });
  }

  /* ═══════════════════════════════════════════
     § 13 — SMOOTH ANCHOR SCROLL
  ═══════════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, { duration: 1.2, scrollTo: target, ease: 'power3.inOut' });
      }
    });
  });

  /* ═══════════════════════════════════════════
     § 14 — MOBILE NAV
  ═══════════════════════════════════════════ */
  const ham  = document.getElementById('hamburger');
  const mNav = document.getElementById('mobile-nav');

  window.closeMNav = function () {
    if (mNav) mNav.classList.remove('open');
    if (ham)  ham.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (ham && mNav) {
    ham.addEventListener('click', () => {
      const isOpen = mNav.classList.toggle('open');
      ham.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ═══════════════════════════════════════════
     § 15 — CONTACT FORM SUBMIT
  ═══════════════════════════════════════════ */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const btn  = document.querySelector('.btn-submit');
    const text = btn && btn.querySelector('.bs-text');
    if (!btn) return;

    gsap.timeline()
      .to(btn,  { scale: 0.94, duration: 0.12 })
      .to(btn,  { scale: 1.04, duration: 0.22, ease: EASE_RUBBER })
      .to(btn,  { scale: 1,    duration: 0.18 });

    gsap.to(btn, { background: '#4ECDC4', duration: 0.45 });
    if (text) {
      gsap.fromTo(text,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, delay: 0.1 }
      );
      text.textContent = 'Sent! ✓';
    }
    btn.style.pointerEvents = 'none';

    setTimeout(() => {
      if (text) text.textContent = 'Send it →';
      btn.style.pointerEvents = '';
      gsap.to(btn, { background: 'var(--text)', duration: 0.4 });
      e.target.reset();
    }, 3000);
  };

  /* ═══════════════════════════════════════════
     § 16 — FOOTER ENTRANCE
  ═══════════════════════════════════════════ */
  gsap.fromTo('.footer-inner > *',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0,
      stagger: 0.1, duration: 0.7, ease: EASE_CINEMA,
      scrollTrigger: { trigger: 'footer', start: 'top 92%', once: true }
    }
  );

})();