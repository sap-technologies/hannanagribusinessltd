# Authentication & API Fixes

## Issues Fixed

### 1. **401 Unauthorized Errors** ✅
**Problem:** API requests were failing with 401 errors even though user was logged in.

**Root Cause:** Frontend was making API requests directly to `http://localhost:1230/api` instead of using the Vite proxy, causing CORS and authentication issues.

**Solution:** Changed API base URL to use relative path `/api` to leverage Vite proxy.

### 2. **NotificationBell API Errors** ✅
**Problem:** NotificationBell component was trying to use `api` from `authService` which wasn't properly structured for notifications.

**Root Cause:** 
- Wrong import: `import api from '../services/authService'`
- No notification service methods in api.js

**Solution:**
- Created `notificationService` in api.js with proper methods
- Updated NotificationBell to use `notificationService`

### 3. **Image URL Issues** ✅
**Problem:** Profile photos and goat images weren't loading (wrong URLs with port 3000).

**Root Cause:** Hardcoded URLs pointing to `http://localhost:3000` instead of using backend server.

**Solution:**
- Added `/uploads` proxy to Vite config
- Updated image URLs to use relative paths
- Images now served through proxy from backend

## Files Modified

### Frontend
1. **`frontend/src/services/api.js`**
   - Changed `API_BASE_URL` from `'http://localhost:1230/api'` to `'/api'`
   - Added `notificationService` with methods:
     - `getUnreadCount()`
     - `getAll()`
     - `markAsRead(id)`
     - `markAllAsRead()`
     - `delete(id)`

2. **`frontend/src/components/NotificationBell.jsx`**
   - Fixed import: Now uses `notificationService` from api.js
   - Updated all API calls to use service methods

3. **`frontend/src/components/Profile.jsx`**
   - Fixed photo URLs: Removed `http://localhost:3000` prefix
   - Now uses relative paths through proxy

4. **`frontend/src/components/Navigation.jsx`**
   - Fixed profile photo URL: Uses relative path
   - Works with proxy seamlessly

5. **`frontend/vite.config.js`**
   - Added `/uploads` proxy configuration
   - Now proxies both `/api` and `/uploads` to backend

## How It Works Now

### API Requests
```
Frontend (localhost:2340) 
    ↓ makes request to /api/...
Vite Proxy 
    ↓ forwards to
Backend (localhost:1230/api/...)
```

### Image Serving
```
Frontend displays: <img src="/uploads/profiles/photo.jpg" />
    ↓
Vite Proxy forwards to
    ↓
Backend static files: localhost:1230/uploads/profiles/photo.jpg
```

### Authentication Flow
```
1. User logs in → Token saved to localStorage
2. API request made → Interceptor adds Bearer token
3. Proxy forwards request → Backend validates token
4. Response returned → Interceptor handles 401 errors
```

## Testing Instructions

### 1. Restart Frontend (Required!)
The Vite config changed, so you MUST restart the dev server:

```powershell
# In frontend terminal, press Ctrl+C to stop
# Then restart:
cd frontend
npm run dev
```

### 2. Clear Browser Cache
Clear localStorage and refresh:
- Press F12 (Developer Tools)
- Go to Application tab
- Click "Clear site data"
- Or: Logout and login again

### 3. Test API Calls
- Login with your credentials
- Navigate to Breeding Farm
- Should see goats list load without 401 errors
- Check browser console (F12) - no errors

### 4. Test Notifications
- Click notification bell (top right)
- Should load notifications without errors
- Check console for "Failed to fetch" errors - should be none

### 5. Test Profile Photos
- Click your name in navigation
- Upload a profile photo
- Photo should display immediately
- Navigate around - photo stays visible

## Verification Checklist

- [ ] Backend running on port 1230
- [ ] Frontend running on port 2340
- [ ] Can login successfully
- [ ] Goat list loads without 401 errors
- [ ] Can add new goat
- [ ] Notification bell works (no console errors)
- [ ] Profile photo upload works
- [ ] Profile photo displays in navigation
- [ ] No CORS errors in browser console
- [ ] No 401 Unauthorized errors

## Technical Details

### Vite Proxy Configuration
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:1230',
    changeOrigin: true,
  },
  '/uploads': {
    target: 'http://localhost:1230',
    changeOrigin: true,
  }
}
```

### API Client Setup
```javascript
// Uses relative path - leverages Vite proxy
const API_BASE_URL = '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor adds auth token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Notification Service
```javascript
export const notificationService = {
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },
  
  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },
  
  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/mark-all-read');
    return response.data;
  },
  
  delete: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};
```

## Common Issues & Solutions

### Still Getting 401 Errors?
1. Check localStorage has `authToken`
2. Verify token hasn't expired (24h lifetime)
3. Logout and login again
4. Check backend is running

### Notifications Not Loading?
1. Ensure notification routes exist in backend
2. Check backend console for errors
3. Verify database has notifications table
4. Check network tab in browser DevTools

### Images Not Loading?
1. Verify `/uploads` directory exists in backend
2. Check file permissions on uploads folder
3. Confirm proxy is working (restart frontend)
4. Look for 404 errors in network tab

### CORS Errors?
1. Shouldn't happen with proxy setup
2. If you see CORS errors, frontend not using proxy
3. Check API_BASE_URL is `/api` (relative, not full URL)
4. Restart Vite dev server

## Benefits of This Setup

✅ **No CORS Issues** - All requests go through same origin
✅ **Automatic Auth** - Interceptor adds token to every request
✅ **Cleaner Code** - No hardcoded URLs
✅ **Better Security** - Token handling centralized
✅ **Easy Testing** - Proxy handles routing
✅ **Production Ready** - Just change proxy config for production

## Production Considerations

When deploying to production:
1. Update Vite proxy to point to production backend
2. Or, set API_BASE_URL to production API domain
3. Ensure CORS is configured for production domain
4. Use HTTPS for all requests
5. Consider API gateway/CDN for static files

---

**Status: All fixes applied and ready to test!**

Just restart the frontend dev server and test the checklist above.
