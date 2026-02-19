import sql from '../db.js';
import notificationService from './notificationService.js';

class ReminderService {
  /**
   * Create a reminder
   */
  async createReminder(data) {
    const { type, referenceId, referenceTable, reminderDate, title, description } = data;
    
    const [reminder] = await sql`
      INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
      VALUES (${type}, ${referenceId}, ${referenceTable}, ${reminderDate}, ${title}, ${description})
      RETURNING *
    `;
    
    return reminder;
  }

  /**
   * Create a manual reminder from user input
   * This is called when users set custom reminder dates on forms
   */
  async createManualReminder(data) {
    const { 
      type, 
      referenceId, 
      referenceTable, 
      reminderDate, 
      title, 
      description,
      goatId 
    } = data;
    
    // Validate required fields
    if (!type || !referenceId || !referenceTable || !reminderDate) {
      throw new Error('Missing required reminder fields');
    }

    // Check if reminder already exists for this record
    const [existing] = await sql`
      SELECT * FROM reminders
      WHERE type = ${type}
      AND reference_id = ${referenceId}
      AND is_completed = false
    `;
    
    if (existing) {
      console.log(`Reminder already exists for ${type} #${referenceId}`);
      return existing;
    }

    // Create the reminder
    const reminder = await this.createReminder({
      type,
      referenceId,
      referenceTable,
      reminderDate,
      title: title || `Reminder for ${type} - ${goatId || `ID ${referenceId}`}`,
      description: description || `Custom reminder set by user`
    });

    console.log(`✅ Manual reminder created: ${reminder.title} on ${reminderDate}`);
    return reminder;
  }

  /**
   * Get all active reminders
   */
  async getActiveReminders() {
    return await sql`
      SELECT * FROM reminders
      WHERE is_completed = false
      AND reminder_date <= CURRENT_DATE + INTERVAL '7 days'
      ORDER BY reminder_date ASC
    `;
  }

  /**
   * Get reminders that need notifications (due today or overdue)
   */
  async getRemindersNeedingNotification() {
    return await sql`
      SELECT * FROM reminders
      WHERE is_completed = false
      AND notification_sent = false
      AND reminder_date <= CURRENT_DATE
      ORDER BY reminder_date ASC
    `;
  }

  /**
   * Mark reminder as completed
   */
  async completeReminder(reminderId) {
    const [reminder] = await sql`
      UPDATE reminders
      SET is_completed = true, completed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE reminder_id = ${reminderId}
      RETURNING *
    `;
    
    return reminder;
  }

  /**
   * Check for upcoming vaccinations and create reminders
   */
  async checkVaccinationReminders() {
    // Get vaccination records where next dose is within 7 days
    const upcomingVaccinations = await sql`
      SELECT v.*, g.goat_id
      FROM vaccination_records v
      JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.next_due_date IS NOT NULL
      AND v.next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
      AND g.status = 'Active'
    `;
    
    const reminders = [];
    for (const vac of upcomingVaccinations) {
      // Check if reminder already exists
      const [existing] = await sql`
        SELECT * FROM reminders
        WHERE type = 'vaccination'
        AND reference_id = ${vac.vaccination_id}
        AND is_completed = false
      `;
      
      if (!existing) {
        const reminder = await this.createReminder({
          type: 'vaccination',
          referenceId: vac.vaccination_id,
          referenceTable: 'vaccination_records',
          reminderDate: vac.next_due_date,
          title: `${vac.type} due for goat ${vac.goat_id}`,
          description: `Next ${vac.drug_used} ${vac.type.toLowerCase()} due`
        });
        reminders.push(reminder);
      }
    }
    
    return reminders;
  }

  /**
   * Check for breeding schedules and create reminders
   */
  async checkBreedingReminders() {
    // Get breeding records where kidding is expected within 30 days (pregnancy ~150 days)
    const upcomingBirths = await sql`
      SELECT b.*, b.doe_id as goat_id
      FROM breeding_records b
      JOIN goats g ON b.doe_id = g.goat_id
      WHERE b.actual_kidding_date IS NULL
      AND b.expected_kidding_date IS NOT NULL
      AND b.expected_kidding_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
      AND g.status = 'Active'
    `;
    
    const reminders = [];
    for (const breeding of upcomingBirths) {
      // Check if reminder already exists
      const [existing] = await sql`
        SELECT * FROM reminders
        WHERE type = 'breeding'
        AND reference_id = ${breeding.breeding_id}
        AND is_completed = false
      `;
      
      if (!existing) {
        const reminder = await this.createReminder({
          type: 'breeding',
          referenceId: breeding.breeding_id,
          referenceTable: 'breeding_records',
          reminderDate: breeding.expected_kidding_date,
          title: `Kidding expected for doe ${breeding.doe_id}`,
          description: `Pregnancy check and preparation needed for expected kidding`
        });
        reminders.push(reminder);
      }
    }
    
    return reminders;
  }

  /**
   * Check for health issues and create alerts
   */
  async checkHealthAlerts() {
    // Get recent health records with ongoing treatments or monitoring
    const ongoingTreatments = await sql`
      SELECT h.*, g.goat_id
      FROM health_records h
      JOIN goats g ON h.goat_id = g.goat_id
      WHERE h.recovery_status IN ('In Progress', 'Under Treatment', 'Monitoring')
      AND h.record_date >= CURRENT_DATE - INTERVAL '30 days'
      AND g.status = 'Active'
    `;
    
    const alerts = [];
    for (const health of ongoingTreatments) {
      const daysSinceTreatment = Math.floor((new Date() - new Date(health.record_date)) / (1000 * 60 * 60 * 24));
      
      // Send reminder for follow-up every 7 days
      if (daysSinceTreatment > 0 && daysSinceTreatment % 7 === 0) {
        const [existing] = await sql`
          SELECT * FROM reminders
          WHERE type = 'health_checkup'
          AND reference_id = ${health.health_id}
          AND reminder_date = CURRENT_DATE
        `;
        
        if (!existing) {
          const reminder = await this.createReminder({
            type: 'health_checkup',
            referenceId: health.health_id,
            referenceTable: 'health_records',
            reminderDate: new Date().toISOString().split('T')[0],
            title: `Health follow-up for goat ${health.goat_id}`,
            description: `Check recovery status: ${health.problem_observed.substring(0, 100)}...`
          });
          alerts.push(reminder);
        }
      }
    }
    
    return alerts;
  }

  /**
   * Process reminders and send notifications
   */
  async processReminders() {
    const reminders = await this.getRemindersNeedingNotification();
    
    for (const reminder of reminders) {
      try {
        // Create notification based on reminder type
        if (reminder.type === 'vaccination') {
          await notificationService.createBroadcastNotification({
            type: 'vaccination',
            title: '💉 ' + reminder.title,
            message: reminder.description,
            priority: 'high'
          });
        } else if (reminder.type === 'breeding') {
          await notificationService.createBroadcastNotification({
            type: 'breeding',
            title: '🐐 ' + reminder.title,
            message: reminder.description,
            priority: 'medium'
          });
        } else if (reminder.type === 'health_checkup') {
          await notificationService.createBroadcastNotification({
            type: 'health',
            title: '🏥 ' + reminder.title,
            message: reminder.description,
            priority: 'high'
          });
        }
        
        // Mark notification as sent
        await sql`
          UPDATE reminders
          SET notification_sent = true, updated_at = CURRENT_TIMESTAMP
          WHERE reminder_id = ${reminder.reminder_id}
        `;
        
      } catch (error) {
        console.error(`Error processing reminder ${reminder.reminder_id}:`, error);
      }
    }
    
    return reminders.length;
  }

  /**
   * Run all reminder checks (call this daily via cron or manually)
   */
  async runDailyReminderChecks() {
    console.log('🔔 Running daily reminder checks...');
    
    const vaccinations = await this.checkVaccinationReminders();
    console.log(`✅ Created ${vaccinations.length} vaccination reminders`);
    
    const breeding = await this.checkBreedingReminders();
    console.log(`✅ Created ${breeding.length} breeding reminders`);
    
    const health = await this.checkHealthAlerts();
    console.log(`✅ Created ${health.length} health alerts`);
    
    const processed = await this.processReminders();
    console.log(`✅ Processed ${processed} reminders into notifications`);
    
    return {
      vaccinations: vaccinations.length,
      breeding: breeding.length,
      health: health.length,
      processed
    };
  }
}

export default new ReminderService();
