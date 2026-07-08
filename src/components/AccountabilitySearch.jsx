
import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import RtiModal from './RtiModal';
import ShareCard from './ShareCard';
import ComplaintSubmissionForm from './ComplaintSubmissionForm';
import './AccountabilitySearch.css';
import { getTranslation } from '../i18n';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function AccountabilitySearch({ activeState, lang, searchEvent }) {
  const [modalData, setModalData] = useState(null);
  const [isTypesetting, setIsTypesetting] = useState(false);
  const [isRtiOpen, setIsRtiOpen] = useState(false);
  const [isShareCardOpen, setIsShareCardOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchData, setSearchData] = useState(null);
  const [noResults, setNoResults] = useState(false);
  const [error, setError] = useState(null);
  const [complaintModal, setComplaintModal] = useState({
    open: false, categoryCode: '', categoryName: '', departmentCode: '', departmentName: ''
  });

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
  const handleSearchWithQuery = async (query) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    setNoResults(false);
    setSearchData(null);
    setIsTypesetting(true);
    try {
      const stateCode = activeState ? (stateCodeMap[activeState] || '') : '';
      const url = `${API_BASE}/api/v1/incidents/search?query=${encodeURIComponent(query)}${stateCode ? `&stateCode=${stateCode}` : ''}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      if (!data.data?.matches || data.data.matches.length === 0) {
        setNoResults(true);
      } else {
        const match = data.data.matches[0];
        setSearchData({
          categoryCode: match.categoryCode || '',
          categoryName: match.categoryName,
          departmentCode: match.responsibleDepartment.code || '',
          departmentName: match.responsibleDepartment.name,
          headline: `${match.categoryName.toUpperCase()} — ${match.responsibleDepartment.name.toUpperCase()}`,
          department: match.responsibleDepartment.name,
          jurisdiction: match.responsibleDepartment.jurisdictionLevel,
          score: 'B+',
          date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
          chain: match.accountabilityChain.map(node => ({ role: node.jurisdictionLevel, name: node.name, bio: node.ministry || '' })),
          official: match.responsibleDepartment.currentOfficials?.[0] ? {
            name: match.responsibleDepartment.currentOfficials[0].fullName,
            title: match.responsibleDepartment.currentOfficials[0].postingTitle,
            contact: match.responsibleDepartment.currentOfficials[0].contactEmail,
            since: match.responsibleDepartment.currentOfficials[0].startDate,
          } : null,
          actions: match.citizenActions,
          acts: match.relevantActs,
          matchedKeywords: match.matchedKeywords,
          complaintPortalUrl: match.responsibleDepartment.complaintPortalUrl || null,
          websiteUrl: match.responsibleDepartment.websiteUrl || null,
        });
      }
    } catch (err) {
      setError('Could not reach the server. Please try again.');
    } finally {
      setIsSearching(false);
      setTimeout(() => setIsTypesetting(false), 1200);
    }
  };

  useEffect(() => {
    if (searchEvent && searchEvent.query && searchEvent.query.trim()) {
      handleSearchWithQuery(searchEvent.query);
    }
  }, [searchEvent]);
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
          categoryCode: match.categoryCode,
          categoryName: match.categoryName,
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

      {/* Loading state */}
      {isSearching && (
        <div style={{ padding: '64px 0', textAlign: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="vintage-stamp stamp-blue" style={{ display: 'inline-block', fontSize: '1.5rem', animation: 'pulse 1.5s infinite' }}>
            SEARCHING ARCHIVES...
          </div>
          <p style={{ fontFamily: 'Lora', fontStyle: 'italic', marginTop: '16px', color: 'var(--text-secondary)' }}>Retrieving official records and accountability chains...</p>
        </div>
      )}

      {/* Empty state */}
      {!isSearching && !data && !noResults && !error && (
        <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          Search for any civic issue to see the full accountability record.
        </div>
      )}

      {/* Results */}
      {!isSearching && data && (
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

            {/* Official Portal Links */}
            {/* Complaint Actions */}
            <div style={{ marginBottom: '24px', breakInside: 'avoid' }}>
              <button
                  onClick={() => setComplaintModal({
                    open: true,
                    categoryCode: data.categoryCode,
                    categoryName: data.department,
                    departmentCode: data.departmentCode,
                    departmentName: data.department,
                  })}
                  style={{ display: 'block', width: '100%', textAlign: 'center', background: '#00ff88', border: 'none', color: '#0d1117', padding: '12px', marginBottom: '8px', fontSize: '0.85rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 700, fontFamily: 'inherit' }}
              >
                FILE COMPLAINT VIA CIVICOS
              </button>
              {data.complaintPortalUrl && (
                  <a
                      href={data.complaintPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ display: 'block', width: '100%', textAlign: 'center', background: 'transparent', border: '1px solid #ff4757', color: '#ff4757', padding: '10px', fontSize: '0.8rem', borderRadius: '6px', textDecoration: 'none', fontWeight: 600, fontFamily: 'inherit' }}
                  >
                    FILE ON OFFICIAL PORTAL &#8599;
                  </a>
              )}
            </div>


            {data.websiteUrl && (
                <div style={{ marginBottom: '24px', breakInside: 'avoid' }}>
                  <a
                      href={data.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="vintage-stamp stamp-blue"
                      style={{ display: 'block', width: '100%', textAlign: 'center', background: 'transparent', textDecoration: 'none', color: 'inherit', padding: '12px', marginBottom: '8px', fontSize: '0.9rem' }}
                  >
                    VISIT DEPARTMENT PORTAL &#8599;
                  </a>
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
      <ComplaintSubmissionForm
          isOpen={complaintModal.open}
          onClose={() => setComplaintModal(prev => ({ ...prev, open: false }))}
          categoryCode={complaintModal.categoryCode}
          categoryName={complaintModal.categoryName}
          departmentCode={complaintModal.departmentCode}
          departmentName={complaintModal.departmentName}
      />
      <Modal isOpen={!!modalData} onClose={() => setModalData(null)} title={modalData?.title} stampType={modalData?.stamp}>
        <p>{modalData?.content}</p>
      </Modal>
      {isRtiOpen && <RtiModal onClose={() => setIsRtiOpen(false)} department={data?.department} official={data?.official} />}
      {isShareCardOpen && <ShareCard onClose={() => setIsShareCardOpen(false)} data={data} />}
    </section>

  );

}


