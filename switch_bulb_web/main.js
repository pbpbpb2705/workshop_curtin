// Switch & Bulb — Modifiable logic per switch + quality check
const bulbsEl = document.getElementById('bulbs');
const switchesEl = document.getElementById('switches');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');

// Switch positions (inputs)
let currentSwitch = [false, false, false, false, false];
// Logic mapping per switch: what the bulb should be for ON and OFF branches
// Default mirrors the original: if ON -> ON, else -> OFF
let logicConfig = Array.from({length:5}, () => ({ ifOn: true, ifOff: false }));

function computeBulbState(idx) {
  const sw = currentSwitch[idx];
  const cfg = logicConfig[idx];
  return sw ? cfg.ifOn : cfg.ifOff;
}

function renderBulbs() {
  bulbsEl.innerHTML = '';
  for (let i = 0; i < 5; i++) {
    const on = computeBulbState(i);
    const b = document.createElement('div');
    b.className = 'bulb' + (on ? ' on' : '');
    b.textContent = on ? 'ON' : 'OFF';
    bulbsEl.appendChild(b);
  }
}

function logicBlock(idx) {
  const wrap = document.createElement('div');
  wrap.className = 'logic';

  const onMap = logicConfig[idx].ifOn ? 'ON' : 'OFF';
  const offMap = logicConfig[idx].ifOff ? 'ON' : 'OFF';
  const swOn = currentSwitch[idx];

  const lineIf = document.createElement('div');
  lineIf.className = 'line' + (swOn ? ' hit' : '');
  lineIf.textContent = `if (switch[${idx}] == ON)  →  bulb[${idx}] = ${onMap}`;

  const lineElse = document.createElement('div');
  lineElse.className = 'line' + (!swOn ? ' hit' : '');
  lineElse.textContent = `else                   →  bulb[${idx}] = ${offMap}`;

  wrap.appendChild(lineIf);
  wrap.appendChild(lineElse);
  return wrap;
}

function selectControl(labelText, value, onChange) {
  const box = document.createElement('div');
  box.className = 'selectbox';
  const label = document.createElement('label');
  label.textContent = labelText;
  const select = document.createElement('select');
  const optOn = document.createElement('option'); optOn.value = 'true';  optOn.textContent = 'ON';
  const optOff = document.createElement('option'); optOff.value = 'false'; optOff.textContent = 'OFF';
  select.appendChild(optOn); select.appendChild(optOff);
  select.value = String(value);
  select.addEventListener('change', e => onChange(e.target.value === 'true'));
  box.appendChild(label);
  box.appendChild(select);
  return box;
}

function renderSwitches() {
  switchesEl.innerHTML = '';
  for (let idx = 0; idx < 5; idx++) {
    const card = document.createElement('div');
    card.className = 'switchcard';

    const row = document.createElement('div');
    row.className = 'switchrow';

    const lbl = document.createElement('div');
    lbl.className = 'switchlbl';
    lbl.textContent = `Switch ${idx+1}`;

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'toggle';
    input.checked = currentSwitch[idx];
    input.addEventListener('change', () => { currentSwitch[idx] = !currentSwitch[idx]; render(); });

    const pill = document.createElement('span');
    pill.className = 'statepill' + (currentSwitch[idx] ? ' on' : '');
    pill.textContent = currentSwitch[idx] ? 'ON' : 'OFF';

    row.appendChild(lbl);
    row.appendChild(input);
    row.appendChild(pill);

    // Logic controls
    const controls = document.createElement('div');
    controls.className = 'logic-controls';
    controls.appendChild(selectControl('If switch is ON → bulb =', logicConfig[idx].ifOn, v => { logicConfig[idx].ifOn = v; render(); }));
    controls.appendChild(selectControl('Else (switch OFF) → bulb =', logicConfig[idx].ifOff, v => { logicConfig[idx].ifOff = v; render(); }));

    // Code-like block
    const logic = logicBlock(idx);

    card.appendChild(row);
    card.appendChild(controls);
    card.appendChild(logic);
    switchesEl.appendChild(card);
  }
}

// ---- Quality check helpers ----
function allBulbsOn() {
  for (let i = 0; i < 5; i++) if (!computeBulbState(i)) return false;
  return true;
}
function degenerateSwitchIndices() {
  // Only the specific case requested: IF ON -> ON AND IF OFF -> ON
  const out = [];
  for (let i = 0; i < 5; i++) {
    if (logicConfig[i].ifOn === true && logicConfig[i].ifOff === true) out.push(i);
  }
  return out;
}

// ---- Render & status ----
function render() {
  renderBulbs();
  renderSwitches();
  updateStatus();
}

function reset() {
  currentSwitch = currentSwitch.map(() => false);
  statusEl.classList.remove('win', 'warn');
  statusEl.textContent = 'Tip: Toggle a switch and modify its if–else mapping below using the dropdowns (choose what the bulb should be when the switch is ON/OFF).';
  render();
}

function updateStatus() {
  const onCount = Array.from({length:5}, (_, i) => computeBulbState(i)).filter(Boolean).length;
  const allOn = onCount === 5;
  const bad = degenerateSwitchIndices();

  statusEl.classList.remove('win', 'warn');
  if (allOn && bad.length > 0) {
    // Output is satisfied, but logic is not correct
    const list = bad.map(i => i+1).join(', ');
    statusEl.classList.add('warn');
    statusEl.textContent = `Not quite yet — the logic for switch(es) ${list} makes the bulb ON regardless of input (IF ON→ON, ELSE→ON). Adjust the ELSE branch.`;
    return;
  }

  if (allOn) {
    statusEl.classList.add('win');
    statusEl.textContent = 'All bulbs are ON! 🎉';
  } else {
    statusEl.textContent = `Bulbs ON: ${onCount}/5`;
  }
}

resetBtn.addEventListener('click', reset);
render();
