import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './SalesMeatDetails.css';

const SalesMeatDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatCurrency = (amount) => {
    if (!amount) return 'UGX 0';
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatWeight = (weight) => {
    if (!weight) return 'N/A';
    return `${parseFloat(weight).toFixed(2)} kg`;
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

  const getPaymentClass = (method) => {
    const classes = {
      'Cash': 'cash',
      'Mobile Money': 'mobile-money',
      'Bank Transfer': 'bank-transfer',
      'Credit': 'credit'
    };
    return classes[method] || '';
  };

  return (
    <div className="sales-meat-details-overlay" onClick={onClose}>
      <div className="sales-meat-details-content" onClick={(e) => e.stopPropagation()}>
        <div className="sales-meat-details-header">
          <h2>Meat Sale Details</h2>
          <button className="sales-meat-details-close" onClick={onClose}>×</button>
        </div>

        <div className="sales-meat-details-body">
          {/* Sale Information */}
          <div className="sales-meat-details-section sale-info">
            <h3>Sale Information</h3>
            <div className="sales-meat-details-grid">
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Sale Date</span>
                <span className="sales-meat-detail-value">{formatDate(record.sale_date)}</span>
              </div>
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Sale ID</span>
                <span className="sales-meat-detail-value">{record.sale_id}</span>
              </div>
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Buyer</span>
                <span className="sales-meat-detail-value"><strong>{record.buyer}</strong></span>
              </div>
            </div>
          </div>

          {/* Goat Information */}
          <div className="sales-meat-details-section goat-info">
            <h3>Goat Information</h3>
            <div className="sales-meat-details-grid">
              <div className="sales-meat-detail-item highlight-goat">
                <span className="sales-meat-detail-label">Goat ID</span>
                <span className="sales-meat-detail-value">{record.goat_id}</span>
              </div>
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Breed</span>
                <span className="sales-meat-detail-value">{record.breed || 'Not specified'}</span>
              </div>
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Sex</span>
                <span className="sales-meat-detail-value">{record.sex || 'Not specified'}</span>
              </div>
              {record.date_of_birth && (
                <div className="sales-meat-detail-item">
                  <span className="sales-meat-detail-label">Date of Birth</span>
                  <span className="sales-meat-detail-value">{formatDate(record.date_of_birth)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Details */}
          <div className="sales-meat-details-section pricing-info">
            <h3>Pricing Details</h3>
            <div className="sales-meat-details-grid">
              <div className="sales-meat-detail-item highlight-weight">
                <span className="sales-meat-detail-label">Live Weight</span>
                <span className="sales-meat-detail-value">{formatWeight(record.live_weight)}</span>
              </div>
              <div className="sales-meat-detail-item highlight-price">
                <span className="sales-meat-detail-label">Price per Kg</span>
                <span className="sales-meat-detail-value">{formatCurrency(record.price_per_kg)}</span>
              </div>
              
              <div className="sales-meat-total-price-box">
                <span className="sales-meat-total-label">Total Sale Price</span>
                <span className="sales-meat-total-value">{formatCurrency(record.total_price)}</span>
              </div>
              
              <div className="sales-meat-calculation-box">
                <div className="sales-meat-calculation-label">Calculation Formula</div>
                <div className="sales-meat-calculation-formula">
                  {formatWeight(record.live_weight)} × {formatCurrency(record.price_per_kg)} = {formatCurrency(record.total_price)}
                </div>
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="sales-meat-details-section payment-info">
            <h3>Payment Information</h3>
            <div className="sales-meat-details-grid">
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Payment Method</span>
                <span className="sales-meat-detail-value">
                  {record.payment_method ? (
                    <span className={`sales-meat-payment-method-badge ${getPaymentClass(record.payment_method)}`}>
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
          <div className="sales-meat-details-section record-info">
            <h3>Record Information</h3>
            <div className="sales-meat-details-grid">
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Created At</span>
                <span className="sales-meat-detail-value">{record.created_at ? formatDate(record.created_at) : 'N/A'}</span>
              </div>
              <div className="sales-meat-detail-item">
                <span className="sales-meat-detail-label">Last Updated</span>
                <span className="sales-meat-detail-value">{record.updated_at ? formatDate(record.updated_at) : 'N/A'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="sales-meat-details-footer">
          <button onClick={onClose} className="sales-meat-btn-close">Close</button>
        </div>
      </div>
    </div>
  );
};

export default SalesMeatDetails;
