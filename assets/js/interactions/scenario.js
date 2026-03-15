/**
 * Branching Scenario Engine for Pools Etc Training Portal
 *
 * Usage:
 *   Scenario.create({
 *     containerId: 'scenario-widget',
 *     scenes: [
 *       {
 *         id: 'scene1',
 *         title: 'Scene 1 — Arriving',
 *         narrative: 'You pull up to...',
 *         question: 'What do you do?',
 *         choices: [
 *           { text: 'Walk straight to the pool', correct: false, feedback: 'Always greet first.' },
 *           { text: 'Smile, make eye contact, say hello', correct: true, feedback: 'Great! SEC in action.' },
 *           { text: 'Honk and wave', correct: false, feedback: 'Too casual.' },
 *         ],
 *       },
 *       ...more scenes,
 *     ],
 *     finalScreen: { title, html },  // optional custom final screen HTML
 *   });
 */

const Scenario = (function () {

  const _instances = {};

  function create(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    _instances[config.containerId] = {
      config:       config,
      currentScene: 0,
      doneScenes:   [],
    };

    _renderScene(config.containerId);
  }

  function _renderScene(cid) {
    const inst   = _instances[cid];
    const config = inst.config;
    const container = document.getElementById(cid);
    if (!container) return;

    // Show final screen
    if (inst.currentScene >= config.scenes.length) {
      _renderFinal(cid);
      return;
    }

    const scene   = config.scenes[inst.currentScene];
    const total   = config.scenes.length;
    const current = inst.currentScene;

    const dots = Array.from({ length: total }, function (_, i) {
      let cls = 'scenario-progress__dot';
      if (inst.doneScenes.includes(i)) cls += ' done';
      else if (i === current) cls += ' current';
      return '<div class="' + cls + '"></div>';
    }).join('');

    const choicesHtml = scene.choices.map(function (choice, idx) {
      return '<button class="scenario-choice" onclick="Scenario._choose(\'' + cid + '\',' + idx + ')">'
        + _esc(choice.text)
        + '</button>';
    }).join('');

    container.innerHTML = [
      '<div class="scenario-container">',
      '  <div class="scenario-header">',
      '    <div>',
      '      <div class="scenario-header__scene">Scene ' + (current + 1) + ' of ' + total + '</div>',
      '      <div class="scenario-header__title">' + _esc(scene.title) + '</div>',
      '    </div>',
      '  </div>',
      '  <div class="scenario-body">',
      '    <div class="scenario-progress">' + dots + '</div>',
      '    <div class="scenario-narrative">' + _esc(scene.narrative) + '</div>',
      '    <div class="scenario-question">' + _esc(scene.question) + '</div>',
      '    <div class="scenario-choices" id="' + cid + '-choices">',
      choicesHtml,
      '    </div>',
      '    <div class="scenario-feedback" id="' + cid + '-feedback"></div>',
      '  </div>',
      '</div>',
    ].join('');
  }

  function _choose(cid, choiceIdx) {
    const inst   = _instances[cid];
    const config = inst.config;
    const scene  = config.scenes[inst.currentScene];
    const choice = scene.choices[choiceIdx];
    if (!choice) return;

    // Disable all choices
    const choicesEl = document.getElementById(cid + '-choices');
    if (choicesEl) {
      choicesEl.querySelectorAll('.scenario-choice').forEach(function (btn) {
        btn.disabled = true;
        btn.style.opacity = '0.6';
      });
    }

    // Show feedback
    const feedbackEl = document.getElementById(cid + '-feedback');
    if (feedbackEl) {
      feedbackEl.classList.add('visible');
      feedbackEl.classList.remove('correct', 'incorrect');
      feedbackEl.classList.add(choice.correct ? 'correct' : 'incorrect');

      const nextBtnText = (inst.currentScene + 1 < config.scenes.length)
        ? 'Next Scene →'
        : 'See Summary';

      feedbackEl.innerHTML = [
        '<div class="scenario-feedback__title">' + (choice.correct ? '✅ Good choice!' : '❌ Not quite.') + '</div>',
        '<p style="margin:0; font-size: var(--text-sm);">' + _esc(choice.feedback) + '</p>',
        '<button class="btn btn-primary" style="margin-top: var(--space-3);" onclick="Scenario._next(\'' + cid + '\')">' + nextBtnText + '</button>',
      ].join('');
    }
  }

  function _next(cid) {
    const inst = _instances[cid];
    if (!inst) return;
    inst.doneScenes.push(inst.currentScene);
    inst.currentScene++;
    _renderScene(cid);
  }

  function _renderFinal(cid) {
    const inst      = _instances[cid];
    const config    = inst.config;
    const container = document.getElementById(cid);
    if (!container) return;

    if (config.finalScreen) {
      container.innerHTML = [
        '<div class="scenario-container">',
        '  <div class="scenario-body">',
        '    <div class="scenario-final">',
        config.finalScreen.html,
        '    </div>',
        '  </div>',
        '</div>',
      ].join('');
    } else {
      container.innerHTML = [
        '<div class="scenario-container">',
        '  <div class="scenario-body">',
        '    <div class="scenario-final">',
        '      <div class="scenario-final__title">🎉 Scenario Complete!</div>',
        '      <p>Great work making it through all the scenes.</p>',
        '    </div>',
        '  </div>',
        '</div>',
      ].join('');
    }
  }

  function _esc(str) {
    return String(str || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    create:  create,
    _choose: _choose,
    _next:   _next,
  };
})();
