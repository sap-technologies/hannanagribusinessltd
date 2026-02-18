import express from 'express';
import reportService from '../services/reportService.js';
import excelService from '../services/excelService.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

/**
 * GET /api/reports/pdf/monthly-summary/:year/:month
 * Generate and download monthly summary PDF
 */
router.get('/pdf/monthly-summary/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const { fileName, filePath } = await reportService.generateMonthlySummaryPDF(year, month);
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error generating monthly summary PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/pdf/goats-list
 * Generate and download goats inventory PDF
 */
router.get('/pdf/goats-list', async (req, res) => {
  try {
    const { fileName, filePath } = await reportService.generateGoatsListPDF();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error generating goats list PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/pdf/health-summary
 * Generate and download health records summary PDF
 */
router.get('/pdf/health-summary', async (req, res) => {
  try {
    const { fileName, filePath } = await reportService.generateHealthSummaryPDF();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error generating health summary PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/pdf/sales-summary/:year/:month
 * Generate and download sales summary PDF
 */
router.get('/pdf/sales-summary/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const { fileName, filePath } = await reportService.generateSalesSummaryPDF(year, month);
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error generating sales summary PDF:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/excel/goats
 * Export goats to Excel
 */
router.get('/excel/goats', async (req, res) => {
  try {
    const { fileName, filePath } = await excelService.exportGoatsToExcel();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error exporting goats to Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/excel/monthly-summaries/:year?
 * Export monthly summaries to Excel
 */
router.get('/excel/monthly-summaries/:year?', async (req, res) => {
  try {
    const { year } = req.params;
    const { fileName, filePath } = await excelService.exportMonthlySummariesToExcel(year);
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error exporting monthly summaries to Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/excel/sales
 * Export sales to Excel
 */
router.get('/excel/sales', async (req, res) => {
  try {
    const { fileName, filePath } = await excelService.exportSalesToExcel();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error exporting sales to Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/excel/health-records
 * Export health records to Excel
 */
router.get('/excel/health-records', async (req, res) => {
  try {
    const { fileName, filePath } = await excelService.exportHealthRecordsToExcel();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error exporting health records to Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/reports/excel/health
 * Alias for health-records (for backward compatibility)
 */
router.get('/excel/health', async (req, res) => {
  try {
    const { fileName, filePath } = await excelService.exportHealthRecordsToExcel();
    
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ error: 'Failed to download report' });
      }
    });
  } catch (error) {
    console.error('Error exporting health records to Excel:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
