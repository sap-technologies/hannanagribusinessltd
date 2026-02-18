import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './ExpensesDetails.css';

const ExpensesDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatCurrency = (amount) => {
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCategoryColor = (category) => {
    const colors = {
      'Feed': '#10b981',
      'Vet': '#3b82f6',
      'Labor': '#8b5cf6',
      'Other': '#f59e0b'
    };
    return colors[category] || '#6b7280';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Expense Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Expense Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Expense ID:</span>
                <span className="detail-value">#{record.expense_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Date:</span>
                <span className="detail-value">{formatDate(record.expense_date)}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Category:</span>
                <span className="detail-value">
                  <span 
                    className="badge" 
                    style={{ backgroundColor: getCategoryColor(record.category), color: 'white' }}
                  >
                    {record.category}
                  </span>
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Amount:</span>
                <span className="detail-value amount-highlight">
                  {formatCurrency(record.amount_ugx)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Description</h3>
            <div className="description-box">
              {record.description}
            </div>
          </div>

          <div className="detail-section">
            <h3>Payment Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Paid By:</span>
                <span className="detail-value">{record.paid_by}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Approved By:</span>
                <span className="detail-value">{record.approved_by || 'Not Approved'}</span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Record Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Created At:</span>
                <span className="detail-value">{new Date(record.created_at).toLocaleString()}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Updated At:</span>
                <span className="detail-value">{new Date(record.updated_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpensesDetails;
