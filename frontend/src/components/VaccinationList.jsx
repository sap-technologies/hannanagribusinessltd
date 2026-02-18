import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './VaccinationList.css';

const VaccinationList = ({ records, onEdit, onDelete, onView }) => {
  const getTypeBadge = (type) => {
    const colors = {
      'Vaccine': 'badge-blue',
      'Deworming': 'badge-green'
    };
    return colors[type] || 'badge-gray';
  };

  const getDueStatus = (nextDueDate) => {
    if (!nextDueDate) return null;
    
    const today = new Date();
    const dueDate = new Date(nextDueDate);
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Overdue by ${Math.abs(diffDays)} days`, class: 'badge-red' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, class: 'badge-orange' };
    } else if (diffDays <= 30) {
      return { text: `Due in ${diffDays} days`, class: 'badge-yellow' };
    }
    return { text: formatDate(nextDueDate), class: 'badge-gray' };
  };

  return (
    <div className="table-container">
      <h3>Vaccination & Deworming Records ({records.length})</h3>
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Goat ID</th>
            <th>Breed</th>
            <th>Sex</th>
            <th>Type</th>
            <th>Drug Used</th>
            <th>Dosage</th>
            <th>Next Due</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: 'center' }}>
                No vaccination records found
              </td>
            </tr>
          ) : (
            records.map((record) => {
              const dueStatus = getDueStatus(record.next_due_date);
              return (
                <tr key={record.vaccination_id}>
                  <td>{formatDate(record.record_date)}</td>
                  <td>
                    <strong>{record.goat_id}</strong>
                  </td>
                  <td>{record.breed || '-'}</td>
                  <td>{record.sex || '-'}</td>
                  <td>
                    <span className={`badge ${getTypeBadge(record.type)}`}>
                      {record.type}
                    </span>
                  </td>
                  <td>{record.drug_used}</td>
                  <td>{record.dosage || '-'}</td>
                  <td>
                    {dueStatus ? (
                      <span className={`badge ${dueStatus.class}`}>
                        {dueStatus.text}
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
                          if (window.confirm('Are you sure you want to delete this vaccination record?')) {
                            onDelete(record.vaccination_id);
                          }
                        }}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VaccinationList;
