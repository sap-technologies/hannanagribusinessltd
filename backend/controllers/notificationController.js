import notificationService from '../services/notificationService.js';

class NotificationController {
  // Get notifications for current user
  static async getNotifications(req, res) {
    try {
      const userId = req.user.userId;
      const { 
        unreadOnly, 
        limit, 
        offset, 
        type, 
        priority, 
        search, 
        performedBy,
        startDate,
        endDate 
      } = req.query;
      
      const notifications = await notificationService.getUserNotifications(userId, {
        unreadOnly: unreadOnly === 'true',
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0,
        type,
        priority,
        search,
        performedBy: performedBy ? parseInt(performedBy) : null,
        startDate,
        endDate
      });
      
      res.json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get notifications',
        error: error.message
      });
    }
  }

  // Get unread count
  static async getUnreadCount(req, res) {
    try {
      const userId = req.user.userId;
      const count = await notificationService.getUnreadCount(userId);
      
      res.json({
        success: true,
        data: { count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get unread count',
        error: error.message
      });
    }
  }

  // Mark notification as read
  static async markAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      const notification = await notificationService.markAsRead(id, userId);
      
      res.json({
        success: true,
        data: notification
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark notification as read',
        error: error.message
      });
    }
  }

  // Mark all as read
  static async markAllAsRead(req, res) {
    try {
      const userId = req.user.userId;
      await notificationService.markAllAsRead(userId);
      
      res.json({
        success: true,
        message: 'All notifications marked as read'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to mark all as read',
        error: error.message
      });
    }
  }

  // Delete notification
  static async deleteNotification(req, res) {
    try {
      const userId = req.user.userId;
      const { id } = req.params;
      
      await notificationService.deleteNotification(id, userId);
      
      res.json({
        success: true,
        message: 'Notification deleted'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete notification',
        error: error.message
      });
    }
  }

  // Delete all notifications
  static async deleteAllNotifications(req, res) {
    try {
      const userId = req.user.userId;
      const count = await notificationService.deleteAllNotifications(userId);
      
      res.json({
        success: true,
        message: `Deleted ${count} notifications`
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to delete all notifications',
        error: error.message
      });
    }
  }

  // Create notification (admin only)
  static async createNotification(req, res) {
    try {
      const { userId, type, title, message, link, priority, broadcast } = req.body;
      
      if (broadcast) {
        const notifications = await notificationService.createBroadcastNotification({
          type, title, message, link, priority
        });
        
        res.json({
          success: true,
          message: `Broadcast notification sent to ${notifications.length} users`,
          data: notifications
        });
      } else {
        const notification = await notificationService.createNotification({
          userId, type, title, message, link, priority
        });
        
        res.json({
          success: true,
          data: notification
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to create notification',
        error: error.message
      });
    }
  }
}

export default NotificationController;
