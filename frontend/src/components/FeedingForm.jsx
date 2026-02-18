import React, { useState, useEffect } from 'react';
import './FeedingForm.css';

const FeedingForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    record_date: '',
    goat_id: '',
    group_name: '',
    feed_type: '',
    quantity_used: '',
    purpose: '',
    weight_gain_kgs: '',
    remarks: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        record_date: editingRecord.record_date ? editingRecord.record_date.split('T')[0] : '',
        goat_id: editingRecord.goat_id || '',
        group_name: editingRecord.group_name || '',
        feed_type: editingRecord.feed_type || '',
        quantity_used: editingRecord.quantity_used || '',
        purpose: editingRecord.purpose || '',
        weight_gain_kgs: editingRecord.weight_gain_kgs || '',
        remarks: editingRecord.remarks || ''
      });
    } else {
      setFormData({
        record_date: '',
        goat_id: '',
        group_name: '',
        feed_type: '',
        quantity_used: '',
        purpose: '',
        weight_gain_kgs: '',
        remarks: ''
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

  // Filter active goats
  const activeGoats = goats.filter(g => g.status === 'Active');

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
        <h3>{editingRecord ? 'Edit Feeding Record' : 'Add Feeding Record'}</h3>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Date *</label>
            <input
              type="date"
              name="record_date"
              value={formData.record_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Goat ID</label>
            <select
              name="goat_id"
              value={formData.goat_id}
              onChange={handleChange}
            >
              <option value="">Select Goat (Optional)</option>
              {activeGoats.map(goat => (
                <option key={goat.goat_id} value={goat.goat_id}>
                  {goat.goat_id} - {goat.breed} ({goat.sex})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Group Name</label>
            <input
              type="text"
              name="group_name"
              value={formData.group_name}
              onChange={handleChange}
              placeholder="Enter Group Name (if group)"
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Feed Type *</label>
            <select
              name="feed_type"
              value={formData.feed_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Feed Type</option>
              <option value="Hay">Hay</option>
              <option value="Concentrate">Concentrate</option>
              <option value="Silage">Silage</option>
              <option value="Grass">Grass</option>
              <option value="Supplements">Supplements</option>
              <option value="Mixed Feed">Mixed Feed</option>
            </select>
          </div>

          <div className="form-group">
            <label>Quantity Used (kg)</label>
            <input
              type="number"
              name="quantity_used"
              value={formData.quantity_used}
              onChange={handleChange}
              placeholder="Enter quantity"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label>Purpose</label>
            <select
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
            >
              <option value="">Select Purpose</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Fattening">Fattening</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Weight Gain Observed (kgs)</label>
            <input
              type="number"
              name="weight_gain_kgs"
              value={formData.weight_gain_kgs}
              onChange={handleChange}
              placeholder="Enter weight gain"
              step="0.01"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label>Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter any additional notes"
              rows="2"
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (editingRecord ? 'Update Record' : 'Add Record')}
          </button>
          {editingRecord && (
            <button type="button" onClick={onCancel} className="btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FeedingForm;
