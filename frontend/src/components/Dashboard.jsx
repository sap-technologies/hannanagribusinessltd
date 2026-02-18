import React from 'react';
import './Dashboard.css';

const Dashboard = ({ onNavigate }) => {
  const projects = [
    {
      id: 'breeding-farm',
      name: 'Hannan Breeding Farm',
      icon: '🐐',
      description: 'Goat livestock management and breeding operations',
      color: '#27ae60',
      stats: ['Goat Registration', 'Breeding Records', 'Health Tracking']
    },
    {
      id: 'matooke',
      name: 'Matooke Project',
      icon: '🍌',
      description: 'Matooke farming and production management',
      color: '#f39c12',
      stats: ['Farm Management', 'Yield Tracking', 'Harvest Planning']
    },
    {
      id: 'coffee',
      name: 'Coffee Project',
      icon: '🌱',
      description: 'Coffee farming and quality management',
      color: '#8b4513',
      stats: ['Plantation Management', 'Quality Grading', 'Production Analytics']
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome to Hannan Agribusiness Limited</h1>
        <p className="dashboard-subtitle">
          Integrated Business Management System for Agricultural Excellence
        </p>
      </div>

      <div className="projects-grid">
        {projects.map(project => (
          <div 
            key={project.id} 
            className="project-card"
            onClick={() => onNavigate(project.id)}
            style={{ borderTopColor: project.color }}
          >
            <div className="project-icon" style={{ color: project.color }}>
              {project.icon}
            </div>
            <h2>{project.name}</h2>
            <p className="project-description">{project.description}</p>
            <ul className="project-features">
              {project.stats.map((stat, index) => (
                <li key={index}>
                  <span className="feature-bullet" style={{ backgroundColor: project.color }}>✓</span>
                  {stat}
                </li>
              ))}
            </ul>
            <button 
              className="project-btn"
              style={{ backgroundColor: project.color }}
            >
              Open Project →
            </button>
          </div>
        ))}
      </div>

      <div className="dashboard-footer">
        <div className="footer-info">
          <h3>About Hannan Agribusiness Limited</h3>
          <p>
            Leading agricultural enterprise dedicated to excellence in livestock breeding, 
            crop production, and sustainable farming practices. Our integrated management 
            system ensures optimal operations across all our business units.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
