import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import RtiModal from './RtiModal';
import ShareCard from './ShareCard';
import './AccountabilitySearch.css';
import { getTranslation } from '../i18n';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function AccountabilitySearch({ activeState, lang }) {
  const [modalData, setModalData] = useState(null);
  const [isTypesetting, setIsTypesetting] = useState(false);
  const [isRtiOpen, setIsRtiOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);

  const stateCodeMap = {
    'Maharashtra': 'MH', 'Delhi': 'DL', 'Karnataka': 'KA',
    'Tamil Nadu': 'TN', 'Uttar Pradesh': 'UP', 'Bihar': 'BR',
    'Gujarat': 'GJ', 'Rajasthan': 'RJ', 'West Bengal': 'WB',
    'Punjab': 'PB', 'Haryana': 'HR', 'Madhya Pradesh': 'MP',
    'Andhra Pradesh': 'AP', 'Telangana': 'TG', 'Kerala': 'KL',
    'Odisha': 'OR', 'Jharkhand': 'JH', 'Assam': 'AS',
    'Chhattisgarh': 'CG', 'Uttarakhand': 'UK', 'Himachal Pradesh': 'HP',
    'Goa': 'GA', 'Jammu & Kashmir': 'JK', 'Manipur': 'MN',
    'Meghalaya': 'ML', 'Nagaland': 'NL', 'Tripura': 'TR',
    'Arunachal Pradesh': 'AR', 'Mizoram': 'MZ', 'Sikkim': 'SK',
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    setError(null);
    setNoResults(false);
    setSearchData(null);
    setIsTypesetting(true);

    try {
      const stateCode = activeState ? (stateCodeMap[activeState] || '') : '';
      const url = `${API_BASE}/api/v1/incidents/search?query=${encodeURIComponent(searchQuery)}${stateCode ? `&stateCode=${stateCode}` : ''}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');

      const data = await response.json();

      if (!data.data?.matches || data.data.matches.length === 0) {
        setNoResults(true);
      } else {
        const match = data.data.matches[0];
        setSearchData({
          headline: `${match.categoryName.toUpperCase()} — ${match.responsibleDepartment.name.toUpperCase()}`,
          department: match.responsibleDepartment.name,
          jurisdiction: match.responsibleDepartment.jurisdictionLevel,
          score: 'B+',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          chain: match.accountabilityChain.map(node => ({
            role: node.jurisdictionLevel,
            name: node.name,
            bio: node.ministry || ''
          })),
          official: match.responsibleDepartment.currentOfficials?.[0] ? {
            name: match.responsibleDepartment.currentOfficials[0].fullName,
            title: match.responsibleDepartment.currentOfficials[0].postingTitle,
            contact: match.responsibleDepartment.currentOfficials[0].contactEmail,
            since: match.responsibleDepartment.currentOfficials[0].startDate,
          } : null,
          actions: match.citizenActions,
          acts: match.relevantActs,
          matchedKeywords: match.matchedKeywords,
        });
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSearching(false);
      setTimeout(() => setIsTypesetting(false), 1200);
    }
  };

  const handleStampClick = (e, callback) => {
    e.currentTarget.classList.add('stamp-press-anim');
    setTimeout(() => {
      e.currentTarget.classList.remove('stamp-press-anim');
      callback();
    }, 200);
  };

  const data = searchData;

  return (
    <section className="editorial-story" style={{ position: 'relative' }}>
      <div className="section-flag">{getTranslation(lang, 'deepDive')}</div>

      {/* Search Bar */}
      <div style={{ marginBottom: '32px', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={activeState ? `Search accountability in ${activeState}...` : "Search any civic issue, department, or official..."}
          style={{
            flex: 1,
            padding: '12px 16px',
            fontFamily: 'Lora, serif',
            fontSize: '1.1rem',
            border: '2px solid var(--border-color)',
            background: 'transparent',
            outline: 'none',
          }}
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="vintage-stamp stamp-blue"
          style={{ padding: '12px 24px', background: 'transparent', whiteSpace: 'nowrap' }}
        >
          {isSearching ? 'SEARCHING...' : 'SEARCH'}
        </button>
      </div>

      {/* Quick category chips */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '32px' }}>
        {['Exam Leak', 'Water Supply', 'Food Safety', 'Electricity', 'Health'].map(cat => (
          <button
            key={cat}
            onClick={() => { setSearchQuery(cat); }}
            style={{
              padding: '4px 12px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              fontFamily: 'Lora',
              fontSize: '0.85rem',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            [{cat}]
          </button>
        ))}
      </div>

      {/* Error state */}
      {error && (
        <div style={{ padding: '24px', border: '2px solid #8B0000', color: '#8B0000', fontFamily: 'Lora', marginBottom: '24px' }}>
          ⚠ {error}
        </div>
      )}

      {/* No results */}
      {noResults && (
        <div style={{ padding: '24px', border: '1px solid var(--border-color)', fontFamily: 'Lora', fontStyle: 'italic', marginBottom: '24px' }}>
          No records found for "{searchQuery}". Try different search terms.
        </div>
      )}

      {/* Empty state */}
      {!data && !noResults && !error && (
        <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          Search for any civic issue to see the full accountability record.
        </div>
      )}

      {/* Results */}
      {data && (
        <>
          <h3 className="story-headline" style={{ marginBottom: '24px', fontSize: '4.5rem', borderBottom: '6px solid var(--border-color)', paddingBottom: '16px' }}>
            {data.headline.split('').map((char, index) => (
              <span key={index} className="typeset-char" style={{ animationDelay: `${index * 0.02}s` }}>{char}</span>
            ))}
          </h3>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', marginBottom: '24px', fontFamily: 'Playfair Display SC', fontWeight: 'bold' }}>
            <span>BY CIVIC RECORD CORRESPONDENT</span>
            <span>{data.date}</span>
          </div>

          <div className={`four-column-grid ${isTypesetting ? 'slide-in-column' : ''}`}>

            {/* Department box */}
            <div style={{ marginBottom: '24px', padding: '16px', border: '2px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', breakInside: 'avoid' }}>
              <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1.2rem', marginBottom: '12px', borderBottom: '1px solid #1a1a1a' }}>RESPONSIBLE DEPARTMENT</h4>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Department:</span> <strong>{data.department}</strong>
              </p>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Jurisdiction:</span> <strong>{data.jurisdiction}</strong>
              </p>
              <p style={{ margin: '8px 0', display: 'flex', justifyContent: 'space-between' }}>
                <span>Grade:</span>
                <span className="vintage-stamp stamp-red" style={{ fontSize: '1.2rem', padding: '0 8px' }}>{data.score}</span>
              </p>
            </div>

            {/* Chain of Command */}
            <div style={{ marginBottom: '24px', breakInside: 'avoid' }}>
              <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>CHAIN OF COMMAND</h4>
              {data.chain.map((node, i) => (
                <div key={i} style={{ marginBottom: '12px', paddingLeft: '12px', borderLeft: '3px solid var(--border-color)' }}>
                  <div style={{ fontFamily: 'Playfair Display SC', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{node.role}</div>
                  <div style={{ fontWeight: 'bold', fontFamily: 'Lora' }}>{node.name}</div>
                </div>
              ))}
            </div>

            {/* Current Official */}
            {data.official && (
              <div style={{ marginBottom: '24px', padding: '16px', border: '2px solid var(--border-color)', background: 'rgba(0,0,0,0.02)', breakInside: 'avoid' }}>
                <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1rem', borderBottom: '1px solid #1a1a1a', paddingBottom: '8px', marginBottom: '12px' }}>CURRENTLY RESPONSIBLE</h4>
                <p style={{ fontWeight: 'bold', fontSize: '1.2rem', fontFamily: 'Playfair Display' }}>{data.official.name}</p>
                <p style={{ fontStyle: 'italic', fontFamily: 'Lora', fontSize: '0.9rem' }}>{data.official.title}</p>
                {data.official.contact && <p style={{ fontFamily: 'Lora', fontSize: '0.85rem', marginTop: '8px' }}>{data.official.contact}</p>}
                {data.official.since && <p style={{ fontFamily: 'Lora', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Since: {data.official.since}</p>}
              </div>
            )}

            {/* Citizen Actions */}
            {data.actions?.length > 0 && (
              <div style={{ marginBottom: '24px', breakInside: 'avoid' }}>
                <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>WHAT CITIZENS CAN DO</h4>
                <ul style={{ paddingLeft: '16px', fontFamily: 'Lora', lineHeight: '1.8' }}>
                  {data.actions.map((action, i) => <li key={i}>{action}</li>)}
                </ul>
              </div>
            )}

            {/* Relevant Acts */}
            {data.acts?.length > 0 && (
              <div style={{ marginBottom: '24px', breakInside: 'avoid' }}>
                <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', marginBottom: '12px' }}>LEGAL FRAMEWORK</h4>
                {data.acts.map((act, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <span style={{ fontFamily: 'Lora', fontWeight: 'bold' }}>{act.name}</span>
                    {act.year && <span style={{ fontFamily: 'Lora', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>, {act.year}</span>}
                    {act.officialUrl && (
                      <a href={act.officialUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: '8px', fontSize: '0.8rem', color: 'var(--accent-gold)' }}>→ Official Portal</a>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Action buttons */}
            <div style={{ breakInside: 'avoid' }}>
              <button
                className="vintage-stamp stamp-blue"
                style={{ width: '100%', marginBottom: '12px', textAlign: 'center', background: 'transparent' }}
                onClick={(e) => handleStampClick(e, () => setIsRtiOpen(true))}
              >
                GENERATE RTI FORM
              </button>
              <button
                className="vintage-stamp stamp-red"
                style={{ width: '100%', textAlign: 'center', background: 'transparent' }}
                onClick={(e) => handleStampClick(e, () => setIsShareCardOpen(true))}
              >
                SHARE CLIPPING
              </button>
            </div>
          </div>
        </>
      )}

      <Modal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.title} stampType={modalData?.stamp}>
        <p>{modalData?.content}</p>
      </Modal>
      {isRtiOpen && <RtiModal onClose={() => setIsRtiOpen(false)} department={data?.department} official={data?.official} />}
      {isShareCardOpen && <ShareCard onClose={() => setIsShareCardOpen(false)} data={data} />}
    </section>
  );
}