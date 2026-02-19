import express from 'express';
import KidGrowthPresenter from '../presenters/KidGrowthPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// View - Routes for Kid Growth & Weaning operations

// Get all growth records
router.get('/', async (req, res) => {
  const result = await KidGrowthPresenter.getAllRecords();
  res.json(result);
});

// Get growth statistics
router.get('/stats', async (req, res) => {
  const result = await KidGrowthPresenter.getGrowthStats();
  res.json(result);
});

// Get kids ready for weaning
router.get('/ready-for-weaning', async (req, res) => {
  const result = await KidGrowthPresenter.getReadyForWeaning();
  res.json(result);
});

// Search growth records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.json({ success: false, message: 'Search term is required' });
  }
  const result = await KidGrowthPresenter.searchRecords(term);
  res.json(result);
});

// Get growth record by ID
router.get('/:id', async (req, res) => {
  const result = await KidGrowthPresenter.getRecordById(req.params.id);
  res.json(result);
});

// Get growth record by kid ID
router.get('/kid/:kidId', async (req, res) => {
  const result = await KidGrowthPresenter.getRecordByKidId(req.params.kidId);
  res.json(result);
});

// Get records by target market
router.get('/market/:targetMarket', async (req, res) => {
  const result = await KidGrowthPresenter.getRecordsByTargetMarket(req.params.targetMarket);
  res.json(result);
});

// Create new growth record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await KidGrowthPresenter.createRecord(req.body, performedBy, performedByName);
  res.json(result);
});

// Update growth record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await KidGrowthPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  res.json(result);
});

// Delete growth record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await KidGrowthPresenter.deleteRecord(req.params.id);
  res.json(result);
});

export default router;
