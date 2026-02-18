import React, { useState, useEffect } from 'react';
import { notificationService } from '../services/api';
import './RemindersPage.css';

const RemindersPage = ({ onBack }) => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'vaccination', 'breeding', 'health', 'growth'
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setReminders(data.data || []);
      } else {
        showMessage('Failed to load reminders', 'error');
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
      showMessage('Error loading reminders', 'error');
    } finally {
      setLoading(false);
    }
  };

  const completeReminder = async (id) => {
    if (!window.confirm('Mark this reminder as complete?')) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`/api/reminders/${id}/complete`, {
        method: 'PUT',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('Reminder completed successfully!', 'success');
        fetchReminders(); // Refresh list
      } else {
        showMessage('Failed to complete reminder', 'error');
      }
    } catch (error) {
      console.error('Error completing reminder:', error);
      showMessage('Error completing reminder', 'error');
    }
  };

  const runDailyChecks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch('/api/reminders/daily-checks', {
        method: 'POST',
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        showMessage('Daily checks completed! New reminders created.', 'success');
        fetchReminders();
      } else {
        showMessage('Failed to run daily checks', 'error');
      }
    } catch (error) {
      console.error('Error running daily checks:', error);
      showMessage('Error running daily checks', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getTypeIcon = (type) => {
    const icons = {
      vaccination: '💉',
      breeding: '🐐',
      health: '🏥',
      growth: '📈',
      feeding: '🌾'
    };
    return icons[type] || '📌';
  };

  const getTypeBadge = (type) => {
    return (
      <span className={`reminder-type-badge ${type}`}>
        {getTypeIcon(type)} {type}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      high: 'badge-high',
      medium: 'badge-medium',
      low: 'badge-low'
    };
    return (
      <span className={`priority-badge ${colors[priority] || 'badge-medium'}`}>
        {priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🟢'} {priority}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    return status === 'pending' ? (
      <span className="status-badge pending">⏳ Pending</span>
    ) : (
      <span className="status-badge completed">✅ Completed</span>
    );
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'all') return true;
    return reminder.reminder_type === filter;
  });

  const groupedReminders = {
    overdue: filteredReminders.filter(r => r.status === 'pending' && isOverdue(r.due_date)),
    today: filteredReminders.filter(r => {
      if (r.status !== 'pending') return false;
      const today = new Date().toDateString();
      const dueDate = new Date(r.due_date).toDateString();
      return today === dueDate;
    }),
    upcoming: filteredReminders.filter(r => {
      if (r.status !== 'pending') return false;
      if (isOverdue(r.due_date)) return false;
      const today = new Date().toDateString();
      const dueDate = new Date(r.due_date).toDateString();
      return today !== dueDate;
    }),
    completed: filteredReminders.filter(r => r.status === 'completed')
  };

  if (loading) {
    return (
      <div className="reminders-page">
        <div className="loading">Loading reminders...</div>
      </div>
    );
  }

  return (
    <div className="reminders-page">
      <div className="reminders-header">
        <div className="header-left">
          {onBack && (
            <button onClick={onBack} className="back-button">
              ← Back
            </button>
          )}
          <h1>📌 Reminders & Schedule</h1>
        </div>
        <button onClick={runDailyChecks} className="btn-daily-checks" disabled={loading}>
          🔄 Run Daily Checks
        </button>
      </div>

      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="reminders-stats">
        <div className="stat-card overdue">
          <div className="stat-number">{groupedReminders.overdue.length}</div>
          <div className="stat-label">Overdue</div>
        </div>
        <div className="stat-card today">
          <div className="stat-number">{groupedReminders.today.length}</div>
          <div className="stat-label">Due Today</div>
        </div>
        <div className="stat-card upcoming">
          <div className="stat-number">{groupedReminders.upcoming.length}</div>
          <div className="stat-label">Upcoming</div>
        </div>
        <div className="stat-card completed">
          <div className="stat-number">{groupedReminders.completed.length}</div>
          <div className="stat-label">Completed</div>
        </div>
      </div>

      <div className="reminders-filters">
        <button 
          onClick={() => setFilter('all')} 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
        >
          All ({reminders.length})
        </button>
        <button 
          onClick={() => setFilter('vaccination')} 
          className={`filter-btn ${filter === 'vaccination' ? 'active' : ''}`}
        >
          💉 Vaccination
        </button>
        <button 
          onClick={() => setFilter('breeding')} 
          className={`filter-btn ${filter === 'breeding' ? 'active' : ''}`}
        >
          🐐 Breeding
        </button>
        <button 
          onClick={() => setFilter('health')} 
          className={`filter-btn ${filter === 'health' ? 'active' : ''}`}
        >
          🏥 Health
        </button>
        <button 
          onClick={() => setFilter('growth')} 
          className={`filter-btn ${filter === 'growth' ? 'active' : ''}`}
        >
          📈 Growth
        </button>
      </div>

      {/* Overdue Section */}
      {groupedReminders.overdue.length > 0 && (
        <div className="reminders-section">
          <h2 className="section-title overdue">🔴 Overdue ({groupedReminders.overdue.length})</h2>
          <div className="reminders-grid">
            {groupedReminders.overdue.map(reminder => (
              <div key={reminder.id} className="reminder-card overdue">
                <div className="reminder-header">
                  {getTypeBadge(reminder.reminder_type)}
                  {getPriorityBadge(reminder.priority)}
                </div>
                <div className="reminder-title">{reminder.title}</div>
                <div className="reminder-description">{reminder.description}</div>
                <div className="reminder-meta">
                  <div className="reminder-goat">
                    🐐 {reminder.goat_tag || 'N/A'}
                  </div>
                  <div className="reminder-date overdue">
                    📅 Due: {formatDate(reminder.due_date)}
                  </div>
                </div>
                <button 
                  onClick={() => completeReminder(reminder.id)}
                  className="btn-complete"
                >
                  ✓ Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Due Today Section */}
      {groupedReminders.today.length > 0 && (
        <div className="reminders-section">
          <h2 className="section-title today">⚡ Due Today ({groupedReminders.today.length})</h2>
          <div className="reminders-grid">
            {groupedReminders.today.map(reminder => (
              <div key={reminder.id} className="reminder-card today">
                <div className="reminder-header">
                  {getTypeBadge(reminder.reminder_type)}
                  {getPriorityBadge(reminder.priority)}
                </div>
                <div className="reminder-title">{reminder.title}</div>
                <div className="reminder-description">{reminder.description}</div>
                <div className="reminder-meta">
                  <div className="reminder-goat">
                    🐐 {reminder.goat_tag || 'N/A'}
                  </div>
                  <div className="reminder-date">
                    📅 {formatDate(reminder.due_date)}
                  </div>
                </div>
                <button 
                  onClick={() => completeReminder(reminder.id)}
                  className="btn-complete"
                >
                  ✓ Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {groupedReminders.upcoming.length > 0 && (
        <div className="reminders-section">
          <h2 className="section-title upcoming">📅 Upcoming ({groupedReminders.upcoming.length})</h2>
          <div className="reminders-grid">
            {groupedReminders.upcoming.map(reminder => (
              <div key={reminder.id} className="reminder-card">
                <div className="reminder-header">
                  {getTypeBadge(reminder.reminder_type)}
                  {getPriorityBadge(reminder.priority)}
                </div>
                <div className="reminder-title">{reminder.title}</div>
                <div className="reminder-description">{reminder.description}</div>
                <div className="reminder-meta">
                  <div className="reminder-goat">
                    🐐 {reminder.goat_tag || 'N/A'}
                  </div>
                  <div className="reminder-date">
                    📅 {formatDate(reminder.due_date)}
                  </div>
                </div>
                <button 
                  onClick={() => completeReminder(reminder.id)}
                  className="btn-complete"
                >
                  ✓ Mark Complete
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Section */}
      {groupedReminders.completed.length > 0 && (
        <div className="reminders-section">
          <h2 className="section-title completed">✅ Completed ({groupedReminders.completed.length})</h2>
          <div className="reminders-grid">
            {groupedReminders.completed.slice(0, 10).map(reminder => (
              <div key={reminder.id} className="reminder-card completed">
                <div className="reminder-header">
                  {getTypeBadge(reminder.reminder_type)}
                  {getStatusBadge(reminder.status)}
                </div>
                <div className="reminder-title">{reminder.title}</div>
                <div className="reminder-description">{reminder.description}</div>
                <div className="reminder-meta">
                  <div className="reminder-goat">
                    🐐 {reminder.goat_tag || 'N/A'}
                  </div>
                  <div className="reminder-date">
                    ✓ Completed: {formatDate(reminder.completed_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {filteredReminders.length === 0 && (
        <div className="no-reminders">
          <div className="no-data-icon">📌</div>
          <h3>No reminders found</h3>
          <p>All tasks are complete or no reminders match the filter.</p>
        </div>
      )}
    </div>
  );
};

export default RemindersPage;
