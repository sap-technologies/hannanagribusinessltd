import React, { useState, useEffect } from 'react';
import './GoatForm.css';

const GoatForm = ({ onSubmit, editingGoat, onCancel, goats = [] }) => {
  const [formData, setFormData] = useState({
    goat_id: '',
    breed: '',
    sex: 'Male',
    date_of_birth: '',
    production_type: '',
    source: '',
    mother_id: '',
    father_id: '',
    status: 'Active',
    weight: '',
    remarks: '',
    photo_url: ''
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editingGoat) {
      // Format date for input
      const formattedDate = editingGoat.date_of_birth 
        ? new Date(editingGoat.date_of_birth).toISOString().split('T')[0]
        : '';
      
      setFormData({
        goat_id: editingGoat.goat_id || '',
        breed: editingGoat.breed || '',
        sex: editingGoat.sex || 'Male',
        date_of_birth: formattedDate,
        production_type: editingGoat.production_type || '',
        source: editingGoat.source || '',
        mother_id: editingGoat.mother_id || '',
        father_id: editingGoat.father_id || '',
        status: editingGoat.status || 'Active',
        weight: editingGoat.weight || '',
        remarks: editingGoat.remarks || '',
        photo_url: editingGoat.photo_url || ''
      });
      
      // Set photo preview if editing and photo exists
      if (editingGoat.photo_url) {
        // Handle both Supabase URLs and base64 data
        const photoUrl = editingGoat.photo_url.startsWith('http') 
          ? editingGoat.photo_url 
          : editingGoat.photo_url.startsWith('data:') 
            ? editingGoat.photo_url
            : `http://localhost:1230${editingGoat.photo_url}`;
        setPhotoPreview(photoUrl);
      }
    }
  }, [editingGoat]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF)');
      e.target.value = '';
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      e.target.value = '';
      return;
    }

    setPhotoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
    setFormData(prev => ({ ...prev, photo_url: '' }));
  };

  // Filter goats for parent selection (exclude current goat if editing)
  const availableGoats = goats.filter(g => 
    g.status === 'Active' && (!editingGoat || g.goat_id !== editingGoat.goat_id)
  );
  const femaleGoats = availableGoats.filter(g => g.sex === 'Female');
  const maleGoats = availableGoats.filter(g => g.sex === 'Male');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      // Pass form data along with photo file if present
      const submitData = {
        ...formData,
        photoFile: photoFile
      };
      
      await onSubmit(submitData);
    
    // Reset form if not editing
    if (!editingGoat) {
      setFormData({
        goat_id: '',
        breed: '',
        sex: 'Male',
        date_of_birth: '',
        production_type: '',
        source: '',
        mother_id: '',
        father_id: '',
        status: 'Active',
        weight: '',
        remarks: '',
        photo_url: ''
      });
      setPhotoFile(null);
      setPhotoPreview(null);
    }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="goat-form-container">
      <div className="form-header-with-close">
        <h2>{editingGoat ? 'Edit Goat' : 'Register New Goat'}</h2>
        <button type="button" className="close-form-btn" onClick={onCancel} title="Close form">
          ✕
        </button>
      </div>
      <form onSubmit={handleSubmit} className="goat-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Goat ID *</label>
            <input
              type="text"
              name="goat_id"
              value={formData.goat_id}
              onChange={handleChange}
              disabled={editingGoat}
              required
              placeholder="e.g., G001"
            />
          </div>

          <div className="form-group">
            <label>Breed *</label>
            <select
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              required
            >
              <option value="">Select Breed</option>
              <option value="Boer">Boer</option>
              <option value="Savana">Savana</option>
              <option value="Karahali">Karahali</option>
              <option value="Local(Mubende)">Local(Mubende)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Sex *</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              required
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date of Birth *</label>
            <input
              type="date"
              name="date_of_birth"
              value={formData.date_of_birth}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Production Type *</label>
            <select
              name="production_type"
              value={formData.production_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Production Type</option>
              <option value="Meat">Meat</option>
              <option value="Dairy">Dairy</option>
              <option value="Breeding">Breeding</option>
              <option value="Dual Purpose">Dual Purpose</option>
            </select>
          </div>

          <div className="form-group">
            <label>Source</label>
            <select
              name="source"
              value={formData.source}
              onChange={handleChange}
            >
              <option value="">Select Source</option>
              <option value="Purchased">Purchased</option>
              <option value="Born on farm">Born on farm</option>
              <option value="Donated">Donated</option>
              <option value="Inherited">Inherited</option>
            </select>
          </div>

          <div className="form-group">
            <label>Mother ID</label>
            <select
              name="mother_id"
              value={formData.mother_id}
              onChange={handleChange}
            >
              <option value="">Select Mother (Female)</option>
              {femaleGoats.map(goat => (
                <option key={goat.goat_id} value={goat.goat_id}>
                  {goat.goat_id} - {goat.breed}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Father ID</label>
            <select
              name="father_id"
              value={formData.father_id}
              onChange={handleChange}
            >
              <option value="">Select Father (Male)</option>
              {maleGoats.map(goat => (
                <option key={goat.goat_id} value={goat.goat_id}>
                  {goat.goat_id} - {goat.breed}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="Active">Active</option>
              <option value="Sold">Sold</option>
              <option value="Slaughtered">Slaughtered</option>
              <option value="Dead">Dead</option>
              <option value="Quarantine">Quarantine</option>
            </select>
          </div>

          <div className="form-group">
            <label>Weight (kg)</label>
            <input
              type="number"
              step="0.01"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              placeholder="Weight in kg"
            />
          </div>
        </div>

        <div className="form-group full-width">
          <label>Remarks</label>
          <textarea
            name="remarks"
            value={formData.remarks}
            onChange={handleChange}
            rows="3"
            placeholder="Additional notes about the goat"
          />
        </div>

        <div className="form-group full-width photo-upload-section">
          <label>Goat Photo (Optional)</label>
          <div className="photo-upload-container">
            {photoPreview ? (
              <div className="photo-preview">
                <img src={photoPreview} alt="Goat preview" />
                <button 
                  type="button" 
                  onClick={removePhoto}
                  className="btn-remove-photo"
                  title="Remove photo"
                >
                  ✕ Remove
                </button>
              </div>
            ) : (
              <div className="photo-upload-area">
                <input
                  type="file"
                  id="photo-input"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="photo-input"
                />
                <label htmlFor="photo-input" className="photo-label">
                  <span className="upload-icon">📷</span>
                  <span>Choose Photo</span>
                  <span className="upload-hint">JPEG, PNG, GIF (Max 5MB)</span>
                </label>
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : editingGoat ? 'Update Goat' : 'Register Goat'}
          </button>
          {editingGoat && (
            <button type="button" onClick={onCancel} className="btn btn-secondary" disabled={isSubmitting}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default GoatForm;
