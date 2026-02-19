import React, { useState, useEffect } from 'react';
import './SalesMeatForm.css';

const SalesMeatForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [formData, setFormData] = useState({
    sale_date: '',
    goat_id: '',
    live_weight: '',
    price_per_kg: '',
    total_price: '',
    buyer: '',
    payment_method: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        sale_date: editingRecord.sale_date ? editingRecord.sale_date.split('T')[0] : '',
        goat_id: editingRecord.goat_id || '',
        live_weight: editingRecord.live_weight || '',
        price_per_kg: editingRecord.price_per_kg || '',
        total_price: editingRecord.total_price || '',
        buyer: editingRecord.buyer || '',
        payment_method: editingRecord.payment_method || ''
      });
    } else {
      setFormData({
        sale_date: '',
        goat_id: '',
        live_weight: '',
        price_per_kg: '',
        total_price: '',
        buyer: '',
        payment_method: ''
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const updated = {
        ...prev,
        [name]: value
      };

      // Auto-calculate total price when weight or price per kg changes
      if (name === 'live_weight' || name === 'price_per_kg') {
        const weight = parseFloat(name === 'live_weight' ? value : updated.live_weight);
        const pricePerKg = parseFloat(name === 'price_per_kg' ? value : updated.price_per_kg);
        
        if (!isNaN(weight) && !isNaN(pricePerKg)) {
          updated.total_price = (weight * pricePerKg).toFixed(2);
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // Filter active goats
  const activeGoats = goats.filter(g => g.status === 'Active');

  // Calculate if we have valid price calculation
  const hasValidCalculation = formData.live_weight && formData.price_per_kg && formData.total_price;

  return (
    <div className="sales-meat-form-container">
      <div className="form-header-with-close">
        <h3>{editingRecord ? 'Edit Meat Sale Record' : 'Add New Meat Sale'}</h3>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="sales-meat-form">
        {/* Sale Information Section */}
        <div className="sales-meat-form-section">
          <div className="sales-meat-form-section-title">
            📋 Sale Information
          </div>
          
          <div className="sales-meat-form-row">
            <div className="sales-meat-form-group">
              <label>
                Sale Date <span className="required">*</span>
              </label>
              <input
                type="date"
                name="sale_date"
                value={formData.sale_date}
                onChange={handleChange}
                required
              />
            </div>

            <div className="sales-meat-form-group">
              <label>
                Goat ID <span className="required">*</span>
              </label>
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

            <div className="sales-meat-form-group">
              <label>
                Buyer Name
              </label>
              <input
                type="text"
                name="buyer"
                value={formData.buyer}
                onChange={handleChange}
                placeholder="Enter buyer name"
              />
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="sales-meat-form-section">
          <div className="sales-meat-form-section-title">
            💰 Pricing Details
          </div>
          
          <div className="sales-meat-form-row">
            <div className="sales-meat-form-group">
              <label>
                Live Weight (kg) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="live_weight"
                value={formData.live_weight}
                onChange={handleChange}
                placeholder="Enter weight"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="sales-meat-form-group">
              <label>
                Price per Kg (UGX) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="price_per_kg"
                value={formData.price_per_kg}
                onChange={handleChange}
                placeholder="Enter price per kg"
                step="0.01"
                min="0"
                required
              />
            </div>

            <div className="sales-meat-form-group">
              <label>
                Total Price (UGX) <span className="required">*</span>
              </label>
              <input
                type="number"
                name="total_price"
                value={formData.total_price}
                onChange={handleChange}
                placeholder="Auto-calculated"
                step="0.01"
                min="0"
                required
                readOnly={formData.live_weight && formData.price_per_kg}
                className={formData.live_weight && formData.price_per_kg ? 'sales-meat-calculated-field' : ''}
              />
            </div>
          </div>

          {/* Price Calculation Preview */}
          {hasValidCalculation && (
            <div className="sales-meat-price-preview">
              <div className="sales-meat-price-preview-title">
                Price Calculation
              </div>
              <div className="sales-meat-price-calculation">
                {parseFloat(formData.live_weight).toFixed(2)} kg × UGX {parseFloat(formData.price_per_kg).toLocaleString()}
              </div>
              <div className="sales-meat-price-result">
                Total: UGX {parseFloat(formData.total_price).toLocaleString()}
              </div>
            </div>
          )}
        </div>

        {/* Payment Section */}
        <div className="sales-meat-form-section">
          <div className="sales-meat-form-section-title">
            💳 Payment Information
          </div>
          
          <div className="sales-meat-form-row">
            <div className="sales-meat-form-group">
              <label>Payment Method</label>
              <select
                name="payment_method"
                value={formData.payment_method}
                onChange={handleChange}
              >
                <option value="">Select Payment Method</option>
                <option value="Cash">💵 Cash</option>
                <option value="Mobile Money">📱 Mobile Money</option>
                <option value="Bank Transfer">🏦 Bank Transfer</option>
                <option value="Credit">💳 Credit</option>
              </select>
            </div>
          </div>
          
          <div className="sales-meat-info-box">
            <div className="sales-meat-info-box-icon">ℹ️</div>
            <div className="sales-meat-info-box-content">
              <div className="sales-meat-info-box-title">Payment Information</div>
              <div className="sales-meat-info-box-text">
                Select the payment method used for this transaction. This helps in tracking payment types and financial reporting.
              </div>
            </div>
          </div>
        </div>

        <div className="sales-meat-form-actions">
          <button type="submit" className="sales-meat-btn-submit">
            {editingRecord ? '✓ Update Sale Record' : '✓ Record Sale'}
          </button>
          {editingRecord && (
            <button type="button" onClick={onCancel} className="sales-meat-btn-cancel">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default SalesMeatForm;
