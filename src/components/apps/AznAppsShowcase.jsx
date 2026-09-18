import React from 'react';
import { AZN_APPS } from '../../data/appsData';
import { Smartphone, ExternalLink, Sparkles, Star } from 'lucide-react';

export default function AznAppsShowcase() {
  return (
    <section className="azn-showcase-section">
      <div className="azn-showcase-header">
        <div className="azn-showcase-title-group">
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
            <Sparkles size={20} />
          </div>
          <div>
            <h2 className="azn-showcase-title">More Apps by AZN Labs</h2>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Explore our native Android productivity, utility, and gaming tools on Google Play.
            </p>
          </div>
        </div>

        <a
          href="https://play.google.com/store/apps/developer?id=AZN+Enterprises"
          target="_blank"
          rel="noopener noreferrer"
          className="playstore-btn playstore-btn-secondary"
          style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
        >
          <Smartphone size={15} />
          <span>Google Play Store</span>
          <ExternalLink size={13} />
        </a>
      </div>

      <div className="azn-showcase-grid">
        {AZN_APPS.map((app) => (
          <div key={app.id} className={`azn-app-card ${app.isMain ? 'featured-card' : ''}`}>
            <div className="azn-app-card-top">
              <img src={app.icon} alt={app.name} className="azn-app-card-icon" />
              <div className="azn-app-card-meta">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
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
                className="playstore-btn"
                style={{ fontSize: '0.775rem', padding: '0.45rem 0.9rem' }}
              >
                <span>Install</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
