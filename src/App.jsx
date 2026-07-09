import React, { useState, useEffect, useRef } from 'react'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import AccountabilitySearch from './components/AccountabilitySearch'
import StateFinancialHealth from './components/StateFinancialHealth'
import ProjectTracker from './components/ProjectTracker'
import CivicFeed from './components/CivicFeed'
import ComplaintTracker from './components/ComplaintTracker'
import { getTranslation, stateToLanguageMap } from './i18n'
import { regionalImages } from './regionMap'


function App() {
  const [activeState, setActiveState] = useState(null);
  const [lang, setLang] = useState('en');
  const [pageTurn, setPageTurn] = useState(false);
  const [searchEvent, setSearchEvent] = useState(null);
  const [backendAwake, setBackendAwake] = useState(false);
  const [showTracker, setShowTracker] = useState(false);
  const accountabilityRef = useRef(null);

  // Wake up backend
  useEffect(() => {
    fetch('https://civicos-r2sf.onrender.com/api/v1/news/edition/today')
      .then(() => setBackendAwake(true))
      .catch(() => {
        // Fallback if fetch fails (e.g. CORS or network error)
        setTimeout(() => setBackendAwake(true), 5000);
      });
  }, []);

  // Ink trail logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Create a small dot element
      const dot = document.createElement('div');
      dot.className = 'ink-dot';
      // Adjust offset to match pen nib tip (12, 22 roughly)
      dot.style.left = `${e.clientX - 2}px`;
      dot.style.top = `${e.clientY - 2}px`;
      document.body.appendChild(dot);

      // Fade out and remove
      setTimeout(() => {
        dot.style.opacity = '0';
        dot.style.transform = 'scale(0.5)';
      }, 50);

      setTimeout(() => {
        if (dot.parentNode) dot.parentNode.removeChild(dot);
      }, 350);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleStateSelect = (stateId, stateName) => {
    if (activeState === stateName) return; // Ignore if clicking same state

    // Trigger page turn out
    setPageTurn(true);

    setTimeout(() => {
      setActiveState(stateName);
      if (stateId) {
        const idUpper = stateId.replace('in-', '').toUpperCase();
        const newLang = stateToLanguageMap[idUpper] || stateToLanguageMap[stateId];
        if (newLang) setLang(newLang);

        // Update Background
        const bgUrl = regionalImages[idUpper] || regionalImages['DL'];
        document.body.style.backgroundImage = `url(${bgUrl})`;
        document.body.classList.add('state-view-active', 'parallax-bg');
      } else {
        setLang('en');
        document.body.style.backgroundImage = 'none';
        document.body.classList.remove('state-view-active', 'parallax-bg');
      }
      // Turn page in
      setPageTurn(false);
    }, 800); // Wait for exit animation
  };

  if (!backendAwake) {
    return (
      <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)', fontFamily: 'Playfair Display SC', color: 'var(--text-primary)' }}>
        <h1 className="typewriter-text" style={{ fontSize: '2.5rem', marginBottom: '16px', borderBottom: '2px solid var(--text-primary)', paddingBottom: '8px' }}>
          WARMING UP THE PRESSES...
        </h1>
        <p className="typewriter-text" style={{ fontSize: '1rem', fontFamily: 'Lora', fontStyle: 'italic', animationDelay: '1s', opacity: 0 }}>
          Retrieving the latest national records. This may take up to 30 seconds...
        </p>
        <div style={{ marginTop: '32px', width: '200px', height: '2px', background: 'var(--text-primary)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: '30%', background: 'var(--accent-gold)', animation: 'bg-pan 2s linear infinite' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* Top Utility Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 24px', borderBottom: '2px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'Lora', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <div className="lang-switcher">
          <button onClick={() => setLang('en')} className="ink-bleed-hover" style={{ fontWeight: lang === 'en' ? 'bold' : 'normal', background: 'none', border: 'none', marginRight: '12px', cursor: 'var(--cursor-stamp)' }}>English</button>
          <button onClick={() => setLang('hi')} className="hindi-text ink-bleed-hover" style={{ fontWeight: lang === 'hi' ? 'bold' : 'normal', background: 'none', border: 'none', marginRight: '12px', cursor: 'var(--cursor-stamp)' }}>हिंदी</button>
          <button onClick={() => setLang('mr')} className="hindi-text ink-bleed-hover" style={{ fontWeight: lang === 'mr' ? 'bold' : 'normal', background: 'none', border: 'none', marginRight: '12px', cursor: 'var(--cursor-stamp)' }}>मराठी</button>
          <button onClick={() => setLang('bn')} className="hindi-text ink-bleed-hover" style={{ fontWeight: lang === 'bn' ? 'bold' : 'normal', background: 'none', border: 'none', marginRight: '12px', cursor: 'var(--cursor-stamp)' }}>বাংলা</button>
          <button onClick={() => setLang('ta')} className="hindi-text ink-bleed-hover" style={{ fontWeight: lang === 'ta' ? 'bold' : 'normal', background: 'none', border: 'none', cursor: 'var(--cursor-stamp)' }}>தமிழ்</button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontFamily: 'Playfair Display SC', fontWeight: 'bold' }}>
          <button 
            className="ink-bleed-hover"
            style={{ 
              background: 'transparent', 
              border: '1px solid var(--text-primary)', 
              color: 'var(--text-primary)',
              fontFamily: 'Playfair Display SC',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              padding: '4px 12px',
              cursor: 'var(--cursor-stamp)'
            }}
            onClick={() => setShowTracker(true)}
          >
            Track Complaint
          </button>
          <span>Vol. 1 &bull; 1947 Edition</span>
        </div>
      </div>

      <Ticker />

      {/* Page Turn Wrapper */}
      <div className={`page-container ${pageTurn ? 'page-turn-exit' : 'page-turn-enter'}`}>
        <div className="container" style={{ paddingTop: '24px' }}>
          <Hero
            activeState={activeState}
            onStateSelect={handleStateSelect}
            lang={lang}
            onSearch={(query) => {
              setSearchEvent({ query, timestamp: Date.now() });
              setTimeout(() => {
                accountabilityRef.current?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
          />

          <div ref={accountabilityRef} style={{ borderTop: '4px solid var(--border-color)', marginTop: '48px', paddingTop: '48px' }}>
            <AccountabilitySearch activeState={activeState} lang={lang} searchEvent={searchEvent} />
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '48px', paddingTop: '48px' }}>
            <StateFinancialHealth activeState={activeState} lang={lang} />
          </div>

          <div style={{ borderTop: '2px solid var(--border-color)', marginTop: '48px', paddingTop: '48px' }}>
            <ProjectTracker activeState={activeState} lang={lang} />
          </div>

          <div style={{ borderTop: '4px solid var(--border-color)', marginTop: '48px', paddingTop: '48px' }}>
            <CivicFeed activeState={activeState} lang={lang} />
          </div>
        </div>

        <footer style={{
          padding: '60px 0',
          textAlign: 'center',
          borderTop: '6px double var(--border-color)',
          marginTop: '80px',
          fontFamily: 'Playfair Display SC, serif',
          backgroundColor: 'transparent'
        }}>
          <h2 style={{ fontSize: '3rem' }}>THE CIVIC RECORD</h2>
          <p className="hindi-text" style={{ fontSize: '1.5rem', marginTop: '12px' }}>{getTranslation(lang, 'tagline')}</p>
          <p style={{ fontStyle: 'italic', fontSize: '1rem', color: 'var(--text-secondary)', marginTop: '24px', fontFamily: 'Lora' }}>
            Printed by the Free Press Consortium &bull; New Delhi
          </p>
        </footer>
      </div>
      {showTracker && <ComplaintTracker isOpen={true} onClose={() => setShowTracker(false)} />}
    </div>
  )
}

export default App
