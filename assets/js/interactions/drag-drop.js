/**
 * Drag-Drop Widget for Pools Etc Training Portal
 *
 * Supports two modes:
 *   'sort'  — order items into a numbered list (Module 3 Step Sequencer)
 *   'sort2' — drag items into category buckets (Module 1 Symptom Sorter)
 *
 * Works with both mouse (desktop) and pointer events (tablet/touch).
 */

const DragDrop = (function () {

  /**
   * createSequencer(config)
   * Renders a drag-to-order activity.
   *
   * config = {
   *   containerId: string,    // ID of the wrapper element
   *   items: [{ id, label }], // Items in scrambled order
   *   correctOrder: [id],     // Correct order by id
   *   onComplete: fn,         // Called when user submits (passed { allCorrect })
   * }
   */
  function createSequencer(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    const items = config.items;
    const correct = config.correctOrder;

    // Shuffle items for display
    const shuffled = items.slice().sort(function () { return Math.random() - 0.5; });

    container.innerHTML = [
      '<div class="sequencer-layout">',
      '  <div>',
      '    <div class="sequencer-label">Drag from here →</div>',
      '    <div class="drag-source-grid" id="' + config.containerId + '-source">',
      shuffled.map(function (item) {
        return '<div class="drag-item" draggable="true" data-id="' + item.id + '" id="di-' + item.id + '">'
          + '<span class="drag-item__handle">⠿</span>'
          + '<span>' + _esc(item.label) + '</span>'
          + '</div>';
      }).join(''),
      '    </div>',
      '  </div>',
      '  <div>',
      '    <div class="sequencer-label">← Drop in correct order</div>',
      '    <div class="drag-target-list" id="' + config.containerId + '-target">',
      correct.map(function (id, idx) {
        return '<div class="drop-zone" data-pos="' + idx + '" id="dz-' + config.containerId + '-' + idx + '">'
          + '<span class="drop-zone__num">' + (idx + 1) + '</span>'
          + '<span class="drop-zone__placeholder">Drop step ' + (idx + 1) + ' here</span>'
          + '</div>';
      }).join(''),
      '    </div>',
      '    <div style="margin-top: var(--space-4); display:flex; gap: var(--space-3);">',
      '      <button class="btn btn-primary" onclick="DragDrop._checkSequencer(\'' + config.containerId + '\')" id="' + config.containerId + '-check-btn">Check Order</button>',
      '      <button class="btn btn-ghost" onclick="DragDrop._resetSequencer(\'' + config.containerId + '\')">Reset</button>',
      '    </div>',
      '    <div class="drag-result" id="' + config.containerId + '-result"></div>',
      '  </div>',
      '</div>',
    ].join('');

    _attachSequencerEvents(config);
    _store(config.containerId, config);
  }

  /**
   * createSorter(config)
   * Renders a drag-to-categorize activity.
   *
   * config = {
   *   containerId: string,
   *   items: [{ id, label, correct: 'a'|'b' }],
   *   colA: { id: 'a', title, className },
   *   colB: { id: 'b', title, className },
   *   onAllPlaced: fn,     // Called when all items placed (passed { items })
   * }
   */
  function createSorter(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    const shuffled = config.items.slice().sort(function () { return Math.random() - 0.5; });

    container.innerHTML = [
      '<div class="sorter-layout">',
      '  <div>',
      '    <div class="sequencer-label">Items to sort</div>',
      '    <div id="' + config.containerId + '-bank">',
      shuffled.map(function (item) {
        return '<div class="sorter-item" draggable="true" data-id="' + item.id + '" data-correct="' + item.correct + '" id="si-' + item.id + '">'
          + _esc(item.label)
          + '</div>';
      }).join(''),
      '    </div>',
      '  </div>',
      '  <div class="sorter-column ' + (config.colA.className || '') + '" id="sort-col-' + config.containerId + '-a">',
      '    <div class="sorter-column__title">' + _esc(config.colA.title) + '</div>',
      '  </div>',
      '  <div class="sorter-column ' + (config.colB.className || '') + '" id="sort-col-' + config.containerId + '-b">',
      '    <div class="sorter-column__title">' + _esc(config.colB.title) + '</div>',
      '  </div>',
      '</div>',
      '<div style="margin-top: var(--space-4); display:flex; gap: var(--space-3);">',
      '  <button class="btn btn-primary" onclick="DragDrop._checkSorter(\'' + config.containerId + '\')" id="' + config.containerId + '-check-btn">Check Answers</button>',
      '  <button class="btn btn-ghost" onclick="DragDrop._resetSorter(\'' + config.containerId + '\')">Reset</button>',
      '</div>',
      '<div class="drag-result" id="' + config.containerId + '-result"></div>',
    ].join('');

    _attachSorterEvents(config);
    _store(config.containerId, config);
  }

  // ── Internal Storage ─────────────────────────

  const _configs = {};
  function _store(id, cfg) { _configs[id] = cfg; }

  // ── Sequencer Logic ──────────────────────────

  let _dragging = null;
  let _dragSourceContainer = null;

  function _attachSequencerEvents(config) {
    const cid = config.containerId;

    // Use pointer events for touch/mouse compatibility
    document.querySelectorAll('#' + cid + '-source .drag-item').forEach(function (el) {
      el.addEventListener('dragstart', function (e) {
        _dragging = el;
        _dragSourceContainer = cid;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', el.dataset.id);
        setTimeout(function () { el.classList.add('dragging'); }, 0);
      });
      el.addEventListener('dragend', function () {
        el.classList.remove('dragging');
        _dragging = null;
      });
    });

    document.querySelectorAll('#' + cid + '-target .drop-zone').forEach(function (zone) {
      zone.addEventListener('dragover', function (e) {
        e.preventDefault();
        zone.classList.add('drag-over-zone');
      });
      zone.addEventListener('dragleave', function () {
        zone.classList.remove('drag-over-zone');
      });
      zone.addEventListener('drop', function (e) {
        e.preventDefault();
        zone.classList.remove('drag-over-zone');
        if (!_dragging) return;

        // If zone already has an item, swap it back to source
        const existingId = zone.dataset.placedId;
        if (existingId) {
          const sourceEl = document.getElementById('di-' + existingId);
          if (sourceEl) {
            sourceEl.style.display = '';
            zone.dataset.placedId = '';
          }
          // Also remove any inline label we placed
          const old = zone.querySelector('.placed-label');
          if (old) old.remove();
          const ph = zone.querySelector('.drop-zone__placeholder');
          if (ph) ph.style.display = '';
          zone.classList.remove('filled');
        }

        const itemId = _dragging.dataset.id;
        zone.dataset.placedId = itemId;
        zone.classList.add('filled');

        // Show label in zone
        const ph = zone.querySelector('.drop-zone__placeholder');
        if (ph) ph.style.display = 'none';
        const cfg = _configs[cid];
        const item = cfg.items.find(function (it) { return it.id === itemId; });
        if (item) {
          const label = document.createElement('span');
          label.className = 'placed-label';
          label.style.fontSize = 'var(--text-sm)';
          label.style.fontWeight = '500';
          label.style.color = 'var(--color-dark)';
          label.textContent = item.label;
          zone.appendChild(label);
        }

        // Hide item from source
        _dragging.style.display = 'none';
      });
    });
  }

  function _checkSequencer(cid) {
    const cfg = _configs[cid];
    if (!cfg) return;

    const zones = document.querySelectorAll('#' + cid + '-target .drop-zone');
    let correct = 0;
    let total = cfg.correctOrder.length;
    let allFilled = true;

    zones.forEach(function (zone, idx) {
      const placedId = zone.dataset.placedId;
      if (!placedId) { allFilled = false; return; }
      const expectedId = cfg.correctOrder[idx];
      const isCorrect = (placedId === expectedId);
      if (isCorrect) correct++;

      // Update zone styling
      const label = zone.querySelector('.placed-label');
      if (label) {
        label.style.color = isCorrect ? 'var(--color-success)' : 'var(--color-danger)';
      }
      zone.style.borderColor = isCorrect ? 'var(--color-success)' : 'var(--color-danger)';
      zone.style.background  = isCorrect ? 'var(--color-success-light)' : 'var(--color-danger-light)';

      // Show correct position if wrong
      if (!isCorrect) {
        const correctItem = cfg.items.find(function (it) { return it.id === expectedId; });
        let hint = zone.querySelector('.zone-hint');
        if (!hint) {
          hint = document.createElement('span');
          hint.className = 'zone-hint';
          hint.style.cssText = 'font-size:11px;color:var(--color-danger);margin-left:8px;';
          zone.appendChild(hint);
        }
        hint.textContent = '→ Should be: ' + (correctItem ? correctItem.label : expectedId);
      }
    });

    const resultEl = document.getElementById(cid + '-result');
    if (resultEl) {
      const allCorrect = (correct === total && allFilled);
      resultEl.classList.add('visible');
      resultEl.classList.remove('pass', 'fail');
      if (!allFilled) {
        resultEl.classList.add('fail');
        resultEl.innerHTML = '⚠️ Please place all steps before checking.';
      } else if (allCorrect) {
        resultEl.classList.add('pass');
        resultEl.innerHTML = '<strong>✅ Perfect order!</strong> You\'ve got the service visit sequence down.';
        if (cfg.onComplete) cfg.onComplete({ allCorrect: true });
      } else {
        resultEl.classList.add('fail');
        resultEl.innerHTML = '<strong>' + correct + ' of ' + total + ' correct.</strong> Items in red show the correct step — review and retry.';
        if (cfg.onComplete) cfg.onComplete({ allCorrect: false });
      }
    }
  }

  function _resetSequencer(cid) {
    const cfg = _configs[cid];
    if (!cfg) return;
    createSequencer(cfg);
  }

  // ── Sorter Logic ─────────────────────────────

  function _attachSorterEvents(config) {
    const cid = config.containerId;

    document.querySelectorAll('#' + cid + '-bank .sorter-item').forEach(function (el) {
      el.addEventListener('dragstart', function (e) {
        _dragging = el;
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', el.dataset.id);
        setTimeout(function () { el.classList.add('dragging'); }, 0);
      });
      el.addEventListener('dragend', function () {
        el.classList.remove('dragging');
        _dragging = null;
      });
    });

    ['a', 'b'].forEach(function (colKey) {
      const col = document.getElementById('sort-col-' + cid + '-' + colKey);
      if (!col) return;
      col.addEventListener('dragover', function (e) {
        e.preventDefault();
        col.classList.add('drag-over-zone');
      });
      col.addEventListener('dragleave', function () {
        col.classList.remove('drag-over-zone');
      });
      col.addEventListener('drop', function (e) {
        e.preventDefault();
        col.classList.remove('drag-over-zone');
        if (!_dragging) return;

        _dragging.dataset.placed = colKey;
        col.appendChild(_dragging);
        _dragging.classList.remove('dragging');
      });
    });
  }

  function _checkSorter(cid) {
    const cfg = _configs[cid];
    if (!cfg) return;

    let correct = 0;
    let total = cfg.items.length;

    cfg.items.forEach(function (item) {
      const el = document.getElementById('si-' + item.id);
      if (!el) return;
      const placed = el.dataset.placed;
      if (!placed) return;
      const isCorrect = (placed === item.correct);
      if (isCorrect) correct++;
      el.classList.remove('correct', 'incorrect');
      el.classList.add(isCorrect ? 'correct' : 'incorrect');
    });

    const placed = cfg.items.filter(function (item) {
      const el = document.getElementById('si-' + item.id);
      return el && el.dataset.placed;
    }).length;

    const resultEl = document.getElementById(cid + '-result');
    if (resultEl) {
      resultEl.classList.add('visible');
      resultEl.classList.remove('pass', 'fail');
      if (placed < total) {
        resultEl.classList.add('fail');
        resultEl.innerHTML = '⚠️ Place all items before checking.';
      } else if (correct === total) {
        resultEl.classList.add('pass');
        resultEl.innerHTML = '<strong>✅ All correct!</strong>';
        if (cfg.onAllPlaced) cfg.onAllPlaced({ allCorrect: true });
      } else {
        resultEl.classList.add('fail');
        resultEl.innerHTML = '<strong>' + correct + ' of ' + total + ' correct.</strong> Items highlighted in red are in the wrong column.';
        if (cfg.onAllPlaced) cfg.onAllPlaced({ allCorrect: false });
      }
    }
  }

  function _resetSorter(cid) {
    const cfg = _configs[cid];
    if (!cfg) return;
    createSorter(cfg);
  }

  // ── Helpers ──────────────────────────────────

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    createSequencer:  createSequencer,
    createSorter:     createSorter,
    _checkSequencer:  _checkSequencer,
    _resetSequencer:  _resetSequencer,
    _checkSorter:     _checkSorter,
    _resetSorter:     _resetSorter,
  };
})();
