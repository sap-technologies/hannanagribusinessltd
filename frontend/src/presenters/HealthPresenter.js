import { healthService } from '../services/api.js';

// Presenter - Business logic for Health operations (Frontend)
class HealthPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const result = await healthService.getAllRecords();
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load health records');
      }
    } catch (error) {
      console.error('Error loading health records:', error);
      this.view.showError('Network error: Failed to load health records');
    }
  }

  async createRecord(healthData) {
    try {
      const result = await healthService.createRecord(healthData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Health record created successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to create health record');
      }
    } catch (error) {
      console.error('Error creating health record:', error);
      this.view.showError('Network error: Failed to create health record');
    }
  }

  async updateRecord(healthId, healthData) {
    try {
      const result = await healthService.updateRecord(healthId, healthData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Health record updated successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to update health record');
      }
    } catch (error) {
      console.error('Error updating health record:', error);
      this.view.showError('Network error: Failed to update health record');
    }
  }

  async deleteRecord(healthId) {
    try {
      const result = await healthService.deleteRecord(healthId);
      if (result.success) {
        this.view.showSuccess(result.message || 'Health record deleted successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to delete health record');
      }
    } catch (error) {
      console.error('Error deleting health record:', error);
      this.view.showError('Network error: Failed to delete health record');
    }
  }

  async loadHealthStats() {
    try {
      const result = await healthService.getHealthStats();
      if (result.success) {
        this.view.displayStats(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load health statistics');
      }
    } catch (error) {
      console.error('Error loading health stats:', error);
      this.view.showError('Network error: Failed to load health statistics');
    }
  }

  async searchRecords(searchTerm) {
    try {
      const result = await healthService.searchRecords(searchTerm);
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching health records:', error);
      this.view.showError('Network error: Search failed');
    }
  }
}

export default HealthPresenter;
