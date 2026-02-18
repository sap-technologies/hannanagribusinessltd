import { monthlySummaryService } from '../services/api';

class MonthlySummaryPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await monthlySummaryService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load monthly summaries: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await monthlySummaryService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Monthly summary created successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to create monthly summary: ' + error.message);
      }
    }
  }

  async updateRecord(summaryId, recordData) {
    try {
      await monthlySummaryService.updateRecord(summaryId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Monthly summary updated successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to update monthly summary: ' + error.message);
      }
    }
  }

  async deleteRecord(summaryId) {
    try {
      await monthlySummaryService.deleteRecord(summaryId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Monthly summary deleted successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to delete monthly summary: ' + error.message);
      }
    }
  }

  async loadSummaryStats() {
    try {
      const stats = await monthlySummaryService.getSummaryStats();
      if (this.view && this.view.displayStats) {
        this.view.displayStats(stats);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load summary statistics: ' + error.message);
      }
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await monthlySummaryService.searchRecords(searchTerm);
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to search monthly summaries: ' + error.message);
      }
    }
  }
}

export default MonthlySummaryPresenter;
