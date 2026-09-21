import React, { useEffect } from 'react';
import { AZN_APPS } from '../../data/appsData';
import { trackAppInstallClick } from '../../services/analytics';
import { X, Smartphone, ExternalLink, Star, Sparkles } from 'lucide-react';

export default function AznAppsModal({ isOpen, onClose }) {
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

  if (!isOpen) return null;

  return (
    <div className="azn-modal-overlay" onClick={onClose}>
      <div className="azn-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="azn-modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'rgba(255, 161, 22, 0.15)',
            color: '#ffa116',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
              More from AZN Labs
            </h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Native Android apps developed by Muhammad Azaan M R (AZN Labs) with privacy, performance, and zero bloat.
            </p>
          </div>
        </div>

        <div className="azn-showcase-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
          {AZN_APPS.map((app) => (
            <div key={app.id} className={`azn-app-card ${app.isMain ? 'featured-card' : ''}`}>
              <div className="azn-app-card-top">
                <img src={app.icon} alt={app.name} className="azn-app-card-icon" />
                <div className="azn-app-card-meta">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="azn-ad-label" style={{ fontSize: '0.62rem', padding: '0.1rem 0.45rem' }}>
                      {app.badgeText}
                    </span>
                    <span className="azn-ad-rating" style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem' }}>
                      <Star size={10} fill="#fbbf24" stroke="none" />
                      {app.rating.replace(' ★', '')}
                    </span>
                  </div>
                  <h3 className="azn-app-card-name">{app.name}</h3>
                  <span className="azn-app-card-category">{app.category}</span>
                </div>
              </div>

              <p className="azn-app-card-desc">{app.description}</p>

              <div className="azn-app-card-features">
                {app.features.slice(0, 3).map((feat, idx) => (
                  <div key={idx} className="azn-app-card-feature-item">
                    <span>•</span>
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <div className="azn-app-card-footer">
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Free on Google Play
                </span>
                <a
                  href={app.playStoreUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackAppInstallClick(app.id)}
                  className="playstore-btn"
                  style={{ fontSize: '0.775rem', padding: '0.45rem 0.9rem' }}
                >
                  <Smartphone size={13} />
                  <span>Install</span>
                  <ExternalLink size={12} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
