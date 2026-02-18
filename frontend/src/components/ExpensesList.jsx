import React from 'react';
import { formatDate } from '../utils/dateUtils';
import './ExpensesList.css';

const ExpensesList = ({ records, onEdit, onDelete, onView }) => {
  const formatCurrency = (amount) => {
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const getCategoryBadge = (category) => {
    const badgeClasses = {
      'Feed': 'badge-green',
      'Vet': 'badge-blue',
      'Labor': 'badge-purple',
      'Other': 'badge-orange'
    };
    return badgeClasses[category] || 'badge-gray';
  };

  return (
    <div className="list-container">
      <h3>Expense Records ({records.length})</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Paid By</th>
              <th>Approved By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="7" className="no-data">No expense records found</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.expense_id}>
                  <td>{formatDate(record.expense_date)}</td>
                  <td>
                    <span className={`badge ${getCategoryBadge(record.category)}`}>
                      {record.category}
                    </span>
                  </td>
                  <td className="description-cell">{record.description}</td>
                  <td className="amount-cell">{formatCurrency(record.amount_ugx)}</td>
                  <td>{record.paid_by}</td>
                  <td>{record.approved_by || '-'}</td>
                  <td className="actions">
                    <button className="btn-view" onClick={() => onView(record)}>👁️</button>
                    <button className="btn-edit" onClick={() => onEdit(record)}>✏️</button>
                    <button className="btn-delete" onClick={() => {
                      if (window.confirm('Are you sure you want to delete this expense record?')) {
                        onDelete(record.expense_id);
                      }
                    }}>🗑️</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpensesList;
