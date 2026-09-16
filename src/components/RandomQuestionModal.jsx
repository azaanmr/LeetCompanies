import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Shuffle, 
  ExternalLink, 
  CheckCircle2, 
  Star, 
  Sparkles,
  Flame
} from 'lucide-react';

export default function RandomQuestionModal({
  problem,
  companyName,
  periodLabel,
  onClose,
  onPickAnother,
}) {
  const { solvedMap, toggleSolved, bookmarkMap, toggleBookmark } = useApp();

  if (!problem) return null;

  const isSolved = !!solvedMap[problem.slug];
  const isBookmarked = !!bookmarkMap[problem.slug];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
        <button className="modal-close-btn" onClick={onClose} title="Close">
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Sparkles size={20} color="var(--accent-lc)" />
          <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--accent-lc)', fontWeight: 700 }}>
            Mock Interview Challenge
          </span>
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem', lineHeight: 1.3 }}>
          {problem.title}
        </h2>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <span className={`diff-badge ${problem.difficulty}`}>
            {problem.difficulty}
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Asked at <strong>{companyName}</strong> ({periodLabel})
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            • Frequency: <strong>{problem.frequency}%</strong>
          </span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            • Acceptance: <strong>{problem.acceptanceRate}</strong>
          </span>
        </div>

        {/* Topics */}
        {problem.topics && problem.topics.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>
              Related Algorithms & Data Structures:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {problem.topics.map((t) => (
                <span key={t} className="tag-pill">{t}</span>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', paddingTop: '1.25rem', borderTop: '1px solid var(--border-subtle)', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              className={`action-btn-secondary ${isSolved ? 'solved' : ''}`}
              onClick={() => toggleSolved(problem.slug)}
            >
              <CheckCircle2 size={16} color={isSolved ? 'var(--status-solved)' : 'currentColor'} />
              <span>{isSolved ? 'Solved' : 'Mark Solved'}</span>
            </button>

            <button
              className={`action-btn-secondary ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={() => toggleBookmark(problem.slug)}
            >
              <Star size={16} fill={isBookmarked ? 'var(--status-bookmarked)' : 'none'} color={isBookmarked ? 'var(--status-bookmarked)' : 'currentColor'} />
              <span>{isBookmarked ? 'Starred' : 'Star'}</span>
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              className="action-btn-secondary"
              onClick={onPickAnother}
              title="Pick a different question"
            >
              <Shuffle size={15} />
              <span>Pick Another</span>
            </button>

            <a
              href={problem.link}
              target="_blank"
              rel="noopener noreferrer"
              className="action-btn-primary"
            >
              <span>Open LeetCode</span>
              <ExternalLink size={15} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
