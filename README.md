# Hannan Agribusiness Limited - Goat Management System

A comprehensive goat breeding farm management system for tracking and managing goat inventory.

## Project Overview

This application helps Hannan Breeding Farm to:
- Register and track goats with detailed information
- Manage breeding records (mother/father relationships)
- Monitor goat production and status
- Maintain comprehensive goat database

## Tech Stack

- **Frontend**: React with Vite
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Architecture**: MVP (Model-View-Presenter)

## Project Structure

```
hannan-agribusiness-limited/
├── backend/          # Node.js API server
├── frontend/         # React application
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

### Backend Setup
```bash
cd backend
npm install
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Features

- Goat Registration with comprehensive details
- Parent tracking (Mother/Father IDs)
- Weight monitoring
- Status management
- Production type categorization
- Source tracking
- Detailed remarks system

## Goat Data Fields

- Goat ID
- Breed
- Sex
- Date of Birth
- Production Type
- Source
- Mother ID
- Father ID
- Status
- Weight
- Remarks
