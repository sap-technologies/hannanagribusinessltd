import { useState, useEffect } from 'react';
import './NotificationCreator.css';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const NotificationCreator = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    broadcast: true,
    userId: '',
    type: 'system',
    title: '',
    message: '',
    link: '',
    priority: 'medium'
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!formData.broadcast) {
      fetchUsers();
    }
  }, [formData.broadcast]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }
    if (!formData.message.trim()) {
      setError('Message is required');
      return;
    }
    if (!formData.broadcast && !formData.userId) {
      setError('Please select a user or enable broadcast');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('authToken');
      const payload = {
        broadcast: formData.broadcast,
        type: formData.type,
        title: formData.title,
        message: formData.message,
        priority: formData.priority
      };

      // Add optional fields
      if (formData.link) payload.link = formData.link;
      if (!formData.broadcast && formData.userId) {
        payload.userId = parseInt(formData.userId);
      }

      const response = await fetch(`${API_URL}/notifications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (onSuccess) {
          onSuccess(data.message || 'Notification sent successfully!');
        }
        // Reset form
        setFormData({
          broadcast: true,
          userId: '',
          type: 'system',
          title: '',
          message: '',
          link: '',
          priority: 'medium'
        });
        if (onClose) {
          setTimeout(onClose, 1500);
        }
      } else {
        setError(data.message || 'Failed to send notification');
      }
    } catch (error) {
      console.error('Error sending notification:', error);
      setError('Error sending notification. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const notificationTypes = [
    { value: 'system', label: '⚙️ System', description: 'System announcements' },
    { value: 'goat', label: '🐐 Goat', description: 'Goat-related updates' },
    { value: 'breeding', label: '🐐 Breeding', description: 'Breeding activities' },
    { value: 'health', label: '🏥 Health', description: 'Health alerts' },
    { value: 'vaccination', label: '💉 Vaccination', description: 'Vaccination reminders' },
    { value: 'feeding', label: '🌾 Feeding', description: 'Feeding schedules' },
    { value: 'sale', label: '💵 Sale', description: 'Sales updates' },
    { value: 'expense', label: '💰 Expense', description: 'Expense alerts' },
    { value: 'report', label: '📊 Report', description: 'Report notifications' },
    { value: 'farm', label: '🏡 Farm', description: 'General farm updates' }
  ];

  const priorityLevels = [
    { value: 'low', label: '🟢 Low', description: 'Informational' },
    { value: 'medium', label: '🟡 Medium', description: 'Standard priority' },
    { value: 'high', label: '🔴 High', description: 'Important' },
    { value: 'urgent', label: '🚨 Urgent', description: 'Requires immediate attention' }
  ];

  const navigationLinks = [
    { value: '', label: 'None' },
    { value: '/breeding-farm', label: 'Breeding Farm' },
    { value: '/goats', label: 'All Goats' },
    { value: '/breeding', label: 'Breeding Records' },
    { value: '/health', label: 'Health Records' },
    { value: '/vaccination', label: 'Vaccination Records' },
    { value: '/feeding', label: 'Feeding Records' },
    { value: '/sales', label: 'Sales' },
    { value: '/expenses', label: 'Expenses' },
    { value: '/reports', label: 'Reports' },
    { value: '/matooke', label: 'Matooke Farms' },
    { value: '/coffee', label: 'Coffee Farms' }
  ];

  return (
    <div className="notification-creator-modal">
      <div className="notification-creator-content">
        <div className="notification-creator-header">
          <h2>📢 Create Notification</h2>
          {onClose && (
            <button 
              className="close-button" 
              onClick={onClose}
              disabled={loading}
            >
              ×
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="notification-creator-form">
          {/* Broadcast Toggle */}
          <div className="form-group broadcast-toggle">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="broadcast"
                checked={formData.broadcast}
                onChange={handleChange}
                disabled={loading}
              />
              <span className="checkbox-text">
                📣 <strong>Broadcast to All Users</strong>
                <small>Send this notification to everyone</small>
              </span>
            </label>
          </div>

          {/* User Selection (if not broadcast) */}
          {!formData.broadcast && (
            <div className="form-group">
              <label htmlFor="userId">
                👤 Select User <span className="required">*</span>
              </label>
              <select
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                required={!formData.broadcast}
                disabled={loading}
              >
                <option value="">-- Select a user --</option>
                {users.map(user => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.full_name} ({user.email}) - {user.role}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notification Type */}
          <div className="form-group">
            <label htmlFor="type">
              🏷️ Notification Type <span className="required">*</span>
            </label>
            <div className="type-grid">
              {notificationTypes.map(type => (
                <label 
                  key={type.value} 
                  className={`type-option ${formData.type === type.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="type"
                    value={type.value}
                    checked={formData.type === type.value}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="type-content">
                    <span className="type-label">{type.label}</span>
                    <span className="type-description">{type.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority Level */}
          <div className="form-group">
            <label htmlFor="priority">
              ⚡ Priority Level <span className="required">*</span>
            </label>
            <div className="priority-grid">
              {priorityLevels.map(priority => (
                <label 
                  key={priority.value} 
                  className={`priority-option ${formData.priority === priority.value ? 'selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={priority.value}
                    checked={formData.priority === priority.value}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span className="priority-content">
                    <span className="priority-label">{priority.label}</span>
                    <span className="priority-description">{priority.description}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="form-group">
            <label htmlFor="title">
              📝 Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="E.g., Important Farm Update"
              maxLength={100}
              required
              disabled={loading}
            />
            <small className="char-count">{formData.title.length}/100</small>
          </div>

          {/* Message */}
          <div className="form-group">
            <label htmlFor="message">
              💬 Message <span className="required">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Enter the notification message here..."
              rows={4}
              maxLength={500}
              required
              disabled={loading}
            />
            <small className="char-count">{formData.message.length}/500</small>
          </div>

          {/* Navigation Link (Optional) */}
          <div className="form-group">
            <label htmlFor="link">
              🔗 Navigation Link (Optional)
            </label>
            <select
              id="link"
              name="link"
              value={formData.link}
              onChange={handleChange}
              disabled={loading}
            >
              {navigationLinks.map(link => (
                <option key={link.value} value={link.value}>
                  {link.label}
                </option>
              ))}
            </select>
            <small>Where should users go when they click this notification?</small>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              ⚠️ {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="form-actions">
            {onClose && (
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
            )}
            <button 
              type="submit" 
              className="btn-send"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span> Sending...
                </>
              ) : (
                <>
                  📤 Send Notification
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NotificationCreator;
