import React, { useState, useEffect } from 'react';
import './BreedingForm.css';
import './ReminderField.css';

const BreedingForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [formData, setFormData] = useState({
    doe_id: '',
    buck_id: '',
    heat_observed: 'Yes',
    mating_time: '',
    expected_kidding_date: '',
    actual_kidding_date: '',
    no_of_kids: '',
    male_kids: '',
    female_kids: '',
    kidding_outcome: '',
    remarks: '',
    setReminder: false,
    reminderDate: '',
    reminderDescription: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        doe_id: editingRecord.doe_id || '',
        buck_id: editingRecord.buck_id || '',
        heat_observed: editingRecord.heat_observed || 'Yes',
        mating_time: editingRecord.mating_time ? new Date(editingRecord.mating_time).toISOString().slice(0, 16) : '',
        expected_kidding_date: editingRecord.expected_kidding_date || '',
        actual_kidding_date: editingRecord.actual_kidding_date || '',
        no_of_kids: editingRecord.no_of_kids || '',
        male_kids: editingRecord.male_kids || '',
        female_kids: editingRecord.female_kids || '',
        kidding_outcome: editingRecord.kidding_outcome || '',
        remarks: editingRecord.remarks || '',
        setReminder: false,
        reminderDate: '',
        reminderDescription: ''
      });
    }
  }, [editingRecord]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit(formData);
    
    if (!editingRecord) {
      setFormData({
        doe_id: '',
        buck_id: '',
        heat_observed: 'Yes',
        mating_time: '',
        expected_kidding_date: '',
        actual_kidding_date: '',
        no_of_kids: '',
        male_kids: '',
        female_kids: '',
        kidding_outcome: '',
        remarks: '',
        setReminder: false,
        reminderDate: '',
        reminderDescription: ''
      });
    }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Filter goats by sex
  const femaleGoats = goats.filter(g => g.sex === 'Female' && g.status === 'Active');
  const maleGoats = goats.filter(g => g.sex === 'Male' && g.status === 'Active');

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeaderWithClose}>
        <h3>{editingRecord ? 'Edit Breeding Record' : 'New Breeding Record'}</h3>
        <button type="button" style={styles.closeBtn} onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      
      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Doe ID *</label>
          <select
            name="doe_id"
            value={formData.doe_id}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Female Goat</option>
            {femaleGoats.map(goat => (
              <option key={goat.goat_id} value={goat.goat_id}>
                {goat.goat_id} - {goat.breed}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Buck ID *</label>
          <select
            name="buck_id"
            value={formData.buck_id}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="">Select Male Goat</option>
            {maleGoats.map(goat => (
              <option key={goat.goat_id} value={goat.goat_id}>
                {goat.goat_id} - {goat.breed}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Heat Observed *</label>
          <select
            name="heat_observed"
            value={formData.heat_observed}
            onChange={handleChange}
            style={styles.input}
            required
          >
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label>Mating Time *</label>
          <input
            type="datetime-local"
            name="mating_time"
            value={formData.mating_time}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Expected Kidding Date (Optional)</label>
          <input
            type="date"
            name="expected_kidding_date"
            value={formData.expected_kidding_date}
            onChange={handleChange}
            style={styles.input}
          />
          <small style={styles.hint}>Auto-calculated if left empty (~150 days)</small>
        </div>

        <div style={styles.formGroup}>
          <label>Actual Kidding Date (Optional)</label>
          <input
            type="date"
            name="actual_kidding_date"
            value={formData.actual_kidding_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Number of Kids (Optional)</label>
          <input
            type="number"
            name="no_of_kids"
            value={formData.no_of_kids}
            onChange={handleChange}
            style={styles.input}
            min="0"
          />
        </div>

        <div style={styles.formGroup}>
          <label>Male Kids (Optional)</label>
          <input
            type="number"
            name="male_kids"
            value={formData.male_kids}
            onChange={handleChange}
            style={styles.input}
            min="0"
          />
        </div>

        <div style={styles.formGroup}>
          <label>Female Kids (Optional)</label>
          <input
            type="number"
            name="female_kids"
            value={formData.female_kids}
            onChange={handleChange}
            style={styles.input}
            min="0"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label>Kidding Outcome (Optional)</label>
        <select
          name="kidding_outcome"
          value={formData.kidding_outcome}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Outcome</option>
          <option value="Successful">Successful</option>
          <option value="Complications">Complications</option>
          <option value="Stillborn">Stillborn</option>
          <option value="Assisted Birth">Assisted Birth</option>
          <option value="Multiple Birth">Multiple Birth</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Remarks (Optional)</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          style={styles.textarea}
          rows="3"
          placeholder="Additional notes about the breeding/kidding"
        />
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
            Set a reminder for expected kidding
          </label>
        </div>

        {formData.setReminder && (
          <>
            <div className="reminder-info">
              Get notified before the expected kidding date to prepare properly
            </div>
            <div className="reminder-fields" style={styles.row}>
              <div className="reminder-field" style={styles.formGroup}>
                <label>
                  Reminder Date <span className="required">*</span>
                </label>
                <input
                  type="date"
                  name="reminderDate"
                  value={formData.reminderDate}
                  onChange={handleChange}
                  style={styles.input}
                  required={formData.setReminder}
                />
                <span className="reminder-helper">When should we remind you?</span>
              </div>

              <div className="reminder-field" style={styles.formGroup}>
                <label>Reminder Note</label>
                <input
                  type="text"
                  name="reminderDescription"
                  value={formData.reminderDescription}
                  onChange={handleChange}
                  style={styles.input}
                  placeholder="e.g., Check doe condition before kidding"
                />
                <span className="reminder-helper">Add context to your reminder</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : editingRecord ? 'Update Record' : 'Create Record'}
        </button>
        {editingRecord && (
          <button type="button" onClick={onCancel} style={styles.cancelButton} disabled={isSubmitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

const styles = {
  form: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    marginBottom: '20px'
  },
  row: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px',
    marginBottom: '15px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px'
  },
  textarea: {
    padding: '8px 12px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    marginTop: '5px',
    fontFamily: 'inherit',
    resize: 'vertical'
  },
  hint: {
    fontSize: '12px',
    color: '#666',
    marginTop: '3px',
    fontStyle: 'italic'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  submitButton: {
    padding: '10px 20px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  cancelButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  },
  formHeaderWithClose: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  closeBtn: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    fontSize: '20px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    flexShrink: 0,
    padding: 0
  }
};

export default BreedingForm;
