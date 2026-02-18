import express from 'express';
import MonthlySummaryPresenter from '../presenters/MonthlySummaryPresenter.js';
import monthlySummaryService from '../services/monthlySummaryService.js';

const router = express.Router();

// ========== AUTO-GENERATE REPORTS ==========

// Generate report for current month
router.post('/generate/current', async (req, res) => {
  try {
    const summary = await monthlySummaryService.generateCurrentMonth();
    res.json({ 
      success: true, 
      message: 'Current month report generated successfully',
      data: summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate report for last month
router.post('/generate/last-month', async (req, res) => {
  try {
    const summary = await monthlySummaryService.generateLastMonth();
    res.json({ 
      success: true, 
      message: 'Last month report generated successfully',
      data: summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate report for specific month
router.post('/generate/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const summary = await monthlySummaryService.generateMonthlySummary(parseInt(year), parseInt(month));
    res.json({ 
      success: true, 
      message: `Report for ${year}-${month} generated successfully`,
      data: summary 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Generate reports for multiple months
router.post('/generate/range', async (req, res) => {
  try {
    const { startYear, startMonth, endYear, endMonth } = req.body;
    
    if (!startYear || !startMonth || !endYear || !endMonth) {
      return res.status(400).json({ 
        success: false, 
        error: 'startYear, startMonth, endYear, and endMonth are required' 
      });
    }
    
    const summaries = await monthlySummaryService.generateMultipleMonths(
      parseInt(startYear), 
      parseInt(startMonth), 
      parseInt(endYear), 
      parseInt(endMonth)
    );
    
    res.json({ 
      success: true, 
      message: `Generated ${summaries.length} monthly reports`,
      data: summaries 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get breakdown details for specific month
router.get('/breakdown/:year/:month', async (req, res) => {
  try {
    const { year, month } = req.params;
    const breakdown = await monthlySummaryService.getMonthBreakdown(parseInt(year), parseInt(month));
    res.json({ 
      success: true, 
      data: breakdown 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// ========== EXISTING ROUTES ==========

// Get summary statistics
router.get('/stats', async (req, res) => {
  const result = await MonthlySummaryPresenter.getSummaryStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get yearly summary
router.get('/yearly', async (req, res) => {
  const result = await MonthlySummaryPresenter.getYearlySummary();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get latest summary
router.get('/latest', async (req, res) => {
  const result = await MonthlySummaryPresenter.getLatestSummary();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search monthly summary records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await MonthlySummaryPresenter.searchRecords(term);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get summaries by date range
router.get('/date-range', async (req, res) => {
  const { startMonth, endMonth } = req.query;
  if (!startMonth || !endMonth) {
    return res.status(400).json({ error: 'Start month and end month are required' });
  }
  const result = await MonthlySummaryPresenter.getRecordsByDateRange(startMonth, endMonth);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get summaries by year
router.get('/year/:year', async (req, res) => {
  const result = await MonthlySummaryPresenter.getRecordsByYear(req.params.year);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get summary by month
router.get('/month/:month', async (req, res) => {
  const result = await MonthlySummaryPresenter.getRecordByMonth(req.params.month);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Get all monthly summary records
router.get('/', async (req, res) => {
  const result = await MonthlySummaryPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get monthly summary record by ID
router.get('/:id', async (req, res) => {
  const result = await MonthlySummaryPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new monthly summary record
router.post('/', async (req, res) => {
  const result = await MonthlySummaryPresenter.createRecord(req.body);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update monthly summary record
router.put('/:id', async (req, res) => {
  const result = await MonthlySummaryPresenter.updateRecord(req.params.id, req.body);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete monthly summary record
router.delete('/:id', async (req, res) => {
  const result = await MonthlySummaryPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: 'Monthly summary record deleted successfully', data: result.data });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
