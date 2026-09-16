import React, { useState } from 'react';

export default function CompanyLogo({
  slug,
  name,
  size = 40,
  fontSize = '1.1rem',
  className = '',
  style = {},
}) {
  const [imgError, setImgError] = useState(false);
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (!imgError && slug) {
    return (
      <div
        className={`company-avatar ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          padding: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-tertiary)',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          flexShrink: 0,
          ...style,
        }}
      >
        <img
          src={`./company_logos/${slug}.svg`}
          alt={name}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`company-avatar ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        fontSize: fontSize,
        fontWeight: 800,
        color: 'var(--accent-lc)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-md)',
        border: '1px solid var(--border-subtle)',
        flexShrink: 0,
        ...style,
      }}
    >
      {initial}
    </div>
  );
}
