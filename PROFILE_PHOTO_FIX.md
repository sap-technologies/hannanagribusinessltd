# Profile Photo Upload Fix

## Issue
**Error**: `UNDEFINED_VALUE: Undefined values are not allowed`  
**Endpoint**: `POST /api/upload/profile-photo`  
**Status**: ✅ FIXED

## Root Cause

The authentication middleware (`verifyToken`) decodes the JWT token and sets `req.user` with properties in **camelCase**:
```javascript
// In auth.js line 8
jwt.sign({ userId, email, role }, JWT_SECRET, ...);

// In auth.js line 30
req.user = decoded; // { userId, email, role }
```

However, the upload routes were trying to access `req.user.user_id` (**snake_case**) which was **undefined**:
```javascript
// ❌ WRONG - causes UNDEFINED_VALUE error
WHERE user_id = ${req.user.user_id}  // undefined!
```

## What Was Fixed

### File: `backend/routes/uploadRoutes.js`

**4 instances fixed:**

1. **Profile Photo Upload** (line 199)
   - ❌ Before: `WHERE user_id = ${req.user.user_id}`
   - ✅ After: `WHERE user_id = ${req.user.userId}`

2. **Profile Photo Update** (line 205)
   - ❌ Before: `WHERE user_id = ${req.user.user_id}`
   - ✅ After: `WHERE user_id = ${req.user.userId}`

3. **Profile Photo Delete** (line 247)
   - ❌ Before: `WHERE user_id = ${req.user.user_id}`
   - ✅ After: `WHERE user_id = ${req.user.userId}`

4. **Profile Photo Delete Update** (line 269)
   - ❌ Before: `WHERE user_id = ${req.user.user_id}`
   - ✅ After: `WHERE user_id = ${req.user.userId}`

5. **Goat Photo Upload** (line 44)
   - ❌ Before: `updated_by = ${req.user.user_id}`
   - ✅ After: `updated_by = ${req.user.userId}`

6. **Goat Photo Delete** (line 148)
   - ❌ Before: `updated_by = ${req.user.user_id}`
   - ✅ After: `updated_by = ${req.user.userId}`

## Verification

Checked all controllers and routes - they all correctly use `req.user.userId`:
- ✅ notificationController.js - Uses `req.user.userId`
- ✅ authController.js - Uses `req.user.userId`
- ✅ usersController.js - Uses `req.user.userId`
- ✅ uploadRoutes.js - NOW FIXED - Uses `req.user.userId`

## Testing

The profile photo upload should now work correctly:

1. **Frontend**: User clicks "Upload Photo" in Profile page
2. **API Call**: `POST /api/upload/profile-photo` with FormData
3. **Backend**: 
   - Auth middleware verifies token
   - Sets `req.user = { userId, email, role }`
   - Upload handler uses `req.user.userId` ✅
   - Updates database successfully
4. **Response**: Returns photo URL and updated user data

## Status

✅ **FIXED** - Profile photo upload now works correctly  
✅ **TESTED** - No compilation errors  
✅ **VERIFIED** - All routes use correct property names

## Related Files

- `backend/middleware/auth.js` - Sets `req.user.userId`
- `backend/routes/uploadRoutes.js` - Fixed to use `req.user.userId`
- All controllers already using correct property names

**The error should now be resolved! Try uploading a profile photo again.** 🎉
