import { ADMIN_CONFIG } from '../config/adminSecret';

const STORAGE_KEYS = {
  METRICS: 'lc_analytics_metrics',
  VISITORS: 'lc_analytics_unique_visitors',
  LOGS: 'lc_analytics_logs',
  VISITOR_ID: 'lc_vid',
  GEO_CACHE: 'lc_geo_cache',
};

// Asynchronous non-blocking cloud webhook forwarder
function syncToGoogleSheets(payload) {
  try {
    const webhookUrl = ADMIN_CONFIG && ADMIN_CONFIG.GOOGLE_SHEET_WEBHOOK_URL;
    if (!webhookUrl || !webhookUrl.startsWith('http')) return;

    // Use fetch with text/plain & no-cors to reliably follow Google Apps Script 302 redirects
    const bodyStr = JSON.stringify(payload);
    fetch(webhookUrl, {
      method: 'POST',
      mode: 'no-cors',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: bodyStr,
      keepalive: true,
    }).catch(() => {
      // Background catch
    });
  } catch (err) {
    // Fail silently in background
  }
}

// Default metric schema
const DEFAULT_METRICS = {
  totalPageviews: 0,
  uniqueVisitors: 0,
  downloads: {
    zip: 0,
    crx: 0,
    total: 0,
  },
  appInstalls: {
    anyalarm: 0,
    net: 0,
    minesaves: 0,
    total: 0,
  },
  topCompanies: {},
  devices: {
    desktop: 0,
    mobile: 0,
    tablet: 0,
  },
  browsers: {},
  countries: {},
  firstTrackedAt: new Date().toISOString(),
  lastTrackedAt: new Date().toISOString(),
};

function getLocalData(key, fallback) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setLocalData(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[Analytics] Storage write error:', err);
  }
}

// Generate or retrieve persistent visitor UUID
export function getOrCreateVisitorId() {
  let vid = localStorage.getItem(STORAGE_KEYS.VISITOR_ID);
  if (!vid) {
    vid = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
    localStorage.setItem(STORAGE_KEYS.VISITOR_ID, vid);
  }
  return vid;
}

// Detect client device, browser, and OS
export function getClientInfo() {
  const ua = navigator.userAgent || '';
  let browser = 'Unknown';
  if (ua.includes('Brave') || (navigator.brave && navigator.brave.isBrave)) browser = 'Brave';
  else if (ua.includes('Edg/')) browser = 'Edge';
  else if (ua.includes('Chrome/')) browser = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome')) browser = 'Safari';
  else if (ua.includes('Firefox/')) browser = 'Firefox';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browser = 'Opera';

  let os = 'Unknown OS';
  if (ua.includes('Windows')) os = 'Windows';
  else if (ua.includes('Android')) os = 'Android';
  else if (ua.includes('iPhone') || ua.includes('iPad')) os = 'iOS';
  else if (ua.includes('Macintosh') || ua.includes('Mac OS')) os = 'macOS';
  else if (ua.includes('Linux')) os = 'Linux';

  const width = window.innerWidth;
  let deviceType = 'desktop';
  if (width < 640) deviceType = 'mobile';
  else if (width < 1024) deviceType = 'tablet';

  return { browser, os, deviceType, screen: `${window.screen.width}x${window.screen.height}` };
}

// Get cached Geo Info synchronously
function getCachedGeoInfo() {
  const cached = getLocalData(STORAGE_KEYS.GEO_CACHE, null);
  if (cached && cached.data) {
    return cached.data;
  }
  return { ip: 'Local Client', country: 'Global' };
}

// Fetch IP & Geolocation in background with local caching
async function refreshGeoInfoInBackground() {
  const cached = getLocalData(STORAGE_KEYS.GEO_CACHE, null);
  if (cached && (Date.now() - cached.timestamp < 12 * 60 * 60 * 1000)) {
    return cached.data;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch('https://api.ipify.org?format=json', { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      const geoResult = { ip: data.ip || 'Unknown IP', country: 'Global' };
      
      try {
        const countryRes = await fetch(`https://api.country.is/${data.ip}`);
        if (countryRes.ok) {
          const cData = await countryRes.json();
          if (cData.country) geoResult.country = cData.country;
        }
      } catch {
        // Ignore country lookup error
      }

      setLocalData(STORAGE_KEYS.GEO_CACHE, { timestamp: Date.now(), data: geoResult });
      return geoResult;
    }
  } catch (err) {
    // Offline or aborted
  }

  return { ip: 'Local Client', country: 'Global' };
}

// Log an event entry
function addLogEntry(action, details = {}) {
  const logs = getLocalData(STORAGE_KEYS.LOGS, []);
  const entry = {
    id: 'log_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6),
    timestamp: new Date().toISOString(),
    action,
    details,
  };
  
  // Keep last 150 entries
  const updatedLogs = [entry, ...logs].slice(0, 150);
  setLocalData(STORAGE_KEYS.LOGS, updatedLogs);
}

// ==============================================================================
// Public Tracking Functions
// ==============================================================================

// Memory guard against duplicate rapid triggers (e.g. React StrictMode, immediate hash replaces)
let lastTrackedPath = null;
let lastTrackedTimestamp = 0;

export async function trackPageView(path = window.location.hash || '/') {
  const cleanPath = (path || '').replace(/^#\/?/, '').trim();
  
  // Do not track admin panel visits as public site views
  if (cleanPath === 'admin' || cleanPath.startsWith('admin')) {
    return;
  }

  // Deduplicate identical route hits within 1500ms (fixes React StrictMode remounts & duplicate hashchange events)
  const now = Date.now();
  if (lastTrackedPath === cleanPath && (now - lastTrackedTimestamp < 1500)) {
    return;
  }
  lastTrackedPath = cleanPath;
  lastTrackedTimestamp = now;

  const vid = getOrCreateVisitorId();
  const metrics = getLocalData(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
  const visitors = getLocalData(STORAGE_KEYS.VISITORS, {});
  const client = getClientInfo();
  const geo = getCachedGeoInfo();

  metrics.totalPageviews = (metrics.totalPageviews || 0) + 1;
  metrics.lastTrackedAt = new Date().toISOString();

  // Unique visitor detection
  const isNewVisitor = !visitors[vid];
  if (isNewVisitor) {
    metrics.uniqueVisitors = (metrics.uniqueVisitors || 0) + 1;
    visitors[vid] = {
      firstSeen: new Date().toISOString(),
      visits: 1,
      client,
    };
  } else {
    visitors[vid].visits = (visitors[vid].visits || 0) + 1;
    visitors[vid].lastSeen = new Date().toISOString();
  }

  // Device & Browser counts
  metrics.devices = metrics.devices || { desktop: 0, mobile: 0, tablet: 0 };
  metrics.devices[client.deviceType] = (metrics.devices[client.deviceType] || 0) + 1;

  metrics.browsers = metrics.browsers || {};
  metrics.browsers[client.browser] = (metrics.browsers[client.browser] || 0) + 1;

  if (geo.country && geo.country !== 'Local') {
    metrics.countries = metrics.countries || {};
    metrics.countries[geo.country] = (metrics.countries[geo.country] || 0) + 1;
  }

  setLocalData(STORAGE_KEYS.METRICS, metrics);
  setLocalData(STORAGE_KEYS.VISITORS, visitors);

  // Immediately record local log
  addLogEntry('PAGE_VIEW', {
    path,
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
    device: client.deviceType,
    isNewVisitor,
  });

  // Immediately dispatch to Google Sheets cloud backend
  syncToGoogleSheets({
    action: 'PAGE_VIEW',
    details: { path, isNewVisitor },
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
    device: client.deviceType,
    visitorId: vid,
  });

  // Refresh geo in background for future actions
  refreshGeoInfoInBackground();
}

export function trackDownload(type = 'zip') {
  const vid = getOrCreateVisitorId();
  const metrics = getLocalData(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
  metrics.downloads = metrics.downloads || { zip: 0, crx: 0, total: 0 };
  
  if (type === 'zip' || type === 'extension-zip') {
    metrics.downloads.zip = (metrics.downloads.zip || 0) + 1;
  } else if (type === 'crx' || type === 'extension-crx') {
    metrics.downloads.crx = (metrics.downloads.crx || 0) + 1;
  }
  
  metrics.downloads.total = (metrics.downloads.zip || 0) + (metrics.downloads.crx || 0);
  metrics.lastTrackedAt = new Date().toISOString();

  setLocalData(STORAGE_KEYS.METRICS, metrics);

  const client = getClientInfo();
  const geo = getCachedGeoInfo();

  addLogEntry('EXTENSION_DOWNLOAD', {
    downloadType: type,
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
  });

  // Immediately sync to Google Sheets
  syncToGoogleSheets({
    action: 'EXTENSION_DOWNLOAD',
    details: { downloadType: type },
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
    device: client.deviceType,
    visitorId: vid,
  });
}

export function trackAppInstallClick(appId) {
  const vid = getOrCreateVisitorId();
  const metrics = getLocalData(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
  metrics.appInstalls = metrics.appInstalls || { anyalarm: 0, net: 0, minesaves: 0, total: 0 };

  const key = appId.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (key.includes('anyalarm') || key.includes('alarm')) {
    metrics.appInstalls.anyalarm = (metrics.appInstalls.anyalarm || 0) + 1;
  } else if (key.includes('net') || key.includes('expense') || key.includes('tracksmith')) {
    metrics.appInstalls.net = (metrics.appInstalls.net || 0) + 1;
  } else if (key.includes('mine') || key.includes('mcpe')) {
    metrics.appInstalls.minesaves = (metrics.appInstalls.minesaves || 0) + 1;
  }

  metrics.appInstalls.total = (metrics.appInstalls.anyalarm || 0) + 
                              (metrics.appInstalls.net || 0) + 
                              (metrics.appInstalls.minesaves || 0);
  metrics.lastTrackedAt = new Date().toISOString();

  setLocalData(STORAGE_KEYS.METRICS, metrics);

  const client = getClientInfo();
  const geo = getCachedGeoInfo();

  addLogEntry('APP_INSTALL_CLICK', {
    appId,
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
  });

  // Immediately sync to Google Sheets
  syncToGoogleSheets({
    action: 'APP_INSTALL_CLICK',
    details: { appId },
    ip: geo.ip,
    country: geo.country,
    browser: client.browser,
    os: client.os,
    device: client.deviceType,
    visitorId: vid,
  });
}

export function trackCompanySheetView(companySlug, companyName) {
  const metrics = getLocalData(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
  metrics.topCompanies = metrics.topCompanies || {};
  metrics.topCompanies[companyName || companySlug] = (metrics.topCompanies[companyName || companySlug] || 0) + 1;
  setLocalData(STORAGE_KEYS.METRICS, metrics);
}

// ==============================================================================
// Admin Global Data Retrieval (Google Sheets + Local fallback)
// ==============================================================================

function getRowValue(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
  }
  return '';
}

export async function fetchGlobalAdminMetrics(password = ADMIN_CONFIG.ADMIN_PASSWORD) {
  const webhookUrl = ADMIN_CONFIG && ADMIN_CONFIG.GOOGLE_SHEET_WEBHOOK_URL;
  const localData = getAdminMetrics();

  if (!webhookUrl || !webhookUrl.startsWith('http')) {
    return { ...localData, isCloudConnected: false, source: 'local' };
  }

  try {
    const fetchUrl = `${webhookUrl}?key=${encodeURIComponent(password || '')}`;
    const res = await fetch(fetchUrl, { method: 'GET' });
    if (res.ok) {
      const result = await res.json();
      if (result && result.status === 'success' && Array.isArray(result.rows)) {
        const rows = result.rows;
        
        // Aggregate global metrics from Google Sheet rows
        const uniqueVids = new Set();
        const uniqueIps = new Set();
        let globalPageviews = 0;
        const downloads = { zip: 0, crx: 0, total: 0 };
        const appInstalls = { anyalarm: 0, net: 0, minesaves: 0, total: 0 };
        const devices = { desktop: 0, mobile: 0, tablet: 0 };
        const browsers = {};
        const countries = {};

        const cloudLogs = rows.map((r, idx) => {
          const action = getRowValue(r, 'Action Type', 'action', 'Action', 'Event Type') || 'PAGE_VIEW';
          const target = getRowValue(r, 'Path / Target', 'target', 'Path', 'Target') || '';
          const ip = getRowValue(r, 'Visitor IP', 'ip', 'IP') || '';
          const vid = getRowValue(r, 'Visitor ID', 'visitorId', 'VisitorId', 'vid') || '';
          const device = (getRowValue(r, 'Device', 'device') || 'desktop').toLowerCase();
          const browser = getRowValue(r, 'Browser', 'browser') || 'Unknown';
          const country = getRowValue(r, 'Country', 'country') || 'Global';
          const timestamp = getRowValue(r, 'Timestamp', 'timestamp') || new Date().toISOString();

          if (vid) uniqueVids.add(vid);
          if (ip && ip !== 'Local Client' && ip !== 'Client Offline') uniqueIps.add(ip);

          if (action.includes('PAGE_VIEW') || action.includes('VIEW')) {
            globalPageviews++;
          } else if (action.includes('DOWNLOAD')) {
            if (target.toLowerCase().includes('crx')) downloads.crx++;
            else downloads.zip++;
            downloads.total++;
          } else if (action.includes('APP')) {
            const lowTarget = target.toLowerCase();
            if (lowTarget.includes('alarm')) appInstalls.anyalarm++;
            else if (lowTarget.includes('net') || lowTarget.includes('expense')) appInstalls.net++;
            else if (lowTarget.includes('mine') || lowTarget.includes('save')) appInstalls.minesaves++;
            appInstalls.total++;
          }

          if (devices[device] !== undefined) devices[device]++;
          else devices.desktop++;

          if (browser) browsers[browser] = (browsers[browser] || 0) + 1;
          if (country && country !== 'Local') countries[country] = (countries[country] || 0) + 1;

          let detailsObj = {};
          const detailsRaw = getRowValue(r, 'Details JSON', 'details');
          if (detailsRaw) {
            try {
              detailsObj = JSON.parse(detailsRaw);
            } catch {
              detailsObj = { target };
            }
          }

          return {
            id: 'cloud_' + idx + '_' + timestamp,
            timestamp,
            action,
            details: {
              ...detailsObj,
              ip,
              country,
              browser,
              os: getRowValue(r, 'OS', 'os'),
              device,
              path: target,
            }
          };
        });

        const totalUnique = (uniqueVids.size || uniqueIps.size) ? Math.max(uniqueVids.size, uniqueIps.size) : 0;

        const cloudPayload = {
          isCloudConnected: true,
          source: 'google_sheets',
          metrics: {
            totalPageviews: globalPageviews,
            uniqueVisitors: totalUnique,
            downloads,
            appInstalls,
            devices,
            browsers,
            countries,
            firstTrackedAt: rows.length > 0 ? (rows[rows.length - 1]?.Timestamp || new Date().toISOString()) : new Date().toISOString(),
            lastTrackedAt: rows.length > 0 ? (rows[0]?.Timestamp || new Date().toISOString()) : new Date().toISOString(),
          },
          totalUniqueVisitors: totalUnique,
          visitorsList: Array.from(uniqueVids).map((v) => ({ id: v })),
          recentLogs: cloudLogs,
        };

        // Cache cloud metrics locally for instant render on page reloads
        setLocalData('lc_cloud_cache', cloudPayload);

        return cloudPayload;
      }
    }
  } catch (err) {
    console.warn('[Analytics] Failed to fetch Google Sheet telemetry, falling back to local:', err);
  }

  const cachedCloud = getLocalData('lc_cloud_cache', null);
  if (cachedCloud) return cachedCloud;

  return { ...localData, isCloudConnected: false, source: 'local' };
}

export function getCachedAdminMetrics() {
  const cachedCloud = getLocalData('lc_cloud_cache', null);
  if (cachedCloud) return cachedCloud;
  return getAdminMetrics();
}

export function getAdminMetrics() {
  const metrics = getLocalData(STORAGE_KEYS.METRICS, DEFAULT_METRICS);
  const visitors = getLocalData(STORAGE_KEYS.VISITORS, {});
  const logs = getLocalData(STORAGE_KEYS.LOGS, []);

  return {
    metrics,
    totalUniqueVisitors: Object.keys(visitors).length || metrics.uniqueVisitors || 0,
    visitorsList: Object.entries(visitors).map(([id, info]) => ({ id, ...info })),
    recentLogs: logs,
  };
}

export function resetAnalyticsData() {
  localStorage.removeItem(STORAGE_KEYS.METRICS);
  localStorage.removeItem(STORAGE_KEYS.VISITORS);
  localStorage.removeItem(STORAGE_KEYS.LOGS);
  localStorage.removeItem(STORAGE_KEYS.GEO_CACHE);
  localStorage.removeItem('lc_cloud_cache');
}
