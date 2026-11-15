/**
 * Hindraj Mali - Engineering Portfolio Script
 * Handles Theme Toggling (Dark/Light), Mobile Navigation, and GitHub Repositories Sync
 */

const GITHUB_USERNAME = 'hindraj123';

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMobileMenu();
  initCopyrightYear();
  fetchGitHubRepos();
});

// Theme Management (Light / Dark)
function initTheme() {
  const themeToggle = document.getElementById('themeToggle');
  const iconSun = document.getElementById('themeIconSun');
  const iconMoon = document.getElementById('themeIconMoon');

  // Check saved theme or system preference
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme, iconSun, iconMoon);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
      const newTheme = activeTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme, iconSun, iconMoon);
      localStorage.setItem('theme', newTheme);
    });
  }
}

function applyTheme(theme, iconSun, iconMoon) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (iconSun && iconMoon) {
      iconSun.classList.add('hidden');
      iconMoon.classList.remove('hidden');
    }
  } else {
    document.documentElement.removeAttribute('data-theme');
    if (iconSun && iconMoon) {
      iconSun.classList.remove('hidden');
      iconMoon.classList.add('hidden');
    }
  }
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

// Copyright Year
function initCopyrightYear() {
  const el = document.getElementById('currentYear');
  if (el) {
    el.textContent = new Date().getFullYear();
  }
}

// Language color dots for GitHub projects
const LANG_COLORS = {
  JavaScript: '#f1e05a',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  HTML: '#e34c26',
  CSS: '#563d7c',
  'C++': '#f34b7d',
  C: '#555555',
  Rust: '#dea584',
  Go: '#00ADD8'
};

// Fetch Public Repositories from GitHub API
async function fetchGitHubRepos() {
  const container = document.getElementById('repoList');
  if (!container) return;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`);
    if (!res.ok) throw new Error(`GitHub API HTTP ${res.status}`);

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
      const langColor = LANG_COLORS[lang] || '#64748b';
      const desc = repo.description || 'Public open-source repository and code artifacts.';
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
