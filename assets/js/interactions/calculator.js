/**
 * Chemical Dosing Calculator for Pools Etc Training Portal
 *
 * Usage:
 *   Calculator.create({ containerId: 'calc-widget' });
 *
 * The calculator uses dosing formulas from the Pools Etc training transcripts.
 */

const Calculator = (function () {

  // Dosing formulas per 10,000 gallons to achieve target change
  // These are the standard pool industry dosing rates
  const FORMULAS = {
    raise_alk: {
      label: 'Raise Alkalinity',
      chemical: 'Sodium Bicarbonate (Baking Soda)',
      unit: 'lbs',
      // 1.5 lbs per 10k gal raises alk by 10 ppm
      ratePerTenK: 1.5,
      perPPM: 10,
      targetLabel: 'How many PPM do you need to raise it?',
      targetMin: 5, targetMax: 60, targetDefault: 20,
      safetyNote: '⚠️ Add baking soda by broadcasting around the perimeter of the pool — never near the skimmer. Run pump 30 min after adding.',
      example: 'Pool reads 60 ppm, target is 100 ppm → raise by 40 ppm',
    },
    lower_ph: {
      label: 'Lower pH',
      chemical: 'Muriatic Acid (31.45% strength)',
      unit: 'oz',
      // ~10 oz per 10k gal lowers pH by 0.2
      ratePerTenK: 10,
      perUnit: 0.2,
      targetLabel: 'How much do you need to lower pH?',
      targetMin: 0.1, targetMax: 1.0, targetDefault: 0.4, targetStep: 0.1,
      safetyNote: '⚠️ ALWAYS add acid to water — never water to acid. Pour slowly near return jets. Never mix with chlorine. Wear eye protection.',
      example: 'pH reads 7.8, target is 7.4 → lower by 0.4',
    },
    raise_cya: {
      label: 'Raise CYA (Stabilizer)',
      chemical: 'Cyanuric Acid (Stabilizer)',
      unit: 'lbs',
      // 1.3 lbs per 10k gal raises CYA by 10 ppm
      ratePerTenK: 1.3,
      perPPM: 10,
      targetLabel: 'How many PPM do you need to raise CYA?',
      targetMin: 10, targetMax: 50, targetDefault: 30,
      safetyNote: '⚠️ Add CYA to a bucket of warm water first (dissolve), then pour into skimmer slowly. Do NOT backwash for 48 hours after adding.',
      example: 'CYA reads 20 ppm, target is 50 ppm → raise by 30 ppm',
    },
    add_shock: {
      label: 'Shock the Pool (Raise Chlorine)',
      chemical: 'Cal-Hypo Shock (68% available chlorine)',
      unit: 'lbs',
      // 1 lb per 10k gal raises FC by ~7 ppm
      ratePerTenK: 1,
      perPPM: 7,
      targetLabel: 'How many PPM do you need to raise chlorine?',
      targetMin: 5, targetMax: 30, targetDefault: 10,
      safetyNote: '🚨 CRITICAL: PRE-DISSOLVE shock in a bucket of water FIRST — never pour granules directly into pool. Never add shock near skimmer. Never mix with other chemicals. Add after sunset or with pump running.',
      example: 'FC reads 0, you want to shock to 10 ppm',
    },
    raise_ch: {
      label: 'Raise Calcium Hardness',
      chemical: 'Calcium Chloride',
      unit: 'lbs',
      // 1.25 lbs per 10k gal raises CH by 10 ppm
      ratePerTenK: 1.25,
      perPPM: 10,
      targetLabel: 'How many PPM do you need to raise calcium hardness?',
      targetMin: 10, targetMax: 100, targetDefault: 50,
      safetyNote: '⚠️ Calcium chloride dissolves with heat. Add slowly around perimeter. Never add to skimmer directly. Expect mild cloudiness for a few hours.',
      example: 'CH reads 150 ppm, target is 200 ppm → raise by 50 ppm',
    },
  };

  function create(config) {
    const container = document.getElementById(config.containerId);
    if (!container) return;

    const chemOptions = Object.keys(FORMULAS).map(function (key) {
      return '<option value="' + key + '">' + FORMULAS[key].label + '</option>';
    }).join('');

    container.innerHTML = [
      '<div class="calculator-form">',
      '  <div class="calc-field">',
      '    <label for="' + config.containerId + '-vol">Pool Volume (gallons)</label>',
      '    <select id="' + config.containerId + '-vol">',
      '      <option value="5000">5,000 gallons (small spa)</option>',
      '      <option value="10000" selected>10,000 gallons (avg residential)</option>',
      '      <option value="15000">15,000 gallons</option>',
      '      <option value="20000">20,000 gallons (large)</option>',
      '      <option value="25000">25,000 gallons (commercial/large)</option>',
      '    </select>',
      '  </div>',
      '  <div class="calc-field">',
      '    <label for="' + config.containerId + '-chem">Chemical Needed</label>',
      '    <select id="' + config.containerId + '-chem" onchange="Calculator._onChemChange(\'' + config.containerId + '\')">' + chemOptions + '</select>',
      '  </div>',
      '  <div class="calc-field" id="' + config.containerId + '-target-wrap">',
      '    <label for="' + config.containerId + '-target" id="' + config.containerId + '-target-lbl">' + FORMULAS['raise_alk'].targetLabel + '</label>',
      '    <input type="number" id="' + config.containerId + '-target" value="20" min="5" max="60" step="5"/>',
      '  </div>',
      '</div>',
      '<div style="font-size: var(--text-sm); color: var(--color-locked); margin-bottom: var(--space-3);" id="' + config.containerId + '-example">'
        + FORMULAS['raise_alk'].example + '</div>',
      '<button class="btn btn-primary" onclick="Calculator._calculate(\'' + config.containerId + '\')">Calculate Dose</button>',
      '<div class="calc-result" id="' + config.containerId + '-result"></div>',
    ].join('');
  }

  function _onChemChange(cid) {
    const chemEl = document.getElementById(cid + '-chem');
    if (!chemEl) return;
    const key = chemEl.value;
    const formula = FORMULAS[key];
    if (!formula) return;

    const lblEl = document.getElementById(cid + '-target-lbl');
    const inputEl = document.getElementById(cid + '-target');
    const exampleEl = document.getElementById(cid + '-example');

    if (lblEl) lblEl.textContent = formula.targetLabel;
    if (inputEl) {
      inputEl.min   = formula.targetMin;
      inputEl.max   = formula.targetMax;
      inputEl.value = formula.targetDefault;
      inputEl.step  = formula.targetStep || 1;
    }
    if (exampleEl) exampleEl.textContent = formula.example;

    // Hide old result
    const resultEl = document.getElementById(cid + '-result');
    if (resultEl) resultEl.classList.remove('visible');
  }

  function _calculate(cid) {
    const volEl    = document.getElementById(cid + '-vol');
    const chemEl   = document.getElementById(cid + '-chem');
    const targetEl = document.getElementById(cid + '-target');
    const resultEl = document.getElementById(cid + '-result');
    if (!volEl || !chemEl || !targetEl || !resultEl) return;

    const volume  = parseFloat(volEl.value);
    const key     = chemEl.value;
    const target  = parseFloat(targetEl.value);
    const formula = FORMULAS[key];
    if (!formula || isNaN(volume) || isNaN(target)) return;

    let dose;
    let perLabel;

    if (formula.perPPM) {
      // dose = (target ppm / formula.perPPM) * (volume / 10000) * ratePerTenK
      dose = (target / formula.perPPM) * (volume / 10000) * formula.ratePerTenK;
      perLabel = target + ' ppm change, ' + _fmtVol(volume) + ' pool';
    } else if (formula.perUnit) {
      // pH adjustment: target is the pH drop amount
      dose = (target / formula.perUnit) * (volume / 10000) * formula.ratePerTenK;
      perLabel = target.toFixed(1) + ' pH units, ' + _fmtVol(volume) + ' pool';
    }

    dose = Math.ceil(dose * 10) / 10; // round up to nearest 0.1

    resultEl.classList.add('visible');
    resultEl.innerHTML = [
      '<div class="calc-result__dose">',
      '  ' + dose.toFixed(1) + ' ' + formula.unit,
      '  <span style="font-size: var(--text-sm); color: var(--color-body); font-weight:400;"> of ' + formula.chemical + '</span>',
      '</div>',
      '<p style="margin:0; font-size: var(--text-sm); color: var(--color-body);">For ' + perLabel + '</p>',
      '<div class="calc-result__safety">' + formula.safetyNote + '</div>',
    ].join('');
  }

  function _fmtVol(v) {
    return v.toLocaleString() + ' gal';
  }

  return {
    create:          create,
    _onChemChange:   _onChemChange,
    _calculate:      _calculate,
  };
})();
