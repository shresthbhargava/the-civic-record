import React, { useState } from 'react';
import Modal from './Modal';
import './ProjectTracker.css';
import { getTranslation } from '../i18n';

export default function ProjectTracker({ activeState, lang }) {
  const [activeProject, setActiveProject] = useState(null);

  const projects = [
    {
      id: "PRJ-992",
      title: "Expressway Expansion Phase 1",
      ministry: "MoRTH",
      budget: "₹1,00,000 Cr",
      status: "ON SCHEDULE",
      statusColor: 'var(--accent-green)',
      notes: "Toll infrastructure pending.",
      state: "Maharashtra"
    },
    {
      id: "PRJ-410",
      title: "Jal Jeevan Mission Pipeline",
      ministry: "Jal Shakti",
      budget: "₹3,60,000 Cr",
      status: "DELAYED",
      statusColor: 'var(--accent-red)',
      notes: "Awaiting state clearances.",
      state: "Uttar Pradesh"
    },
    {
      id: "PRJ-881",
      title: "Urban Broadband Network",
      ministry: "MeitY",
      budget: "₹61,000 Cr",
      status: "AUDIT PENDING",
      statusColor: 'var(--accent-gold)',
      notes: "Final auditing in progress.",
      state: "Karnataka"
    }
  ];

  const filteredProjects = activeState 
    ? projects.filter(p => p.state === activeState)
    : projects;

  return (
    <section className="classifieds-section" style={{ breakInside: 'avoid' }}>
      <div className="section-flag">{getTranslation(lang, 'publicTenders')}</div>
      
      <div className="classifieds-layout">
        <div className="classified-intro border-right-thin">
          <p style={{fontStyle: 'italic', marginBottom: '16px'}}>
            A comprehensive listing of ongoing infrastructure and development projects {activeState ? `in ${activeState}` : 'nationwide'}. Information verified via official ministry channels.
          </p>
          <div style={{ border: '2px solid var(--border-color)', padding: '16px', background: 'rgba(0,0,0,0.02)' }}>
            <h4 style={{fontFamily: 'Playfair Display SC, serif', marginBottom: '8px'}}>NOTICE TO CONTRACTORS</h4>
            <p style={{fontSize: '0.85rem'}}>All project discrepancies must be reported to the central oversight committee within 14 business days of publication.</p>
          </div>
        </div>

        <div className="classified-list">
          {filteredProjects.length > 0 ? filteredProjects.map((project, idx) => (
            <div 
              className="classified-item border-bottom-thin" 
              key={idx} 
              onClick={() => setActiveProject(project)}
              style={{ cursor: 'var(--cursor-stamp)', transition: 'background 0.2s', padding: '16px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.03)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
            >
              <div>
                <div className="classified-id" style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>Ref. {project.id}</div>
                <h4 className="classified-title" style={{ fontFamily: 'Playfair Display SC', fontSize: '1.4rem' }}>{project.title}</h4>
                <p className="classified-desc" style={{ fontSize: '0.9rem' }}>
                  <strong>Ministry:</strong> {project.ministry} &bull; <strong>Budget:</strong> {project.budget}
                </p>
              </div>
              <div className="vintage-stamp" style={{ color: project.statusColor, transform: 'rotate(-2deg)' }}>
                {project.status}
              </div>
            </div>
          )) : (
            <p style={{fontStyle: 'italic', padding: '16px'}}>No active public tenders listed for this region at this time.</p>
          )}
        </div>
      </div>

      <Modal 
        isOpen={!!activeProject} 
        onClose={() => setActiveProject(null)}
        title={activeProject?.title}
        subtitle={`Project Reference: ${activeProject?.id}`}
        stampType={activeProject?.status}
      >
        <p><strong>Executing Ministry:</strong> {activeProject?.ministry}</p>
        <p><strong>Allocated Budget:</strong> {activeProject?.budget}</p>
        <p><strong>Field Notes:</strong> {activeProject?.notes}</p>
        <div style={{marginTop: '24px', padding: '16px', border: '1px dashed var(--border-color)', background: 'rgba(0,0,0,0.03)'}}>
          <h4 style={{fontFamily: 'Playfair Display SC', marginBottom: '8px'}}>Citizen Oversight</h4>
          <p style={{fontSize: '0.9rem'}}>This project is subject to mandatory public auditing under the Transparency in Infrastructure Act.</p>
        </div>
      </Modal>
    </section>
  );
}
