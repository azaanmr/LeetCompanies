import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CompanyLogo from './CompanyLogo';
import { 
  Building2, 
  Search, 
  Sparkles, 
  ArrowRight, 
  Layers, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  Code2,
  Trophy
} from 'lucide-react';

// Active curated companies with logos in company_logos
const AVAILABLE_COMPANIES_WITH_LOGOS = [
  { name: 'Google', slug: 'google', tag: 'Big Tech' },
  { name: 'Microsoft', slug: 'microsoft', tag: 'Big Tech' },
  { name: 'Netflix', slug: 'netflix', tag: 'Streaming' },
  { name: 'Bloomberg', slug: 'bloomberg', tag: 'Fintech' },
  { name: 'Coinbase', slug: 'coinbase', tag: 'Crypto' },
  { name: 'Goldman Sachs', slug: 'goldman-sachs', tag: 'Investment Banking' }
];

export default function HomeTab() {
  const { selectCompany, setActiveTab, companies } = useApp();
  const [quickQuery, setQuickQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!quickQuery.trim()) return;
    const matchCompany = companies.find((c) =>
      c.name.toLowerCase().includes(quickQuery.toLowerCase().trim())
    );

    if (matchCompany) {
      selectCompany(matchCompany.slug);
    } else {
      setActiveTab('search');
    }
  };

  return (
    <div className="home-container">
      <section className="home-hero">
        <div className="home-badge">
          <Sparkles size={14} color="var(--accent-lc)" />
          <span>Complete 470+ Company Interview Question Sets</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', margin: '2.5rem 0 3rem 0' }}>
          <img src="/logo-cropped.svg" alt="LeetCompanies" style={{ width: '650px', maxWidth: '95%', height: 'auto', display: 'block' }} />
        </div>

        <h1 className="home-title">
          Crack Tech Interviews with <br />
          <span className="home-title-highlight">Company-Specific</span> LeetCode Prep
        </h1>

        <p className="home-subtitle">
          Practice the exact algorithmic questions asked by top engineering teams and quant hedge funds. Filter by frequency, difficulty, and algorithmic tags with zero friction.
        </p>
        <form onSubmit={handleSearchSubmit} className="home-search-form">
          <div className="home-search-box">
            <Search size={18} className="home-search-icon" />
            <input
              type="text"
              className="home-search-input"
              placeholder="Search companies or problems (e.g. Google, Two Sum)..."
              value={quickQuery}
              onChange={(e) => setQuickQuery(e.target.value)}
            />
            <button type="submit" className="home-search-btn">
              <span>Explore</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
        <div className="home-hero-actions">
          <button 
            className="action-btn-primary" 
            style={{ padding: '0.75rem 1.75rem', fontSize: '0.95rem' }}
            onClick={() => setActiveTab('companies')}
          >
            <Building2 size={18} />
            <span>Browse All 470+ Companies</span>
          </button>

          <button 
            className="action-btn-secondary"
            style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
            onClick={() => setActiveTab('search')}
          >
            <Layers size={18} />
            <span>Company Overlap Matrix</span>
          </button>
        </div>
      </section>
      <section className="marquee-section">
        <div className="marquee-header">
          <span className="marquee-title">Featured Companies</span>
        </div>

        <div className="marquee-container">
          <div className="marquee-track">
            {[1, 2, 3].map((loopIdx) => (
              <React.Fragment key={`loop-${loopIdx}`}>
                {AVAILABLE_COMPANIES_WITH_LOGOS.map((comp) => (
                  <div
                    key={`m-${loopIdx}-${comp.slug}`}
                    className="marquee-card"
                    onClick={() => selectCompany(comp.slug)}
                    role="button"
                    tabIndex={0}
                  >
                    <CompanyLogo slug={comp.slug} name={comp.name} size={36} />
                    <div className="marquee-info">
                      <span className="marquee-name">{comp.name}</span>
                      <span className="marquee-tag">{comp.tag}</span>
                    </div>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </section>
      <section className="featured-tracks-section">
        <h2 className="section-heading">Featured Interview Tracks</h2>
        
        <div className="tracks-grid">
          <div className="track-card">
            <div className="track-icon-wrapper" style={{ background: 'rgba(255, 161, 22, 0.15)', color: '#ffa116' }}>
              <Trophy size={24} />
            </div>
            <h3 className="track-title">Big Tech & FAANG</h3>
            <p className="track-desc">
              Curated interview sheets for Google, Microsoft, Netflix, Meta, Apple, and Amazon with complete question frequencies and difficulty breakdown.
            </p>
            <div className="track-companies-row">
              {['Google', 'Microsoft', 'Netflix', 'Amazon', 'Apple'].map((name) => {
                const comp = companies.find(c => c.name === name);
                return (
                  <button 
                    key={name} 
                    className="tag-pill" 
                    onClick={() => comp && selectCompany(comp.slug)}
                    style={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="track-card">
            <div className="track-icon-wrapper" style={{ background: 'rgba(0, 184, 163, 0.15)', color: '#00b8a3' }}>
              <Zap size={24} />
            </div>
            <h3 className="track-title">Fintech & Banking</h3>
            <p className="track-desc">
              Real problem sets from Bloomberg, Goldman Sachs, Coinbase, PayPal, and Morgan Stanley for quantitative and engineering roles.
            </p>
            <div className="track-companies-row">
              {['Bloomberg', 'Goldman Sachs', 'Coinbase', 'PayPal'].map((name) => {
                const comp = companies.find(c => c.name === name);
                return (
                  <button 
                    key={name} 
                    className="tag-pill" 
                    onClick={() => comp && selectCompany(comp.slug)}
                    style={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="track-card">
            <div className="track-icon-wrapper" style={{ background: 'rgba(56, 189, 248, 0.15)', color: '#38bdf8' }}>
              <Layers size={24} />
            </div>
            <h3 className="track-title">High Growth & SaaS</h3>
            <p className="track-desc">
              Real-world algorithmic questions asked in technical interviews at Uber, Airbnb, Stripe, Snowflake, and Databricks.
            </p>
            <div className="track-companies-row">
              {['Uber', 'Airbnb', 'Stripe', 'Snowflake', 'Databricks'].map((name) => {
                const comp = companies.find(c => c.name === name);
                return (
                  <button 
                    key={name} 
                    className="tag-pill" 
                    onClick={() => comp && selectCompany(comp.slug)}
                    style={{ cursor: 'pointer', fontWeight: 600 }}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="highlights-banner">
        <div className="highlight-box">
          <div className="highlight-icon">
            <TrendingUp size={22} color="var(--accent-lc)" />
          </div>
          <div>
            <h4>Frequency Sorted</h4>
            <p>Prioritize high-yield problems that are repeatedly asked in current rounds.</p>
          </div>
        </div>

        <div className="highlight-box">
          <div className="highlight-icon">
            <ShieldCheck size={22} color="var(--diff-easy)" />
          </div>
          <div>
            <h4>Multi-Company Overlap</h4>
            <p>Targeting several companies? Practice shared questions to save hours of prep time.</p>
          </div>
        </div>

        <div className="highlight-box">
          <div className="highlight-icon">
            <Code2 size={22} color="var(--accent-blue)" />
          </div>
          <div>
            <h4>Personal Progress Tracking</h4>
            <p>Check off solved problems, bookmark questions, and keep notes stored locally.</p>
          </div>
        </div>
      </section>
    </div>
  );
}
