import { salesMeatService } from '../services/api';

class SalesMeatPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await salesMeatService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load meat sales: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await salesMeatService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Meat sale recorded successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to create sale record: ' + error.message);
      }
    }
  }

  async updateRecord(saleId, recordData) {
    try {
      await salesMeatService.updateRecord(saleId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Meat sale updated successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to update sale record: ' + error.message);
      }
    }
  }

  async deleteRecord(saleId) {
    try {
      await salesMeatService.deleteRecord(saleId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Meat sale deleted successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to delete sale record: ' + error.message);
      }
    }
  }

  async loadSalesStats() {
    try {
      const stats = await salesMeatService.getSalesStats();
      if (this.view && this.view.displayStats) {
        this.view.displayStats(stats);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load sales statistics: ' + error.message);
      }
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await salesMeatService.searchRecords(searchTerm);
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to search sale records: ' + error.message);
      }
    }
  }
}

export default SalesMeatPresenter;
