# 🚀 QUICK START GUIDE

## Getting Started in 3 Steps

### Step 1: Start Backend Server
```bash
cd backend
node server.js
```

You should see:
```
========================================
🏢 HANNAN AGRIBUSINESS LIMITED
   Business Management System v2.0
========================================
🚀 Server is running on port 1230
🔐 Auth: http://localhost:1230/api/auth/login

👤 Default Admin:
  Email: admin@hannan.com
  Password: Admin123!
========================================
```

### Step 2: Start Frontend (New Terminal)
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 2499 ms
➜  Local:   http://localhost:2340/
```

### Step 3: Login
1. Open your browser: **http://localhost:2340**
2. Login with:
   - **Email**: `admin@hannan.com`
   - **Password**: `Admin123!`
3. Click **Login** button

## Success! 🎉

You're now logged in to your secure farm management system!

---

## What You Can Do Now

### As Admin:

1. **Access Admin Dashboard**
   - Click the "🔐 Admin Panel" button in the top-right header
   - View system statistics
   - Manage users
   - Create new accounts

2. **Manage All Farm Operations**
   - Goats
   - Breeding records
   - Kid growth tracking
   - Health records
   - Vaccinations
   - Feeding schedules
   - Sales (breeding & meat)
   - Expenses
   - Monthly summaries

3. **Create New Users**
   - Go to Admin Panel
   - Click "+ Add User"
   - Fill in details:
     - Email
     - Password
     - Full Name
     - Role (Admin/Manager/Staff/Viewer)
   - Click "Add User"

4. **Manage Existing Users**
   - View all users in the table
   - Toggle active/inactive status (🔒/🔓 buttons)
   - Delete users (🗑️ button)
   - See last login times

---

## Common Tasks

### Change Your Password
1. Login with default credentials
2. Click your name in top-right
3. Select "Change Password"
4. Enter old password: `Admin123!`
5. Enter new password (min 6 characters)
6. Click "Change Password"

### Add a Staff Member
1. Go to Admin Panel
2. Click "+ Add User"
3. Enter their details:
   ```
   Email: staff@hannan.com
   Password: Staff123!
   Full Name: John Doe
   Role: Staff
   ```
4. Click "Add User"
5. Share credentials with them (tell them to change password)

### Logout
- Click the "🚪 Logout" button in top-right header

---

## Troubleshooting

### "Access denied. No token provided."
- You need to login first
- Token may have expired (24 hours)
- Clear browser cache and login again

### "Too many login attempts"
- Wait 15 minutes
- Rate limiter prevents brute force attacks

### Backend not starting?
- Check if port 1230 is already in use
- Kill other node processes: `Get-Process node | Stop-Process -Force`
- Try again

### Frontend showing blank page?
- Check browser console (F12)
- Verify backend is running
- Check `.env` file has `VITE_API_URL=http://localhost:1230`

### Can't see admin panel button?
- Only admins see this button
- Check your role in the user info display
- Login with admin@hannan.com to access

---

## User Roles Explained

### 🔴 Admin
- **Full Access** to everything
- Can manage all users
- Can see admin dashboard
- Can perform all operations

### 🔵 Manager
- Can access all farm operations
- Cannot manage users
- Cannot see admin dashboard
- Can perform all farm tasks

### 🟢 Staff
- Can perform daily tasks
- Record data entry
- View records
- Limited edit permissions

### ⚪ Viewer
- **Read-only** access
- Can view all data
- Cannot add, edit, or delete
- Perfect for accountants, analysts

---

## Mobile Access

The system is fully responsive and works on:
- 📱 Smartphones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktops

Just open **http://localhost:2340** on any device connected to the same network.

For devices on different network:
1. Find your computer's IP address
2. Replace `localhost` with your IP
3. Example: `http://192.168.1.100:2340`

---

## Important Security Reminders

⚠️ **CHANGE DEFAULT PASSWORD IMMEDIATELY**

⚠️ **Don't share your credentials**

⚠️ **Logout when done** (especially on shared devices)

⚠️ **Use strong passwords** (min 8 characters, mixed case, numbers, symbols)

⚠️ **Review user access regularly** (deactivate users who shouldn't have access)

---

## Need Help?

Check these files for more details:
- `SECURITY_IMPLEMENTATION.md` - Complete security documentation
- `PROFESSIONAL_REVIEW.md` - System analysis and recommendations
- `ACTION_PLAN.md` - Future development roadmap

---

## System URLs

- **Frontend**: http://localhost:2340
- **Backend API**: http://localhost:1230/api
- **Health Check**: http://localhost:1230/api/health
- **Login Endpoint**: http://localhost:1230/api/auth/login

---

*Happy Farming! 🐐🌾*
