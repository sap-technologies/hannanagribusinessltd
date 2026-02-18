# 🚀 Deployment Guide - Render (Backend) + Vercel (Frontend)

## ✅ Pre-Deployment Checklist

Your application is now **production-ready** with the following improvements:
- ✅ Images stored as **base64 in database** (no filesystem dependency)
- ✅ Memory-based file uploads (perfect for serverless/ephemeral storage)
- ✅ Automatic image compression and thumbnails
- ✅ No uploads/ folder required
- ✅ Works perfectly on Render and Vercel

---

## 📊 Backend Deployment on Render

### Step 1: Prepare Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **New** → **PostgreSQL**
3. Configure:
   - **Name**: hannan-agribusiness-db
   - **Database**: hannan_agribusiness
   - **User**: (auto-generated)
   - **Region**: Choose closest to you
   - **Plan**: Free or Starter
4. Click **Create Database**
5. **Copy the Internal Database URL** (starts with `postgres://`)

### Step 2: Run Database Migration (IMPORTANT!)
Before deploying, update your database schema:

```bash
cd backend
node database/migrate-to-base64.js
```

This updates photo columns to support base64 storage.

### Step 3: Deploy Backend
1. Push your code to GitHub
2. Go to Render Dashboard → **New** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name**: hannan-agribusiness-backend
   - **Region**: Same as database
   - **Branch**: main (or your branch name)
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free or Starter

5. **Environment Variables** (click Add Environment Variable):
   ```
   DATABASE_URL=<your-internal-database-url-from-step-1>
   JWT_SECRET=your-super-secret-jwt-key-change-this
   NODE_ENV=production
   PORT=1230
   FRONTEND_URL=https://hannan-agribusiness.vercel.app
   ```

6. Click **Create Web Service**
7. Wait for deployment (5-10 minutes)
8. **Copy your backend URL**: `https://hannan-agribusiness-backend.onrender.com`

### Step 4: Setup Database Tables
After first deployment:
1. Go to your Render service
2. Click **Shell** tab
3. Run: `npm run db:setup`
4. This creates all tables automatically

---

## 🌐 Frontend Deployment on Vercel

### Step 1: Update API URL
1. Open `frontend/vercel.json`
2. Update `VITE_API_URL` with your Render backend URL:
   ```json
   {
     "env": {
       "VITE_API_URL": "https://YOUR-BACKEND-NAME.onrender.com"
     }
   }
   ```

### Step 2: Deploy to Vercel
1. Push changes to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** → **Project**
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist
   - **Install Command**: `npm install`

6. **Environment Variables**:
   ```
   VITE_API_URL=https://YOUR-BACKEND-NAME.onrender.com
   ```

7. Click **Deploy**
8. Wait for deployment (2-3 minutes)
9. **Copy your frontend URL**: `https://hannan-agribusiness.vercel.app`

### Step 3: Update Backend CORS
1. Go back to Render Dashboard → Your Backend Service
2. Update `FRONTEND_URL` environment variable:
   ```
   FRONTEND_URL=https://YOUR-FRONTEND.vercel.app
   ```
3. Save and redeploy

---

## 🔐 Environment Variables Summary

### Backend (Render)
```env
DATABASE_URL=postgres://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
PORT=1230
FRONTEND_URL=https://your-frontend.vercel.app
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-backend.onrender.com
```

---

## 📸 Image Storage Explained

### How It Works Now
- Images are converted to **base64** format
- Compressed automatically (JPEG quality 80%, max 800x800px)
- Stored directly in PostgreSQL database as TEXT
- No filesystem writes = works on serverless platforms

### Benefits
✅ No uploads/ folder needed
✅ Works on ephemeral filesystems (Render)
✅ Works on serverless (Vercel backend functions)
✅ Images survive server restarts
✅ Easy backups (just backup database)
✅ No external storage service needed (Cloudinary, S3, etc.)

### Database Size Considerations
- Average goat photo: ~100-200KB (after compression)
- Base64 encoding adds ~33% overhead
- For 1000 goats: ~200MB of database storage
- PostgreSQL Free tier on Render: 1GB included

---

## 🧪 Testing Deployment

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```
Expected: `{"status":"OK","timestamp":"..."}`

### Test Frontend
1. Open `https://your-frontend.vercel.app`
2. Try logging in
3. Upload a goat photo
4. Check if image displays correctly

### Test Image Upload
1. Go to Breeding Farm → Goats
2. Add/Edit a goat
3. Upload a photo
4. Photo should display immediately (base64 data)

---

## 🐛 Troubleshooting

### Backend Not Starting
- Check DATABASE_URL is correct (Internal URL, not External)
- Verify all environment variables are set
- Check Render logs for errors

### Frontend Can't Connect to Backend
- Verify VITE_API_URL in Vercel matches your Render backend URL
- Check CORS settings (FRONTEND_URL in backend)
- Ensure backend is running (check Render dashboard)

### Images Not Uploading
- Check browser console for errors
- Verify Content-Type is multipart/form-data
- Check file size (max 5MB recommended for base64)
- Check database column type is TEXT (not VARCHAR)

### Database Connection Issues
- Use **Internal Database URL** in Render (not External)
- Ensure backend and database are in same region
- Check PostgreSQL is running in Render dashboard

---

## 💰 Cost Estimate

### Free Tier (Good for Testing)
- **Render PostgreSQL**: Free (1GB storage, expires after 90 days)
- **Render Web Service**: Free (750 hours/month, spindown after inactivity)
- **Vercel**: Free (100GB bandwidth/month)
- **Total**: $0/month

### Production Tier (Recommended)
- **Render PostgreSQL Starter**: $7/month (10GB storage)
- **Render Web Service Starter**: $7/month (no spindown)
- **Vercel Pro**: Free (sufficient for most use cases)
- **Total**: ~$14/month

---

## 🔄 Updating Your App

### Backend Updates
1. Push changes to GitHub
2. Render auto-deploys (if auto-deploy enabled)
3. Or manually trigger deploy in Render dashboard

### Frontend Updates
1. Push changes to GitHub
2. Vercel auto-deploys automatically
3. Live in ~2 minutes

---

## 📞 Support

If you encounter issues:
1. Check Render logs (Backend errors)
2. Check Vercel logs (Frontend errors)
3. Check browser console (API errors)
4. Verify all environment variables

---

## ✅ Final Checklist

Before going live:
- [ ] Run `node database/migrate-to-base64.js`
- [ ] Backend deployed on Render
- [ ] Database created and connected
- [ ] Database tables created (`npm run db:setup`)
- [ ] Frontend deployed on Vercel
- [ ] CORS configured correctly
- [ ] Test image uploads work
- [ ] Test all major features
- [ ] Create admin user
- [ ] Backup database

---

**🎉 Congratulations! Your app is now deployed and production-ready!**
