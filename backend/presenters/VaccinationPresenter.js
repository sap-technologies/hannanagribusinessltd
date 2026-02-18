import VaccinationModel from '../models/VaccinationModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class VaccinationPresenter {
  // Validate vaccination data
  async validateVaccinationData(data) {
    const errors = [];

    // Check if goat exists
    if (data.goat_id) {
      const goat = await GoatModel.getGoatById(data.goat_id);
      if (!goat) {
        errors. push(`Goat with ID ${data.goat_id} not found`);
      }
    } else {
      errors.push('Goat ID is required');
    }

    // Validate required fields
    if (!data.record_date) {
      errors.push('Record date is required');
    }

    if (!data.type) {
      errors.push('Type is required');
    } else if (!['Vaccine', 'Deworming'].includes(data.type)) {
      errors.push('Type must be either Vaccine or Deworming');
    }

    if (!data.drug_used || data.drug_used.trim() === '') {
      errors.push('Drug used is required');
    }

    // Validate dates
    if (data.next_due_date && data.record_date) {
      if (new Date(data.next_due_date) < new Date(data.record_date)) {
        errors.push('Next due date cannot be before record date');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all vaccination records
  async getAllRecords() {
    try {
      const records = await VaccinationModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get vaccination record by ID
  async getRecordById(vaccinationId) {
    try {
      const record = await VaccinationModel.getRecordById(vaccinationId);
      if (!record) {
        return { success: false, error: 'Vaccination record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by goat ID
  async getRecordsByGoatId(goatId) {
    try {
      const records = await VaccinationModel.getRecordsByGoatId(goatId);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by type
  async getRecordsByType(type) {
    try {
      const records = await VaccinationModel.getRecordsByType(type);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get upcoming due vaccinations
  async getUpcomingDue(daysAhead = 30) {
    try {
      const records = await VaccinationModel.getUpcomingDue(daysAhead);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get overdue vaccinations
  async getOverdue() {
    try {
      const records = await VaccinationModel.getOverdue();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new vaccination record
  async createRecord(recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateVaccinationData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await VaccinationModel.createRecord(recordData);
      
      // Send notification to admins
      notificationHelper.notifyVaccinationCreated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Vaccination record created successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update vaccination record
  async updateRecord(vaccinationId, recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateVaccinationData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await VaccinationModel.updateRecord(vaccinationId, recordData);
      if (!record) {
        return { success: false, error: 'Vaccination record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifyVaccinationUpdated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Vaccination record updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete vaccination record
  async deleteRecord(vaccinationId) {
    try {
      const record = await VaccinationModel.deleteRecord(vaccinationId);
      if (!record) {
        return { success: false, error: 'Vaccination record not found' };
      }
      return { success: true, message: 'Vaccination record deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search vaccination records
  async searchRecords(searchTerm) {
    try {
      const records = await VaccinationModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get vaccination statistics
  async getVaccinationStats() {
    try {
      const stats = await VaccinationModel.getVaccinationStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new VaccinationPresenter();
