import { useState } from 'react';
import './BreedingFarmSidebar.css';

function BreedingFarmSidebar({ activeTab, onTabChange, isMobileMenuOpen, onCloseMobileMenu, onBackToDashboard }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    livestock: true,
    health: true,
    sales: true,
    records: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleTabClick = (tab) => {
    onTabChange(tab);
    if (onCloseMobileMenu) {
      onCloseMobileMenu();
    }
  };

  const modules = {
    livestock: {
      title: 'Livestock Management',
      icon: '🐐',
      items: [
        { id: 'goats', label: 'Goat Registry', icon: '🐐' },
        { id: 'breeding', label: 'Breeding & Kidding', icon: '🍼' },
        { id: 'kid-growth', label: 'Kid Growth & Weaning', icon: '📈' },
        { id: 'feeding', label: 'Feeding & Fattening', icon: '🌾' }
      ]
    },
    health: {
      title: 'Health & Care',
      icon: '🏥',
      items: [
        { id: 'health', label: 'Health & Treatment', icon: '🏥' },
        { id: 'vaccination', label: 'Vaccination & Deworming', icon: '💉' }
      ]
    },
    sales: {
      title: 'Sales & Revenue',
      icon: '💰',
      items: [
        { id: 'sales-breeding', label: 'Sales - Breeding', icon: '💰' },
        { id: 'sales-meat', label: 'Sales - Meat', icon: '🥩' }
      ]
    },
    records: {
      title: 'Financial Records',
      icon: '📊',
      items: [
        { id: 'expenses', label: 'Expenses', icon: '💸' },
        { id: 'monthly-summary', label: 'Monthly Summary', icon: '📊' }
      ]
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div className="sidebar-overlay" onClick={onCloseMobileMenu}></div>
      )}

      {/* Sidebar */}
      <aside className={`breeding-farm-sidebar ${isCollapsed ? 'collapsed' : ''} ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header">
          {!isCollapsed && (
            <>
              <button 
                className="back-to-dashboard-btn" 
                onClick={onBackToDashboard}
                title="Back to Dashboard"
              >
                <span className="back-icon">←</span>
                <span className="back-text">Dashboard</span>
              </button>
              <div className="sidebar-title-row">
                <div className="sidebar-title">
                  <span className="sidebar-icon">🐐</span>
                  <h2>Breeding Farm</h2>
                </div>
                <button 
                  className="collapse-btn" 
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  title="Collapse sidebar"
                >
                  ←
                </button>
              </div>
            </>
          )}
          {isCollapsed && (
            <button 
              className="collapse-btn" 
              onClick={() => setIsCollapsed(false)}
              title="Expand sidebar"
            >
              →
            </button>
          )}
        </div>

        {/* Navigation Sections */}
        <nav className="sidebar-nav">
          {Object.entries(modules).map(([sectionKey, section]) => (
            <div key={sectionKey} className="nav-section">
              <button 
                className="section-header"
                onClick={() => toggleSection(sectionKey)}
              >
                <span className="section-icon">{section.icon}</span>
                {!isCollapsed && (
                  <>
                    <span className="section-title">{section.title}</span>
                    <span className="expand-icon">
                      {expandedSections[sectionKey] ? '▼' : '▶'}
                    </span>
                  </>
                )}
              </button>
              
              {expandedSections[sectionKey] && (
                <ul className="nav-items">
                  {section.items.map(item => (
                    <li key={item.id}>
                      <button
                        className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => handleTabClick(item.id)}
                        title={item.label}
                      >
                        <span className="item-icon">{item.icon}</span>
                        {!isCollapsed && <span className="item-label">{item.label}</span>}
                        {activeTab === item.id && <span className="active-indicator"></span>}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default BreedingFarmSidebar;
