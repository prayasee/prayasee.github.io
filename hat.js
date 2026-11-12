/* Floating 3D hard hat (Three.js r128). Built procedurally, no model file needed. */
(function () {
  var c = document.getElementById('hat');
  if (!c) return;
  if (!window.THREE) { c.style.display = 'none'; return; }
  var T = THREE;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var renderer = new T.WebGLRenderer({ canvas: c, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  var scene = new T.Scene();
  var DIST = 3.82, HALF_W = 1.35;
  var cam = new T.PerspectiveCamera(30, 1.32, 0.1, 50);
  cam.position.set(0, 0, DIST);

  scene.add(new T.AmbientLight(0xffffff, 0.85));
  var key = new T.DirectionalLight(0xffffff, 1.1); key.position.set(2, 3, 4); scene.add(key);
  var back = new T.DirectionalLight(0xffffff, 0.45); back.position.set(-3, 2, -2); scene.add(back);

  var lime = new T.MeshStandardMaterial({ color: 0xd6ff1f, roughness: 0.3, metalness: 0.2 });
  var ink = new T.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });

  var hat = new T.Group();
  var dome = new T.Group();
  dome.scale.set(1, 0.85, 1);
  hat.add(dome);

  dome.add(new T.Mesh(new T.SphereGeometry(1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2), lime));
  dome.add(new T.Mesh(
    new T.SphereGeometry(1.025, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2),
    new T.MeshBasicMaterial({ color: 0x111111, wireframe: true, transparent: true, opacity: 0.16 })
  ));
  [0, 0.46, -0.46].forEach(function (a) {
    var ridge = new T.Mesh(new T.TorusGeometry(1.0, 0.05, 12, 64, Math.PI), lime);
    ridge.rotation.y = Math.PI / 2 + a;
    dome.add(ridge);
  });

  var rimMesh = new T.Mesh(new T.CylinderGeometry(1.04, 1.04, 0.14, 64), lime);
  rimMesh.position.y = -0.05;
  hat.add(rimMesh);

  var peak = new T.Mesh(new T.CylinderGeometry(1.0, 1.12, 0.05, 48, 1, false, -Math.PI / 2, Math.PI), lime);
  peak.scale.z = 1.4;
  peak.position.y = -0.08;
  peak.rotation.x = 0.12;
  hat.add(peak);

  var s = new T.Shape();
  s.moveTo(0.10, 0.30); s.lineTo(-0.12, -0.04); s.lineTo(-0.01, -0.04);
  s.lineTo(-0.10, -0.30); s.lineTo(0.13, 0.05); s.lineTo(0.02, 0.05); s.closePath();
  var bolt = new T.Mesh(new T.ExtrudeGeometry(s, { depth: 0.03, bevelEnabled: false }), ink);
  bolt.position.set(0, 0.31, 0.92);
  bolt.rotation.x = -0.38;
  bolt.scale.set(1.2, 1.2, 1.2);
  hat.add(bolt);

  var BASE_Y = -0.14;
  hat.position.y = BASE_Y;
  hat.rotation.x = 0.1;
  scene.add(hat);

  var mx = 0, my = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', function (e) {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function resize() {
    var w = c.clientWidth, h = c.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    cam.aspect = w / h;
    cam.fov = 2 * Math.atan((HALF_W / cam.aspect) / DIST) * 180 / Math.PI;
    cam.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  var t0 = performance.now();
  function frame(now) {
    var t = (now - t0) / 1000;
    tx += (mx * 0.55 - tx) * 0.06;
    ty += (my * 0.18 - ty) * 0.06;
    var intro = reduce ? 0 : Math.pow(Math.max(0, 1 - t / 1.4), 3) * 0.6;
    hat.rotation.y = tx + (reduce ? 0 : Math.sin(t * 0.8) * 0.12) + intro * 4;
    hat.rotation.x = 0.1 + ty;
    hat.position.y = BASE_Y + intro + (reduce ? 0 : Math.sin(t * 1.6) * 0.025);
    renderer.render(scene, cam);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
