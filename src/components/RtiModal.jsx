import React from 'react';
import { jsPDF } from 'jspdf';

export default function RtiModal({ onClose, department, official }) {
  
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Vintage Gov style PDF generation
    doc.setFont("times", "bold");
    doc.setFontSize(22);
    doc.text("GOVERNMENT OF INDIA", 105, 20, null, null, "center");
    
    doc.setFontSize(14);
    doc.text("RIGHT TO INFORMATION ACT, 2005", 105, 30, null, null, "center");
    doc.text("FORM-A (See Rule 3(1))", 105, 38, null, null, "center");
    
    doc.line(20, 42, 190, 42); // Line
    
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    
    doc.text("To,", 20, 55);
    doc.text(`The Public Information Officer,`, 20, 65);
    doc.text(`${department}`, 20, 75);
    
    doc.text("1. Full Name of Applicant: ________________________", 20, 95);
    doc.text("2. Address: _____________________________________", 20, 105);
    doc.text("            _____________________________________", 20, 115);
    
    doc.setFont("times", "bold");
    doc.text("3. Details of information required:", 20, 135);
    doc.setFont("times", "normal");
    
    const reqText = `Under Section 6 of the RTI Act 2005, I request the financial \nexpenditure logs, tender allocation documents, and internal \nproject memos concerning the jurisdiction overseen by \n${official.name} (${official.title}).`;
    doc.text(reqText, 30, 145);
    
    doc.text("4. Application Fee Details: Attached Postal Order of Rs. 10", 20, 180);
    
    doc.text("Signature of Applicant: _________________", 120, 220);
    doc.text("Date: " + new Date().toLocaleDateString(), 20, 220);
    
    // Save the PDF
    doc.save("RTI_Application_Form.pdf");
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 10000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px'
    }} onClick={onClose}>
      
      <div className="modal-enter" style={{
        backgroundColor: '#f9f6f0', width: '100%', maxWidth: '600px',
        border: '4px solid #1a1a1a', padding: '40px', position: 'relative',
        fontFamily: 'Times New Roman, serif', color: '#1a1a1a',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }} onClick={e => e.stopPropagation()}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', 
          fontSize: '1.5rem', cursor: 'var(--cursor-stamp)', color: '#1a1a1a', fontWeight: 'bold'
        }}>&times;</button>

        <div style={{ textAlign: 'center', borderBottom: '2px solid #1a1a1a', paddingBottom: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', margin: 0 }}>GOVERNMENT OF INDIA</h2>
          <h3 style={{ fontSize: '1.2rem', margin: '8px 0 0 0' }}>Right to Information Act, 2005 - FORM A</h3>
        </div>

        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>
          <p><strong>To:</strong><br/>The Public Information Officer,<br/>{department}</p>
          <br/>
          <p><strong>Subject:</strong> Request for information under section 6(1) of the RTI Act.</p>
          <p style={{ marginTop: '16px', padding: '16px', background: 'rgba(0,0,0,0.05)', border: '1px dashed #1a1a1a' }}>
            Requesting immediate disclosure of financial expenditure logs overseen by <strong>{official.name}</strong> ({official.title}).
          </p>
        </div>
        
        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button 
            className="vintage-stamp stamp-blue" 
            style={{ fontSize: '1.2rem', padding: '12px 24px', background: '#e6dfd1' }}
            onClick={(e) => {
              e.currentTarget.classList.add('stamp-press-anim');
              setTimeout(() => {
                e.currentTarget.classList.remove('stamp-press-anim');
                generatePDF();
              }, 200);
            }}
          >
            DOWNLOAD AS PDF
          </button>
        </div>
        
      </div>
    </div>
  );
}
