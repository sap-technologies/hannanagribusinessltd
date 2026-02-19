import express from 'express';
import HealthPresenter from '../presenters/HealthPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// View - Routes for Health & Treatment operations

// Get all health records
router.get('/', async (req, res) => {
  const result = await HealthPresenter.getAllRecords();
  res.json(result);
});

// Get health statistics
router.get('/stats', async (req, res) => {
  const result = await HealthPresenter.getHealthStats();
  res.json(result);
});

// Get pending follow-up records
router.get('/pending-followup', async (req, res) => {
  const result = await HealthPresenter.getPendingFollowUp();
  res.json(result);
});

// Search health records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.json({ success: false, message: 'Search term is required' });
  }
  const result = await HealthPresenter.searchRecords(term);
  res.json(result);
});

// Get costs by date range
router.get('/costs', async (req, res) => {
  const { startDate, endDate } = req.query;
  if (!startDate || !endDate) {
    return res.json({ success: false, message: 'Start date and end date are required' });
  }
  const result = await HealthPresenter.getCostsByDateRange(startDate, endDate);
  res.json(result);
});

// Get health record by ID
router.get('/:id', async (req, res) => {
  const result = await HealthPresenter.getRecordById(req.params.id);
  res.json(result);
});

// Get health records by goat ID
router.get('/goat/:goatId', async (req, res) => {
  const result = await HealthPresenter.getRecordsByGoatId(req.params.goatId);
  res.json(result);
});

// Get records by recovery status
router.get('/status/:status', async (req, res) => {
  const result = await HealthPresenter.getRecordsByRecoveryStatus(req.params.status);
  res.json(result);
});

// Create new health record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await HealthPresenter.createRecord(req.body, performedBy, performedByName);
  res.json(result);
});

// Update health record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await HealthPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  res.json(result);
});

// Delete health record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await HealthPresenter.deleteRecord(req.params.id);
  res.json(result);
});

export default router;
