import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SearchFilter.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1230';

const SearchFilter = ({ type, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({});
  const [filterOptions, setFilterOptions] = useState({});

  // Fetch filter options on mount
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const response = await axios.get(`${API_URL}/api/search/filter-options`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFilterOptions(response.data);
    } catch (error) {
      console.error('Error fetching filter options:', error);
    }
  };

  const handleSearch = () => {
    const searchParams = {
      search: searchTerm,
      ...filters,
    };
    onSearch(searchParams);
  };

  const handleFilterChange = (key, value) => {
    setFilters({
      ...filters,
      [key]: value,
    });
  };

  const handleReset = () => {
    setSearchTerm('');
    setFilters({});
    onSearch({});
  };

  return (
    <div className="search-filter">
      <div className="search-box">
        <input
          type="text"
          placeholder="🔍 Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button onClick={handleSearch} className="search-btn">
          Search
        </button>
        <button onClick={handleReset} className="reset-btn">
          Reset
        </button>
      </div>

      {type === 'goats' && (
        <div className="filter-controls">
          <select
            value={filters.breed || ''}
            onChange={(e) => handleFilterChange('breed', e.target.value)}
          >
            <option value="">All Breeds</option>
            {filterOptions.breeds?.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>

          <select
            value={filters.sex || ''}
            onChange={(e) => handleFilterChange('sex', e.target.value)}
          >
            <option value="">All Sexes</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>

          <select
            value={filters.status || ''}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            <option value="">All Statuses</option>
            {filterOptions.statuses?.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            value={filters.purpose || ''}
            onChange={(e) => handleFilterChange('purpose', e.target.value)}
          >
            <option value="">All Purposes</option>
            {filterOptions.purposes?.map((purpose) => (
              <option key={purpose} value={purpose}>
                {purpose}
              </option>
            ))}
          </select>

          <select
            value={filters.sortBy || 'goat_id'}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="goat_id">Sort by ID</option>
            <option value="tag_number">Sort by Tag</option>
            <option value="breed">Sort by Breed</option>
            <option value="date_of_birth">Sort by Age</option>
            <option value="weight_kg">Sort by Weight</option>
          </select>

          <select
            value={filters.sortOrder || 'DESC'}
            onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
          >
            <option value="DESC">Descending</option>
            <option value="ASC">Ascending</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default SearchFilter;
