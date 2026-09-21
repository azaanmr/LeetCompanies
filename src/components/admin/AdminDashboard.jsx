import React, { useState, useEffect } from 'react';
import { ADMIN_CONFIG } from '../../config/adminSecret';
import { 
  fetchGlobalAdminMetrics, 
  getCachedAdminMetrics,
  resetAnalyticsData, 
  trackPageView 
} from '../../services/analytics';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  BarChart3, 
  Download, 
  Smartphone, 
  Users, 
  Globe, 
  RefreshCw, 
  Trash2, 
  LogOut, 
  ExternalLink,
  Laptop,
  CheckCircle2,
  AlertCircle,
  FileArchive,
  Layers,
  ArrowRight,
  Database
} from 'lucide-react';

const AUTH_STORAGE_KEY = 'lc_admin_authenticated';

export default function AdminDashboard({ onExitAdmin }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [analyticsData, setAnalyticsData] = useState(() => getCachedAdminMetrics());
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');
  const [confirmReset, setConfirmReset] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    const targetPassword = (ADMIN_CONFIG && ADMIN_CONFIG.ADMIN_PASSWORD) ? ADMIN_CONFIG.ADMIN_PASSWORD : 'admin';
    try {
      const data = await fetchGlobalAdminMetrics(targetPassword);
      setAnalyticsData(data);
    } catch (err) {
      console.warn('Failed to load global metrics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError('');

    const targetPassword = (ADMIN_CONFIG && ADMIN_CONFIG.ADMIN_PASSWORD) ? ADMIN_CONFIG.ADMIN_PASSWORD : 'admin';

    if (passwordInput === targetPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem(AUTH_STORAGE_KEY, 'true');
      loadData();
    } else {
      setAuthError('Incorrect admin password. Please check src/config/adminSecret.js.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
    setPasswordInput('');
  };

  const handleResetData = () => {
    resetAnalyticsData();
    setConfirmReset(false);
    loadData();
  };

  const exportDataJSON = () => {
    const data = getAdminMetrics();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `leetcompanies_analytics_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '440px',
          background: 'linear-gradient(135deg, rgba(20, 26, 40, 0.95) 0%, rgba(13, 17, 26, 0.98) 100%)',
          border: '1px solid rgba(255, 161, 22, 0.35)',
          borderRadius: '16px',
          padding: '2.25rem',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 161, 22, 0.08)',
          position: 'relative'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.25), rgba(255, 107, 0, 0.15))',
              border: '1px solid rgba(255, 161, 22, 0.45)',
              color: '#ffa116',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
              boxShadow: '0 4px 16px rgba(255, 161, 22, 0.2)'
            }}>
              <Lock size={26} />
            </div>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Admin Command Center
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Enter password configured in <code>adminSecret.js</code>
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.45rem' }}>
                Admin Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="Enter secret password..."
                  autoFocus
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.8rem 0.75rem 0.95rem',
                    background: 'var(--bg-input)',
                    border: authError ? '1px solid #ff375f' : '1px solid var(--border-medium)',
                    borderRadius: '10px',
                    color: 'var(--text-primary)',
                    fontSize: '0.92rem',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '0.85rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {authError && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff375f', fontSize: '0.78rem', marginTop: '0.5rem' }}>
                  <AlertCircle size={14} />
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="action-btn-primary"
              style={{
                width: '100%',
                padding: '0.75rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                justifyContent: 'center',
                borderRadius: '10px'
              }}
            >
              <ShieldCheck size={18} />
              <span>Access Dashboard</span>
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <button
              type="button"
              onClick={onExitAdmin}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <span>← Return to Public Website</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const metrics = analyticsData ? analyticsData.metrics : {};
  const recentLogs = analyticsData ? analyticsData.recentLogs : [];
  const totalUnique = analyticsData ? analyticsData.totalUniqueVisitors : 0;
  const totalPageviews = metrics.totalPageviews || 0;
  const downloads = metrics.downloads || { zip: 0, crx: 0, total: 0 };
  const appInstalls = metrics.appInstalls || { anyalarm: 0, net: 0, minesaves: 0, total: 0 };
  const topCompanies = metrics.topCompanies || {};
  const devices = metrics.devices || { desktop: 0, mobile: 0, tablet: 0 };
  const countries = metrics.countries || {};

  const filteredLogs = recentLogs.filter((log) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'PAGE_VIEW') return log.action === 'PAGE_VIEW';
    if (activeFilter === 'EXTENSION_DOWNLOAD') return log.action === 'EXTENSION_DOWNLOAD';
    if (activeFilter === 'APP_INSTALL_CLICK') return log.action === 'APP_INSTALL_CLICK';
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Admin Top Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.25rem 1.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.25), rgba(255, 107, 0, 0.15))',
            color: '#ffa116',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255, 161, 22, 0.35)'
          }}>
            <BarChart3 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                AZN Analytics Dashboard
              </h1>
              <span className="azn-brand-badge" style={{ fontSize: '0.62rem' }}>
                ADMIN PANEL
              </span>
              {analyticsData && analyticsData.isCloudConnected ? (
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--status-solved)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem'
                }}>
                  <Database size={11} />
                  <span>Google Sheets Connected 🟢</span>
                </span>
              ) : (
                <span style={{
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-muted)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.68rem',
                  fontWeight: 600,
                  padding: '0.15rem 0.5rem',
                  borderRadius: '6px'
                }}>
                  Local Telemetry
                </span>
              )}
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              Real-time multi-visitor cloud telemetry for site visits, extension downloads, and Android app installs.
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="action-btn-secondary"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', gap: '0.4rem', opacity: isLoading ? 0.6 : 1 }}
            title="Refresh Metrics from Google Sheets"
          >
            <RefreshCw size={14} className={isLoading ? 'spin-icon' : ''} />
            <span>{isLoading ? 'Syncing...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={exportDataJSON}
            className="action-btn-secondary"
            style={{ padding: '0.5rem 0.9rem', fontSize: '0.8rem', gap: '0.4rem' }}
            title="Export full analytics report as JSON"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.8rem',
              background: 'rgba(255, 55, 95, 0.1)',
              border: '1px solid rgba(255, 55, 95, 0.3)',
              color: '#ff375f',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
            title="Clear all recorded test data"
          >
            <Trash2 size={14} />
            <span>Reset</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              padding: '0.5rem 0.9rem',
              fontSize: '0.8rem',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: '8px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Confirmation Modal for Reset */}
      {confirmReset && (
        <div className="azn-modal-overlay" onClick={() => setConfirmReset(false)}>
          <div className="azn-modal-content" style={{ maxWidth: '420px', padding: '1.75rem' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#ff375f', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={20} />
              <span>Confirm Data Reset</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
              This will erase all recorded visitor logs, download tallies, and app click history from this browser. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                className="action-btn-secondary"
                onClick={() => setConfirmReset(false)}
                style={{ padding: '0.5rem 1rem' }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleResetData}
                style={{
                  background: '#ff375f',
                  color: '#fff',
                  border: 'none',
                  padding: '0.5rem 1.25rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer'
                }}
              >
                Yes, Reset All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 KPI Summary Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1.25rem'
      }}>
        
        {/* KPI 1: Site Visits */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Site Visits
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: 'var(--accent-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>
              {totalPageviews}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Pageviews
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Unique Visitors:</span>
            <strong style={{ color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)' }}>{totalUnique}</strong>
          </div>
        </div>

        {/* KPI 2: Extension Downloads */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid rgba(255, 161, 22, 0.35)',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#ffa116' }}>
              Extension Downloads
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(255, 161, 22, 0.15)',
              color: '#ffa116',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Download size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffa116' }}>
              {downloads.total || 0}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Total Downloads
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <span>ZIP: <strong style={{ color: 'var(--text-primary)' }}>{downloads.zip || 0}</strong></span>
            <span>•</span>
            <span>CRX: <strong style={{ color: 'var(--text-primary)' }}>{downloads.crx || 0}</strong></span>
          </div>
        </div>

        {/* KPI 3: App Install Clicks */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--status-solved)' }}>
              AZN App Installs
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.15)',
              color: 'var(--status-solved)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Smartphone size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-solved)' }}>
              {appInstalls.total || 0}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Play Store Clicks
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Any Alarm: <strong style={{ color: 'var(--text-primary)' }}>{appInstalls.anyalarm || 0}</strong></span>
            <span>•</span>
            <span>NET: <strong style={{ color: 'var(--text-primary)' }}>{appInstalls.net || 0}</strong></span>
            <span>•</span>
            <span>MineSaves: <strong style={{ color: 'var(--text-primary)' }}>{appInstalls.minesaves || 0}</strong></span>
          </div>
        </div>

        {/* KPI 4: Devices & Geography */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Devices &amp; Platforms
            </span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'rgba(168, 85, 247, 0.15)',
              color: 'var(--accent-purple)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Laptop size={18} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>
              {Object.keys(countries).length || 1}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Active Geographies
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: '0.85rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border-subtle)',
            fontSize: '0.78rem',
            color: 'var(--text-secondary)'
          }}>
            <span>Desktop: <strong style={{ color: 'var(--text-primary)' }}>{devices.desktop || 0}</strong></span>
            <span>•</span>
            <span>Mobile: <strong style={{ color: 'var(--text-primary)' }}>{devices.mobile || 0}</strong></span>
            <span>•</span>
            <span>Tablet: <strong style={{ color: 'var(--text-primary)' }}>{devices.tablet || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Detailed Analytics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        
        {/* Extension Downloads Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.75rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} color="#ffa116" />
            <span>Extension Download Distribution</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* ZIP Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <FileArchive size={14} color="#ffa116" />
                  <span>Unpacked ZIP (.zip)</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: '#ffa116' }}>
                  {downloads.zip || 0} clicks
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${downloads.total > 0 ? ((downloads.zip || 0) / downloads.total) * 100 : 0}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #ffa116, #ff6b00)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>

            {/* CRX Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.825rem', marginBottom: '0.35rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                  <Layers size={14} color="var(--accent-blue)" />
                  <span>Packed CRX (.crx)</span>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-blue)' }}>
                  {downloads.crx || 0} clicks
                </span>
              </div>
              <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
                <div style={{
                  width: `${downloads.total > 0 ? ((downloads.crx || 0) / downloads.total) * 100 : 0}%`,
                  height: '100%',
                  background: 'var(--accent-blue)',
                  borderRadius: '9999px',
                  transition: 'width 0.4s ease'
                }} />
              </div>
            </div>
          </div>
        </div>

        {/* AZN Apps Installs Breakdown */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '16px',
          padding: '1.75rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 1.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smartphone size={18} color="var(--status-solved)" />
            <span>AZN Labs App Conversion Breakdown</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Any Alarm */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.95rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img src="/apps/Anyalarm.webp" alt="Any Alarm" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>Any Alarm</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>GPS &amp; Math Alarm Clock</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#ffa116' }}>
                  {appInstalls.anyalarm || 0}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Installs</div>
              </div>
            </div>

            {/* NET */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.95rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img src="/apps/NET.webp" alt="NET" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>NET Expense Manager</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Budget &amp; Mess Tracker</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--status-solved)' }}>
                  {appInstalls.net || 0}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Installs</div>
              </div>
            </div>

            {/* MineSaves */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0.65rem 0.95rem',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <img src="/apps/Minesaves.webp" alt="MineSaves" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>MineSaves</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MCPE World Backup Vault</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-blue)' }}>
                  {appInstalls.minesaves || 0}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Installs</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Event Stream / Visitor Log Table */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '16px',
        padding: '1.75rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div>
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Live Telemetry &amp; Activity Stream
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Showing the latest visitor sessions, downloads, and app click events.
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.25rem', borderRadius: '8px' }}>
            {['ALL', 'PAGE_VIEW', 'EXTENSION_DOWNLOAD', 'APP_INSTALL_CLICK'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                style={{
                  padding: '0.35rem 0.75rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '6px',
                  background: activeFilter === filter ? 'var(--accent-lc)' : 'transparent',
                  color: activeFilter === filter ? '#000' : 'var(--text-secondary)',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {filter === 'ALL' ? 'All Events' : filter.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No activity events recorded yet. Open the site or click download/app links to see live telemetry!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.825rem', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Event Type</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>IP / Country</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Browser / Device</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600 }}>Details</th>
                  <th style={{ padding: '0.75rem 0.5rem', fontWeight: 600, textAlign: 'right' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => {
                  const d = log.details || {};
                  let badgeBg = 'rgba(56, 189, 248, 0.15)';
                  let badgeColor = 'var(--accent-blue)';
                  let label = 'PAGE VIEW';

                  if (log.action === 'EXTENSION_DOWNLOAD') {
                    badgeBg = 'rgba(255, 161, 22, 0.15)';
                    badgeColor = '#ffa116';
                    label = `DOWNLOAD (${d.downloadType || 'ZIP'})`;
                  } else if (log.action === 'APP_INSTALL_CLICK') {
                    badgeBg = 'rgba(16, 185, 129, 0.15)';
                    badgeColor = 'var(--status-solved)';
                    label = `APP CLICK (${d.appId || 'APP'})`;
                  }

                  return (
                    <tr key={log.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: badgeBg,
                          color: badgeColor,
                          textTransform: 'uppercase'
                        }}>
                          {label}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', fontFamily: 'var(--font-mono)' }}>
                        <span style={{ color: 'var(--text-primary)' }}>{d.ip || 'Local'}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.4rem', fontSize: '0.75rem' }}>
                          ({d.country || 'Global'})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <span>{d.browser || 'Unknown'}</span>
                        <span style={{ color: 'var(--text-muted)', marginLeft: '0.35rem', fontSize: '0.75rem' }}>
                          • {d.os || 'OS'} ({d.device || 'desktop'})
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-secondary)' }}>
                        {d.path ? `Path: ${d.path}` : d.downloadType ? `Format: .${d.downloadType}` : d.appId ? `App: ${d.appId}` : '—'}
                      </td>
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'right', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
