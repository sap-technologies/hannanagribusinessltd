import sql from '../db.js';

class NotificationService {
  /**
   * Create a notification for a user
   */
  async createNotification(data) {
    const { userId, type, title, message, link, priority = 'medium', expiresAt, performedBy, performedByName } = data;
    
    const [notification] = await sql`
      INSERT INTO notifications (user_id, type, title, message, link, priority, expires_at, performed_by, performed_by_name)
      VALUES (${userId}, ${type}, ${title}, ${message}, ${link}, ${priority}, ${expiresAt}, ${performedBy || null}, ${performedByName || null})
      RETURNING *
    `;
    
    return notification;
  }

  /**
   * Create notification for all users
   */
  async createBroadcastNotification(data) {
    const { type, title, message, link, priority = 'medium' } = data;
    
    // Get all active users
    const users = await sql`SELECT user_id FROM users WHERE is_active = true`;
    
    const notifications = [];
    for (const user of users) {
      const notification = await this.createNotification({
        userId: user.user_id,
        type,
        title,
        message,
        link,
        priority
      });
      notifications.push(notification);
    }
    
    return notifications;
  }

  /**
   * Get notifications for a user with filters
   */
  async getUserNotifications(userId, options = {}) {
    const { 
      unreadOnly = false, 
      limit = 50, 
      offset = 0,
      type = null,
      priority = null,
      search = null,
      performedBy = null,
      startDate = null,
      endDate = null
    } = options;
    
    // Build WHERE conditions as separate fragments
    let whereFragments = [
      `user_id = ${userId}`,
      `(expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)`
    ];

    if (unreadOnly) {
      whereFragments.push(`is_read = false`);
    }

    if (type) {
      whereFragments.push(`type = '${type}'`);
    }

    if (priority) {
      whereFragments.push(`priority = '${priority}'`);
    }

    if (performedBy) {
      whereFragments.push(`performed_by = ${performedBy}`);
    }

    if (search) {
      const searchPattern = search.replace(/'/g, "''");
      whereFragments.push(`(title ILIKE '%${searchPattern}%' OR message ILIKE '%${searchPattern}%')`);
    }

    if (startDate) {
      whereFragments.push(`created_at >= '${startDate}'`);
    }

    if (endDate) {
      whereFragments.push(`created_at <= '${endDate}'`);
    }

    const whereClause = whereFragments.join(' AND ');

    const notifications = await sql.unsafe(`
      SELECT * FROM notifications 
      WHERE ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `);
    
    return notifications;
  }

  /**
   * Get unread count for user
   */
  async getUnreadCount(userId) {
    const [result] = await sql`
      SELECT COUNT(*) as count 
      FROM notifications 
      WHERE user_id = ${userId} 
      AND is_read = false
      AND (expires_at IS NULL OR expires_at > CURRENT_TIMESTAMP)
    `;
    
    return parseInt(result.count);
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId, userId) {
    const [notification] = await sql`
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE notification_id = ${notificationId} AND user_id = ${userId}
      RETURNING *
    `;
    
    return notification;
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(userId) {
    await sql`
      UPDATE notifications
      SET is_read = true, read_at = CURRENT_TIMESTAMP
      WHERE user_id = ${userId} AND is_read = false
    `;
    
    return true;
  }

  /**
   * Delete notification
   */
  async deleteNotification(notificationId, userId) {
    await sql`
      DELETE FROM notifications
      WHERE notification_id = ${notificationId} AND user_id = ${userId}
    `;
    
    return true;
  }

  /**
   * Delete all notifications for a user
   */
  async deleteAllNotifications(userId) {
    const result = await sql`
      DELETE FROM notifications
      WHERE user_id = ${userId}
    `;
    
    return result.count;
  }

  /**
   * Delete old notifications (cleanup)
   */
  async deleteOldNotifications(daysOld = 30) {
    const result = await sql`
      DELETE FROM notifications
      WHERE created_at < CURRENT_DATE - INTERVAL '${daysOld} days'
      OR (expires_at IS NOT NULL AND expires_at < CURRENT_TIMESTAMP)
    `;
    
    return result.count;
  }

  /**
   * Create vaccination reminder notification
   */
  async createVaccinationReminder(goatId, goatTag, vaccinationType, dueDate, userId = null) {
    const message = `Vaccination due for goat ${goatTag}. Type: ${vaccinationType}`;
    
    if (userId) {
      return await this.createNotification({
        userId,
        type: 'vaccination',
        title: '💉 Vaccination Reminder',
        message,
        link: `/goats/${goatId}`,
        priority: 'high'
      });
    } else {
      return await this.createBroadcastNotification({
        type: 'vaccination',
        title: '💉 Vaccination Reminder',
        message,
        link: `/goats/${goatId}`,
        priority: 'high'
      });
    }
  }

  /**
   * Create breeding reminder notification
   */
  async createBreedingReminder(goatId, goatTag, breedingDate, userId = null) {
    const message = `Breeding check needed for goat ${goatTag}. Expected date: ${breedingDate}`;
    
    if (userId) {
      return await this.createNotification({
        userId,
        type: 'breeding',
        title: '🐐 Breeding Reminder',
        message,
        link: `/goats/${goatId}`,
        priority: 'medium'
      });
    } else {
      return await this.createBroadcastNotification({
        type: 'breeding',
        title: '🐐 Breeding Reminder',
        message,
        link: `/goats/${goatId}`,
        priority: 'medium'
      });
    }
  }

  /**
   * Create health alert notification
   */
  async createHealthAlert(goatId, goatTag, illness, userId = null) {
    const message = `Health alert for goat ${goatTag}. Issue: ${illness}`;
    
    if (userId) {
      return await this.createNotification({
        userId,
        type: 'health',
        title: '🏥 Health Alert',
        message,
        link: `/goats/${goatId}`,
        priority: 'urgent'
      });
    } else {
      return await this.createBroadcastNotification({
        type: 'health',
        title: '🏥 Health Alert',
        message,
        link: `/goats/${goatId}`,
        priority: 'urgent'
      });
    }
  }
}

export default new NotificationService();

