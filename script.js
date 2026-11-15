/**
 * Hindraj Mali - Portfolio Script
 * Dynamic Swara Breeze (Sa Re Ga Ma Pa Dha Ni) on Scroll + Flute Synthesizer
 */

// Classical Indian 7-Swara Scale frequencies (in Hz)
const SWARA_SCALE = [
  { note: 'सा', en: 'Sa', freq: 261.63 },
  { note: 'रे', en: 'Re', freq: 293.66 },
  { note: 'ग', en: 'Ga', freq: 329.63 },
  { note: 'म', en: 'Ma', freq: 349.23 },
  { note: 'प', en: 'Pa', freq: 392.00 },
  { note: 'ध', en: 'Dha', freq: 440.00 },
  { note: 'नि', en: 'Ni', freq: 493.88 },
  { note: 'सां', en: "Sa'", freq: 523.25 }
];

const MUSICAL_SYMBOLS = ['♪', '♫', '♩', '✦', '𝄢'];

let audioCtx = null;
let soundEnabled = false;
let lastScrollY = window.pageYOffset;
let scrollAccumulator = 0;
let swaraCounter = 0;

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCopyrightYear();
  initSwaraScrollEmitter();
  initSwaraAudio();
});

function initCopyrightYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

// Mobile Menu Navigation
function initMobileMenu() {
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.getElementById('navLinks');
  const navItems = document.querySelectorAll('.nav-item');

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navLinks.classList.remove('open');
      });
    });
  }
}

// Peaceful Indian Bansuri Audio Synthesizer
function playFluteTone(freq) {
  if (!soundEnabled) return;

  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    const duration = 0.85;

    // Breath-like gentle envelope
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.12, now + 0.1);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Fundamental acoustic wave
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Bamboo overtone
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.18;

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc1.connect(masterGain);
    masterGain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (err) {
    console.warn('Audio tone unavailable:', err);
  }
}

function initSwaraAudio() {
  const btn = document.getElementById('swaraAudioToggle');
  const icon = document.getElementById('audioIcon');
  const statusTxt = document.getElementById('audioStatusText');

  if (btn) {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        icon.textContent = '🔊';
        statusTxt.textContent = 'On';
        playFluteTone(SWARA_SCALE[0].freq); // Play Sa on enable
      } else {
        icon.textContent = '🔇';
        statusTxt.textContent = 'Off';
      }
    });
  }
}

// Aesthetic Swara Scroll Emitter
// Spawns glowing swaras out of the tilted bansuri that drift gracefully to the right
function initSwaraScrollEmitter() {
  const layer = document.getElementById('swaraLayer');

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    const delta = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    scrollAccumulator += delta;

    // Spawn swara every 65px of scroll distance
    if (scrollAccumulator > 65) {
      scrollAccumulator = 0;

      const swaraObj = SWARA_SCALE[swaraCounter % SWARA_SCALE.length];
      swaraCounter++;

      playFluteTone(swaraObj.freq);

      // Spawn origin along the tilted bansuri diagonal across the background
      const progress = (swaraCounter % 8) / 8;
      const spawnX = window.innerWidth * (0.38 + progress * 0.22) + (Math.random() * 24 - 12);
      const spawnY = window.innerHeight * (0.20 + progress * 0.52) + (Math.random() * 24 - 12);

      spawnSwaraGlyph(layer, swaraObj.note, spawnX, spawnY);
    }
  }, { passive: true });
}

function spawnSwaraGlyph(layer, swaraText, x, y) {
  if (!layer) return;

  const glyph = document.createElement('div');
  glyph.className = 'swara-glyph';

  // 75% chance classical Indian swara letter (सा, रे, ग, म, प, ध, नि), 25% musical note symbol
  const showSymbol = Math.random() > 0.75;
  glyph.textContent = showSymbol
    ? MUSICAL_SYMBOLS[Math.floor(Math.random() * MUSICAL_SYMBOLS.length)]
    : swaraText;

  // Glowing Evening Swara Colors: Warm Gold, Amber, Starlight Cyan, Moonlight Silver
  const colors = ['#fbbf24', '#f59e0b', '#fef08a', '#38bdf8', '#e0e7ff'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = showSymbol ? (18 + Math.random() * 8) : (24 + Math.random() * 12);

  glyph.style.left = `${x}px`;
  glyph.style.top = `${y}px`;
  glyph.style.color = color;
  glyph.style.fontSize = `${size}px`;

  layer.appendChild(glyph);

  // Clean up element after animation
  setTimeout(() => {
    glyph.remove();
  }, 3800);
}
