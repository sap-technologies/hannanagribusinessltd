import express from 'express';
import VaccinationPresenter from '../presenters/VaccinationPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get vaccination statistics
router.get('/stats', async (req, res) => {
  const result = await VaccinationPresenter.getVaccinationStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get upcoming due vaccinations
router.get('/upcoming-due', async (req, res) => {
  const daysAhead = req.query.days ? parseInt(req.query.days) : 30;
  const result = await VaccinationPresenter.getUpcomingDue(daysAhead);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get overdue vaccinations
router.get('/overdue', async (req, res) => {
  const result = await VaccinationPresenter.getOverdue();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search vaccination records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await VaccinationPresenter.searchRecords(term);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by goat ID
router.get('/goat/:goatId', async (req, res) => {
  const result = await VaccinationPresenter.getRecordsByGoatId(req.params.goatId);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by type (Vaccine or Deworming)
router.get('/type/:type', async (req, res) => {
  const result = await VaccinationPresenter.getRecordsByType(req.params.type);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all vaccination records
router.get('/', async (req, res) => {
  const result = await VaccinationPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get vaccination record by ID
router.get('/:id', async (req, res) => {
  const result = await VaccinationPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new vaccination record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await VaccinationPresenter.createRecord(req.body, performedBy, performedByName);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update vaccination record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await VaccinationPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete vaccination record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await VaccinationPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: result.message });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
