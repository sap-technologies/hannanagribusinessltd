import express from 'express';
import ReminderController from '../controllers/reminderController.js';
import { verifyToken, managerOrAdmin } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and manager/admin role
router.use(verifyToken);
router.use(managerOrAdmin);

// Get active reminders
router.get('/', ReminderController.getActiveReminders);

// Complete a reminder
router.put('/:id/complete', ReminderController.completeReminder);

// Run daily checks
router.post('/daily-checks', ReminderController.runDailyChecks);

// Check specific types
router.post('/check-vaccinations', ReminderController.checkVaccinations);
router.post('/check-breeding', ReminderController.checkBreeding);
router.post('/check-health', ReminderController.checkHealth);

export default router;
