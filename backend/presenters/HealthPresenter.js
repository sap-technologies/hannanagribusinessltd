import HealthModel from '../models/HealthModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';
import reminderService from '../services/reminderService.js';

// Presenter - Business logic layer for Health & Treatment operations
class HealthPresenter {
  async getAllRecords() {
    try {
      const records = await HealthModel.getAllRecords();
      return {
        success: true,
        data: records,
        message: 'Health records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllRecords:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve health records'
      };
    }
  }

  async getRecordById(healthId) {
    try {
      const record = await HealthModel.getRecordById(healthId);
      
      if (!record) {
        return {
          success: false,
          message: `Health record with ID ${healthId} not found`
        };
      }

      return {
        success: true,
        data: record,
        message: 'Health record retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve health record'
      };
    }
  }

  async createRecord(healthData, performedBy = null, performedByName = null) {
    try {
      const validationError = await this.validateHealthData(healthData);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const newRecord = await HealthModel.createRecord(healthData);
      
      // Send notification to admins
      notificationHelper.notifyHealthCreated(newRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      // Create manual reminder if requested
      if (healthData.setReminder && healthData.reminderDate) {
        try {
          await reminderService.createManualReminder({
            type: 'health_checkup',
            referenceId: newRecord.health_id,
            referenceTable: 'health_records',
            reminderDate: healthData.reminderDate,
            title: healthData.reminderTitle,
            description: healthData.reminderDescription,
            goatId: healthData.goat_id
          });
        } catch (reminderError) {
          console.error('Failed to create reminder:', reminderError);
        }
      }
      
      return {
        success: true,
        data: newRecord,
        message: 'Health record created successfully'
      };
    } catch (error) {
      console.error('Error in createRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create health record'
      };
    }
  }

  async updateRecord(healthId, healthData, performedBy = null, performedByName = null) {
    try {
      const existingRecord = await HealthModel.getRecordById(healthId);
      if (!existingRecord) {
        return {
          success: false,
          message: `Health record with ID ${healthId} not found`
        };
      }

      const validationError = await this.validateHealthData(healthData, true);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const updatedRecord = await HealthModel.updateRecord(healthId, healthData);
      
      // Send notification to admins
      notificationHelper.notifyHealthUpdated(updatedRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedRecord,
        message: 'Health record updated successfully'
      };
    } catch (error) {
      console.error('Error in updateRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update health record'
      };
    }
  }

  async deleteRecord(healthId) {
    try {
      const deletedRecord = await HealthModel.deleteRecord(healthId);
      
      if (!deletedRecord) {
        return {
          success: false,
          message: `Health record with ID ${healthId} not found`
        };
      }

      return {
        success: true,
        data: deletedRecord,
        message: 'Health record deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete health record'
      };
    }
  }

  async getRecordsByGoatId(goatId) {
    try {
      const records = await HealthModel.getRecordsByGoatId(goatId);
      return {
        success: true,
        data: records,
        message: 'Goat health history retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordsByGoatId:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goat health history'
      };
    }
  }

  async getRecordsByRecoveryStatus(status) {
    try {
      const records = await HealthModel.getRecordsByRecoveryStatus(status);
      return {
        success: true,
        data: records,
        message: `Records with ${status} status retrieved successfully`
      };
    } catch (error) {
      console.error('Error in getRecordsByRecoveryStatus:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve records by recovery status'
      };
    }
  }

  async getPendingFollowUp() {
    try {
      const records = await HealthModel.getPendingFollowUp();
      return {
        success: true,
        data: records,
        message: 'Pending follow-up records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getPendingFollowUp:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve pending follow-up records'
      };
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await HealthModel.searchRecords(searchTerm);
      return {
        success: true,
        data: records,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error in searchRecords:', error);
      return {
        success: false,
        error: error.message,
        message: 'Search failed'
      };
    }
  }

  async getHealthStats() {
    try {
      const stats = await HealthModel.getHealthStats();
      return {
        success: true,
        data: stats,
        message: 'Health statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getHealthStats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve health statistics'
      };
    }
  }

  async getCostsByDateRange(startDate, endDate) {
    try {
      const costs = await HealthModel.getCostsByDateRange(startDate, endDate);
      return {
        success: true,
        data: costs,
        message: 'Treatment costs retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getCostsByDateRange:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve treatment costs'
      };
    }
  }

  async validateHealthData(healthData, isUpdate = false) {
    if (!healthData.record_date) {
      return 'Record date is required';
    }

    if (!healthData.goat_id) {
      return 'Goat ID is required';
    }

    // Validate that goat exists
    const goat = await GoatModel.getGoatById(healthData.goat_id);
    if (!goat) {
      return `Goat with ID ${healthData.goat_id} not found`;
    }

    if (!healthData.problem_observed || healthData.problem_observed.trim() === '') {
      return 'Problem observed is required';
    }

    // Validate cost
    if (healthData.cost_ugx && healthData.cost_ugx < 0) {
      return 'Cost cannot be negative';
    }

    return null;
  }
}

export default new HealthPresenter();
