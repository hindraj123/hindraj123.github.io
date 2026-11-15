/**
 * Hindraj Mali - Portfolio Script
 * Dynamic Swara Emitter (Sa Re Ga Ma Pa Dha Ni), Web Audio Bansuri Synthesizer,
 * and live GitHub API Integration for @hindraj123
 */

const GITHUB_USERNAME = 'hindraj123';

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

const MUSICAL_SYMBOLS = ['♪', '♫', '𝄢', '♩', '✦'];

let audioCtx = null;
let soundEnabled = false;
let lastScrollY = window.pageYOffset;
let scrollDeltaAccumulator = 0;
let swaraIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
  initCopyrightYear();
  initMobileMenu();
  initScrollSwaraEmitter();
  initSoundToggle();
  fetchGitHubRepos();
});

function initCopyrightYear() {
  const el = document.getElementById('currentYear');
  if (el) el.textContent = new Date().getFullYear();
}

// Mobile Menu
function initMobileMenu() {
  const toggle = document.getElementById('menu-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  if (toggle && menu) {
    toggle.addEventListener('click', () => {
      menu.classList.toggle('open');
    });
    links.forEach(l => l.addEventListener('click', () => menu.classList.remove('open')));
  }
}

// Web Audio API Indian Bansuri (Flute) Harmonic Synthesizer
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
    const duration = 0.9;

    // Master gain envelope for soft breathing acoustic attack
    const masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(0.0001, now);
    masterGain.gain.linearRampToValueAtTime(0.18, now + 0.12);
    masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    // Fundamental sine wave
    const osc1 = audioCtx.createOscillator();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, now);

    // Second harmonic for bamboo acoustic warmth
    const osc2 = audioCtx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, now);

    const gain2 = audioCtx.createGain();
    gain2.gain.value = 0.22;

    osc2.connect(gain2);
    gain2.connect(masterGain);
    osc1.connect(masterGain);

    masterGain.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + duration);
    osc2.stop(now + duration);
  } catch (e) {
    console.warn('Audio playback error:', e);
  }
}

function initSoundToggle() {
  const btn = document.getElementById('soundToggleBtn');
  const icon = document.getElementById('soundIcon');
  const text = document.getElementById('soundStatusText');

  if (btn) {
    btn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        icon.textContent = '🔊';
        text.textContent = 'On';
        // Play welcome Sa note
        playFluteTone(SWARA_SCALE[0].freq);
      } else {
        icon.textContent = '🔇';
        text.textContent = 'Off';
      }
    });
  }
}

// Scroll-Triggered Sa Re Ga Ma Particle Emitter
function initScrollSwaraEmitter() {
  const container = document.getElementById('swaraParticleContainer');
  const fluteDock = document.getElementById('fluteDock');
  const swaraBadge = document.getElementById('currentSwaraDisplay');

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    const delta = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    scrollDeltaAccumulator += delta;

    // Spawn a swara every 65px of scroll distance
    if (scrollDeltaAccumulator > 65) {
      scrollDeltaAccumulator = 0;

      const swaraObj = SWARA_SCALE[swaraIndex % SWARA_SCALE.length];
      swaraIndex++;

      if (swaraBadge) {
        swaraBadge.textContent = `${swaraObj.note} • ${swaraObj.en}`;
      }

      playFluteTone(swaraObj.freq);

      // Calculate spawn coordinates near the flute
      let spawnX = window.innerWidth - 130;
      let spawnY = window.innerHeight * 0.5 + (Math.random() * 200 - 100);

      if (fluteDock) {
        const rect = fluteDock.getBoundingClientRect();
        spawnX = rect.left + 20;
        spawnY = rect.top + 80 + ((swaraIndex % 7) * 45);
      }

      spawnSwaraElement(container, swaraObj.note, spawnX, spawnY);
    }
  }, { passive: true });
}

function spawnSwaraElement(container, swaraText, x, y) {
  if (!container) return;

  const particle = document.createElement('div');
  particle.className = 'swara-particle';

  // Alternate between Devnagari Swara and musical glyphs
  const isGlyph = Math.random() > 0.65;
  const displayText = isGlyph 
    ? MUSICAL_SYMBOLS[Math.floor(Math.random() * MUSICAL_SYMBOLS.length)]
    : swaraText;

  particle.textContent = displayText;

  // Aesthetic color variations (Peacock cyan, deep navy, gold)
  const colors = ['#0284c7', '#0369a1', '#0ea5e9', '#d97706', '#10b981'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = isGlyph ? (20 + Math.random() * 12) : (24 + Math.random() * 14);

  particle.style.left = `${x}px`;
  particle.style.top = `${y}px`;
  particle.style.color = color;
  particle.style.fontSize = `${size}px`;

  container.appendChild(particle);

  // Remove element after animation completes
  setTimeout(() => {
    particle.remove();
  }, 3600);
}

// Fetch Public Repos from GitHub
async function fetchGitHubRepos() {
  const container = document.getElementById('githubReposList');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error('GitHub API rate limit or error');

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      renderFallback(container);
      return;
    }

    container.innerHTML = '';
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement('div');
      card.className = 'card-glass repo-card';
      const lang = repo.language || 'Code';
      const stars = repo.stargazers_count || 0;
      const desc = repo.description || 'Public engineering repository and algorithmic source code.';

      card.innerHTML = `
        <div class="repo-top">
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-name">
            ${escapeHtml(repo.name)}
          </a>
        </div>
        <p class="repo-desc">${escapeHtml(desc)}</p>
        <div class="repo-meta">
          <span>● ${escapeHtml(lang)}</span>
          ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
        </div>
      `;
      container.appendChild(card);
    });
  } catch (err) {
    renderFallback(container);
  }
}

function renderFallback(container) {
  container.innerHTML = `
    <div class="card-glass repo-card">
      <div class="repo-top">
        <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" class="repo-name">
          Explore Projects on GitHub
        </a>
      </div>
      <p class="repo-desc">View all repositories, robotic control algorithms, and open-source contributions directly on Hindraj's GitHub profile.</p>
      <div class="repo-meta">
        <span>@${GITHUB_USERNAME}</span>
      </div>
    </div>
  `;
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
  }[m]));
}
