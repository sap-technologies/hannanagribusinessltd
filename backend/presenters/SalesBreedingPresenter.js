import SalesBreedingModel from '../models/SalesBreedingModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class SalesBreedingPresenter {
  // Validate breeding sale data
  async validateSaleData(data) {
    const errors = [];

    // Check if goat exists
    if (data.goat_id) {
      const goat = await GoatModel.getGoatById(data.goat_id);
      if (!goat) {
        errors.push(`Goat with ID ${data.goat_id} not found`);
      }
    } else {
      errors.push('Goat ID is required');
    }

    // Validate required fields
    if (!data.sale_date) {
      errors.push('Sale date is required');
    }

    if (!data.buyer || data.buyer.trim() === '') {
      errors.push('Buyer name is required');
    }

    if (!data.sale_price_ugx || data.sale_price_ugx <= 0) {
      errors.push('Sale price must be greater than 0');
    }

    // Validate age
    if (data.age_months !== undefined && data.age_months !== null && data.age_months < 0) {
      errors.push('Age cannot be negative');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all breeding sale records
  async getAllRecords() {
    try {
      const records = await SalesBreedingModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get sale record by ID
  async getRecordById(saleId) {
    try {
      const record = await SalesBreedingModel.getRecordById(saleId);
      if (!record) {
        return { success: false, error: 'Sale record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by goat ID
  async getRecordsByGoatId(goatId) {
    try {
      const records = await SalesBreedingModel.getRecordsByGoatId(goatId);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by buyer
  async getRecordsByBuyer(buyer) {
    try {
      const records = await SalesBreedingModel.getRecordsByBuyer(buyer);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by date range
  async getRecordsByDateRange(startDate, endDate) {
    try {
      const records = await SalesBreedingModel.getRecordsByDateRange(startDate, endDate);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by payment method
  async getRecordsByPaymentMethod(paymentMethod) {
    try {
      const records = await SalesBreedingModel.getRecordsByPaymentMethod(paymentMethod);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new breeding sale record
  async createRecord(recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateSaleData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await SalesBreedingModel.createRecord(recordData);
      
      // Automatically update goat status to "Sold"
      if (record.goat_id) {
        await GoatModel.updateGoatStatus(record.goat_id, 'Sold');
        console.log(`✓ Goat ${record.goat_id} status updated to Sold`);
      }
      
      // Send notification to admins
      notificationHelper.notifySalesBreedingCreated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Breeding sale recorded and goat status updated to Sold' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update breeding sale record
  async updateRecord(saleId, recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateSaleData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await SalesBreedingModel.updateRecord(saleId, recordData);
      if (!record) {
        return { success: false, error: 'Sale record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifySalesBreedingUpdated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Breeding sale record updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete breeding sale record
  async deleteRecord(saleId) {
    try {
      const record = await SalesBreedingModel.deleteRecord(saleId);
      if (!record) {
        return { success: false, error: 'Sale record not found' };
      }
      return { success: true, message: 'Breeding sale record deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search breeding sale records
  async searchRecords(searchTerm) {
    try {
      const records = await SalesBreedingModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get breeding sales statistics
  async getSalesStats() {
    try {
      const stats = await SalesBreedingModel.getSalesStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get sales by breed
  async getSalesByBreed() {
    try {
      const stats = await SalesBreedingModel.getSalesByBreed();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new SalesBreedingPresenter();
