import React from 'react';
import axios from 'axios';
import './ExportButtons.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const ExportButtons = ({ type, params = {} }) => {
  const downloadFile = async (url, filename) => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const blob = new Blob([response.data]);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  const handleExportPDF = () => {
    let url = '';
    let filename = '';

    switch (type) {
      case 'goats':
        url = `${API_URL}/api/reports/pdf/goats-list`;
        filename = `goats-list-${Date.now()}.pdf`;
        break;
      case 'monthly-summary':
        url = `${API_URL}/api/reports/pdf/monthly-summary/${params.year}/${params.month}`;
        filename = `monthly-summary-${params.year}-${params.month}.pdf`;
        break;
      default:
        alert('Unknown export type');
        return;
    }

    downloadFile(url, filename);
  };

  const handleExportExcel = () => {
    let url = '';
    let filename = '';

    switch (type) {
      case 'goats':
        url = `${API_URL}/api/reports/excel/goats`;
        filename = `goats-export-${Date.now()}.xlsx`;
        break;
      case 'sales':
        url = `${API_URL}/api/reports/excel/sales`;
        filename = `sales-export-${Date.now()}.xlsx`;
        break;
      case 'health-records':
        url = `${API_URL}/api/reports/excel/health-records`;
        filename = `health-records-${Date.now()}.xlsx`;
        break;
      case 'monthly-summaries':
        url = `${API_URL}/api/reports/excel/monthly-summaries/${params.year || ''}`;
        filename = `monthly-summaries-${params.year || 'all'}-${Date.now()}.xlsx`;
        break;
      default:
        alert('Unknown export type');
        return;
    }

    downloadFile(url, filename);
  };

  return (
    <div className="export-buttons">
      <button onClick={handleExportPDF} className="export-btn pdf-btn">
        📄 Export PDF
      </button>
      <button onClick={handleExportExcel} className="export-btn excel-btn">
        📊 Export Excel
      </button>
    </div>
  );
};

export default ExportButtons;
