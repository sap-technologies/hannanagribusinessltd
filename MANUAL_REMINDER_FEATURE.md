# Manual Reminder Feature

## Overview
Users can now set custom reminders when creating vaccination, breeding, and health records. This feature allows staff to be notified on specific dates about follow-ups, checkups, or other important events related to farm records.

## How It Works

### Backend Implementation

#### 1. Reminder Service (`backend/services/reminderService.js`)
Added `createManualReminder()` method that:
- **Validates** required fields (type, referenceId, referenceTable, reminderDate)
- **Checks for duplicates** to prevent multiple reminders for the same record
- **Auto-generates** title and description if not provided
- **Creates** the reminder in the database
- **Returns** the created reminder object

**Parameters:**
```javascript
{
  type: 'vaccination' | 'breeding' | 'health_checkup',
  referenceId: number,           // ID of the vaccination/breeding/health record
  referenceTable: string,         // 'vaccination_records' | 'breeding_records' | 'health_records'
  reminderDate: string,           // ISO date string
  title: string (optional),       // Auto-generated if not provided
  description: string (optional), // Auto-generated if not provided
  goatId: string (optional)       // Used in auto-generated title
}
```

#### 2. Presenter Integration
Updated three presenters to handle reminder creation:

**VaccinationPresenter.js:**
```javascript
// After creating vaccination record:
if (recordData.setReminder && recordData.reminderDate) {
  await reminderService.createManualReminder({
    type: 'vaccination',
    referenceId: record.vaccination_id,
    referenceTable: 'vaccination_records',
    reminderDate: recordData.reminderDate,
    title: recordData.reminderTitle,
    description: recordData.reminderDescription,
    goatId: recordData.goat_id
  });
}
```

**BreedingPresenter.js:**
- Type: `'breeding'`
- Reference table: `'breeding_records'`
- Reference ID: `breeding_id`
- Goat ID: `doe_id`

**HealthPresenter.js:**
- Type: `'health_checkup'`
- Reference table: `'health_records'`
- Reference ID: `health_id`
- Goat ID: `goat_id`

### Frontend Implementation

#### Form Updates
Added reminder fields to three forms:

**1. VaccinationForm.jsx**
- Label: "🔔 Set a reminder for this vaccination"
- Placeholder: "e.g., Check vaccination effectiveness"

**2. BreedingForm.jsx**
- Label: "🔔 Set a reminder for expected kidding"
- Placeholder: "e.g., Check doe condition before kidding"

**3. HealthForm.jsx**
- Label: "🔔 Set a follow-up reminder"
- Placeholder: "e.g., Check recovery progress"

#### UI Components
Each form now includes:
1. **Checkbox**: "Set a reminder" (optional)
2. **Date Input**: Shows when checkbox is checked (required if reminder is enabled)
3. **Text Input**: Optional reminder note/description

**Visual Design:**
- Light gray background container (`#f8f9fa`)
- Border with rounded corners
- Conditional display (fields only show when checkbox is checked)
- Responsive layout matching existing forms

#### Form State
Added to `formData`:
```javascript
{
  ...existingFields,
  setReminder: false,          // Boolean - whether reminder is enabled
  reminderDate: '',            // String - date for the reminder
  reminderDescription: ''      // String - optional note
}
```

## User Flow

### Creating a Record with Reminder

1. **Fill out the main record form** (vaccination, breeding, or health)
2. **Check the reminder checkbox** at the bottom of the form
3. **Select a reminder date** (when you want to be reminded)
4. **Optionally add a note** (e.g., "Check if vaccination was effective")
5. **Submit the form**

### What Happens Next

1. **Record is created** in the database
2. **Reminder is automatically created** and linked to the record
3. **System tracks the reminder** until the reminder date arrives
4. **Users are notified** on the reminder date via the Reminders page
5. **Reminder can be marked complete** from the Reminders page

## Data Flow

```
User fills form → Frontend Form Component
                     ↓
                  formData with reminder fields
                     ↓
                  onSubmit() → API call
                     ↓
                  Backend Route → Presenter
                     ↓
                  Presenter creates record
                     ↓
              IF setReminder === true:
                     ↓
              reminderService.createManualReminder()
                     ↓
              Reminder saved to database
                     ↓
              Success response to frontend
```

## Reminder Types

- **Vaccination**: Reminds about follow-up checks or next due dates
- **Breeding**: Reminds about expected kidding dates or breeding follow-ups
- **Health Checkup**: Reminds about treatment follow-ups or recovery checks

## Database Structure

Reminders are stored in the `reminders` table with:
- `reminder_id` - Unique identifier
- `type` - vaccination, breeding, or health_checkup
- `reference_id` - Links to the original record
- `reference_table` - Which table the record is in
- `reminder_date` - When to remind the user
- `title` - Auto-generated or custom title
- `description` - Auto-generated or custom description
- `is_completed` - Tracks if reminder was addressed
- `notification_sent` - Tracks if notification was sent

## Features

✅ **Optional** - Users can skip setting reminders  
✅ **Flexible dates** - Any future date can be selected  
✅ **Custom notes** - Add context to reminders  
✅ **Duplicate prevention** - System checks for existing reminders  
✅ **Auto-generation** - Title/description created automatically if not provided  
✅ **Error handling** - Reminder failures don't prevent record creation  
✅ **Consistent UI** - Matches existing form design patterns  

## Benefits

- **Better follow-up tracking** - Never miss important checkups
- **User empowerment** - Staff control their own reminders
- **Complements auto-reminders** - Works alongside system-generated reminders
- **Flexible scheduling** - Set reminders for any date
- **Context preservation** - Add notes to remember why reminder was set

## Next Steps (Optional Enhancements)

- [ ] Add reminder editing after record creation
- [ ] Allow multiple reminders per record
- [ ] Add email notifications for reminders
- [ ] Show reminder count on dashboard
- [ ] Add bulk reminder creation
- [ ] Export reminders to calendar apps
