import React, { useState, useEffect } from 'react';
import './SalesBreedingForm.css';

const SalesBreedingForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    sale_date: '',
    goat_id: '',
    breed: '',
    sex: '',
    age_months: '',
    buyer: '',
    sale_price_ugx: '',
    payment_method: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        sale_date: editingRecord.sale_date ? editingRecord.sale_date.split('T')[0] : '',
        goat_id: editingRecord.goat_id || '',
        breed: editingRecord.breed || '',
        sex: editingRecord.sex || '',
        age_months: editingRecord.age_months || '',
        buyer: editingRecord.buyer || '',
        sale_price_ugx: editingRecord.sale_price_ugx || '',
        payment_method: editingRecord.payment_method || ''
      });
    } else {
      setFormData({
        sale_date: '',
        goat_id: '',
        breed: '',
        sex: '',
        age_months: '',
        buyer: '',
        sale_price_ugx: '',
        payment_method: ''
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
        <h3>{editingRecord ? 'Edit Breeding Sale Record' : 'Add Breeding Sale Record'}</h3>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label>Sale Date *</label>
            <input
              type="date"
              name="sale_date"
              value={formData.sale_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Goat ID *</label>
            <select
              name="goat_id"
              value={formData.goat_id}
              onChange={handleChange}
              required
            >
              <option value="">Select Goat</option>
              {activeGoats.map(goat => (
                <option key={goat.goat_id} value={goat.goat_id}>
                  {goat.goat_id} - {goat.breed} ({goat.sex})
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Breed</label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleChange}
            >
              <option value="">Select Breed</option>
              <option value="Boer">Boer</option>
              <option value="Savana">Savana</option>
              <option value="Karahali">Karahali</option>
              <option value="Local(Mubende)">Local(Mubende)</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sex</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
            >
              <option value="">Select Sex</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Age (Months)</label>
            <input
              type="number"
              name="age_months"
              value={formData.age_months}
              onChange={handleChange}
              placeholder="Enter age in months"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Buyer *</label>
            <input
              type="text"
              name="buyer"
              value={formData.buyer}
              onChange={handleChange}
              placeholder="Enter buyer name"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Sale Price (UGX) *</label>
            <input
              type="number"
              name="sale_price_ugx"
              value={formData.sale_price_ugx}
              onChange={handleChange}
              placeholder="Enter sale price"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="payment_method"
              value={formData.payment_method}
              onChange={handleChange}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Mobile Money">Mobile Money</option>
              <option value="Bank Transfer">Bank Transfer</option>
              <option value="Credit">Credit</option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (editingRecord ? 'Update Sale' : 'Record Sale')}
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

export default SalesBreedingForm;
