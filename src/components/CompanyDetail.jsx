import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import FilterToolbar from './FilterToolbar';
import ProblemTable from './ProblemTable';
import RandomQuestionModal from './RandomQuestionModal';
import { 
  ArrowLeft, 
  Star, 
  Calendar, 
  Flame, 
  CheckCircle2, 
  Sparkles,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

const TIMEFRAMES = [
  { key: '30d', label: '30 Days', badge: 'Hot 🔥' },
  { key: '3m', label: '3 Months', badge: null },
  { key: '6m', label: '6 Months', badge: null },
  { key: '6m_plus', label: '> 6 Months', badge: null },
  { key: 'all', label: 'All Time', badge: null },
];

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

  // Active Timeframe
  const [selectedPeriod, setSelectedPeriod] = useState('30d');

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulties, setSelectedDifficulties] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [minFrequency, setMinFrequency] = useState(0);
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Sorting states
  const [sortField, setSortField] = useState('frequency'); // 'frequency' | 'title' | 'difficulty' | 'acceptanceRate'
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' | 'desc'

  // Random Modal state
  const [randomProblem, setRandomProblem] = useState(null);

  // Load detailed company data from JSON
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
        // Default to first timeframe with data if 30d is empty
        if (data.periods['30d']?.length > 0) {
          setSelectedPeriod('30d');
        } else if (data.periods['3m']?.length > 0) {
          setSelectedPeriod('3m');
        } else if (data.periods['6m']?.length > 0) {
          setSelectedPeriod('6m');
        } else {
          setSelectedPeriod('all');
        }
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

  // Current period problems raw list
  const currentPeriodProblems = useMemo(() => {
    if (!companyData || !companyData.periods) return [];
    return companyData.periods[selectedPeriod] || [];
  }, [companyData, selectedPeriod]);

  // Extract all available topics in current company period
  const availableTopics = useMemo(() => {
    const topicSet = new Set();
    currentPeriodProblems.forEach((p) => {
      if (p.topics) p.topics.forEach((t) => topicSet.add(t));
    });
    return Array.from(topicSet).sort();
  }, [currentPeriodProblems]);

  // Calculate Solved progress for this company
  const companySolvedStats = useMemo(() => {
    if (!companyData || !companyData.periods) return { solved: 0, total: 0, percent: 0 };
    const allProbs = companyData.periods['all'] || currentPeriodProblems;
    const uniqueSlugs = new Set(allProbs.map((p) => p.slug));
    let solved = 0;
    uniqueSlugs.forEach((slug) => {
      if (solvedMap[slug]) solved++;
    });
    const total = uniqueSlugs.size || 1;
    const percent = Math.round((solved / total) * 100);
    return { solved, total, percent };
  }, [companyData, currentPeriodProblems, solvedMap]);

  // Filter and sort problems
  const filteredProblems = useMemo(() => {
    let result = [...currentPeriodProblems];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.topics && p.topics.some((t) => t.toLowerCase().includes(q)))
      );
    }

    // Difficulty filter
    if (selectedDifficulties.length > 0) {
      result = result.filter((p) => selectedDifficulties.includes(p.difficulty));
    }

    // Topics filter
    if (selectedTopics.length > 0) {
      result = result.filter(
        (p) => p.topics && selectedTopics.every((t) => p.topics.includes(t))
      );
    }

    // Frequency filter
    if (minFrequency > 0) {
      result = result.filter((p) => (p.frequency || 0) >= minFrequency);
    }

    // Status filter
    if (statusFilter === 'SOLVED') {
      result = result.filter((p) => !!solvedMap[p.slug]);
    } else if (statusFilter === 'UNSOLVED') {
      result = result.filter((p) => !solvedMap[p.slug]);
    } else if (statusFilter === 'BOOKMARKED') {
      result = result.filter((p) => !!bookmarkMap[p.slug]);
    }

    // Sort
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
    currentPeriodProblems,
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

  // Filter Handlers
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

  // Random Question Picker
  const handlePickRandom = () => {
    if (filteredProblems.length === 0) return;
    const randomIndex = Math.floor(Math.random() * filteredProblems.length);
    setRandomProblem(filteredProblems[randomIndex]);
  };

  // Export Sheet to CSV
  const handleExportCSV = () => {
    if (filteredProblems.length === 0) return;
    const headers = ['Difficulty', 'Title', 'Frequency', 'Acceptance Rate', 'Link', 'Topics', 'Solved'];
    const rows = filteredProblems.map((p) => [
      p.difficulty,
      `"${p.title.replace(/"/g, '""')}"`,
      p.frequency,
      p.acceptanceRate,
      p.link,
      `"${(p.topics || []).join(', ')}"`,
      solvedMap[p.slug] ? 'Yes' : 'No',
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${companyData.name}_${selectedPeriod}_questions.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
  const currentPeriodObj = TIMEFRAMES.find((t) => t.key === selectedPeriod);

  return (
    <div>
      {/* Header Banner */}
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

        {/* Company Title & Brand */}
        <div className="detail-title-group">
          <div className="detail-avatar">{initial}</div>
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

        {/* Solved Progress Bar for this company */}
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

        {/* Metrics Grid */}
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

      {/* Recency Timeframe Tabs */}
      <div className="timeframe-bar">
        {TIMEFRAMES.map((t) => {
          const count = companyData.counts?.[t.key] || 0;
          const isActive = selectedPeriod === t.key;
          return (
            <button
              key={t.key}
              className={`timeframe-tab ${isActive ? 'active' : ''}`}
              onClick={() => {
                setSelectedPeriod(t.key);
                resetAllFilters();
              }}
            >
              <Calendar size={15} />
              <span>{t.label}</span>
              {t.badge && !isActive && (
                <span style={{ fontSize: '0.7rem', color: 'var(--accent-lc)', fontWeight: 700 }}>
                  {t.badge}
                </span>
              )}
              <span className="timeframe-count-badge">{count}</span>
            </button>
          );
        })}
      </div>

      {/* Filter Toolbar */}
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
        onExportCSV={handleExportCSV}
        onResetFilters={resetAllFilters}
        totalFilteredCount={filteredProblems.length}
      />

      {/* Problem Table */}
      <ProblemTable
        problems={filteredProblems}
        sortField={sortField}
        sortOrder={sortOrder}
        onSortChange={(field, order) => {
          setSortField(field);
          setSortOrder(order);
        }}
      />

      {/* Random Question Modal */}
      {randomProblem && (
        <RandomQuestionModal
          problem={randomProblem}
          companyName={companyData.name}
          periodLabel={currentPeriodObj?.label || selectedPeriod}
          onClose={() => setRandomProblem(null)}
          onPickAnother={handlePickRandom}
        />
      )}
    </div>
  );
}
