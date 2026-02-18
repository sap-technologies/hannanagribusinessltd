import React, { useState } from 'react';
import { searchService } from '../services/api';
import './GlobalSearch.css';

const GlobalSearch = ({ onClose }) => {
  const [searchType, setSearchType] = useState('goats'); // 'goats', 'health', 'sales'
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [filters, setFilters] = useState({});

  const handleSearch = async () => {
    if (!searchTerm && Object.keys(filters).length === 0) {
      setMessage('Please enter a search term or select filters');
      return;
    }

    setLoading(true);
    setMessage('');
    
    try {
      let data;
      const searchParams = {
        search: searchTerm,
        ...filters
      };

      switch (searchType) {
        case 'goats':
          data = await searchService.searchGoats(searchParams);
          break;
        case 'health':
          data = await searchService.searchHealthRecords(searchParams);
          break;
        case 'sales':
          data = await searchService.searchSales(searchParams);
          break;
        default:
          data = { success: false, message: 'Invalid search type' };
      }

      if (data.success) {
        setResults(data.data || []);
        setMessage(data.data?.length ? `Found ${data.data.length} results` : 'No results found');
      } else {
        setMessage(data.message || 'Search failed');
        setResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setMessage('Error performing search');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const renderGoatResult = (goat) => (
    <div key={goat.goat_id} className="search-result-card">
      <div className="result-header">
        <span className="result-tag">🐐 {goat.goat_id}</span>
        <span className={`result-status ${goat.status?.toLowerCase()}`}>{goat.status}</span>
      </div>
      <div className="result-info">
        <div className="info-row">
          <strong>Breed:</strong> {goat.breed}
        </div>
        <div className="info-row">
          <strong>Sex:</strong> {goat.sex} | <strong>Birth:</strong> {formatDate(goat.birth_date)}
        </div>
        {goat.weight && (
          <div className="info-row">
            <strong>Weight:</strong> {goat.weight} kg
          </div>
        )}
      </div>
    </div>
  );

  const renderHealthResult = (record) => (
    <div key={record.record_id} className="search-result-card health">
      <div className="result-header">
        <span className="result-tag">🏥 Record #{record.record_id}</span>
        <span className={`result-status ${record.recovery_status?.toLowerCase().replace(' ', '-')}`}>
          {record.recovery_status}
        </span>
      </div>
      <div className="result-info">
        <div className="info-row">
          <strong>Goat:</strong> {record.goat_tag}
        </div>
        <div className="info-row">
          <strong>Diagnosis:</strong> {record.diagnosis}
        </div>
        <div className="info-row">
          <strong>Date:</strong> {formatDate(record.record_date)}
        </div>
        {record.veterinarian && (
          <div className="info-row">
            <strong>Vet:</strong> {record.veterinarian}
          </div>
        )}
      </div>
    </div>
  );

  const renderSalesResult = (sale) => (
    <div key={sale.sale_id} className="search-result-card sales">
      <div className="result-header">
        <span className="result-tag">💰 Sale #{sale.sale_id}</span>
        <span className={`result-status ${sale.payment_status?.toLowerCase()}`}>
          {sale.payment_status}
        </span>
      </div>
      <div className="result-info">
        <div className="info-row">
          <strong>Goat:</strong> {sale.goat_tag}
        </div>
        <div className="info-row">
          <strong>Price:</strong> UGX {parseInt(sale.price_ugx || 0).toLocaleString()}
        </div>
        <div className="info-row">
          <strong>Date:</strong> {formatDate(sale.sale_date)}
        </div>
        <div className="info-row">
          <strong>Buyer:</strong> {sale.buyer_name}
        </div>
      </div>
    </div>
  );

  const renderResults = () => {
    if (results.length === 0) return null;

    return (
      <div className="search-results">
        {searchType === 'goats' && results.map(renderGoatResult)}
        {searchType === 'health' && results.map(renderHealthResult)}
        {searchType === 'sales' && results.map(renderSalesResult)}
      </div>
    );
  };

  return (
    <div className="global-search-overlay" onClick={onClose}>
      <div className="global-search-modal" onClick={(e) => e.stopPropagation()}>
        <div className="search-modal-header">
          <h2>🔍 Global Search</h2>
          <button onClick={onClose} className="btn-close">✕</button>
        </div>

        <div className="search-controls">
          <div className="search-type-selector">
            <button
              className={`type-btn ${searchType === 'goats' ? 'active' : ''}`}
              onClick={() => { setSearchType('goats'); setResults([]); }}
            >
              🐐 Goats
            </button>
            <button
              className={`type-btn ${searchType === 'health' ? 'active' : ''}`}
              onClick={() => { setSearchType('health'); setResults([]); }}
            >
              🏥 Health
            </button>
            <button
              className={`type-btn ${searchType === 'sales' ? 'active' : ''}`}
              onClick={() => { setSearchType('sales'); setResults([]); }}
            >
              💰 Sales
            </button>
          </div>

          <div className="search-input-group">
            <input
              type="text"
              placeholder={`Search ${searchType}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              className="search-input"
              autoFocus
            />
            <button onClick={handleSearch} disabled={loading} className="btn-search">
              {loading ? '⏳' : '🔍'} Search
            </button>
          </div>

          {searchType === 'goats' && (
            <div className="quick-filters">
              <select onChange={(e) => setFilters({ ...filters, status: e.target.value })} className="filter-select">
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Sold">Sold</option>
                <option value="Deceased">Deceased</option>
              </select>
              <select onChange={(e) => setFilters({ ...filters, sex: e.target.value })} className="filter-select">
                <option value="">All Sex</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
          )}

          {searchType === 'health' && (
            <div className="quick-filters">
              <select onChange={(e) => setFilters({ ...filters, recovery_status: e.target.value })} className="filter-select">
                <option value="">All Recovery Status</option>
                <option value="Fully Recovered">Fully Recovered</option>
                <option value="Recovering">Recovering</option>
                <option value="In Treatment">In Treatment</option>
              </select>
            </div>
          )}

          {searchType === 'sales' && (
            <div className="quick-filters">
              <select onChange={(e) => setFilters({ ...filters, payment_status: e.target.value })} className="filter-select">
                <option value="">All Payment Status</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
              </select>
            </div>
          )}
        </div>

        {message && (
          <div className={`search-message ${results.length > 0 ? 'success' : 'info'}`}>
            {message}
          </div>
        )}

        <div className="search-results-container">
          {renderResults()}
          {!loading && results.length === 0 && searchTerm && (
            <div className="no-results">
              <div className="no-results-icon">🔍</div>
              <h3>No results found</h3>
              <p>Try different search terms or adjust your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
