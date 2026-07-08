import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const API_BASE = 'https://civicos-r2sf.onrender.com';

const STATUS_CONFIG = {
  SUBMITTED:    { color: '#ffa726', bg: 'rgba(255,167,38,0.1)',  label: 'Submitted',    icon: '📄' },
  ACKNOWLEDGED:  { color: '#42a5f5', bg: 'rgba(66,165,245,0.1)',  label: 'Acknowledged',  icon: '📋' },
  IN_PROGRESS:   { color: '#ab47bc', bg: 'rgba(171,71,188,0.1)',  label: 'In Progress',  icon: '⚙' },
  RESOLVED:      { color: '#00ff88', bg: 'rgba(0,255,136,0.1)',    label: 'Resolved',     icon: '✓' },
  REJECTED:      { color: '#ff4757', bg: 'rgba(255,71,87,0.1)',    label: 'Rejected',     icon: '✕' },
};

export default function ComplaintTracker({ isOpen, onClose }) {
  const [trackingId, setTrackingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [complaint, setComplaint] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleClose = () => {
    setTrackingId('');
    setLoading(false);
    setComplaint(null);
    setError('');
    onClose();
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingId.trim()) return;

    setLoading(true);
    setError('');
    setComplaint(null);

    try {
      const response = await fetch(`${API_BASE}/api/v1/complaints/track/${encodeURIComponent(trackingId.trim())}`);

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('No complaint found with this tracking ID');
        }
        throw new Error(`Server error: ${response.status}`);
      }

      const result = await response.json();
      setComplaint(result.data);
    } catch (err) {
      setError(err.message || 'Failed to track complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusFlow = ['SUBMITTED', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'];

  const getStatusStepIndex = (status) => {
    if (status === 'REJECTED') return -1;
    return statusFlow.indexOf(status);
  };

  const formatDate = (isoString) => {
    if (!isoString) return 'Pending';
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  if (!isOpen) return null;

  const currentStep = complaint ? getStatusStepIndex(complaint.status) : -1;
  const isRejected = complaint?.status === 'REJECTED';

  return createPortal(
    <div style={overlayStyle} onClick={handleClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#fff' }}>
              TRACK COMPLAINT
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#8892b0' }}>
              Enter your tracking ID to check status
            </p>
          </div>
          <button onClick={handleClose} style={closeBtnStyle}>✕</button>
        </div>

        <div style={{ padding: '20px 24px 24px' }}>
          {/* Search Input */}
          <form onSubmit={handleTrack} style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <input
              type="text"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              placeholder="e.g. CRT-XXXXX"
              style={searchInputStyle}
            />
            <button
              type="submit"
              style={trackBtnStyle}
              disabled={loading || !trackingId.trim()}
            >
              {loading ? '...' : 'TRACK'}
            </button>
          </form>

          {/* Error */}
          {error && <div style={errorBox}>⚠ {error}</div>}

          {/* Complaint Details */}
          {complaint && (
            <div>
              {/* Status Card */}
              <div style={statusCard}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ color: '#8892b0', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                      Current Status
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      {(() => {
                        const cfg = STATUS_CONFIG[complaint.status] || STATUS_CONFIG.SUBMITTED;
                        return (
                          <>
                            <span style={{
                              padding: '4px 10px', borderRadius: '4px',
                              background: cfg.bg, border: `1px solid ${cfg.color}`,
                              color: cfg.color, fontSize: '0.85rem', fontWeight: '600',
                            }}>
                              {cfg.icon} {cfg.label}
                            </span>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ color: '#8892b0', fontSize: '0.7rem', textTransform: 'uppercase' }}>ID</span>
                    <div style={{ color: '#00ff88', fontFamily: 'monospace', fontSize: '0.9rem', fontWeight: 'bold' }}>
                      {complaint.trackingId}
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Timeline */}
              {!isRejected && (
                <div style={timelineContainer}>
                  <div style={timelineTrack}>
                    <div style={{
                      ...timelineProgress,
                      width: `${Math.max(0, (currentStep / (statusFlow.length - 1)) * 100)}%`,
                    }} />
                  </div>
                  <div style={timelineSteps}>
                    {statusFlow.map((step, idx) => {
                      const cfg = STATUS_CONFIG[step];
                      const isActive = idx <= currentStep;
                      const isCurrent = idx === currentStep;
                      return (
                        <div key={step} style={timelineStep}>
                          <div style={{
                            ...stepDot,
                            background: isActive ? cfg.color : '#21262d',
                            borderColor: isCurrent ? cfg.color : (isActive ? cfg.color : '#30363d'),
                            boxShadow: isCurrent ? `0 0 12px ${cfg.color}40` : 'none',
                          }}>
                            {isActive && <span style={{ color: '#0d1117', fontSize: '0.7rem', fontWeight: 'bold' }}>✓</span>}
                          </div>
                          <span style={{ ...stepLabel, color: isActive ? '#c9d1d9' : '#555' }}>
                            {cfg.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Info Grid */}
              <div style={infoGrid}>
                <div style={infoItem}>
                  <span style={infoLabel}>Department</span>
                  <span style={infoValue}>{complaint.departmentName || '—'}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Category</span>
                  <span style={infoValue}>{complaint.categoryName || '—'}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Filed On</span>
                  <span style={infoValue}>{formatDate(complaint.createdAt)}</span>
                </div>
                <div style={infoItem}>
                  <span style={infoLabel}>Acknowledged</span>
                  <span style={infoValue}>{formatDate(complaint.acknowledgedAt)}</span>
                </div>
                {complaint.stateCode && (
                  <div style={infoItem}>
                    <span style={infoLabel}>State</span>
                    <span style={infoValue}>{complaint.stateCode}</span>
                  </div>
                )}
                {complaint.districtCode && (
                  <div style={infoItem}>
                    <span style={infoLabel}>District</span>
                    <span style={infoValue}>{complaint.districtCode}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div style={descBox}>
                <span style={infoLabel}>Complaint Description</span>
                <p style={{ margin: '8px 0 0', color: '#c9d1d9', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  {complaint.description}
                </p>
              </div>

              {/* Resolution Notes */}
              {complaint.resolutionNotes && (
                <div style={resolutionBox}>
                  <span style={infoLabel}>Resolution Notes</span>
                  <p style={{ margin: '8px 0 0', color: '#00ff88', fontSize: '0.85rem', lineHeight: '1.5' }}>
                    {complaint.resolutionNotes}
                  </p>
                </div>
              )}

              {/* Portal Link */}
              {complaint.complaintPortalUrl && (
                <a
                  href={complaint.complaintPortalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={portalLink}
                >
                  → FOLLOW UP ON OFFICIAL PORTAL
                </a>
              )}
            </div>
          )}

          {/* Empty State */}
          {!complaint && !loading && !error && (
            <div style={emptyState}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🔍</div>
              <p style={{ color: '#8892b0', fontSize: '0.85rem' }}>
                Enter the tracking ID you received when you filed your complaint
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
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
  width: '90%', maxWidth: '560px', maxHeight: '90vh', overflow: 'auto',
  boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
};

const headerStyle = {
  display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
  padding: '20px 24px 16px', borderBottom: '1px solid #21262d',
};

const closeBtnStyle = {
  background: 'none', border: 'none', color: '#8892b0', fontSize: '1.2rem',
  cursor: 'pointer', padding: '4px 8px', borderRadius: '4px',
};

const searchInputStyle = {
  flex: 1, padding: '12px 14px', background: '#161b22',
  border: '1px solid #30363d', borderRadius: '8px',
  color: '#c9d1d9', fontSize: '0.95rem', fontFamily: 'monospace',
  outline: 'none',
};

const trackBtnStyle = {
  padding: '12px 24px', background: '#00ff88', border: 'none',
  borderRadius: '8px', color: '#0d1117', fontSize: '0.85rem',
  fontWeight: '700', cursor: 'pointer', fontFamily: 'inherit',
  textTransform: 'uppercase', letterSpacing: '0.5px',
};

const errorBox = {
  padding: '10px 14px', background: 'rgba(255,71,87,0.1)',
  border: '1px solid rgba(255,71,87,0.3)', borderRadius: '8px',
  color: '#ff4757', fontSize: '0.85rem', marginBottom: '16px',
};

const statusCard = {
  padding: '16px', background: '#161b22', borderRadius: '8px',
  border: '1px solid #21262d', marginBottom: '20px',
};

const timelineContainer = { marginBottom: '24px', padding: '0 8px' };
const timelineTrack = {
  height: '3px', background: '#21262d', borderRadius: '2px', position: 'relative',
};
const timelineProgress = {
  height: '100%', background: '#00ff88', borderRadius: '2px', transition: 'width 0.5s ease',
};
const timelineSteps = {
  display: 'flex', justifyContent: 'space-between', marginTop: '-8px', position: 'relative',
};
const timelineStep = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' };
const stepDot = {
  width: '16px', height: '16px', borderRadius: '50%', border: '2px solid',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#21262d', transition: 'all 0.3s',
};
const stepLabel = { fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.3px' };

const infoGrid = {
  display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px',
};
const infoItem = {
  padding: '10px 12px', background: '#161b22', borderRadius: '6px', border: '1px solid #21262d',
  display: 'flex', flexDirection: 'column', gap: '4px',
};
const infoLabel = { fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '0.5px' };
const infoValue = { fontSize: '0.85rem', color: '#c9d1d9', fontWeight: '500' };

const descBox = {
  padding: '14px', background: '#161b22', borderRadius: '8px', border: '1px solid #21262d',
  marginBottom: '12px',
};

const resolutionBox = {
  padding: '14px', background: 'rgba(0,255,136,0.05)', borderRadius: '8px',
  border: '1px solid rgba(0,255,136,0.2)', marginBottom: '12px',
};

const portalLink = {
  display: 'block', textAlign: 'center', padding: '10px 20px',
  background: 'rgba(0,150,255,0.1)', border: '1px solid rgba(0,150,255,0.3)',
  borderRadius: '8px', color: '#58a6ff', fontSize: '0.8rem', fontWeight: '600',
  textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.5px', marginTop: '4px',
};

const emptyState = { textAlign: 'center', padding: '40px 20px' };
