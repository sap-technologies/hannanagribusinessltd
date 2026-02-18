import FeedingModel from '../models/FeedingModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class FeedingPresenter {
  // Validate feeding data
  async validateFeedingData(data) {
    const errors = [];

    // Must have either goat_id or group_name
    if (!data.goat_id && !data.group_name) {
      errors.push('Either Goat ID or Group Name is required');
    }

    // Check if goat exists (if provided)
    if (data.goat_id) {
      const goat = await GoatModel.getGoatById(data.goat_id);
      if (!goat) {
        errors.push(`Goat with ID ${data.goat_id} not found`);
      }
    }

    // Validate required fields
    if (!data.record_date) {
      errors.push('Record date is required');
    }

    if (!data.feed_type || data.feed_type.trim() === '') {
      errors.push('Feed type is required');
    }

    if (data.purpose && !['Maintenance', 'Fattening'].includes(data.purpose)) {
      errors.push('Purpose must be either Maintenance or Fattening');
    }

    // Validate numeric fields
    if (data.quantity_used !== undefined && data.quantity_used !== null && data.quantity_used < 0) {
      errors.push('Quantity used cannot be negative');
    }

    if (data.weight_gain_kgs !== undefined && data.weight_gain_kgs !== null && data.weight_gain_kgs < 0) {
      errors.push('Weight gain cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all feeding records
  async getAllRecords() {
    try {
      const records = await FeedingModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get feeding record by ID
  async getRecordById(feedingId) {
    try {
      const record = await FeedingModel.getRecordById(feedingId);
      if (!record) {
        return { success: false, error: 'Feeding record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by goat ID
  async getRecordsByGoatId(goatId) {
    try {
      const records = await FeedingModel.getRecordsByGoatId(goatId);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by group
  async getRecordsByGroup(groupName) {
    try {
      const records = await FeedingModel.getRecordsByGroup(groupName);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by purpose
  async getRecordsByPurpose(purpose) {
    try {
      const records = await FeedingModel.getRecordsByPurpose(purpose);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by date range
  async getRecordsByDateRange(startDate, endDate) {
    try {
      const records = await FeedingModel.getRecordsByDateRange(startDate, endDate);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new feeding record
  async createRecord(recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateFeedingData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await FeedingModel.createRecord(recordData);
      
      // Send notification to admins
      notificationHelper.notifyFeedingCreated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Feeding record created successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update feeding record
  async updateRecord(feedingId, recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateFeedingData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await FeedingModel.updateRecord(feedingId, recordData);
      if (!record) {
        return { success: false, error: 'Feeding record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifyFeedingUpdated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Feeding record updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete feeding record
  async deleteRecord(feedingId) {
    try {
      const record = await FeedingModel.deleteRecord(feedingId);
      if (!record) {
        return { success: false, error: 'Feeding record not found' };
      }
      return { success: true, message: 'Feeding record deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search feeding records
  async searchRecords(searchTerm) {
    try {
      const records = await FeedingModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get feeding statistics
  async getFeedingStats() {
    try {
      const stats = await FeedingModel.getFeedingStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get feed consumption by type
  async getFeedConsumptionByType() {
    try {
      const stats = await FeedingModel.getFeedConsumptionByType();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new FeedingPresenter();
