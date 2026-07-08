import React from 'react';
import ReactDOM from 'react-dom';

export default function Modal({ isOpen, onClose, title, subtitle, children, stampType }) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)',
      zIndex: 10000,
      display: 'flex', overflowY: 'auto',
      alignItems: 'safe center',
      justifyContent: 'center',
      padding: '24px', paddingTop: '2vh'
    }} onClick={onClose}>
      
      <div style={{
        backgroundColor: 'var(--bg-primary)',
        width: '100%',
        maxWidth: '800px',
        maxHeight: '90vh',
        overflowY: 'auto',
        border: '4px solid var(--border-color)',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px',
          background: 'none', border: 'none', fontSize: '1.5rem',
          cursor: 'var(--cursor-stamp)', color: 'var(--border-color)', fontWeight: 'bold'
        }}>&times;</button>

        <div style={{ display: 'flex', overflowY: 'auto', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '2px solid var(--border-color)', paddingBottom: '16px', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontFamily: 'Playfair Display SC', fontSize: '2.5rem', marginBottom: '8px', paddingRight: '16px' }}>{title}</h2>
            {subtitle && <p style={{ fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{subtitle}</p>}
          </div>
          {stampType && typeof stampType === 'string' && (
            <div className={`vintage-stamp ${stampType.includes('DELAYED') ? 'stamp-red' : 'stamp-blue'}`} style={{ fontSize: '1rem', whiteSpace: 'nowrap', marginTop: '12px' }}>
              {stampType}
            </div>
          )}
        </div>

        <div style={{ fontFamily: 'Lora', lineHeight: '1.8' }}>
          {children}
        </div>
        
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}
