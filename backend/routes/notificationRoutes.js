import express from 'express';
import NotificationController from '../controllers/notificationController.js';
import { verifyToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Get notifications for current user
router.get('/', NotificationController.getNotifications);

// Get unread count
router.get('/unread-count', NotificationController.getUnreadCount);

// Mark notification as read
router.put('/:id/read', NotificationController.markAsRead);

// Mark all as read
router.put('/mark-all-read', NotificationController.markAllAsRead);

// Delete all notifications
router.delete('/delete-all', NotificationController.deleteAllNotifications);

// Delete notification
router.delete('/:id', NotificationController.deleteNotification);

// Create notification (admin only)
router.post('/', adminOnly, NotificationController.createNotification);

export default router;
