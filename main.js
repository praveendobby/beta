/* ══════════════════════════════════════════════
   BETA STUDIO — MAIN.JS  (Enhanced)
   Custom Cursor · Magnetic Buttons · Hover Effects
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════════════════════
     CUSTOM CURSOR
  ════════════════════════════════════════════ */
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let visible = false;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (!visible) {
      visible = true;
      if (dot)  dot.style.opacity  = '1';
      if (ring) ring.style.opacity = '1';
    }

    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    }
  }, { passive: true });

  /* Ring lags with lerp */
  (function animRing() {
    ringX += (mouseX - ringX) * 0.11;
    ringY += (mouseY - ringY) * 0.11;
    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animRing);
  })();

  /* Hide when out of window */
  document.addEventListener('mouseleave', () => {
    if (dot)  dot.style.opacity  = '0';
    if (ring) ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (dot)  dot.style.opacity  = '1';
    if (ring) ring.style.opacity = '1';
  });

  /* Click effect */
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  /* Hover state on interactive elements */
  const hoverSel = 'a, button, [data-magnetic], .svc-item, .work-card, .team-card, .mq-item, label';
  document.querySelectorAll(hoverSel).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  /* Text cursor on inputs & textareas */
  document.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.remove('cursor-hover');
      document.body.classList.add('cursor-text');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('cursor-text');
    });
  });

  /* ════════════════════════════════════════════
     MAGNETIC BUTTONS
  ════════════════════════════════════════════ */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    const strength = parseFloat(el.dataset.magneticStrength || '0.25');

    el.addEventListener('mousemove', e => {
      const r  = el.getBoundingClientRect();
      const x  = e.clientX - r.left - r.width  / 2;
      const y  = e.clientY - r.top  - r.height / 2;
      el.style.transform  = `translate(${x * strength}px, ${y * (strength * 1.2)}px)`;
      el.style.transition = 'transform 0.08s ease';
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = 'transform 0.65s cubic-bezier(0.22,1,0.36,1)';
    });
  });

  /* ════════════════════════════════════════════
     SERVICE ITEM — SPOTLIGHT HOVER
  ════════════════════════════════════════════ */
  document.querySelectorAll('.svc-item').forEach(item => {
    item.addEventListener('mousemove', e => {
      const r  = item.getBoundingClientRect();
      const x  = ((e.clientX - r.left) / r.width)  * 100;
      const y  = ((e.clientY - r.top)  / r.height) * 100;
      item.style.setProperty('--mx', x + '%');
      item.style.setProperty('--my', y + '%');
    });
  });

  /* ════════════════════════════════════════════
     WORK CARD — CURSOR COLOUR BLEND
  ════════════════════════════════════════════ */
  document.querySelectorAll('.work-card').forEach(card => {
    const accent = card.dataset.color || '#FF6B47';
    card.addEventListener('mouseenter', () => {
      if (ring) ring.style.borderColor = accent + '66';
      if (dot)  dot.style.background   = accent;
    });
    card.addEventListener('mouseleave', () => {
      if (ring) ring.style.borderColor = '';
      if (dot)  dot.style.background   = '';
    });
  });

  /* ════════════════════════════════════════════
     NAV ACTIVE LINK TRACKING
  ════════════════════════════════════════════ */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (link) link.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => io.observe(s));

  /* ════════════════════════════════════════════
     FOOTER YEAR
  ════════════════════════════════════════════ */
  const yearEl = document.querySelector('.footer-mid p');
  if (yearEl) {
    yearEl.textContent = yearEl.textContent.replace('2025', new Date().getFullYear());
  }

  /* ════════════════════════════════════════════
     LAZY-RESIZE: refresh ScrollTrigger
  ════════════════════════════════════════════ */
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') {
        ScrollTrigger.refresh();
      }
    }, 250);
  });

});