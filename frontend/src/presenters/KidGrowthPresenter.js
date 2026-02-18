import { kidGrowthService } from '../services/api.js';

// Presenter - Business logic for Kid Growth operations (Frontend)
class KidGrowthPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const result = await kidGrowthService.getAllRecords();
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load kid growth records');
      }
    } catch (error) {
      console.error('Error loading kid growth records:', error);
      this.view.showError('Network error: Failed to load kid growth records');
    }
  }

  async createRecord(growthData) {
    try {
      const result = await kidGrowthService.createRecord(growthData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Kid growth record created successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to create kid growth record');
      }
    } catch (error) {
      console.error('Error creating kid growth record:', error);
      this.view.showError('Network error: Failed to create kid growth record');
    }
  }

  async updateRecord(growthId, growthData) {
    try {
      const result = await kidGrowthService.updateRecord(growthId, growthData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Kid growth record updated successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to update kid growth record');
      }
    } catch (error) {
      console.error('Error updating kid growth record:', error);
      this.view.showError('Network error: Failed to update kid growth record');
    }
  }

  async deleteRecord(growthId) {
    try {
      const result = await kidGrowthService.deleteRecord(growthId);
      if (result.success) {
        this.view.showSuccess(result.message || 'Kid growth record deleted successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to delete kid growth record');
      }
    } catch (error) {
      console.error('Error deleting kid growth record:', error);
      this.view.showError('Network error: Failed to delete kid growth record');
    }
  }

  async loadGrowthStats() {
    try {
      const result = await kidGrowthService.getGrowthStats();
      if (result.success) {
        this.view.displayStats(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load growth statistics');
      }
    } catch (error) {
      console.error('Error loading growth stats:', error);
      this.view.showError('Network error: Failed to load growth statistics');
    }
  }

  async searchRecords(searchTerm) {
    try {
      const result = await kidGrowthService.searchRecords(searchTerm);
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching kid growth records:', error);
      this.view.showError('Network error: Search failed');
    }
  }
}

export default KidGrowthPresenter;
