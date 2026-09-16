import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Layers, 
  Plus, 
  X, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  Circle, 
  Star, 
  Sparkles,
  Building2,
  Zap
} from 'lucide-react';

const PRESET_COMBOS = [
  { name: 'FAANG / Big Tech', slugs: ['meta', 'google', 'amazon', 'apple', 'microsoft'] },
  { name: 'Top Quant / HFT', slugs: ['jane-street', 'citadel', 'hudson-river-trading', 'two-sigma'] },
  { name: 'Fintech Giants', slugs: ['stripe', 'paypal', 'coinbase', 'robinhood'] },
  { name: 'Ride / Delivery', slugs: ['uber', 'doordash', 'lyft', 'instacart'] },
];

export default function CompanyOverlap() {
  const { companies, solvedMap, toggleSolved, bookmarkMap, toggleBookmark } = useApp();
  const [globalProblems, setGlobalProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Selected companies for overlap
  const [selectedSlugs, setSelectedSlugs] = useState(['google', 'meta', 'amazon']);
  const [companySearch, setCompanySearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Load global database
  useEffect(() => {
    fetch('./data/global_problems.json')
      .then((res) => res.json())
      .then((data) => setGlobalProblems(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const addCompany = (slug) => {
    if (!selectedSlugs.includes(slug) && selectedSlugs.length < 8) {
      setSelectedSlugs([...selectedSlugs, slug]);
    }
    setCompanySearch('');
    setDropdownOpen(false);
  };

  const removeCompany = (slug) => {
    setSelectedSlugs(selectedSlugs.filter((s) => s !== slug));
  };

  const applyPreset = (slugs) => {
    setSelectedSlugs(slugs);
  };

  // Compute overlapping problems
  const overlapResults = useMemo(() => {
    if (selectedSlugs.length === 0 || globalProblems.length === 0) return [];

    const selectedSet = new Set(selectedSlugs);

    const matches = [];
    for (const prob of globalProblems) {
      const matchingCompanies = prob.companies.filter((c) => selectedSet.has(c.slug));
      if (matchingCompanies.length >= 2) {
        matches.push({
          ...prob,
          matchingCompanies,
          matchCount: matchingCompanies.length,
          matchRatio: matchingCompanies.length / selectedSlugs.length,
        });
      }
    }

    // Sort by match count desc, then by popularity
    matches.sort((a, b) => {
      if (b.matchCount !== a.matchCount) {
        return b.matchCount - a.matchCount;
      }
      return (b.companyCount || 0) - (a.companyCount || 0);
    });

    return matches;
  }, [selectedSlugs, globalProblems]);

  const selectedCompaniesList = useMemo(() => {
    return selectedSlugs
      .map((slug) => companies.find((c) => c.slug === slug))
      .filter(Boolean);
  }, [selectedSlugs, companies]);

  const filteredCompanySuggestions = useMemo(() => {
    if (!companySearch.trim()) return [];
    const q = companySearch.toLowerCase().trim();
    return companies
      .filter((c) => !selectedSlugs.includes(c.slug) && c.name.toLowerCase().includes(q))
      .slice(0, 8);
  }, [companySearch, companies, selectedSlugs]);

  if (loading) {
    return (
      <div className="empty-state">
        <Sparkles size={36} className="empty-state-icon" />
        <h3>Loading Overlap Matrix...</h3>
        <p>Analyzing cross-company problem intersections</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="hero-header">
        <div className="hero-main">
          <h1>Multi-Company Overlap Matrix</h1>
          <p className="hero-subtitle">
            Targeting multiple companies? Find common high-frequency problems shared between your dream employers to maximize your interview prep efficiency.
          </p>
        </div>
      </section>

      {/* Preset Quick Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
          Quick Combos:
        </span>
        {PRESET_COMBOS.map((combo) => (
          <button
            key={combo.name}
            className="category-chip"
            style={{ fontSize: '0.8rem', padding: '0.35rem 0.75rem' }}
            onClick={() => applyPreset(combo.slugs)}
          >
            <Zap size={13} color="var(--accent-lc)" />
            {combo.name}
          </button>
        ))}
      </div>

      {/* Company Selector Box */}
      <div className="overlap-selector-box">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.25rem' }}>
              Selected Target Companies ({selectedSlugs.length})
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Add up to 8 companies to compute shared questions.
            </p>
          </div>

          {/* Add Company Search */}
          <div style={{ position: 'relative', width: '280px' }}>
            <div className="search-input-wrapper" style={{ width: '100%' }}>
              <Plus size={16} className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Add target company..."
                value={companySearch}
                onChange={(e) => {
                  setCompanySearch(e.target.value);
                  setDropdownOpen(true);
                }}
                onFocus={() => setDropdownOpen(true)}
              />
            </div>

            {dropdownOpen && filteredCompanySuggestions.length > 0 && (
              <div className="topic-dropdown-menu" style={{ width: '100%', top: 'calc(100% + 4px)' }}>
                {filteredCompanySuggestions.map((c) => (
                  <div
                    key={c.slug}
                    className="topic-option-item"
                    onClick={() => addCompany(c.slug)}
                  >
                    <span>{c.name}</span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                      {c.totalQuestions} qs
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Selected Chips */}
        <div className="overlap-chips-container">
          {selectedCompaniesList.map((comp) => (
            <div key={comp.slug} className="selected-company-chip">
              <Building2 size={15} color="var(--accent-lc)" />
              <span>{comp.name}</span>
              <button
                onClick={() => removeCompany(comp.slug)}
                style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title="Remove company"
              >
                <X size={14} />
              </button>
            </div>
          ))}
          {selectedCompaniesList.length === 0 && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Select at least 2 companies above to calculate overlap.
            </span>
          )}
        </div>
      </div>

      {/* Overlap Results Table */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Found <strong>{overlapResults.length}</strong> common questions asked by 2+ selected companies
        </span>
      </div>

      {overlapResults.length > 0 ? (
        <div className="table-container">
          <table className="problem-table">
            <thead>
              <tr>
                <th className="status-col">Status</th>
                <th>Problem Title</th>
                <th style={{ width: '110px' }}>Difficulty</th>
                <th>Topics</th>
                <th style={{ width: '160px' }}>Target Overlap</th>
                <th style={{ width: '220px' }}>Asked In Selected Companies</th>
              </tr>
            </thead>
            <tbody>
              {overlapResults.slice(0, 50).map((prob) => {
                const isSolved = !!solvedMap[prob.slug];
                const isBookmarked = !!bookmarkMap[prob.slug];
                const isPerfectMatch = prob.matchCount === selectedSlugs.length;

                return (
                  <tr key={prob.slug}>
                    {/* Solved */}
                    <td className="status-col">
                      <button
                        className="table-action-btn"
                        onClick={() => toggleSolved(prob.slug)}
                        title={isSolved ? 'Mark as Unsolved' : 'Mark as Solved'}
                      >
                        {isSolved ? (
                          <CheckCircle2 size={18} color="var(--status-solved)" />
                        ) : (
                          <Circle size={18} />
                        )}
                      </button>
                    </td>

                    {/* Title */}
                    <td>
                      <a
                        href={prob.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="problem-title-link"
                      >
                        <span style={{ textDecoration: isSolved ? 'line-through' : 'none', opacity: isSolved ? 0.7 : 1 }}>
                          {prob.title}
                        </span>
                        <ExternalLink size={13} style={{ opacity: 0.5 }} />
                      </a>
                    </td>

                    {/* Difficulty */}
                    <td>
                      <span className={`diff-badge ${prob.difficulty}`}>
                        {prob.difficulty}
                      </span>
                    </td>

                    {/* Topics */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '280px' }}>
                        {prob.topics && prob.topics.slice(0, 2).map((t) => (
                          <span key={t} className="tag-pill">{t}</span>
                        ))}
                      </div>
                    </td>

                    {/* Overlap Ratio Badge */}
                    <td>
                      <span
                        className="category-chip"
                        style={{
                          fontSize: '0.75rem',
                          padding: '0.2rem 0.6rem',
                          background: isPerfectMatch ? 'rgba(0, 184, 163, 0.15)' : 'var(--bg-tertiary)',
                          color: isPerfectMatch ? 'var(--diff-easy)' : 'var(--text-primary)',
                          borderColor: isPerfectMatch ? 'var(--diff-easy)' : 'var(--border-subtle)',
                          fontWeight: 700,
                        }}
                      >
                        {isPerfectMatch ? '🔥 All ' : ''}
                        {prob.matchCount} of {selectedSlugs.length} Companies
                      </span>
                    </td>

                    {/* Companies List */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {prob.matchingCompanies.map((mc) => (
                          <span
                            key={mc.slug}
                            className="tag-pill"
                            style={{ fontSize: '0.7rem', background: 'var(--bg-tertiary)' }}
                          >
                            {mc.name} ({mc.frequency}%)
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="empty-state">
          <Layers size={38} className="empty-state-icon" />
          <h3>No overlapping questions found</h3>
          <p>Try adding more companies to see shared interview questions.</p>
        </div>
      )}
    </div>
  );
}
