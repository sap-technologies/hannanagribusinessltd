# Logo Setup Instructions

## Frontend Logo
The logo is already configured in the frontend at:
- **Location**: `frontend/src/assets/logo.png`
- **Used in**: 
  - Login page
  - Main app header (AppWithAuth)
  - Navigation component

## Backend Logo for PDF Reports
To add the logo to PDF reports, you need to copy the logo image to the backend:

### Steps:
1. Copy the logo file from `frontend/src/assets/logo.png`
2. Paste it to `backend/assets/logo.png`

### PowerShell Command:
```powershell
Copy-Item "c:\Users\SAP\OneDrive\Desktop\hannan-agribusiness-limited\frontend\src\assets\logo.png" "c:\Users\SAP\OneDrive\Desktop\hannan-agribusiness-limited\backend\assets\logo.png"
```

### Why is this needed?
The backend PDF generation service (`backend/services/reportService.js`) will automatically include the logo at the top of all generated PDF reports if the logo file exists at `backend/assets/logo.png`.

If the logo file doesn't exist, the PDFs will still generate successfully but without the logo image.

## Logo Features Implemented:

### Frontend:
✅ Logo in Login page (100px height)
✅ Logo in App header (45px height)
✅ Logo in Navigation component (55px height)

### Backend (PDF Reports):
✅ Logo in Monthly Summary PDF
✅ Logo in Goats Inventory PDF
✅ Logo in Health Summary PDF
✅ Logo in Sales Summary PDF

All PDF reports now include:
- Professional header with logo (60x60px)
- Company name in branded colors
- Professional footer with timestamp
- Consistent branding across all documents

## Logo Specifications:
- Format: PNG with transparent background
- Recommended size: At least 200x200px for quality
- Current usage sizes:
  - Frontend: 45-100px height (auto width)
  - Backend PDFs: 60x60px (centered)
