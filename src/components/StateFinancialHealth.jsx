import React from 'react';
import './StateFinancialHealth.css';

export default function StateFinancialHealth({ activeState }) {
  const allStates = [
    { name: "Maharashtra", debt: 18.2, gdp: "₹38.79L Cr", alert: false, topSpends: "Infrastructure, Education" },
    { name: "Uttar Pradesh", debt: 32.5, gdp: "₹24.39L Cr", alert: true, topSpends: "Agriculture, Healthcare" },
    { name: "Punjab", debt: 47.6, gdp: "₹6.98L Cr", alert: true, topSpends: "Subsidies, Debt Service" },
    { name: "Karnataka", debt: 22.1, gdp: "₹25.0L Cr", alert: false, topSpends: "IT, Infrastructure" },
    { name: "Delhi", debt: 12.4, gdp: "₹10.5L Cr", alert: false, topSpends: "Education, Transport" },
    { name: "Gujarat", debt: 20.5, gdp: "₹22.3L Cr", alert: false, topSpends: "Power, Industry" },
    { name: "Tamil Nadu", debt: 26.8, gdp: "₹24.8L Cr", alert: true, topSpends: "Welfare, Education" },
    { name: "West Bengal", debt: 35.2, gdp: "₹15.3L Cr", alert: true, topSpends: "Rural Dev, Education" }
  ];

  const states = activeState 
    ? allStates.filter(s => s.name === activeState) 
    : allStates.slice(0, 4);

  const maxDebt = 50; 

  return (
    <section className="business-section">
      <h2 className="column-header">Business &amp; Economy</h2>
      
      <div className="finance-layout">
        <div className="finance-editorial border-right-thin">
          <h3 className="story-headline">
            {activeState ? `${activeState} Fiscal Review: A Closer Look` : "States Face Mounting Fiscal Pressure as Debts Soar"}
          </h3>
          <p className="byline">By Economic Correspondent</p>
          <p className="drop-cap" style={{marginTop: '24px'}}>
            {activeState 
              ? `An independent analysis of ${activeState}'s latest budget reveals key trends in public spending. The primary focus remains on ${states[0]?.topSpends}, reflecting the current administration's priorities.`
              : "A comprehensive review of state finances reveals a widening gap in fiscal prudence. Several states are rapidly approaching the 50% debt-to-GSDP threshold, raising alarms at the central bank."}
          </p>
        </div>

        <div className="finance-infographic">
          <h4 className="chart-title">Debt-to-GSDP Ratio</h4>
          <p className="chart-subtitle">Figures represent percentage of Gross State Domestic Product</p>
          
          <div className="infographic-chart">
            {states.map((state, idx) => (
              <div className="chart-row" key={idx}>
                <div className="chart-label">
                  <span className="state-name">{state.name}</span>
                  <span className="state-gdp">GSDP: {state.gdp}</span>
                </div>
                <div className="chart-bar-container">
                  <div 
                    className={`chart-bar ${state.alert ? 'bar-alert' : ''}`}
                    style={{ width: `${(state.debt / maxDebt) * 100}%`, background: state.alert ? 'var(--accent-red)' : 'var(--text-primary)' }}
                  >
                    <span className="bar-value">{state.debt}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="chart-source">
            Source: Reserve Bank of India, State Finances Report
          </div>
        </div>
      </div>
    </section>
  );
}
