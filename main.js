// BETA STUDIO — MAIN CONTROLLER

document.addEventListener("DOMContentLoaded", () => {
  console.log("Main loaded");

  /* ─────────────────────────────────────────────
     LOADER SYSTEM (FIXED — NO MORE 0%)
  ───────────────────────────────────────────── */
  const loader = document.getElementById("loader");
  const bar = document.getElementById("loader-bar");
  const num = document.getElementById("loader-num");
  const word = document.getElementById("loader-word");

  const words = ["initializing", "loading assets", "building magic", "almost ready"];
  let progress = 0;

  function updateLoader() {
    progress += Math.random() * 8 + 2;

    if (progress >= 100) progress = 100;

    if (bar) bar.style.width = progress + "%";
    if (num) num.textContent = Math.floor(progress);

    // change words dynamically
    if (word) {
      const idx = Math.floor((progress / 100) * words.length);
      word.textContent = words[Math.min(idx, words.length - 1)];
    }

    if (progress < 100) {
      requestAnimationFrame(updateLoader);
    } else {
      setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => {
          loader.style.display = "none";
        }, 500);
      }, 400);
    }
  }

  updateLoader();

  /* ─────────────────────────────────────────────
     SCROLL PROGRESS BAR
  ───────────────────────────────────────────── */
  const scrollProg = document.getElementById("scroll-prog");

  window.addEventListener("scroll", () => {
    const scrollTop = window.scrollY;
    const height = document.body.scrollHeight - window.innerHeight;
    const percent = (scrollTop / height) * 100;

    if (scrollProg) scrollProg.style.width = percent + "%";
  });

  /* ─────────────────────────────────────────────
     CUSTOM CURSOR
  ───────────────────────────────────────────── */
  const dot = document.getElementById("cur-dot");
  const ring = document.getElementById("cur-ring");

  let mouseX = 0,
    mouseY = 0;
  let ringX = 0,
    ringY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) {
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
    }
  });

  function animateCursor() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    if (ring) {
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
    }

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  /* ─────────────────────────────────────────────
     MAGNETIC BUTTONS
  ───────────────────────────────────────────── */
  const magneticEls = document.querySelectorAll("[data-magnetic]");

  magneticEls.forEach((el) => {
    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      el.style.transform = `translate(${x * 0.2}px, ${y * 0.3}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });

  /* ─────────────────────────────────────────────
     NAV SCROLL EFFECT
  ───────────────────────────────────────────── */
  const nav = document.getElementById("nav");

  window.addEventListener("scroll", () => {
    if (!nav) return;

    if (window.scrollY > 50) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  });

  /* ─────────────────────────────────────────────
     MOBILE MENU
  ───────────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const mobileNav = document.getElementById("mobile-nav");

  if (hamburger && mobileNav) {
    hamburger.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
    });
  }

  window.closeMNav = function () {
    if (mobileNav) mobileNav.classList.remove("open");
  };

  /* ─────────────────────────────────────────────
     COUNTER ANIMATION
  ───────────────────────────────────────────── */
  const counters = document.querySelectorAll(".counter");

  const runCounter = (el) => {
    const target = +el.getAttribute("data-target");
    let count = 0;

    const step = target / 80;

    function update() {
      count += step;

      if (count < target) {
        el.textContent = Math.floor(count);
        requestAnimationFrame(update);
      } else {
        el.textContent = target;
      }
    }

    update();
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        runCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  });

  counters.forEach((c) => observer.observe(c));

  /* ─────────────────────────────────────────────
     FORM HANDLER (SAFE)
  ───────────────────────────────────────────── */
  window.handleSubmit = function (e) {
    e.preventDefault();

    alert("Message sent! (demo)");

    e.target.reset();
  };
});