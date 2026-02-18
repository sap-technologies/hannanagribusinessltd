import React, { useState, useEffect } from 'react';
import './MonthlySummaryForm.css';

const MonthlySummaryForm = ({ onSubmit, editingRecord, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    month: '',
    opening_goats: '',
    births: '',
    purchases: '',
    deaths: '',
    sold_breeding: '',
    sold_meat: '',
    closing_goats: '',
    total_expenses_ugx: '',
    total_income_ugx: '',
    net_profit_ugx: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        month: editingRecord.month ? editingRecord.month.split('T')[0] : '',
        opening_goats: editingRecord.opening_goats || '',
        births: editingRecord.births || '',
        purchases: editingRecord.purchases || '',
        deaths: editingRecord.deaths || '',
        sold_breeding: editingRecord.sold_breeding || '',
        sold_meat: editingRecord.sold_meat || '',
        closing_goats: editingRecord.closing_goats || '',
        total_expenses_ugx: editingRecord.total_expenses_ugx || '',
        total_income_ugx: editingRecord.total_income_ugx || '',
        net_profit_ugx: editingRecord.net_profit_ugx || ''
      });
    } else {
      setFormData({
        month: '',
        opening_goats: '',
        births: '',
        purchases: '',
        deaths: '',
        sold_breeding: '',
        sold_meat: '',
        closing_goats: '',
        total_expenses_ugx: '',
        total_income_ugx: '',
        net_profit_ugx: ''
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updated = {
      ...formData,
      [name]: value
    };

    // Auto-calculate closing goats
    if (['opening_goats', 'births', 'purchases', 'deaths', 'sold_breeding', 'sold_meat'].includes(name)) {
      const opening = parseFloat(updated.opening_goats) || 0;
      const births = parseFloat(updated.births) || 0;
      const purchases = parseFloat(updated.purchases) || 0;
      const deaths = parseFloat(updated.deaths) || 0;
      const soldBreeding = parseFloat(updated.sold_breeding) || 0;
      const soldMeat = parseFloat(updated.sold_meat) || 0;
      
      updated.closing_goats = (opening + births + purchases - deaths - soldBreeding - soldMeat).toString();
    }

    // Auto-calculate net profit
    if (['total_income_ugx', 'total_expenses_ugx'].includes(name)) {
      const income = parseFloat(updated.total_income_ugx) || 0;
      const expenses = parseFloat(updated.total_expenses_ugx) || 0;
      
      updated.net_profit_ugx = (income - expenses).toFixed(2);
    }

    setFormData(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header-with-close">
        <h3>{editingRecord ? 'Edit Monthly Summary' : 'Add Monthly Summary'}</h3>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Month *</label>
            <input
              type="date"
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h4>Goat Inventory</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Opening Goats *</label>
              <input
                type="number"
                name="opening_goats"
                value={formData.opening_goats}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Births *</label>
              <input
                type="number"
                name="births"
                value={formData.births}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Purchases *</label>
              <input
                type="number"
                name="purchases"
                value={formData.purchases}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Deaths *</label>
              <input
                type="number"
                name="deaths"
                value={formData.deaths}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Sold (Breeding) *</label>
              <input
                type="number"
                name="sold_breeding"
                value={formData.sold_breeding}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Sold (Meat) *</label>
              <input
                type="number"
                name="sold_meat"
                value={formData.sold_meat}
                onChange={handleChange}
                placeholder="0"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Closing Goats (Calculated)</label>
              <input
                type="number"
                name="closing_goats"
                value={formData.closing_goats}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h4>Financial Summary</h4>
          <div className="form-row">
            <div className="form-group">
              <label>Total Expenses (UGX) *</label>
              <input
                type="number"
                name="total_expenses_ugx"
                value={formData.total_expenses_ugx}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Total Income (UGX) *</label>
              <input
                type="number"
                name="total_income_ugx"
                value={formData.total_income_ugx}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label>Net Profit (UGX) (Calculated)</label>
              <input
                type="text"
                name="net_profit_ugx"
                value={formData.net_profit_ugx}
                readOnly
                style={{ backgroundColor: '#f3f4f6', cursor: 'not-allowed' }}
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : `${editingRecord ? 'Update' : 'Add'} Summary`}
          </button>
          {editingRecord && (
            <button type="button" className="btn-cancel" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default MonthlySummaryForm;
