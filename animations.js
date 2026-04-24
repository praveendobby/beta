/* ══════════════════════════════════════════════
   ANIMATIONS.JS — GSAP Scroll + Reveal Magic
══════════════════════════════════════════════ */

(function () {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  /* ── Loader ──────────────────────────────────── */
  const loaderWords = ['initializing', 'crafting', 'brewing ideas', 'almost there', 'ready'];
  let loaderWordIdx = 0;
  const loaderBar = document.getElementById('loader-bar');
  const loaderNum = document.getElementById('loader-num');
  const loaderWordEl = document.getElementById('loader-word');
  const loader = document.getElementById('loader');

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
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3 }
      );
      loaderWordEl.textContent = loaderWords[wi];
    }
  }, 120);

  function hideLoader() {
    if (!loader) return;
    gsap.to(loader, {
      yPercent: -100,
      duration: 0.9,
      ease: 'power3.inOut',
      onComplete: () => {
        loader.style.display = 'none';
        playHeroEntrance();
      }
    });
  }

  /* ── Hero Entrance ───────────────────────────── */
  function playHeroEntrance() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('#h-badge', { opacity: 1, y: 0, duration: 0.8 }, 0)
      .fromTo('#ht1', { y: '110%' }, { y: '0%', duration: 0.9 }, 0.15)
      .fromTo('#ht2', { y: '110%' }, { y: '0%', duration: 0.9 }, 0.3)
      .fromTo('#ht3', { y: '110%' }, { y: '0%', duration: 0.9 }, 0.45)
      .to('#h-sub', { opacity: 1, y: 0, duration: 0.8 }, 0.65)
      .to('#h-ctas', { opacity: 1, y: 0, duration: 0.7 }, 0.8)
      .to('#hero-scroll', { opacity: 1, duration: 0.6 }, 1.0)
      .to(['#ft1', '#ft2', '#ft3', '#ft4'], {
        opacity: 1, y: 0, stagger: 0.12, duration: 0.6
      }, 0.9);
  }

  /* ── Scroll Progress Bar ─────────────────────── */
  const scrollProg = document.getElementById('scroll-prog');
  window.addEventListener('scroll', () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    const dh = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollProg && dh > 0) scrollProg.style.width = (st / dh * 100) + '%';
  });

  /* ── Nav Scroll State ────────────────────────── */
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
  });

  /* ── Scroll-Reveal Elements ──────────────────── */
  document.querySelectorAll('.reveal').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 40 },
      {
        opacity: 1, y: 0, duration: 0.85, ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none'
        }
      }
    );
  });

  /* ── Reveal lines (story title) ──────────────── */
  document.querySelectorAll('.reveal-line').forEach(line => {
    const inner = line.querySelector('*') || line;
    gsap.fromTo(inner,
      { y: '110%', opacity: 0 },
      {
        y: '0%', opacity: 1, duration: 0.9, ease: 'power3.out',
        scrollTrigger: {
          trigger: line,
          start: 'top 90%',
        }
      }
    );
  });

  /* ── Number Counters ─────────────────────────── */
  document.querySelectorAll('.counter').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.fromTo({ val: 0 }, { val: target }, {
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function () { el.textContent = Math.round(this.targets()[0].val); }
        });
      }
    });
  });

  /* ── Marquee ─────────────────────────────────── */
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

  /* ── Work Card Tilt ──────────────────────────── */
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const rx = ((e.clientY - cy) / rect.height) * 8;
      const ry = ((cx - e.clientX) / rect.width) * 8;
      gsap.to(card, {
        rotateX: rx, rotateY: ry, duration: 0.4,
        ease: 'power2.out', transformPerspective: 900
      });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.6, ease: 'elastic.out(1,0.75)' });
    });
  });

  /* ── Parallax Blobs ──────────────────────────── */
  document.querySelectorAll('.blob').forEach((blob, i) => {
    const speed = (i % 2 === 0) ? 0.18 : -0.12;
    gsap.to(blob, {
      yPercent: speed * 100,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1.5 }
    });
  });

  /* ── Float Tags subtle parallax ─────────────── */
  document.querySelectorAll('.float-tag').forEach((tag, i) => {
    const yMult = i % 2 === 0 ? -30 : -50;
    gsap.to(tag, {
      y: yMult,
      ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }
    });
  });

  /* ── Service Items hover bar ─────────────────── */
  document.querySelectorAll('.svc-item').forEach((item, i) => {
    gsap.fromTo(item,
      { opacity: 0, x: -30 },
      {
        opacity: 1, x: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out',
        scrollTrigger: { trigger: item, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  /* ── Team Cards stagger ──────────────────────── */
  gsap.fromTo('.team-card',
    { opacity: 0, y: 50, scale: 0.96 },
    {
      opacity: 1, y: 0, scale: 1,
      stagger: 0.15, duration: 0.7, ease: 'power3.out',
      scrollTrigger: { trigger: '.team-grid', start: 'top 82%', toggleActions: 'play none none none' }
    }
  );

  /* ── Stat items horizontal slide ─────────────── */
  gsap.fromTo('.stat-item',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, stagger: 0.1, duration: 0.6, ease: 'power2.out',
      scrollTrigger: { trigger: '.stats-row', start: 'top 85%', toggleActions: 'play none none none' }
    }
  );

  /* ── Smooth anchor scroll ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        gsap.to(window, { duration: 1.0, scrollTo: target, ease: 'power3.inOut' });
      }
    });
  });

  /* ── Mobile Nav toggle ───────────────────────── */
  const ham = document.getElementById('hamburger');
  const mNav = document.getElementById('mobile-nav');
  window.closeMNav = function () {
    if (mNav) mNav.classList.remove('open');
    if (ham) ham.classList.remove('active');
    document.body.style.overflow = '';
  };
  if (ham && mNav) {
    ham.addEventListener('click', () => {
      const isOpen = mNav.classList.toggle('open');
      ham.classList.toggle('active', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
  }

  /* ── Contact form submit ─────────────────────── */
  window.handleSubmit = function (e) {
    e.preventDefault();
    const btn = document.querySelector('.btn-submit');
    const text = btn.querySelector('.bs-text');
    if (!btn) return;
    gsap.to(btn, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    text.textContent = 'Sent! ✓';
    btn.style.pointerEvents = 'none';
    gsap.to(btn, { background: '#4ECDC4', duration: 0.4 });
    setTimeout(() => {
      text.textContent = 'Send it →';
      btn.style.pointerEvents = '';
      gsap.to(btn, { background: 'var(--text)', duration: 0.4 });
      e.target.reset();
    }, 3000);
  };

  /* ── Horizontal scroll for work section ─────── */
  // Story section pinned text parallax
  gsap.fromTo('.story-text',
    { x: -40, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-grid', start: 'top 75%' }
    }
  );
  gsap.fromTo('.story-visual',
    { x: 40, opacity: 0 },
    {
      x: 0, opacity: 1, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.story-grid', start: 'top 75%' }
    }
  );

  /* ── Section label glitch animate ───────────── */
  document.querySelectorAll('.section-label').forEach(el => {
    const orig = el.textContent;
    const chars = '!@#$%^&*▲◎⬡✦';
    ScrollTrigger.create({
      trigger: el,
      start: 'top 88%',
      once: true,
      onEnter: () => {
        let iter = 0;
        const iv = setInterval(() => {
          el.textContent = orig.split('').map((c, i) =>
            i < iter ? c : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
          ).join('');
          if (iter >= orig.length) clearInterval(iv);
          iter += 0.8;
        }, 35);
      }
    });
  });

})();