import React, { useState } from 'react';
import India from '@svg-maps/india';
import { stateFiscalHealth, getFiscalColor } from '../regionMap';

export default function IndiaMap({ onStateSelect }) {
  const [hoveredState, setHoveredState] = useState(null);

  // Apply a 3D fold perspective wrapper
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      maxWidth: '650px', 
      margin: '40px auto',
      perspective: '1200px' // For the 3D map fold
    }}>
      <div style={{
        transform: 'rotateX(20deg)',
        transformOrigin: 'bottom center',
        boxShadow: '0 40px 30px -20px rgba(0,0,0,0.5)',
        backgroundColor: 'var(--bg-primary)',
        backgroundImage: 'var(--noise-pattern)',
        border: '2px solid var(--border-color)',
        padding: '24px'
      }}>
        
        {/* Physical map fold lines */}
        <div style={{
          position: 'absolute', top: 0, left: '33%', bottom: 0, width: '1px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)'
        }} />
        <div style={{
          position: 'absolute', top: 0, left: '66%', bottom: 0, width: '1px',
          background: 'linear-gradient(to right, rgba(0,0,0,0.1), transparent)'
        }} />
        <div style={{
          position: 'absolute', top: '50%', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), transparent)'
        }} />

        <svg 
          viewBox={India.viewBox} 
          width="100%" 
          height="100%" 
          style={{ position: 'relative', zIndex: 10 }}
        >
          {India.locations.map(location => {
            const idUpper = location.id.replace('in-', '').toUpperCase();
            const health = stateFiscalHealth[idUpper] || 'medium';
            const isHovered = hoveredState === location.name;
            const baseColor = getFiscalColor(health);

            return (
              <path
                key={location.id}
                id={location.id}
                name={location.name}
                d={location.path}
                onClick={() => onStateSelect(location.id, location.name)}
                onMouseEnter={() => setHoveredState(location.name)}
                onMouseLeave={() => setHoveredState(null)}
                fill={isHovered ? 'var(--text-primary)' : baseColor}
                stroke="var(--border-color)"
                strokeWidth={isHovered ? '2' : '0.5'}
                style={{ 
                  cursor: 'var(--cursor-stamp)', 
                  transition: 'fill 0.1s, stroke-width 0.1s',
                  opacity: isHovered ? 1 : 0.85
                }}
              />
            );
          })}
        </svg>
      </div>
      
      {/* Dynamic Label positioned absolutely below */}
      <div style={{ textAlign: 'center', minHeight: '40px', marginTop: '32px' }}>
        {hoveredState ? (
          <h3 style={{ fontFamily: 'Playfair Display SC', fontSize: '2.5rem', color: 'var(--text-primary)' }}>
            {hoveredState}
          </h3>
        ) : (
          <p style={{ fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
            Map of the Dominion of India. Click a region to view dispatches.
          </p>
        )}
      </div>

      <div style={{
        marginTop: '24px', display: 'flex', justifyContent: 'center', gap: '24px',
        fontFamily: 'Playfair Display SC', fontSize: '0.85rem'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-green)', border: '1px solid #1a1a1a' }}></span> Low Debt
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-gold)', border: '1px solid #1a1a1a' }}></span> Stable
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-red)', border: '1px solid #1a1a1a' }}></span> High Debt
        </span>
      </div>
    </div>
  );
}
