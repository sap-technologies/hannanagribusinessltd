# Hannan Agribusiness Limited - Setup Guide

Complete setup instructions for the Goat Management System.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Verify installation: `node --version`

2. **PostgreSQL** (v14 or higher)
   - Download from: https://www.postgresql.org/download/
   - Verify installation: `psql --version`

3. **Git** (optional, for version control)
   - Download from: https://git-scm.com/

## Step-by-Step Setup

### 1. Database Setup

#### Create PostgreSQL Database

1. Open PostgreSQL command line (psql) or pgAdmin
2. Create a new database:

```sql
CREATE DATABASE hannan_agribusiness;
```

3. Create a database user (optional):

```sql
CREATE USER hannan_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE hannan_agribusiness TO hannan_user;
```

### 2. Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
copy .env.example .env
```

4. Edit the `.env` file with your database credentials:

```env
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hannan_agribusiness
DB_USER=postgres
DB_PASSWORD=your_password_here
```

5. Set up database tables:

```bash
npm run db:setup
```

You should see:
```
✅ Database tables created successfully!
✅ Indexes created successfully!
```

6. Start the backend server:

```bash
npm run dev
```

The server should start on http://localhost:5000

### 3. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

The application should open at http://localhost:3000

## Verify Installation

### Test Backend API

1. Open your browser or Postman
2. Visit: http://localhost:5000/api/health

You should see:
```json
{
  "success": true,
  "message": "Hannan Agribusiness API is running",
  "timestamp": "2026-02-09T..."
}
```

### Test Frontend

1. Open your browser
2. Visit: http://localhost:3000
3. You should see the Goat Management System dashboard

## Project Structure

```
hannan-agribusiness-limited/
│
├── backend/                      # Node.js Backend
│   ├── database/
│   │   ├── config.js            # Database connection
│   │   └── setup.js             # Database schema setup
│   ├── models/
│   │   └── GoatModel.js         # Data layer (Model)
│   ├── presenters/
│   │   └── GoatPresenter.js     # Business logic (Presenter)
│   ├── views/
│   │   └── goatRoutes.js        # API routes (View)
│   ├── .env.example             # Environment variables template
│   ├── package.json
│   └── server.js                # Express server
│
├── frontend/                     # React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── GoatForm.jsx
│   │   │   ├── GoatList.jsx
│   │   │   └── GoatDetails.jsx
│   │   ├── presenters/
│   │   │   └── GoatPresenter.js # Frontend business logic
│   │   ├── services/
│   │   │   └── api.js           # API client
│   │   ├── App.jsx              # Main application
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

## Common Issues and Solutions

### Issue: Database connection fails

**Solution:**
- Verify PostgreSQL is running
- Check credentials in `.env` file
- Ensure database `hannan_agribusiness` exists
- Try connecting with `psql -U postgres -d hannan_agribusiness`

### Issue: Port already in use

**Backend (port 5000):**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

**Frontend (port 3000):**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Issue: Module not found errors

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

## Production Deployment

### Backend

1. Build for production:
```bash
npm install --production
```

2. Set environment variables on your server

3. Use a process manager like PM2:
```bash
npm install -g pm2
pm2 start server.js --name hannan-api
```

### Frontend

1. Build for production:
```bash
npm run build
```

2. The `dist` folder contains optimized production files

3. Deploy to hosting service (Vercel, Netlify, etc.)

## Environment Variables Reference

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Backend server port | 5000 |
| DB_HOST | PostgreSQL host | localhost |
| DB_PORT | PostgreSQL port | 5432 |
| DB_NAME | Database name | hannan_agribusiness |
| DB_USER | Database username | postgres |
| DB_PASSWORD | Database password | your_password |

## Next Steps

1. ✅ Register your first goat using the form
2. ✅ Explore the search functionality
3. ✅ View goat details by clicking the eye icon
4. ✅ Edit and update goat information
5. ✅ Track offspring using mother/father IDs

## Support

For issues or questions:
- Check the API documentation: [SETUP_GUIDE.md](SETUP_GUIDE.md)
- Review error messages in browser console
- Check backend logs in terminal

## MVP Architecture Explanation

This application follows the **Model-View-Presenter (MVP)** pattern:

### Backend MVP:
- **Model** (`GoatModel.js`): Data access layer, database operations
- **View** (`goatRoutes.js`): HTTP routes and request/response handling
- **Presenter** (`GoatPresenter.js`): Business logic, validation, orchestration

### Frontend MVP:
- **Model**: API service layer (`api.js`)
- **View**: React components (UI rendering)
- **Presenter** (`GoatPresenter.js`): State management, business logic

This separation ensures:
- ✅ Clean code organization
- ✅ Easy testability
- ✅ Maintainable codebase
- ✅ Clear separation of concerns
