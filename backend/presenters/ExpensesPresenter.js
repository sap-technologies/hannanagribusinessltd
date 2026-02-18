import ExpensesModel from '../models/ExpensesModel.js';
import notificationHelper from '../utils/notificationHelper.js';

class ExpensesPresenter {
  // Validate expense data
  validateExpenseData(data) {
    const errors = [];

    // Validate required fields
    if (!data.expense_date) {
      errors.push('Expense date is required');
    }

    if (!data.category || data.category.trim() === '') {
      errors.push('Category is required');
    }

    // Validate category is one of the allowed values
    const allowedCategories = ['Feed', 'Vet', 'Labor', 'Other'];
    if (data.category && !allowedCategories.includes(data.category)) {
      errors.push('Category must be one of: Feed, Vet, Labor, Other');
    }

    if (!data.description || data.description.trim() === '') {
      errors.push('Description is required');
    }

    if (!data.amount_ugx || data.amount_ugx <= 0) {
      errors.push('Amount must be greater than 0');
    }

    if (!data.paid_by || data.paid_by.trim() === '') {
      errors.push('Paid by is required');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Get all expense records
  async getAllRecords() {
    try {
      const records = await ExpensesModel.getAllRecords();
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get expense record by ID
  async getRecordById(expenseId) {
    try {
      const record = await ExpensesModel.getRecordById(expenseId);
      if (!record) {
        return { success: false, error: 'Expense record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Create new expense record
  async createRecord(expenseData, performedBy = null, performedByName = null) {
    try {
      // Validate data
      const validation = this.validateExpenseData(expenseData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await ExpensesModel.createRecord(expenseData);
      
      // Send notification to admins
      notificationHelper.notifyExpenseCreated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Update expense record
  async updateRecord(expenseId, expenseData, performedBy = null, performedByName = null) {
    try {
      // Validate data
      const validation = this.validateExpenseData(expenseData);
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(', ') };
      }

      const record = await ExpensesModel.updateRecord(expenseId, expenseData);
      if (!record) {
        return { success: false, error: 'Expense record not found' };
      }
      
      // Send notification to admins
      notificationHelper.notifyExpenseUpdated(record, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Delete expense record
  async deleteRecord(expenseId) {
    try {
      const record = await ExpensesModel.deleteRecord(expenseId);
      if (!record) {
        return { success: false, error: 'Expense record not found' };
      }
      return { success: true, data: record };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by category
  async getRecordsByCategory(category) {
    try {
      const records = await ExpensesModel.getRecordsByCategory(category);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by date range
  async getRecordsByDateRange(startDate, endDate) {
    try {
      const records = await ExpensesModel.getRecordsByDateRange(startDate, endDate);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get records by paid by
  async getRecordsByPaidBy(paidBy) {
    try {
      const records = await ExpensesModel.getRecordsByPaidBy(paidBy);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Search expense records
  async searchRecords(searchTerm) {
    try {
      const records = await ExpensesModel.searchRecords(searchTerm);
      return { success: true, data: records };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get expense statistics
  async getExpenseStats() {
    try {
      const stats = await ExpensesModel.getExpenseStats();
      return { success: true, data: stats };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get expenses by category with totals
  async getExpensesByCategory() {
    try {
      const data = await ExpensesModel.getExpensesByCategory();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  // Get monthly expenses
  async getMonthlyExpenses() {
    try {
      const data = await ExpensesModel.getMonthlyExpenses();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new ExpensesPresenter();
