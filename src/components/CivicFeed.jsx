import React, { useState, useEffect } from 'react';
import './CivicFeed.css';
import { getTranslation } from '../i18n';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function CivicFeed({ activeState, lang }) {
  const [newsItems, setNewsItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/news/latest`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.data) {
            setNewsItems(data.data);
          }
        })
        .catch(err => console.warn('News fetch failed:', err))
        .finally(() => setLoading(false));
  }, []);

  const getStamp = (category) => {
    if (!category) return { label: 'UPDATE', cls: 'stamp-blue' };
    const c = category.toLowerCase();
    if (c.includes('rti') || c.includes('breaking')) return { label: 'BREAKING NEWS', cls: 'stamp-red' };
    if (c.includes('audit') || c.includes('investigation')) return { label: 'INVESTIGATION', cls: 'stamp-blue' };
    return { label: 'EDITORIAL', cls: 'stamp-red' };
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000 / 60 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 24) return `${diff} Hours Ago`;
    return `${Math.floor(diff / 24)} Days Ago`;
  };

  const primaryNews = newsItems.slice(0, 3);
  const wireNews = newsItems.slice(3, 7);

  return (
      <section className="feed-section" style={{ breakInside: 'avoid' }}>
        <div className="section-flag">{getTranslation(lang, 'latestDispatches')}</div>

        <div className="dispatch-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
          <div className="primary-dispatches border-right-thin">
            {loading && (
                <p style={{ fontStyle: 'italic', fontFamily: 'Lora' }}>Loading latest dispatches...</p>
            )}

            {!loading && primaryNews.length === 0 && (
                <p style={{ fontStyle: 'italic', fontFamily: 'Lora' }}>No recent dispatches.</p>
            )}

            {primaryNews.map((item, idx) => {
              const stamp = getStamp(item.category);
              return (
                  <div
                      className={`dispatch-article ${idx !== primaryNews.length - 1 ? 'border-bottom-thin' : ''}`}
                      style={{ marginBottom: idx !== primaryNews.length - 1 ? '32px' : '0', position: 'relative' }}
                      key={item.id}
                  >
                    <div className={`vintage-stamp ${stamp.cls}`} style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.8rem' }}>
                      {stamp.label}
                    </div>

                    <span className="dispatch-category" style={{ fontFamily: 'Playfair Display SC', fontWeight: 'bold' }}>
                  {item.category?.toUpperCase() || 'CIVIC NEWS'}
                </span>

                    <h3 className="dispatch-title" style={{ fontFamily: 'Playfair Display SC', fontSize: '2rem', lineHeight: '1', margin: '8px 0 16px 0' }}>
                      {item.title?.toUpperCase()}
                    </h3>

                    <p className="dispatch-content" style={{ fontFamily: 'Lora' }}>
                      {item.description || 'Read the full story at the source.'}
                    </p>

                    <div className="dispatch-meta" style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <span className="dispatch-source">Source: {item.sourceName}</span>
                      {' '}&bull;{' '}
                      <span className="dispatch-date">{formatDate(item.publishedAt)}</span>
                      {item.sourceUrl && (
                          <>
                            {' '}&bull;{' '}
                            <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-gold)' }}>
                              Read Full Document →
                            </a>
                          </>
                      )}
                    </div>
                  </div>
              );
            })}
          </div>

          <div className="dispatch-sidebar">
            <div className="sidebar-wire">
              <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1.5rem', marginBottom: '16px', borderBottom: '2px solid var(--border-color)' }}>
                THE TELEGRAPH WIRE
              </h4>
              <ul className="wire-list" style={{ listStyle: 'none', padding: 0 }}>
                {wireNews.length > 0 ? wireNews.map((item) => (
                    <li key={item.id} style={{ marginBottom: '16px' }}>
                  <span className="time" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                    {item.publishedAt ? new Date(item.publishedAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''}
                  </span>
                      <p style={{ fontFamily: 'Lora', fontSize: '0.9rem', marginTop: '4px' }}>
                        {item.title?.length > 80 ? item.title.substring(0, 80) + '...' : item.title}
                      </p>
                    </li>
                )) : (
                    <>
                      <li style={{ marginBottom: '16px' }}>
                        <span className="time" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>14:00</span>
                        <p>Finance Ministry announces revised GST slabs for public works contractors.</p>
                      </li>
                      <li style={{ marginBottom: '16px' }}>
                        <span className="time" style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>11:30</span>
                        <p>High Court stays demolition of heritage market complex pending review.</p>
                      </li>
                    </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </section>
  );
}