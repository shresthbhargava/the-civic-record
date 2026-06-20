import React from 'react';

export default function Ticker() {
  const headlines = [
    "Supreme Court mandates full disclosure of electoral bonds by Thursday",
    "CAG audit reveals ₹14,000 Cr shortfall in state infrastructure spending",
    "New RBI guidelines aim to boost municipal bond liquidity",
    "RTI query exposes severe delays in Jal Jeevan Mission execution in 3 states",
    "Parliament standing committee reviews National Highway land acquisition compensation"
  ];

  return (
    <div style={{
      backgroundColor: 'transparent',
      color: 'var(--text-primary)',
      padding: '8px 0',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
      position: 'relative',
      fontFamily: 'Lora, serif',
      fontSize: '0.9rem',
      fontWeight: '600',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      borderBottom: '4px double var(--border-color)',
      borderTop: '4px double var(--border-color)'
    }}>
      <div style={{
        display: 'inline-block',
        animation: 'marquee 30s linear infinite'
      }}>
        {headlines.map((headline, idx) => (
          <span key={idx}>
            {headline} <span style={{ color: 'var(--text-primary)', margin: '0 16px', fontWeight: 'bold' }}>&diams;</span>
          </span>
        ))}
        {/* Duplicate for seamless scrolling */}
        {headlines.map((headline, idx) => (
          <span key={'dup-'+idx}>
            {headline} <span style={{ color: 'var(--text-primary)', margin: '0 16px', fontWeight: 'bold' }}>&diams;</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
