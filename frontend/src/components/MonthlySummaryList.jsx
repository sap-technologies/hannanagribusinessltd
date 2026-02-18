import React from 'react';
import './MonthlySummaryList.css';

const MonthlySummaryList = ({ records, onEdit, onDelete, onView }) => {
  const formatCurrency = (amount) => {
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (month) => {
    const date = new Date(month);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getProfitClass = (profit) => {
    return parseFloat(profit) >= 0 ? 'profit-positive' : 'profit-negative';
  };

  return (
    <div className="list-container">
      <h3>Monthly Summary Records ({records.length})</h3>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Month</th>
              <th>Opening</th>
              <th>+Births</th>
              <th>+Purchases</th>
              <th>-Deaths</th>
              <th>-Sold(B)</th>
              <th>-Sold(M)</th>
              <th>Closing</th>
              <th>Expenses</th>
              <th>Income</th>
              <th>Net Profit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.length === 0 ? (
              <tr>
                <td colSpan="12" className="no-data">No monthly summary records found</td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.summary_id}>
                  <td style={{ fontWeight: 'bold' }}>{formatMonth(record.month)}</td>
                  <td>{record.opening_goats}</td>
                  <td className="change-positive">+{record.births}</td>
                  <td className="change-positive">+{record.purchases}</td>
                  <td className="change-negative">-{record.deaths}</td>
                  <td className="change-negative">-{record.sold_breeding}</td>
                  <td className="change-negative">-{record.sold_meat}</td>
                  <td style={{ fontWeight: 'bold' }}>{record.closing_goats}</td>
                  <td style={{ color: '#dc2626' }}>{formatCurrency(record.total_expenses_ugx)}</td>
                  <td style={{ color: '#10b981' }}>{formatCurrency(record.total_income_ugx)}</td>
                  <td className={getProfitClass(record.net_profit_ugx)}>
                    {formatCurrency(record.net_profit_ugx)}
                  </td>
                  <td className="actions">
                    <button className="btn-view" onClick={() => onView(record)}>👁️</button>
                    <button className="btn-edit" onClick={() => onEdit(record)}>✏️</button>
                    <button className="btn-delete" onClick={() => {
                      if (window.confirm('Are you sure you want to delete this monthly summary?')) {
                        onDelete(record.summary_id);
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

export default MonthlySummaryList;
