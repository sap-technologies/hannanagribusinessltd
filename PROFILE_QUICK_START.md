# Profile Photo Feature - Quick Start

## ✅ What's Been Added

Users can now:
- Upload profile photos (JPEG, PNG, GIF, WebP)
- Change their profile photos
- Delete profile photos
- View profile photos in navigation bar
- Manage profile settings on dedicated Profile page

## 🚀 Quick Setup (3 Steps)

### 1. Run Database Migration
```powershell
cd backend
node database/add-profile-photo.js
```

### 2. Restart Backend
```powershell
# If backend is running, stop it (Ctrl+C) and restart:
cd backend
npm start
```

### 3. Restart Frontend
```powershell
# If frontend is running, stop it (Ctrl+C) and restart:
cd frontend
npm run dev
```

## 📝 How to Use

1. **Access Profile Page**
   - Click your name in the navigation bar (top of page)
   - You'll see your name with a circular photo placeholder

2. **Upload Photo**
   - Click "📁 Choose Photo"
   - Select image (max 5MB)
   - Preview appears
   - Click "⬆️ Upload Photo"
   - Done! Photo now shows everywhere

3. **Change Photo**
   - Go to Profile page
   - Choose new photo
   - Upload (old photo auto-deleted)

4. **Delete Photo**
   - Go to Profile page
   - Click "🗑️ Delete Photo"
   - Confirm deletion

## 📋 Files Created/Modified

### Backend
- ✅ `backend/database/add-profile-photo.js` - Migration script
- ✅ `backend/routes/uploadRoutes.js` - Added profile photo endpoints
- ✅ `backend/models/UserModel.js` - Added profile_photo field

### Frontend
- ✅ `frontend/src/components/Profile.jsx` - Profile page (NEW)
- ✅ `frontend/src/components/Profile.css` - Profile styles (NEW)
- ✅ `frontend/src/components/Navigation.jsx` - Show profile photo
- ✅ `frontend/src/components/Navigation.css` - Profile display styles
- ✅ `frontend/src/services/api.js` - Upload methods
- ✅ `frontend/src/App.jsx` - Profile route
- ✅ `frontend/src/AppWithAuth.jsx` - Pass user data

### Documentation
- ✅ `PROFILE_FEATURE_GUIDE.md` - Complete guide
- ✅ `PROFILE_QUICK_START.md` - This file

## 🎯 Key Features

- **Photo Preview**: See photo before uploading
- **Auto Compression**: Images compressed automatically
- **Size Validation**: Max 5MB file size
- **Format Support**: JPEG, PNG, GIF, WebP
- **Old Photo Cleanup**: Previous photos auto-deleted
- **Circular Display**: Photos shown in circular frame
- **Fallback Icon**: Placeholder shown if no photo

## 🔍 Where Photos Appear

- ✅ Navigation bar (top right)
- ✅ Profile page
- ✅ Future: Anywhere user info is displayed

## ⚠️ Important Notes

- **Photo is optional** - Users don't need to upload one
- **Max file size**: 5MB
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Storage location**: `uploads/profiles/`
- **Authentication required**: Must be logged in

## 🐛 Troubleshooting

### Photo Won't Upload
- Check file size (< 5MB)
- Verify image format (JPEG/PNG/GIF/WebP)
- Make sure you're logged in
- Check backend is running

### Photo Not Showing
- Refresh page
- Check browser console (F12)
- Verify migration ran successfully
- Check `uploads/profiles/` folder exists

### Migration Error
- Verify database connection in `backend/.env`
- Check if column already exists (migration is safe to re-run)
- Ensure database user has ALTER TABLE permission

## 📞 Testing

Try these scenarios:
1. ✅ Upload a JPEG photo
2. ✅ Upload a PNG photo
3. ✅ Upload a 6MB photo (should fail with error)
4. ✅ Upload a .txt file (should fail - not an image)
5. ✅ Change existing photo
6. ✅ Delete photo
7. ✅ Navigate between pages - photo stays visible
8. ✅ Logout and login - photo persists

## 📚 Full Documentation

For complete details, see: **PROFILE_FEATURE_GUIDE.md**

---

**Ready to use!** Just run the 3 setup steps above and start uploading profile photos! 🎉
