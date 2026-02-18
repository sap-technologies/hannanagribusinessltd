import { useState, useEffect } from 'react';
import './NotificationsPage.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const NotificationsPage = ({ onClose = () => {} }) => {
  const [notifications, setNotifications] = useState([]);
  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [notifications, searchTerm, filterType, filterPriority, filterStatus]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications?limit=200`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setNotifications(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...notifications];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(notif =>
        notif.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        notif.message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(notif => notif.type === filterType);
    }

    // Priority filter
    if (filterPriority !== 'all') {
      filtered = filtered.filter(notif => notif.priority === filterPriority);
    }

    // Status filter
    if (filterStatus === 'unread') {
      filtered = filtered.filter(notif => !notif.is_read);
    } else if (filterStatus === 'read') {
      filtered = filtered.filter(notif => notif.is_read);
    }

    setFilteredNotifications(filtered);
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('authToken');
      await fetch(`${API_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setNotifications(notifications.map(notif =>
        notif.notification_id === id ? { ...notif, is_read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (id) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.filter(notif => notif.notification_id !== id));
        if (selectedNotification?.notification_id === id) {
          setShowViewModal(false);
          setSelectedNotification(null);
        }
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications/mark-all-read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications(notifications.map(notif => ({ ...notif, is_read: true })));
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteAllNotifications = async () => {
    if (!confirm('Are you sure you want to delete ALL notifications? This action cannot be undone.')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/notifications/delete-all`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setNotifications([]);
        setFilteredNotifications([]);
      }
    } catch (error) {
      console.error('Error deleting all notifications:', error);
    }
  };

  const viewNotification = (notification) => {
    setSelectedNotification(notification);
    setShowViewModal(true);
    if (!notification.is_read) {
      markAsRead(notification.notification_id);
    }
  };

  const closeModal = () => {
    setShowViewModal(false);
    setSelectedNotification(null);
  };

  const handleNotificationClick = (notification) => {
    // In this app, navigation is handled by the parent component
    // Just view the notification in modal for now
    viewNotification(notification);
  };

  const getTypeIcon = (type) => {
    const icons = {
      goat: '🐐',
      breeding: '🐐',
      health: '🏥',
      vaccination: '💉',
      feeding: '🌾',
      expense: '💰',
      sale: '💵',
      growth: '📈',
      report: '📊',
      farm: '🏡',
      system: '⚙️'
    };
    return icons[type] || '📢';
  };

  const getPriorityBadge = (priority) => {
    const badges = {
      urgent: { label: 'Urgent', class: 'priority-urgent' },
      high: { label: 'High', class: 'priority-high' },
      medium: { label: 'Medium', class: 'priority-medium' },
      low: { label: 'Low', class: 'priority-low' }
    };
    return badges[priority] || badges.medium;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      goat: 'Goat',
      breeding: 'Breeding',
      health: 'Health',
      vaccination: 'Vaccination',
      feeding: 'Feeding',
      expense: 'Expense',
      sale: 'Sales',
      growth: 'Growth',
      report: 'Report',
      farm: 'Farm',
      system: 'System'
    };
    return labels[type] || 'Other';
  };

  const uniqueTypes = [...new Set(notifications.map(n => n.type))];

  return (
    <div className="notifications-page">
      <div className="notifications-header">
        <div className="header-top">
          <div className="header-left">
            <button 
              className="close-page-btn" 
              onClick={onClose}
              title="Close notifications"
            >
              ✕
            </button>
            <h1>📬 Notifications</h1>
          </div>
          <div className="header-actions">
            <span className="notification-count">
              {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
            </span>
            {notifications.length > 0 && notifications.some(n => !n.is_read) && (
              <button
                className="btn-mark-all-read"
                onClick={markAllAsRead}
                title="Mark all notifications as read"
              >
                ✓ Mark All Read
              </button>
            )}
            {notifications.length > 0 && (
              <button
                className="btn-delete-all"
                onClick={deleteAllNotifications}
                title="Delete all notifications"
              >
                🗑️ Delete All
              </button>
            )}
          </div>
        </div>

        {/* Filters and Search */}
        <div className="filters-container">
          <div className="search-box">
            <input
              type="text"
              placeholder="🔍 Search notifications..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>
                  {getTypeIcon(type)} {getTypeLabel(type)}
                </option>
              ))}
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="unread">Unread Only</option>
              <option value="read">Read Only</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading notifications...</p>
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📭</div>
          <h3>No notifications found</h3>
          <p>
            {searchTerm || filterType !== 'all' || filterPriority !== 'all' || filterStatus !== 'all'
              ? 'Try adjusting your filters'
              : 'You\'re all caught up!'}
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {filteredNotifications.map(notification => {
            const priority = getPriorityBadge(notification.priority);
            return (
              <div
                key={notification.notification_id}
                className={`notification-card ${notification.is_read ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getTypeIcon(notification.type)}
                </div>

                <div className="notification-content">
                  <div className="notification-header-row">
                    <h3>{notification.title}</h3>
                    <span className={`priority-badge ${priority.class}`}>
                      {priority.label}
                    </span>
                  </div>

                  <p className="notification-message">{notification.message}</p>

                  <div className="notification-meta">
                    <span className="notification-date">
                      🕒 {formatDate(notification.created_at)}
                    </span>
                    {notification.performed_by_name && (
                      <span className="notification-performer">
                        👤 By: {notification.performed_by_name}
                      </span>
                    )}
                    <span className="notification-type">
                      📂 {getTypeLabel(notification.type)}
                    </span>
                  </div>
                </div>

                <div className="notification-actions">
                  <button
                    className="btn-action btn-view"
                    onClick={() => viewNotification(notification)}
                    title="View details"
                  >
                    👁️ View
                  </button>
                  <button
                    className="btn-action btn-delete"
                    onClick={() => deleteNotification(notification.notification_id)}
                    title="Delete notification"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedNotification && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                {getTypeIcon(selectedNotification.type)} {selectedNotification.title}
              </h2>
              <button className="modal-close" onClick={closeModal}>✖️</button>
            </div>

            <div className="modal-body">
              <div className={`priority-indicator ${getPriorityBadge(selectedNotification.priority).class}`}>
                Priority: {getPriorityBadge(selectedNotification.priority).label}
              </div>

              <div className="modal-section">
                <label>Message:</label>
                <p className="modal-message">{selectedNotification.message}</p>
              </div>

              <div className="modal-section">
                <label>Type:</label>
                <p>{getTypeLabel(selectedNotification.type)}</p>
              </div>

              <div className="modal-section">
                <label>Date & Time:</label>
                <p>{formatDate(selectedNotification.created_at)}</p>
              </div>

              {selectedNotification.performed_by_name && (
                <div className="modal-section">
                  <label>Performed By:</label>
                  <p>{selectedNotification.performed_by_name}</p>
                </div>
              )}

              <div className="modal-section">
                <label>Status:</label>
                <p>{selectedNotification.is_read ? '✅ Read' : '📧 Unread'}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-modal btn-modal-delete" onClick={() => {
                closeModal();
                deleteNotification(selectedNotification.notification_id);
              }}>
                🗑️ Delete
              </button>
              <button className="btn-modal btn-modal-close" onClick={closeModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
