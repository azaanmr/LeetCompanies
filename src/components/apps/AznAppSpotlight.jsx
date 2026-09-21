import React, { useState } from 'react';
import { AZN_APPS } from '../../data/appsData';
import { trackAppInstallClick } from '../../services/analytics';
import { ExternalLink, Sparkles, Smartphone, CheckCircle } from 'lucide-react';

export default function AznAppSpotlight({ defaultAppId = 'anyalarm', onOpenShowcase }) {
  const [selectedId, setSelectedId] = useState(defaultAppId);
  const app = AZN_APPS.find((a) => a.id === selectedId) || AZN_APPS[0];

  return (
    <div className="azn-ad-spotlight">
      <div className="azn-ad-header-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span className="azn-ad-label">
            <Sparkles size={13} />
            More from AZN Labs
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Official Android Apps
          </span>
        </div>

        <div className="azn-ad-app-switch">
          {AZN_APPS.map((a) => (
            <button
              key={a.id}
              className={`azn-app-tab-btn ${selectedId === a.id ? 'active' : ''}`}
              onClick={() => setSelectedId(a.id)}
            >
              {a.name}
            </button>
          ))}
        </div>
      </div>

      <div className="azn-ad-body">
        <div className="azn-ad-icon-wrapper">
          <img src={app.icon} alt={app.name} className="azn-ad-icon-img" />
        </div>

        <div className="azn-ad-details">
          <div className="azn-ad-title-row">
            <h3 className="azn-ad-title">{app.fullName}</h3>
            <span className="azn-ad-rating">{app.rating}</span>
          </div>

          <p className="azn-ad-tagline">{app.tagline}</p>

          <div className="azn-ad-chips">
            {app.features.slice(0, 4).map((feat, idx) => (
              <span key={idx} className="azn-ad-chip">
                {feat}
              </span>
            ))}
          </div>
        </div>

        <div className="azn-ad-cta-col">
          <a
            href={app.playStoreUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackAppInstallClick(app.id)}
            className="playstore-btn"
          >
            <Smartphone size={16} />
            <span>Get on Google Play</span>
            <ExternalLink size={14} />
          </a>
          
          {onOpenShowcase && (
            <button
              onClick={onOpenShowcase}
              className="playstore-btn playstore-btn-secondary"
              style={{ fontSize: '0.775rem', padding: '0.45rem 0.9rem', width: '100%', justifyContent: 'center' }}
            >
              View All Apps
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
