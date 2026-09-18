import React, { useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Puzzle, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  HelpCircle,
  FileArchive,
  Layers
} from 'lucide-react';

export default function ExtensionModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('chrome'); // 'chrome' | 'edge' | 'crx'
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="azn-modal-overlay" onClick={onClose}>
      <div 
        className="azn-modal-content" 
        style={{ maxWidth: '680px', padding: '1.75rem' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <button className="azn-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.2), rgba(255, 107, 0, 0.1))',
            color: '#ffa116',
            border: '1px solid rgba(255, 161, 22, 0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Puzzle size={24} />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Leet Companies Chrome Extension
              </h2>
              <span className="azn-brand-badge" style={{ fontSize: '0.62rem' }}>
                v1.0.2 • Manifest V3
              </span>
            </div>
            <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              Inject real company interview frequency tags directly into problem pages on <strong>leetcode.com</strong> with 0ms latency.
            </p>
          </div>
        </div>

        {/* Primary Download Action Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
          gap: '1rem', 
          marginBottom: '1.75rem' 
        }}>
          {/* ZIP Package (Recommended) */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 161, 22, 0.08) 0%, rgba(17, 22, 34, 0.95) 100%)',
            border: '1px solid rgba(255, 161, 22, 0.4)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '0.6rem', right: '0.75rem' }}>
              <span style={{
                background: 'rgba(255, 161, 22, 0.2)',
                color: '#ffa116',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                border: '1px solid rgba(255, 161, 22, 0.4)'
              }}>
                RECOMMENDED
              </span>
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <FileArchive size={18} color="#ffa116" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Extension ZIP
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                Unpacked source package. Works on all Chromium browsers without store restrictions.
              </p>
            </div>
            <a 
              href="/downloads/leetcode-companies-extension.zip" 
              download="leetcode-companies-extension.zip"
              className="action-btn-primary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 700
              }}
            >
              <Download size={15} />
              <span>Download .ZIP (483 KB)</span>
            </a>
          </div>

          {/* CRX Package (Alternative) */}
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1.1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.35rem' }}>
                <Layers size={18} color="var(--accent-blue)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                  Packed CRX
                </h3>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', margin: '0 0 1rem 0', lineHeight: 1.4 }}>
                Self-contained packaged extension for direct drag-and-drop developer install.
              </p>
            </div>
            <a 
              href="/downloads/leetcode-companies-extension.crx" 
              download="leetcode-companies-extension.crx"
              className="action-btn-secondary"
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.45rem',
                padding: '0.6rem 1rem',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              <Download size={15} />
              <span>Download .CRX (491 KB)</span>
            </a>
          </div>
        </div>

        {/* Browser Installation Guide Section */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '1.25rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            marginBottom: '1rem',
            flexWrap: 'wrap',
            gap: '0.5rem'
          }}>
            <h4 style={{ fontSize: '0.9rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <HelpCircle size={15} color="#ffa116" />
              <span>Step-by-Step Installation Guide</span>
            </h4>

            {/* Guide Tabs */}
            <div style={{ display: 'flex', gap: '0.35rem', background: 'var(--bg-tertiary)', padding: '0.2rem', borderRadius: '6px' }}>
              <button
                type="button"
                onClick={() => setActiveTab('chrome')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: activeTab === 'chrome' ? 'var(--accent-lc)' : 'transparent',
                  color: activeTab === 'chrome' ? '#000' : 'var(--text-secondary)'
                }}
              >
                Chrome / Brave / Arc
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('edge')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: activeTab === 'edge' ? 'var(--accent-lc)' : 'transparent',
                  color: activeTab === 'edge' ? '#000' : 'var(--text-secondary)'
                }}
              >
                Edge
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('crx')}
                style={{
                  padding: '0.25rem 0.65rem',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  borderRadius: '4px',
                  background: activeTab === 'crx' ? 'var(--accent-lc)' : 'transparent',
                  color: activeTab === 'crx' ? '#000' : 'var(--text-secondary)'
                }}
              >
                CRX Method
              </button>
            </div>
          </div>

          {/* Tab 1: Chrome / Brave / Arc Instructions */}
          {activeTab === 'chrome' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Download &amp; Extract:</strong> Download the <code>.zip</code> file above and extract it into a folder on your computer.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">2</span>
                <div style={{ flex: 1 }}>
                  <strong>Open Extensions:</strong> In a new tab, navigate to:
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    background: 'var(--bg-input)', 
                    padding: '0.2rem 0.55rem', 
                    borderRadius: '4px',
                    margin: '0.25rem 0.35rem 0 0',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <code style={{ color: '#ffa116', fontFamily: 'var(--font-mono)' }}>chrome://extensions</code>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('chrome://extensions')} 
                      title="Copy URL"
                      style={{ color: copiedUrl === 'chrome://extensions' ? '#10b981' : 'var(--text-muted)' }}
                    >
                      {copiedUrl === 'chrome://extensions' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  and turn <strong>ON</strong> the <em>"Developer mode"</em> toggle in the top-right corner.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">3</span>
                <div>
                  <strong>Load Unpacked:</strong> Click the <strong>"Load unpacked"</strong> button in the top-left corner and select the extracted folder.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">4</span>
                <div>
                  <strong>Test:</strong> Open any problem on <a href="https://leetcode.com/problems/two-sum/" target="_blank" rel="noopener noreferrer" style={{ color: '#ffa116', textDecoration: 'underline' }}>leetcode.com/problems/two-sum/</a> to see in-page company frequency badges!
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Edge Instructions */}
          {activeTab === 'edge' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Download &amp; Extract:</strong> Download the <code>.zip</code> file above and extract the folder.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">2</span>
                <div style={{ flex: 1 }}>
                  <strong>Open Edge Extensions:</strong> Go to:
                  <div style={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '0.45rem', 
                    background: 'var(--bg-input)', 
                    padding: '0.2rem 0.55rem', 
                    borderRadius: '4px',
                    margin: '0.25rem 0.35rem 0 0',
                    border: '1px solid var(--border-subtle)'
                  }}>
                    <code style={{ color: '#ffa116', fontFamily: 'var(--font-mono)' }}>edge://extensions</code>
                    <button 
                      type="button" 
                      onClick={() => handleCopy('edge://extensions')} 
                      title="Copy URL"
                      style={{ color: copiedUrl === 'edge://extensions' ? '#10b981' : 'var(--text-muted)' }}
                    >
                      {copiedUrl === 'edge://extensions' ? <Check size={12} /> : <Copy size={12} />}
                    </button>
                  </div>
                  and toggle <strong>"Developer mode"</strong> in the left sidebar.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">3</span>
                <div>
                  <strong>Load Unpacked:</strong> Click <strong>"Load unpacked"</strong> and pick the extracted folder.
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: CRX Instructions */}
          {activeTab === 'crx' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">1</span>
                <div>
                  <strong>Download CRX:</strong> Download the <code>.crx</code> file above.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">2</span>
                <div>
                  <strong>Open Extensions Tab:</strong> Open <code>chrome://extensions</code> with <strong>Developer mode enabled</strong>.
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                <span className="step-num-badge">3</span>
                <div>
                  <strong>Drag &amp; Drop:</strong> Drag the downloaded <code>.crx</code> file directly into the <code>chrome://extensions</code> browser window and click <strong>"Add extension"</strong> when prompted.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Feature Highlights Footer */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          fontSize: '0.75rem', 
          color: 'var(--text-muted)',
          flexWrap: 'wrap',
          gap: '0.75rem',
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: '#10b981', fontWeight: 600 }}>
              <ShieldCheck size={14} />
              100% Offline &amp; Safe
            </span>
            <span>•</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Zap size={14} color="#ffa116" />
              0ms Latency Local Data
            </span>
          </div>

          <a
            href="https://github.com/MuhammadAzaan/Leetcode-Companies-Extension"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-lc)', fontWeight: 600 }}
          >
            <span>GitHub Repository</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>
    </div>
  );
}
