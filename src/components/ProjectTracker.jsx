import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './ProjectTracker.css';
import { getTranslation } from '../i18n';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function ProjectTracker({ activeState, lang }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_BASE}/api/v1/projects/active`)
        .then(res => {
          if (!res.ok) throw new Error('Failed to fetch projects');
          return res.json();
        })
        .then(data => {
            if (data.success && Array.isArray(data.data)) {
                setProjects(data.data);
            }
        })
        .catch(err => {
          setError('Could not load project records. The works department is unreachable.');
        })
        .finally(() => setLoading(false));
  }, []);

  const displayProjects = projects;

  const getStatusStamp = (status) => {
        switch (status) {
            case 'ACTIVE':
            case 'IN_PROGRESS': return { label: 'IN PROGRESS', cls: 'stamp-blue' };
            case 'COMPLETED': return { label: 'COMPLETED', cls: 'stamp-green' };
            case 'ON_HOLD': return { label: 'ON HOLD', cls: 'stamp-red' };
            default: return { label: status || 'UNKNOWN', cls: 'stamp-blue' };
        }
    };

  const getProgressColor = (pct) => {
    if (pct >= 75) return 'var(--accent-green)';
    if (pct >= 40) return 'var(--accent-gold)';
    return 'var(--accent-red)';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'TBD';
    return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  if (loading) {
    return (
        <section className="editorial-story">
          <div className="section-flag">{getTranslation(lang, 'projectTracker') || 'NATIONAL PROJECT TRACKER'}</div>
          <div style={{ padding: '48px 0', textAlign: 'center' }}>
            <div className="vintage-stamp stamp-blue" style={{ display: 'inline-block', opacity: 0.7 }}>
              SURVEYING WORKSITES...
            </div>
            <p className="typewriter-text" style={{ fontFamily: 'Lora', fontStyle: 'italic', marginTop: '16px', color: 'var(--text-secondary)' }}>
              Retrieving project progress from field offices...
            </p>
          </div>
        </section>
    );
  }

  if (error) {
    return (
        <section className="editorial-story">
          <div className="section-flag">{getTranslation(lang, 'projectTracker') || 'NATIONAL PROJECT TRACKER'}</div>
          <div style={{ padding: '24px', border: '2px solid #8B0000', color: '#8B0000', fontFamily: 'Lora' }}>
            &#9888; {error}
          </div>
        </section>
    );
  }

  return (
      <section className="editorial-story">
        <div className="section-flag">{getTranslation(lang, 'projectTracker') || 'NATIONAL PROJECT TRACKER'}</div>

        <p style={{ fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
          Tracking {displayProjects.length} active government project{displayProjects.length !== 1 ? 's' : ''} across India
        </p>

        {displayProjects.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
              {activeState ? `No active projects tracked in ${activeState}.` : 'No active projects being tracked at this time.'}
            </div>
        ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {displayProjects.map((project) => {
                const stamp = getStatusStamp(project.status);
                const pct = project.completionPercentage || 0;
                return (
                    <div
                        key={project.id}
                        onClick={() => setSelectedProject(project)}
                        style={{
                          padding: '20px',
                          border: '2px solid var(--border-color)',
                          cursor: 'var(--cursor-stamp)',
                          transition: 'all 0.2s',
                          background: 'rgba(0,0,0,0.01)',
                          position: 'relative'
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.04)'; e.currentTarget.style.borderColor = 'var(--text-primary)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.01)'; e.currentTarget.style.borderColor = 'var(--border-color)'; }}
                    >
                      <div className={`vintage-stamp ${stamp.cls}`} style={{ position: 'absolute', top: '12px', right: '12px', fontSize: '0.7rem' }}>
                        {stamp.label}
                      </div>

                      <h4 style={{ fontFamily: 'Playfair Display SC', fontSize: '1.3rem', marginBottom: '8px', paddingRight: '120px', lineHeight: '1.2' }}>
                        {project.name?.toUpperCase()}
                      </h4>

                      <div style={{ display: 'flex', gap: '24px', fontFamily: 'Lora', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '12px', flexWrap: 'wrap' }}>
                        <span>Ministry: <strong style={{ color: 'var(--text-primary)' }}>{project.ministry}</strong></span>
                          {project.stateCode && <span>State: <strong style={{ color: 'var(--text-primary)' }}>{project.stateCode}</strong></span>}
                      </div>

                      {project.description && (
                          <p style={{ fontFamily: 'Lora', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '16px', color: 'var(--text-secondary)' }}>
                            {project.description.length > 200 ? project.description.substring(0, 200) + '...' : project.description}
                          </p>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, height: '8px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                          <div style={{ height: '100%', width: `${Math.min(pct, 100)}%`, background: getProgressColor(pct), transition: 'width 1s ease' }} />
                        </div>
                        <span style={{ fontFamily: 'Playfair Display SC', fontWeight: 'bold', fontSize: '0.9rem', minWidth: '40px' }}>
                    {pct.toFixed(0)}%
                  </span>
                      </div>

                      <div style={{ display: 'flex', gap: '24px', fontFamily: 'Lora', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px', flexWrap: 'wrap' }}>
                        <span>Budget: {'\u20B9'}{project.totalBudgetCr?.toLocaleString('en-IN')} Cr</span>
                        <span>Spent: {'\u20B9'}{project.spentCr?.toLocaleString('en-IN')} Cr</span>
                        <span>Target: {formatDate(project.targetCompletionDate)}</span>
                      </div>
                    </div>
                );
              })}
            </div>
        )}

        <Modal
            isOpen={!!selectedProject}
            onClose={() => setSelectedProject(null)}
            title={selectedProject ? `PROJECT DOSSIER \u2014 ${selectedProject.name?.toUpperCase()}` : ''}
            stampType="stamp-blue"
        >
          {selectedProject && (
              <div style={{ fontFamily: 'Lora' }}>
                {selectedProject.description && (
                    <p style={{ marginBottom: '16px', lineHeight: '1.6' }}>{selectedProject.description}</p>
                )}
                <p style={{ marginBottom: '12px' }}><strong>Implementing Agency:</strong> {selectedProject.implementingAgency || 'N/A'}</p>
                <p style={{ marginBottom: '12px' }}><strong>Ministry:</strong> {selectedProject.ministry}</p>
                <p style={{ marginBottom: '12px' }}><strong>State:</strong> {selectedProject.stateName} ({selectedProject.stateCode})</p>
                <p style={{ marginBottom: '12px' }}><strong>Total Budget:</strong> {'\u20B9'}{selectedProject.totalBudgetCr?.toLocaleString('en-IN')} Crore</p>
                <p style={{ marginBottom: '12px' }}><strong>Expenditure:</strong> {'\u20B9'}{selectedProject.spentCr?.toLocaleString('en-IN')} Crore</p>
                <p style={{ marginBottom: '12px' }}><strong>Start Date:</strong> {formatDate(selectedProject.startDate)}</p>
                <p style={{ marginBottom: '12px' }}><strong>Target Completion:</strong> {formatDate(selectedProject.targetCompletionDate)}</p>
                <div style={{ marginBottom: '12px' }}>
                  <strong>Completion: {selectedProject.completionPercentage?.toFixed(1)}%</strong>
                  <div style={{ marginTop: '8px', height: '10px', background: 'rgba(0,0,0,0.1)', border: '1px solid var(--border-color)' }}>
                    <div style={{ height: '100%', width: `${Math.min(selectedProject.completionPercentage || 0, 100)}%`, background: getProgressColor(selectedProject.completionPercentage || 0) }} />
                  </div>
                </div>
                <p style={{ marginBottom: '12px' }}>
                  <strong>Status:</strong>{' '}
                  <span className={`vintage-stamp ${getStatusStamp(selectedProject.status).cls}`} style={{ fontSize: '0.9rem', padding: '2px 10px' }}>
                {getStatusStamp(selectedProject.status).label}
              </span>
                </p>
              </div>
          )}
        </Modal>
      </section>
  );
}