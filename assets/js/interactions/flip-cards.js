/**
 * Flip Cards (Flashcard Deck) for Pools Etc Training Portal
 *
 * Usage:
 *   FlipCards.create({
 *     containerId: 'flashcard-deck',
 *     cards: [{ front: 'Question text', back: 'Answer text' }]
 *   });
 */

const FlipCards = (function () {

  const _decks = {};

  /**
   * create(config)
   * Renders a flashcard deck into the given container.
   *
   * config = {
   *   containerId: string,
   *   cards: [{ front: string, back: string }],
   * }
   */
  function create(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    const cards = config.cards;
    const cid   = config.containerId;

    _decks[cid] = {
      cards:   cards,
      current: 0,
      flipped: false,
    };

    _render(cid);
  }

  function _render(cid) {
    const container = document.getElementById(cid);
    if (!container) return;

    const deck    = _decks[cid];
    const cards   = deck.cards;
    const current = deck.current;
    const card    = cards[current];

    const dots = cards.map(function (c, i) {
      return '<div class="flashcard-nav__dot' + (i === current ? ' active' : '') + '" '
        + 'onclick="FlipCards._goto(\'' + cid + '\',' + i + ')" '
        + 'aria-label="Card ' + (i + 1) + '" role="button" tabindex="0"></div>';
    }).join('');

    container.innerHTML = [
      '<div class="flashcard-section">',
      '  <div class="flashcard-section__header">',
      '    <span class="flashcard-section__title">📇 Quick Review Flashcards</span>',
      '    <span class="flashcard-counter">Card ' + (current + 1) + ' of ' + cards.length + '</span>',
      '  </div>',

      '  <div class="flashcard-stage" onclick="FlipCards._flip(\'' + cid + '\')" '
        + 'role="button" tabindex="0" aria-label="Flashcard — click to flip" '
        + 'onkeydown="if(event.key===\'Enter\'||event.key===\' \')FlipCards._flip(\'' + cid + '\')">',
      '    <div class="flashcard" id="' + cid + '-card">',
      '      <div class="flashcard__face flashcard__front">',
      '        <span class="flashcard__face-label">Question</span>',
      '        <div class="flashcard__text">' + _esc(card.front) + '</div>',
      '        <span class="flashcard__hint">tap to flip</span>',
      '      </div>',
      '      <div class="flashcard__face flashcard__back">',
      '        <span class="flashcard__face-label">Answer</span>',
      '        <div class="flashcard__text">' + _esc(card.back) + '</div>',
      '        <span class="flashcard__hint">tap to flip back</span>',
      '      </div>',
      '    </div>',
      '  </div>',

      '  <div class="flashcard-nav">',
      '    <button class="btn btn-ghost btn-sm" onclick="FlipCards._prev(\'' + cid + '\')" '
        + (current === 0 ? 'disabled' : '') + ' aria-label="Previous card">← Prev</button>',
      '    <div class="flashcard-nav__dots">' + dots + '</div>',
      '    <button class="btn btn-ghost btn-sm" onclick="FlipCards._next(\'' + cid + '\')" '
        + (current === cards.length - 1 ? 'disabled' : '') + ' aria-label="Next card">Next →</button>',
      '  </div>',
      '</div>',
    ].join('');
  }

  function _flip(cid) {
    const deck = _decks[cid];
    if (!deck) return;
    deck.flipped = !deck.flipped;
    const cardEl = document.getElementById(cid + '-card');
    if (cardEl) {
      if (deck.flipped) {
        cardEl.classList.add('flipped');
      } else {
        cardEl.classList.remove('flipped');
      }
    }
  }

  function _next(cid) {
    const deck = _decks[cid];
    if (!deck) return;
    if (deck.current < deck.cards.length - 1) {
      deck.current++;
      deck.flipped = false;
      _render(cid);
    }
  }

  function _prev(cid) {
    const deck = _decks[cid];
    if (!deck) return;
    if (deck.current > 0) {
      deck.current--;
      deck.flipped = false;
      _render(cid);
    }
  }

  function _goto(cid, idx) {
    const deck = _decks[cid];
    if (!deck) return;
    deck.current = idx;
    deck.flipped  = false;
    _render(cid);
  }

  function _esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  return {
    create: create,
    _flip:  _flip,
    _next:  _next,
    _prev:  _prev,
    _goto:  _goto,
  };
})();
