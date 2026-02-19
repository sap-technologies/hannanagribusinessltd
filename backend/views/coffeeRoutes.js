import express from 'express';
import CoffeePresenter from '../presenters/CoffeePresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// GET all coffee farms
router.get('/', async (req, res) => {
  const result = await CoffeePresenter.getAllFarms();
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET coffee farm by ID
router.get('/:id', async (req, res) => {
  const result = await CoffeePresenter.getFarmById(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});

// POST create new coffee farm
router.post('/', async (req, res) => {
  const result = await CoffeePresenter.createFarm(req.body);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// PUT update coffee farm
router.put('/:id', async (req, res) => {
  const result = await CoffeePresenter.updateFarm(req.params.id, req.body);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

// DELETE coffee farm (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await CoffeePresenter.deleteFarm(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

// GET production statistics
router.get('/stats/production', async (req, res) => {
  const result = await CoffeePresenter.getProductionStats();
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET search coffee farms
router.get('/search/:term', async (req, res) => {
  const result = await CoffeePresenter.searchFarms(req.params.term);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
