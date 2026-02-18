import { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import './NotificationBell.css';

function NotificationBell({ onNotificationsClick }) {
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch unread count
  const fetchUnreadCount = async () => {
    try {
      const response = await notificationService.getUnreadCount();
      if (response.success) {
        setUnreadCount(response.data.count);
      }
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUnreadCount();
    // Refresh count every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    if (onNotificationsClick) {
      onNotificationsClick();
    }
  };

  return (
    <button 
      className="notification-bell-button" 
      onClick={handleClick}
      title="View notifications"
    >
      <span className="bell-icon">🔔</span>
      {unreadCount > 0 && (
        <span className="notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>
      )}
    </button>
  );
}

export default NotificationBell;

