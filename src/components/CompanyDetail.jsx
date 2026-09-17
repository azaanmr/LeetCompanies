import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import CompanyLogo from './CompanyLogo';
import FilterToolbar from './FilterToolbar';
import ProblemTable from './ProblemTable';
import RandomQuestionModal from './RandomQuestionModal';
import AznAppStrip from './apps/AznAppStrip';
import { 
  ArrowLeft, 
  Star, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CompanyDetail() {
  const {
    selectedCompanySlug,
    clearSelectedCompany,
    favCompaniesMap,
    toggleFavoriteCompany,
    solvedMap,
    bookmarkMap,
  } = useApp();

  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [minFrequency, setMinFrequency] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState('frequency'); // 'frequency' | 'title' | 'difficulty' | 'acceptanceRate'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'
  const [randomProblem, setRandomProblem] = useState(null);
  useEffect(() => {
    if (!selectedCompanySlug) return;
    setLoading(true);
    setError(null);

    fetch(`./data/companies/${selectedCompanySlug}.json`)
      .then((res) => {
        if (!res.ok) throw new Error('Company dataset not found');
        return res.json();
      })
      .then((data) => {
        setCompanyData(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load questions for this company.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCompanySlug]);

  const isFav = selectedCompanySlug && !!favCompaniesMap[selectedCompanySlug];

  // All problems for this company (using 'all' period or merging)
  const allCompanyProblems = useMemo(() => {
    if (!companyData || !companyData.periods) return [];
    if (companyData.periods['all'] && companyData.periods['all'].length > 0) {
      return companyData.periods['all'];
    }
    const seen = new Set();
    const merged = [];
    Object.values(companyData.periods).forEach((list) => {
      list.forEach((p) => {
        if (!seen.has(p.slug)) {
          seen.add(p.slug);
          merged.push(p);
        }
      });
    });
    return merged;
  }, [companyData]);
  const availableTopics = useMemo(() => {
    const topicSet = new Set();
    allCompanyProblems.forEach((p) => {
      if (p.topics) p.topics.forEach((t) => topicSet.add(t));
    });
    return Array.from(topicSet).sort();
  }, [allCompanyProblems]);
  const companySolvedStats = useMemo(() => {
    if (!allCompanyProblems || allCompanyProblems.length === 0) return { solved: 0, total: 0, percent: 0 };
    let solved = 0;
    allCompanyProblems.forEach((p) => {
      if (solvedMap[p.slug]) solved++;
    });
    const total = allCompanyProblems.length || 1;
    const percent = Math.round((solved / total) * 100);
    return { solved, total, percent };
  }, [allCompanyProblems, solvedMap]);
  const filteredProblems = useMemo(() => {
    let result = [...allCompanyProblems];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.topics && p.topics.some((t) => t.toLowerCase().includes(q)))
      );
    }
    if (selectedDifficulties.length > 0) {
      result = result.filter((p) => selectedDifficulties.includes(p.difficulty));
    }
    if (selectedTopics.length > 0) {
      result = result.filter(
        (p) => p.topics && selectedTopics.every((t) => p.topics.includes(t))
      );
    }
    if (minFrequency > 0) {
      result = result.filter((p) => (p.frequency || 0) >= minFrequency);
    }
    if (statusFilter === 'SOLVED') {
      result = result.filter((p) => !!solvedMap[p.slug]);
    } else if (statusFilter === 'UNSOLVED') {
      result = result.filter((p) => !solvedMap[p.slug]);
    } else if (statusFilter === 'BOOKMARKED') {
      result = result.filter((p) => !!bookmarkMap[p.slug]);
    }
    result.sort((a, b) => {
      let comparison = 0;
      if (sortField === 'frequency') {
        comparison = (b.frequency || 0) - (a.frequency || 0);
      } else if (sortField === 'title') {
        comparison = a.title.localeCompare(b.title);
      } else if (sortField === 'difficulty') {
        const order = { EASY: 1, MEDIUM: 2, HARD: 3 };
        comparison = (order[a.difficulty] || 0) - (order[b.difficulty] || 0);
      } else if (sortField === 'acceptanceRate') {
        const parseRate = (r) => parseFloat((r || '0').replace('%', ''));
        comparison = parseRate(a.acceptanceRate) - parseRate(b.acceptanceRate);
      }
      return sortOrder === 'desc' ? comparison : -comparison;
    });

    return result;
  }, [
    allCompanyProblems,
    searchQuery,
    selectedDifficulties,
    selectedTopics,
    minFrequency,
    statusFilter,
    sortField,
    sortOrder,
    solvedMap,
    bookmarkMap,
  ]);
  const toggleDifficulty = (diff) => {
    setSelectedDifficulties((prev) =>
      prev.includes(diff) ? prev.filter((d) => d !== diff) : [...prev, diff]
    );
  };

  const toggleTopic = (topic) => {
    setSelectedTopics((prev) =>
      prev.includes(topic) ? prev.filter((t) => t !== topic) : [...prev, topic]
    );
  };

  const clearTopics = () => setSelectedTopics([]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setSelectedDifficulties([]);
    setSelectedTopics([]);
    setMinFrequency(0);
    setStatusFilter('ALL');
  };
  const handlePickRandom = () => {
    if (filteredProblems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    setRandomProblem(filteredProblems[randomIndex]);
  };

  if (loading) {
    return (
      <div className="empty-state">
        <Sparkles size={36} className="empty-state-icon" />
        <h3>Loading Company Question Sheet...</h3>
        <p>Fetching curated problem sets and frequencies</p>
      </div>
    );
  }

  if (error || !companyData) {
    return (
      <div className="empty-state">
        <AlertCircle size={38} color="var(--diff-hard)" />
        <h3>Error Loading Company Data</h3>
        <p>{error || 'Could not find details for this company.'}</p>
        <button className="action-btn-secondary" onClick={clearSelectedCompany} style={{ marginTop: '1rem' }}>
          <ArrowLeft size={16} /> Back to Directory
        </button>
      </div>
    );
  }

  const initial = companyData.name.charAt(0).toUpperCase();

  return (
    <div>
      <section className="detail-header">
        <div className="detail-header-top">
          <button className="back-btn" onClick={clearSelectedCompany}>
            <ArrowLeft size={16} />
            <span>All Companies</span>
          </button>

          <button
            className={`action-btn-secondary ${isFav ? 'active' : ''}`}
            onClick={() => toggleFavoriteCompany(companyData.slug)}
            style={{ color: isFav ? 'var(--accent-lc)' : undefined }}
          >
            <Star size={16} fill={isFav ? 'var(--accent-lc)' : 'none'} />
            <span>{isFav ? 'Favorited' : 'Favorite Company'}</span>
          </button>
        </div>
        <div className="detail-title-group">
          <CompanyLogo slug={companyData.slug} name={companyData.name} size={56} fontSize="1.5rem" />
          <div className="detail-title-text">
            <h1>{companyData.name}</h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
              <span className="category-chip" style={{ fontSize: '0.75rem', padding: '0.15rem 0.6rem' }}>
                {companyData.category}
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                {companySolvedStats.solved} of {companySolvedStats.total} solved ({companySolvedStats.percent}%)
              </span>
            </div>
          </div>
        </div>
        <div style={{ marginTop: '-0.5rem' }}>
          <div style={{ height: '6px', background: 'var(--bg-tertiary)', borderRadius: '9999px', overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${companySolvedStats.percent}%`,
                background: 'linear-gradient(90deg, #10b981, #00b8a3)',
                borderRadius: '9999px',
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </div>
        <div className="detail-metrics-row">
          <div className="detail-metric-card">
            <span className="detail-metric-val">{companyData.totalQuestions}</span>
            <span className="detail-metric-lbl">Total Problems</span>
          </div>
          <div className="detail-metric-card">
            <span className="detail-metric-val easy">{companyData.difficultyCounts?.EASY || 0}</span>
            <span className="detail-metric-lbl">Easy</span>
          </div>
          <div className="detail-metric-card">
            <span className="detail-metric-val medium">{companyData.difficultyCounts?.MEDIUM || 0}</span>
            <span className="detail-metric-lbl">Medium</span>
          </div>
          <div className="detail-metric-card">
            <span className="detail-metric-val hard">{companyData.difficultyCounts?.HARD || 0}</span>
            <span className="detail-metric-lbl">Hard</span>
          </div>
        </div>
      </section>
      <FilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedDifficulties={selectedDifficulties}
        toggleDifficulty={toggleDifficulty}
        selectedTopics={selectedTopics}
        toggleTopic={toggleTopic}
        clearTopics={clearTopics}
        minFrequency={minFrequency}
        setMinFrequency={setMinFrequency}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        availableTopics={availableTopics}
        onPickRandom={handlePickRandom}
        onResetFilters={resetAllFilters}
        totalFilteredCount={filteredProblems.length}
      />

      <AznAppStrip 
        appId="anyalarm" 
        customText="⏰ Early morning technical rounds? Stop snoozing with Any Alarm — Math challenges, QR barcode scans & GPS arrival alerts." 
      />

      <ProblemTable
        problems={filteredProblems}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
      />
      {randomProblem && (
        <RandomQuestionModal
          problem={randomProblem}
          companyName={companyData.name}
          periodLabel="All Time"
          onClose={() => setRandomProblem(null)}
          onPickAnother={handlePickRandom}
        />
      )}
    </div>
  );
}
