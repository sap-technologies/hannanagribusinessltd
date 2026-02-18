import { breedingService } from '../services/api.js';

// Presenter - Business logic for Breeding operations (Frontend)
class BreedingPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const result = await breedingService.getAllRecords();
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load breeding records');
      }
    } catch (error) {
      console.error('Error loading breeding records:', error);
      this.view.showError('Network error: Failed to load breeding records');
    }
  }

  async createRecord(breedingData) {
    try {
      const result = await breedingService.createRecord(breedingData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Breeding record created successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to create breeding record');
      }
    } catch (error) {
      console.error('Error creating breeding record:', error);
      this.view.showError('Network error: Failed to create breeding record');
    }
  }

  async updateRecord(breedingId, breedingData) {
    try {
      const result = await breedingService.updateRecord(breedingId, breedingData);
      if (result.success) {
        this.view.showSuccess(result.message || 'Breeding record updated successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to update breeding record');
      }
    } catch (error) {
      console.error('Error updating breeding record:', error);
      this.view.showError('Network error: Failed to update breeding record');
    }
  }

  async deleteRecord(breedingId) {
    try {
      const result = await breedingService.deleteRecord(breedingId);
      if (result.success) {
        this.view.showSuccess(result.message || 'Breeding record deleted successfully');
        await this.loadAllRecords(); // Refresh list
      } else {
        this.view.showError(result.message || 'Failed to delete breeding record');
      }
    } catch (error) {
      console.error('Error deleting breeding record:', error);
      this.view.showError('Network error: Failed to delete breeding record');
    }
  }

  async loadUpcomingKidding() {
    try {
      const result = await breedingService.getUpcomingKidding();
      if (result.success) {
        this.view.displayUpcomingKidding(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load upcoming kidding dates');
      }
    } catch (error) {
      console.error('Error loading upcoming kidding:', error);
      this.view.showError('Network error: Failed to load upcoming kidding dates');
    }
  }

  async loadBreedingStats() {
    try {
      const result = await breedingService.getBreedingStats();
      if (result.success) {
        this.view.displayStats(result.data);
      } else {
        this.view.showError(result.message || 'Failed to load breeding statistics');
      }
    } catch (error) {
      console.error('Error loading breeding stats:', error);
      this.view.showError('Network error: Failed to load breeding statistics');
    }
  }

  async searchRecords(searchTerm) {
    try {
      const result = await breedingService.searchRecords(searchTerm);
      if (result.success) {
        this.view.displayRecords(result.data);
      } else {
        this.view.showError(result.message || 'Search failed');
      }
    } catch (error) {
      console.error('Error searching breeding records:', error);
      this.view.showError('Network error: Search failed');
    }
  }
}

export default BreedingPresenter;
