import express from 'express';
import searchService from '../services/searchService.js';

const router = express.Router();

/**
 * POST /api/search/goats
 * Search and filter goats
 */
router.post('/goats', async (req, res) => {
  try {
    const results = await searchService.searchGoats(req.body);
    res.json(results);
  } catch (error) {
    console.error('Error searching goats:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/search/health-records
 * Search health records
 */
router.post('/health-records', async (req, res) => {
  try {
    const results = await searchService.searchHealthRecords(req.body);
    res.json(results);
  } catch (error) {
    console.error('Error searching health records:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/search/sales
 * Search sales records
 */
router.post('/sales', async (req, res) => {
  try {
    const results = await searchService.searchSales(req.body);
    res.json(results);
  } catch (error) {
    console.error('Error searching sales:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/search/filter-options
 * Get available filter options
 */
router.get('/filter-options', async (req, res) => {
  try {
    const options = await searchService.getFilterOptions();
    res.json(options);
  } catch (error) {
    console.error('Error getting filter options:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
