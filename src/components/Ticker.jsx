import React, { useState, useEffect } from 'react';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function Ticker() {
    const [headlines, setHeadlines] = useState([]);

    useEffect(() => {
        fetch(`${API_BASE}/api/v1/news/latest`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.data) {
                    setHeadlines(data.data.map(article => article.title));
                }
            })
            .catch(err => console.warn('Ticker fetch failed:', err));
    }, []);

    // While loading (or if the fetch fails), show nothing rather than
    // fabricated headlines - an empty ticker is honest, fake news isn't.
    if (headlines.length === 0) {
        return null;
    }

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
                    <span key={'dup-' + idx}>
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