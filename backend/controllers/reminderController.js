import reminderService from '../services/reminderService.js';

class ReminderController {
  // Get all active reminders
  static async getActiveReminders(req, res) {
    try {
      const reminders = await reminderService.getActiveReminders();
      
      res.json({
        success: true,
        data: reminders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to get reminders',
        error: error.message
      });
    }
  }

  // Complete a reminder
  static async completeReminder(req, res) {
    try {
      const { id } = req.params;
      const reminder = await reminderService.completeReminder(id);
      
      res.json({
        success: true,
        message: 'Reminder completed',
        data: reminder
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to complete reminder',
        error: error.message
      });
    }
  }

  // Run daily reminder checks (admin only)
  static async runDailyChecks(req, res) {
    try {
      const results = await reminderService.runDailyReminderChecks();
      
      res.json({
        success: true,
        message: 'Daily reminder checks completed',
        data: results
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to run daily checks',
        error: error.message
      });
    }
  }

  // Check vaccination reminders
  static async checkVaccinations(req, res) {
    try {
      const reminders = await reminderService.checkVaccinationReminders();
      
      res.json({
        success: true,
        message: `Created ${reminders.length} vaccination reminders`,
        data: reminders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check vaccinations',
        error: error.message
      });
    }
  }

  // Check breeding reminders
  static async checkBreeding(req, res) {
    try {
      const reminders = await reminderService.checkBreedingReminders();
      
      res.json({
        success: true,
        message: `Created ${reminders.length} breeding reminders`,
        data: reminders
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check breeding',
        error: error.message
      });
    }
  }

  // Check health alerts
  static async checkHealth(req, res) {
    try {
      const alerts = await reminderService.checkHealthAlerts();
      
      res.json({
        success: true,
        message: `Created ${alerts.length} health alerts`,
        data: alerts
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Failed to check health',
        error: error.message
      });
    }
  }
}

export default ReminderController;
