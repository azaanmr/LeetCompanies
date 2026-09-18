import fs from 'fs';
import path from 'path';

const extDir = 'd:/AZN DRIVE/Browser Extensions/Leetcode-Companies-Extension';

// 1. manifest.json
const manifestJson = {
  "manifest_version": 3,
  "name": "Leet Companies - Company Problem Tags & Matrix",
  "version": "1.0.0",
  "description": "See real company interview frequency tags directly on any LeetCode problem. Built by AZN Labs.",
  "icons": {
    "16": "icons/icon-16.png",
    "32": "icons/icon-32.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "32": "icons/icon-32.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    },
    "default_title": "Leet Companies Quick Search"
  },
  "content_scripts": [
    {
      "matches": [
        "*://leetcode.com/problems/*",
        "*://leetcode.cn/problems/*"
      ],
      "css": [
        "content.css"
      ],
      "js": [
        "content.js"
      ],
      "run_at": "document_idle"
    }
  ],
  "web_accessible_resources": [
    {
      "resources": [
        "data/problem_companies.json",
        "icons/icon-16.png",
        "icons/icon-32.png",
        "icons/icon-48.png",
        "icons/icon-128.png",
        "assets/logo-cropped.svg"
      ],
      "matches": [
        "*://leetcode.com/*",
        "*://leetcode.cn/*"
      ]
    }
  ],
  "permissions": []
};

fs.writeFileSync(path.join(extDir, 'manifest.json'), JSON.stringify(manifestJson, null, 2), 'utf-8');
console.log('✓ Updated manifest.json');

// 2. content.css
const contentCss = `/* Leet Companies - In-Page LeetCode Widget Theme */
.lc-companies-widget {
  margin: 1rem 0 1.25rem 0;
  padding: 1rem 1.2rem;
  background: linear-gradient(135deg, rgba(28, 22, 14, 0.96) 0%, rgba(18, 18, 18, 0.98) 100%);
  border: 1px solid rgba(255, 161, 22, 0.38);
  border-radius: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  color: #eff1f6;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55), 0 0 20px rgba(255, 161, 22, 0.08);
  box-sizing: border-box;
  animation: lcWidgetFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  position: relative;
}

@keyframes lcWidgetFadeIn {
  from { opacity: 0; transform: translateY(-6px); }
  to { opacity: 1; transform: translateY(0); }
}

.lc-widget-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lc-widget-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  transition: transform 0.2s ease;
}

.lc-widget-brand:hover {
  transform: translateY(-1px);
}

.lc-widget-icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  border-radius: 4px;
}

.lc-widget-title {
  font-size: 0.92rem;
  font-weight: 800;
  color: #ffa116;
  letter-spacing: -0.01em;
}

.lc-azn-badge {
  font-size: 0.56rem;
  font-weight: 800;
  padding: 0.1rem 0.38rem;
  background: rgba(255, 161, 22, 0.15);
  color: #ffa116;
  border: 1px solid rgba(255, 161, 22, 0.4);
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.lc-widget-stats {
  font-size: 0.775rem;
  color: #9ca3af;
  font-weight: 500;
}

.lc-widget-stats strong {
  color: #ffa116;
}

.lc-widget-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-bottom: 0.85rem;
}

.lc-company-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e5e7eb;
  padding: 0.25rem 0.6rem;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
}

.lc-company-pill:hover {
  background: rgba(255, 161, 22, 0.2);
  border-color: rgba(255, 161, 22, 0.55);
  color: #ffa116;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 161, 22, 0.15);
}

.lc-company-freq {
  color: #ffa116;
  font-size: 0.68rem;
  font-weight: 700;
  background: rgba(255, 161, 22, 0.15);
  padding: 0.05rem 0.3rem;
  border-radius: 4px;
}

.lc-widget-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.lc-widget-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.775rem;
  font-weight: 700;
  color: #ffa116;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.lc-widget-link:hover {
  opacity: 0.85;
  text-decoration: underline;
}

.lc-toggle-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #cbd5e1;
  font-size: 0.725rem;
  font-weight: 600;
  cursor: pointer;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.lc-toggle-btn:hover {
  background: rgba(255, 161, 22, 0.15);
  color: #ffa116;
  border-color: rgba(255, 161, 22, 0.4);
}

.lc-no-data-note {
  font-size: 0.8rem;
  color: #9ca3af;
  margin-bottom: 0.5rem;
}
`;

fs.writeFileSync(path.join(extDir, 'content.css'), contentCss);
console.log('✓ Created content.css');

// 3. content.js
const contentJs = `// Leet Companies - In-Page Problem Company Tags Injector
(function() {
  'use strict';

  let cachedProblemData = null;
  let isExpanded = false;
  let currentSlug = null;
  let isInjecting = false;

  const WEBSITE_BASE_URL = 'https://leetcompanies.netlify.app';

  async function loadData() {
    if (cachedProblemData) return cachedProblemData;
    try {
      const dataUrl = chrome.runtime.getURL('data/problem_companies.json');
      const res = await fetch(dataUrl);
      cachedProblemData = await res.json();
      return cachedProblemData;
    } catch (err) {
      console.error('[LeetCompanies] Failed to load company data:', err);
      return {};
    }
  }

  function getProblemSlugFromUrl() {
    const pathname = window.location.pathname;
    const match = pathname.match(/\\/problems\\/([^\\/]+)/);
    return match ? match[1] : null;
  }

  function createWidgetElement(slug, problemInfo) {
    const widget = document.createElement('div');
    widget.className = 'lc-companies-widget';
    widget.id = 'lc-companies-injected-widget';

    const iconUrl = chrome.runtime.getURL('icons/icon-32.png');
    const companies = (problemInfo && problemInfo.c) ? [...problemInfo.c].sort((a, b) => (b.f || 0) - (a.f || 0)) : [];
    const totalCount = companies.length;

    let companiesHtml = '';
    if (totalCount === 0) {
      companiesHtml = '<div class="lc-no-data-note">No specific company frequency tag recorded for this problem yet.</div>';
    } else {
      const displayCount = isExpanded ? companies.length : Math.min(8, companies.length);
      const visibleList = companies.slice(0, displayCount);

      companiesHtml = '<div class="lc-widget-pills">' + visibleList.map(comp => {
        const freqText = comp.f ? \`<span class="lc-company-freq">\${comp.f}%</span>\` : '';
        const targetUrl = \`\${WEBSITE_BASE_URL}/#company=\${encodeURIComponent(comp.s || comp.n.toLowerCase().replace(/\\s+/g, '-'))}\`;
        return \`<a href="\${targetUrl}" target="_blank" rel="noopener noreferrer" class="lc-company-pill" title="Explore \${comp.n} interview questions on Leet Companies">\${comp.n} \${freqText}</a>\`;
      }).join('') + '</div>';
    }

    widget.innerHTML = \`
      <div class="lc-widget-header">
        <a href="\${WEBSITE_BASE_URL}" target="_blank" rel="noopener noreferrer" class="lc-widget-brand" title="Visit Leet Companies">
          <img src="\${iconUrl}" alt="Leet Companies" class="lc-widget-icon" />
          <span class="lc-widget-title">Leet Companies</span>
          <span class="lc-azn-badge">BY AZN LABS</span>
        </a>
        <span class="lc-widget-stats">
          \${totalCount > 0 ? \`Asked by <strong>\${totalCount}</strong> Companies\` : 'General Question'}
        </span>
      </div>

      \${companiesHtml}

      <div class="lc-widget-footer">
        <a href="\${WEBSITE_BASE_URL}" target="_blank" rel="noopener noreferrer" class="lc-widget-link">
          <span>Explore 470+ Companies &amp; Overlap Matrix</span>
          <span>↗</span>
        </a>
        \${totalCount > 8 ? \`
          <button type="button" class="lc-toggle-btn" id="lc-toggle-expand-btn">
            \${isExpanded ? '▲ Show Less' : \`▼ Show All (\${totalCount})\`}
          </button>
        \` : ''}
      </div>
    \`;

    const toggleBtn = widget.querySelector('#lc-toggle-expand-btn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        isExpanded = !isExpanded;
        injectWidget();
      });
    }

    return widget;
  }

  async function injectWidget() {
    if (isInjecting) return;
    isInjecting = true;

    try {
      const slug = getProblemSlugFromUrl();
      if (!slug) return;

      const data = await loadData();
      const problemInfo = data[slug];

      // Remove existing injected widget if present
      const existing = document.getElementById('lc-companies-injected-widget');
      if (existing) existing.remove();

      // Find insertion targets across different LeetCode layout versions
      const targetSelectors = [
        '[data-track-load="description_content"]',
        'div[class*="description__"]',
        'div[class*="content__"]',
        'div.elfjS',
        '#qd-content',
        '.flexlayout__layout .flexlayout__tab',
        'div[class*="css-"][class*="question"]'
      ];

      let targetContainer = null;
      for (const sel of targetSelectors) {
        const el = document.querySelector(sel);
        if (el) {
          targetContainer = el;
          break;
        }
      }

      if (!targetContainer) {
        targetContainer = document.querySelector('div[class*="header__"]') || document.querySelector('main');
      }

      if (targetContainer) {
        const widget = createWidgetElement(slug, problemInfo);
        if (targetContainer.firstChild) {
          targetContainer.insertBefore(widget, targetContainer.firstChild);
        } else {
          targetContainer.appendChild(widget);
        }
        currentSlug = slug;
      }
    } finally {
      isInjecting = false;
    }
  }

  function checkUrlAndInject() {
    const slug = getProblemSlugFromUrl();
    if (slug && (slug !== currentSlug || !document.getElementById('lc-companies-injected-widget'))) {
      injectWidget();
    }
  }

  // Initial load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(injectWidget, 600);
      setTimeout(injectWidget, 1800);
    });
  } else {
    setTimeout(injectWidget, 600);
    setTimeout(injectWidget, 1800);
  }

  // SPA Route Change Listener
  let lastUrl = location.href;
  const observer = new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      isExpanded = false;
      setTimeout(checkUrlAndInject, 500);
    } else if (!document.getElementById('lc-companies-injected-widget') && getProblemSlugFromUrl()) {
      // Re-inject if DOM rebuilt by React
      checkUrlAndInject();
    }
  });

  observer.observe(document.body || document.documentElement, { subtree: true, childList: true });

  window.addEventListener('popstate', () => {
    setTimeout(checkUrlAndInject, 500);
  });
})();
`;

fs.writeFileSync(path.join(extDir, 'content.js'), contentJs);
console.log('✓ Created content.js');

// 4. popup.html
const popupHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Leet Companies</title>
  <link rel="stylesheet" href="popup.css">
</head>
<body>
  <div class="popup-container">
    <header class="popup-header">
      <div class="popup-brand">
        <img src="icons/icon-32.png" alt="Logo" class="popup-logo" />
        <div>
          <h1 class="popup-title">Leet Companies</h1>
          <span class="popup-badge">BY AZN LABS</span>
        </div>
      </div>
      <a href="https://leetcompanies.netlify.app" target="_blank" class="popup-link-btn" title="Open Full Web Matrix">
        Open Web App ↗
      </a>
    </header>

    <div class="popup-search-box">
      <input type="text" id="popup-search-input" placeholder="Search 470+ companies or problems..." autofocus />
    </div>

    <div class="popup-quick-links">
      <a href="https://leetcompanies.netlify.app/#companies" target="_blank" class="quick-pill">🏢 FAANG &amp; Big Tech</a>
      <a href="https://leetcompanies.netlify.app/#search" target="_blank" class="quick-pill">🔀 Overlap Matrix</a>
      <a href="https://leetcompanies.netlify.app/#tracker" target="_blank" class="quick-pill">📊 My Tracker</a>
    </div>

    <div class="popup-results" id="popup-results">
      <div class="popup-empty-hint">Type above to search companies &amp; interview frequencies instantly.</div>
    </div>

    <div class="popup-ad-section">
      <div class="popup-ad-card">
        <div class="popup-ad-left">
          <img src="assets/apps/Anyalarm.webp" alt="Any Alarm" class="popup-ad-icon" />
          <div class="popup-ad-texts">
            <div class="popup-ad-title">Any Alarm: Hardcore Wake Up</div>
            <div class="popup-ad-desc">GPS Commute &amp; Math Alarms for heavy sleepers.</div>
          </div>
        </div>
        <a href="https://play.google.com/store/apps/details?id=com.aznenterprises.anyalarm" target="_blank" class="popup-ad-btn">Install</a>
      </div>
    </div>

    <footer class="popup-footer">
      <span>100% Client-Side &amp; Private</span>
      <span>•</span>
      <a href="https://play.google.com/store/apps/developer?id=AZN+Enterprises" target="_blank">AZN Labs Apps ↗</a>
    </footer>
  </div>

  <script src="popup.js"></script>
</body>
</html>
`;

fs.writeFileSync(path.join(extDir, 'popup.html'), popupHtml);
console.log('✓ Created popup.html');

// 5. popup.css
const popupCss = `/* Popup Styling */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  width: 360px;
  background: #0f131a;
  color: #f3f4f6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 13px;
  line-height: 1.4;
}

.popup-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.popup-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.popup-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.popup-logo {
  width: 28px;
  height: 28px;
  object-fit: contain;
}

.popup-title {
  font-size: 1rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
}

.popup-badge {
  font-size: 0.55rem;
  font-weight: 800;
  color: #ffa116;
  background: rgba(255, 161, 22, 0.15);
  border: 1px solid rgba(255, 161, 22, 0.35);
  padding: 0.08rem 0.35rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.popup-link-btn {
  font-size: 0.75rem;
  font-weight: 700;
  color: #000;
  background: #ffa116;
  padding: 0.35rem 0.7rem;
  border-radius: 6px;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.popup-link-btn:hover {
  opacity: 0.9;
}

.popup-search-box input {
  width: 100%;
  padding: 0.55rem 0.75rem;
  background: #171f2d;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 8px;
  color: #ffffff;
  font-size: 0.825rem;
  outline: none;
  transition: border-color 0.2s ease;
}

.popup-search-box input:focus {
  border-color: #ffa116;
}

.popup-quick-links {
  display: flex;
  gap: 0.35rem;
  overflow-x: auto;
  scrollbar-width: none;
}

.popup-quick-links::-webkit-scrollbar {
  display: none;
}

.quick-pill {
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: #9ca3af;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
}

.quick-pill:hover {
  color: #ffa116;
  border-color: rgba(255, 161, 22, 0.4);
}

.popup-results {
  max-height: 180px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.popup-empty-hint {
  text-align: center;
  color: #6b7280;
  font-size: 0.75rem;
  padding: 0.8rem 0;
}

.popup-result-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.45rem 0.6rem;
  background: #141a24;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 6px;
  text-decoration: none;
  color: #e5e7eb;
  transition: background 0.2s ease;
}

.popup-result-item:hover {
  background: rgba(255, 161, 22, 0.12);
  border-color: rgba(255, 161, 22, 0.3);
}

.popup-result-title {
  font-weight: 600;
  font-size: 0.8rem;
  color: #fff;
}

.popup-result-badge {
  font-size: 0.7rem;
  color: #ffa116;
  font-weight: 700;
}

.popup-ad-section {
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.popup-ad-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(255, 161, 22, 0.06);
  border: 1px solid rgba(255, 161, 22, 0.25);
  border-radius: 8px;
  padding: 0.5rem 0.65rem;
  gap: 0.5rem;
}

.popup-ad-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
}

.popup-ad-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  object-fit: cover;
  flex-shrink: 0;
}

.popup-ad-texts {
  min-width: 0;
}

.popup-ad-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #fff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-ad-desc {
  font-size: 0.675rem;
  color: #9ca3af;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.popup-ad-btn {
  font-size: 0.7rem;
  font-weight: 700;
  background: #ffa116;
  color: #000;
  padding: 0.25rem 0.55rem;
  border-radius: 5px;
  text-decoration: none;
  flex-shrink: 0;
}

.popup-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.675rem;
  color: #6b7280;
  padding-top: 0.25rem;
}

.popup-footer a {
  color: #ffa116;
  text-decoration: none;
}
`;

fs.writeFileSync(path.join(extDir, 'popup.css'), popupCss);
console.log('✓ Created popup.css');

// 6. popup.js
const popupJs = `document.addEventListener('DOMContentLoaded', async () => {
  const searchInput = document.getElementById('popup-search-input');
  const resultsContainer = document.getElementById('popup-results');
  const WEBSITE_BASE_URL = 'https://leetcompanies.netlify.app';

  let problemData = {};
  let companiesList = [];

  try {
    const res = await fetch('data/problem_companies.json');
    problemData = await res.json();
  } catch (err) {
    console.error('Failed to load extension data:', err);
  }

  // Extract unique companies
  const companySet = new Map();
  Object.values(problemData).forEach(prob => {
    if (prob.c) {
      prob.c.forEach(comp => {
        const count = (companySet.get(comp.n) || 0) + 1;
        companySet.set(comp.n, count);
      });
    }
  });

  companiesList = Array.from(companySet.entries()).map(([name, count]) => ({
    name,
    slug: name.toLowerCase().replace(/\\s+/g, '-'),
    count
  })).sort((a, b) => b.count - a.count);

  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      resultsContainer.innerHTML = '<div class="popup-empty-hint">Type above to search companies &amp; interview frequencies instantly.</div>';
      return;
    }

    // 1. Search matching companies
    const matchedCompanies = companiesList.filter(c => c.name.toLowerCase().includes(query)).slice(0, 5);
    
    // 2. Search matching problems
    const matchedProblems = Object.entries(problemData)
      .filter(([slug, p]) => (p.t && p.t.toLowerCase().includes(query)) || slug.includes(query))
      .slice(0, 5);

    if (matchedCompanies.length === 0 && matchedProblems.length === 0) {
      resultsContainer.innerHTML = '<div class="popup-empty-hint">No matches found. Try another search.</div>';
      return;
    }

    let html = '';

    if (matchedCompanies.length > 0) {
      html += matchedCompanies.map(c => \`
        <a href="\${WEBSITE_BASE_URL}/#company=\${c.slug}" target="_blank" class="popup-result-item">
          <div>
            <div class="popup-result-title">🏢 \${c.name}</div>
            <div style="font-size:0.675rem; color:#9ca3af;">\${c.count} Interview Problems</div>
          </div>
          <span class="popup-result-badge">Explore ↗</span>
        </a>
      \`).join('');
    }

    if (matchedProblems.length > 0) {
      html += matchedProblems.map(([slug, p]) => \`
        <a href="https://leetcode.com/problems/\${slug}/" target="_blank" class="popup-result-item">
          <div>
            <div class="popup-result-title">💡 \${p.t || slug}</div>
            <div style="font-size:0.675rem; color:#9ca3af;">Asked by \${p.c ? p.c.length : 0} Companies</div>
          </div>
          <span class="popup-result-badge" style="color: #38bdf8;">Solve ↗</span>
        </a>
      \`).join('');
    }

    resultsContainer.innerHTML = html;
  });
});
`;

fs.writeFileSync(path.join(extDir, 'popup.js'), popupJs);
console.log('✓ Created popup.js');

// 7. README.md
const extReadme = `<div align="center">
  <img src="icons/icon-128.png" alt="Leet Companies Logo" width="80" />
  <h1>Leet Companies Chrome Extension</h1>
  <p><strong>See Real Company Interview Frequency Tags Directly on Any LeetCode Problem</strong></p>

  <p>
    <a href="https://leetcompanies.netlify.app"><img src="https://img.shields.io/badge/Live_Web_App-leetcompanies.netlify.app-ffa116?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Live On" /></a>
    <img src="https://img.shields.io/badge/Manifest-V3-646cff?style=for-the-badge" alt="Manifest V3" />
    <img src="https://img.shields.io/badge/Storage-100%25_Offline-10b981?style=for-the-badge" alt="Offline" />
    <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="License" />
  </p>
</div>

---

## 🌟 Overview

**Leet Companies Chrome Extension** injects real company tags, interview occurrence frequencies, and direct deep-links directly onto [leetcode.com](https://leetcode.com) problem description pages.

Practice company-specific interview questions for Google, Meta, Amazon, Microsoft, Bloomberg, Goldman Sachs, and 470+ top companies with **0ms latency and 100% offline privacy**.

---

## ⚡ Features

* 🏷️ **In-Page Company Badges**: View top companies and occurrence percentages directly below LeetCode's problem headers.
* 🔍 **Toolbar Quick Search**: Search 470+ companies and problems instantly from your browser toolbar.
* 🚀 **1-Click Deep Links**: Jump straight into the full company question matrix on [Leet Companies](https://leetcompanies.netlify.app).
* 🔒 **100% Client-Side & Offline**: Bundled compact database. Zero tracking, zero logins, zero API latency.

---

## 🛠️ How to Load Unpacked Extension (Development)

1. Open Google Chrome and navigate to \`chrome://extensions/\`.
2. Enable **Developer mode** (toggle in the top-right corner).
3. Click **Load unpacked** and select this directory (\`Leetcode-Companies-Extension\`).
4. Open any problem on [leetcode.com/problems/two-sum/](https://leetcode.com/problems/two-sum/) to see the widget in action!

---

## 📱 More Apps by AZN Labs

* ⏰ **[Any Alarm: Hardcore Wake Up & GPS Commute](https://play.google.com/store/apps/details?id=com.aznenterprises.anyalarm)**
* 💰 **[NET Expense Manager](https://play.google.com/store/apps/details?id=com.aznenterprises.tracksmith)**
* 🎮 **[MineSaves: MCPE World Backup](https://play.google.com/store/apps/details?id=com.aznenterprises.mcpebackup)**

👉 **[View AZN Labs on Google Play](https://play.google.com/store/apps/developer?id=AZN+Enterprises)**

---

## ⚖️ Disclaimer

* This project is an independent open-source tool developed purely for educational and interview preparation purposes.
* "LeetCode" and related trademarks are the property of LeetCode LLC. This project is not affiliated with, endorsed by, or sponsored by LeetCode or any of the mentioned companies.
* All company names, logos, and trademarks mentioned belong to their respective holders.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
`;

fs.writeFileSync(path.join(extDir, 'README.md'), extReadme);
console.log('✓ Created extension README.md');

// 8. LICENSE
const extLicense = `MIT License

Copyright (c) 2026 Muhammad Azaan M R (AZN Labs)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
`;

fs.writeFileSync(path.join(extDir, 'LICENSE'), extLicense);
console.log('✓ Created extension LICENSE');

console.log('\\nAll Chrome Extension files built successfully!');

