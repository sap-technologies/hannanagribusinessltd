# Hannan Agribusiness Limited - Business Management System

A comprehensive management platform for Hannan Agribusiness operations including goat breeding farm, matooke cultivation, and coffee production projects.

## What This Does

This is a full-stack business management system built specifically for Hannan Agribusiness Limited. It handles:

- **Breeding Farm**: Complete goat inventory, breeding records, health tracking, feeding schedules, vaccination records, sales, and expenses
- **Matooke Project**: Banana farming operations and production management
- **Coffee Project**: Coffee cultivation tracking and production analytics

The system provides real-time monitoring, automated notifications, comprehensive reporting, and data export capabilities.

## Tech Stack

- **Frontend**: React 18.2 + Vite (fast development builds)
- **Backend**: Node.js + Express (REST API)
- **Database**: PostgreSQL (via Supabase)
- **Storage**: Supabase Storage (image uploads)
- **Auth**: JWT-based authentication with bcrypt password hashing
- **Architecture**: MVP pattern (Model-View-Presenter)

## Quick Start

### What You Need
- Node.js 18+ installed
- Access to the Supabase database (credentials in .env)
- npm or yarn package manager

### Running Locally

**Backend** (runs on port 1230):
```bash
cd backend
npm install
npm run dev
```

**Frontend** (runs on port 2340):
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:2340 in your browser. Default login credentials are in the database.

## Main Features

### Breeding Farm Management
- Comprehensive goat inventory with photos
- Parent-child relationships (breeding records)
- Health monitoring and vaccination schedules
- Feeding records with cost tracking
- Kid growth tracking from birth
- Sales management (breeding stock and meat goats)
- Monthly financial summaries
