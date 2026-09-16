import React from 'react';
import { useApp } from '../context/AppContext';
import { Star, ChevronRight } from 'lucide-react';

export default function CompanyCard({ company }) {
  const { selectCompany, favCompaniesMap, toggleFavoriteCompany } = useApp();
  const isFav = !!favCompaniesMap[company.slug];

  const { easy = 0, medium = 0, hard = 0 } = company.difficultyCounts || {};
  const total = company.totalQuestions || (easy + medium + hard) || 1;

  const easyPct = Math.round((easy / total) * 100) || 0;
  const medPct = Math.round((medium / total) * 100) || 0;
  const hardPct = 100 - easyPct - medPct;

  const initial = company.name.charAt(0).toUpperCase();

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavoriteCompany(company.slug);
  };

  return (
    <div 
      className="company-card" 
      onClick={() => selectCompany(company.slug)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && selectCompany(company.slug)}
    >
      {/* Header */}
      <div className="company-card-header">
        <div className="company-brand-group">
          <div className="company-avatar">{initial}</div>
          <div className="company-info">
            <h3 className="company-name">{company.name}</h3>
            <span className="company-category-tag">{company.category}</span>
          </div>
        </div>
        <button
          className={`company-fav-btn ${isFav ? 'active' : ''}`}
          onClick={handleFavoriteClick}
          title={isFav ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Star size={18} fill={isFav ? 'var(--accent-lc)' : 'none'} />
        </button>
      </div>

      {/* Difficulty stats box */}
      <div className="company-card-stats">
        <div className="card-stat-box">
          <span className="card-stat-num easy">{easy}</span>
          <span className="card-stat-lbl">Easy</span>
        </div>
        <div className="card-stat-box">
          <span className="card-stat-num medium">{medium}</span>
          <span className="card-stat-lbl">Med</span>
        </div>
        <div className="card-stat-box">
          <span className="card-stat-num hard">{hard}</span>
          <span className="card-stat-lbl">Hard</span>
        </div>
      </div>

      {/* Difficulty breakdown visual bar */}
      <div className="difficulty-bar" title={`Easy: ${easy} | Med: ${medium} | Hard: ${hard}`}>
        <div className="difficulty-bar-segment easy" style={{ width: `${easyPct}%` }} />
        <div className="difficulty-bar-segment medium" style={{ width: `${medPct}%` }} />
        <div className="difficulty-bar-segment hard" style={{ width: `${hardPct}%` }} />
      </div>

      {/* Top Topics Preview */}
      {company.topTopics && company.topTopics.length > 0 && (
        <div className="company-tags-preview">
          {company.topTopics.slice(0, 3).map((topic) => (
            <span key={topic} className="tag-pill">{topic}</span>
          ))}
          {company.topTopics.length > 3 && (
            <span className="tag-pill">+{company.topTopics.length - 3}</span>
          )}
        </div>
      )}

      {/* Bottom Footer Info */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.25rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
          {company.totalQuestions} Questions
        </span>
        <span style={{ display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--accent-lc)', fontWeight: 600 }}>
          View Sheet <ChevronRight size={14} />
        </span>
      </div>
    </div>
  );
}
