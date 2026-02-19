import express from 'express';
import GoatPresenter from '../presenters/GoatPresenter.js';

const router = express.Router();

// GET all goats
router.get('/', async (req, res) => {
  const result = await GoatPresenter.getAllGoats();
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET search goats (must come before /:id)
router.get('/search/:term', async (req, res) => {
  const result = await GoatPresenter.searchGoats(req.params.term);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET goats by status (must come before /:id)
router.get('/status/:status', async (req, res) => {
  const result = await GoatPresenter.getGoatsByStatus(req.params.status);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET offspring of a goat (must come before /:id to avoid conflicts)
router.get('/:id/offspring', async (req, res) => {
  const parentType = req.query.type || 'both'; // both, mother, father
  const result = await GoatPresenter.getOffspring(req.params.id, parentType);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(500).json(result);
  }
});

// GET goat by ID (more generic route, comes after specific routes)
router.get('/:id', async (req, res) => {
  const result = await GoatPresenter.getGoatById(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(404).json(result);
  }
});

// POST create new goat
router.post('/', async (req, res) => {
  try {
    const result = await GoatPresenter.createGoat(req.body, req.user);
    
    if (result.success) {
      res.status(201).json(result);
    } else {
      console.error('Failed to create goat:', result.message);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in create goat route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while creating goat',
      error: error.message
    });
  }
});

// PUT update goat
router.put('/:id', async (req, res) => {
  try {
    const performedBy = req.user?.userId || null;
    const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
    const result = await GoatPresenter.updateGoat(req.params.id, req.body, performedBy, performedByName);
    
    if (result.success) {
      res.status(200).json(result);
    } else {
      console.error('Failed to update goat:', result.message);
      res.status(400).json(result);
    }
  } catch (error) {
    console.error('Error in update goat route:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error while updating goat',
      error: error.message
    });
  }
});

// DELETE goat
router.delete('/:id', async (req, res) => {
  const result = await GoatPresenter.deleteGoat(req.params.id);
  
  if (result.success) {
    res.status(200).json(result);
  } else {
    res.status(400).json(result);
  }
});

export default router;
