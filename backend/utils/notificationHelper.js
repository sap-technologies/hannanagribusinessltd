import sql from '../db.js';
import notificationService from '../services/notificationService.js';

/**
 * Notification Helper
 * Centralized utility for sending notifications to admin users
 */

class NotificationHelper {
  /**
   * Get all admin users
   */
  async getAdminUsers() {
    const admins = await sql`
      SELECT user_id, email, full_name 
      FROM users 
      WHERE role = 'admin' AND is_active = true
    `;
    return admins;
  }

  /**
   * Send notification to all admins
   */
  async notifyAdmins({ type, title, message, link, priority = 'medium', performedBy = null, performedByName = null }) {
    try {
      const admins = await this.getAdminUsers();
      
      if (admins.length === 0) {
        console.warn('⚠️ No admin users found to send notification');
        return [];
      }

      const notifications = [];
      for (const admin of admins) {
        const notification = await notificationService.createNotification({
          userId: admin.user_id,
          type,
          title,
          message,
          link,
          priority,
          expiresAt: null, // Explicitly set to null instead of undefined
          performedBy,
          performedByName
        });
        notifications.push(notification);
      }

      console.log(`✅ Sent ${notifications.length} notification(s) to ${admins.length} admin(s): ${title}`);
      return notifications;
    } catch (error) {
      console.error('❌ Error sending admin notifications:', error.message);
      return [];
    }
  }

  /**
   * Notification for new goat registration
   */
  async notifyGoatCreated(goat, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'goat',
      title: '🐐 New Goat Registered',
      message: `New ${goat.sex} goat "${goat.goat_id}" (${goat.breed}) has been registered`,
      link: `/goats/${goat.goat_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for goat update
   */
  async notifyGoatUpdated(goat, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'goat',
      title: '✏️ Goat Record Updated',
      message: `Goat "${goat.goat_id}" information has been updated`,
      link: `/goats/${goat.goat_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new breeding record
   */
  async notifyBreedingCreated(breeding, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'breeding',
      title: '🐐 New Breeding Record',
      message: `New breeding record created for goat ${breeding.goat_id || breeding.doe_id}`,
      link: `/breeding/${breeding.breeding_id}`,
      priority: 'medium',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for breeding update
   */
  async notifyBreedingUpdated(breeding, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'breeding',
      title: '✏️ Breeding Record Updated',
      message: `Breeding record updated for goat ${breeding.goat_id || breeding.doe_id}`,
      link: `/breeding/${breeding.breeding_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new health record
   */
  async notifyHealthCreated(health, performedBy = null, performedByName = null) {
    const priority = health.treatment_outcome === 'Recovered' ? 'low' : 'high';
    return await this.notifyAdmins({
      type: 'health',
      title: '🏥 New Health Record',
      message: `Health issue recorded for goat ${health.goat_id}: ${health.problem_observed}`,
      link: `/health/${health.health_id}`,
      priority,
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for health record update
   */
  async notifyHealthUpdated(health, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'health',
      title: '✏️ Health Record Updated',
      message: `Health record updated for goat ${health.goat_id}`,
      link: `/health/${health.health_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new vaccination
   */
  async notifyVaccinationCreated(vaccination, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'vaccination',
      title: '💉 New Vaccination Record',
      message: `Vaccination recorded for goat ${vaccination.goat_id}: ${vaccination.drug_used}`,
      link: `/vaccination/${vaccination.vaccination_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for vaccination update
   */
  async notifyVaccinationUpdated(vaccination, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'vaccination',
      title: '✏️ Vaccination Record Updated',
      message: `Vaccination record updated for goat ${vaccination.goat_id}`,
      link: `/vaccination/${vaccination.vaccination_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new feeding record
   */
  async notifyFeedingCreated(feeding, performedBy = null, performedByName = null) {
    const target = feeding.goat_id ? `goat ${feeding.goat_id}` : `group "${feeding.group_name}"`;
    return await this.notifyAdmins({
      type: 'feeding',
      title: '🌾 New Feeding Record',
      message: `Feeding recorded for ${target}: ${feeding.feed_type}`,
      link: `/feeding/${feeding.feeding_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for feeding update
   */
  async notifyFeedingUpdated(feeding, performedBy = null, performedByName = null) {
    const target = feeding.goat_id ? `goat ${feeding.goat_id}` : `group "${feeding.group_name}"`;
    return await this.notifyAdmins({
      type: 'feeding',
      title: '✏️ Feeding Record Updated',
      message: `Feeding record updated for ${target}`,
      link: `/feeding/${feeding.feeding_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new expense
   */
  async notifyExpenseCreated(expense, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'expense',
      title: '💰 New Expense Recorded',
      message: `New ${expense.category} expense: UGX ${expense.amount_ugx.toLocaleString()} - ${expense.description}`,
      link: `/expenses/${expense.expense_id}`,
      priority: 'medium',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for expense update
   */
  async notifyExpenseUpdated(expense, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'expense',
      title: '✏️ Expense Updated',
      message: `Expense record updated: ${expense.description}`,
      link: `/expenses/${expense.expense_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new meat sale
   */
  async notifySalesMeatCreated(sale, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'sale',
      title: '💵 New Meat Sale',
      message: `Meat sale recorded: Goat ${sale.goat_id} sold for UGX ${sale.total_price_ugx.toLocaleString()}`,
      link: `/sales-meat/${sale.sale_id}`,
      priority: 'medium',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for meat sale update
   */
  async notifySalesMeatUpdated(sale, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'sale',
      title: '✏️ Meat Sale Updated',
      message: `Meat sale record updated for goat ${sale.goat_id}`,
      link: `/sales-meat/${sale.sale_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new breeding sale
   */
  async notifySalesBreedingCreated(sale, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'sale',
      title: '💵 New Breeding Sale',
      message: `Breeding goat sold: ${sale.goat_id} for UGX ${sale.sale_price_ugx.toLocaleString()}`,
      link: `/sales-breeding/${sale.sale_id}`,
      priority: 'medium',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for breeding sale update
   */
  async notifySalesBreedingUpdated(sale, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'sale',
      title: '✏️ Breeding Sale Updated',
      message: `Breeding sale record updated for goat ${sale.goat_id}`,
      link: `/sales-breeding/${sale.sale_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new kid growth record
   */
  async notifyKidGrowthCreated(growth, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'growth',
      title: '📈 New Kid Growth Record',
      message: `Growth recorded for kid ${growth.goat_id}: ${growth.weight_kg}kg`,
      link: `/kid-growth/${growth.growth_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for kid growth update
   */
  async notifyKidGrowthUpdated(growth, performedBy = null, performedByName = null) {
    return await this.notifyAdmins({
      type: 'growth',
      title: '✏️ Kid Growth Updated',
      message: `Growth record updated for kid ${growth.goat_id}`,
      link: `/kid-growth/${growth.growth_id}`,
      priority: 'low',
      performedBy,
      performedByName
    });
  }

  /**
   * Notification for new monthly summary
   */
  async notifyMonthlySummaryCreated(summary) {
    return await this.notifyAdmins({
      type: 'report',
      title: '📊 Monthly Summary Created',
      message: `Monthly summary for ${summary.month}/${summary.year}: Net Profit UGX ${summary.net_profit_ugx.toLocaleString()}`,
      link: `/monthly-summary/${summary.summary_id}`,
      priority: 'medium'
    });
  }

  /**
   * Notification for monthly summary update
   */
  async notifyMonthlySummaryUpdated(summary) {
    return await this.notifyAdmins({
      type: 'report',
      title: '✏️ Monthly Summary Updated',
      message: `Monthly summary updated for ${summary.month}/${summary.year}`,
      link: `/monthly-summary/${summary.summary_id}`,
      priority: 'low'
    });
  }

  /**
   * Notification for new coffee farm record
   */
  async notifyCoffeeCreated(coffee) {
    return await this.notifyAdmins({
      type: 'farm',
      title: '☕ New Coffee Record',
      message: `Coffee harvest recorded: ${coffee.quantity_kg}kg`,
      link: `/coffee/${coffee.coffee_id}`,
      priority: 'low'
    });
  }

  /**
   * Notification for coffee update
   */
  async notifyCoffeeUpdated(coffee) {
    return await this.notifyAdmins({
      type: 'farm',
      title: '✏️ Coffee Record Updated',
      message: `Coffee record updated: ${coffee.quantity_kg}kg`,
      link: `/coffee/${coffee.coffee_id}`,
      priority: 'low'
    });
  }

  /**
   * Notification for new matooke farm record
   */
  async notifyMatookeCreated(matooke) {
    return await this.notifyAdmins({
      type: 'farm',
      title: '🍌 New Matooke Record',
      message: `Matooke harvest recorded: ${matooke.bunches_harvested} bunches`,
      link: `/matooke/${matooke.matooke_id}`,
      priority: 'low'
    });
  }

  /**
   * Notification for matooke update
   */
  async notifyMatookeUpdated(matooke) {
    return await this.notifyAdmins({
      type: 'farm',
      title: '✏️ Matooke Record Updated',
      message: `Matooke record updated: ${matooke.bunches_harvested} bunches`,
      link: `/matooke/${matooke.matooke_id}`,
      priority: 'low'
    });
  }
}

export default new NotificationHelper();
