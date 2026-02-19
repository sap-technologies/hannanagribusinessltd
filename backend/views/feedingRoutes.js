import express from 'express';
import FeedingPresenter from '../presenters/FeedingPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get feeding statistics
router.get('/stats', async (req, res) => {
  const result = await FeedingPresenter.getFeedingStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get feed consumption by type
router.get('/consumption-by-type', async (req, res) => {
  const result = await FeedingPresenter.getFeedConsumptionByType();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search feeding records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await FeedingPresenter.searchRecords(term);
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
  const result = await FeedingPresenter.getRecordsByDateRange(startDate, endDate);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by goat ID
router.get('/goat/:goatId', async (req, res) => {
  const result = await FeedingPresenter.getRecordsByGoatId(req.params.goatId);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by group
router.get('/group/:groupName', async (req, res) => {
  const result = await FeedingPresenter.getRecordsByGroup(req.params.groupName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by purpose (Maintenance or Fattening)
router.get('/purpose/:purpose', async (req, res) => {
  const result = await FeedingPresenter.getRecordsByPurpose(req.params.purpose);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all feeding records
router.get('/', async (req, res) => {
  const result = await FeedingPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get feeding record by ID
router.get('/:id', async (req, res) => {
  const result = await FeedingPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new feeding record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await FeedingPresenter.createRecord(req.body, performedBy, performedByName);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update feeding record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await FeedingPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete feeding record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await FeedingPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
