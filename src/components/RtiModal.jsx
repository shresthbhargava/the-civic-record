import React, { useState, useEffect } from 'react';
import './RtiModal.css';

const API_BASE = 'https://civicos-r2sf.onrender.com';

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

export default function RtiModal({ onClose, department, official, categoryCode = '', departmentCode = '' }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'auto'; };
  }, []);

  const [view, setView] = useState('FORM'); // 'FORM' | 'GENERATING' | 'DRAFT'
  const [formData, setFormData] = useState({
    citizenName: '',
    citizenAddress: '',
    citizenEmail: '',
    stateCode: '',
    districtCode: '',
    categoryCode: categoryCode,
    departmentCode: departmentCode
  });
  const [error, setError] = useState('');
  const [draftData, setDraftData] = useState(null);
  const [copyText, setCopyText] = useState('COPY TO CLIPBOARD');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStampClick = (e, callback) => {
    if (e) {
      const target = e.currentTarget;
      target.classList.add('stamp-press-anim');
      setTimeout(() => {
        target.classList.remove('stamp-press-anim');
        callback();
      }, 200);
    } else {
      callback();
    }
  };

  const generateDraft = async (e) => {
    e.preventDefault();
    
    if (!formData.citizenName || !formData.citizenAddress || !formData.citizenEmail || !formData.stateCode) {
      setError('Please fill in all required fields.');
      return;
    }
    
    setError('');
    setView('GENERATING');

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 seconds timeout

      const response = await fetch(`${API_BASE}/api/v1/rti/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error('Server returned an error.');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        setDraftData(result.data);
        setView('DRAFT');
      } else {
        throw new Error('Invalid response format.');
      }
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Server is taking too long. Please try again.');
      } else {
        setError(err.message || 'Failed to generate RTI draft. Please try again.');
      }
      setView('FORM');
    }
  };

  const handleCopy = () => {
    if (draftData && draftData.draftText) {
      navigator.clipboard.writeText(draftData.draftText)
        .then(() => {
          setCopyText('COPIED!');
          setTimeout(() => setCopyText('COPY TO CLIPBOARD'), 2000);
        })
        .catch(() => setError('Failed to copy text.'));
    }
  };

  const handleDownload = () => {
    if (draftData && draftData.draftText) {
      const blob = new Blob([draftData.draftText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const dateStr = new Date().toISOString().split('T')[0];
      a.download = `rti-draft-${dateStr}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        
        {view === 'FORM' && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">FILE RTI APPLICATION</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
            </div>

            {error && (
              <div className="rti-error-box">
                ⚠ {error}
              </div>
            )}

            <div className="rti-readonly-info">
              <div className="rti-form-label">Department</div>
              <div style={{ marginBottom: '12px', fontFamily: 'Lora' }}>{department || 'N/A'}</div>
              <div className="rti-form-label">PIO (Public Information Officer)</div>
              <div style={{ fontFamily: 'Lora' }}>{official ? `${official.name} — ${official.title}` : 'Officer information not available'}</div>
            </div>

            <form onSubmit={(e) => handleStampClick(e, () => generateDraft(e))}>
              <div className="rti-form-group">
                <label className="rti-form-label">Citizen Name *</label>
                <input type="text" name="citizenName" value={formData.citizenName} onChange={handleChange} className="rti-form-input" required />
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">Address *</label>
                <textarea name="citizenAddress" value={formData.citizenAddress} onChange={handleChange} className="rti-form-textarea" rows="2" required></textarea>
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">Email *</label>
                <input type="email" name="citizenEmail" value={formData.citizenEmail} onChange={handleChange} className="rti-form-input" required />
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">State *</label>
                <select name="stateCode" value={formData.stateCode} onChange={handleChange} className="rti-form-select" required>
                  <option value="">Select State</option>
                  {Object.entries(stateCodeMap).map(([stateName, code]) => (
                    <option key={code} value={code}>{stateName}</option>
                  ))}
                </select>
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">District Code</label>
                <input type="text" name="districtCode" value={formData.districtCode} onChange={handleChange} className="rti-form-input" placeholder="e.g. DELHI_CENTRAL" />
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">Category Code</label>
                <input type="text" name="categoryCode" value={formData.categoryCode} onChange={handleChange} className="rti-form-input" placeholder="e.g. EXAM_IRREGULARITY" />
              </div>

              <div className="rti-form-group">
                <label className="rti-form-label">Department Code</label>
                <input type="text" name="departmentCode" value={formData.departmentCode} onChange={handleChange} className="rti-form-input" placeholder="e.g. NTA_CENTRAL" />
              </div>

              <button 
                type="submit"
                className="vintage-stamp stamp-blue" 
                style={{ width: '100%', marginTop: '16px', background: 'transparent' }}
              >
                GENERATE DRAFT
              </button>
            </form>
          </>
        )}

        {view === 'GENERATING' && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div className="vintage-stamp stamp-blue rti-pulse-text" style={{ fontSize: '1.5rem', background: 'transparent' }}>
              DRAFTING APPLICATION...
            </div>
            <p style={{ marginTop: '16px', color: 'var(--text-secondary)', fontFamily: 'Lora', fontStyle: 'italic' }}>
              Drafting Section 6(1) and 6(3) provisions under RTI Act, 2005...
            </p>
          </div>
        )}

        {view === 'DRAFT' && draftData && (
          <>
            <div className="modal-header">
              <h2 className="modal-title">RTI DRAFT READY</h2>
              <button className="modal-close" onClick={onClose} aria-label="Close">✕</button>
            </div>

            <div className="rti-readonly-info" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px', marginBottom: '16px' }}>
              <div>
                <span className="rti-form-label" style={{ display: 'inline', marginRight: '8px' }}>To:</span>
                <span style={{ fontFamily: 'Lora', fontSize: '0.9rem' }}>{draftData.pioName || 'PIO'}, {draftData.pioDesignation || ''}</span>
              </div>
              <div>
                <span className="rti-form-label" style={{ display: 'inline', marginRight: '8px' }}>Dept:</span>
                <span style={{ fontFamily: 'Lora', fontSize: '0.9rem' }}>{draftData.departmentName}</span>
              </div>
              <div>
                <span className="rti-form-label" style={{ display: 'inline', marginRight: '8px' }}>Date:</span>
                <span style={{ fontFamily: 'Lora', fontSize: '0.9rem' }}>{draftData.generatedDate}</span>
              </div>
            </div>

            <div className="rti-draft-container">
              {draftData.draftText}
            </div>

            {draftData.questions && draftData.questions.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h4 className="rti-form-label" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>GENERATED QUESTIONS</h4>
                <ol style={{ paddingLeft: '24px', margin: '12px 0 0 0', fontFamily: 'Lora' }}>
                  {draftData.questions.map((q, idx) => (
                    <li key={idx} style={{ marginBottom: '12px', lineHeight: '1.5' }}>{q}</li>
                  ))}
                </ol>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '24px' }}>
              <button 
                type="button"
                className="vintage-stamp stamp-blue" 
                style={{ width: '100%', background: 'transparent' }}
                onClick={(e) => handleStampClick(e, handleCopy)}
              >
                {copyText}
              </button>
              <button 
                type="button"
                className="vintage-stamp stamp-red" 
                style={{ width: '100%', background: 'transparent' }}
                onClick={(e) => handleStampClick(e, handleDownload)}
              >
                DOWNLOAD AS TEXT
              </button>
              <button 
                type="button"
                className="vintage-stamp stamp-blue" 
                style={{ width: '100%', background: 'transparent', opacity: 0.8 }}
                onClick={(e) => handleStampClick(e, onClose)}
              >
                CLOSE
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
