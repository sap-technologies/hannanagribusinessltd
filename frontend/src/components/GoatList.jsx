import React from 'react';
import './GoatList.css';

const GoatList = ({ goats, onEdit, onDelete, onViewDetails }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const calculateAge = (birthDate) => {
    if (!birthDate) return 'N/A';
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today - birth);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 30) return `${diffDays} days`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months`;
    return `${Math.floor(diffDays / 365)} years`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'Active': '#27ae60',
      'Sold': '#3498db',
      'Deceased': '#e74c3c',
      'Quarantine': '#f39c12'
    };
    return colors[status] || '#95a5a6';
  };

  if (goats.length === 0) {
    return (
      <div className="goat-list-container">
        <div className="empty-state">
          <h3>No goats registered yet</h3>
          <p>Start by registering your first goat using the form above.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="goat-list-container">
      <h2>Registered Goats ({goats.length})</h2>
      <div className="goat-table-wrapper">
        <table className="goat-table">
          <thead>
            <tr>
              <th>Goat ID</th>
              <th>Breed</th>
              <th>Sex</th>
              <th>Age</th>
              <th>Production Type</th>
              <th>Status</th>
              <th>Weight (kg)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {goats.map((goat) => (
              <tr key={goat.goat_id}>
                <td className="goat-id">{goat.goat_id}</td>
                <td>{goat.breed}</td>
                <td>
                  <span className={`sex-badge ${goat.sex.toLowerCase()}`}>
                    {goat.sex}
                  </span>
                </td>
                <td>{calculateAge(goat.date_of_birth)}</td>
                <td>{goat.production_type}</td>
                <td>
                  <span 
                    className="status-badge" 
                    style={{ backgroundColor: getStatusColor(goat.status) }}
                  >
                    {goat.status}
                  </span>
                </td>
                <td>{goat.weight || 'N/A'}</td>
                <td className="actions">
                  <button 
                    onClick={() => onViewDetails(goat)}
                    className="btn-action btn-view"
                    title="View Details"
                  >
                    👁️
                  </button>
                  <button 
                    onClick={() => onEdit(goat)}
                    className="btn-action btn-edit"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button 
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${goat.goat_id}?`)) {
                        onDelete(goat.goat_id);
                      }
                    }}
                    className="btn-action btn-delete"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GoatList;
