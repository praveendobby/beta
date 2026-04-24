/* ══════════════════════════════════════════════
   BETA STUDIO — HERO3D.JS
   Three.js scenes: Hero · Story · Work Cards
   Team Avatars · Loader Canvas
══════════════════════════════════════════════ */

(function () {

  /* ── Shared noise function ─────────────────── */
  function simplex(x, y, t) {
    return (
      Math.sin(x * 1.5 + t) * Math.cos(y * 1.5 - t * 0.7) * 0.5 +
      Math.sin(x * 0.8 - t * 0.5) * Math.sin(y * 2.1 + t * 0.3) * 0.3
    );
  }

  /* ══════════════════════════════════════════
     § 1 — HERO CANVAS
  ══════════════════════════════════════════ */
  const heroCanvas = document.getElementById('hero-canvas');
  if (!heroCanvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas: heroCanvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(heroCanvas.offsetWidth, heroCanvas.offsetHeight);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, heroCanvas.offsetWidth / heroCanvas.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 6);

  /* Lights */
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  const dirL = new THREE.DirectionalLight(0xFF6B47, 1.8);
  dirL.position.set(5, 5, 5);
  scene.add(dirL);

  const dirL2 = new THREE.DirectionalLight(0x7C6FCD, 1.4);
  dirL2.position.set(-5, -3, 3);
  scene.add(dirL2);

  const pL = new THREE.PointLight(0x4ECDC4, 2, 20);
  pL.position.set(0, 3, 3);
  scene.add(pL);

  /* Morphing icosahedron */
  const geo = new THREE.IcosahedronGeometry(1.6, 5);
  const posAttr = geo.attributes.position;
  const originalPositions = Float32Array.from(posAttr.array);
  const noiseOffsets = [];
  for (let i = 0; i < posAttr.count; i++) {
    noiseOffsets.push(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * 6 + 1
    );
  }

  const mat = new THREE.MeshPhongMaterial({
    color: 0xFDFCF8, emissive: 0xFF6B47, emissiveIntensity: 0.06,
    shininess: 80, transparent: true, opacity: 0.92
  });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  /* Wireframe overlay */
  const wireMesh = new THREE.Mesh(
    new THREE.IcosahedronGeometry(1.62, 5),
    new THREE.MeshBasicMaterial({ color: 0xFF6B47, wireframe: true, transparent: true, opacity: 0.08 })
  );
  scene.add(wireMesh);

  /* Floating particles */
  const pCount = 180;
  const pGeo = new THREE.BufferGeometry();
  const pPositions = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount; i++) {
    const r     = 3.5 + Math.random() * 3;
    const theta = Math.random() * Math.PI * 2;
    const phi   = Math.acos(2 * Math.random() - 1);
    pPositions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
    pPositions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pPositions[i * 3 + 2] = r * Math.cos(phi);
  }
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
  const particles = new THREE.Points(
    pGeo,
    new THREE.PointsMaterial({ size: 0.04, color: 0xFF6B47, transparent: true, opacity: 0.5 })
  );
  scene.add(particles);

  /* Orbit rings */
  function makeRing(r, color, opacity, tilt) {
    const mesh = new THREE.Mesh(
      new THREE.TorusGeometry(r, 0.006, 8, 80),
      new THREE.MeshBasicMaterial({ color, transparent: true, opacity })
    );
    mesh.rotation.x = tilt;
    return mesh;
  }
  const ring1 = makeRing(2.4, 0xFF6B47, 0.25,  1.1);
  const ring2 = makeRing(3.0, 0x7C6FCD, 0.18,  0.4);
  const ring3 = makeRing(2.7, 0x4ECDC4, 0.15, -0.8);
  scene.add(ring1, ring2, ring3);

  /* Mouse tracking */
  let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = -(e.clientY / window.innerHeight - 0.5) * 2;
  });

  /* Hero animate loop */
  function heroAnimate(timestamp) {
    requestAnimationFrame(heroAnimate);
    const t = timestamp * 0.001;

    /* Morph */
    for (let i = 0; i < posAttr.count; i++) {
      const ox = originalPositions[i * 3];
      const oy = originalPositions[i * 3 + 1];
      const oz = originalPositions[i * 3 + 2];
      const n  = simplex(ox, oy, t * 0.4 + noiseOffsets[i * 3]) * 0.28;
      posAttr.array[i * 3]     = ox * (1 + n);
      posAttr.array[i * 3 + 1] = oy * (1 + n * 0.9);
      posAttr.array[i * 3 + 2] = oz * (1 + n * 0.8);
    }
    posAttr.needsUpdate = true;
    geo.computeVertexNormals();

    /* Slow colour cycle */
    mat.color.lerp(new THREE.Color().setHSL((t * 0.04) % 1, 0.6, 0.92), 0.01);

    /* Mouse follow */
    targetX += (mouseX * 0.35 - targetX) * 0.06;
    targetY += (mouseY * 0.35 - targetY) * 0.06;
    mesh.rotation.y = targetX * 0.8 + t * 0.06;
    mesh.rotation.x = targetY * 0.5 + Math.sin(t * 0.25) * 0.12;
    wireMesh.rotation.copy(mesh.rotation);

    /* Rings */
    ring1.rotation.z = t * 0.25;
    ring2.rotation.z = -t * 0.18;
    ring3.rotation.y = t * 0.2;
    ring1.rotation.y = targetX * 0.5;
    ring2.rotation.x = targetY * 0.3 + 0.4;

    /* Particles */
    particles.rotation.y = t * 0.04;
    particles.rotation.x = t * 0.02;

    /* Light pulse */
    pL.intensity = 1.5 + Math.sin(t * 1.5) * 0.8;

    renderer.render(scene, camera);
  }
  heroAnimate(0);

  window.addEventListener('resize', () => {
    const w = heroCanvas.offsetWidth, h = heroCanvas.offsetHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  });

  /* ══════════════════════════════════════════
     § 2 — STORY CANVAS (torus knot)
  ══════════════════════════════════════════ */
  const storyCanvas = document.getElementById('story-canvas');
  if (storyCanvas) {
    const sr = new THREE.WebGLRenderer({ canvas: storyCanvas, antialias: true, alpha: true });
    sr.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    sr.setSize(storyCanvas.offsetWidth, storyCanvas.offsetHeight);

    const ss = new THREE.Scene();
    const sc = new THREE.PerspectiveCamera(60, storyCanvas.offsetWidth / storyCanvas.offsetHeight, 0.1, 50);
    sc.position.z = 5;

    ss.add(new THREE.AmbientLight(0xffffff, 0.8));
    const pl2 = new THREE.PointLight(0xFF6B47, 2.5, 15);
    pl2.position.set(3, 3, 3); ss.add(pl2);
    const pl3 = new THREE.PointLight(0x7C6FCD, 2, 12);
    pl3.position.set(-3, -2, 2); ss.add(pl3);

    const tkGeo = new THREE.TorusKnotGeometry(1, 0.35, 120, 16, 2, 3);
    const tk = new THREE.Mesh(tkGeo, new THREE.MeshPhongMaterial({
      color: 0xFFDDD5, emissive: 0xFF6B47, emissiveIntensity: 0.12,
      shininess: 100, transparent: true, opacity: 0.9
    }));
    ss.add(tk);

    const tkWire = new THREE.Mesh(tkGeo, new THREE.MeshBasicMaterial({
      color: 0x7C6FCD, wireframe: true, transparent: true, opacity: 0.07
    }));
    ss.add(tkWire);

    (function sAnimate(ts) {
      requestAnimationFrame(sAnimate);
      const t = ts * 0.001;
      tk.rotation.x = t * 0.3;
      tk.rotation.y = t * 0.5;
      tkWire.rotation.copy(tk.rotation);
      pl2.intensity = 2 + Math.sin(t * 2) * 0.8;
      sr.render(ss, sc);
    })(0);

    new ResizeObserver(() => {
      sr.setSize(storyCanvas.offsetWidth, storyCanvas.offsetHeight);
      sc.aspect = storyCanvas.offsetWidth / storyCanvas.offsetHeight;
      sc.updateProjectionMatrix();
    }).observe(storyCanvas.parentElement);
  }

  /* ══════════════════════════════════════════
     § 3 — WORK CARD CANVASES
  ══════════════════════════════════════════ */
  document.querySelectorAll('.wc-canvas').forEach(c => {
    const c1 = c.dataset.color1 || '#FF6B47';
    const c2 = c.dataset.color2 || '#7C6FCD';

    const wr = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    wr.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    wr.setSize(c.offsetWidth, c.offsetHeight);

    const ws = new THREE.Scene();
    const wc = new THREE.PerspectiveCamera(60, c.offsetWidth / c.offsetHeight, 0.1, 50);
    wc.position.z = 4;

    ws.add(new THREE.AmbientLight(0xffffff, 0.5));

    const toHex = str => parseInt(str.replace('#', '0x'));
    const wp1 = new THREE.PointLight(toHex(c1), 2.5, 20);
    wp1.position.set(2, 2, 2); ws.add(wp1);
    const wp2 = new THREE.PointLight(toHex(c2), 2, 15);
    wp2.position.set(-2, -2, 1); ws.add(wp2);

    const geos = [
      new THREE.IcosahedronGeometry(0.9, 2),
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.DodecahedronGeometry(0.85, 0),
      new THREE.TetrahedronGeometry(0.9, 0)
    ];
    const wMesh = new THREE.Mesh(
      geos[Math.floor(Math.random() * geos.length)],
      new THREE.MeshPhongMaterial({
        color: 0xfaf8f5, shininess: 60, transparent: true, opacity: 0.8,
        emissive: toHex(c1), emissiveIntensity: 0.08
      })
    );
    ws.add(wMesh);

    let hov = false;
    const card = c.closest('.work-card');
    if (card) {
      card.addEventListener('mouseenter', () => hov = true);
      card.addEventListener('mouseleave', () => hov = false);
    }

    (function wAnimate(ts) {
      requestAnimationFrame(wAnimate);
      const t = ts * 0.001;
      wMesh.rotation.x = t * (hov ? 0.9 : 0.4);
      wMesh.rotation.y = t * (hov ? 1.2 : 0.6);
      wp1.intensity    = hov ? 3.5 : 2.5;
      wr.render(ws, wc);
    })(0);

    new ResizeObserver(() => {
      wr.setSize(c.offsetWidth, c.offsetHeight);
      wc.aspect = c.offsetWidth / c.offsetHeight;
      wc.updateProjectionMatrix();
    }).observe(c.parentElement);
  });

  /* ══════════════════════════════════════════
     § 4 — TEAM AVATAR CANVASES
  ══════════════════════════════════════════ */
  document.querySelectorAll('.tc-canvas').forEach(c => {
    const hue = parseInt(c.dataset.hue || '15');

    const ar = new THREE.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
    ar.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    ar.setSize(c.offsetWidth, c.offsetHeight);

    const as = new THREE.Scene();
    const ac = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
    ac.position.z = 3;

    const col1 = new THREE.Color().setHSL(hue / 360, 0.6, 0.65);
    const col2 = new THREE.Color().setHSL((hue + 40) / 360, 0.7, 0.55);

    as.add(new THREE.AmbientLight(0xffffff, 0.5));
    const apl = new THREE.PointLight(col1, 3, 10);
    apl.position.set(1, 1, 2); as.add(apl);
    const apl2 = new THREE.PointLight(col2, 2, 8);
    apl2.position.set(-1, -1, 1); as.add(apl2);

    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.2, 3),
      new THREE.MeshPhongMaterial({
        color: col1.clone().lerp(new THREE.Color(0xffffff), 0.4),
        shininess: 60
      })
    );
    as.add(sphere);

    (function aAnimate(ts) {
      requestAnimationFrame(aAnimate);
      const t = ts * 0.001;
      sphere.rotation.y = t * 0.5;
      sphere.rotation.x = t * 0.3;
      apl.intensity = 2.5 + Math.sin(t * 2) * 0.5;
      ar.render(as, ac);
    })(0);
  });

  /* ══════════════════════════════════════════
     § 5 — LOADER CANVAS (morphing sphere)
  ══════════════════════════════════════════ */
  const loaderCanvas = document.getElementById('loader-canvas');
  if (loaderCanvas) {
    const lr = new THREE.WebGLRenderer({ canvas: loaderCanvas, antialias: true, alpha: true });
    lr.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    lr.setSize(180, 180);

    const ls = new THREE.Scene();
    const lc = new THREE.PerspectiveCamera(60, 1, 0.1, 20);
    lc.position.z = 4;

    ls.add(new THREE.AmbientLight(0xffffff, 0.7));
    const lpl = new THREE.PointLight(0xFF6B47, 2.5, 15);
    lpl.position.set(2, 2, 3); ls.add(lpl);
    const lpl2 = new THREE.PointLight(0x7C6FCD, 2, 12);
    lpl2.position.set(-2, -1, 2); ls.add(lpl2);

    const lGeo  = new THREE.IcosahedronGeometry(1.2, 4);
    const lPos  = lGeo.attributes.position;
    const lOrig = Float32Array.from(lPos.array);
    const lMesh = new THREE.Mesh(lGeo, new THREE.MeshPhongMaterial({
      color: 0xFDFCF8, emissive: 0xFF6B47, emissiveIntensity: 0.1, shininess: 80
    }));
    ls.add(lMesh);

    (function lAnimate(ts) {
      requestAnimationFrame(lAnimate);
      const t = ts * 0.001;
      for (let i = 0; i < lPos.count; i++) {
        const ox = lOrig[i * 3], oy = lOrig[i * 3 + 1], oz = lOrig[i * 3 + 2];
        const n  = simplex(ox, oy, t * 0.6) * 0.22;
        lPos.array[i * 3]     = ox * (1 + n);
        lPos.array[i * 3 + 1] = oy * (1 + n * 0.9);
        lPos.array[i * 3 + 2] = oz * (1 + n * 0.8);
      }
      lPos.needsUpdate = true;
      lGeo.computeVertexNormals();
      lMesh.rotation.y = t * 0.8;
      lMesh.rotation.x = t * 0.4;
      lpl.intensity = 2 + Math.sin(t * 2) * 0.8;
      lr.render(ls, lc);
    })(0);
  }

})();