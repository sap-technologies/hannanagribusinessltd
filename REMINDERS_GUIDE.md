# 🔔 Reminders System Guide

## How Reminders Work

The reminder system works in two ways:

### 1️⃣ **Automatic Reminders** (System-Generated)
The system **automatically generates reminders** based on farm data. It doesn't require manual creation.

### 2️⃣ **Manual Reminders** (User-Created)
Users can set **custom reminders** when creating vaccination, breeding, or health records.

---

## 🤖 Automatic Reminders

### 🎯 What Gets Auto-Generated:

| Type | Trigger | When |
|------|---------|------|
| **💉 Vaccination** | Next vaccination due date | Within 7 days |
| **🐐 Breeding** | Expected kidding date | Within 30 days |
| **🏥 Health** | Ongoing treatments | Every 7 days follow-up |

### 📊 How It Works:

1. **Data Collection**: System scans your farm records
2. **Rule Checking**: Applies time-based rules
3. **Reminder Creation**: Creates reminders in database
4. **Notification**: Sends notifications to users

---

## 🐛 Fixing the 500 Error

The error occurs because:
1. Column names in code didn't match database schema
2. Notification types weren't all registered in database

### ✅ Solution (2 Steps):

#### Step 1: Run Migration (Fix Notification Types)
```powershell
cd backend
node database/update-notification-types.js
```

This expands allowed notification types to include: `system`, `goat`, `sale`, `expense`, `report`, `farm`, etc.

#### Step 2: Restart Server
```powershell
npm start
```

---

## 👤 Manual Reminders

### ✨ New Feature: Set Your Own Reminders!

When creating **vaccination**, **breeding**, or **health records**, you can now set custom reminders for follow-ups.

### 📝 How to Use:

**Step 1:** Fill out the record form (vaccination, breeding, or health)

**Step 2:** Scroll to the bottom - you'll see a reminder section:
- **Vaccination Form**: 🔔 "Set a reminder for this vaccination"
- **Breeding Form**: 🔔 "Set a reminder for expected kidding"
- **Health Form**: 🔔 "Set a follow-up reminder"

**Step 3:** Check the box to enable the reminder

**Step 4:** Select when you want to be reminded (any future date)

**Step 5:** (Optional) Add a custom note:
- "Check vaccination effectiveness"
- "Prepare birthing area"
- "Verify treatment progress"

**Step 6:** Submit the form - reminder is automatically created!

### 🎁 Benefits:

✅ **Flexible scheduling** - Set reminders for any date you choose  
✅ **Custom notes** - Add context so you remember why  
✅ **No extra steps** - Create reminder while creating the record  
✅ **Works alongside auto-reminders** - Both systems work together  
✅ **Smart duplicate prevention** - Won't create duplicates  

### 📋 Use Cases:

**Vaccination Reminders:**
- Follow-up check 2 weeks after vaccination
- Verify no adverse reactions
- Remind to check immunity levels

**Breeding Reminders:**
- Ultrasound appointment before kidding
- Prepare birthing supplies 1 week before
- Nutritional supplement reminder

**Health Reminders:**
- Re-examine wound after 3 days
- Check treatment effectiveness after 1 week
- Schedule vet follow-up visit

### 🔍 Where to View Your Reminders:

All reminders (automatic + manual) appear in:
1. **Reminders Page** - Full list with filtering
2. **Dashboard** - Upcoming reminders widget
3. **Notifications** - Get notified on reminder date

---

## 🎮 Using Reminders

### For Managers/Admins:

**Option 1: Via RemindersPage**
1. Go to **Reminders** page
2. Click **"Run Daily Checks"** button
3. System scans all records and creates reminders

**Option 2: Via API**
```javascript
// Run all checks at once
POST /api/reminders/daily-checks

// Or run specific checks
POST /api/reminders/check-vaccinations
POST /api/reminders/check-breeding
POST /api/reminders/check-health
```

### What You'll Get:

**Vaccination Reminders:**
- "Vaccine due for goat F001"
- "Next Deworming deworming due"
- Priority: HIGH

**Breeding Reminders:**
- "Kidding expected for doe F002"
- "Pregnancy check and preparation needed"
- Priority: MEDIUM

**Health Reminders:**
- "Health follow-up for goat M003"
- "Check recovery status"
- Priority: HIGH

---

## 📅 Recommended Schedule

### Daily (Automated Cron Job):
```javascript
// Add to server.js or create a cron job
import reminderService from './services/reminderService.js';

// Run every day at 6 AM
cron.schedule('0 6 * * *', async () => {
  await reminderService.runDailyReminderChecks();
});
```

### Manual Trigger:
- Before major farm activities
- Weekly reviews
- Monthly planning sessions

---

## 🔍 Example Workflow

### Scenario: Vaccination Due

1. **Day 1**: Goat vaccinated, next_due_date set to +30 days
2. **Day 23**: Daily checks run (7 days before due)
3. **Reminder Created**: "Vaccine due for goat F001"
4. **Notification Sent**: All users get notification
5. **Action**: Staff vaccinates goat
6. **Complete**: Mark reminder as completed

### Scenario: Expected Kidding

1. **Day 1**: Doe bred, expected_kidding_date set to +150 days
2. **Day 120**: Daily checks run (30 days before kidding)
3. **Reminder Created**: "Kidding expected for doe F002"
4. **Preparation**: Prepare birthing area
5. **Monitoring**: Check doe daily
6. **Complete**: After kidding, mark completed

---

## 🛠️ Troubleshooting

### No Reminders Generated?
✓ Check if you have:
- Vaccination records with `next_due_date` set
- Breeding records with `expected_kidding_date` set
- Health records with ongoing recovery status

### Still Getting 500 Error?
1. Check server logs: `npm run dev`
2. Verify tables exist:
   ```sql
   SELECT * FROM reminders;
   SELECT * FROM notifications;
   ```
3. Re-run migrations:
   ```powershell
   node backend/database/create-notifications.js
   node backend/database/update-notification-types.js
   ```

### Duplicate Reminders?
The system automatically prevents duplicates by checking:
- Same type + reference_id + not completed = skip

---

## 📊 Database Structure

### reminders table:
```sql
- reminder_id (PK)
- type (vaccination|breeding|health_checkup)
- reference_id (links to original record)
- reminder_date (when to remind)
- title
- description
- is_completed (boolean)
- notification_sent (boolean)
```

### Example Query:
```sql
-- Get all active vaccination reminders
SELECT * FROM reminders 
WHERE type = 'vaccination' 
AND is_completed = false 
ORDER BY reminder_date ASC;
```

---

## 🎯 Best Practices

1. **Run Daily Checks Daily** - Consistency is key
2. **Complete Reminders** - Mark as done after action taken
3. **Set Next Due Dates** - Always set next dates for vaccinations
4. **Monitor Health Status** - Update recovery status regularly
5. **Plan Kidding Dates** - Calculate expected dates accurately

---

## 🚀 Future Enhancements

Potential improvements:
- ⏰ Automated cron job (built-in)
- 📧 Email notifications
- 📱 SMS alerts for urgent items
- 📊 Reminder analytics dashboard
- 🎯 Custom reminder rules per user
