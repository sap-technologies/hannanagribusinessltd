import express from 'express';
import MatookePresenter from '../presenters/MatookePresenter.js';

const router = express.Router();

// GET all matooke farms
router.get('/', async (req, res) => {
  const result = await MatookePresenter.getAllFarms();
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET matooke farm by ID
router.get('/:id', async (req, res) => {
  const result = await MatookePresenter.getFarmById(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});

// POST create new matooke farm
router.post('/', async (req, res) => {
  const result = await MatookePresenter.createFarm(req.body);
  
  if (result.success) {
    res.status(201).json(result);
  } else {
    res.status(400).json(result);
  }
});

// PUT update matooke farm
router.put('/:id', async (req, res) => {
  const result = await MatookePresenter.updateFarm(req.params.id, req.body);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

// DELETE matooke farm
router.delete('/:id', async (req, res) => {
  const result = await MatookePresenter.deleteFarm(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

// GET production statistics
router.get('/stats/production', async (req, res) => {
  const result = await MatookePresenter.getProductionStats();
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET search matooke farms
router.get('/search/:term', async (req, res) => {
  const result = await MatookePresenter.searchFarms(req.params.term);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

export default router;
