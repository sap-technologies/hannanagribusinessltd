import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './FeedingList.css';

const FeedingList = ({ records, onEdit, onDelete, onView }) => {
  const getPurposeBadge = (purpose) => {
    const colors = {
      'Maintenance': 'badge-blue',
      'Fattening': 'badge-orange'
    };
    return colors[purpose] || 'badge-gray';
  };

  const formatNumber = (num) => {
    if (!num) return '-';
    return parseFloat(num).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  return (
    <div className="table-container">
      <h3>Feeding & Fattening Records ({records.length})</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Goat ID / Group</th>
            <th>Breed</th>
            <th>Feed Type</th>
            <th>Quantity (kg)</th>
            <th>Purpose</th>
            <th>Weight Gain (kg)</th>
            <th>Remarks</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No feeding records found
              </td>
            </tr>
          ) : (
            records.map((record) => (
              <tr key={record.feeding_id}>
                <td>{formatDate(record.record_date)}</td>
                <td>
                  {record.goat_id ? (
                    <strong>{record.goat_id}</strong>
                  ) : (
                    <span style={{ fontStyle: 'italic', color: '#6b7280' }}>
                      Group: {record.group_name}
                    </span>
                  )}
                </td>
                <td>{record.breed || '-'}</td>
                <td>{record.feed_type}</td>
                <td>{formatNumber(record.quantity_used)}</td>
                <td>
                  {record.purpose ? (
                    <span className={`badge ${getPurposeBadge(record.purpose)}`}>
                      {record.purpose}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td>
                  {record.weight_gain_kgs ? (
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>
                      +{formatNumber(record.weight_gain_kgs)}
                    </span>
                  ) : (
                    '-'
                  )}
                </td>
                <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {record.remarks || '-'}
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
                        if (window.confirm('Are you sure you want to delete this feeding record?')) {
                          onDelete(record.feeding_id);
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

export default FeedingList;
