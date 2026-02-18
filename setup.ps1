# Quick Start Script for Hannan Agribusiness Limited
# PowerShell script to set up and run the application

Write-Host "========================================" -ForegroundColor Green
Write-Host "Hannan Agribusiness Limited - Quick Start" -ForegroundColor Green
Write-Host "Goat Management System Setup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking prerequisites..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    $nodeVersion = node --version
    Write-Host "✓ Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "✗ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if PostgreSQL is installed
if (Get-Command psql -ErrorAction SilentlyContinue) {
    $pgVersion = psql --version
    Write-Host "✓ PostgreSQL is installed: $pgVersion" -ForegroundColor Green
} else {
    Write-Host "⚠ PostgreSQL check skipped (psql not in PATH)" -ForegroundColor Yellow
    Write-Host "Make sure PostgreSQL is installed and running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 1: Backend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# Backend setup
Set-Location -Path "backend"

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Backend installation failed!" -ForegroundColor Red
        exit 1
    }
    Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Backend dependencies already installed" -ForegroundColor Green
}

# Check for .env file
if (-Not (Test-Path ".env")) {
    Write-Host ""
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠ IMPORTANT: Edit backend/.env with your PostgreSQL credentials!" -ForegroundColor Yellow
    Write-Host "  Default values:" -ForegroundColor Yellow
    Write-Host "  - DB_HOST=localhost" -ForegroundColor Yellow
    Write-Host "  - DB_PORT=5432" -ForegroundColor Yellow
    Write-Host "  - DB_NAME=hannan_agribusiness" -ForegroundColor Yellow
    Write-Host "  - DB_USER=postgres" -ForegroundColor Yellow
    Write-Host "  - DB_PASSWORD=your_password_here" -ForegroundColor Yellow
    Write-Host ""
    
    $continue = Read-Host "Have you configured PostgreSQL? (Press Enter to continue or Ctrl+C to exit)"
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 2: Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Write-Host "Setting up database tables..." -ForegroundColor Yellow
npm run db:setup
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Database tables created successfully" -ForegroundColor Green
} else {
    Write-Host "✗ Database setup failed!" -ForegroundColor Red
    Write-Host "Please check:" -ForegroundColor Yellow
    Write-Host "  1. PostgreSQL is running" -ForegroundColor Yellow
    Write-Host "  2. Database 'hannan_agribusiness' exists" -ForegroundColor Yellow
    Write-Host "  3. Credentials in .env are correct" -ForegroundColor Yellow
    Set-Location -Path ".."
    exit 1
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Step 3: Frontend Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

Set-Location -Path "frontend"

if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
        Set-Location -Path ".."
        exit 1
    }
    Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✓ Frontend dependencies already installed" -ForegroundColor Green
}

Set-Location -Path ".."

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✓ Setup Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Start Backend (in one terminal):" -ForegroundColor Yellow
Write-Host "   cd backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "2. Start Frontend (in another terminal):" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor Green
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor Green
Write-Host "  API Docs: See API_DOCUMENTATION.md" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Happy Goat Management! 🐐" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
