import React from 'react';
import './GoatDetails.css';

const GoatDetails = ({ goat, onClose }) => {
  if (!goat) return null;

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
    
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    const days = Math.floor((diffDays % 365) % 30);
    
    let ageString = '';
    if (years > 0) ageString += `${years} year${years > 1 ? 's' : ''} `;
    if (months > 0) ageString += `${months} month${months > 1 ? 's' : ''} `;
    if (days > 0 && years === 0) ageString += `${days} day${days > 1 ? 's' : ''}`;
    
    return ageString.trim() || '0 days';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Goat Details: {goat.goat_id}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>
        
        <div className="modal-body">
          {goat.photo_url && (
            <div className="goat-photo-section">
              <img 
                src={goat.photo_url.startsWith('http') ? goat.photo_url : `${(import.meta.env.VITE_API_URL || '/api').replace('/api', '')}${goat.photo_url}`} 
                alt={`Goat ${goat.goat_id}`}
                className="goat-photo"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          
          <div className="details-grid">
            <div className="detail-item">
              <label>Goat ID</label>
              <div className="value">{goat.goat_id}</div>
            </div>
            
            <div className="detail-item">
              <label>Breed</label>
              <div className="value">{goat.breed}</div>
            </div>
            
            <div className="detail-item">
              <label>Sex</label>
              <div className="value">
                <span className={`sex-badge ${goat.sex.toLowerCase()}`}>
                  {goat.sex}
                </span>
              </div>
            </div>
            
            <div className="detail-item">
              <label>Date of Birth</label>
              <div className="value">{formatDate(goat.date_of_birth)}</div>
            </div>
            
            <div className="detail-item">
              <label>Age</label>
              <div className="value">{calculateAge(goat.date_of_birth)}</div>
            </div>
            
            <div className="detail-item">
              <label>Production Type</label>
              <div className="value">{goat.production_type}</div>
            </div>
            
            <div className="detail-item">
              <label>Source</label>
              <div className="value">{goat.source || 'N/A'}</div>
            </div>
            
            <div className="detail-item">
              <label>Status</label>
              <div className="value">
                <span className="status-badge" style={{ backgroundColor: getStatusColor(goat.status) }}>
                  {goat.status}
                </span>
              </div>
            </div>
            
            <div className="detail-item">
              <label>Weight</label>
              <div className="value">{goat.weight ? `${goat.weight} kg` : 'N/A'}</div>
            </div>
            
            <div className="detail-item">
              <label>Mother ID</label>
              <div className="value">{goat.mother_id || 'N/A'}</div>
            </div>
            
            <div className="detail-item">
              <label>Father ID</label>
              <div className="value">{goat.father_id || 'N/A'}</div>
            </div>
            
            <div className="detail-item">
              <label>Registered On</label>
              <div className="value">{formatDate(goat.created_at)}</div>
            </div>
          </div>
          
          {goat.remarks && (
            <div className="remarks-section">
              <label>Remarks</label>
              <div className="remarks-content">{goat.remarks}</div>
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
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

export default GoatDetails;
