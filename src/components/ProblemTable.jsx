import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  CheckCircle2, 
  Circle, 
  Star, 
  ExternalLink, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  FileText,
  HelpCircle,
  X
} from 'lucide-react';

export default function ProblemTable({
  problems = [],
  sortField,
  sortOrder,
  onSortChange,
}) {
  const {
    solvedMap,
    toggleSolved,
    bookmarkMap,
    toggleBookmark,
    notesMap,
    setProblemNote,
  } = useApp();

  const [activeNoteSlug, setActiveNoteSlug] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const openNoteModal = (slug) => {
    setActiveNoteSlug(slug);
    setNoteText(notesMap[slug] || '');
  };

  const saveCurrentNote = () => {
    if (activeNoteSlug) {
      setProblemNote(activeNoteSlug, noteText);
      setActiveNoteSlug(null);
    }
  };
  const totalPages = Math.ceil(problems.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedProblems = problems.slice(startIndex, startIndex + pageSize);

  const handleSort = (field) => {
    if (sortField === field) {
      onSortChange(field, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(field, 'desc');
    }
  };

  const renderSortIcon = (field) => {
    if (sortField !== field) return <ArrowUpDown size={13} style={{ opacity: 0.4 }} />;
    return sortOrder === 'asc' ? <ArrowUp size={13} /> : <ArrowDown size={13} />;
  };

  if (problems.length === 0) {
    return (
      <div className="table-container">
        <div className="empty-state">
          <HelpCircle size={38} className="empty-state-icon" />
          <h3>No matching questions found</h3>
          <p>Try resetting filters or adjusting search keywords.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="problem-table">
        <thead>
          <tr>
            <th className="status-col">Status</th>
            <th className="sortable" onClick={() => handleSort('title')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Problem Title</span>
                {renderSortIcon('title')}
              </div>
            </th>
            <th className="sortable" style={{ width: '110px' }} onClick={() => handleSort('difficulty')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Difficulty</span>
                {renderSortIcon('difficulty')}
              </div>
            </th>
            <th>Topics</th>
            <th className="sortable" style={{ width: '120px' }} onClick={() => handleSort('acceptanceRate')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Acceptance</span>
                {renderSortIcon('acceptanceRate')}
              </div>
            </th>
            <th className="sortable" style={{ width: '160px' }} onClick={() => handleSort('frequency')}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <span>Frequency</span>
                {renderSortIcon('frequency')}
              </div>
            </th>
            <th style={{ width: '80px', textAlign: 'center' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedProblems.map((prob, idx) => {
            const isSolved = !!solvedMap[prob.slug];
            const isBookmarked = !!bookmarkMap[prob.slug];
            const hasNote = !!notesMap[prob.slug];
            const freqVal = typeof prob.frequency === 'number' ? prob.frequency : 0;

            return (
              <tr key={prob.slug || `${prob.title}-${idx}`}>
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
                <td>
                  <a
                    href={prob.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="problem-title-link"
                    title="Open on LeetCode"
                  >
                    <span style={{ textDecoration: isSolved ? 'line-through' : 'none', opacity: isSolved ? 0.7 : 1 }}>
                      {prob.title}
                    </span>
                    <ExternalLink size={13} style={{ opacity: 0.5, flexShrink: 0 }} />
                  </a>
                </td>
                <td>
                  <span className={`diff-badge ${prob.difficulty}`}>
                    {prob.difficulty}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', maxWidth: '380px' }}>
                    {prob.topics && prob.topics.length > 0 ? (
                      prob.topics.slice(0, 3).map((topic) => (
                        <span key={topic} className="tag-pill">
                          {topic}
                        </span>
                      ))
                    ) : (
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>-</span>
                    )}
                    {prob.topics && prob.topics.length > 3 && (
                      <span className="tag-pill">+{prob.topics.length - 3}</span>
                    )}
                  </div>
                </td>
                <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                  {prob.acceptanceRate || '50.0%'}
                </td>
                <td>
                  <div className="freq-cell">
                    <span className="freq-val">{freqVal}%</span>
                    <div className="freq-track">
                      <div
                        className="freq-fill"
                        style={{ width: `${Math.min(100, Math.max(5, freqVal))}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                    <button
                      className={`table-action-btn ${isBookmarked ? 'bookmarked' : ''}`}
                      onClick={() => toggleBookmark(prob.slug)}
                      title={isBookmarked ? 'Remove Star' : 'Star for Revision'}
                    >
                      <Star size={16} fill={isBookmarked ? 'var(--status-bookmarked)' : 'none'} />
                    </button>

                    <button
                      className="table-action-btn"
                      style={{ color: hasNote ? 'var(--accent-lc)' : undefined }}
                      onClick={() => openNoteModal(prob.slug)}
                      title={hasNote ? 'Edit Note' : 'Add Note'}
                    >
                      <FileText size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
          <span>
            Showing <strong>{startIndex + 1}</strong> -{' '}
            <strong>{Math.min(startIndex + pageSize, problems.length)}</strong> of{' '}
            <strong>{problems.length}</strong> questions
          </span>

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.2rem 0.5rem',
              fontSize: '0.8rem',
            }}
          >
            <option value="25">25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="pagination-btn"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', padding: '0 0.4rem' }}>
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      </div>
      {activeNoteSlug && (
        <div className="modal-overlay" onClick={() => setActiveNoteSlug(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveNoteSlug(null)}>
              <X size={18} />
            </button>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>Personal Question Notes</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Add hints, time/space complexity notes, or review reminders for this question.
            </p>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Remember to handle edge cases with empty strings. O(N) time with Two Pointers..."
              rows={5}
              style={{
                width: '100%',
                padding: '0.75rem',
                background: 'var(--bg-input)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.875rem',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '1.25rem',
              }}
              autoFocus
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="action-btn-secondary"
                onClick={() => setActiveNoteSlug(null)}
              >
                Cancel
              </button>
              <button
                className="action-btn-primary"
                onClick={saveCurrentNote}
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
