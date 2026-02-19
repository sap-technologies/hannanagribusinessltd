import React, { useState, useEffect } from 'react';
import './VaccinationForm.css';

const VaccinationForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    record_date: '',
    goat_id: '',
    type: '',
    drug_used: '',
    dosage: '',
    next_due_date: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        record_date: editingRecord.record_date ? editingRecord.record_date.split('T')[0] : '',
        goat_id: editingRecord.goat_id || '',
        type: editingRecord.type || '',
        drug_used: editingRecord.drug_used || '',
        dosage: editingRecord.dosage || '',
        next_due_date: editingRecord.next_due_date ? editingRecord.next_due_date.split('T')[0] : ''
      });
    } else {
      setFormData({
        record_date: '',
        goat_id: '',
        type: '',
        drug_used: '',
        dosage: '',
        next_due_date: ''
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
        <h3>{editingRecord ? 'Edit Vaccination Record' : 'Add Vaccination Record'}</h3>
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
            <label>Type *</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="Vaccine">Vaccine</option>
              <option value="Deworming">Deworming</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Drug Used *</label>
            <select
              name="drug_used"
              value={formData.drug_used}
              onChange={handleChange}
              required
            >
              <option value="">Select Drug/Vaccine</option>
              <optgroup label="Vaccines">
                <option value="PPR Vaccine">PPR Vaccine (Peste des Petits Ruminants)</option>
                <option value="FMD Vaccine">FMD Vaccine (Foot and Mouth Disease)</option>
                <option value="Anthrax Vaccine">Anthrax Vaccine</option>
                <option value="Clostridial Vaccine">Clostridial Vaccine</option>
                <option value="Rabies Vaccine">Rabies Vaccine</option>
              </optgroup>
              <optgroup label="Dewormers">
                <option value="Ivermectin">Ivermectin</option>
                <option value="Albendazole">Albendazole</option>
                <option value="Fenbendazole">Fenbendazole</option>
                <option value="Levamisole">Levamisole</option>
                <option value="Moxidectin">Moxidectin</option>
              </optgroup>
              <optgroup label="Other">
                <option value="Other">Other (specify in remarks)</option>
              </optgroup>
            </select>
          </div>

          <div className="form-group">
            <label>Dosage (Optional)</label>
            <input
              type="text"
              name="dosage"
              value={formData.dosage}
              onChange={handleChange}
              placeholder="e.g., 2ml, 5mg"
            />
          </div>

          <div className="form-group">
            <label>Next Due Date (Optional)</label>
            <input
              type="date"
              name="next_due_date"
              value={formData.next_due_date}
              onChange={handleChange}
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

export default VaccinationForm;
