# Supabase Image Upload Setup Guide

## Issue
Getting 500 error when uploading goat photos because Supabase Storage is not configured.

## Solution: Set Up Supabase Storage

### Step 1: Go to Supabase Dashboard
1. Visit: https://supabase.com/dashboard
2. Sign in to your account
3. Select your project (the one with your database)

### Step 2: Create Storage Bucket
1. Click **"Storage"** in the left sidebar
2. Click **"Create a new bucket"**
3. Enter these details:
   - **Name:** `goat-images`
   - **Public bucket:** ✅ **YES** (check this box)
   - This allows images to be viewed without authentication
4. Click **"Create bucket"**

### Step 3: Get Your Credentials
1. Click **"Settings"** (gear icon) in the left sidebar
2. Click **"API"** under Project Settings
3. Copy these values:

   **Project URL:**
   ```
   https://xxxxxxxxxxxxx.supabase.co
   ```

   **service_role key (secret!):**
   ```
   eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYm...
   ```
   (This is a LONG key - make sure to copy the entire thing!)

### Step 4: Add Environment Variables to Render
1. Go to: https://dashboard.render.com
2. Find your **backend service** (hannanagribusinessltd backend)
3. Click on it
4. Click **"Environment"** tab on the left
5. Add these two variables:

   **Variable 1:**
   - **Key:** `SUPABASE_URL`
   - **Value:** `https://xxxxxxxxxxxxx.supabase.co` (your Project URL)

   **Variable 2:**
   - **Key:** `SUPABASE_SERVICE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your service_role key)

6. Click **"Save Changes"**

### Step 5: Verify Setup
1. Wait 1-2 minutes for Render to redeploy with new environment variables
2. The deployment will restart automatically
3. Check the Render logs - you should see:
   ```
   ✅ Supabase Storage configured successfully
   ```
4. Try uploading a goat photo again

## Storage Bucket Settings (Optional but Recommended)

### Set File Size Limit
1. In Supabase Storage > goat-images bucket
2. Click **"Settings"** (gear icon)
3. Set **"Max file size"**: `5 MB`
4. Set **"Allowed MIME types"**: `image/jpeg, image/jpg, image/png`

### Enable Auto-Delete (Optional)
If you want old images to be automatically deleted:
1. Set a **lifecycle policy** to delete files older than X days
2. This keeps storage costs low

## Troubleshooting

### Still getting 500 errors?
Check Render logs for specific error messages:
1. Go to Render Dashboard
2. Click your backend service
3. Go to **"Logs"** tab
4. Look for lines with "❌" or "Error uploading"
5. Share the error message if you need help

### Common Issues:

**"Supabase credentials not configured"**
- Environment variables not set properly on Render
- Double-check SUPABASE_URL and SUPABASE_SERVICE_KEY

**"Bucket not found"**
- Make sure bucket name is exactly `goat-images` (no spaces, lowercase)
- Verify bucket was created in Supabase Storage

**"Permission denied"**
- Using wrong Supabase key (use service_role, not anon key)
- Bucket is not set to public

**Images upload but don't display**
- Bucket must be PUBLIC for images to load in the app
- Go to Storage > goat-images > Make sure "Public bucket" is enabled

## Summary Checklist
- [ ] Supabase project exists
- [ ] `goat-images` bucket created
- [ ] Bucket is set to **PUBLIC**
- [ ] SUPABASE_URL added to Render environment
- [ ] SUPABASE_SERVICE_KEY added to Render environment
- [ ] Render service redeployed (automatic after env change)
- [ ] Test upload successful

## Benefits of This Setup
✅ Fast image loading (CDN-backed)
✅ No database bloat (images stored separately)
✅ Automatic image optimization
✅ Scalable storage
✅ Free tier: 1GB storage + 2GB bandwidth/month
