import React, { useState, useEffect } from 'react';

const API_BASE = 'https://civicos-r2sf.onrender.com';

const INDIAN_STATES = [
  { code: 'AN', name: 'Andaman and Nicobar Islands' },
  { code: 'AP', name: 'Andhra Pradesh' },
  { code: 'AR', name: 'Arunachal Pradesh' },
  { code: 'AS', name: 'Assam' },
  { code: 'BR', name: 'Bihar' },
  { code: 'CH', name: 'Chandigarh' },
  { code: 'CT', name: 'Chhattisgarh' },
  { code: 'DN', name: 'Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'DL', name: 'Delhi' },
  { code: 'GA', name: 'Goa' },
  { code: 'GJ', name: 'Gujarat' },
  { code: 'HR', name: 'Haryana' },
  { code: 'HP', name: 'Himachal Pradesh' },
  { code: 'JK', name: 'Jammu and Kashmir' },
  { code: 'JH', name: 'Jharkhand' },
  { code: 'KA', name: 'Karnataka' },
  { code: 'KL', name: 'Kerala' },
  { code: 'LA', name: 'Ladakh' },
  { code: 'LD', name: 'Lakshadweep' },
  { code: 'MP', name: 'Madhya Pradesh' },
  { code: 'MH', name: 'Maharashtra' },
  { code: 'MN', name: 'Manipur' },
  { code: 'ML', name: 'Meghalaya' },
  { code: 'MZ', name: 'Mizoram' },
  { code: 'NL', name: 'Nagaland' },
  { code: 'OD', name: 'Odisha' },
  { code: 'PB', name: 'Punjab' },
  { code: 'PY', name: 'Puducherry' },
  { code: 'RJ', name: 'Rajasthan' },
  { code: 'SK', name: 'Sikkim' },
  { code: 'TN', name: 'Tamil Nadu' },
  { code: 'TG', name: 'Telangana' },
  { code: 'TR', name: 'Tripura' },
  { code: 'UP', name: 'Uttar Pradesh' },
  { code: 'UK', name: 'Uttarakhand' },
  { code: 'WB', name: 'West Bengal' },
];

export default function ComplaintSubmissionForm({ isOpen, onClose, categoryCode, categoryName, departmentCode, departmentName }) {
  const [description, setDescription] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenEmail, setCitizenEmail] = useState('');
  const [stateCode, setStateCode] = useState('');
  const [district, setDistrict] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const resetForm = () => {
    setDescription(''); setCitizenName(''); setCitizenEmail('');
    setStateCode(''); setDistrict(''); setSubmitting(false);
    setSubmitted(false); setError(''); setTrackingResult(null);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) { setError('Please describe your complaint'); return; }
    setSubmitting(true); setError('');
    try {
      const response = await fetch(
          `${API_BASE}/api/v1/complaints?categoryCode=${encodeURIComponent(categoryCode)}&departmentCode=${encodeURIComponent(departmentCode)}`,
          { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ description: description.trim(), citizenName: citizenName.trim() || undefined, citizenEmail: citizenEmail.trim() || undefined, stateCode: stateCode || undefined, district: district.trim() || undefined }) }
      );
      if (!response.ok) { const t = await response.text(); throw new Error(t || `Server error: ${response.status}`); }
      const result = await response.json();
      setTrackingResult(result.data); setSubmitted(true);
    } catch (err) { setError(err.message || 'Failed to submit. Try again.'); }
    finally { setSubmitting(false); }
  };

  if (!isOpen) return null;

  return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
        zIndex: 10001, overflowY: 'auto', paddingTop: '5vh', paddingBottom: '5vh'
      }} onClick={handleClose}>
        <div style={{
          background: '#0d1117', border: '1px solid #21262d', borderRadius: '12px',
          width: '90%', maxWidth: '520px', margin: '0 auto',
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative'
        }} onClick={e => e.stopPropagation()}>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '20px 24px 16px', borderBottom: '1px solid #21262d' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>FILE COMPLAINT</h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#8892b0' }}>Grievance against {departmentName || 'government department'}</p>
            </div>
            <button onClick={handleClose} style={{ background: 'none', border: 'none', color: '#8892b0', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
          </div>

          {submitted && trackingResult ? (
              <div style={{ padding: '30px 24px', textAlign: 'center' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', color: '#00ff88', margin: '0 auto' }}>&#10003;</div>
                <h3 style={{ margin: '12px 0 8px', color: '#00ff88', fontSize: '1.1rem' }}>COMPLAINT FILED</h3>
                <div style={{ padding: '16px', background: '#161b22', borderRadius: '8px', border: '1px solid #00ff88', marginTop: '8px' }}>
                  <span style={{ color: '#8892b0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Tracking ID</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', justifyContent: 'center' }}>
                    <span style={{ color: '#00ff88', fontSize: '1.4rem', fontFamily: 'monospace', fontWeight: 'bold' }}>{trackingResult.trackingId}</span>
                    <button onClick={() => navigator.clipboard.writeText(trackingResult.trackingId)} style={{ padding: '4px 12px', background: 'rgba(0,255,136,0.15)', border: '1px solid #00ff88', borderRadius: '4px', color: '#00ff88', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '600' }}>Copy</button>
                  </div>
                </div>
                <button onClick={handleClose} style={{ marginTop: '20px', padding: '12px 40px', background: '#00ff88', border: 'none', borderRadius: '8px', color: '#0d1117', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase' }}>DONE</button>
              </div>
          ) : (
              <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', padding: '12px 14px', background: '#161b22', borderRadius: '8px', marginBottom: '20px', border: '1px solid #21262d' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#8892b0', fontSize: '0.7rem', textTransform: 'uppercase' }}>Category</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{categoryName || categoryCode}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <span style={{ color: '#8892b0', fontSize: '0.7rem', textTransform: 'uppercase' }}>Department</span>
                    <span style={{ color: '#fff', fontSize: '0.85rem' }}>{departmentName || departmentCode}</span>
                  </div>
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description <span style={{ color: '#ff4757' }}>*</span></label>
                  <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe your issue in detail..." style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit', minHeight: '80px', resize: 'vertical' }} maxLength={5000} required />
                  <span style={{ fontSize: '0.7rem', color: '#555', textAlign: 'right' }}>{description.length}/5000</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500' }}>Name <span style={{ color: '#555' }}>(optional)</span></label>
                    <input type="text" value={citizenName} onChange={e => setCitizenName(e.target.value)} placeholder="Rahul Sharma" style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} maxLength={255} />
                  </div>
                  <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500' }}>Email <span style={{ color: '#555' }}>(optional)</span></label>
                    <input type="email" value={citizenEmail} onChange={e => setCitizenEmail(e.target.value)} placeholder="rahul@email.com" style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} maxLength={255} />
                  </div>
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500' }}>State <span style={{ color: '#555' }}>(optional)</span></label>
                  <select value={stateCode} onChange={e => setStateCode(e.target.value)} style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }}>
                    <option value="">Select state...</option>
                    {INDIAN_STATES.map(s => <option key={s.code} value={s.code}>{s.name}</option>)}
                  </select>
                </div>

                <div style={{ marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500' }}>District <span style={{ color: '#555' }}>(optional)</span></label>
                  <input type="text" value={district} onChange={e => setDistrict(e.target.value)} placeholder="e.g. Pune, Mumbai" style={{ background: '#161b22', border: '1px solid #30363d', borderRadius: '8px', color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit' }} maxLength={100} />
                </div>

                {error && <div style={{ padding: '10px 14px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px', color: '#ff4757', fontSize: '0.85rem', marginBottom: '12px' }}>&#9888; {error}</div>}

                <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                  <button type="button" onClick={handleClose} disabled={submitting} style={{ flex: 1, padding: '12px', background: 'transparent', border: '1px solid #30363d', borderRadius: '8px', color: '#8892b0', fontSize: '0.85rem', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>CANCEL</button>
                  <button type="submit" disabled={submitting || !description.trim()} style={{ flex: 2, padding: '12px', background: '#00ff88', border: 'none', borderRadius: '8px', color: '#0d1117', fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {submitting ? 'SUBMITTING...' : 'SUBMIT COMPLAINT'}
                  </button>
                </div>
              </form>
          )}
        </div>
      </div>
  );
}