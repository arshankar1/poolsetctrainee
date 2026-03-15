/**
 * Navigation for Pools Etc Training Portal
 * Renders the sticky header nav and sticky footer nav bar.
 *
 * Usage on module pages:
 *   Navigation.renderHeader({ moduleNumber: 1, moduleTitle: 'Compliance & Safety' });
 *   Navigation.renderFooterNav({ prevUrl: null, nextUrl: 'module-2.html', quizContainerId: 'module-quiz' });
 */

const Navigation = (function () {

  const MODULE_URLS = [
    null,
    '../modules/module-1.html',
    '../modules/module-2.html',
    '../modules/module-3.html',
    '../modules/module-4.html',
    '../modules/module-5.html',
    '../modules/module-6.html',
  ];

  /**
   * Renders the sticky top navigation header.
   *
   * @param {Object} options
   * @param {number} options.moduleNumber   1–6 (null for non-module pages)
   * @param {string} options.moduleTitle    Full module title string
   * @param {number} [options.totalModules] Defaults to 6
   */
  function renderHeader(options) {
    const container = document.getElementById('nav-root');
    if (!container) return;

    const moduleNum    = options.moduleNumber || null;
    const moduleTitle  = options.moduleTitle  || 'Training Portal';
    const totalModules = options.totalModules || 6;

    // Build progress dots HTML
    const dots = _buildProgressDots(moduleNum, totalModules);

    const breadcrumb = moduleNum
      ? 'Module <span>' + moduleNum + ' of ' + totalModules + ' — ' + _escHtml(moduleTitle) + '</span>'
      : '<span>Training Dashboard</span>';

    container.innerHTML = [
      '<nav class="nav-header" role="navigation" aria-label="Site navigation">',
      '  <div class="nav-header__inner">',
      '    <a href="../index.html" class="nav-logo" aria-label="Pools Etc Training Home">',
      '      🏊 Pools Etc',
      '    </a>',
      '    <div class="nav-breadcrumb" aria-label="Current location">' + breadcrumb + '</div>',
      '    <div class="progress-dots" aria-label="Module progress">' + dots + '</div>',
      '  </div>',
      '</nav>',
    ].join('\n');
  }

  /**
   * Renders the sticky bottom footer nav.
   * The "Take Module Quiz" button is disabled until the user has
   * scrolled through all .content-section elements on the page.
   *
   * @param {Object} options
   * @param {string|null} options.prevUrl           URL of previous module (null for module 1)
   * @param {string|null} options.nextUrl           URL of next module (null for module 6)
   * @param {string}      options.quizContainerId   ID of the quiz container element to scroll to
   * @param {boolean}     [options.quizAlreadyPassed] If true, quiz button shows "Review Quiz" state
   */
  function renderFooterNav(options) {
    const container = document.getElementById('footer-nav-root');
    if (!container) return;

    const prevUrl           = options.prevUrl           || null;
    const nextUrl           = options.nextUrl           || null;
    const quizContainerId   = options.quizContainerId   || 'module-quiz';
    const quizAlreadyPassed = options.quizAlreadyPassed || false;

    const prevBtn = prevUrl
      ? '<a href="' + prevUrl + '" class="btn btn-ghost">← Previous</a>'
      : '<span></span>';

    const nextBtn = nextUrl
      ? '<a href="' + nextUrl + '" class="btn btn-ghost" id="footer-next-btn">Next Module →</a>'
      : '<span></span>';

    const quizBtnText  = quizAlreadyPassed ? 'Review Quiz' : 'Take Module Quiz';
    const quizBtnClass = quizAlreadyPassed ? 'btn-success' : 'btn-primary';

    container.innerHTML = [
      '<div class="sticky-footer-nav" role="navigation" aria-label="Module navigation">',
      '  <div class="sticky-footer-nav__inner">',
      '    ' + prevBtn,
      '    <div class="footer-nav-quiz-btn">',
      '      <button',
      '        id="footer-quiz-btn"',
      '        class="btn ' + quizBtnClass + '"',
      '        disabled',
      '        onclick="document.getElementById(\'' + quizContainerId + '\').scrollIntoView({ behavior: \'smooth\' })"',
      '        aria-label="' + quizBtnText + '"',
      '      >',
      '        ' + (quizAlreadyPassed ? '✓ ' : '') + quizBtnText,
      '      </button>',
      '    </div>',
      '    ' + nextBtn,
      '  </div>',
      '</div>',
    ].join('\n');

    // Set up IntersectionObserver to unlock the quiz button
    // once all .content-section elements have been scrolled into view
    _setupQuizButtonUnlock(quizContainerId, quizAlreadyPassed);
  }

  // ─────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ─────────────────────────────────────────────

  /**
   * Builds the 6 progress dot elements.
   */
  function _buildProgressDots(activeModule, totalModules) {
    let html = '';
    for (let i = 1; i <= totalModules; i++) {
      const status  = _getDotStatus(i, activeModule);
      const classes = 'progress-dot dot-' + status;
      const label   = 'Module ' + i;
      const url     = MODULE_URLS[i] || '#';

      if (status === 'complete') {
        html += '<a href="' + url + '" class="' + classes + '" title="' + label + ' — Complete" aria-label="' + label + ' complete">✓</a>';
      } else if (status === 'active') {
        html += '<div class="' + classes + '" title="' + label + ' — Current" aria-label="' + label + ' in progress" aria-current="true">' + i + '</div>';
      } else {
        html += '<div class="' + classes + '" title="' + label + '" aria-label="' + label + '">' + i + '</div>';
      }
    }
    return html;
  }

  /**
   * Returns 'locked', 'active', or 'complete' for a dot.
   */
  function _getDotStatus(dotNum, activeModule) {
    // Determine from Progress if available
    const moduleId = 'module' + dotNum;
    if (typeof Progress !== 'undefined') {
      const status = Progress.getStatus(moduleId);
      if (status && status.completed) return 'complete';
      if (!Progress.isUnlocked(moduleId)) return 'locked';
    }
    // Fallback: use activeModule number
    if (dotNum === activeModule) return 'active';
    if (dotNum < activeModule)   return 'complete';
    return 'locked';
  }

  /**
   * Sets up an IntersectionObserver to track whether the user has
   * scrolled through all .content-section elements.
   * Enables the quiz button once all sections have been seen.
   */
  function _setupQuizButtonUnlock(quizContainerId, alreadyPassed) {
    // Small delay to let the DOM settle after navigation.js runs
    setTimeout(function () {
      const quizBtn = document.getElementById('footer-quiz-btn');
      if (!quizBtn) return;

      // If quiz already passed, enable the button immediately
      if (alreadyPassed) {
        quizBtn.disabled = false;
        return;
      }

      const sections = document.querySelectorAll('.content-section');

      // If there are no sections, enable the button right away
      if (!sections || sections.length === 0) {
        quizBtn.disabled = false;
        return;
      }

      const seen = new Set();

      const observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              seen.add(entry.target);
            }
          });

          if (seen.size >= sections.length) {
            quizBtn.disabled = false;
            quizBtn.title = 'All content reviewed — quiz unlocked!';
            observer.disconnect();
          }
        },
        {
          rootMargin: '0px 0px -10% 0px', // section counts as "seen" when ~90% visible
          threshold:  0.15,
        }
      );

      sections.forEach(function (section) {
        observer.observe(section);
      });

      // Safety fallback: enable after 60 seconds regardless
      // (prevents the button staying locked if user scrolls very fast)
      setTimeout(function () {
        if (quizBtn.disabled) {
          quizBtn.disabled = false;
          quizBtn.title = 'Quiz unlocked';
        }
      }, 60000);

    }, 200);
  }

  /**
   * Simple HTML escaping for user-supplied strings.
   */
  function _escHtml(str) {
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  // ─────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ─────────────────────────────────────────────
  return {
    renderHeader:    renderHeader,
    renderFooterNav: renderFooterNav,
  };
})();
