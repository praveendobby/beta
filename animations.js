/* ══════════════════════════════════════════════
   BETA STUDIO — ANIMATIONS.JS  (Cinematic Upgrade)
   Lunara-level scroll animations + effects
══════════════════════════════════════════════ */

(function () {

  /* Wait for GSAP */
  function waitGSAP(cb) {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') { cb(); }
    else { window.addEventListener('load', cb); }
  }

  waitGSAP(function () {

    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const EASE_CINEMA = 'expo.out';
    const EASE_SMOOTH = 'power4.out';
    const EASE_SPRING = 'elastic.out(1,.75)';
    const EASE_RUBBER = 'back.out(1.4)';
    const CLIP_H      = 'inset(0 0 100% 0)';
    const CLIP_V      = 'inset(0 0 0% 0)';

    /* ══════════════════════════════════════════
       § 1 — LOADER
    ══════════════════════════════════════════ */
    const loaderWords  = ['initializing', 'crafting', 'brewing ideas', 'almost there', 'ready'];
    let   wIdx = 0;
    const loaderBar  = document.getElementById('loader-bar');
    const loaderNum  = document.getElementById('loader-num');
    const loaderWord = document.getElementById('loader-word');
    const loader     = document.getElementById('loader');

    let progress = 0;
    const iv = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) { progress = 100; clearInterval(iv); setTimeout(hideLoader, 350); }
      if (loaderBar) loaderBar.style.width = progress + '%';
      if (loaderNum) loaderNum.textContent = Math.round(progress);
      const wi = Math.min(Math.floor(progress / 25), loaderWords.length - 1);
      if (wi !== wIdx && loaderWord) {
        wIdx = wi;
        gsap.fromTo(loaderWord,
          { opacity: 0, y: 10, filter: 'blur(4px)' },
          { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: EASE_SMOOTH }
        );
        loaderWord.textContent = loaderWords[wi];
      }
    }, 100);

    function hideLoader() {
      if (!loader) return;
      gsap.to(loader, {
        yPercent: -100, duration: 1.1, ease: EASE_SMOOTH,
        onComplete: () => { loader.style.display = 'none'; playHeroEntrance(); }
      });
    }

    /* ══════════════════════════════════════════
       § 2 — HERO ENTRANCE
    ══════════════════════════════════════════ */
    function playHeroEntrance() {
      const tl = gsap.timeline({ defaults: { ease: EASE_CINEMA } });

      tl
      .fromTo('#h-badge',
        { opacity: 0, y: 24, filter: 'blur(8px)', scale: 0.9 },
        { opacity: 1, y: 0, filter: 'blur(0px)', scale: 1, duration: 0.9 }, 0
      )
      .fromTo('#ht1',
        { clipPath: CLIP_H, y: 50, opacity: 0 },
        { clipPath: CLIP_V, y: 0, opacity: 1, duration: 1.05 }, 0.18
      )
      .fromTo('#ht2',
        { clipPath: CLIP_H, y: 60, opacity: 0 },
        { clipPath: CLIP_V, y: 0, opacity: 1, duration: 1.05 }, 0.34
      )
      .fromTo('#ht3',
        { clipPath: CLIP_H, y: 60, opacity: 0 },
        { clipPath: CLIP_V, y: 0, opacity: 1, duration: 1.05 }, 0.50
      )
      .fromTo('#h-sub',
        { opacity: 0, y: 30, filter: 'blur(6px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9 }, 0.70
      )
      .fromTo('#h-ctas',
        { opacity: 0, y: 24, filter: 'blur(4px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.8 }, 0.86
      )
      .fromTo('#hero-scroll',
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.7 }, 1.0
      )
      .fromTo(['#ft1','#ft2','#ft3','#ft4'],
        { opacity: 0, scale: 0.8, y: 24, filter: 'blur(6px)' },
        { opacity: 1, scale: 1, y: 0, filter: 'blur(0px)', stagger: 0.15, duration: 0.75 }, 0.95
      );

      /* Idle float for tags */
      ['#ft1','#ft2','#ft3','#ft4'].forEach((id, i) => {
        gsap.to(id, {
          y: '+=14', duration: 2.5 + i * 0.4,
          yoyo: true, repeat: -1, ease: 'sine.inOut', delay: i * 0.5
        });
      });
    }

    /* ══════════════════════════════════════════
       § 3 — SCROLL PROGRESS + NAV
    ══════════════════════════════════════════ */
    const scrollProg = document.getElementById('scroll-prog');
    const nav        = document.getElementById('nav');

    window.addEventListener('scroll', () => {
      const st = window.pageYOffset;
      const dh = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollProg && dh > 0) scrollProg.style.width = (st / dh * 100) + '%';
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });

    /* ══════════════════════════════════════════
       § 4 — SECTION LABELS — glitch scramble
    ══════════════════════════════════════════ */
    const chars = '!@#$%^&*▲◎⬡✦βΣΩ';
    document.querySelectorAll('.section-label').forEach(el => {
      const orig = el.textContent;

      /* clip-path wipe */
      gsap.fromTo(el,
        { clipPath: 'inset(0 100% 0 0)', opacity: 0 },
        {
          clipPath: 'inset(0 0% 0 0)', opacity: 1,
          duration: 0.85, ease: EASE_SMOOTH,
          scrollTrigger: { trigger: el, start: 'top 90%', once: true }
        }
      );

      ScrollTrigger.create({
        trigger: el, start: 'top 88%', once: true,
        onEnter: () => {
          let iter = 0;
          const glitch = setInterval(() => {
            el.textContent = orig.split('').map((c, i) =>
              i < iter ? c : (c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)])
            ).join('');
            if (iter >= orig.length) clearInterval(glitch);
            iter += 0.9;
          }, 30);
        }
      });
    });

    /* ══════════════════════════════════════════
       § 5 — HEADLINE CHARACTER SPLIT REVEAL
    ══════════════════════════════════════════ */
    function splitChars(el) {
      const text = el.textContent;
      el.innerHTML = '';
      [...text].forEach(ch => {
        const span = document.createElement('span');
        span.className = 'char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.display = 'inline-block';
        el.appendChild(span);
      });
      return el.querySelectorAll('.char');
    }

    document.querySelectorAll('.story-title .reveal-line, .contact-title .reveal-line').forEach((line, lineIdx) => {
      const chars = splitChars(line);
      gsap.fromTo(chars,
        { y: '110%', opacity: 0, rotateX: -80 },
        {
          y: '0%', opacity: 1, rotateX: 0,
          stagger: 0.025, duration: 0.9, ease: EASE_CINEMA,
          scrollTrigger: {
            trigger: line.closest('.story-title, .contact-title'),
            start: 'top 85%', once: true
          },
          delay: lineIdx * 0.1
        }
      );
    });

    /* ══════════════════════════════════════════
       § 6 — UNIVERSAL .reveal
    ══════════════════════════════════════════ */
    document.querySelectorAll('.reveal').forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 44, filter: 'blur(8px)' },
        {
          opacity: 1, y: 0, filter: 'blur(0px)',
          duration: 0.9, ease: EASE_CINEMA,
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        }
      );
    });

    /* ══════════════════════════════════════════
       § 7 — STORY SECTION
    ══════════════════════════════════════════ */
    gsap.fromTo('.story-text',
      { x: -70, opacity: 0, filter: 'blur(10px)' },
      {
        x: 0, opacity: 1, filter: 'blur(0px)',
        duration: 1.1, ease: EASE_CINEMA,
        scrollTrigger: { trigger: '.story-grid', start: 'top 76%', once: true }
      }
    );

    gsap.fromTo('.story-p',
      { opacity: 0, y: 32 },
      {
        opacity: 1, y: 0, stagger: 0.18, duration: 0.85, ease: EASE_CINEMA,
        scrollTrigger: { trigger: '.story-text', start: 'top 80%', once: true }
      }
    );

    gsap.fromTo('.sv-item',
      { opacity: 0, x: -30, filter: 'blur(4px)' },
      {
        opacity: 1, x: 0, filter: 'blur(0px)',
        stagger: 0.12, duration: 0.75, ease: EASE_SMOOTH,
        scrollTrigger: { trigger: '.story-values', start: 'top 84%', once: true }
      }
    );

    gsap.fromTo('.story-visual',
      { x: 70, opacity: 0, scale: 0.95, filter: 'blur(12px)' },
      {
        x: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
        duration: 1.1, ease: EASE_CINEMA,
        scrollTrigger: { trigger: '.story-grid', start: 'top 76%', once: true }
      }
    );

    gsap.fromTo('.stat-item',
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      {
        opacity: 1, y: 0, filter: 'blur(0px)',
        stagger: { amount: 0.5, ease: 'power2.inOut' },
        duration: 0.85, ease: EASE_CINEMA,
        scrollTrigger: { trigger: '.stats-row', start: 'top 84%', once: true }
      }
    );

    /* ══════════════════════════════════════════
       § 8 — NUMBER COUNTERS
    ══════════════════════════════════════════ */
    document.querySelectorAll('.counter').forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      if (isNaN(target)) return;
      ScrollTrigger.create({
        trigger: el, start: 'top 85%', once: true,
        onEnter: () => {
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target, duration: 2.4, ease: 'power2.out',
            onUpdate() { el.textContent = Math.round(obj.val); },
            onComplete() { el.textContent = target; }
          });
        }
      });
    });

    /* ══════════════════════════════════════════
       § 9 — SERVICES — row reveal
    ══════════════════════════════════════════ */
    document.querySelectorAll('.svc-item').forEach((item) => {
      const icon = item.querySelector('.svc-icon');
      const name = item.querySelector('.svc-name');
      const desc = item.querySelector('.svc-desc');
      const num  = item.querySelector('.svc-num');

      const tl = gsap.timeline({ scrollTrigger: { trigger: item, start: 'top 88%', once: true } });

      tl
      .fromTo(num,  { opacity:0, x:-16 },
                    { opacity:1, x:0, duration:0.5, ease:EASE_SMOOTH }, 0)
      .fromTo(icon, { opacity:0, scale:0.4, rotate:-25, y:20 },
                    { opacity:1, scale:1, rotate:0, y:0, duration:0.75, ease:EASE_SPRING }, 0.1)
      .fromTo(name, { clipPath:CLIP_H, y:16, opacity:0 },
                    { clipPath:CLIP_V, y:0, opacity:1, duration:0.65, ease:EASE_CINEMA }, 0.2)
      .fromTo(desc, { opacity:0, y:12, filter:'blur(4px)' },
                    { opacity:1, y:0, filter:'blur(0px)', duration:0.6, ease:EASE_SMOOTH }, 0.35);
    });

    /* ══════════════════════════════════════════
       § 10 — WORK GRID
    ══════════════════════════════════════════ */
    gsap.fromTo('.work-header > div',
      { opacity:0, y:40, filter:'blur(8px)' },
      {
        opacity:1, y:0, filter:'blur(0px)', duration:0.9, ease:EASE_CINEMA,
        scrollTrigger:{ trigger:'.work-header', start:'top 85%', once:true }
      }
    );

    document.querySelectorAll('.work-card').forEach((card, i) => {
      const col = i % 2, row = Math.floor(i / 2);
      gsap.fromTo(card,
        { opacity:0, y:70+row*20, x:col===0?-30:30, scale:0.92, filter:'blur(10px)' },
        {
          opacity:1, y:0, x:0, scale:1, filter:'blur(0px)',
          duration:1.05, ease:EASE_CINEMA, delay:i*0.13,
          scrollTrigger:{ trigger:'.work-grid', start:'top 82%', once:true }
        }
      );

      /* 3D tilt */
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height/2) / r.height) *  9;
        const ry = ((r.left + r.width/2 - e.clientX)  / r.width)  *  9;
        gsap.to(card, { rotateX:rx, rotateY:ry, duration:0.3, ease:'power2.out', transformPerspective:900 });
      });
      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX:0, rotateY:0, duration:0.8, ease:EASE_SPRING });
      });
    });

    /* ══════════════════════════════════════════
       § 11 — TEAM CARDS ★
    ══════════════════════════════════════════ */
    document.querySelectorAll('.team-card').forEach((card, i) => {
      const avatar   = card.querySelector('.tc-avatar');
      const initials = card.querySelector('.tc-initials');
      const name     = card.querySelector('.tc-name');
      const role     = card.querySelector('.tc-role');
      const bio      = card.querySelector('.tc-bio');
      const links    = card.querySelectorAll('.tc-link');
      const glow     = card.querySelector('.tc-glow');

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.team-grid', start: 'top 80%', once: true },
        delay: i * 0.2
      });

      tl
      .fromTo(card,
        { opacity:0, y:80, scale:0.9, filter:'blur(14px)', rotateX:15 },
        { opacity:1, y:0, scale:1, filter:'blur(0px)', rotateX:0, duration:1.0, ease:EASE_CINEMA }, 0
      )
      .fromTo(avatar,
        { clipPath:'circle(0% at 50% 50%)', scale:0.5, opacity:0 },
        { clipPath:'circle(60% at 50% 50%)', scale:1, opacity:1, duration:0.8, ease:EASE_SPRING }, 0.25
      )
      .fromTo(initials,
        { opacity:0, scale:0.3, filter:'blur(8px)' },
        { opacity:1, scale:1, filter:'blur(0px)', duration:0.55, ease:EASE_RUBBER }, 0.55
      )
      .fromTo(name,
        { clipPath:'inset(100% 0 0 0)', y:20, opacity:0 },
        { clipPath:'inset(0% 0 0 0)', y:0, opacity:1, duration:0.65, ease:EASE_CINEMA }, 0.60
      )
      .fromTo(role,
        { opacity:0, x:-18, filter:'blur(4px)' },
        { opacity:1, x:0, filter:'blur(0px)', duration:0.55, ease:EASE_SMOOTH }, 0.73
      )
      .fromTo(bio,
        { opacity:0, y:20, filter:'blur(6px)' },
        { opacity:1, y:0, filter:'blur(0px)', duration:0.65, ease:EASE_CINEMA }, 0.82
      )
      .fromTo(links,
        { opacity:0, scale:0.75, y:12 },
        { opacity:1, scale:1, y:0, stagger:0.1, duration:0.5, ease:EASE_RUBBER }, 0.94
      );

      /* 3D tilt on team cards */
      card.addEventListener('mousemove', e => {
        const r  = card.getBoundingClientRect();
        const rx = ((e.clientY - r.top  - r.height/2) / r.height) *  8;
        const ry = ((r.left + r.width/2 - e.clientX)  / r.width)  * -8;

        gsap.to(card, {
          rotateX:rx, rotateY:ry, scale:1.03,
          duration:0.35, ease:'power2.out',
          transformPerspective:800
        });

        /* Move glow spot */
        if (glow) {
          glow.style.left = (e.clientX - r.left) + 'px';
          glow.style.top  = (e.clientY - r.top)  + 'px';
        }
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(card, { rotateX:0, rotateY:0, scale:1, duration:0.9, ease:EASE_SPRING });
      });
    });

    /* ══════════════════════════════════════════
       § 12 — CONTACT SECTION
    ══════════════════════════════════════════ */
    gsap.fromTo('.contact-left > *',
      { opacity:0, x:-55, filter:'blur(8px)' },
      {
        opacity:1, x:0, filter:'blur(0px)',
        stagger:0.12, duration:0.9, ease:EASE_CINEMA,
        scrollTrigger:{ trigger:'.contact-inner', start:'top 80%', once:true }
      }
    );

    gsap.fromTo('.cl-item',
      { opacity:0, x:-28, filter:'blur(4px)' },
      {
        opacity:1, x:0, filter:'blur(0px)',
        stagger:0.1, duration:0.65, ease:EASE_CINEMA,
        scrollTrigger:{ trigger:'.contact-links', start:'top 85%', once:true }
      }
    );

    gsap.fromTo('.contact-form',
      { opacity:0, x:65, filter:'blur(12px)' },
      {
        opacity:1, x:0, filter:'blur(0px)',
        duration:1.05, ease:EASE_CINEMA,
        scrollTrigger:{ trigger:'.contact-form', start:'top 82%', once:true }
      }
    );

    gsap.fromTo('.form-group',
      { opacity:0, y:28, filter:'blur(6px)' },
      {
        opacity:1, y:0, filter:'blur(0px)',
        stagger:0.1, duration:0.7, ease:EASE_SMOOTH,
        scrollTrigger:{ trigger:'.contact-form', start:'top 80%', once:true }
      }
    );

    gsap.fromTo('.btn-submit',
      { opacity:0, scale:0.85, y:24 },
      {
        opacity:1, scale:1, y:0, duration:0.7, ease:EASE_RUBBER,
        scrollTrigger:{ trigger:'.btn-submit', start:'top 92%', once:true }
      }
    );

    /* ══════════════════════════════════════════
       § 13 — PARALLAX
    ══════════════════════════════════════════ */
    document.querySelectorAll('.blob').forEach((blob, i) => {
      gsap.to(blob, {
        yPercent: i % 2 === 0 ? 22 : -14,
        ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 2 }
      });
    });

    /* ══════════════════════════════════════════
       § 14 — MARQUEE
    ══════════════════════════════════════════ */
    const items = [
      'Product Design', '3D & XR', 'Web Engineering', 'AI Products',
      'Brand Identity', 'Growth Strategy', 'Motion Design', 'Design Systems'
    ];
    const track = document.getElementById('mq-track');
    if (track) {
      const reps = [...items, ...items, ...items, ...items];
      reps.forEach(txt => {
        const div = document.createElement('div');
        div.className = 'mq-item';
        div.innerHTML = `<span class="mq-dot"></span>${txt}`;
        track.appendChild(div);
      });
    }

    /* ══════════════════════════════════════════
       § 15 — SMOOTH ANCHOR SCROLL
    ══════════════════════════════════════════ */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          gsap.to(window, { duration: 1.3, scrollTo: target, ease: 'power3.inOut' });
        }
      });
    });

    /* ══════════════════════════════════════════
       § 16 — MOBILE NAV
    ══════════════════════════════════════════ */
    const ham  = document.getElementById('hamburger');
    const mNav = document.getElementById('mobile-nav');

    window.closeMNav = function () {
      if (mNav) mNav.classList.remove('open');
      if (ham)  ham.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (ham && mNav) {
      ham.addEventListener('click', () => {
        const open = mNav.classList.toggle('open');
        ham.classList.toggle('active', open);
        document.body.style.overflow = open ? 'hidden' : '';
      });
    }

    /* ══════════════════════════════════════════
       § 17 — CONTACT FORM SUBMIT
    ══════════════════════════════════════════ */
    window.handleSubmit = function (e) {
      e.preventDefault();
      const btn  = document.querySelector('.btn-submit');
      const text = btn && btn.querySelector('.bs-text');
      if (!btn) return;

      /* Ripple */
      const r = document.createElement('span');
      r.className = 'btn-ripple';
      r.style.cssText = `width:${btn.offsetWidth*2}px;height:${btn.offsetWidth*2}px;left:50%;top:50%;margin-left:-${btn.offsetWidth}px;margin-top:-${btn.offsetWidth}px;`;
      btn.appendChild(r);
      setTimeout(() => r.remove(), 700);

      gsap.timeline()
        .to(btn, { scale:0.93, duration:0.1 })
        .to(btn, { scale:1.05, duration:0.25, ease:EASE_RUBBER })
        .to(btn, { scale:1, duration:0.2 });

      gsap.to(btn, { background:'#4ECDC4', duration:0.4 });
      if (text) {
        gsap.fromTo(text,
          { opacity:0, y:10 },
          { opacity:1, y:0, duration:0.35, delay:0.12 }
        );
        text.textContent = 'Sent! ✓';
      }
      btn.style.pointerEvents = 'none';

      setTimeout(() => {
        if (text) text.textContent = 'Send it →';
        btn.style.pointerEvents = '';
        gsap.to(btn, { background:'var(--text)', duration:0.4 });
        e.target.reset();
      }, 3000);
    };

    /* ══════════════════════════════════════════
       § 18 — FOOTER ENTRANCE
    ══════════════════════════════════════════ */
    gsap.fromTo('.footer-inner > *',
      { opacity:0, y:28 },
      {
        opacity:1, y:0, stagger:0.12, duration:0.75, ease:EASE_CINEMA,
        scrollTrigger:{ trigger:'footer', start:'top 92%', once:true }
      }
    );

    /* ══════════════════════════════════════════
       § 19 — SECTION BG SHIFT on scroll
    ══════════════════════════════════════════ */
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter:     () => sec.style.transition = 'background .5s',
        onEnterBack: () => sec.style.transition = 'background .5s',
      });
    });

  }); // end waitGSAP

})();