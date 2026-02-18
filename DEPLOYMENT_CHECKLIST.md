# 🚀 Quick Deployment Checklist

## ✅ Before You Deploy

### 1. Run Database Migration (REQUIRED!)
```bash
cd backend
npm run db:migrate
```
This updates photo columns from VARCHAR(500) to TEXT for base64 storage.

### 2. Test Locally
```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 3. Update Environment Files
- Copy `backend/.env.example` to `backend/.env`
- Update DATABASE_URL with your database connection
- Generate new JWT_SECRET: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 🌐 Deployment Steps

### Backend on Render
1. ✅ Create PostgreSQL database on Render
2. ✅ Copy Internal Database URL
3. ✅ Create Web Service from GitHub
4. ✅ Set environment variables (DATABASE_URL, JWT_SECRET, etc.)
5. ✅ Deploy and wait
6. ✅ Run `npm run db:setup` in Shell
7. ✅ Copy backend URL

### Frontend on Vercel
1. ✅ Update `frontend/vercel.json` with backend URL
2. ✅ Create new project on Vercel
3. ✅ Import from GitHub
4. ✅ Set VITE_API_URL environment variable
5. ✅ Deploy and wait
6. ✅ Copy frontend URL

### Final Step
1. ✅ Update backend FRONTEND_URL with Vercel URL
2. ✅ Redeploy backend on Render
3. ✅ Test login and image upload

---

## 🔍 Verification

### Test Backend
```bash
curl https://your-backend.onrender.com/api/health
```

### Test Frontend
- Visit https://your-frontend.vercel.app
- Login with test account
- Upload a goat photo
- Verify image displays

---

## 📸 Image Storage

✅ **Images are now stored as base64 in the database**
- No uploads/ folder needed
- Works perfectly on Render (ephemeral storage)
- Works perfectly on Vercel (serverless)
- Automatic compression (JPEG 80%, max 800x800px)
- Thumbnail generation included

---

## ⚠️ Important Notes

1. **Use INTERNAL Database URL on Render** (not external)
2. **Run migration BEFORE first deployment**
3. **Update CORS settings** after getting Vercel URL
4. **Free tier has limitations**:
   - Render free tier spins down after inactivity
   - Render PostgreSQL free tier expires after 90 days
   - Consider upgrading for production use

---

## 🆘 Need Help?

See full guide: [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

Common issues:
- Backend not starting → Check DATABASE_URL (use Internal URL)
- CORS errors → Update FRONTEND_URL in backend
- Images not uploading → Run `npm run db:migrate`
- Database not found → Run `npm run db:setup` in Render Shell

---

**Everything ready! Follow the steps and you'll be live in 30 minutes! 🎉**
