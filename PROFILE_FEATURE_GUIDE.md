# Profile Photo Feature - Setup & Usage Guide

## Overview
Users can now upload, change, and delete their profile photos. Profile photos are displayed in the navigation bar and on the user's profile page.

## Features Added

### 1. Database Schema
- Added `profile_photo` column to `users` table (VARCHAR 500)
- Stores relative path to uploaded profile images

### 2. Backend API
- **POST** `/api/upload/profile-photo` - Upload/update profile photo
  - Accepts image files (JPEG, PNG, GIF, WebP)
  - Automatically compresses images for storage efficiency
  - Creates thumbnails for better performance
  - Deletes old profile photo when uploading new one
  
- **DELETE** `/api/upload/profile-photo` - Delete current profile photo
  - Removes photo file from server
  - Updates user record to remove photo URL

### 3. Frontend Components

#### Profile Page (`/components/Profile.jsx`)
- Upload profile photo with preview
- View and manage account information
- Delete existing profile photo
- File validation (5MB max, image formats only)
- Real-time photo preview before upload
- Success/error messaging

#### Navigation Bar (`/components/Navigation.jsx`)
- Displays user's profile photo (or placeholder if none)
- Shows user's name and role
- Click profile section to navigate to Profile page
- Includes logout button

### 4. File Structure
```
backend/
  database/
    add-profile-photo.js       # Database migration script
  routes/
    uploadRoutes.js            # Profile photo upload endpoints
  models/
    UserModel.js               # Updated to include profile_photo

frontend/
  src/
    components/
      Profile.jsx              # Profile page component
      Profile.css              # Profile page styles
      Navigation.jsx           # Updated with profile display
      Navigation.css           # Updated with profile styles
    services/
      api.js                   # Added profile photo upload methods

uploads/
  profiles/                    # Profile photos storage directory
```

## Setup Instructions

### Step 1: Run Database Migration
Add the `profile_photo` column to the users table:

```powershell
cd backend
node database/add-profile-photo.js
```

This will:
- Add `profile_photo` column to `users` table
- Create `uploads/profiles` directory
- Verify setup is complete

### Step 2: Restart Backend Server
```powershell
cd backend
npm start
```

### Step 3: Restart Frontend
```powershell
cd frontend
npm run dev
```

## Usage Guide

### For Users

#### Uploading a Profile Photo

1. **Navigate to Profile Page**
   - Click on your name/photo in the navigation bar
   - Or select "Profile" from the menu

2. **Select Photo**
   - Click "📁 Choose Photo" button
   - Select an image file (JPEG, PNG, GIF, or WebP)
   - File must be under 5MB

3. **Preview & Upload**
   - Photo preview appears immediately
   - Click "⬆️ Upload Photo" to save
   - Wait for "Profile photo updated successfully!" message

4. **View Updated Photo**
   - Your photo now appears in the navigation bar
   - It will show wherever your profile is displayed

#### Changing Profile Photo

1. Navigate to Profile page
2. Click "📁 Choose Photo"
3. Select a new image
4. Click "⬆️ Upload Photo"
5. The old photo is automatically deleted and replaced

#### Deleting Profile Photo

1. Navigate to Profile page
2. Click "🗑️ Delete Photo" button
3. Confirm deletion
4. Photo is removed from server and database

### For Developers

#### API Endpoints

**Upload Profile Photo**
```javascript
POST /api/upload/profile-photo
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: 
  photo: <file>

Response:
{
  "message": "Profile photo uploaded successfully",
  "photoUrl": "/uploads/profiles/filename.jpg",
  "thumbnailUrl": "/uploads/profiles/filename_thumb.jpg",
  "originalSize": 2048576,
  "compressedSize": 512000,
  "compressionRatio": "75%",
  "user": {
    "user_id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "role": "staff",
    "profile_photo": "/uploads/profiles/filename.jpg"
  }
}
```

**Delete Profile Photo**
```javascript
DELETE /api/upload/profile-photo
Headers: 
  Authorization: Bearer <token>

Response:
{
  "message": "Profile photo deleted successfully"
}
```

#### Frontend Service Methods

```javascript
import { uploadService } from './services/api';

// Upload profile photo
const response = await uploadService.uploadProfilePhoto(photoFile);

// Delete profile photo
await uploadService.deleteProfilePhoto();
```

#### Integration Example

```jsx
import Profile from './components/Profile';

function MyApp() {
  const [user, setUser] = useState(getCurrentUser());

  const handleProfileUpdate = (updatedUser) => {
    setUser(updatedUser);
    // Persist to localStorage or state management
  };

  return (
    <Profile 
      user={user} 
      onProfileUpdate={handleProfileUpdate} 
    />
  );
}
```

## Technical Details

### Image Compression
- Images are automatically compressed using the existing `imageCompression` middleware
- Compression maintains quality while reducing file size
- Thumbnails are created for performance optimization

### File Storage
- Profile photos stored in `uploads/profiles/`
- Files named with timestamp + random string for uniqueness
- Old photos automatically deleted when new photo uploaded

### Security
- Requires authentication (JWT token)
- File type validation (only image formats)
- File size limit (5MB max)
- User can only upload/delete their own profile photo

### Database Schema
```sql
ALTER TABLE users 
ADD COLUMN profile_photo VARCHAR(500);
```

## Troubleshooting

### Photo Not Uploading
1. Check file size (must be < 5MB)
2. Verify file format (JPEG, PNG, GIF, WebP only)
3. Ensure backend server is running
4. Check authentication token is valid

### Photo Not Displaying
1. Check browser console for errors
2. Verify photo URL is correct (should start with `/uploads/profiles/`)
3. Ensure `uploads/profiles` directory exists
4. Check file permissions on uploads directory

### Database Migration Fails
1. Verify database connection in `.env`
2. Check if column already exists: `SELECT column_name FROM information_schema.columns WHERE table_name='users' AND column_name='profile_photo';`
3. Ensure you have ALTER TABLE permissions

### Photo Upload Fails with 500 Error
1. Check backend logs for specific error
2. Verify `uploads/profiles` directory exists and is writable
3. Check disk space on server
4. Verify image compression dependencies are installed

## Best Practices

### For Users
- Use clear, professional photos
- Keep file size reasonable (under 1MB recommended)
- Use square images for best display in circular frame
- Avoid very tall or wide images

### For Developers
- Always handle profile photo as optional (user may not have one)
- Provide fallback placeholder for users without photos
- Display photo loading states
- Cache profile photos for performance
- Validate file types on both frontend and backend

## Future Enhancements

Potential improvements for future versions:
- [ ] Image cropping/editing before upload
- [ ] Multiple photo sizes for different contexts
- [ ] Photo gallery for users
- [ ] Avatar selection (preset images)
- [ ] Gravatar integration
- [ ] Photo approval workflow for admins
- [ ] Photo quality analysis

## Testing Checklist

- [ ] Database migration runs successfully
- [ ] Upload profile photo (JPEG)
- [ ] Upload profile photo (PNG)
- [ ] Upload profile photo (GIF)
- [ ] Try uploading file > 5MB (should fail)
- [ ] Try uploading non-image file (should fail)
- [ ] Photo displays in navigation bar
- [ ] Photo displays on profile page
- [ ] Change existing profile photo
- [ ] Delete profile photo
- [ ] Photo placeholder shows when no photo
- [ ] Navigation works after photo changes
- [ ] Logout and login - photo persists

## Support

For issues or questions:
1. Check this documentation first
2. Review backend logs: `backend/logs/`
3. Check browser console for frontend errors
4. Verify all setup steps completed
5. Contact system administrator

---

**Profile Photo Feature** - Version 1.0
Last Updated: February 11, 2026
