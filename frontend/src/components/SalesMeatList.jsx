import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './SalesMeatList.css';

const SalesMeatList = ({ records, onEdit, onDelete, onView }) => {
  const formatCurrency = (amount) => {
    if (!amount) return 'UGX 0';
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const formatWeight = (weight) => {
    if (!weight) return '-';
    return `${parseFloat(weight).toFixed(2)} kg`;
  };

  const getPaymentBadgeClass = (method) => {
    const classes = {
      'Cash': 'cash',
      'Mobile Money': 'mobile-money',
      'Bank Transfer': 'bank-transfer',
      'Credit': 'credit'
    };
    return classes[method] || '';
  };

  return (
    <div className="sales-meat-list-container">
      <h3>Meat Sales Records ({records.length})</h3>
      {records.length === 0 ? (
        <div className="sales-meat-empty-state">
          <div className="sales-meat-empty-state-icon">🥩</div>
          <h4>No meat sale records found</h4>
          <p>Start by recording your first meat sale using the button above.</p>
        </div>
      ) : (
        <div className="sales-meat-table-wrapper">
          <table className="sales-meat-table">
            <thead>
              <tr>
                <th>Sale Date</th>
                <th>Goat ID</th>
                <th>Breed</th>
                <th>Live Weight</th>
                <th>Price/Kg</th>
                <th>Total Price</th>
                <th>Buyer</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.sale_id}>
                  <td>{formatDate(record.sale_date)}</td>
                  <td>
                    <span className="sales-meat-goat-id">{record.goat_id}</span>
                  </td>
                  <td>{record.breed || '-'}</td>
                  <td>
                    <span className="sales-meat-weight">{formatWeight(record.live_weight)}</span>
                  </td>
                  <td>
                    <span className="sales-meat-price">{formatCurrency(record.price_per_kg)}</span>
                  </td>
                  <td>
                    <span className="sales-meat-total-price">{formatCurrency(record.total_price)}</span>
                  </td>
                  <td>
                    <span className="sales-meat-buyer">{record.buyer}</span>
                  </td>
                  <td>
                    {record.payment_method ? (
                      <span className={`sales-meat-payment-badge ${getPaymentBadgeClass(record.payment_method)}`}>
                        {record.payment_method}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td>
                    <div className="sales-meat-actions">
                      <button
                        className="sales-meat-btn-action sales-meat-btn-view"
                        onClick={() => onView(record)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        className="sales-meat-btn-action sales-meat-btn-edit"
                        onClick={() => onEdit(record)}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        className="sales-meat-btn-action sales-meat-btn-delete"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this sale record?')) {
                            onDelete(record.sale_id);
                          }
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default SalesMeatList;
