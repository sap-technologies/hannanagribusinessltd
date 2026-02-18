import React, { useState } from 'react';
import { reportService } from '../services/api';
import './GenerateReport.css';

const GenerateReport = ({ onReportGenerated }) => {
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [showPDFReports, setShowPDFReports] = useState(false);
  const [showExcelExports, setShowExcelExports] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [message, setMessage] = useState({ text: '', type: '' });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1230';

  const showMessage = (text, type = 'success') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const downloadBlob = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const generateCurrentMonth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/breeding-farm/monthly-summary/generate/current`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage('✅ Current month report generated successfully!', 'success');
        if (onReportGenerated) onReportGenerated();
      } else {
        showMessage(`❌ ${data.error}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Failed to generate report: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateLastMonth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/breeding-farm/monthly-summary/generate/last-month`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage('✅ Last month report generated successfully!', 'success');
        if (onReportGenerated) onReportGenerated();
      } else {
        showMessage(`❌ ${data.error}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Failed to generate report: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateSpecificMonth = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/breeding-farm/monthly-summary/generate/${selectedYear}/${selectedMonth}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage(`✅ Report for ${selectedYear}-${selectedMonth.toString().padStart(2, '0')} generated successfully!`, 'success');
        if (onReportGenerated) onReportGenerated();
        setShowOptions(false);
      } else {
        showMessage(`❌ ${data.error}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Failed to generate report: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const generateYearReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/api/breeding-farm/monthly-summary/generate/range`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          startYear: selectedYear,
          startMonth: 1,
          endYear: selectedYear,
          endMonth: 12
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        showMessage(`✅ Generated ${data.data.length} reports for ${selectedYear}!`, 'success');
        if (onReportGenerated) onReportGenerated();
        setShowOptions(false);
      } else {
        showMessage(`❌ ${data.error}`, 'error');
      }
    } catch (error) {
      showMessage(`❌ Failed to generate reports: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // PDF Download Functions
  const downloadMonthlySummaryPDF = async () => {
    setLoading(true);
    try {
      const blob = await reportService.generateMonthlySummaryPDF(selectedYear, selectedMonth);
      downloadBlob(blob, `monthly-summary-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.pdf`);
      showMessage('✅ Monthly Summary PDF downloaded!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to download PDF: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadGoatsInventoryPDF = async () => {
    setLoading(true);
    try {
      const blob = await reportService.generateGoatsListPDF();
      downloadBlob(blob, `goats-inventory-${new Date().toISOString().split('T')[0]}.pdf`);
      showMessage('✅ Goats Inventory PDF downloaded!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to download PDF: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadHealthSummaryPDF = async () => {
    setLoading(true);
    try {
      const blob = await reportService.generateHealthSummaryPDF();
      downloadBlob(blob, `health-summary-${new Date().toISOString().split('T')[0]}.pdf`);
      showMessage('✅ Health Summary PDF downloaded!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to download PDF: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const downloadSalesSummaryPDF = async () => {
    setLoading(true);
    try {
      const blob = await reportService.generateSalesSummaryPDF(selectedYear, selectedMonth);
      downloadBlob(blob, `sales-summary-${selectedYear}-${String(selectedMonth).padStart(2, '0')}.pdf`);
      showMessage('✅ Sales Summary PDF downloaded!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to download PDF: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Excel Export Functions
  const exportGoatsToExcel = async () => {
    setLoading(true);
    try {
      const blob = await reportService.exportGoatsToExcel();
      downloadBlob(blob, `goats-export-${new Date().toISOString().split('T')[0]}.xlsx`);
      showMessage('✅ Goats data exported to Excel!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to export: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportHealthToExcel = async () => {
    setLoading(true);
    try {
      const blob = await reportService.exportHealthToExcel();
      downloadBlob(blob, `health-records-${new Date().toISOString().split('T')[0]}.xlsx`);
      showMessage('✅ Health records exported to Excel!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to export: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const exportSalesToExcel = async () => {
    setLoading(true);
    try {
      const blob = await reportService.exportSalesToExcel();
      downloadBlob(blob, `sales-records-${new Date().toISOString().split('T')[0]}.xlsx`);
      showMessage('✅ Sales records exported to Excel!', 'success');
    } catch (error) {
      showMessage(`❌ Failed to export: ${error.message}`, 'error');
    } finally {
      setLoading(false);
    }
  };

  const years = [];
  const currentYear = new Date().getFullYear();
  for (let y = currentYear - 2; y <= currentYear; y++) {
    years.push(y);
  }

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  return (
    <div className="generate-report-container">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="generate-report-header">
        <h3>📊 Reports & Exports</h3>
        <p className="subtitle">Generate reports and export data in multiple formats</p>
      </div>

      {/* Section 1: Auto-Generate Monthly Reports */}
      <div className="report-section">
        <div className="section-header">
          <h4>🤖 Auto-Generate Monthly Reports</h4>
          <p>System automatically calculates reports from your actual data</p>
        </div>

        <div className="quick-actions">
          <button 
            onClick={generateCurrentMonth} 
            disabled={loading}
            className="btn-generate current"
          >
            {loading ? '⏳ Generating...' : '📅 Generate Current Month'}
          </button>
          
          <button 
            onClick={generateLastMonth} 
            disabled={loading}
            className="btn-generate last"
          >
            {loading ? '⏳ Generating...' : '📆 Generate Last Month'}
          </button>

          <button 
            onClick={() => setShowOptions(!showOptions)} 
            disabled={loading}
            className="btn-generate custom"
          >
            {showOptions ? '✕ Close Options' : '⚙️ Custom Options'}
          </button>
        </div>

        {showOptions && (
          <div className="custom-options">
            <div className="option-group">
              <h5>Generate Specific Month</h5>
              <div className="input-row">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
                <button 
                  onClick={generateSpecificMonth} 
                  disabled={loading}
                  className="btn-action"
                >
                  Generate
                </button>
              </div>
            </div>

            <div className="option-group">
              <h5>Generate All Months for Year</h5>
              <div className="input-row">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <button 
                  onClick={generateYearReports} 
                  disabled={loading}
                  className="btn-action"
                >
                  Generate All 12 Months
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Section 2: PDF Reports */}
      <div className="report-section">
        <div className="section-header">
          <h4>📄 PDF Reports</h4>
          <button 
            onClick={() => setShowPDFReports(!showPDFReports)}
            className="btn-toggle"
          >
            {showPDFReports ? '▼ Hide' : '▶ Show'}
          </button>
        </div>

        {showPDFReports && (
          <div className="reports-grid">
            <div className="report-card">
              <div className="report-icon">📊</div>
              <h5>Monthly Summary PDF</h5>
              <p>Financial summary with goat movements</p>
              <div className="input-row-small">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={downloadMonthlySummaryPDF}
                disabled={loading}
                className="btn-download"
              >
                📥 Download PDF
              </button>
            </div>

            <div className="report-card">
              <div className="report-icon">🐐</div>
              <h5>Goats Inventory PDF</h5>
              <p>Complete list of all goats with details</p>
              <button 
                onClick={downloadGoatsInventoryPDF}
                disabled={loading}
                className="btn-download"
              >
                📥 Download PDF
              </button>
            </div>

            <div className="report-card">
              <div className="report-icon">🏥</div>
              <h5>Health Summary PDF</h5>
              <p>Health records and treatment history</p>
              <button 
                onClick={downloadHealthSummaryPDF}
                disabled={loading}
                className="btn-download"
              >
                📥 Download PDF
              </button>
            </div>

            <div className="report-card">
              <div className="report-icon">💰</div>
              <h5>Sales Summary PDF</h5>
              <p>Monthly sales report (breeding & meat)</p>
              <div className="input-row-small">
                <select 
                  value={selectedYear} 
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                >
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
                <select 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(Number(e.target.value))}
                >
                  {months.map(month => (
                    <option key={month.value} value={month.value}>{month.label}</option>
                  ))}
                </select>
              </div>
              <button 
                onClick={downloadSalesSummaryPDF}
                disabled={loading}
                className="btn-download"
              >
                📥 Download PDF
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Excel Exports */}
      <div className="report-section">
        <div className="section-header">
          <h4>📗 Excel Exports</h4>
          <button 
            onClick={() => setShowExcelExports(!showExcelExports)}
            className="btn-toggle"
          >
            {showExcelExports ? '▼ Hide' : '▶ Show'}
          </button>
        </div>

        {showExcelExports && (
          <div className="reports-grid">
            <div className="report-card excel">
              <div className="report-icon">🐐</div>
              <h5>Goats Data Export</h5>
              <p>All goat records in Excel format</p>
              <button 
                onClick={exportGoatsToExcel}
                disabled={loading}
                className="btn-download excel"
              >
                📥 Export to Excel
              </button>
            </div>

            <div className="report-card excel">
              <div className="report-icon">🏥</div>
              <h5>Health Records Export</h5>
              <p>All health and treatment records</p>
              <button 
                onClick={exportHealthToExcel}
                disabled={loading}
                className="btn-download excel"
              >
                📥 Export to Excel
              </button>
            </div>

            <div className="report-card excel">
              <div className="report-icon">💰</div>
              <h5>Sales Records Export</h5>
              <p>All sales transactions (breeding & meat)</p>
              <button 
                onClick={exportSalesToExcel}
                disabled={loading}
                className="btn-download excel"
              >
                📥 Export to Excel
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="info-box">
        <h4>ℹ️ Report Information</h4>
        <ul>
          <li>✅ Auto-generated reports are calculated from your actual data</li>
          <li>✅ PDF reports are formatted for printing and sharing</li>
          <li>✅ Excel exports allow further data analysis</li>
          <li>✅ All reports include the latest data at download time</li>
        </ul>
      </div>
    </div>
  );
};

export default GenerateReport;
