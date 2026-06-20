import React, { useState, useEffect, useRef } from 'react'
import Ticker from './components/Ticker'
import Hero from './components/Hero'
import AccountabilitySearch from './components/AccountabilitySearch'
import StateFinancialHealth from './components/StateFinancialHealth'
import ProjectTracker from './components/ProjectTracker'
import CivicFeed from './components/CivicFeed'
import { getTranslation, stateToLanguageMap } from './i18n'
import { regionalImages } from './regionMap'

function App() {
  const [activeState, setActiveState] = useState(null); 
  const [lang, setLang] = useState('en');
  const [pageTurn, setPageTurn] = useState(false);
  
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
        if(dot.parentNode) dot.parentNode.removeChild(dot);
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
        document.body.classList.add('state-view-active');
      } else {
        setLang('en');
        document.body.style.backgroundImage = 'none';
        document.body.classList.remove('state-view-active');
      }
      // Turn page in
      setPageTurn(false);
    }, 800); // Wait for exit animation
  };

  return (
    <div className="app-container">
      {/* Top Utility Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 24px', borderBottom: '2px solid var(--border-color)', fontSize: '0.85rem', fontFamily: 'Lora', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        <div className="lang-switcher">
          <button onClick={() => setLang('en')} style={{fontWeight: lang==='en'?'bold':'normal', background:'none', border:'none', marginRight:'12px'}}>English</button>
          <button onClick={() => setLang('hi')} className="hindi-text" style={{fontWeight: lang==='hi'?'bold':'normal', background:'none', border:'none', marginRight:'12px'}}>हिंदी</button>
          <button onClick={() => setLang('mr')} className="hindi-text" style={{fontWeight: lang==='mr'?'bold':'normal', background:'none', border:'none', marginRight:'12px'}}>मराठी</button>
          <button onClick={() => setLang('bn')} className="hindi-text" style={{fontWeight: lang==='bn'?'bold':'normal', background:'none', border:'none', marginRight:'12px'}}>বাংলা</button>
          <button onClick={() => setLang('ta')} className="hindi-text" style={{fontWeight: lang==='ta'?'bold':'normal', background:'none', border:'none'}}>தமிழ்</button>
        </div>
        <div style={{ fontFamily: 'Playfair Display SC', fontWeight: 'bold' }}>
          Vol. 1 &bull; 1947 Edition
        </div>
      </div>

      <Ticker />

      {/* Page Turn Wrapper */}
      <div className={`page-container ${pageTurn ? 'page-turn-exit' : 'page-turn-enter'}`}>
        <div className="container" style={{ paddingTop: '24px' }}>
          <Hero activeState={activeState} onStateSelect={handleStateSelect} lang={lang} />
          
          <div style={{ borderTop: '4px solid var(--border-color)', marginTop: '48px', paddingTop: '48px' }}>
            <AccountabilitySearch activeState={activeState} lang={lang} />
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
    </div>
  )
}

export default App
