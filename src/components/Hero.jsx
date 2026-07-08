import React, { useState, useEffect } from 'react';
import IndiaMap from './IndiaMap';
import './Hero.css';
import { getTranslation } from '../i18n';
import ComplaintTracker from './ComplaintTracker';


export default function Hero({ activeState, onStateSelect, lang, onSearch }) {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const hindiDate = "१४ कार्तिक, शक संवत १९४८";
  const [query, setQuery] = useState('');
  const [todaysEdition, setTodaysEdition] = useState(null);
  const [showTracker, setShowTracker] = useState(false);
  {showTracker && <ComplaintTracker onClose={() => setShowTracker(false)} />}

  const tags = ["[Exam Leak]", "[Water Supply]", "[Road Projects]", "[State Debt]", "[Food Safety]"];
  useEffect(() => {
    fetch('https://civicos-r2sf.onrender.com/api/v1/news/edition/today')
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) setTodaysEdition(data.data);
        })
        .catch(err => console.warn('Edition fetch failed:', err));
  }, []);
  return (
    <header className="newspaper-hero">
      <div className="masthead-section border-bottom-thick">
        <div className="masthead-top-strip">
          <span className="dateline">{today}</span>
          <span className="hindi-text" style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{hindiDate}</span>
          <span className="edition">National Edition &bull; Vol. 1</span>
        </div>

        <h1 className="masthead-title" onClick={() => onStateSelect(null)} style={{ cursor: 'var(--cursor-stamp)' }}>THE CIVIC RECORD</h1>
        <h2 className="masthead-tagline hindi-text">{getTranslation(lang, 'tagline')}</h2>

        <div className="masthead-bottom-strip border-top-thick">
          <span className="motto" style={{ fontFamily: 'Playfair Display', fontStyle: 'italic' }}>Printed and Verified.</span>
          <span className="price">Established 2026</span>
        </div>
      </div>

      {!activeState ? (
        <div className="map-hero-section">

          <div className="search-section" style={{ marginBottom: '40px' }}>
            <div className="search-input-wrapper">
              <input
                type="text"
                className="newspaper-search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && onSearch?.(query)}
                placeholder={getTranslation(lang, 'searchPlaceholderNat')}
              />
              <button className="search-btn" onClick={() => onSearch?.(query)}>{getTranslation(lang, 'searchBtn')}</button>
              <button
                  className="search-btn"
                  style={{ marginLeft: '12px', background: 'var(--accent-color)' }}
                  onClick={() => setShowTracker(true)}
              >
                📋 TRACK COMPLAINT
              </button>
            </div>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              {tags.map(tag => (
                <span 
                  key={tag} 
                  onClick={() => {
                    const tagVal = tag.replace(/\[|\]/g, '');
                    setQuery(tagVal);
                    onSearch?.(tagVal);
                  }}
                  style={{ fontFamily: 'monospace', fontSize: '0.9rem', color: 'var(--text-secondary)', cursor: 'var(--cursor-pointer)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          {todaysEdition && (
              <div style={{
                margin: '0 auto 40px',
                maxWidth: '700px',
                padding: '20px 24px',
                borderTop: '4px double var(--border-color)',
                borderBottom: '4px double var(--border-color)',
                textAlign: 'center'
              }}>
              <span style={{
                fontFamily: 'Playfair Display SC',
                fontSize: '0.8rem',
                letterSpacing: '0.2em',
                color: 'var(--text-secondary)'
              }}>
                TODAY'S FRONT PAGE — {new Date(todaysEdition.editionDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
                <h2 style={{
                  fontFamily: 'Playfair Display SC',
                  fontSize: '2.5rem',
                  lineHeight: '1.1',
                  margin: '8px 0',
                  color: 'var(--text-primary)'
                }}>
                  {todaysEdition.headline}
                </h2>
                {todaysEdition.stories?.[0]?.sourceName && (
                    <span style={{ fontFamily: 'Lora', fontStyle: 'italic', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  — {todaysEdition.stories[0].sourceName}
                </span>
                )}
              </div>
          )}

          <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '8px' }}>Explore The Nation</h2>
          <IndiaMap onStateSelect={onStateSelect} />
        </div>
      ) : (
        <div className="state-transition-hero" style={{ textAlign: 'center', padding: '64px 0' }}>
          <h2 className="typeset-column" style={{ fontSize: '4.5rem', marginBottom: '24px', textShadow: '2px 2px 4px rgba(0,0,0,0.1)', color: 'var(--text-primary)', background: 'rgba(245, 240, 232, 0.8)', display: 'inline-block', padding: '0 16px' }}>
            YOU HAVE ARRIVED IN {activeState.toUpperCase()}
          </h2>

          <div className="search-input-wrapper typeset-column" style={{ animationDelay: '0.4s', marginTop: '24px' }}>
            <input
              type="text"
              className="newspaper-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearch?.(query)}
              placeholder={getTranslation(lang, 'searchPlaceholderState', { state: activeState })}
            />
            <button className="search-btn" onClick={() => onSearch?.(query)}>
              {getTranslation(lang, 'searchBtn')}
            </button>
            <button
                className="search-btn"
                style={{ marginLeft: '12px', background: 'var(--accent-color)' }}
                onClick={() => setShowTracker(true)}
            >
              📋 TRACK COMPLAINT
            </button>
          </div>

        </div>
      )}
    </header>
  );
}
