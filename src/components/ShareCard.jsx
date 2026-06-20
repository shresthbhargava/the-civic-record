import React, { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function ShareCard({ onClose, data }) {
  const cardRef = useRef(null);
  const [imgUrl, setImgUrl] = useState(null);

  useEffect(() => {
    // Generate image on mount
    if (cardRef.current) {
      setTimeout(() => {
        html2canvas(cardRef.current, {
          backgroundColor: '#F5F0E8',
          scale: 2 // High resolution
        }).then(canvas => {
          setImgUrl(canvas.toDataURL('image/jpeg', 0.9));
        });
      }, 500); // Wait for fonts/layout to settle
    }
  }, []);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.9)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
      flexDirection: 'column'
    }} onClick={onClose}>
      
      <button onClick={onClose} style={{
        position: 'absolute', top: '24px', right: '32px', background: 'none', border: 'none', 
        fontSize: '2rem', color: '#fff', cursor: 'var(--cursor-stamp)'
      }}>&times;</button>

      {/* HIDDEN DOM ELEMENT FOR CANVAS GENERATION */}
      <div style={{ position: 'absolute', top: '-9999px', left: '-9999px' }}>
        <div ref={cardRef} style={{
          width: '600px', padding: '32px', backgroundColor: '#F5F0E8',
          fontFamily: 'Lora, serif', color: '#1A1A1A', border: '8px solid #1A1A1A'
        }}>
          <div style={{ borderBottom: '4px solid #1A1A1A', paddingBottom: '16px', marginBottom: '24px', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'Playfair Display SC, serif', fontSize: '3rem', margin: 0, lineHeight: 1 }}>THE CIVIC RECORD</h1>
            <p style={{ fontStyle: 'italic', margin: '8px 0 0 0' }}>Printed & Verified &bull; {data.date}</p>
          </div>
          <div style={{ display: 'inline-block', background: '#1a1a1a', color: '#F5F0E8', padding: '4px 8px', fontFamily: 'Playfair Display SC', fontWeight: 'bold', marginBottom: '16px' }}>
            BREAKING INVESTIGATION
          </div>
          <h2 style={{ fontFamily: 'Playfair Display SC, serif', fontSize: '2.5rem', lineHeight: 1.1, marginBottom: '16px' }}>
            {data.headline}
          </h2>
          <p style={{ fontSize: '1.2rem', fontWeight: 'bold', borderLeft: '4px solid #1a1a1a', paddingLeft: '16px', marginBottom: '24px' }}>
            Department: {data.department} <br/>
            Accountability Score: {data.score}
          </p>
          <p style={{ fontStyle: 'italic', fontSize: '1.1rem' }}>
            "The public purse is not a bottomless well. Accountability must be enforced."
          </p>
        </div>
      </div>

      {/* DISPLAY GENERATED IMAGE */}
      <h3 style={{ color: '#fff', fontFamily: 'Playfair Display SC', marginBottom: '24px' }}>Your Clipping is Ready</h3>
      
      {imgUrl ? (
        <div style={{ textAlign: 'center' }}>
          <img src={imgUrl} alt="Newspaper Clipping" style={{ maxWidth: '100%', maxHeight: '60vh', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', border: '2px solid #fff' }} onClick={e => e.stopPropagation()} />
          
          <div style={{ marginTop: '32px', display: 'flex', gap: '16px', justifyContent: 'center' }} onClick={e => e.stopPropagation()}>
            <a 
              href={imgUrl} 
              download="Civic_Record_Clipping.jpg"
              className="vintage-stamp stamp-red"
              style={{ background: '#F5F0E8', textDecoration: 'none', color: '#8B0000', padding: '12px 24px', fontSize: '1.2rem' }}
            >
              DOWNLOAD IMAGE
            </a>
            
            <a 
              href={`https://wa.me/?text=Read%20the%20full%20investigation%20at%20The%20Civic%20Record:%20https://thecivicrecord.in`}
              target="_blank" rel="noopener noreferrer"
              className="vintage-stamp stamp-blue"
              style={{ background: '#25D366', color: '#fff', borderColor: '#fff', textDecoration: 'none', padding: '12px 24px', fontSize: '1.2rem' }}
            >
              SHARE ON WHATSAPP
            </a>
          </div>
          <p style={{ color: '#aaa', marginTop: '16px', fontSize: '0.9rem', fontStyle: 'italic' }}>Tip: On mobile, long-press the image to copy or share directly to WhatsApp.</p>
        </div>
      ) : (
        <p style={{ color: '#fff', fontStyle: 'italic' }}>Typesetting your clipping...</p>
      )}

    </div>
  );
}
