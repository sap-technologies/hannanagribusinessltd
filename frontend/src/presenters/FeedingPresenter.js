import { feedingService } from '../services/api';

class FeedingPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await feedingService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load feeding records: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await feedingService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Feeding record created successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to create feeding record: ' + error.message);
      }
    }
  }

  async updateRecord(feedingId, recordData) {
    try {
      await feedingService.updateRecord(feedingId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Feeding record updated successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to update feeding record: ' + error.message);
      }
    }
  }

  async deleteRecord(feedingId) {
    try {
      await feedingService.deleteRecord(feedingId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Feeding record deleted successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to delete feeding record: ' + error.message);
      }
    }
  }

  async loadFeedingStats() {
    try {
      const stats = await feedingService.getFeedingStats();
      if (this.view && this.view.displayStats) {
        this.view.displayStats(stats);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load feeding statistics: ' + error.message);
      }
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await feedingService.searchRecords(searchTerm);
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to search feeding records: ' + error.message);
      }
    }
  }
}

export default FeedingPresenter;
