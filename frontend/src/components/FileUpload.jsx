import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1230';

const FileUpload = ({ goatId, onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG, GIF)');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    // Upload file
    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('photo', file);

      const token = localStorage.getItem('authToken');
      const response = await axios.post(
        `${API_URL}/api/upload/goat-photo/${goatId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onUploadSuccess) {
        onUploadSuccess(response.data.photoUrl);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-upload">
      <label className="upload-button">
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading ? '⏳ Uploading...' : '📷 Upload Photo'}
      </label>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FileUpload;
