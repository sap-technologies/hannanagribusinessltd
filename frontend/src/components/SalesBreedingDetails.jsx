import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './SalesBreedingDetails.css';

const SalesBreedingDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatCurrency = (amount) => {
    if (!amount) return 'UGX 0';
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFracionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getPaymentColor = (method) => {
    const colors = {
      'Cash': '#16a34a',
      'Mobile Money': '#2563eb',
      'Bank Transfer': '#7c3aed',
      'Credit': '#ea580c'
    };
    return colors[method] || '#6b7280';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Breeding Sale Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          {/* Sale Information */}
          <div className="details-section">
            <h3>Sale Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Sale Date</span>
                <span className="detail-value">{formatDate(record.sale_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sale ID</span>
                <span className="detail-value">{record.sale_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Buyer</span>
                <span className="detail-value"><strong>{record.buyer}</strong></span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sale Price</span>
                <span className="detail-value" style={{ color: '#16a34a', fontWeight: 'bold', fontSize: '1.1em' }}>
                  {formatCurrency(record.sale_price_ugx)}
                </span>
              </div>
            </div>
          </div>

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
                <span className="detail-value">{record.breed || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Sex</span>
                <span className="detail-value">{record.sex || 'Not specified'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age at Sale</span>
                <span className="detail-value">
                  {record.age_months ? `${record.age_months} months` : 'Not specified'}
                </span>
              </div>
              {record.date_of_birth && (
                <div className="detail-item">
                  <span className="detail-label">Date of Birth</span>
                  <span className="detail-value">{formatDate(record.date_of_birth)}</span>
                </div>
              )}
              {record.production_type && (
                <div className="detail-item">
                  <span className="detail-label">Production Type</span>
                  <span className="detail-value">{record.production_type}</span>
                </div>
              )}
            </div>
          </div>

          {/* Payment Information */}
          <div className="details-section">
            <h3>Payment Information</h3>
            <div className="details-grid">
              <div className="detail-item">
                <span className="detail-label">Payment Method</span>
                <span className="detail-value">
                  {record.payment_method ? (
                    <span 
                      className="badge" 
                      style={{ backgroundColor: getPaymentColor(record.payment_method), color: 'white' }}
                    >
                      {record.payment_method}
                    </span>
                  ) : (
                    'Not specified'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* Record Information */}
          <div className="details-section">
            <h3>Record Information</h3>
            <div className="details-grid">
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

export default SalesBreedingDetails;
