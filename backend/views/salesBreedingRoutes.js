import express from 'express';
import SalesBreedingPresenter from '../presenters/SalesBreedingPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get breeding sales statistics
router.get('/stats', async (req, res) => {
  const result = await SalesBreedingPresenter.getSalesStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get sales by breed
router.get('/by-breed', async (req, res) => {
  const result = await SalesBreedingPresenter.getSalesByBreed();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search breeding sale records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await SalesBreedingPresenter.searchRecords(term);
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
  const result = await SalesBreedingPresenter.getRecordsByDateRange(startDate, endDate);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by goat ID
router.get('/goat/:goatId', async (req, res) => {
  const result = await SalesBreedingPresenter.getRecordsByGoatId(req.params.goatId);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by buyer
router.get('/buyer/:buyer', async (req, res) => {
  const result = await SalesBreedingPresenter.getRecordsByBuyer(req.params.buyer);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by payment method
router.get('/payment/:method', async (req, res) => {
  const result = await SalesBreedingPresenter.getRecordsByPaymentMethod(req.params.method);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all breeding sale records
router.get('/', async (req, res) => {
  const result = await SalesBreedingPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get breeding sale record by ID
router.get('/:id', async (req, res) => {
  const result = await SalesBreedingPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new breeding sale record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await SalesBreedingPresenter.createRecord(req.body, performedBy, performedByName);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update breeding sale record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await SalesBreedingPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete breeding sale record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await SalesBreedingPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
