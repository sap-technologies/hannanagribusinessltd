import React, { useState, useEffect } from 'react';
import './KidGrowthForm.css';

const KidGrowthForm = ({ onSubmit, editingRecord, onCancel }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    kid_id: '',
    mother_id: '',
    birth_weight: '',
    weaning_date: '',
    weaning_weight: '',
    target_market: 'Breeding',
    remarks: ''
  });

  useEffect(() => {
    if (editingRecord) {
      setFormData({
        kid_id: editingRecord.kid_id || '',
        mother_id: editingRecord.mother_id || '',
        birth_weight: editingRecord.birth_weight || '',
        weaning_date: editingRecord.weaning_date || '',
        weaning_weight: editingRecord.weaning_weight || '',
        target_market: editingRecord.target_market || 'Breeding',
        remarks: editingRecord.remarks || ''
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
          kid_id: '',
          mother_id: '',
          birth_weight: '',
          weaning_date: '',
          weaning_weight: '',
          target_market: 'Breeding',
          remarks: ''
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formHeaderWithClose}>
        <h3>{editingRecord ? 'Edit Kid Growth Record' : 'New Kid Growth Record'}</h3>
        <button type="button" style={styles.closeBtn} onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      
      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Kid ID *</label>
          <input
            type="text"
            name="kid_id"
            value={formData.kid_id}
            onChange={handleChange}
            style={styles.input}
            required
            placeholder="Enter kid goat ID"
          />
        </div>

        <div style={styles.formGroup}>
          <label>Mother ID</label>
          <input
            type="text"
            name="mother_id"
            value={formData.mother_id}
            onChange={handleChange}
            style={styles.input}
            placeholder="Enter mother goat ID"
          />
        </div>
      </div>

      <div style={styles.row}>
        <div style={styles.formGroup}>
          <label>Birth Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            name="birth_weight"
            value={formData.birth_weight}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g., 2.5"
          />
        </div>

        <div style={styles.formGroup}>
          <label>Weaning Date</label>
          <input
            type="date"
            name="weaning_date"
            value={formData.weaning_date}
            onChange={handleChange}
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label>Weaning Weight (kg)</label>
          <input
            type="number"
            step="0.01"
            name="weaning_weight"
            value={formData.weaning_weight}
            onChange={handleChange}
            style={styles.input}
            placeholder="e.g., 12.5"
          />
        </div>
      </div>

      <div style={styles.formGroup}>
        <label>Target Market *</label>
        <select
          name="target_market"
          value={formData.target_market}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="Breeding">Breeding</option>
          <option value="Meat">Meat</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label>Remarks</label>
        <textarea
          name="remarks"
          value={formData.remarks}
          onChange={handleChange}
          style={styles.textarea}
          rows="3"
          placeholder="Additional notes about the kid's growth"
        />
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

export default KidGrowthForm;
