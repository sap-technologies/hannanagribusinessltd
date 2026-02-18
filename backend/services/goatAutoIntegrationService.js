import sql from '../db.js';
import reminderService from './reminderService.js';
import notificationService from './notificationService.js';
import notificationHelper from '../utils/notificationHelper.js';

/**
 * Goat Auto-Integration Service
 * Automatically creates records, reminders, and notifications when a goat is registered
 */
class GoatAutoIntegrationService {
  /**
   * Calculate goat age in months
   */
  calculateAgeInMonths(dateOfBirth) {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    const months = (today.getFullYear() - birthDate.getFullYear()) * 12 + 
                   (today.getMonth() - birthDate.getMonth());
    return months;
  }

  /**
   * Main integration method - called after goat is created
   */
  async integrateNewGoat(goat, performedBy = null, performedByName = null) {
    try {
      console.log(`🚀 Starting auto-integration for goat: ${goat.goat_id}`);
      
      const integrations = {
        vaccinationReminders: 0,
        healthReminders: 0,
        growthTracking: false,
        breedingReminder: false,
        feedingRecord: false,
        notifications: 0
      };

      const ageInMonths = this.calculateAgeInMonths(goat.date_of_birth);
      
      // 1. Create vaccination schedule reminders
      integrations.vaccinationReminders = await this.createVaccinationSchedule(goat, ageInMonths);
      
      // 2. Create health checkup reminders
      integrations.healthReminders = await this.createHealthCheckupReminders(goat);
      
      // 3. Create growth tracking for kids (under 12 months)
      if (ageInMonths < 12) {
        integrations.growthTracking = await this.createGrowthTracking(goat, ageInMonths);
      }
      
      // 4. Create breeding readiness reminder (for goats 7-9 months old)
      if (ageInMonths >= 7 && ageInMonths <= 9) {
        integrations.breedingReminder = await this.createBreedingReadinessReminder(goat);
      }
      
      // 5. Create initial feeding record
      integrations.feedingRecord = await this.createInitialFeedingRecord(goat);
      
      // 6. Send registration success notification
      await notificationHelper.notifyGoatCreated(goat, performedBy, performedByName);
      integrations.notifications = 1;
      
      // 7. Send integration summary notification
      const summaryNotif = await this.sendIntegrationSummary(goat, integrations, performedBy, performedByName);
      if (summaryNotif) integrations.notifications++;
      
      console.log(`✅ Auto-integration completed for ${goat.goat_id}:`, integrations);
      return integrations;
      
    } catch (error) {
      console.error(`❌ Error in auto-integration for ${goat.goat_id}:`, error);
      throw error;
    }
  }

  /**
   * Create vaccination schedule based on goat age
   */
  async createVaccinationSchedule(goat, ageInMonths) {
    let remindersCreated = 0;
    const today = new Date();
    
    const vaccinationSchedule = [
      { name: 'PPR (Peste des Petits Ruminants)', ageMonths: 3, description: 'PPR vaccine protects against viral disease' },
      { name: 'PPR Booster', ageMonths: 6, description: 'PPR booster dose for continued immunity' },
      { name: 'FMD (Foot and Mouth Disease)', ageMonths: 4, description: 'FMD vaccine protects against viral disease' },
      { name: 'Clostridial Diseases', ageMonths: 2, description: 'Protects against enterotoxemia and tetanus' },
      { name: 'Deworming', ageMonths: 1, description: 'First deworming treatment', recurring: 'every 3 months' },
      { name: 'Rabies (if endemic)', ageMonths: 3, description: 'Rabies vaccination if in endemic area' }
    ];
    
    for (const vac of vaccinationSchedule) {
      if (ageInMonths < vac.ageMonths) {
        // Calculate when this vaccination is due
        const birthDate = new Date(goat.date_of_birth);
        const dueDate = new Date(birthDate);
        dueDate.setMonth(dueDate.getMonth() + vac.ageMonths);
        
        // Only create reminder if due date is in the future
        if (dueDate > today) {
          const [reminder] = await sql`
            INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
            VALUES (
              'vaccination',
              ${goat.goat_id},
              'goats',
              ${dueDate.toISOString().split('T')[0]},
              ${`${vac.name} due for ${goat.goat_id}`},
              ${`${vac.description}. Goat will be ${vac.ageMonths} months old.${vac.recurring ? ' Note: ' + vac.recurring : ''}`}
            )
            RETURNING *
          `;
          remindersCreated++;
          console.log(`  ✓ Created vaccination reminder: ${vac.name} for ${goat.goat_id}`);
        }
      }
    }
    
    // Add recurring deworming reminders for the first year
    if (ageInMonths < 12) {
      for (let month = Math.ceil(ageInMonths / 3) * 3; month <= 12; month += 3) {
        if (month > ageInMonths) {
          const birthDate = new Date(goat.date_of_birth);
          const dewormDate = new Date(birthDate);
          dewormDate.setMonth(dewormDate.getMonth() + month);
          
          if (dewormDate > today) {
            const [reminder] = await sql`
              INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
              VALUES (
                'vaccination',
                ${goat.goat_id},
                'goats',
                ${dewormDate.toISOString().split('T')[0]},
                ${`Deworming due for ${goat.goat_id}`},
                ${`Regular deworming treatment at ${month} months old`}
              )
              RETURNING *
            `;
            remindersCreated++;
          }
        }
      }
    }
    
    return remindersCreated;
  }

  /**
   * Create health checkup reminders
   */
  async createHealthCheckupReminders(goat) {
    let remindersCreated = 0;
    const today = new Date();
    
    // Create monthly checkup reminders for the first 6 months
    // Then quarterly for the next 6 months
    const checkupSchedule = [
      { months: 1, type: 'monthly' },
      { months: 2, type: 'monthly' },
      { months: 3, type: 'monthly' },
      { months: 4, type: 'monthly' },
      { months: 5, type: 'monthly' },
      { months: 6, type: 'monthly' },
      { months: 9, type: 'quarterly' },
      { months: 12, type: 'quarterly' }
    ];

    const birthDate = new Date(goat.date_of_birth);
    const ageInMonths = this.calculateAgeInMonths(goat.date_of_birth);

    for (const checkup of checkupSchedule) {
      if (ageInMonths < checkup.months) {
        const checkupDate = new Date(birthDate);
        checkupDate.setMonth(checkupDate.getMonth() + checkup.months);
        
        if (checkupDate > today) {
          const [reminder] = await sql`
            INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
            VALUES (
              'health',
              ${goat.goat_id},
              'goats',
              ${checkupDate.toISOString().split('T')[0]},
              ${`Health checkup for ${goat.goat_id}`},
              ${`${checkup.type === 'monthly' ? 'Monthly' : 'Quarterly'} health inspection - Check weight, body condition, hooves, and overall health`}
            )
            RETURNING *
          `;
          remindersCreated++;
        }
      }
    }
    
    console.log(`  ✓ Created ${remindersCreated} health checkup reminders for ${goat.goat_id}`);
    return remindersCreated;
  }

  /**
   * Create growth tracking record for kids
   */
  async createGrowthTracking(goat, ageInMonths) {
    try {
      // Create initial growth record
      const [growthRecord] = await sql`
        INSERT INTO kid_growth (
          kid_id,
          mother_id,
          birth_weight,
          current_weight,
          record_date,
          age_in_days,
          health_status,
          remarks
        )
        VALUES (
          ${goat.goat_id},
          ${goat.mother_id || null},
          ${goat.weight || 2.5},
          ${goat.weight || 2.5},
          ${new Date().toISOString().split('T')[0]},
          ${ageInMonths * 30},
          'Healthy',
          'Auto-created growth tracking record upon registration'
        )
        RETURNING *
      `;
      
      // Create growth monitoring reminders (weekly for first month, then monthly)
      const today = new Date();
      
      // Weekly reminders for first month (if kid is under 1 month old)
      if (ageInMonths < 1) {
        for (let week = 1; week <= 4; week++) {
          const reminderDate = new Date(today);
          reminderDate.setDate(reminderDate.getDate() + (week * 7));
          
          await sql`
            INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
            VALUES (
              'growth',
              ${growthRecord.growth_id},
              'kid_growth',
              ${reminderDate.toISOString().split('T')[0]},
              ${`Week ${week} growth check for ${goat.goat_id}`},
              ${'Weigh kid and record growth progress. Check nursing and overall health.'}
            )
          `;
        }
      }
      
      // Monthly reminders until weaning (typically 3-4 months)
      const weaning_age = 4;
      for (let month = Math.ceil(ageInMonths) + 1; month <= weaning_age; month++) {
        const birthDate = new Date(goat.date_of_birth);
        const reminderDate = new Date(birthDate);
        reminderDate.setMonth(reminderDate.getMonth() + month);
        
        if (reminderDate > today) {
          await sql`
            INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
            VALUES (
              'growth',
              ${growthRecord.growth_id},
              'kid_growth',
              ${reminderDate.toISOString().split('T')[0]},
              ${`Month ${month} growth check for ${goat.goat_id}`},
              ${month === weaning_age ? 'Weaning age reached - assess readiness for weaning and record final pre-weaning weight' : 'Monthly weight check and growth assessment'}
            )
          `;
        }
      }
      
      console.log(`  ✓ Created growth tracking record and reminders for kid ${goat.goat_id}`);
      return true;
      
    } catch (error) {
      console.error(`  ✗ Error creating growth tracking for ${goat.goat_id}:`, error);
      return false;
    }
  }

  /**
   * Create breeding readiness reminder
   */
  async createBreedingReadinessReminder(goat) {
    try {
      // Optimal breeding age is around 8-10 months for does, 7-8 months for bucks
      const optimalBreedingAge = goat.sex === 'Female' ? 9 : 8;
      const birthDate = new Date(goat.date_of_birth);
      const breedingReadyDate = new Date(birthDate);
      breedingReadyDate.setMonth(breedingReadyDate.getMonth() + optimalBreedingAge);
      
      const today = new Date();
      
      if (breedingReadyDate > today) {
        const [reminder] = await sql`
          INSERT INTO reminders (type, reference_id, reference_table, reminder_date, title, description)
          VALUES (
            'breeding',
            ${goat.goat_id},
            'goats',
            ${breedingReadyDate.toISOString().split('T')[0]},
            ${`Breeding readiness check for ${goat.goat_id}`},
            ${goat.sex === 'Female' 
              ? `Doe reaching optimal breeding age (${optimalBreedingAge} months). Assess body condition and health before breeding.`
              : `Buck reaching sexual maturity (${optimalBreedingAge} months). Can be used for breeding if healthy and well-developed.`
            }
          )
          RETURNING *
        `;
        
        console.log(`  ✓ Created breeding readiness reminder for ${goat.goat_id}`);
        return true;
      }
      
      return false;
      
    } catch (error) {
      console.error(`  ✗ Error creating breeding reminder for ${goat.goat_id}:`, error);
      return false;
    }
  }

  /**
   * Create initial feeding record
   */
  async createInitialFeedingRecord(goat) {
    try {
      const ageInMonths = this.calculateAgeInMonths(goat.date_of_birth);
      
      // Determine appropriate feed type based on age
      let feedType, quantity, purpose, remarks;
      
      if (ageInMonths < 1) {
        feedType = 'Milk';
        quantity = 1.5;
        purpose = 'growth';
        remarks = 'Nursing from mother or bottle feeding. Creep feed available.';
      } else if (ageInMonths < 3) {
        feedType = 'Mixed Feed';
        quantity = 0.5;
        purpose = 'growth';
        remarks = 'Transitioning to solid feed. Hay and starter grain mix.';
      } else if (ageInMonths < 8) {
        feedType = 'Concentrate';
        quantity = 1.0;
        purpose = 'growth';
        remarks = 'Growing phase - concentrate feed with quality hay.';
      } else {
        feedType = 'Hay';
        quantity = 2.0;
        purpose = 'maintenance';
        remarks = 'Adult maintenance diet - quality hay with mineral supplement.';
      }
      
      const [feedingRecord] = await sql`
        INSERT INTO feeding_records (
          goat_id,
          feed_type,
          quantity_kg,
          purpose,
          record_date,
          remarks
        )
        VALUES (
          ${goat.goat_id},
          ${feedType},
          ${quantity},
          ${purpose},
          ${new Date().toISOString().split('T')[0]},
          ${'Auto-created initial feeding record. ' + remarks}
        )
        RETURNING *
      `;
      
      console.log(`  ✓ Created initial feeding record for ${goat.goat_id}: ${quantity}kg ${feedType}`);
      return true;
      
    } catch (error) {
      console.error(`  ✗ Error creating feeding record for ${goat.goat_id}:`, error);
      return false;
    }
  }

  /**
   * Send integration summary notification to admins
   */
  async sendIntegrationSummary(goat, integrations, performedBy, performedByName) {
    try {
      const summaryParts = [];
      
      if (integrations.vaccinationReminders > 0) {
        summaryParts.push(`✓ ${integrations.vaccinationReminders} vaccination reminders`);
      }
      if (integrations.healthReminders > 0) {
        summaryParts.push(`✓ ${integrations.healthReminders} health checkup reminders`);
      }
      if (integrations.growthTracking) {
        summaryParts.push(`✓ Growth tracking started`);
      }
      if (integrations.breedingReminder) {
        summaryParts.push(`✓ Breeding readiness reminder`);
      }
      if (integrations.feedingRecord) {
        summaryParts.push(`✓ Initial feeding record`);
      }
      
      if (summaryParts.length === 0) {
        return null;
      }
      
      const ageInMonths = this.calculateAgeInMonths(goat.date_of_birth);
      const message = `Auto-integration completed for ${goat.goat_id} (${ageInMonths} months old):\n\n${summaryParts.join('\n')}`;
      
      const notifications = await notificationHelper.notifyAdmins({
        type: 'system',
        title: `🤖 Auto-Setup Complete: ${goat.goat_id}`,
        message: message,
        link: `/goats/${goat.goat_id}`,
        priority: 'low',
        performedBy,
        performedByName
      });
      
      return notifications.length > 0;
      
    } catch (error) {
      console.error('Error sending integration summary:', error);
      return false;
    }
  }
}

export default new GoatAutoIntegrationService();
