# System Testing Guide with Test Data

## Overview
This guide will help you verify that all breeding farm features are working correctly using the comprehensive test data provided.

## Prerequisites

1. **Backend running**: `cd backend && npm start`
2. **Frontend running**: `cd frontend && npm run dev`
3. **Database connected**: Supabase credentials in `backend/.env`
4. **User account**: Login with your registered credentials

## Loading Test Data

### Option 1: Using Node.js (Recommended)
```powershell
node backend/database/load-test-data.js
```

### Option 2: Using PowerShell Script
```powershell
.\load-test-data.ps1
```

### Option 3: Supabase Dashboard
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Open `backend/database/test-data.sql`
4. Copy and paste the contents
5. Click "Run"

## Test Data Summary

The test data includes:

- **14 Goats**: 7 Females, 4 Males, 3 Kids
- **6 Breeding Records**: Including pregnant does and completed kidding
- **7 Health Records**: Various treatments and outcomes
- **15 Vaccination Records**: CDT, Rabies, Deworming
- **20+ Feeding Records**: Daily and historical data
- **4 Breeding Sales**: Live goat sales to other farms
- **5 Meat Sales**: Goats sold for meat processing
- **23 Growth Records**: Tracking kid development from birth
- **22 Expense Records**: All categories (feed, medical, labor, etc.)

## Feature Testing Checklist

### 1. Navigation & UI

#### Back Button
- [ ] Navigate to Breeding Farm from Dashboard
- [ ] Verify "← Dashboard" button appears in sidebar
- [ ] Click back button
- [ ] Confirm you return to Dashboard
- [ ] **Expected**: Smooth navigation, no errors

#### Module Tabs
- [ ] Click different breeding farm modules (Goat Registry, Breeding, etc.)
- [ ] Verify each module shows data list first (not form)
- [ ] Confirm "Add New" button appears at top
- [ ] **Expected**: 10 modules accessible, forms hidden by default

### 2. Goat Registry

#### View Goats
- [ ] Click "Goat Registry" tab
- [ ] Verify you see 14 goats in the list
- [ ] Check that goats display: ID, Breed, Sex, Age, Status
- [ ] **Expected**: F001, F002, M001, M002, K001, K002, K003, etc.

#### View Goat Details
- [ ] Click "View" on any goat (try F001)
- [ ] Verify modal shows complete information
- [ ] Check if photo placeholder appears (since test data has no photos)
- [ ] Verify mother/father information displays for kids (K001, K002)
- [ ] Click "Close" button or X to close modal
- [ ] **Expected**: Modal displays all goat data, closes properly

#### Add New Goat
- [ ] Click "Add New Goat" button
- [ ] Verify form appears below button
- [ ] Upload a test photo (optional)
- [ ] Check photo preview appears
- [ ] Select mother from dropdown (should show female goats: F001, F002, etc.)
- [ ] Select father from dropdown (should show male goats: M001, M002, etc.)
- [ ] Fill in all fields and submit
- [ ] **Expected**: Form appears, photo upload works, parent dropdowns filtered by sex, goat saved successfully

#### Dropdown Integration
- [ ] After saving new goat, immediately go to Breeding tab
- [ ] Click "Add New Breeding Record"
- [ ] Check doe/buck dropdowns
- [ ] **Expected**: Newly added goat appears in appropriate dropdown (no page refresh needed)

### 3. Breeding Records

#### View Records
- [ ] Click "Breeding" tab
- [ ] Verify 6 breeding records appear
- [ ] Check statuses: Success, Pregnant, Pending
- [ ] **Expected**: Records show doe, buck, dates, outcomes

#### View Details
- [ ] Click "View" on completed breeding (F001 + M001)
- [ ] Verify expected kidding vs actual kidding dates
- [ ] Check kid details (K001, K002 mentioned)
- [ ] **Expected**: Complete breeding information displayed

#### Add New Breeding
- [ ] Click "Add New Breeding Record"
- [ ] Verify form has dropdowns (not text inputs)
- [ ] Select doe from dropdown (should only show females: F001, F002, F003, F004, F007)
- [ ] Select buck from dropdown (should only show males: M001, M002, M003)
- [ ] **Expected**: Dropdowns filtered by sex, active status

### 4. Health Records

#### View Records
- [ ] Click "Health & Treatment" tab
- [ ] Verify 7 health records appear
- [ ] Check various diagnoses: Routine checkup, Hoof infection, Mastitis
- [ ] **Expected**: Records show goat ID, diagnosis, vet, cost, outcome

#### View Details
- [ ] Click "View" on any health record
- [ ] Verify treatment details, dates, costs
- [ ] Check follow-up dates and notes
- [ ] **Expected**: Complete health history displayed

#### Add New Health Record
- [ ] Click "Add New Health Record"
- [ ] Verify goat selection is dropdown
- [ ] Should show all active goats with ID, breed, sex
- [ ] Select a goat and fill form
- [ ] **Expected**: Dropdown shows comprehensive goat info

### 5. Vaccination Records

#### View Records
- [ ] Click "Vaccination" tab
- [ ] Verify 15 vaccination records appear
- [ ] Check vaccine types: CDT, Rabies, Dewormer
- [ ] Note next due dates (color coding if implemented)
- [ ] **Expected**: Complete vaccination schedule visible

#### View Details
- [ ] Click "View" on any vaccination
- [ ] Check batch number, administrator, cost
- [ ] Verify next due date calculation
- [ ] **Expected**: Full vaccination details displayed

#### Add New Vaccination
- [ ] Click "Add New Vaccination"
- [ ] Verify goat dropdown available
- [ ] Fill in vaccine details
- [ ] **Expected**: Easy goat selection, record saved

### 6. Feeding Records

#### View Records
- [ ] Click "Feeding" tab
- [ ] Verify 20+ feeding records appear
- [ ] Check different feed types: Hay, Grain mix, Milk replacer
- [ ] Note daily entries
- [ ] **Expected**: Comprehensive feeding history

#### Today's Feeding
- [ ] Look for today's date entries
- [ ] Verify F001, F002, M001, K001, K002, K003 fed today
- [ ] **Expected**: Current date feeding records present

#### Add New Feeding Record
- [ ] Click "Add New Feeding"
- [ ] Verify goat dropdown works
- [ ] Add feeding record for tomorrow's date
- [ ] **Expected**: Form works, record saved

### 7. Sales - Breeding

#### View Sales
- [ ] Click "Sales - Breeding" tab
- [ ] Verify 4 sales records
- [ ] Check buyers: Green Valley Farms, Sunrise Goat Ranch
- [ ] Note sale prices (UGX 380,000 - 550,000)
- [ ] **Expected**: Complete sales history with buyer info

#### View Details
- [ ] Click "View" on any sale
- [ ] Verify goat details, buyer contact, payment method
- [ ] Check delivery method
- [ ] **Expected**: Full transaction details displayed

#### Add New Sale
- [ ] Click "Add New Breeding Sale"
- [ ] Verify goat dropdown (should show active goats)
- [ ] Fill in buyer and price info
- [ ] **Expected**: Goat selected from dropdown, sale recorded

### 8. Sales - Meat

#### View Sales
- [ ] Click "Sales - Meat" tab
- [ ] Verify 5 meat sales
- [ ] Check weight and price per kg
- [ ] Calculate total prices
- [ ] **Expected**: Meat sales with weight-based pricing

#### View Details
- [ ] Click "View" on any meat sale
- [ ] Verify buyer information
- [ ] Check quality notes
- [ ] **Expected**: Complete meat sale details

#### Add New Sale
- [ ] Click "Add New Meat Sale"
- [ ] Verify goat dropdown
- [ ] Enter weight and price per kg
- [ ] **Expected**: Auto-calculate total price

### 9. Kid Growth Tracking

#### View Growth Records
- [ ] Click "Kid Growth" tab
- [ ] Verify 23 growth records
- [ ] Check progression for K001, K002, K003
- [ ] Note weekly weight increases
- [ ] **Expected**: Detailed growth progression visible

#### View Growth Chart
- [ ] Select a kid (K001)
- [ ] If graphs/charts implemented, verify growth curve
- [ ] Check weight progression: 3.2kg → 12.5kg
- [ ] **Expected**: Visual growth representation (if implemented)

#### Add New Measurement
- [ ] Click "Add New Growth Record"
- [ ] Verify kid dropdown (should show only kids)
- [ ] Add new weight and height
- [ ] **Expected**: New measurement saved, progression updated

### 10. Expenses

#### View Expenses
- [ ] Click "Expenses" tab
- [ ] Verify 22 expense records
- [ ] Check categories: Feed, Medical, Labor, Infrastructure
- [ ] Note amounts and payment methods
- [ ] **Expected**: Complete expense tracking

#### Category Breakdown
- [ ] Verify different expense categories
- [ ] Feed: Hay, Grain, Supplements (largest category)
- [ ] Medical: Vet fees, medications, vaccines
- [ ] Labor: Staff salaries
- [ ] Infrastructure: Fence repair, shelter maintenance
- [ ] Utilities: Electricity, Water
- [ ] **Expected**: All expense types represented

#### View Details
- [ ] Click "View" on any expense
- [ ] Check receipt number, payment method
- [ ] Verify payee information
- [ ] **Expected**: Full expense details displayed

#### Add New Expense
- [ ] Click "Add New Expense"
- [ ] Select category from dropdown
- [ ] Enter expense details
- [ ] **Expected**: Expense recorded properly

### 11. Monthly Summary

#### View Summary
- [ ] Click "Monthly Summary" tab
- [ ] Verify data aggregation from all modules
- [ ] Check current month statistics
- [ ] **Expected**: Summary combines data from goats, sales, expenses

#### Export Functionality
- [ ] If export button exists, click it
- [ ] Verify Excel/PDF generation
- [ ] **Expected**: Summary export works

### 12. Search & Filter

#### Global Search (if implemented)
- [ ] Use search bar to find "F001"
- [ ] Verify appears in multiple modules (goat, breeding, health, feeding)
- [ ] **Expected**: Cross-module search works

#### Date Filters
- [ ] Apply date range filter (last 30 days)
- [ ] Verify records filtered correctly
- [ ] **Expected**: Date filtering works across modules

### 13. Photo Upload Integration

#### Upload Photo for Existing Goat
- [ ] Go to Goat Registry
- [ ] Click "Edit" on F001 (or any goat)
- [ ] Upload a photo (test with JPG, PNG - under 5MB)
- [ ] Verify preview appears
- [ ] Save changes
- [ ] **Expected**: Photo uploads, compresses, saves, displays

#### View Photo in Details
- [ ] Click "View" on goat with photo
- [ ] Verify photo displays in modal
- [ ] Check photo loads properly
- [ ] **Expected**: Photo visible, no broken images

#### Optional Photo for New Goat
- [ ] Add new goat WITHOUT photo
- [ ] Verify "(Optional)" label visible
- [ ] Submit without photo
- [ ] **Expected**: Goat saves successfully without photo

### 14. User Management (Admin Only)

#### Admin Dashboard
- [ ] If admin user, click "Admin" in navigation
- [ ] Verify user registration form
- [ ] Create test user account
- [ ] **Expected**: New user registered successfully

## Known Test Data Details

### Goat Families
- **F001 (Boer doe)** + **M001 (Boer buck)** = **K001 & K002** (twins, born Jan 5)
- **F002 (Saanen doe)** + **M002 (Saanen buck)** = **K003** (born Feb 10)
- **F003** is daughter of F001 & M001
- **F005** is daughter of F002 & M002
- **F007** is daughter of F002 & M001

### Current Pregnancies
- **F003** bred with **M001** on Jan 20, due Jun 15
- **F004** bred with **M002** on Dec 5 (AI), due May 1

### Deceased/Sold
- **M004** - Deceased (natural causes)
- **F006** - Sold to another farm

### Growth Tracking
- **K001**: Born 3.2kg → now 12.5kg (8 weeks old)
- **K002**: Born 3.0kg → now 11.8kg (twin, 8 weeks old)
- **K003**: Born 3.5kg → now 10.5kg (4 weeks old)

## Reporting Issues

If you encounter any problems during testing:

1. **Note the module** where error occurred
2. **Describe the action** you were performing
3. **Copy any error messages** from browser console (F12)
4. **Check backend logs** for server errors
5. **Verify test data** loaded correctly (run count queries)

## Expected Outcomes Summary

✅ **All forms hidden by default** - Data lists shown first
✅ **Add buttons work** - Forms appear when clicked
✅ **Back button works** - Returns to dashboard
✅ **Dropdowns populated** - No text inputs for goat IDs
✅ **Sex filtering** - Females in doe dropdown, males in buck dropdown
✅ **Real-time updates** - New goats appear immediately in dropdowns
✅ **Photo upload works** - Preview, validation, compression
✅ **Photos optional** - Goats save without photos
✅ **All details views work** - Modals display complete info
✅ **Close buttons work** - Exit modals and forms
✅ **Data relationships** - Parents linked to kids correctly

## Success Criteria

Your testing is successful when:

- ✅ All 10 breeding farm modules accessible
- ✅ Test data visible in all modules
- ✅ Forms appear only after clicking Add button
- ✅ All dropdowns show appropriate goats
- ✅ Photo upload and preview working
- ✅ Back button navigates correctly
- ✅ Details modals display complete information
- ✅ New records save successfully
- ✅ No console errors
- ✅ System feels responsive and intuitive

## Next Steps After Testing

1. **Clear test data** (if needed): Run clean-db script
2. **Add real farm data**: Start with real goats
3. **Train users**: Show how to use each module
4. **Monitor performance**: Check for slow queries
5. **Backup regularly**: Set up automatic backups

---

**Happy Testing! 🎉**

For issues or questions, check the README.md or ACTION_PLAN.md documents.
