import express from 'express';
import SalesMeatPresenter from '../presenters/SalesMeatPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get meat sales statistics
router.get('/stats', async (req, res) => {
  const result = await SalesMeatPresenter.getSalesStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get sales by breed
router.get('/by-breed', async (req, res) => {
  const result = await SalesMeatPresenter.getSalesByBreed();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search meat sale records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await SalesMeatPresenter.searchRecords(term);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by date range
router.get('/date-range', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.status(400).json({ error: 'Start date and end date are required' });
  }
  const result = await SalesMeatPresenter.getRecordsByDateRange(startDate, endDate);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by goat ID
router.get('/goat/:goatId', async (req, res) => {
  const result = await SalesMeatPresenter.getRecordsByGoatId(req.params.goatId);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by buyer
router.get('/buyer/:buyer', async (req, res) => {
  const result = await SalesMeatPresenter.getRecordsByBuyer(req.params.buyer);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by payment method
router.get('/payment/:method', async (req, res) => {
  const result = await SalesMeatPresenter.getRecordsByPaymentMethod(req.params.method);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all meat sale records
router.get('/', async (req, res) => {
  const result = await SalesMeatPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get meat sale record by ID
router.get('/:id', async (req, res) => {
  const result = await SalesMeatPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new meat sale record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await SalesMeatPresenter.createRecord(req.body, performedBy, performedByName);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update meat sale record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await SalesMeatPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete meat sale record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await SalesMeatPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
