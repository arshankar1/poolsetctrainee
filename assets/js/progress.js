/**
 * Progress Tracker for Pools Etc Training Portal
 * Manages all localStorage-based progress tracking.
 *
 * Storage key: 'poolsEtcProgress'
 * Schema:
 * {
 *   module1: { completed: bool, quizScore: int|null, quizPassed: bool, timestamp: int|null },
 *   module2: { ... },
 *   module3: { ... },
 *   module4: { ... },
 *   module5: { ... },
 *   module6: { ... },
 *   finalQuiz: { attempted: bool, score: int|null, passed: bool }
 * }
 */

const Progress = (function () {
  const STORAGE_KEY = 'poolsEtcProgress';

  const MODULE_IDS = ['module1', 'module2', 'module3', 'module4', 'module5', 'module6'];

  const MODULE_LABELS = {
    module1: 'Module 1 — Compliance & Safety',
    module2: 'Module 2 — Pool Fundamentals',
    module3: 'Module 3 — Weekly Service Procedures',
    module4: 'Module 4 — Water Chemistry Deep Dive',
    module5: 'Module 5 — Equipment & Filtration',
    module6: 'Module 6 — Customer Service',
  };

  const MODULE_URLS = {
    module1: 'modules/module-1.html',
    module2: 'modules/module-2.html',
    module3: 'modules/module-3.html',
    module4: 'modules/module-4.html',
    module5: 'modules/module-5.html',
    module6: 'modules/module-6.html',
  };

  /**
   * Returns the default empty schema.
   */
  function _defaultSchema() {
    const schema = {};
    MODULE_IDS.forEach(function (id) {
      schema[id] = {
        completed:  false,
        quizScore:  null,
        quizPassed: false,
        timestamp:  null,
      };
    });
    schema.finalQuiz = {
      attempted: false,
      score:     null,
      passed:    false,
    };
    return schema;
  }

  /**
   * Safely reads and parses the localStorage data.
   * Returns the parsed object, or the default schema on any error.
   */
  function _read() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return _defaultSchema();
      const parsed = JSON.parse(raw);
      // Ensure all keys exist (forward-compat if new modules added)
      const defaults = _defaultSchema();
      Object.keys(defaults).forEach(function (key) {
        if (!(key in parsed)) parsed[key] = defaults[key];
      });
      return parsed;
    } catch (e) {
      console.warn('[Progress] Failed to read localStorage:', e);
      return _defaultSchema();
    }
  }

  /**
   * Safely writes data back to localStorage.
   */
  function _write(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('[Progress] Failed to write localStorage:', e);
    }
  }

  // ─────────────────────────────────────────────
  //  PUBLIC API
  // ─────────────────────────────────────────────

  /**
   * init() — Call on every page load.
   * Initializes the schema in localStorage if it doesn't exist.
   */
  function init() {
    const data = _read();
    // If localStorage was empty, write the default schema
    if (!localStorage.getItem(STORAGE_KEY)) {
      _write(data);
    }
  }

  /**
   * markModuleComplete(moduleId, quizScore)
   * Records a passing quiz result for a module.
   *
   * @param {string} moduleId  e.g. 'module1'
   * @param {number} quizScore  number of correct answers (0-10)
   */
  function markModuleComplete(moduleId, quizScore) {
    if (!MODULE_IDS.includes(moduleId)) {
      console.warn('[Progress] Unknown moduleId:', moduleId);
      return;
    }
    const data = _read();
    data[moduleId].completed  = true;
    data[moduleId].quizScore  = quizScore;
    data[moduleId].quizPassed = true;
    data[moduleId].timestamp  = Date.now();
    _write(data);
  }

  /**
   * markFinalQuizComplete(score, passed)
   */
  function markFinalQuizComplete(score, passed) {
    const data = _read();
    data.finalQuiz.attempted = true;
    data.finalQuiz.score     = score;
    data.finalQuiz.passed    = passed;
    _write(data);
  }

  /**
   * getStatus(moduleId) → status object for one module
   */
  function getStatus(moduleId) {
    const data = _read();
    if (moduleId === 'finalQuiz') return data.finalQuiz;
    return data[moduleId] || null;
  }

  /**
   * isUnlocked(moduleId) → boolean
   * module1 is always unlocked.
   * moduleN unlocks when module(N-1) is completed.
   */
  function isUnlocked(moduleId) {
    if (moduleId === 'module1') return true;
    const idx = MODULE_IDS.indexOf(moduleId);
    if (idx === -1) return false;
    const prevId = MODULE_IDS[idx - 1];
    const data   = _read();
    return data[prevId] && data[prevId].completed === true;
  }

  /**
   * getDashboardData() → array for rendering the dashboard
   * Returns: [{ moduleId, label, url, completed, locked, score, quizPassed }]
   */
  function getDashboardData() {
    const data = _read();
    return MODULE_IDS.map(function (id) {
      const status = data[id];
      return {
        moduleId:   id,
        label:      MODULE_LABELS[id],
        url:        MODULE_URLS[id],
        completed:  status.completed,
        locked:     !isUnlocked(id),
        score:      status.quizScore,
        quizPassed: status.quizPassed,
        timestamp:  status.timestamp,
      };
    });
  }

  /**
   * getOverallPercent() → 0–100
   * Counts completed modules out of 6.
   */
  function getOverallPercent() {
    const data = _read();
    const completed = MODULE_IDS.filter(function (id) {
      return data[id].completed;
    }).length;
    return Math.round((completed / MODULE_IDS.length) * 100);
  }

  /**
   * hasCompletedAll() → boolean
   * True only if all 6 modules are complete AND final quiz is passed.
   */
  function hasCompletedAll() {
    const data = _read();
    const allModulesDone = MODULE_IDS.every(function (id) {
      return data[id].completed;
    });
    return allModulesDone && data.finalQuiz.passed;
  }

  /**
   * getCompletedCount() → 0–6
   */
  function getCompletedCount() {
    const data = _read();
    return MODULE_IDS.filter(function (id) {
      return data[id].completed;
    }).length;
  }

  /**
   * reset() — Clears all progress after a confirmation dialog.
   */
  function reset() {
    const confirmed = window.confirm(
      'Reset all training progress?\n\nThis will clear all quiz scores and module completions. This cannot be undone.'
    );
    if (confirmed) {
      localStorage.removeItem(STORAGE_KEY);
      window.location.reload();
    }
  }

  // ─────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ─────────────────────────────────────────────
  return {
    init:                  init,
    markModuleComplete:    markModuleComplete,
    markFinalQuizComplete: markFinalQuizComplete,
    getStatus:             getStatus,
    isUnlocked:            isUnlocked,
    getDashboardData:      getDashboardData,
    getOverallPercent:     getOverallPercent,
    hasCompletedAll:       hasCompletedAll,
    getCompletedCount:     getCompletedCount,
    reset:                 reset,
  };
})();
