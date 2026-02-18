import MonthlySummaryModel from '../models/MonthlySummaryModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class MonthlySummaryPresenter {
  // Validate monthly summary data
  validateSummaryData(data) {
    const errors = [];

    // Validate required fields
    if (!data.month) {
      errors.push('Month is required');
    }

    // Validate numeric fields are not negative
    const numericFields = [
      'opening_goats', 'births', 'purchases', 'deaths', 
      'sold_breeding', 'sold_meat', 'closing_goats'
    ];

    numericFields.forEach(field => {
      if (data[field] !== undefined && data[field] !== null && data[field] < 0) {
        errors.push(`${field.replace('_', ' ')} cannot be negative`);
      }
    });

    // Validate closing goats calculation
    if (data.opening_goats !== undefined && data.births !== undefined && 
        data.purchases !== undefined && data.deaths !== undefined && 
        data.sold_breeding !== undefined && data.sold_meat !== undefined && 
        data.closing_goats !== undefined) {
      
      const calculatedClosing = data.opening_goats + data.births + data.purchases 
                                - data.deaths - data.sold_breeding - data.sold_meat;
      
      if (data.closing_goats !== calculatedClosing) {
        errors.push(`Closing goats (${data.closing_goats}) does not match calculation: ${data.opening_goats} + ${data.births} + ${data.purchases} - ${data.deaths} - ${data.sold_breeding} - ${data.sold_meat} = ${calculatedClosing}`);
      }
    }

    // Validate net profit calculation
    if (data.total_income_ugx !== undefined && data.total_expenses_ugx !== undefined && 
        data.net_profit_ugx !== undefined) {
      
      const calculatedProfit = data.total_income_ugx - data.total_expenses_ugx;
      const difference = Math.abs(data.net_profit_ugx - calculatedProfit);
      
      if (difference > 0.01) {
        errors.push(`Net profit (${data.net_profit_ugx}) does not match calculation: ${data.total_income_ugx} - ${data.total_expenses_ugx} = ${calculatedProfit}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all monthly summary records
  async getAllRecords() {
    try {
      const records = await MonthlySummaryModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get summary record by ID
  async getRecordById(summaryId) {
    try {
      const record = await MonthlySummaryModel.getRecordById(summaryId);
      if (!record) {
        return { success: false, error: 'Monthly summary record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get summary by month
  async getRecordByMonth(month) {
    try {
      const record = await MonthlySummaryModel.getRecordByMonth(month);
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new monthly summary record
  async createRecord(summaryData) {
    try {
      // Validate data
      const validation = this.validateSummaryData(summaryData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await MonthlySummaryModel.createRecord(summaryData);
      
      // Send notification to admins
      notificationHelper.notifyMonthlySummaryCreated(record).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record };
    } catch (error) {
      // Handle unique constraint violation for month
      if (error.code === '23505') {
        return { success: false, error: 'A summary for this month already exists' };
      }
      return { success: false, error: error.message };
    }
  }

  // Update monthly summary record
  async updateRecord(summaryId, summaryData) {
    try {
      // Validate data
      const validation = this.validateSummaryData(summaryData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await MonthlySummaryModel.updateRecord(summaryId, summaryData);
      if (!record) {
        return { success: false, error: 'Monthly summary record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifyMonthlySummaryUpdated(record).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete monthly summary record
  async deleteRecord(summaryId) {
    try {
      const record = await MonthlySummaryModel.deleteRecord(summaryId);
      if (!record) {
        return { success: false, error: 'Monthly summary record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get summaries by date range
  async getRecordsByDateRange(startMonth, endMonth) {
    try {
      const records = await MonthlySummaryModel.getRecordsByDateRange(startMonth, endMonth);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get summaries by year
  async getRecordsByYear(year) {
    try {
      const records = await MonthlySummaryModel.getRecordsByYear(year);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search summary records
  async searchRecords(searchTerm) {
    try {
      const records = await MonthlySummaryModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get summary statistics
  async getSummaryStats() {
    try {
      const stats = await MonthlySummaryModel.getSummaryStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get yearly summary
  async getYearlySummary() {
    try {
      const data = await MonthlySummaryModel.getYearlySummary();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get latest summary
  async getLatestSummary() {
    try {
      const data = await MonthlySummaryModel.getLatestSummary();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new MonthlySummaryPresenter();
