import React, { useState, useEffect } from 'react';
import './HealthForm.css';
import './ReminderField.css';

const HealthForm = ({ onSubmit, editingRecord, onCancel, goats = [] }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    record_date: '',
    goat_id: '',
    problem_observed: '',
    treatment_given: '',
    vet_person_treated: '',
    cost_ugx: '',
    recovery_status: '',
    next_action: '',
    setReminder: false,
    reminderDate: '',
    reminderDescription: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        record_date: editingRecord.record_date || '',
        goat_id: editingRecord.goat_id || '',
        problem_observed: editingRecord.problem_observed || '',
        treatment_given: editingRecord.treatment_given || '',
        vet_person_treated: editingRecord.vet_person_treated || '',
        cost_ugx: editingRecord.cost_ugx || '',
        recovery_status: editingRecord.recovery_status || '',
        next_action: editingRecord.next_action || '',
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
          record_date: '',
          goat_id: '',
          problem_observed: '',
          treatment_given: '',
          vet_person_treated: '',
          cost_ugx: '',
          recovery_status: '',
          next_action: '',
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

  // Filter active goats
  const activeGoats = goats.filter(g => g.status === 'Active');

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeaderWithClose}>
        <h3>{editingRecord ? 'Edit Health Record' : 'New Health Record'}</h3>
        <button type="button" style={styles.closeBtn} onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      
      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Date *</label>
          <input
            type="date"
            name="record_date"
            value={formData.record_date}
            onChange={handleChange}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label>Goat ID *</label>
          <select
            name="goat_id"
            value={formData.goat_id}
            onChange={handleChange}
            style={styles.input}
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
      </div>

      <div style={styles.formGroup}>
        <label>Problem Observed (Optional)</label>
        <textarea
          name="problem_observed"
          value={formData.problem_observed}
          onChange={handleChange}
          style={styles.textarea}
          rows="3"
          placeholder="Describe the health issue or symptoms observed"
        />
      </div>

      <div style={styles.formGroup}>
        <label>Treatment Given (Optional)</label>
        <textarea
          name="treatment_given"
          value={formData.treatment_given}
          onChange={handleChange}
          style={styles.textarea}
          rows="3"
          placeholder="Describe the treatment administered"
        />
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Vet/Person Treated</label>
          <input
            type="text"
            name="vet_person_treated"
            value={formData.vet_person_treated}
            onChange={handleChange}
            style={styles.input}
            placeholder="Name of veterinarian or person"
          />
        </div>

        <div style={styles.formGroup}>
          <label>Cost (UGX)</label>
          <input
            type="number"
            step="0.01"
            name="cost_ugx"
            value={formData.cost_ugx}
            onChange={handleChange}
            style={styles.input}
            placeholder="Treatment cost in UGX"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label>Recovery Status</label>
        <select
          name="recovery_status"
          value={formData.recovery_status}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="">Select Status</option>
          <option value="Fully Recovered">Fully Recovered</option>
          <option value="Recovering">Recovering</option>
          <option value="No Improvement">No Improvement</option>
          <option value="Under Treatment">Under Treatment</option>
          <option value="Deceased">Deceased</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Next Action</label>
        <textarea
          name="next_action"
          value={formData.next_action}
          onChange={handleChange}
          style={styles.textarea}
          rows="2"
          placeholder="Follow-up actions required"
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
            Set a follow-up reminder
          </label>
        </div>

        {formData.setReminder && (
          <>
            <div className="reminder-info">
              Get notified to check recovery progress and treatment effectiveness
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
                  placeholder="e.g., Check recovery progress"
                />
                <span className="reminder-helper">Add context to your reminder</span>
              </div>
            </div>
          </>
        )}
      </div>

      <div style={styles.buttonGroup}>
        <button type="submit" style={styles.submitButton} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : (editingRecord ? 'Update Record' : 'Create Record')}
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
    flexDirection: 'column',
    marginBottom: '15px'
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

export default HealthForm;
