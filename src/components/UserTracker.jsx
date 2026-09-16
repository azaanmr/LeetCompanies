import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BarChart3, 
  CheckCircle2, 
  Star, 
  FileText, 
  Download, 
  Upload, 
  ExternalLink, 
  Trash2, 
  Sparkles,
  Trophy,
  Flame
} from 'lucide-react';

export default function UserTracker() {
  const {
    solvedMap,
    toggleSolved,
    bookmarkMap,
    toggleBookmark,
    notesMap,
    setProblemNote,
    solvedCount,
    bookmarkedCount,
  } = useApp();

  const [globalProblems, setGlobalProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('starred'); // 'starred' | 'notes' | 'solved'

  useEffect(() => {
    fetch('./data/global_problems.json')
      .then((res) => res.json())
      .then((data) => setGlobalProblems(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const probMap = useMemo(() => {
    const map = new Map();
    globalProblems.forEach((p) => map.set(p.slug, p));
    return map;
  }, [globalProblems]);

  // Solved difficulty breakdown
  const solvedBreakdown = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    Object.keys(solvedMap).forEach((slug) => {
      const prob = probMap.get(slug);
      if (prob) {
        if (prob.difficulty === 'EASY') easy++;
        else if (prob.difficulty === 'MEDIUM') medium++;
        else if (prob.difficulty === 'HARD') hard++;
      } else {
        medium++; // fallback
      }
    });
    return { easy, medium, hard };
  }, [solvedMap, probMap]);

  // Starred problems list
  const starredList = useMemo(() => {
    return Object.keys(bookmarkMap)
      .map((slug) => probMap.get(slug) || { slug, title: slug, difficulty: 'MEDIUM', link: `https://leetcode.com/problems/${slug}/` });
  }, [bookmarkMap, probMap]);

  // Solved problems list
  const solvedList = useMemo(() => {
    return Object.keys(solvedMap)
      .map((slug) => probMap.get(slug) || { slug, title: slug, difficulty: 'MEDIUM', link: `https://leetcode.com/problems/${slug}/` });
  }, [solvedMap, probMap]);

  // Notes list
  const notesList = useMemo(() => {
    return Object.entries(notesMap).map(([slug, note]) => {
      const prob = probMap.get(slug) || { slug, title: slug, difficulty: 'MEDIUM', link: `https://leetcode.com/problems/${slug}/` };
      return { prob, note, slug };
    });
  }, [notesMap, probMap]);

  // Export Backup
  const handleExportBackup = () => {
    const backupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      solved: solvedMap,
      bookmarks: bookmarkMap,
      notes: notesMap,
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `leetcode_prep_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Import Backup
  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.solved) localStorage.setItem('lc_explorer_solved', JSON.stringify(json.solved));
        if (json.bookmarks) localStorage.setItem('lc_explorer_bookmarks', JSON.stringify(json.bookmarks));
        if (json.notes) localStorage.setItem('lc_explorer_notes', JSON.stringify(json.notes));
        window.location.reload();
      } catch (err) {
        alert('Invalid backup file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      {/* Header */}
      <section className="hero-header">
        <div className="hero-title-row">
          <div className="hero-main">
            <h1>Interview Preparation Tracker</h1>
            <p className="hero-subtitle">
              Monitor your problem-solving milestones, review starred questions, and manage notes across all companies.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <button className="action-btn-secondary" onClick={handleExportBackup}>
              <Download size={15} />
              <span>Export Progress</span>
            </button>
            <label className="action-btn-secondary" style={{ cursor: 'pointer' }}>
              <Upload size={15} />
              <span>Import Progress</span>
              <input type="file" accept=".json" onChange={handleImportBackup} style={{ display: 'none' }} />
            </label>
          </div>
        </div>
      </section>

      {/* Progress Stats Summary */}
      <div className="detail-metrics-row" style={{ marginBottom: '2rem' }}>
        <div className="detail-metric-card" style={{ background: 'var(--bg-secondary)' }}>
          <span className="detail-metric-val">{solvedCount}</span>
          <span className="detail-metric-lbl">Total Solved</span>
        </div>
        <div className="detail-metric-card" style={{ background: 'var(--bg-secondary)' }}>
          <span className="detail-metric-val easy">{solvedBreakdown.easy}</span>
          <span className="detail-metric-lbl">Easy Solved</span>
        </div>
        <div className="detail-metric-card" style={{ background: 'var(--bg-secondary)' }}>
          <span className="detail-metric-val medium">{solvedBreakdown.medium}</span>
          <span className="detail-metric-lbl">Medium Solved</span>
        </div>
        <div className="detail-metric-card" style={{ background: 'var(--bg-secondary)' }}>
          <span className="detail-metric-val hard">{solvedBreakdown.hard}</span>
          <span className="detail-metric-lbl">Hard Solved</span>
        </div>
      </div>

      {/* Section Tabs */}
      <div className="timeframe-bar">
        <button
          className={`timeframe-tab ${activeTab === 'starred' ? 'active' : ''}`}
          onClick={() => setActiveTab('starred')}
        >
          <Star size={15} fill={activeTab === 'starred' ? 'none' : 'currentColor'} />
          <span>Starred for Revision</span>
          <span className="timeframe-count-badge">{bookmarkedCount}</span>
        </button>

        <button
          className={`timeframe-tab ${activeTab === 'notes' ? 'active' : ''}`}
          onClick={() => setActiveTab('notes')}
        >
          <FileText size={15} />
          <span>My Notes</span>
          <span className="timeframe-count-badge">{notesList.length}</span>
        </button>

        <button
          className={`timeframe-tab ${activeTab === 'solved' ? 'active' : ''}`}
          onClick={() => setActiveTab('solved')}
        >
          <CheckCircle2 size={15} />
          <span>Solved History</span>
          <span className="timeframe-count-badge">{solvedCount}</span>
        </button>
      </div>

      {/* Starred Tab Content */}
      {activeTab === 'starred' && (
        <div>
          {starredList.length > 0 ? (
            <div className="table-container">
              <table className="problem-table">
                <thead>
                  <tr>
                    <th className="status-col">Status</th>
                    <th>Problem Title</th>
                    <th style={{ width: '120px' }}>Difficulty</th>
                    <th style={{ width: '100px', textAlign: 'center' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {starredList.map((prob) => {
                    const isSolved = !!solvedMap[prob.slug];
                    return (
                      <tr key={prob.slug}>
                        <td className="status-col">
                          <button
                            className="table-action-btn"
                            onClick={() => toggleSolved(prob.slug)}
                          >
                            {isSolved ? (
                              <CheckCircle2 size={18} color="var(--status-solved)" />
                            ) : (
                              <Circle size={18} />
                            )}
                          </button>
                        </td>
                        <td>
                          <a
                            href={prob.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="problem-title-link"
                          >
                            <span style={{ textDecoration: isSolved ? 'line-through' : 'none' }}>
                              {prob.title}
                            </span>
                            <ExternalLink size={13} style={{ opacity: 0.5 }} />
                          </a>
                        </td>
                        <td>
                          <span className={`diff-badge ${prob.difficulty}`}>
                            {prob.difficulty}
                          </span>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <button
                            className="table-action-btn"
                            onClick={() => toggleBookmark(prob.slug)}
                            title="Remove from starred"
                          >
                            <Trash2 size={16} color="var(--diff-hard)" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Star size={38} className="empty-state-icon" />
              <h3>No starred problems yet</h3>
              <p>Click the star icon next to any problem in company sheets to review later.</p>
            </div>
          )}
        </div>
      )}

      {/* Notes Tab Content */}
      {activeTab === 'notes' && (
        <div>
          {notesList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1rem' }}>
              {notesList.map(({ prob, note, slug }) => (
                <div key={slug} className="company-card" style={{ cursor: 'default' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
                    <a
                      href={prob.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="problem-title-link"
                      style={{ fontSize: '1rem' }}
                    >
                      {prob.title}
                      <ExternalLink size={13} style={{ opacity: 0.5 }} />
                    </a>
                    <button
                      className="table-action-btn"
                      onClick={() => setProblemNote(slug, '')}
                      title="Delete Note"
                    >
                      <Trash2 size={15} color="var(--diff-hard)" />
                    </button>
                  </div>

                  <div style={{ background: 'var(--bg-tertiary)', padding: '0.75rem', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
                    {note}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <FileText size={38} className="empty-state-icon" />
              <h3>No question notes saved</h3>
              <p>Add notes on time complexities, hints, or edge cases while browsing questions.</p>
            </div>
          )}
        </div>
      )}

      {/* Solved History Tab Content */}
      {activeTab === 'solved' && (
        <div>
          {solvedList.length > 0 ? (
            <div className="table-container">
              <table className="problem-table">
                <thead>
                  <tr>
                    <th className="status-col">Solved</th>
                    <th>Problem Title</th>
                    <th style={{ width: '120px' }}>Difficulty</th>
                  </tr>
                </thead>
                <tbody>
                  {solvedList.map((prob) => (
                    <tr key={prob.slug}>
                      <td className="status-col">
                        <CheckCircle2 size={18} color="var(--status-solved)" />
                      </td>
                      <td>
                        <a
                          href={prob.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="problem-title-link"
                        >
                          <span>{prob.title}</span>
                          <ExternalLink size={13} style={{ opacity: 0.5 }} />
                        </a>
                      </td>
                      <td>
                        <span className={`diff-badge ${prob.difficulty}`}>
                          {prob.difficulty}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <Trophy size={38} className="empty-state-icon" />
              <h3>No solved problems recorded</h3>
              <p>Check off problems as you solve them to track your interview prep progress!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
