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
  const [districtCode, setDistrictCode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [trackingResult, setTrackingResult] = useState(null);
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);
  const resetForm = () => {
    setDescription('');
    setCitizenName('');
    setCitizenEmail('');
    setStateCode('');
    setDistrictCode('');
    setSubmitting(false);
    setSubmitted(false);
    setError('');
    setTrackingResult(null);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      setError('Please describe your complaint');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const response = await fetch(
          `${API_BASE}/api/v1/complaints?categoryCode=${encodeURIComponent(categoryCode)}&departmentCode=${encodeURIComponent(departmentCode)}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              description: description.trim(),
              citizenName: citizenName.trim() || undefined,
              citizenEmail: citizenEmail.trim() || undefined,
              stateCode: stateCode || undefined,
              districtCode: districtCode.trim() || undefined,
            }),
          }
      );

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText || `Server error: ${response.status}`);
      }

      const result = await response.json();
      const complaint = result.data;
      setTrackingResult(complaint);
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Failed to submit complaint. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingId = () => {
    if (trackingResult?.trackingId) {
      navigator.clipboard.writeText(trackingResult.trackingId);
    }
  };

  if (!isOpen) return null;

  return (
      <div style={overlayStyle} onClick={handleClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div style={headerStyle}>
            <div>
              <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>
                FILE COMPLAINT
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#8892b0' }}>
                Official grievance against government department
              </p>
            </div>
            <button onClick={handleClose} style={closeBtnStyle}>✕</button>
          </div>

          {submitted && trackingResult ? (
              /* Success State */
              <div style={successContainer}>
                <div style={successIconStyle}>✓</div>
                <h3 style={{ margin: '12px 0 8px', color: '#00ff88', fontSize: '1.1rem' }}>
                  COMPLAINT FILED SUCCESSFULLY
                </h3>
                <p style={{ margin: '0 0 20px', color: '#8892b0', fontSize: '0.85rem', textAlign: 'center' }}>
                  Your grievance has been recorded. Save your tracking ID below.
                </p>

                <div style={trackingBox}>
              <span style={{ color: '#8892b0', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Your Tracking ID
              </span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px' }}>
                <span style={{ color: '#00ff88', fontSize: '1.5rem', fontFamily: 'monospace', fontWeight: 'bold' }}>
                  {trackingResult.trackingId}
                </span>
                    <button onClick={copyTrackingId} style={copyBtnStyle}>
                      Copy
                    </button>
                  </div>
                </div>

                <div style={infoGrid}>
                  <div style={infoItem}>
                    <span style={infoLabel}>Department</span>
                    <span style={infoValue}>{trackingResult.departmentName}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Category</span>
                    <span style={infoValue}>{trackingResult.categoryName}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Status</span>
                    <span style={infoValue}>{trackingResult.status}</span>
                  </div>
                  <div style={infoItem}>
                    <span style={infoLabel}>Filed On</span>
                    <span style={infoValue}>
                  {trackingResult.createdAt
                      ? new Date(trackingResult.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })
                      : 'N/A'}
                </span>
                  </div>
                </div>

                {trackingResult.complaintPortalUrl && (
                    <a
                        href={trackingResult.complaintPortalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={portalLink}
                    >
                      → ALSO FILE ON OFFICIAL PORTAL
                    </a>
                )}

                <button onClick={handleClose} style={doneBtnStyle}>
                  DONE
                </button>
              </div>
          ) : (
              /* Form State */
              <form onSubmit={handleSubmit} style={{
                padding: '20px 24px 0',
                flex: 1, minHeight: 0, minHeight: 0,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}>

                {/* Description */}
                <div style={fieldGroup}>
                  <label style={labelStyle}>
                    Complaint Description <span style={{ color: '#ff4757' }}>*</span>
                  </label>
                  <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Describe your issue in detail — what happened, when, where, and what action you expect..."
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                      maxLength={5000}
                      required
                  />
                  <span style={charCount}>{description.length}/5000</span>
                </div>

                {/* Name + Email row */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Your Name <span style={{ color: '#555' }}>(optional)</span></label>
                    <input
                        type="text"
                        value={citizenName}
                        onChange={(e) => setCitizenName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        style={inputStyle}
                        maxLength={255}
                    />
                  </div>
                  <div style={fieldGroup}>
                    <label style={labelStyle}>Email <span style={{ color: '#555' }}>(optional)</span></label>
                    <input
                        type="email"
                        value={citizenEmail}
                        onChange={(e) => setCitizenEmail(e.target.value)}
                        placeholder="e.g. rahul@email.com"
                        style={inputStyle}
                        maxLength={255}
                    />
                  </div>
                </div>

                {/* State dropdown */}
                <div style={fieldGroup}>
                  <label style={labelStyle}>State <span style={{ color: '#555' }}>(optional)</span></label>
                  <select value={stateCode} onChange={(e) => setStateCode(e.target.value)} style={inputStyle}>
                    <option value="">Select state...</option>
                    {INDIAN_STATES.map((s) => (
                        <option key={s.code} value={s.code}>
                          {s.name}
                        </option>
                    ))}
                  </select>
                </div>

                {/* District */}
                <div style={fieldGroup}>
                  <label style={labelStyle}>District <span style={{ color: '#555' }}>(optional)</span></label>
                  <input
                      type="text"
                      value={districtCode}
                      onChange={(e) => setDistrictCode(e.target.value)}
                      placeholder="e.g. Pune, Mumbai, Delhi"
                      style={inputStyle}
                      maxLength={20}
                  />
                </div>

                {/* Error */}
                {error && (
                    <div style={errorBox}>
                      ⚠ {error}
                    </div>
                )}

                {/* Spacer to push buttons to bottom if content is short */}
                <div style={{ flex: 1 }} />

                {/* Actions — pinned at bottom */}
                <div style={{
                  display: 'flex', gap: '12px',
                  padding: '16px 24px 24px',
                  flexShrink: 0,
                  borderTop: '1px solid #21262d',
                }}>
                  <button
                      type="button"
                      onClick={handleClose}
                      style={cancelBtnStyle}
                      disabled={submitting}
                  >
                    CANCEL
                  </button>
                  <button
                      type="submit"
                      style={submitBtnStyle}
                      disabled={submitting || !description.trim()}
                  >
                    {submitting ? (
                        <span style={spinnerStyle}>SUBMITTING...</span>
                    ) : (
                        'SUBMIT COMPLAINT'
                    )}
                  </button>
                </div>
              </form>
          )}
        </div>
      </div>
  );
}

// ── Styles ──────────────────────────────────────────────────────────

const overlayStyle = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)',
  display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
};
const modalStyle = {
  background: '#0d1117', border: '1px solid #21262d', borderRadius: '12px',
  width: '90%', maxWidth: '560px', maxHeight: '90vh',
  display: 'flex', flexDirection: 'column',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden',
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  padding: '20px 24px 16px', borderBottom: '1px solid #21262d',
  flexShrink: 0,
};

const closeBtnStyle = {
  background: 'none', border: 'none', color: '#8892b0', fontSize: '1.2rem',
  cursor: 'pointer', padding: '4px 8px', borderRadius: '4px',
  transition: 'color 0.2s',
};

const fieldGroup = { marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '6px' };

const labelStyle = {
  fontSize: '0.8rem', color: '#c9d1d9', fontWeight: '500', textTransform: 'uppercase',
  letterSpacing: '0.5px',
};

const inputStyle = {
  background: '#161b22', border: '1px solid #30363d', borderRadius: '8px',
  color: '#c9d1d9', padding: '10px 14px', fontSize: '0.9rem', outline: 'none',
  fontFamily: 'inherit', transition: 'border-color 0.2s',
};

const charCount = { fontSize: '0.7rem', color: '#555', textAlign: 'right' };

const contextBanner = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  padding: '12px 14px', background: '#161b22', borderRadius: '8px',
  marginBottom: '20px', border: '1px solid #21262d',
};

const contextTag = { display: 'flex', flexDirection: 'column', gap: '2px' };

const errorBox = {
  padding: '10px 14px', background: 'rgba(255,71,87,0.1)', border: '1px solid rgba(255,71,87,0.3)',
  borderRadius: '8px', color: '#ff4757', fontSize: '0.85rem', marginTop: '8px',
};

const cancelBtnStyle = {
  flex: 1, minHeight: 0, minHeight: 0, padding: '12px', background: 'transparent', border: '1px solid #30363d',
  borderRadius: '8px', color: '#8892b0', fontSize: '0.85rem', fontWeight: '600',
  cursor: 'pointer', fontFamily: 'inherit',
};

const submitBtnStyle = {
  flex: 2, padding: '12px', background: '#00ff88', border: 'none',
  borderRadius: '8px', color: '#0d1117', fontSize: '0.85rem', fontWeight: '700',
  cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
  letterSpacing: '0.5px', transition: 'opacity 0.2s',
};

const spinnerStyle = { display: 'flex', alignItems: 'center', gap: '8px' };

const successContainer = {
  padding: '30px 24px', textAlign: 'center',
};

const successIconStyle = {
  width: '56px', height: '56px', borderRadius: '50%',
  background: 'rgba(0,255,136,0.1)', border: '2px solid #00ff88',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  fontSize: '1.5rem', color: '#00ff88', margin: '0 auto',
};

const trackingBox = {
  padding: '16px', background: '#161b22', borderRadius: '8px',
  border: '1px solid #00ff88', marginTop: '8px',
};

const copyBtnStyle = {
  padding: '4px 12px', background: 'rgba(0,255,136,0.15)', border: '1px solid #00ff88',
  borderRadius: '4px', color: '#00ff88', fontSize: '0.75rem', cursor: 'pointer',
  fontWeight: '600', fontFamily: 'inherit',
};

const infoGrid = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px',
  marginTop: '20px', textAlign: 'left',
};

const infoItem = {
  padding: '10px', background: '#161b22', borderRadius: '6px', border: '1px solid #21262d',
  display: 'flex', flexDirection: 'column', gap: '4px',
};

const infoLabel = { fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' };
const infoValue = { fontSize: '0.85rem', color: '#c9d1d9', fontWeight: '500' };

const portalLink = {
  display: 'inline-block', marginTop: '20px', padding: '10px 20px',
  background: 'rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)',
  borderRadius: '8px', color: '#58a6ff', fontSize: '0.8rem', fontWeight: '600',
  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px',
  transition: 'background 0.2s',
};

const doneBtnStyle = {
  marginTop: '20px', padding: '12px 40px', background: '#00ff88', border: 'none',
  borderRadius: '8px', color: '#0d1117', fontSize: '0.85rem', fontWeight: '700',
  cursor: 'pointer', fontFamily: 'inherit', textTransform: 'uppercase',
};
