(function () {
  var body = document.body;
  requestAnimationFrame(function () { body.classList.add('ready'); });
  window.addEventListener('pageshow', function (e) { if (e.persisted) body.classList.remove('leaving'); });

  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  var home = body.classList.contains('home');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    if (!home) body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });

  var cur = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.menu-link').forEach(function (a) {
    if (a.getAttribute('href') === cur) a.style.background = 'linear-gradient(90deg,#d6ff1f,transparent 60%)';
  });
  document.querySelectorAll('.pn a').forEach(function (a) {
    if (a.getAttribute('href') === cur) a.classList.add('on');
  });

  document.querySelectorAll('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || a.target === '_blank' || /\.pdf$/i.test(h)) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      body.classList.add('leaving');
      setTimeout(function () { location.href = h; }, 300);
    });
  });

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
