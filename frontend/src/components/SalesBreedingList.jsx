import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './SalesBreedingList.css';

const SalesBreedingList = ({ records, onEdit, onDelete, onView }) => {
  const formatCurrency = (amount) => {
    if (!amount) return 'UGX 0';
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  };

  const getPaymentBadge = (method) => {
    const colors = {
      'Cash': 'badge-green',
      'Mobile Money': 'badge-blue',
      'Bank Transfer': 'badge-purple',
      'Credit': 'badge-orange'
    };
    return colors[method] || 'badge-gray';
  };

  return (
    <div className="table-container">
      <h3>Breeding Sales Records ({records.length})</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Sale Date</th>
            <th>Goat ID</th>
            <th>Breed</th>
            <th>Sex</th>
            <th>Age (Months)</th>
            <th>Buyer</th>
            <th>Sale Price</th>
            <th>Payment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No breeding sale records found
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.sale_id}>
                <td>{formatDate(record.sale_date)}</td>
                <td>
                  <strong>{record.goat_id}</strong>
                </td>
                <td>{record.breed || '-'}</td>
                <td>{record.sex || '-'}</td>
                <td>{record.age_months || '-'}</td>
                <td>{record.buyer}</td>
                <td style={{ fontWeight: 'bold', color: '#16a34a' }}>
                  {formatCurrency(record.sale_price_ugx)}
                </td>
                <td>
                  {record.payment_method ? (
                    <span className={`badge ${getPaymentBadge(record.payment_method)}`}>
                      {record.payment_method}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-view"
                      onClick={() => onView(record)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-edit"
                      onClick={() => onEdit(record)}
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      className="btn-delete"
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
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SalesBreedingList;
