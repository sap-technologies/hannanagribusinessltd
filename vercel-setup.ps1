# Quick setup script for Vercel environment variable
# Run this if you have Vercel CLI installed

Write-Host "🚀 Setting up Vercel environment variable..." -ForegroundColor Cyan

# Check if Vercel CLI is installed
if (Get-Command vercel -ErrorAction SilentlyContinue) {
    Set-Location frontend
    
    # Add environment variable
    vercel env add VITE_API_URL production
    # When prompted, enter: https://hannanagribusinessltd.onrender.com
    
    # Redeploy
    Write-Host "`n📦 Redeploying to Vercel..." -ForegroundColor Green
    vercel --prod
    
    Write-Host "`n✅ Done! Your frontend should now connect to the backend." -ForegroundColor Green
} else {
    Write-Host "❌ Vercel CLI not found. Please use Option 1 (Dashboard method)" -ForegroundColor Red
    Write-Host "`nTo install Vercel CLI: npm i -g vercel" -ForegroundColor Yellow
}
