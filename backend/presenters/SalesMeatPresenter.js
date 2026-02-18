import SalesMeatModel from '../models/SalesMeatModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class SalesMeatPresenter {
  // Validate meat sale data
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

    if (!data.live_weight || data.live_weight <= 0) {
      errors.push('Live weight must be greater than 0');
    }

    if (!data.price_per_kg || data.price_per_kg <= 0) {
      errors.push('Price per kg must be greater than 0');
    }

    if (!data.total_price || data.total_price <= 0) {
      errors.push('Total price must be greater than 0');
    }

    // Validate total price calculation
    if (data.live_weight && data.price_per_kg && data.total_price) {
      const calculatedTotal = parseFloat(data.live_weight) * parseFloat(data.price_per_kg);
      const providedTotal = parseFloat(data.total_price);
      // Allow small rounding differences
      if (Math.abs(calculatedTotal - providedTotal) > 0.02) {
        errors.push(`Total price (${providedTotal}) doesn't match weight × price per kg (${calculatedTotal.toFixed(2)})`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all meat sale records
  async getAllRecords() {
    try {
      const records = await SalesMeatModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get sale record by ID
  async getRecordById(saleId) {
    try {
      const record = await SalesMeatModel.getRecordById(saleId);
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
      const records = await SalesMeatModel.getRecordsByGoatId(goatId);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by buyer
  async getRecordsByBuyer(buyer) {
    try {
      const records = await SalesMeatModel.getRecordsByBuyer(buyer);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by date range
  async getRecordsByDateRange(startDate, endDate) {
    try {
      const records = await SalesMeatModel.getRecordsByDateRange(startDate, endDate);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by payment method
  async getRecordsByPaymentMethod(paymentMethod) {
    try {
      const records = await SalesMeatModel.getRecordsByPaymentMethod(paymentMethod);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new meat sale record
  async createRecord(recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateSaleData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await SalesMeatModel.createRecord(recordData);
      
      // Automatically update goat status to "Slaughtered"
      if (record.goat_id) {
        await GoatModel.updateGoatStatus(record.goat_id, 'Slaughtered');
        console.log(`✓ Goat ${record.goat_id} status updated to Slaughtered`);
      }
      
      // Send notification to admins
      notificationHelper.notifySalesMeatCreated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Meat sale recorded and goat status updated to Slaughtered' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update meat sale record
  async updateRecord(saleId, recordData, performedBy = null, performedByName = null) {
    try {
      const validation = await this.validateSaleData(recordData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await SalesMeatModel.updateRecord(saleId, recordData);
      if (!record) {
        return { success: false, error: 'Sale record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifySalesMeatUpdated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record, message: 'Meat sale record updated successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete meat sale record
  async deleteRecord(saleId) {
    try {
      const record = await SalesMeatModel.deleteRecord(saleId);
      if (!record) {
        return { success: false, error: 'Sale record not found' };
      }
      return { success: true, message: 'Meat sale record deleted successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search meat sale records
  async searchRecords(searchTerm) {
    try {
      const records = await SalesMeatModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get meat sales statistics
  async getSalesStats() {
    try {
      const stats = await SalesMeatModel.getSalesStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get sales by breed
  async getSalesByBreed() {
    try {
      const stats = await SalesMeatModel.getSalesByBreed();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new SalesMeatPresenter();
