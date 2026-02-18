import { vaccinationService } from '../services/api';

class VaccinationPresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  async loadAllRecords() {
    try {
      const records = await vaccinationService.getAllRecords();
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load vaccination records: ' + error.message);
      }
    }
  }

  async createRecord(recordData) {
    try {
      await vaccinationService.createRecord(recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Vaccination record created successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to create vaccination record: ' + error.message);
      }
    }
  }

  async updateRecord(vaccinationId, recordData) {
    try {
      await vaccinationService.updateRecord(vaccinationId, recordData);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Vaccination record updated successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to update vaccination record: ' + error.message);
      }
    }
  }

  async deleteRecord(vaccinationId) {
    try {
      await vaccinationService.deleteRecord(vaccinationId);
      if (this.view && this.view.showSuccess) {
        this.view.showSuccess('Vaccination record deleted successfully');
      }
      await this.loadAllRecords();
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to delete vaccination record: ' + error.message);
      }
    }
  }

  async loadVaccinationStats() {
    try {
      const stats = await vaccinationService.getVaccinationStats();
      if (this.view && this.view.displayStats) {
        this.view.displayStats(stats);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to load vaccination statistics: ' + error.message);
      }
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await vaccinationService.searchRecords(searchTerm);
      if (this.view && this.view.displayRecords) {
        this.view.displayRecords(records);
      }
    } catch (error) {
      if (this.view && this.view.showError) {
        this.view.showError('Failed to search vaccination records: ' + error.message);
      }
    }
  }
}

export default VaccinationPresenter;
