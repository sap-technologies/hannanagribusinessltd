import React, { useState, useEffect } from 'react';
import App from './App';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import NotificationBell from './components/NotificationBell';
import NotificationsPage from './components/NotificationsPage';
import RemindersPage from './components/RemindersPage';
import GlobalSearch from './components/GlobalSearch';
import HelpPage from './components/HelpPage';
import Footer from './components/Footer';
import { authService } from './services/authService';
import logo from './assets/logo.png';

import './AppWithAuth.css';

function AppWithAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [showAdmin, setShowAdmin] = useState(() => {
    const saved = localStorage.getItem('showAdmin');
    return saved === 'true';
  });
  const [showProfile, setShowProfile] = useState(() => {
    const saved = localStorage.getItem('showProfile');
    return saved === 'true';
  });
  const [showNotifications, setShowNotifications] = useState(() => {
    const saved = localStorage.getItem('showNotifications');
    return saved === 'true';
  });
  const [showReminders, setShowReminders] = useState(() => {
    const saved = localStorage.getItem('showReminders');
    return saved === 'true';
  });
  const [showHelp, setShowHelp] = useState(() => {
    const saved = localStorage.getItem('showHelp');
    return saved === 'true';
  });
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  // Persist view states to localStorage
  useEffect(() => {
    localStorage.setItem('showAdmin', showAdmin);
  }, [showAdmin]);

  useEffect(() => {
    localStorage.setItem('showProfile', showProfile);
  }, [showProfile]);

  useEffect(() => {
    localStorage.setItem('showNotifications', showNotifications);
  }, [showNotifications]);

  useEffect(() => {
    localStorage.setItem('showReminders', showReminders);
  }, [showReminders]);
  useEffect(() => {
    localStorage.setItem('showHelp', showHelp);
  }, [showHelp]);
  const checkAuth = () => {
    const authenticated = authService.isAuthenticated();
    const currentUser = authService.getUser();
    setIsAuthenticated(authenticated);
    setUser(currentUser);
    setLoading(false);
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to logout?')) {
      await authService.logout();
      // Clear navigation state on logout
      localStorage.removeItem('showAdmin');
      localStorage.removeItem('showProfile');
      localStorage.removeItem('showNotifications');
      localStorage.removeItem('showReminders');
      localStorage.removeItem('currentProject');
      localStorage.removeItem('breedingFarmTab');
      localStorage.removeItem('adminActiveTab');
      setIsAuthenticated(false);
      setUser(null);
      setShowAdmin(false);
      setShowProfile(false);
      setShowNotifications(false);
      setShowReminders(false);
    }
  };

  const handleProfileClick = () => {
    setShowAdmin(false);
    setShowProfile(true);
    setShowNotifications(false);
    setShowReminders(false);
    setShowHelp(false);
  };

  const handleNotificationsClick = () => {
    setShowAdmin(false);
    setShowProfile(false);
    setShowNotifications(true);
    setShowReminders(false);
    setShowHelp(false);
  };

  const handleRemindersClick = () => {
    setShowAdmin(false);
    setShowProfile(false);
    setShowNotifications(false);
    setShowReminders(true);
    setShowHelp(false);
  };

  const handleHelpClick = () => {
    setShowAdmin(false);
    setShowProfile(false);
    setShowNotifications(false);
    setShowReminders(false);
    setShowHelp(true);
  };

  const handleSearchClick = () => {
    setShowSearch(true);
  };

  const handleDashboardClick = () => {
    setShowAdmin(false);
    setShowProfile(false);
    setShowNotifications(false);
    setShowReminders(false);
    setShowHelp(false);
    setShowSearch(false);
    // Trigger navigation to dashboard in App component
    const dashboardEvent = new CustomEvent('navigateToDashboard');
    window.dispatchEvent(dashboardEvent);
  };

  const handleBackToMain = () => {
    setShowAdmin(false);
    setShowProfile(false);
    setShowNotifications(false);
    setShowReminders(false);
    setShowHelp(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    // Update user state when profile is updated
    setUser(updatedUser);
    // Also update in localStorage
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  if (loading) {
    return (
      <div className="auth-loading">
        <div className="loader"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="app-with-auth">
      <div className="auth-header">
        <div className="header-left">
          <div className="header-logo-container" onClick={handleBackToMain} style={{ cursor: 'pointer' }}>
            <img src={logo} alt="Hannan Agribusiness Limited" className="header-logo" />
            <h2>Hannan Agribusiness Limited</h2>
          </div>
        </div>
        <div className="header-right">
          <button 
            className="btn-dashboard"
            onClick={handleDashboardClick}
            title="Go to Dashboard"
          >
            <span className="btn-icon">🏠</span>
            <span className="btn-text">Dashboard</span>
          </button>
          <button 
            className="btn-reminders"
            onClick={handleRemindersClick}
            title="View Reminders"
          >
            <span className="btn-icon">📌</span>
            <span className="btn-text">Reminders</span>
          </button>
          <button 
            className="btn-help"
            onClick={handleHelpClick}
            title="Help & Documentation"
          >
            <span className="btn-icon">📚</span>
            <span className="btn-text">Help</span>
          </button>
          <NotificationBell onNotificationsClick={handleNotificationsClick} />
          {authService.isAdmin() && (
            <button 
              className="btn-admin-toggle"
              onClick={() => {
                setShowAdmin(!showAdmin);
                setShowProfile(false);
                setShowNotifications(false);
                setShowReminders(false);
                setShowHelp(false);
              }}
              title={showAdmin ? 'Dashboard' : 'Admin Panel'}
            >
              <span className="btn-icon">{showAdmin ? '📊' : '🔐'}</span>
              <span className="btn-text">{showAdmin ? 'Dashboard' : 'Admin'}</span>
            </button>
          )}
          <button 
            className="btn-profile"
            onClick={handleProfileClick}
            title={`${user?.fullName} (${user?.role})`}
          >
            {user?.profilePhoto ? (
              <img 
                src={user.profilePhoto.startsWith('http') ? user.profilePhoto : user.profilePhoto}
                alt={user.fullName}
                className="header-profile-photo"
                onError={(e) => {
                  console.warn('Failed to load profile photo:', user.profilePhoto);
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="32" height="32"%3E%3Crect fill="%23fff" width="32" height="32"/%3E%3Ctext x="50%25" y="50%25" font-size="20" text-anchor="middle" dy=".3em" fill="%231e3c72"%3E👤%3C/text%3E%3C/svg%3E';
                }}
              />
            ) : (
              <span>👤</span>
            )}
            <span className="profile-name-text">{user?.fullName}</span>
          </button>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <span className="btn-icon">🚪</span>
            <span className="btn-text">Logout</span>
          </button>
          <button 
            className="btn-search"
            onClick={handleSearchClick}
            title="Global Search"
          >
            <span className="btn-icon">🔍</span>
            <span className="btn-text">Search</span>
          </button>
        </div>
      </div>
      
      <div className="auth-content">
        {showHelp ? (
          <HelpPage onClose={handleBackToMain} />
        ) : showReminders ? (
          <RemindersPage onBack={handleBackToMain} />
        ) : showNotifications ? (
          <NotificationsPage onClose={handleBackToMain} />
        ) : showAdmin && authService.isAdmin() ? (
          <AdminDashboard onBack={() => setShowAdmin(false)} />
        ) : (
          <App 
            user={user} 
            onProfileUpdate={handleProfileUpdate}
            showProfile={showProfile}
            onProfileNavigate={(show) => {
              setShowProfile(show);
              setShowAdmin(false);
              setShowNotifications(false);
              setShowReminders(false);
            }}
          />
        )}
      </div>

      {showSearch && (
        <GlobalSearch onClose={() => setShowSearch(false)} />
      )}
      
      <Footer />
    </div>
  );
}

export default AppWithAuth;
