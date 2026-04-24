/* ══════════════════════════════════════════════
   BETA STUDIO — MAIN.JS
   Handles: Custom Cursor · Magnetic Buttons
   Everything else is handled by animations.js
══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ─────────────────────────────────────────────
     CUSTOM CURSOR
     Smooth lagging ring + snappy dot
  ───────────────────────────────────────────── */
  const dot  = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let isHovering = false;

  /* Dot follows mouse exactly */
  window.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (dot) {
      dot.style.left = mouseX + 'px';
      dot.style.top  = mouseY + 'px';
    }
  });

  /* Ring lags behind with lerp */
  function animateCursor() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) {
      ring.style.left = ringX + 'px';
      ring.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* Hover state — expand ring on interactive elements */
  const hoverTargets = 'a, button, [data-magnetic], .svc-item, .work-card, .team-card, .tc-link, input, textarea';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => {
      document.body.classList.add('hover-active');
    });
    el.addEventListener('mouseleave', () => {
      document.body.classList.remove('hover-active');
    });
  });

  /* Hide cursor when leaving window */
  document.addEventListener('mouseleave', () => {
    if (dot)  dot.style.opacity  = '0';
    if (ring) ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (dot)  dot.style.opacity  = '1';
    if (ring) ring.style.opacity = '1';
  });

  /* ─────────────────────────────────────────────
     MAGNETIC BUTTONS
     Elements with [data-magnetic] pull toward cursor
  ───────────────────────────────────────────── */
  document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', e => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width  / 2;
      const y = e.clientY - rect.top  - rect.height / 2;
      el.style.transform    = `translate(${x * 0.22}px, ${y * 0.28}px)`;
      el.style.transition   = 'transform 0.1s ease';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform  = 'translate(0, 0)';
      el.style.transition = 'transform 0.6s cubic-bezier(0.22,1,0.36,1)';
    });
  });

});