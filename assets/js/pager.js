/* ============================================================
   ModulePager — ID-based section pager for module pages
   Usage:
     ModulePager.init([
       { title: 'Page Title', elements: ['id1', 'id2'] },
       ...
     ]);
   ============================================================ */
const ModulePager = (function () {
  var _pages   = [];
  var _current = 0;
  var _topEl   = null;   // dots + page title bar
  var _botEl   = null;   // prev / next nav

  /* ---- public ---- */
  function init(config) {
    _pages = (config || []).map(function (page) {
      return {
        title: page.title,
        els: (page.elements || [])
          .map(function (id) { return document.getElementById(id); })
          .filter(Boolean),
      };
    }).filter(function (p) { return p.els.length > 0; });

    if (_pages.length < 2) return; // nothing to paginate

    _buildTopBar();
    _buildBottomNav();
    _showPage(0, false);
  }

  function next() { if (_current < _pages.length - 1) _showPage(_current + 1); }
  function prev() { if (_current > 0)                 _showPage(_current - 1); }
  function goTo(n) {
    if (n >= 0 && n < _pages.length) _showPage(n);
  }

  /* ---- private ---- */
  function _showPage(n, scroll) {
    _pages.forEach(function (p) {
      p.els.forEach(function (el) { el.style.display = 'none'; });
    });
    _pages[n].els.forEach(function (el) { el.style.display = ''; });
    _current = n;
    _updateTopBar();
    _updateBottomNav();
    if (scroll !== false) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function _buildTopBar() {
    _topEl = document.createElement('div');
    _topEl.className = 'pager-topbar';

    // Insert before the first element of the first page
    var firstEl = _pages[0].els[0];
    firstEl.parentNode.insertBefore(_topEl, firstEl);
  }

  function _buildBottomNav() {
    _botEl = document.createElement('div');
    _botEl.className = 'pager-footnav';

    // Append after the last element of each page — we'll move it on each show
    document.body.appendChild(_botEl);
  }

  function _updateTopBar() {
    var dots = _pages.map(function (p, i) {
      var cls = 'pager-dot' + (i === _current ? ' pager-dot--active' : '');
      return '<button class="' + cls + '" data-page="' + i + '" title="' + _esc(p.title) + '" aria-label="Go to ' + _esc(p.title) + '"></button>';
    }).join('');

    _topEl.innerHTML =
      '<div class="pager-topbar__inner">' +
        '<span class="pager-topbar__label">' + _esc(_pages[_current].title) + '</span>' +
        '<span class="pager-topbar__step">Page ' + (_current + 1) + ' of ' + _pages.length + '</span>' +
        '<div class="pager-dots">' + dots + '</div>' +
      '</div>';

    _topEl.querySelectorAll('.pager-dot').forEach(function (btn) {
      btn.addEventListener('click', function () {
        goTo(parseInt(btn.getAttribute('data-page'), 10));
      });
    });
  }

  function _updateBottomNav() {
    var hasPrev = _current > 0;
    var hasNext = _current < _pages.length - 1;

    var prevHtml = hasPrev
      ? '<button class="pager-btn pager-btn--prev" id="pager-prev">← ' + _esc(_pages[_current - 1].title) + '</button>'
      : '<span></span>';

    var nextHtml = hasNext
      ? '<button class="pager-btn pager-btn--next" id="pager-next">' + _esc(_pages[_current + 1].title) + ' →</button>'
      : '<span></span>';

    _botEl.innerHTML =
      '<div class="pager-footnav__inner">' +
        prevHtml +
        '<span class="pager-footnav__counter">' + (_current + 1) + ' / ' + _pages.length + '</span>' +
        nextHtml +
      '</div>';

    // Move bot nav after last element of current page
    var lastEl = _pages[_current].els[_pages[_current].els.length - 1];
    lastEl.parentNode.insertBefore(_botEl, lastEl.nextSibling);

    if (hasPrev) {
      document.getElementById('pager-prev').addEventListener('click', prev);
    }
    if (hasNext) {
      document.getElementById('pager-next').addEventListener('click', next);
    }
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return { init: init, next: next, prev: prev, goTo: goTo };
})();
