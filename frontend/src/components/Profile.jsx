import { useState, useEffect } from 'react';
import { uploadService } from '../services/api';
import BackButton from './BackButton';
import './Profile.css';

function Profile({ user, onProfileUpdate, onBack }) {
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [userProfile, setUserProfile] = useState(user);

  useEffect(() => {
    setUserProfile(user);
    if (user?.profilePhoto) {
      // Use the photo URL as-is (Vite proxy will handle /uploads paths)
      setPhotoPreview(user.profilePhoto);
    } else {
      setPhotoPreview(null);
    }
  }, [user]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    
    if (!file) return;
    
    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setMessage({ 
        text: 'Please select a valid image file (JPEG, PNG, GIF, or WebP)', 
        type: 'error' 
      });
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ 
        text: 'Image size must be less than 5MB', 
        type: 'error' 
      });
      return;
    }
    
    setPhotoFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result);
    };
    reader.readAsDataURL(file);
    setMessage({ text: '', type: '' });
  };

  const handleUploadPhoto = async () => {
    if (!photoFile) {
      setMessage({ text: 'Please select a photo first', type: 'error' });
      return;
    }

    try {
      setUploading(true);
      setMessage({ text: 'Uploading photo...', type: 'info' });

      const response = await uploadService.uploadProfilePhoto(photoFile);
      
      setMessage({ 
        text: 'Profile photo updated successfully!', 
        type: 'success' 
      });

      // Update user profile with new photo
      const updatedUser = {
        ...userProfile,
        profilePhoto: response.photoUrl
      };
      setUserProfile(updatedUser);
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }

      // Reset file input
      setPhotoFile(null);
      
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error uploading photo:', error);
      setMessage({ 
        text: error.response?.data?.error || 'Failed to upload photo', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async () => {
    if (!window.confirm('Are you sure you want to delete your profile photo?')) {
      return;
    }

    try {
      setUploading(true);
      setMessage({ text: 'Deleting photo...', type: 'info' });

      await uploadService.deleteProfilePhoto();
      
      setMessage({ 
        text: 'Profile photo deleted successfully!', 
        type: 'success' 
      });

      // Update user profile
      const updatedUser = {
        ...userProfile,
        profilePhoto: null
      };
      setUserProfile(updatedUser);
      setPhotoPreview(null);
      setPhotoFile(null);
      
      // Notify parent component
      if (onProfileUpdate) {
        onProfileUpdate(updatedUser);
      }

      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    } catch (error) {
      console.error('Error deleting photo:', error);
      setMessage({ 
        text: error.response?.data?.error || 'Failed to delete photo', 
        type: 'error' 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleCancelUpload = () => {
    setPhotoFile(null);
    if (userProfile?.profilePhoto) {
      setPhotoPreview(userProfile.profilePhoto);
    } else {
      setPhotoPreview(null);
    }
    setMessage({ text: '', type: '' });
  };

  return (
    <div className="profile-container">
      {onBack && <BackButton onClick={onBack} label="Back" />}
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p className="profile-subtitle">Manage your account settings and profile photo</p>
      </div>

      {message.text && (
        <div className={`profile-message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="profile-content">
        {/* Profile Photo Section */}
        <div className="profile-section profile-photo-section">
          <h2>Profile Photo</h2>
          
          <div className="photo-upload-container">
            <div className="photo-preview-box">
              {photoPreview ? (
                <img 
                  src={photoPreview} 
                  alt="Profile" 
                  className="profile-photo-preview"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200"><rect fill="%23ddd" width="200" height="200"/><text x="50%" y="50%" font-size="60" text-anchor="middle" dy=".3em" fill="%23999">👤</text></svg>';
                  }}
                />
              ) : (
                <div className="photo-placeholder">
                  <span className="placeholder-icon">👤</span>
                  <p>No photo uploaded</p>
                </div>
              )}
            </div>

            <div className="photo-upload-controls">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="profile-photo"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  onChange={handlePhotoChange}
                  className="file-input"
                  disabled={uploading}
                />
                <label htmlFor="profile-photo" className="file-input-label">
                  📁 Choose Photo
                </label>
                <span className="file-name">
                  {photoFile ? photoFile.name : 'No file chosen'}
                </span>
              </div>

              <p className="upload-hint">
                Accepted formats: JPEG, PNG, GIF, WebP (Max 5MB)
              </p>

              {photoFile && (
                <div className="upload-actions">
                  <button
                    onClick={handleUploadPhoto}
                    disabled={uploading}
                    className="btn btn-primary"
                  >
                    {uploading ? '⏳ Uploading...' : '⬆️ Upload Photo'}
                  </button>
                  <button
                    onClick={handleCancelUpload}
                    disabled={uploading}
                    className="btn btn-secondary"
                  >
                    ✕ Cancel
                  </button>
                </div>
              )}

              {userProfile?.profilePhoto && !photoFile && (
                <button
                  onClick={handleDeletePhoto}
                  disabled={uploading}
                  className="btn btn-danger"
                >
                  🗑️ Delete Photo
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Information Section */}
        <div className="profile-section profile-info-section">
          <h2>Account Information</h2>
          
          <div className="info-grid">
            <div className="info-item">
              <label>Full Name</label>
              <p className="info-value">{userProfile?.fullName || 'Not set'}</p>
            </div>

            <div className="info-item">
              <label>Email Address</label>
              <p className="info-value">{userProfile?.email || 'Not set'}</p>
            </div>

            <div className="info-item">
              <label>Role</label>
              <p className="info-value role-badge">{userProfile?.role || 'Not set'}</p>
            </div>

            <div className="info-item">
              <label>User ID</label>
              <p className="info-value">{userProfile?.userId || 'Not set'}</p>
            </div>
          </div>

          <p className="info-note">
            ℹ️ To update your name, email, or role, please contact your system administrator.
          </p>
        </div>

        {/* Security Section */}
        <div className="profile-section security-section">
          <h2>🔒 Security</h2>
          
          <div className="security-options">
            <button className="btn btn-outline">
              🔑 Change Password
            </button>
          </div>

          <p className="security-note">
            ℹ️ Password change functionality coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Profile;
