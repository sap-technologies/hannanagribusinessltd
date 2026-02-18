import React, { useState, useEffect } from 'react';
import api from '../services/authService';
import BackButton from './BackButton';
import './AdminDashboard.css';

function AdminDashboard({ onBack }) {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalGoats: 0,
    activeGoats: 0,
    totalBreeding: 0,
    totalKidGrowth: 0,
    totalHealth: 0,
    totalVaccination: 0,
    totalFeeding: 0,
    totalSalesBreeding: 0,
    totalSalesMeat: 0,
    totalExpenses: 0,
    totalReminders: 0,
    totalNotifications: 0,
    activeUsers: 0
  });
  const [recentActivity, setRecentActivity] = useState({
    goats: [],
    breeding: [],
    health: [],
    vaccination: [],
    feeding: [],
    sales: [],
    expenses: []
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState(() => {
    const saved = localStorage.getItem('adminActiveTab');
    return saved || 'overview';
  }); // overview, users, activity
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'staff'
  });

  // Persist admin tab state
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    loadData();
    
    // Auto-refresh every 30 seconds
    const refreshInterval = setInterval(() => {
      loadData(true); // true = silent refresh (no loading spinner)
    }, 30000);

    // Cleanup interval on unmount
    return () => clearInterval(refreshInterval);
  }, []);

  const loadData = async (silent = false) => {
    try {
      if (!silent) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }
      
      // Load users
      const usersRes = await api.get('/users');
      const usersData = usersRes.data.data || [];
      setUsers(usersData);

      // Load all module data in parallel
      const [
        goatsRes,
        breedingRes,
        kidGrowthRes,
        healthRes,
        vaccinationRes,
        feedingRes,
        salesBreedingRes,
        salesMeatRes,
        expensesRes,
        remindersRes,
        notificationsRes
      ] = await Promise.all([
        api.get('/breeding-farm/goats').catch(err => {
          console.error('Goats API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/breeding').catch(err => {
          console.error('Breeding API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/kid-growth').catch(err => {
          console.error('Kid Growth API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/health').catch(err => {
          console.error('Health API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/vaccination').catch(err => {
          console.error('Vaccination API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/feeding').catch(err => {
          console.error('Feeding API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/sales-breeding').catch(err => {
          console.error('Sales Breeding API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/sales-meat').catch(err => {
          console.error('Sales Meat API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/breeding-farm/expenses').catch(err => {
          console.error('Expenses API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/reminders').catch(err => {
          console.error('Reminders API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        }),
        api.get('/notifications?limit=10').catch(err => {
          console.error('Notifications API error:', err.response?.data || err.message);
          return { data: { data: [] } };
        })
      ]);

      const goatsData = goatsRes.data.data || [];
      const breedingData = breedingRes.data.data || [];
      const kidGrowthData = kidGrowthRes.data.data || [];
      const healthData = healthRes.data.data || [];
      const vaccinationData = vaccinationRes.data.data || [];
      const feedingData = feedingRes.data.data || [];
      const salesBreedingData = salesBreedingRes.data.data || [];
      const salesMeatData = salesMeatRes.data.data || [];
      const expensesData = expensesRes.data.data || [];
      const remindersData = remindersRes.data.data || [];
      const notificationsData = notificationsRes.data.data || [];

      console.log('Dashboard Data Loaded:', {
        goats: goatsData.length,
        breeding: breedingData.length,
        kidGrowth: kidGrowthData.length,
        health: healthData.length,
        vaccination: vaccinationData.length,
        feeding: feedingData.length,
        salesBreeding: salesBreedingData.length,
        salesMeat: salesMeatData.length,
        expenses: expensesData.length,
        reminders: remindersData.length,
        notifications: notificationsData.length
      });

      // Calculate statistics
      setStats({
        totalGoats: goatsData.length,
        activeGoats: goatsData.filter(g => g.status === 'Active').length,
        totalBreeding: breedingData.length,
        totalKidGrowth: kidGrowthData.length,
        totalHealth: healthData.length,
        totalVaccination: vaccinationData.length,
        totalFeeding: feedingData.length,
        totalSalesBreeding: salesBreedingData.length,
        totalSalesMeat: salesMeatData.length,
        totalExpenses: expensesData.length,
        totalReminders: remindersData.filter(r => !r.is_completed).length,
        totalNotifications: notificationsData.filter(n => !n.is_read).length,
        activeUsers: usersData.filter(u => u.is_active).length
      });

      // Get recent activity (last 5 from each)
      setRecentActivity({
        goats: goatsData.slice(0, 5),
        breeding: breedingData.slice(0, 5),
        health: healthData.slice(0, 5),
        vaccination: vaccinationData.slice(0, 5),
        feeding: feedingData.slice(0, 5),
        sales: [...salesBreedingData, ...salesMeatData].slice(0, 5),
        expenses: expensesData.slice(0, 5)
      });

      setLastRefresh(new Date());

    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleManualRefresh = () => {
    loadData(true);
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', newUser);
      alert('User added successfully!');
      setShowAddUser(false);
      setNewUser({ email: '', password: '', fullName: '', role: 'staff' });
      loadData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to add user');
    }
  };

  const handleToggleUserStatus = async (userId, currentStatus) => {
    try {
      await api.put(`/users/${userId}`, { isActive: !currentStatus });
      alert('User status updated!');
      loadData();
    } catch (error) {
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        await api.delete(`/users/${userId}`);
        alert('User deleted successfully!');
        loadData();
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      {onBack && <BackButton onClick={onBack} label="Back to Dashboard" />}
      <div className="dashboard-header">
        <div className="header-content">
          <div>
            <h1>🔐 Admin Dashboard</h1>
            <p>Complete System Overview & Administration</p>
          </div>
          <div className="header-actions">
            <div className="refresh-info">
              <span className="last-refresh">
                Last updated: {lastRefresh.toLocaleTimeString()}
              </span>
              {refreshing && <span className="refreshing-indicator">🔄 Updating...</span>}
            </div>
            <button 
              className="btn-refresh" 
              onClick={handleManualRefresh}
              disabled={refreshing}
              title="Refresh dashboard data"
            >
              🔄 Refresh Now
            </button>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button 
          className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          📊 System Overview
        </button>
        <button 
          className={`tab-btn ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          📈 Recent Activity
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 User Management
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Goat Management Stats */}
          <div className="stats-section">
            <h2>🐐 Goat Management</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🐐</span>
                <h3>{stats.totalGoats}</h3>
                <p>Total Goats</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <h3>{stats.activeGoats}</h3>
                <p>Active Goats</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">👶</span>
                <h3>{stats.totalBreeding}</h3>
                <p>Breeding Records</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📈</span>
                <h3>{stats.totalKidGrowth}</h3>
                <p>Growth Records</p>
              </div>
            </div>
          </div>

          {/* Health & Care Stats */}
          <div className="stats-section">
            <h2>🏥 Health & Care</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">💊</span>
                <h3>{stats.totalHealth}</h3>
                <p>Health Records</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💉</span>
                <h3>{stats.totalVaccination}</h3>
                <p>Vaccinations</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🌾</span>
                <h3>{stats.totalFeeding}</h3>
                <p>Feeding Records</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">⏰</span>
                <h3>{stats.totalReminders}</h3>
                <p>Pending Reminders</p>
              </div>
            </div>
          </div>

          {/* Financial Stats */}
          <div className="stats-section">
            <h2>💰 Financial Overview</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">🐑</span>
                <h3>{stats.totalSalesBreeding}</h3>
                <p>Breeding Sales</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🥩</span>
                <h3>{stats.totalSalesMeat}</h3>
                <p>Meat Sales</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📊</span>
                <h3>{stats.totalExpenses}</h3>
                <p>Expense Records</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">💵</span>
                <h3>{stats.totalSalesBreeding + stats.totalSalesMeat}</h3>
                <p>Total Sales</p>
              </div>
            </div>
          </div>

          {/* System Stats */}
          <div className="stats-section">
            <h2>⚙️ System Status</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-icon">👥</span>
                <h3>{stats.activeUsers}</h3>
                <p>Active Users</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">🔔</span>
                <h3>{stats.totalNotifications}</h3>
                <p>Unread Notifications</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">📝</span>
                <h3>{stats.totalReminders}</h3>
                <p>Active Reminders</p>
              </div>
              <div className="stat-card">
                <span className="stat-icon">✅</span>
                <h3>Online</h3>
                <p>System Status</p>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="activity-section">
          <h2>📈 Recent Activity Across All Modules</h2>
          
          {/* Recent Goats */}
          <div className="activity-module">
            <h3>🐐 Recent Goat Registrations</h3>
            {recentActivity.goats.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Breed</th>
                    <th>Sex</th>
                    <th>Age</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.goats.map(goat => (
                    <tr key={goat.goat_id}>
                      <td>{goat.goat_id}</td>
                      <td>{goat.breed}</td>
                      <td>{goat.sex}</td>
                      <td>{Math.floor((Date.now() - new Date(goat.date_of_birth)) / (1000 * 60 * 60 * 24 * 30))} months</td>
                      <td><span className={`badge badge-${goat.status.toLowerCase()}`}>{goat.status}</span></td>
                      <td>{new Date(goat.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No recent goat registrations</p>}
          </div>

          {/* Recent Health Records */}
          <div className="activity-module">
            <h3>💊 Recent Health Records</h3>
            {recentActivity.health.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Goat ID</th>
                    <th>Condition</th>
                    <th>Treatment</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.health.map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.goat_id}</td>
                      <td>{record.condition}</td>
                      <td>{record.treatment_given || 'N/A'}</td>
                      <td>{record.recovery_status || 'N/A'}</td>
                      <td>{new Date(record.record_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No recent health records</p>}
          </div>

          {/* Recent Vaccinations */}
          <div className="activity-module">
            <h3>💉 Recent Vaccinations</h3>
            {recentActivity.vaccination.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Goat ID</th>
                    <th>Drug Used</th>
                    <th>Purpose</th>
                    <th>Date</th>
                    <th>Next Due</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.vaccination.map((record, idx) => (
                    <tr key={idx}>
                      <td>{record.goat_id}</td>
                      <td>{record.drug_used}</td>
                      <td>{record.purpose}</td>
                      <td>{new Date(record.vaccination_date).toLocaleDateString()}</td>
                      <td>{record.next_vaccination_date ? new Date(record.next_vaccination_date).toLocaleDateString() : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No recent vaccinations</p>}
          </div>

          {/* Recent Sales */}
          <div className="activity-module">
            <h3>💰 Recent Sales</h3>
            {recentActivity.sales.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Goat ID</th>
                    <th>Buyer</th>
                    <th>Sale Price</th>
                    <th>Type</th>
                    <th>Sale Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.sales.map((sale, idx) => (
                    <tr key={idx}>
                      <td>{sale.goat_id}</td>
                      <td>{sale.buyer_name || sale.buyer || 'N/A'}</td>
                      <td>UGX {sale.sale_price?.toLocaleString() || 'N/A'}</td>
                      <td>{sale.breed ? 'Breeding' : 'Meat'}</td>
                      <td>{new Date(sale.sale_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No recent sales</p>}
          </div>

          {/* Recent Expenses */}
          <div className="activity-module">
            <h3>📊 Recent Expenses</h3>
            {recentActivity.expenses.length > 0 ? (
              <table className="activity-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Subcategory</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.expenses.map((expense, idx) => (
                    <tr key={idx}>
                      <td>{expense.category}</td>
                      <td>{expense.subcategory || 'N/A'}</td>
                      <td>UGX {expense.amount?.toLocaleString() || 'N/A'}</td>
                      <td>{expense.description || 'N/A'}</td>
                      <td>{new Date(expense.expense_date).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : <p className="no-data">No recent expenses</p>}
          </div>
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div className="users-section">
        <div className="section-header">
          <h2>👥 User Management</h2>
          <button 
            className="btn-add-user"
            onClick={() => setShowAddUser(!showAddUser)}
          >
            {showAddUser ? '✕ Cancel' : '+ Add User'}
          </button>
        </div>

        {showAddUser && (
          <form onSubmit={handleAddUser} className="add-user-form">
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({...newUser, email: e.target.value})}
              autoComplete="email"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({...newUser, password: e.target.value})}
              autoComplete="new-password"
              required
            />
            <input
              type="text"
              placeholder="Full Name"
              value={newUser.fullName}
              onChange={(e) => setNewUser({...newUser, fullName: e.target.value})}
              autoComplete="name"
              required
            />
            <select
              value={newUser.role}
              onChange={(e) => setNewUser({...newUser, role: e.target.value})}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            <button type="submit" className="btn-submit">Add User</button>
          </form>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.user_id}>
                  <td>{user.full_name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge role-${user.role}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${user.is_active ? 'active' : 'inactive'}`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>{user.last_login ? new Date(user.last_login).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => handleToggleUserStatus(user.user_id, user.is_active)}
                        className="btn-toggle"
                        title={user.is_active ? 'Deactivate' : 'Activate'}
                      >
                        {user.is_active ? '🔒' : '🔓'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.user_id)}
                        className="btn-delete"
                        title="Delete user"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
