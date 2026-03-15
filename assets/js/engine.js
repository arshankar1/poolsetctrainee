/**
 * Quiz Engine for Pools Etc Training Portal
 *
 * Renders, grades, and displays results for all module quizzes.
 *
 * Question types:
 *   'mc'  — Multiple Choice (one correct answer by index)
 *   'tf'  — True/False
 *   'sa'  — Short Answer (keyword matching, NOT gated for pass/fail)
 *
 * Pass threshold: 8 out of the non-SA questions (80%).
 * SA questions always show "Discuss with trainer" regardless of answer.
 */

// ─────────────────────────────────────────────
//  QUIZ DATA
// ─────────────────────────────────────────────

const QUIZ_DATA = {

  // ── MODULE 1: Compliance & Safety ─────────────
  module1: [
    {
      id: 'm1q1',
      type: 'mc',
      question: 'Under CA law (SB 1343), how many hours of sexual harassment prevention training are required for non-supervisory employees?',
      choices: ['30 minutes', '1 hour', '2 hours', '4 hours'],
      correct: 1,
      explanation: 'SB 1343 requires 1 hour for non-supervisory employees, renewed every 2 years.',
    },
    {
      id: 'm1q2',
      type: 'mc',
      question: 'How often must CA employees be retrained on sexual harassment prevention?',
      choices: ['Every year', 'Every 2 years', 'Every 3 years', 'Every 5 years'],
      correct: 1,
      explanation: 'Retraining is required every 2 years under CA law.',
    },
    {
      id: 'm1q3',
      type: 'sa',
      question: 'What are the 3 key words to remember for heat illness prevention?',
      keywords: ['water', 'rest', 'shade'],
      minKeywords: 2,
      explanation: 'Water, Rest, Shade — the three pillars of heat illness prevention.',
    },
    {
      id: 'm1q4',
      type: 'mc',
      question: 'At what body temperature does heat illness become a medical concern?',
      choices: ['98.6°F', '99.0°F', '100.4°F', '102.0°F'],
      correct: 2,
      explanation: 'Body temperature above 100.4°F is the threshold for heat illness concern.',
    },
    {
      id: 'm1q5',
      type: 'mc',
      question: 'How often should you drink water when working in the heat, even if not thirsty?',
      choices: ['Every 5 minutes', 'Every 15 minutes', 'Every 30 minutes', 'Every hour'],
      correct: 1,
      explanation: 'Drink water every 15 minutes regardless of thirst to prevent dehydration.',
    },
    {
      id: 'm1q6',
      type: 'sa',
      question: 'Most work-related heat deaths occur during what period of employment?',
      keywords: ['first', 'few days', 'beginning', 'early'],
      minKeywords: 1,
      explanation: 'Most deaths happen in the first few days — new workers haven\'t acclimatized yet.',
    },
    {
      id: 'm1q7',
      type: 'tf',
      question: 'Heat illness only affects people who are out of shape or in poor health.',
      correct: false,
      explanation: 'Heat illness can affect anyone regardless of age, fitness, or experience.',
    },
    {
      id: 'm1q8',
      type: 'sa',
      question: 'Name two symptoms of heat illness.',
      keywords: ['headache', 'nausea', 'dizziness', 'weakness', 'irritability', 'confusion', 'thirst', 'sweating'],
      minKeywords: 2,
      explanation: 'Symptoms include: headache, nausea, dizziness, weakness, irritability, confusion, thirst, heavy sweating.',
    },
    {
      id: 'm1q9',
      type: 'mc',
      question: 'What clothing is recommended when working in the heat?',
      choices: [
        'Dark, heavy clothing for protection',
        'Light-colored clothing and a hat',
        'Long sleeves only',
        'No specific requirements',
      ],
      correct: 1,
      explanation: 'Light-colored clothing reflects heat; a hat protects from direct sun.',
    },
    {
      id: 'm1q10',
      type: 'sa',
      question: 'The Smith System of driving focuses on what primary goal?',
      keywords: ['accident', 'safe', 'mirror', 'scanning', 'no accident', 'avoid'],
      minKeywords: 1,
      explanation: 'The Smith System focuses on no-accident driving through proper mirror use, scanning, and awareness.',
    },
  ],

  // ── MODULES 2–6: Populated in later phases ────
  module2: [],
  module3: [],
  module4: [],
  module5: [],
  module6: [],
  final:   [],
};

// ─────────────────────────────────────────────
//  QUIZ ENGINE
// ─────────────────────────────────────────────

const QuizEngine = (function () {

  // Track current state per module
  const _state = {};

  /**
   * render(moduleId, containerId)
   * Renders all questions for a module into the given container.
   */
  function render(moduleId, containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.warn('[QuizEngine] Container not found:', containerId);
      return;
    }

    const questions = QUIZ_DATA[moduleId];
    if (!questions || questions.length === 0) {
      container.innerHTML = '<p class="text-muted">Quiz questions for this module are coming soon.</p>';
      return;
    }

    // Initialize state
    _state[moduleId] = {
      answers: {},
      submitted: false,
    };

    // Update progress bar
    const totalGraded = questions.filter(function (q) { return q.type !== 'sa'; }).length;

    const html = [
      '<div class="quiz-header">',
      '  <h3>Module Quiz</h3>',
      '  <span class="quiz-header-meta">' + questions.length + ' questions</span>',
      '</div>',
      '<div class="quiz-progress-bar" id="' + containerId + '-progress">',
      '  <div class="quiz-progress-bar__fill" id="' + containerId + '-progress-fill" style="width: 0%"></div>',
      '</div>',
      '<div class="quiz-body" id="' + containerId + '-body">',
      _renderQuestions(questions, moduleId),
      '  <div class="quiz-actions">',
      '    <button class="btn btn-primary quiz-submit-btn" onclick="QuizEngine.grade(\'' + moduleId + '\', \'' + containerId + '\')" id="' + containerId + '-submit">',
      '      Submit Quiz',
      '    </button>',
      '  </div>',
      '</div>',
    ].join('\n');

    container.innerHTML = html;
    _attachListeners(moduleId, containerId);
  }

  /**
   * grade(moduleId, containerId)
   * Scores the current attempt and triggers result display.
   */
  function grade(moduleId, containerId) {
    const questions  = QUIZ_DATA[moduleId];
    const state      = _state[moduleId];
    if (!questions || !state) return;

    state.submitted = true;

    let scoredCorrect = 0;
    let scoredTotal   = 0;
    const results = [];

    questions.forEach(function (q) {
      const userAnswer = state.answers[q.id];
      let isCorrect    = false;
      let isSA         = (q.type === 'sa');
      let saMatched    = false;

      if (q.type === 'mc') {
        isCorrect = (parseInt(userAnswer) === q.correct);
        scoredTotal++;
        if (isCorrect) scoredCorrect++;
      } else if (q.type === 'tf') {
        const userBool = (userAnswer === 'true');
        isCorrect = (userBool === q.correct);
        scoredTotal++;
        if (isCorrect) scoredCorrect++;
      } else if (q.type === 'sa') {
        // Keyword check — SA does NOT count toward pass/fail
        const response = (userAnswer || '').toLowerCase();
        const min      = q.minKeywords || 1;
        const matched  = (q.keywords || []).filter(function (kw) {
          return response.includes(kw.toLowerCase());
        }).length;
        saMatched = (matched >= min);
      }

      results.push({
        id:         q.id,
        question:   q.question,
        type:       q.type,
        isCorrect:  isCorrect,
        isSA:       isSA,
        saMatched:  saMatched,
        userAnswer: userAnswer,
        correct:    q.correct,
        explanation: q.explanation,
        choices:    q.choices || null,
      });
    });

    const passed   = (scoredTotal > 0) ? (scoredCorrect / scoredTotal >= 0.8) : false;
    const gradeResult = {
      score:   scoredCorrect,
      total:   scoredTotal,
      passed:  passed,
      results: results,
    };

    // Mark correct/incorrect visually on question elements
    _highlightAnswers(results, moduleId, containerId);

    // Save to progress if passed
    if (passed && typeof Progress !== 'undefined') {
      Progress.markModuleComplete(moduleId, scoredCorrect);
    }

    // Show results panel
    showResults(containerId, gradeResult);

    return gradeResult;
  }

  /**
   * showResults(containerId, gradeResult)
   * Renders the result summary panel below the quiz body.
   */
  function showResults(containerId, gradeResult) {
    // Remove existing results panel if present
    const existing = document.getElementById(containerId + '-results');
    if (existing) existing.remove();

    // Hide submit button
    const submitBtn = document.getElementById(containerId + '-submit');
    if (submitBtn) submitBtn.style.display = 'none';

    const passed     = gradeResult.passed;
    const score      = gradeResult.score;
    const total      = gradeResult.total;
    const pct        = total > 0 ? Math.round((score / total) * 100) : 0;
    const circleClass = passed ? 'passed' : 'failed';
    const verdictMsg  = passed
      ? 'You passed! You\'re ready to continue to the next module.'
      : 'Not quite — review the topics below and retry when you\'re ready. You need 8/' + total + ' to pass.';

    const verdictTitle = passed ? '✅ Quiz Passed!' : '❌ Not Passed Yet';

    // Build per-question result items
    const itemsHtml = gradeResult.results.map(function (r) {
      if (r.isSA) {
        const icon    = r.saMatched ? '💬' : '💬';
        const labelClass = 'trainer-review';
        return [
          '<div class="quiz-result-item ' + labelClass + '">',
          '  <span class="quiz-result-item__icon">' + icon + '</span>',
          '  <div class="quiz-result-item__content">',
          '    <div class="quiz-result-item__q">' + _escHtml(r.question) + '</div>',
          '    <div class="quiz-result-item__answer">Your answer: ' + _escHtml(r.userAnswer || '(no answer)') + '</div>',
          '    <div class="quiz-result-item__explanation">💡 Discuss with your trainer · ' + _escHtml(r.explanation) + '</div>',
          '  </div>',
          '</div>',
        ].join('\n');
      }

      const icon       = r.isCorrect ? '✅' : '❌';
      const itemClass  = r.isCorrect ? 'correct' : 'incorrect';
      let correctLabel = '';

      if (!r.isCorrect && r.choices && r.correct !== undefined) {
        correctLabel = '<div class="quiz-result-item__answer">Correct answer: <strong>' + _escHtml(r.choices[r.correct]) + '</strong></div>';
      } else if (!r.isCorrect && r.type === 'tf') {
        correctLabel = '<div class="quiz-result-item__answer">Correct answer: <strong>' + (r.correct ? 'TRUE' : 'FALSE') + '</strong></div>';
      }

      return [
        '<div class="quiz-result-item ' + itemClass + '">',
        '  <span class="quiz-result-item__icon">' + icon + '</span>',
        '  <div class="quiz-result-item__content">',
        '    <div class="quiz-result-item__q">' + _escHtml(r.question) + '</div>',
        correctLabel,
        '    <div class="quiz-result-item__explanation">' + _escHtml(r.explanation) + '</div>',
        '  </div>',
        '</div>',
      ].join('\n');
    }).join('\n');

    const nextModuleId = _getNextModuleId(containerId);
    const nextBtn = (passed && nextModuleId)
      ? '<a href="' + nextModuleId + '" class="btn btn-primary">Continue to Next Module →</a>'
      : '';

    const retryBtn = !passed
      ? '<button class="btn btn-secondary quiz-retry-btn" onclick="QuizEngine.retry(\'' + _currentModule + '\', \'' + containerId + '\')">Retry Quiz</button>'
      : '';

    const resultsHtml = [
      '<div class="quiz-results" id="' + containerId + '-results">',
      '  <div class="quiz-results__summary">',
      '    <div class="quiz-score-circle ' + circleClass + '">',
      '      <span class="quiz-score-circle__number">' + score + '/' + total + '</span>',
      '      <span class="quiz-score-circle__label">' + pct + '%</span>',
      '    </div>',
      '    <div class="quiz-results__verdict ' + circleClass + '">',
      '      <h3>' + verdictTitle + '</h3>',
      '      <p>' + verdictMsg + '</p>',
      '    </div>',
      '  </div>',
      '  <div class="quiz-results__items">',
      itemsHtml,
      '  </div>',
      '  <div class="quiz-results__actions">',
      retryBtn,
      nextBtn,
      '  </div>',
      '</div>',
    ].join('\n');

    // Append results after the quiz body
    const quizContainer = document.getElementById(containerId);
    if (quizContainer) {
      quizContainer.insertAdjacentHTML('beforeend', resultsHtml);
      // Scroll to results
      setTimeout(function () {
        const resultsEl = document.getElementById(containerId + '-results');
        if (resultsEl) resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }

  /**
   * retry(moduleId, containerId)
   * Resets and re-renders the quiz.
   */
  function retry(moduleId, containerId) {
    _currentModule = moduleId;
    render(moduleId, containerId);
  }

  // ─────────────────────────────────────────────
  //  PRIVATE HELPERS
  // ─────────────────────────────────────────────

  let _currentModule = null;

  function _renderQuestions(questions, moduleId) {
    _currentModule = moduleId;
    return questions.map(function (q, idx) {
      return _renderQuestion(q, idx + 1, moduleId);
    }).join('\n');
  }

  function _renderQuestion(q, num, moduleId) {
    const typeLabel = { mc: 'Multiple Choice', tf: 'True / False', sa: 'Short Answer' }[q.type] || q.type;
    const typeClass = 'quiz-question__type--' + q.type;

    let inputHtml = '';

    if (q.type === 'mc') {
      const choices = q.choices.map(function (choice, i) {
        return [
          '<div class="quiz-choice" data-qid="' + q.id + '" data-val="' + i + '" role="radio" tabindex="0"',
          '  aria-checked="false" onclick="QuizEngine._selectMC(this)" onkeydown="if(event.key===\'Enter\'||event.key===\' \')QuizEngine._selectMC(this)">',
          '  <span class="quiz-choice__indicator"></span>',
          '  <span class="quiz-choice__text">' + _escHtml(choice) + '</span>',
          '</div>',
        ].join(' ');
      }).join('\n');
      inputHtml = '<div class="quiz-choices" role="radiogroup">' + choices + '</div>';

    } else if (q.type === 'tf') {
      inputHtml = [
        '<div class="quiz-tf-buttons">',
        '  <button class="quiz-tf-btn" data-qid="' + q.id + '" data-val="true"  onclick="QuizEngine._selectTF(this)">TRUE</button>',
        '  <button class="quiz-tf-btn" data-qid="' + q.id + '" data-val="false" onclick="QuizEngine._selectTF(this)">FALSE</button>',
        '</div>',
      ].join('\n');

    } else if (q.type === 'sa') {
      inputHtml = [
        '<textarea',
        '  class="sa-answer"',
        '  data-qid="' + q.id + '"',
        '  placeholder="Type your answer here..."',
        '  rows="3"',
        '  oninput="QuizEngine._recordSA(this)"',
        '  aria-label="Answer for question ' + num + '"',
        '></textarea>',
        '<p class="sa-note">📝 Short-answer questions are reviewed with your trainer — they don\'t affect your score.</p>',
      ].join('\n');
    }

    return [
      '<div class="quiz-question" id="q-' + q.id + '">',
      '  <div class="quiz-question__num">',
      '    Question ' + num,
      '    <span class="quiz-question__type ' + typeClass + '">' + typeLabel + '</span>',
      '  </div>',
      '  <div class="quiz-question__text">' + _escHtml(q.question) + '</div>',
      inputHtml,
      '  <div class="quiz-explanation" id="exp-' + q.id + '"></div>',
      '</div>',
    ].join('\n');
  }

  function _attachListeners(moduleId, containerId) {
    // Update progress bar when any answer changes
    const container = document.getElementById(containerId + '-body');
    if (!container) return;

    container.addEventListener('click', function () {
      _updateProgressBar(moduleId, containerId);
    });
    container.addEventListener('input', function () {
      _updateProgressBar(moduleId, containerId);
    });
  }

  function _updateProgressBar(moduleId, containerId) {
    const questions = QUIZ_DATA[moduleId];
    const state     = _state[moduleId];
    if (!questions || !state) return;

    const answered = Object.keys(state.answers).filter(function (k) {
      return state.answers[k] !== undefined && state.answers[k] !== '';
    }).length;

    const fill = document.getElementById(containerId + '-progress-fill');
    if (fill) {
      fill.style.width = Math.round((answered / questions.length) * 100) + '%';
    }
  }

  function _highlightAnswers(results, moduleId, containerId) {
    results.forEach(function (r) {
      const qEl = document.getElementById('q-' + r.id);
      if (!qEl) return;

      const expEl = document.getElementById('exp-' + r.id);

      if (r.isSA) {
        if (expEl) {
          expEl.textContent = '💬 Discuss with trainer: ' + r.explanation;
          expEl.classList.add('visible');
        }
        return;
      }

      if (r.type === 'mc') {
        const choices = qEl.querySelectorAll('.quiz-choice');
        choices.forEach(function (choiceEl) {
          const val = parseInt(choiceEl.dataset.val);
          choiceEl.style.pointerEvents = 'none';
          if (val === r.correct) choiceEl.classList.add('was-correct');
          if (choiceEl.classList.contains('selected')) {
            choiceEl.classList.remove('selected');
            choiceEl.classList.add(r.isCorrect ? 'correct' : 'incorrect');
          }
        });
      } else if (r.type === 'tf') {
        const btns = qEl.querySelectorAll('.quiz-tf-btn');
        btns.forEach(function (btn) {
          const val = (btn.dataset.val === 'true');
          btn.disabled = true;
          if (val === r.correct) btn.classList.add('was-correct');
          if (btn.classList.contains('selected')) {
            btn.classList.remove('selected');
            btn.classList.add(r.isCorrect ? 'correct' : 'incorrect');
          }
        });
      }

      if (expEl) {
        expEl.textContent = r.explanation;
        expEl.classList.add('visible');
      }
    });
  }

  function _getNextModuleId(containerId) {
    // Try to infer next module URL from current page URL
    const path = window.location.pathname;
    const match = path.match(/module-(\d+)/);
    if (!match) return null;
    const num = parseInt(match[1]);
    if (num >= 6) return 'final-quiz.html'; // or null if no final quiz yet
    return 'module-' + (num + 1) + '.html';
  }

  function _escHtml(str) {
    if (str === undefined || str === null) return '';
    return String(str)
      .replace(/&/g,  '&amp;')
      .replace(/</g,  '&lt;')
      .replace(/>/g,  '&gt;')
      .replace(/"/g,  '&quot;')
      .replace(/'/g,  '&#39;');
  }

  // ─────────────────────────────────────────────
  //  INTERACTION HANDLERS (called from inline HTML)
  // ─────────────────────────────────────────────

  function _selectMC(el) {
    const qid = el.dataset.qid;
    const val = el.dataset.val;
    if (!qid || !_currentModule) return;

    // Deselect siblings
    const siblings = document.querySelectorAll('[data-qid="' + qid + '"]');
    siblings.forEach(function (s) {
      s.classList.remove('selected');
      s.setAttribute('aria-checked', 'false');
    });

    el.classList.add('selected');
    el.setAttribute('aria-checked', 'true');

    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = val;
  }

  function _selectTF(btn) {
    const qid = btn.dataset.qid;
    const val = btn.dataset.val;
    if (!qid || !_currentModule) return;

    const siblings = document.querySelectorAll('[data-qid="' + qid + '"]');
    siblings.forEach(function (s) { s.classList.remove('selected'); });
    btn.classList.add('selected');

    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = val;
  }

  function _recordSA(textarea) {
    const qid = textarea.dataset.qid;
    if (!qid || !_currentModule) return;
    if (!_state[_currentModule]) return;
    _state[_currentModule].answers[qid] = textarea.value;
  }

  // ─────────────────────────────────────────────
  //  EXPOSE PUBLIC API
  // ─────────────────────────────────────────────
  return {
    render:      render,
    grade:       grade,
    showResults: showResults,
    retry:       retry,
    // Expose interaction handlers so inline HTML can reach them
    _selectMC:   _selectMC,
    _selectTF:   _selectTF,
    _recordSA:   _recordSA,
  };
})();
