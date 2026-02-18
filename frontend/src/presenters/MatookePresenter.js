import { matookeService } from '../services/farmService';

// Presenter - Business logic for Matooke Farm operations
class MatookePresenter {
  constructor() {
    this.view = null;
  }

  setView(view) {
    this.view = view;
  }

  // Load all farms
  async loadFarms() {
    try {
      this.view?.setLoading(true);
      const result = await matookeService.getAllFarms();
      
      if (result.success) {
        this.view?.displayFarms(result.data);
      } else {
        this.view?.showError(result.message);
      }
    } catch (error) {
      this.view?.showError('Failed to load farms: ' + error.message);
    } finally {
      this.view?.setLoading(false);
    }
  }

  // Create farm
  async createFarm(farmData) {
    try {
      this.view?.setLoading(true);
      const result = await matookeService.createFarm(farmData);
      
      if (result.success) {
        this.view?.showSuccess(result.message);
        await this.loadFarms();
        return true;
      } else {
        this.view?.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view?.showError('Failed to create farm: ' + error.message);
      return false;
    } finally {
      this.view?.setLoading(false);
    }
  }

  // Update farm
  async updateFarm(farmId, farmData) {
    try {
      this.view?.setLoading(true);
      const result = await matookeService.updateFarm(farmId, farmData);
      
      if (result.success) {
        this.view?.showSuccess(result.message);
        await this.loadFarms();
        return true;
      } else {
        this.view?.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view?.showError('Failed to update farm: ' + error.message);
      return false;
    } finally {
      this.view?.setLoading(false);
    }
  }

  // Delete farm
  async deleteFarm(farmId) {
    try {
      this.view?.setLoading(true);
      const result = await matookeService.deleteFarm(farmId);
      
      if (result.success) {
        this.view?.showSuccess(result.message);
        await this.loadFarms();
        return true;
      } else {
        this.view?.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view?.showError('Failed to delete farm: ' + error.message);
      return false;
    } finally {
      this.view?.setLoading(false);
    }
  }
}

export default MatookePresenter;
