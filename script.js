/**
 * Hindraj Mali - Portfolio Script
 * Dynamic Swara Breeze (Sa Re Ga Ma Pa Dha Ni) on Scroll + Flute Synthesizer + GitHub Sync
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
  fetchGitHubRepos();
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
function initSwaraScrollEmitter() {
  const layer = document.getElementById('swaraLayer');

  window.addEventListener('scroll', () => {
    const currentY = window.pageYOffset;
    const delta = Math.abs(currentY - lastScrollY);
    lastScrollY = currentY;

    scrollAccumulator += delta;

    // Spawn swara every 70px of scrolling
    if (scrollAccumulator > 70) {
      scrollAccumulator = 0;

      const swaraObj = SWARA_SCALE[swaraCounter % SWARA_SCALE.length];
      swaraCounter++;

      playFluteTone(swaraObj.freq);

      // Spawn origin along the tilted wooden flute in background
      const progress = (swaraCounter % 8) / 8;
      const spawnX = window.innerWidth * 0.35 + (progress * window.innerWidth * 0.25) + (Math.random() * 40 - 20);
      const spawnY = window.innerHeight * 0.25 + (progress * window.innerHeight * 0.45) + (Math.random() * 30 - 15);

      spawnSwaraGlyph(layer, swaraObj.note, spawnX, spawnY);
    }
  }, { passive: true });
}

function spawnSwaraGlyph(layer, swaraText, x, y) {
  if (!layer) return;

  const glyph = document.createElement('div');
  glyph.className = 'swara-glyph';

  // 70% chance classical swara letter, 30% musical note symbol
  const showSymbol = Math.random() > 0.7;
  glyph.textContent = showSymbol
    ? MUSICAL_SYMBOLS[Math.floor(Math.random() * MUSICAL_SYMBOLS.length)]
    : swaraText;

  // Aesthetic Peacock-inspired colors: Deep Sapphire, Emerald, Sky Blue, Warm Gold
  const colors = ['#0284c7', '#0369a1', '#0ea5e9', '#059669', '#d97706'];
  const color = colors[Math.floor(Math.random() * colors.length)];
  const size = showSymbol ? (18 + Math.random() * 8) : (22 + Math.random() * 12);

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

// GitHub API: Fetch Repositories
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Rust: '#dea584'
};

async function fetchGitHubRepos() {
  const container = document.getElementById('repoList');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error(`GitHub API error ${res.status}`);

    const repos = await res.json();
    if (!Array.isArray(repos) || repos.length === 0) {
      renderFallback(container);
      return;
    }

    container.innerHTML = '';
    repos.slice(0, 6).forEach(repo => {
      const card = document.createElement('div');
      card.className = 'repo-item';

      const lang = repo.language || 'Code';
      const langColor = LANG_COLORS[lang] || '#0284c7';
      const desc = repo.description || 'Public engineering repository and algorithmic source code.';
      const stars = repo.stargazers_count || 0;
      const forks = repo.forks_count || 0;

      card.innerHTML = `
        <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-title-link">
          ${escapeHtml(repo.name)}
        </a>
        <p class="repo-description">${escapeHtml(desc)}</p>
        <div class="repo-footer">
          <span style="display:flex; align-items:center; gap:0.35rem;">
            <span class="repo-lang-dot" style="background-color: ${langColor};"></span>
            ${escapeHtml(lang)}
          </span>
          ${stars > 0 ? `<span>★ ${stars}</span>` : ''}
          ${forks > 0 ? `<span>⑂ ${forks}</span>` : ''}
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
    <div class="repo-item">
      <a href="https://github.com/${GITHUB_USERNAME}" target="_blank" rel="noopener noreferrer" class="repo-title-link">
        Explore Repositories on GitHub
      </a>
      <p class="repo-description">Browse through all active repositories, robotics code, and open-source contributions directly on Hindraj's GitHub profile.</p>
      <div class="repo-footer">
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
