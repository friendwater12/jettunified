// JettUnified site — small progressive enhancements. The site works without JS.
(function () {
  // Mobile menu
  var header = document.querySelector('.site-header');
  var btn = document.querySelector('.menu-btn');
  if (btn && header) {
    btn.addEventListener('click', function () {
      var open = header.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Features page: filter by group
  var chips = document.querySelectorAll('.chip[data-filter]');
  if (chips.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var f = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.setAttribute('aria-pressed', c === chip ? 'true' : 'false'); });
        document.querySelectorAll('.fgroup').forEach(function (g) {
          g.hidden = !(f === 'all' || g.getAttribute('data-group') === f);
        });
      });
    });
  }

  // Wiki: active link on scroll
  var links = Array.prototype.slice.call(document.querySelectorAll('.docs-nav a[href^="#"]'));
  if (links.length && 'IntersectionObserver' in window) {
    var map = {};
    links.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          links.forEach(function (a) { a.classList.remove('active'); });
          map[e.target.id].classList.add('active');
        }
      });
    }, { rootMargin: '-90px 0px -70% 0px' });
    document.querySelectorAll('.doc section[id]').forEach(function (s) { io.observe(s); });
  }

  // Wiki: filter the sidebar
  var search = document.querySelector('.docs-nav .search');
  if (search) {
    search.addEventListener('input', function () {
      var q = search.value.trim().toLowerCase();
      links.forEach(function (a) {
        var sec = document.getElementById(a.getAttribute('href').slice(1));
        var text = (a.textContent + ' ' + (sec ? sec.textContent : '')).toLowerCase();
        a.parentElement.style.display = !q || text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  // Tables: filter rows
  document.querySelectorAll('[data-filter-table]').forEach(function (input) {
    var table = document.getElementById(input.getAttribute('data-filter-table'));
    if (!table) return;
    input.addEventListener('input', function () {
      var q = input.value.trim().toLowerCase();
      table.querySelectorAll('tbody tr').forEach(function (tr) {
        tr.style.display = !q || tr.textContent.toLowerCase().indexOf(q) !== -1 ? '' : 'none';
      });
    });
  });

  // Copy buttons
  document.querySelectorAll('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var t = b.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(t).then(function () {
        var old = b.textContent; b.textContent = 'Copied'; setTimeout(function () { b.textContent = old; }, 1400);
      });
    });
  });
})();

// Download: jars are stored in parts (GitHub upload limit). Join them in the browser.
(function () {
  document.querySelectorAll('a[data-jar]').forEach(function (btn) {
    btn.addEventListener('click', function (ev) {
      ev.preventDefault();
      if (btn.getAttribute('aria-busy') === 'true') return;
      var name = btn.getAttribute('data-jar');
      var n = parseInt(btn.getAttribute('data-parts'), 10) || 1;
      var label = btn.querySelector('span') || btn;
      var old = label.textContent;
      btn.setAttribute('aria-busy', 'true');
      label.textContent = 'Preparing…';
      var reqs = [];
      for (var i = 0; i < n; i++) {
        reqs.push(fetch('dl/' + name + '.part' + i).then(function (r) {
          if (!r.ok) throw new Error('missing part');
          return r.arrayBuffer();
        }));
      }
      Promise.all(reqs).then(function (parts) {
        var blob = new Blob(parts, { type: 'application/java-archive' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url; a.download = name;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
        label.textContent = 'Downloaded';
      }).catch(function () {
        label.textContent = 'Download failed, try again';
      }).then(function () {
        btn.removeAttribute('aria-busy');
        setTimeout(function () { label.textContent = old; }, 2500);
      });
    });
  });
})();
