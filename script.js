(function () {
  var body = document.body;
  requestAnimationFrame(function () { body.classList.add('ready'); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) body.classList.remove('leaving'); });

  // menu
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  // highlight current page in menu
  var cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-link').forEach(function (a) {
    var h = a.getAttribute('href');
    if (h === cur || (cur === '' && h === 'index.html')) a.querySelector('.mt').style.color = '#f5c518';
  });

  // page transitions
  document.querySelectorAll('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || a.target === '_blank') return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      body.classList.add('leaving');
      setTimeout(function () { location.href = h; }, 300);
    });
  });

  // reveal on scroll
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = (Array.prototype.indexOf.call(en.target.parentNode.children, en.target) % 6) * 70;
          en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  // count-up stats
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var target = +el.dataset.count, n = 0;
    var t = setInterval(function () {
      n++; el.textContent = n + (target >= 6 ? '+' : '');
      if (n >= target) clearInterval(t);
    }, 120);
  });

  // cursor glow
  var glow = document.querySelector('.glow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    window.addEventListener('mousemove', function (e) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; });
  }

  // contact form -> mailto
  var f = document.getElementById('contactForm');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      if (!d.get('name') || !d.get('email') || !d.get('message')) { alert('Please fill in name, email and message.'); return; }
      var subj = d.get('subject') || 'Portfolio enquiry from ' + d.get('name');
      var msg = d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email');
      location.href = 'mailto:prayas629@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg);
    });
  }
})();
