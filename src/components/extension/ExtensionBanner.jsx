import React from 'react';
import { Puzzle, Download, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function ExtensionBanner({ onOpenModal }) {
  return (
    <section className="ext-spotlight-banner">
      <div className="ext-spotlight-inner">
        <div className="ext-spotlight-left">
          <div className="ext-icon-badge">
            <Puzzle size={28} />
          </div>
          <div className="ext-spotlight-content">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
              <span className="ext-pill-badge">CHROME EXTENSION</span>
              <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Manifest V3 • Free</span>
            </div>
            <h3 className="ext-spotlight-title">
              See Company Tags Directly on <span style={{ color: '#ffa116' }}>LeetCode.com</span>
            </h3>
            <p className="ext-spotlight-desc">
              Browse problems with real-time company occurrence frequency badges and 1-click matrix links right inside LeetCode description headers.
            </p>
          </div>
        </div>

        <div className="ext-spotlight-actions">
          <button 
            type="button" 
            onClick={onOpenModal} 
            className="action-btn-primary"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem', fontWeight: 700, gap: '0.45rem' }}
          >
            <Download size={16} />
            <span>Get Extension</span>
          </button>
          
          <button 
            type="button" 
            onClick={onOpenModal} 
            className="action-btn-secondary"
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
          >
            <span>Install Guide</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </section>
  );
}
