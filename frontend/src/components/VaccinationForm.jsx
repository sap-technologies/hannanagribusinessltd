import React, { useState, useEffect } from 'react';
import './VaccinationForm.css';
import './ReminderField.css';

const VaccinationForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    record_date: '',
    goat_id: '',
    type: '',
    drug_used: '',
    dosage: '',
    next_due_date: '',
    setReminder: false,
    reminderDate: '',
    reminderDescription: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        record_date: editingRecord.record_date ? editingRecord.record_date.split('T')[0] : '',
        goat_id: editingRecord.goat_id || '',
        type: editingRecord.type || '',
        drug_used: editingRecord.drug_used || '',
        dosage: editingRecord.dosage || '',
        next_due_date: editingRecord.next_due_date ? editingRecord.next_due_date.split('T')[0] : '',
        setReminder: false,
        reminderDate: '',
        reminderDescription: ''
      });
    } else {
      setFormData({
        record_date: '',
        goat_id: '',
        type: '',
        drug_used: '',
        dosage: '',
        next_due_date: '',
        setReminder: false,
        reminderDate: '',
        reminderDescription: ''
      });
    }
  }, [editingRecord]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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

        <div className="reminder-container">
          <div className="reminder-header" onClick={() => setFormData(prev => ({ ...prev, setReminder: !prev.setReminder }))}>
            <input
              type="checkbox"
              name="setReminder"
              id="setReminder"
              checked={formData.setReminder}
              onChange={handleChange}
              className="reminder-checkbox"
            />
            <label htmlFor="setReminder" className="reminder-label">
              <span className="reminder-icon">🔔</span>
              Set a reminder for this vaccination
            </label>
          </div>

          {formData.setReminder && (
            <>
              <div className="reminder-info">
                Get notified on a specific date to follow up on this vaccination
              </div>
              <div className="reminder-fields">
                <div className="reminder-field">
                  <label>
                    Reminder Date <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    name="reminderDate"
                    value={formData.reminderDate}
                    onChange={handleChange}
                    required={formData.setReminder}
                  />
                  <span className="reminder-helper">When should we remind you?</span>
                </div>

                <div className="reminder-field">
                  <label>Reminder Note</label>
                  <input
                    type="text"
                    name="reminderDescription"
                    value={formData.reminderDescription}
                    onChange={handleChange}
                    placeholder="e.g., Check vaccination effectiveness"
                  />
                  <span className="reminder-helper">Add context to your reminder</span>
                </div>
              </div>
            </>
          )}
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
