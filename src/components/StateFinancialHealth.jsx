import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './StateFinancialHealth.css';
import { getTranslation } from '../i18n';

const API_BASE = 'https://civicos-r2sf.onrender.com';

export default function StateFinancialHealth({ activeState, lang }) {
    const [fiscalData, setFiscalData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedState, setSelectedState] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        fetch(`${API_BASE}/api/v1/fiscal-health`)
            .then(res => {
                if (!res.ok) throw new Error('Failed to fetch fiscal data');
                return res.json();
            })
            .then(data => {
                if (data.success && data.data) {
                    setFiscalData(data.data);
                }
            })
            .catch(err => {
                setError('Could not load fiscal records. The ledger office may be closed.');
            })
            .finally(() => setLoading(false));
    }, []);

    const displayData = activeState
        ? fiscalData.filter(d => d.stateName === activeState)
        : fiscalData;

    const sortedData = [...displayData].sort((a, b) => b.debtToGdpRatio - a.debtToGdpRatio);

    const getAlertLevel = (ratio) => {
        if (ratio <= 20) return { label: 'LOW', color: 'var(--accent-green)' };
        if (ratio <= 25) return { label: 'MODERATE', color: 'var(--accent-gold)' };
        return { label: 'HIGH', color: 'var(--accent-red)' };
    };

    const formatCurrency = (cr) => {
        if (cr >= 100000) return `\u20B9${(cr / 100000).toFixed(1)}L Cr`;
        if (cr >= 1000) return `\u20B9${(cr / 1000).toFixed(1)}K Cr`;
        return `\u20B9${cr} Cr`;
    };

    const getGradeStampCls = (grade) => {
        if (grade?.startsWith('A')) return 'stamp-green';
        if (grade === 'B') return 'stamp-blue';
        return 'stamp-red';
    };

    if (loading) {
        return (
            <section className="editorial-story">
                <div className="section-flag">{getTranslation(lang, 'fiscalHealth') || 'STATE FISCAL HEALTH BULLETIN'}</div>
                <div style={{ padding: '48px 0', textAlign: 'center' }}>
                    <div className="vintage-stamp stamp-blue" style={{ display: 'inline-block', animation: 'pulse 1.5s infinite' }}>
                        CONSULTING THE LEDGER...
                    </div>
                    <p style={{ fontFamily: 'Lora', fontStyle: 'italic', marginTop: '16px', color: 'var(--text-secondary)' }}>
                        Retrieving fiscal records from the treasury...
                    </p>
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="editorial-story">
                <div className="section-flag">{getTranslation(lang, 'fiscalHealth') || 'STATE FISCAL HEALTH BULLETIN'}</div>
                <div style={{ padding: '24px', border: '2px solid #8B0000', color: '#8B0000', fontFamily: 'Lora' }}>
                    &#9888; {error}
                </div>
            </section>
        );
    }

    return (
        <section className="editorial-story">
            <div className="section-flag">{getTranslation(lang, 'fiscalHealth') || 'STATE FISCAL HEALTH BULLETIN'}</div>

            {activeState && (
                <h3 style={{ fontFamily: 'Playfair Display SC', fontSize: '1.5rem', marginBottom: '24px' }}>
                    FISCAL REPORT &mdash; {activeState.toUpperCase()}
                </h3>
            )}

            <p style={{ fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '0.95rem' }}>
                FY {sortedData[0]?.financialYear || '2023-24'} &bull; Data sourced from RBI and State Budget Documents
            </p>

            {sortedData.length === 0 ? (
                <div style={{ padding: '48px 0', textAlign: 'center', fontFamily: 'Lora', fontStyle: 'italic', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
                    {activeState ? `No fiscal records available for ${activeState}.` : 'No fiscal records available at this time.'}
                </div>
            ) : (
                <div className="fiscal-table-wrapper">
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 1fr 0.8fr', gap: '4px', fontFamily: 'Playfair Display SC', fontSize: '0.75rem', borderBottom: '3px solid var(--border-color)', paddingBottom: '8px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        <span>State</span>
                        <span>Total Debt</span>
                        <span>Revenue</span>
                        <span>Deficit</span>
                        <span>Debt/GDP</span>
                        <span>Grade</span>
                    </div>

                    {sortedData.map((state, idx) => {
                        const alert = getAlertLevel(state.debtToGdpRatio);
                        return (
                            <div
                                key={state.stateCode}
                                onClick={() => setSelectedState(state)}
                                style={{
                                    display: 'grid',
                                    gridTemplateColumns: '2fr 1.2fr 1.2fr 1fr 1fr 0.8fr',
                                    gap: '4px',
                                    padding: '12px 0',
                                    borderBottom: '1px solid var(--border-color)',
                                    fontFamily: 'Lora',
                                    fontSize: '0.9rem',
                                    cursor: 'var(--cursor-stamp)',
                                    transition: 'background 0.2s',
                                    background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,0,0,0.05)'}
                                onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.02)'}
                            >
                                <span style={{ fontWeight: 'bold', fontFamily: 'Playfair Display' }}>{state.stateName}</span>
                                <span>{formatCurrency(state.totalDebtCr)}</span>
                                <span>{formatCurrency(state.revenueReceiptsCr)}</span>
                                <span style={{ color: alert.color }}>{formatCurrency(state.fiscalDeficitCr)}</span>
                                <span style={{ fontWeight: 'bold', color: alert.color }}>{state.debtToGdpRatio.toFixed(1)}%</span>
                                <span>
                  <span className={`vintage-stamp ${getGradeStampCls(state.fiscalHealthGrade)}`} style={{ fontSize: '0.85rem', padding: '2px 8px' }}>
                    {state.fiscalHealthGrade}
                  </span>
                </span>
                            </div>
                        );
                    })}
                </div>
            )}

            <div style={{ marginTop: '24px', display: 'flex', gap: '24px', justifyContent: 'center', fontFamily: 'Playfair Display SC', fontSize: '0.75rem' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-green)', border: '1px solid #1a1a1a' }}></span> A+ / A (&le;20%)
        </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-gold)', border: '1px solid #1a1a1a' }}></span> B (&le;25%)
        </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ width: '12px', height: '12px', background: 'var(--accent-red)', border: '1px solid #1a1a1a' }}></span> C / D (&gt;25%)
        </span>
            </div>

            <Modal isOpen={!!selectedState} onClose={() => setSelectedState(null)} title={selectedState ? `FISCAL DOSSIER \u2014 ${selectedState.stateName}` : ''} stampType="stamp-blue">
                {selectedState && (
                    <div style={{ fontFamily: 'Lora' }}>
                        <p style={{ marginBottom: '12px' }}><strong>Financial Year:</strong> {selectedState.financialYear}</p>
                        <p style={{ marginBottom: '12px' }}><strong>Total Outstanding Debt:</strong> {'\u20B9'}{selectedState.totalDebtCr?.toLocaleString('en-IN')} Crore</p>
                        <p style={{ marginBottom: '12px' }}><strong>Total Revenue:</strong> {'\u20B9'}{selectedState.revenueReceiptsCr?.toLocaleString('en-IN')} Crore</p>
                        <p style={{ marginBottom: '12px' }}><strong>Fiscal Deficit:</strong> {'\u20B9'}{selectedState.fiscalDeficitCr?.toLocaleString('en-IN')} Crore</p>
                        <p style={{ marginBottom: '12px' }}><strong>Debt-to-GDP Ratio:</strong> {selectedState.debtToGdpRatio?.toFixed(1)}%</p>
                        <p style={{ marginBottom: '12px' }}>
                            <strong>Fiscal Health Grade:</strong>{' '}
                            <span className={`vintage-stamp ${getGradeStampCls(selectedState.fiscalHealthGrade)}`} style={{ fontSize: '1.2rem', padding: '2px 12px' }}>
                {selectedState.fiscalHealthGrade}
              </span>
                        </p>
                        <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '16px' }}>
                            Source: RBI State Finances Report &amp; State Budget Documents
                        </p>
                    </div>
                )}
            </Modal>
        </section>
    );
}