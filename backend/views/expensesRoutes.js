import express from 'express';
import ExpensesPresenter from '../presenters/ExpensesPresenter.js';
import { managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get expense statistics
router.get('/stats', async (req, res) => {
  const result = await ExpensesPresenter.getExpenseStats();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get expenses by category with totals
router.get('/by-category', async (req, res) => {
  const result = await ExpensesPresenter.getExpensesByCategory();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get monthly expenses
router.get('/monthly', async (req, res) => {
  const result = await ExpensesPresenter.getMonthlyExpenses();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Search expense records
router.get('/search', async (req, res) => {
  const { term } = req.query;
  if (!term) {
    return res.status(400).json({ error: 'Search term is required' });
  }
  const result = await ExpensesPresenter.searchRecords(term);
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
  const result = await ExpensesPresenter.getRecordsByDateRange(startDate, endDate);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by category
router.get('/category/:category', async (req, res) => {
  const result = await ExpensesPresenter.getRecordsByCategory(req.params.category);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get records by paid by
router.get('/paid-by/:paidBy', async (req, res) => {
  const result = await ExpensesPresenter.getRecordsByPaidBy(req.params.paidBy);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get all expense records
router.get('/', async (req, res) => {
  const result = await ExpensesPresenter.getAllRecords();
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(500).json({ error: result.error });
  }
});

// Get expense record by ID
router.get('/:id', async (req, res) => {
  const result = await ExpensesPresenter.getRecordById(req.params.id);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(404).json({ error: result.error });
  }
});

// Create new expense record
router.post('/', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await ExpensesPresenter.createRecord(req.body, performedBy, performedByName);
  if (result.success) {
    res.status(201).json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Update expense record
router.put('/:id', async (req, res) => {
  const performedBy = req.user?.userId || null;
  const performedByName = req.user?.fullName || req.user?.email || 'Unknown User';
  const result = await ExpensesPresenter.updateRecord(req.params.id, req.body, performedBy, performedByName);
  if (result.success) {
    res.json(result.data);
  } else {
    res.status(400).json({ error: result.error });
  }
});

// Delete expense record (Manager or Admin only)
router.delete('/:id', managerOrAdmin, async (req, res) => {
  const result = await ExpensesPresenter.deleteRecord(req.params.id);
  if (result.success) {
    res.json({ message: 'Expense record deleted successfully', data: result.data });
  } else {
    res.status(404).json({ error: result.error });
  }
});

export default router;
