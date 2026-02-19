import express from 'express';
import BreedingPresenter from '../presenters/BreedingPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// View - Routes for Breeding & Kidding operations

// Get all breeding records
router.get('/', async (req, res) => {
  const result = await BreedingPresenter.getAllRecords();
  res.json(result);
});

// Get breeding statistics
router.get('/stats', async (req, res) => {
  const result = await BreedingPresenter.getBreedingStats();
  res.json(result);
});

// Get upcoming kidding dates
router.get('/upcoming', async (req, res) => {
  const result = await BreedingPresenter.getUpcomingKidding();
  res.json(result);
});

// Search breeding records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.json({ success: false, message: 'Search term is required' });
  }
  const result = await BreedingPresenter.searchRecords(term);
  res.json(result);
});

// Get breeding record by ID
router.get('/:id', async (req, res) => {
  const result = await BreedingPresenter.getRecordById(req.params.id);
  res.json(result);
});

// Get breeding records by doe
router.get('/doe/:doeId', async (req, res) => {
  const result = await BreedingPresenter.getRecordsByDoe(req.params.doeId);
  res.json(result);
});

// Get breeding records by buck
router.get('/buck/:buckId', async (req, res) => {
  const result = await BreedingPresenter.getRecordsByBuck(req.params.buckId);
  res.json(result);
});

// Create new breeding record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await BreedingPresenter.createRecord(req.body, performedBy, performedByName);
  res.json(result);
});

// Update breeding record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await BreedingPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  res.json(result);
});

// Delete breeding record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await BreedingPresenter.deleteRecord(req.params.id);
  res.json(result);
});

export default router;
