/**
 * Clickable Diagram Engine for Pools Etc Training Portal
 *
 * Usage:
 *   Diagram.create({
 *     containerId: 'diagram-widget',
 *     imgSrc: '../assets/img/pool-diagram.svg',
 *     infoPanelId: 'diagram-info',
 *     hotspots: [
 *       {
 *         id: 'pump',
 *         x: '21%', y: '47%',   // percent position on image
 *         label: 'Pump',
 *         body: 'The pump is the heart of the circulation system...',
 *         fact: 'Key fact: Run the pump 8-12 hrs/day in summer.',
 *       },
 *       ...
 *     ],
 *   });
 */

const Diagram = (function () {

  const _instances = {};

  function create(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    _instances[config.containerId] = config;

    container.innerHTML = [
      '<div class="diagram-layout">',
      '  <div class="diagram-svg-wrap" id="' + config.containerId + '-imgwrap">',
      '    <img src="' + config.imgSrc + '" alt="Equipment pad diagram" style="width:100%;display:block;" id="' + config.containerId + '-img"/>',
      config.hotspots.map(function (hs, idx) {
        return '<button class="hotspot" id="hs-' + config.containerId + '-' + hs.id + '" '
          + 'style="left:' + hs.x + ';top:' + hs.y + ';" '
          + 'onclick="Diagram._click(\'' + config.containerId + '\',\'' + hs.id + '\')" '
          + 'aria-label="Learn about ' + _esc(hs.label) + '" '
          + 'title="' + _esc(hs.label) + '">'
          + (idx + 1)
          + '</button>';
      }).join(''),
      '  </div>',
      '  <div class="diagram-info-panel" id="' + (config.infoPanelId || config.containerId + '-info') + '">',
      '    <div class="diagram-info-panel__placeholder">👆 Click a numbered hotspot to learn about that component.</div>',
      '    <div class="diagram-info-panel__title"></div>',
      '    <div class="diagram-info-panel__body"></div>',
      '    <div class="diagram-info-panel__fact"></div>',
      '  </div>',
      '</div>',
    ].join('');
  }

  function _click(cid, hotspotId) {
    const config = _instances[cid];
    if (!config) return;

    const hs = config.hotspots.find(function (h) { return h.id === hotspotId; });
    if (!hs) return;

    // Deactivate all hotspots
    config.hotspots.forEach(function (h) {
      const btn = document.getElementById('hs-' + cid + '-' + h.id);
      if (btn) btn.classList.remove('active');
    });

    // Activate selected
    const activeBtn = document.getElementById('hs-' + cid + '-' + hotspotId);
    if (activeBtn) activeBtn.classList.add('active');

    // Update info panel
    const panelId = config.infoPanelId || cid + '-info';
    const panel = document.getElementById(panelId);
    if (!panel) return;

    panel.classList.add('active');
    const titleEl = panel.querySelector('.diagram-info-panel__title');
    const bodyEl  = panel.querySelector('.diagram-info-panel__body');
    const factEl  = panel.querySelector('.diagram-info-panel__fact');

    if (titleEl) titleEl.textContent = hs.label;
    if (bodyEl)  bodyEl.innerHTML  = hs.body;
    if (factEl)  factEl.textContent = hs.fact;
  }

  function _esc(str) {
    return String(str || '').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  return {
    create: create,
    _click: _click,
  };
})();
