import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './FeedingDetails.css';

const FeedingDetails = ({ record, onClose }) => {
  if (!record) return null;

  const getPurposeColor = (purpose) => {
    return purpose === 'Fattening' ? '#ea580c' : '#2563eb';
  };

  const formatNumber = (num) => {
    if (!num) return 'N/A';
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Feeding Record Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Goat/Group Information */}
          <div className="details-section">
            <h3>{record.goat_id ? 'Goat Information' : 'Group Information'}</h3>
            <div className="details-grid">
              {record.goat_id ? (
                <>
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
                    <span className="detail-label">Current Weight</span>
                    <span className="detail-value">{record.current_weight ? `${formatNumber(record.current_weight)} kg` : 'N/A'}</span>
                  </div>
                </>
              ) : (
                <div className="detail-item" style={{ gridColumn: '1 / -1' }}>
                  <span className="detail-label">Group Name</span>
                  <span className="detail-value"><strong>{record.group_name}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Feeding Details */}
          <div className="details-section">
            <h3>Feeding Details</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Date</span>
                <span className="detail-value">{formatDate(record.record_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Feed Type</span>
                <span className="detail-value"><strong>{record.feed_type}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Quantity Used</span>
                <span className="detail-value">{formatNumber(record.quantity_used)} kg</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Purpose</span>
                <span className="detail-value">
                  {record.purpose ? (
                    <span 
                      className="badge" 
                      style={{ backgroundColor: getPurposeColor(record.purpose), color: 'white' }}
                    >
                      {record.purpose}
                    </span>
                  ) : (
                    'Not specified'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Performance Metrics */}
          {record.weight_gain_kgs && (
            <div className="details-section">
              <h3>Performance Metrics</h3>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">Weight Gain Observed</span>
                  <span className="detail-value" style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1em' }}>
                    +{formatNumber(record.weight_gain_kgs)} kg
                  </span>
                </div>
                {record.quantity_used && record.weight_gain_kgs && (
                  <div className="detail-item">
                    <span className="detail-label">Feed Conversion Ratio</span>
                    <span className="detail-value">
                      {(parseFloat(record.quantity_used) / parseFloat(record.weight_gain_kgs)).toFixed(2)} : 1
                      <span style={{ fontSize: '0.85em', color: '#6b7280', marginLeft: '8px' }}>
                        (Feed : Gain)
                      </span>
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Notes */}
          {record.remarks && (
            <div className="details-section">
              <h3>Remarks</h3>
              <div className="detail-text-block">
                {record.remarks}
              </div>
            </div>
          )}

          {/* Record Information */}
          <div className="details-section">
            <h3>Record Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Record ID</span>
                <span className="detail-value">{record.feeding_id}</span>
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

export default FeedingDetails;
