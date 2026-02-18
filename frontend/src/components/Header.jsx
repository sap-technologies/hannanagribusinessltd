import React from 'react';
import './Header.css';

const Header = ({ onSearch }) => {
  const handleSearch = (e) => {
    onSearch(e.target.value);
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-title">
          <h1>🐐 Hannan Agribusiness Limited</h1>
          <p className="subtitle">Goat Management System - Hannan Breeding Farm</p>
        </div>
        <div className="header-search">
          <input
            type="text"
            placeholder="Search goats by ID, breed, status..."
            onChange={handleSearch}
            className="search-input"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
