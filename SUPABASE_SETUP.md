# Supabase Setup Guide

This application stores all data (database + images) in Supabase for optimal performance and scalability.

## Why Supabase Storage?

✅ **Fast Loading**: Images load via CDN (much faster than base64)  
✅ **Scalable**: No server storage needed  
✅ **Cost Effective**: Free tier includes 1GB storage  
✅ **Deployment Ready**: Works perfectly with Render + Vercel  

## Prerequisites

- A Supabase account (free): https://supabase.com

## Step 1: Create Supabase Project

1. Go to https://supabase.com/dashboard
2. Click **"New Project"**
3. Fill in:
   - Name: `Hannan Agribusiness`
   - Database Password: (save this!)
   - Region: Choose closest to your users
4. Wait 2-3 minutes for project creation

## Step 2: Get Database Connection String

1. In your project dashboard, click **"Database"** (left sidebar)
2. Click **"Connection String"** tab
3. Select **"URI"** mode
4. Copy the connection string (it looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
   ```
5. Replace `[YOUR-PASSWORD]` with your actual database password
6. This goes in your `DATABASE_URL` environment variable

## Step 3: Create Storage Bucket

1. In Supabase dashboard, click **"Storage"** (left sidebar)
2. Click **"Create a new bucket"**
3. Bucket settings:
   - **Name**: `goat-images`
   - **Public bucket**: ✅ **Enable this!** (required for image access)
   - **File size limit**: 5MB (recommended)
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif`
4. Click **"Create bucket"**

### Important: Make Bucket Public

If you forgot to make it public:
1. Go to **Storage** > **Policies**
2. Click on `goat-images` bucket
3. Click **"New Policy"**
4. Select **"For full customization"**
5. Add this policy:
   ```sql
   -- Policy name: Public read access
   -- Operation: SELECT
   -- Target roles: public
   
   CREATE POLICY "Public read access"
   ON storage.objects FOR SELECT
   USING (bucket_id = 'goat-images');
   ```

## Step 4: Get API Keys

1. Click **"Settings"** (gear icon, left sidebar)
2. Click **"API"** section
3. Copy these values:

   **Project URL** (e.g., `https://abc123xyz.supabase.co`)
   ```
   SUPABASE_URL=https://abc123xyz.supabase.co
   ```

   **service_role key** (⚠️ Keep this secret! Never commit to Git!)
   ```
   SUPABASE_SERVICE_KEY=eyJhbGci...very_long_key
   ```

## Step 5: Configure Backend Environment

1. Open `backend/.env` file (create if it doesn't exist)
2. Add/update these variables:

```env
# Database (from Step 2)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.abc123xyz.supabase.co:5432/postgres

# Supabase Storage (from Step 4)
SUPABASE_URL=https://abc123xyz.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...your_service_role_key
SUPABASE_STORAGE_BUCKET=goat-images
```

## Step 6: Test the Setup

1. Start your backend:
   ```bash
   cd backend
   npm start
   ```

2. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Try uploading a goat photo:
   - Register a new goat
   - Upload a photo
   - Check if it appears in goat details

4. Verify in Supabase:
   - Go to **Storage** > **goat-images**
   - You should see your uploaded image
   - Click the image to verify it's accessible

## Step 7: Database Migration

Run this SQL in Supabase to ensure photo_url columns are ready:

1. Go to **SQL Editor** in Supabase dashboard
2. Run this migration:

```sql
-- Ensure photo_url columns can store full URLs
ALTER TABLE goats 
ALTER COLUMN photo_url TYPE TEXT;

ALTER TABLE users 
ALTER COLUMN profile_photo TYPE TEXT;

-- Optional: Clean up old base64 data if needed
UPDATE goats SET photo_url = NULL WHERE photo_url LIKE 'data:image%';
UPDATE users SET profile_photo = NULL WHERE profile_photo LIKE 'data:image%';
```

## Deployment Configuration

### For Render (Backend)

Add these environment variables in Render dashboard:

```
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.abc123xyz.supabase.co:5432/postgres
SUPABASE_URL=https://abc123xyz.supabase.co
SUPABASE_SERVICE_KEY=eyJhbGci...your_service_role_key
SUPABASE_STORAGE_BUCKET=goat-images
```

### For Vercel (Frontend)

No additional configuration needed! Images are loaded directly from Supabase CDN.

## Troubleshooting

### Images not uploading

**Error**: "Failed to upload image"
- ✅ Check `SUPABASE_URL` is correct
- ✅ Check `SUPABASE_SERVICE_KEY` is the **service_role** key (not anon key)
- ✅ Verify bucket name matches `SUPABASE_STORAGE_BUCKET`

### Images not displaying

**Error**: Images upload but don't show
- ✅ Make sure bucket is **public**
- ✅ Check browser console for CORS errors
- ✅ Verify image URL format: `https://[project].supabase.co/storage/v1/object/public/goat-images/...`

### Permission denied errors

**Error**: "new row violates row-level security policy"
- ✅ Make sure you're using **service_role** key, not anon key
- ✅ Service role key bypasses RLS policies

### Database connection issues

**Error**: "connection refused"
- ✅ Use the **URI** connection string (starts with `postgresql://`)
- ✅ Include your database password in the connection string
- ✅ Check that IP restrictions are not blocking your connection

## Storage Costs

Supabase Free Tier includes:
- **1 GB storage** (thousands of images)
- **2 GB bandwidth/month** (plenty for small farms)
- **50 MB max file size**

For larger operations, consider Supabase Pro ($25/month):
- **100 GB storage**
- **250 GB bandwidth/month**

## Security Best Practices

1. ✅ **Never commit** `.env` file to Git
2. ✅ Keep `SUPABASE_SERVICE_KEY` secret
3. ✅ Use **service_role** key only on backend (never in frontend)
4. ✅ Set appropriate file size limits (5MB recommended)
5. ✅ Enable bucket policies for public read access only

## Support

If you encounter issues:
1. Check Supabase logs: **Logs** > **Edge Functions**
2. Check backend logs for detailed error messages
3. Verify all environment variables are set correctly
4. Test with a small image first (<1MB)

---

**✅ Setup Complete!** Your images are now stored in Supabase for fast, scalable access.
