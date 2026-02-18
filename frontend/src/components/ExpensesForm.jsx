import React, { useState, useEffect } from 'react';
import './ExpensesForm.css';

const ExpensesForm = ({ onSubmit, editingRecord, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    expense_date: '',
    category: '',
    description: '',
    amount_ugx: '',
    paid_by: '',
    approved_by: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        expense_date: editingRecord.expense_date ? editingRecord.expense_date.split('T')[0] : '',
        category: editingRecord.category || '',
        description: editingRecord.description || '',
        amount_ugx: editingRecord.amount_ugx || '',
        paid_by: editingRecord.paid_by || '',
        approved_by: editingRecord.approved_by || ''
      });
    } else {
      setFormData({
        expense_date: '',
        category: '',
        description: '',
        amount_ugx: '',
        paid_by: '',
        approved_by: ''
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
        <h3>{editingRecord ? 'Edit Expense Record' : 'Add Expense Record'}</h3>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Expense Date *</label>
            <input
              type="date"
              name="expense_date"
              value={formData.expense_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select Category</option>
              <option value="Feed">Feed</option>
              <option value="Vet">Vet</option>
              <option value="Labor">Labor</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Amount (UGX) *</label>
            <input
              type="number"
              name="amount_ugx"
              value={formData.amount_ugx}
              onChange={handleChange}
              placeholder="Enter amount"
              step="0.01"
              min="0"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group full-width">
            <label>Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter expense description"
              rows="3"
              required
            ></textarea>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Paid By *</label>
            <input
              type="text"
              name="paid_by"
              value={formData.paid_by}
              onChange={handleChange}
              placeholder="Enter payer name"
              required
            />
          </div>

          <div className="form-group">
            <label>Approved By</label>
            <input
              type="text"
              name="approved_by"
              value={formData.approved_by}
              onChange={handleChange}
              placeholder="Enter approver name"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : `${editingRecord ? 'Update' : 'Add'} Expense`}
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

export default ExpensesForm;
