// Secret Shift — Web port with live preview on input (no Preview button)
const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
const PHRASES = (window.__PHRASES__ && Array.isArray(window.__PHRASES__)) ? window.__PHRASES__ : [
  "HELLO WORLD","CYBERSECURITY","SINGAPORE","THE NEW ERA","KNOWLEDGE IS POWER"
];

let round = 0;
let score = 0;
let totalRounds = PHRASES.length;

let currentPlain = null;
let currentShift = null;
let currentCipher = null;

const elRound = document.getElementById('round');
const elScore = document.getElementById('score');
const elCipher = document.getElementById('cipher');
const elPreview = document.getElementById('preview');
const elGuess = document.getElementById('guess');
const elLog = document.getElementById('log');
const btnGuess = document.getElementById('guessBtn');
const btnSkip = document.getElementById('skipBtn');
const btnNew = document.getElementById('newBtn');

function encryptCaesar(text, shift) {
  const up = text.toUpperCase();
  let out = "";
  for (let ch of up) {
    if (!ALPHABET.includes(ch)) { out += ch; continue; }
    const pos = ALPHABET.indexOf(ch);
    const newPos = (pos + shift) % 26;
    out += ALPHABET[newPos];
  }
  return out;
}

function decryptCaesar(text, shift) {
  const up = text.toUpperCase();
  let out = "";
  for (let ch of up) {
    if (!ALPHABET.includes(ch)) { out += ch; continue; }
    const pos = ALPHABET.indexOf(ch);
    const newPos = (pos - shift + 26) % 26;
    out += ALPHABET[newPos];
  }
  return out;
}

function log(msg, cls='') {
  const line = cls ? `<span class="${cls}">${msg}</span>` : msg;
  elLog.innerHTML += line + "\n";
  elLog.scrollTop = elLog.scrollHeight;
}

function updateStatus() {
  elRound.textContent = `Round ${round}/${totalRounds}`;
  elScore.textContent = `Score: ${score}`;
}

function updatePreviewFromInput() {
  const g = parseInt(elGuess.value, 10);
  if (!isNaN(g) && g >= 1 && g <= 25) {
    elPreview.textContent = decryptCaesar(currentCipher, g);
  } else {
    elPreview.textContent = '—';
  }
}

function newRound() {
  round += 1;
  if (round > totalRounds) {
    round = 1;
    score = 0;
  }
  currentPlain = PHRASES[round - 1];
  currentShift = 1 + Math.floor(Math.random() * 25); // 1..25
  currentCipher = encryptCaesar(currentPlain, currentShift);
  elCipher.textContent = currentCipher;
  elGuess.value = 1;
  btnNew.disabled = true;
  log(`Round ${round}/${totalRounds}: new ciphertext ready.`, 'info');
  updateStatus();
  updatePreviewFromInput();
}

function onGuess() {
  const g = parseInt(elGuess.value, 10);
  if (isNaN(g) || !(g >= 1 && g <= 25)) { log('Please enter a number between 1 and 25.', 'warn'); return; }
  if (g === currentShift) {
    score += 1;
    log(`✅ Correct! Shift = ${currentShift}. Decrypted: ${currentPlain}`, 'ok');
    btnNew.disabled = false;
  } else {
    const hint = (g > currentShift) ? 'lower' : 'higher';
    const prev = decryptCaesar(currentCipher, g);
    log(`❌ Not quite. Try ${hint}. Preview with ${g}: ${prev}`);
  }
  updateStatus();
}

function onSkip() {
  log(`➡ Skipped. Shift was ${currentShift}. Plaintext: ${currentPlain}`);
  btnNew.disabled = false;
}

elGuess.addEventListener('input', updatePreviewFromInput);
btnGuess.addEventListener('click', onGuess);
btnSkip.addEventListener('click', onSkip);
btnNew.addEventListener('click', newRound);

newRound();
