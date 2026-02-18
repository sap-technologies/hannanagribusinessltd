import { salesBreedingService } from '../services/api';

class SalesBreedingPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await salesBreedingService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load breeding sales: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await salesBreedingService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Breeding sale recorded successfully');
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
      await salesBreedingService.updateRecord(saleId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Breeding sale updated successfully');
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
      await salesBreedingService.deleteRecord(saleId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Breeding sale deleted successfully');
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
      const stats = await salesBreedingService.getSalesStats();
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
      const records = await salesBreedingService.searchRecords(searchTerm);
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

export default SalesBreedingPresenter;
