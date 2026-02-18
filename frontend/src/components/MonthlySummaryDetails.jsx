import React from 'react';
import './MonthlySummaryDetails.css';

const MonthlySummaryDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatCurrency = (amount) => {
    return `UGX ${parseFloat(amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const formatMonth = (month) => {
    const date = new Date(month);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
  };

  const getProfitColor = (profit) => {
    return parseFloat(profit) >= 0 ? '#10b981' : '#dc2626';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Monthly Summary Details</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Month Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="detail-label">Summary ID:</span>
                <span className="detail-value">#{record.summary_id}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Month:</span>
                <span className="detail-value" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                  {formatMonth(record.month)}
                </span>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h3>Goat Inventory Movement</h3>
            <div className="inventory-flow">
              <div className="flow-item">
                <div className="flow-label">Opening Stock</div>
                <div className="flow-value large">{record.opening_goats}</div>
              </div>
              <div className="flow-operator">+</div>
              <div className="flow-item positive">
                <div className="flow-label">Births</div>
                <div className="flow-value">{record.births}</div>
              </div>
              <div className="flow-operator">+</div>
              <div className="flow-item positive">
                <div className="flow-label">Purchases</div>
                <div className="flow-value">{record.purchases}</div>
              </div>
              <div className="flow-operator">-</div>
              <div className="flow-item negative">
                <div className="flow-label">Deaths</div>
                <div className="flow-value">{record.deaths}</div>
              </div>
              <div className="flow-operator">-</div>
              <div className="flow-item negative">
                <div className="flow-label">Sold (Breeding)</div>
                <div className="flow-value">{record.sold_breeding}</div>
              </div>
              <div className="flow-operator">-</div>
              <div className="flow-item negative">
                <div className="flow-label">Sold (Meat)</div>
                <div className="flow-value">{record.sold_meat}</div>
              </div>
              <div className="flow-operator">=</div>
              <div className="flow-item">
                <div className="flow-label">Closing Stock</div>
                <div className="flow-value large">{record.closing_goats}</div>
              </div>
            </div>

            <div className="calculation-box">
              <strong>Calculation:</strong> {record.opening_goats} + {record.births} + {record.purchases} - {record.deaths} - {record.sold_breeding} - {record.sold_meat} = {record.closing_goats}
            </div>
          </div>

          <div className="detail-section">
            <h3>Financial Summary</h3>
            <div className="financial-grid">
              <div className="financial-item expense">
                <div className="financial-label">Total Expenses</div>
                <div className="financial-value">{formatCurrency(record.total_expenses_ugx)}</div>
              </div>
              <div className="financial-item income">
                <div className="financial-label">Total Income</div>
                <div className="financial-value">{formatCurrency(record.total_income_ugx)}</div>
              </div>
              <div className="financial-item profit">
                <div className="financial-label">Net Profit</div>
                <div 
                  className="financial-value" 
                  style={{ 
                    color: getProfitColor(record.net_profit_ugx),
                    fontSize: '1.5em'
                  }}
                >
                  {formatCurrency(record.net_profit_ugx)}
                </div>
              </div>
            </div>

            <div className="calculation-box">
              <strong>Profit Calculation:</strong> {formatCurrency(record.total_income_ugx)} - {formatCurrency(record.total_expenses_ugx)} = {formatCurrency(record.net_profit_ugx)}
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

        <div className="modal-footer">
          <button className="btn-close" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MonthlySummaryDetails;
