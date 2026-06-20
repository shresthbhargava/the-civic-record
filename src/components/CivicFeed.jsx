import React from 'react';
import './CivicFeed.css';
import { getTranslation } from '../i18n';

export default function CivicFeed({ activeState, lang }) {
  const allNews = [
    {
      category: "RTI Disclosure",
      title: "MUNICIPAL CORPORATION RELEASES CLASSIFIED ZONING MAPS FOLLOWING APPEAL",
      content: "After a six-month legal battle, local activists have successfully obtained the unredacted zoning maps for the proposed industrial park.",
      source: "RTI Tribunal Order #442",
      date: "2 Hours Ago",
      stamp: "BREAKING NEWS",
      stampClass: "stamp-red",
      state: "Maharashtra"
    },
    {
      category: "Audit Report",
      title: "THE SILENT COST OF DEFERRED MAINTENANCE",
      content: "An analysis of the latest municipal budget shows a 15% reduction in maintenance allocations, leading to critical infrastructure failures.",
      source: "Civic Record Investigative Unit",
      date: "5 Hours Ago",
      stamp: "INVESTIGATION",
      stampClass: "stamp-blue",
      state: "Delhi"
    },
    {
      category: "Policy Update",
      title: "NEW EDUCATION DIRECTIVES ISSUED FOR RURAL DISTRICTS",
      content: "The state education board has mandated digital literacy programs for all primary schools starting next academic year.",
      source: "State Education Board",
      date: "1 Day Ago",
      stamp: "EDITORIAL",
      stampClass: "stamp-red",
      state: "Uttar Pradesh"
    }
  ];

  const newsItems = activeState 
    ? allNews.filter(n => n.state === activeState)
    : allNews;

  return (
    <section className="feed-section" style={{ breakInside: 'avoid' }}>
      <div className="section-flag">{getTranslation(lang, 'latestDispatches')}</div>
      
      <div className="dispatch-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div className="primary-dispatches border-right-thin">
          {newsItems.length > 0 ? newsItems.map((item, idx) => (
            <div className={`dispatch-article ${idx !== newsItems.length - 1 ? 'border-bottom-thin' : ''}`} style={{marginBottom: idx !== newsItems.length - 1 ? '32px' : '0', position: 'relative'}} key={idx}>
              
              {item.stamp && (
                <div className={`vintage-stamp ${item.stampClass}`} style={{ position: 'absolute', top: 0, right: 0, fontSize: '0.8rem' }}>
                  {item.stamp}
                </div>
              )}

              <span className="dispatch-category" style={{fontFamily: 'Playfair Display SC', fontWeight: 'bold'}}>{item.category}</span>
              <h3 className="dispatch-title" style={{ fontFamily: 'Playfair Display SC', fontSize: '2rem', lineHeight: '1', margin: '8px 0 16px 0' }}>{item.title}</h3>
              <p className="dispatch-content">{item.content}</p>
              <div className="dispatch-meta" style={{ marginTop: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                <span className="dispatch-source">Source: {item.source}</span> &bull; <span className="dispatch-date">{item.date}</span>
              </div>
            </div>
          )) : (
             <p style={{fontStyle: 'italic'}}>No recent dispatches for this region.</p>
          )}
        </div>

        <div className="dispatch-sidebar">
          <div className="sidebar-wire">
            <h4 style={{fontFamily: 'Playfair Display SC', fontSize: '1.5rem', marginBottom: '16px', borderBottom: '2px solid var(--border-color)'}}>THE TELEGRAPH WIRE</h4>
            <ul className="wire-list" style={{ listStyle: 'none', padding: 0 }}>
              <li style={{ marginBottom: '16px' }}>
                <span className="time" style={{fontFamily: 'monospace', fontWeight: 'bold'}}>14:00</span>
                <p>Finance Ministry announces revised GST slabs for public works contractors.</p>
              </li>
              <li style={{ marginBottom: '16px' }}>
                <span className="time" style={{fontFamily: 'monospace', fontWeight: 'bold'}}>11:30</span>
                <p>High Court stays demolition of heritage market complex pending review.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
