import { expensesService } from '../services/api';

class ExpensesPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await expensesService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load expense records: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await expensesService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Expense recorded successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to create expense record: ' + error.message);
      }
    }
  }

  async updateRecord(expenseId, recordData) {
    try {
      await expensesService.updateRecord(expenseId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Expense updated successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to update expense record: ' + error.message);
      }
    }
  }

  async deleteRecord(expenseId) {
    try {
      await expensesService.deleteRecord(expenseId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Expense deleted successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to delete expense record: ' + error.message);
      }
    }
  }

  async loadExpenseStats() {
    try {
      const stats = await expensesService.getExpenseStats();
      if (this.view && this.view.displayStats) {
        this.view.displayStats(stats);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load expense statistics: ' + error.message);
      }
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await expensesService.searchRecords(searchTerm);
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to search expense records: ' + error.message);
      }
    }
  }
}

export default ExpensesPresenter;
