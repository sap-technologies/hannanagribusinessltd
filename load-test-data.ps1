# Load Test Data Script for Hannan Agribusiness Limited
# This script loads comprehensive test data into the database

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "Loading Test Data for Breeding Farm" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-Not (Test-Path "backend\.env")) {
    Write-Host "❌ Error: backend\.env file not found!" -ForegroundColor Red
    Write-Host "Please create backend\.env with your database credentials" -ForegroundColor Yellow
    exit 1
}

# Load environment variables
$envFile = Get-Content "backend\.env"
$dbHost = ""
$dbPort = ""
$dbName = ""
$dbUser = ""
$dbPassword = ""

foreach ($line in $envFile) {
    if ($line -match "^DB_HOST=(.+)$") { $dbHost = $matches[1] }
    if ($line -match "^DB_PORT=(.+)$") { $dbPort = $matches[1] }
    if ($line -match "^DB_NAME=(.+)$") { $dbName = $matches[1] }
    if ($line -match "^DB_USER=(.+)$") { $dbUser = $matches[1] }
    if ($line -match "^DB_PASSWORD=(.+)$") { $dbPassword = $matches[1] }
}

Write-Host "Database Configuration:" -ForegroundColor Green
Write-Host "  Host: $dbHost" -ForegroundColor Gray
Write-Host "  Port: $dbPort" -ForegroundColor Gray
Write-Host "  Database: $dbName" -ForegroundColor Gray
Write-Host "  User: $dbUser" -ForegroundColor Gray
Write-Host ""

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if (-Not $psqlPath) {
    Write-Host "⚠️  Warning: psql command not found!" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Since you're using Supabase, you have two options:" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Option 1: Run SQL in Supabase Dashboard" -ForegroundColor Green
    Write-Host "  1. Go to your Supabase project dashboard" -ForegroundColor Gray
    Write-Host "  2. Navigate to SQL Editor" -ForegroundColor Gray
    Write-Host "  3. Open this file: backend\database\test-data.sql" -ForegroundColor Gray
    Write-Host "  4. Copy and paste the SQL content" -ForegroundColor Gray
    Write-Host "  5. Click 'Run' to execute" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Option 2: Use Node.js to load data" -ForegroundColor Green
    Write-Host "  Run: node backend/database/load-test-data.js" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Creating Node.js loader script..." -ForegroundColor Cyan
    
    # Create Node.js loader script
    $nodeScript = @"
// Load Test Data using Node.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function loadTestData() {
  console.log('📊 Loading test data...');
  
  try {
    // Read the SQL file
    const sqlFile = fs.readFileSync(path.join(__dirname, 'test-data.sql'), 'utf8');
    
    // Execute the SQL
    await pool.query(sqlFile);
    
    console.log('✅ Test data loaded successfully!');
    console.log('');
    console.log('Data Summary:');
    
    // Count records
    const counts = await Promise.all([
      pool.query('SELECT COUNT(*) FROM goats'),
      pool.query('SELECT COUNT(*) FROM breeding'),
      pool.query('SELECT COUNT(*) FROM health'),
      pool.query('SELECT COUNT(*) FROM vaccination'),
      pool.query('SELECT COUNT(*) FROM feeding'),
      pool.query('SELECT COUNT(*) FROM sales_breeding'),
      pool.query('SELECT COUNT(*) FROM sales_meat'),
      pool.query('SELECT COUNT(*) FROM kid_growth'),
      pool.query('SELECT COUNT(*) FROM expenses')
    ]);
    
    console.log(`  Goats: ${counts[0].rows[0].count}`);
    console.log(`  Breeding Records: ${counts[1].rows[0].count}`);
    console.log(`  Health Records: ${counts[2].rows[0].count}`);
    console.log(`  Vaccination Records: ${counts[3].rows[0].count}`);
    console.log(`  Feeding Records: ${counts[4].rows[0].count}`);
    console.log(`  Sales (Breeding): ${counts[5].rows[0].count}`);
    console.log(`  Sales (Meat): ${counts[6].rows[0].count}`);
    console.log(`  Kid Growth Records: ${counts[7].rows[0].count}`);
    console.log(`  Expense Records: ${counts[8].rows[0].count}`);
    
  } catch (error) {
    console.error('❌ Error loading test data:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

loadTestData();
"@
    
    $nodeScript | Out-File -FilePath "backend\database\load-test-data.js" -Encoding UTF8
    Write-Host "✅ Created: backend\database\load-test-data.js" -ForegroundColor Green
    Write-Host ""
    Write-Host "Run this command to load test data:" -ForegroundColor Cyan
    Write-Host "  node backend/database/load-test-data.js" -ForegroundColor Yellow
    
} else {
    Write-Host "Found psql command. Loading test data..." -ForegroundColor Green
    Write-Host ""
    
    # Set PGPASSWORD environment variable
    $env:PGPASSWORD = $dbPassword
    
    try {
        # Execute the SQL file
        & psql -h $dbHost -p $dbPort -U $dbUser -d $dbName -f "backend\database\test-data.sql"
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Test data loaded successfully!" -ForegroundColor Green
            Write-Host ""
            Write-Host "You can now:" -ForegroundColor Cyan
            Write-Host "  • View goats in the Goat Registry" -ForegroundColor Gray
            Write-Host "  • Check breeding records" -ForegroundColor Gray
            Write-Host "  • Review health and vaccination history" -ForegroundColor Gray
            Write-Host "  • View feeding schedules" -ForegroundColor Gray
            Write-Host "  • See sales records" -ForegroundColor Gray
            Write-Host "  • Track kid growth" -ForegroundColor Gray
            Write-Host "  • Review expenses" -ForegroundColor Gray
        } else {
            Write-Host ""
            Write-Host "❌ Error loading test data" -ForegroundColor Red
            Write-Host "Please check the error messages above" -ForegroundColor Yellow
        }
    } finally {
        # Clear password from environment
        Remove-Item Env:PGPASSWORD -ErrorAction SilentlyContinue
    }
}

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
