import React from 'react';
import './Navigation.css';

const Navigation = ({ currentProject, onProjectChange }) => {
  const projects = [
    { id: 'dashboard', name: 'Dashboard', icon: '🏠' },
    { id: 'breeding-farm', name: 'Breeding Farm', icon: '🐐' },
    { id: 'matooke', name: 'Matooke Project', icon: '🍌' },
    { id: 'coffee', name: 'Coffee Project', icon: '☕' }
  ];

  return (
    <nav className="main-navigation">
      <div className="nav-menu">
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onProjectChange(project.id)}
            className={`nav-item ${currentProject === project.id ? 'active' : ''}`}
          >
            <span className="nav-icon">{project.icon}</span>
            <span className="nav-label">{project.name}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;
