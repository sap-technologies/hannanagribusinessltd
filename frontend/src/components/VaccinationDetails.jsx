import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './VaccinationDetails.css';

const VaccinationDetails = ({ record, onClose }) => {
  if (!record) return null;

  const getTypeBadgeColor = (type) => {
    return type === 'Vaccine' ? '#2563eb' : '#16a34a';
  };

  const getDueStatusInfo = (nextDueDate) => {
    if (!nextDueDate) return null;
    
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return {
        status: 'OVERDUE',
        text: `Overdue by ${Math.abs(diffDays)} days`,
        color: '#dc2626'
      };
    } else if (diffDays <= 7) {
      return {
        status: 'DUE SOON',
        text: `Due in ${diffDays} days`,
        color: '#ea580c'
      };
    } else if (diffDays <= 30) {
      return {
        status: 'UPCOMING',
        text: `Due in ${diffDays} days`,
        color: '#ca8a04'
      };
    }
    return {
      status: 'SCHEDULED',
      text: formatDate(nextDueDate),
      color: '#6b7280'
    };
  };

  const dueInfo = getDueStatusInfo(record.next_due_date);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Vaccination Record Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Goat Information */}
          <div className="details-section">
            <h3>Goat Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Goat ID</span>
                <span className="detail-value"><strong>{record.goat_id}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Breed</span>
                <span className="detail-value">{record.breed || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sex</span>
                <span className="detail-value">{record.sex || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date of Birth</span>
                <span className="detail-value">{record.date_of_birth ? formatDate(record.date_of_birth) : 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Treatment Information */}
          <div className="details-section">
            <h3>Treatment Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(record.record_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Type</span>
                <span className="detail-value">
                  <span 
                    className="badge" 
                    style={{ backgroundColor: getTypeBadgeColor(record.type), color: 'white' }}
                  >
                    {record.type}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Drug Used</span>
                <span className="detail-value"><strong>{record.drug_used}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Dosage</span>
                <span className="detail-value">{record.dosage || 'Not specified'}</span>
              </div>
            </div>
          </div>

          {/* Next Due Information */}
          {record.next_due_date && dueInfo && (
            <div className="details-section">
              <h3>Next Due Date</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Due Date</span>
                  <span className="detail-value">{formatDate(record.next_due_date)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Status</span>
                  <span className="detail-value">
                    <span 
                      className="badge" 
                      style={{ backgroundColor: dueInfo.color, color: 'white' }}
                    >
                      {dueInfo.status}
                    </span>
                  </span>
                </div>
                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="detail-label">Days Remaining</span>
                  <span className="detail-value">{dueInfo.text}</span>
                </div>
              </div>
            </div>
          )}

          {/* Record Information */}
          <div className="details-section">
            <h3>Record Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Record ID</span>
                <span className="detail-value">{record.vaccination_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Created At</span>
                <span className="detail-value">{record.created_at ? formatDate(record.created_at) : 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Last Updated</span>
                <span className="detail-value">{record.updated_at ? formatDate(record.updated_at) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button onClick={onClose} className="btn-secondary">Close</button>
        </div>
      </div>
    </div>
  );
};

export default VaccinationDetails;
