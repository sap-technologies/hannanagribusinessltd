import { goatService, uploadService } from '../services/api';

// Presenter - Business logic and state management for Goat operations
class GoatPresenter {
  constructor(view) {
    this.view = view;
  }

  // Load all goats
  async loadGoats() {
    try {
      this.view.setLoading(true);
      const result = await goatService.getAllGoats();
      
      if (result.success) {
        this.view.displayGoats(result.data);
      } else {
        this.view.showError(result.message);
      }
    } catch (error) {
      this.view.showError('Failed to load goats: ' + error.message);
    } finally {
      this.view.setLoading(false);
    }
  }

  // Create goat
  async createGoat(goatData) {
    try {
      this.view.setLoading(true);
      
      // Separate photo file from goat data
      const { photoFile, ...goatInfo } = goatData;
      
      // Create goat record
      const result = await goatService.createGoat(goatInfo);
      
      if (result.success) {
        // If there's a photo file, upload it
        if (photoFile) {
          try {
            await uploadService.uploadGoatPhoto(goatInfo.goat_id, photoFile);
            this.view.showSuccess(result.message + ' (with photo)');
          } catch (uploadError) {
            console.error('Photo upload failed:', uploadError);
            this.view.showSuccess(result.message + ' (photo upload failed)');
          }
        } else {
          this.view.showSuccess(result.message);
        }
        
        await this.loadGoats(); // Reload list
        return true;
      } else {
        this.view.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view.showError('Failed to register goat: ' + error.message);
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }

  // Update goat
  async updateGoat(id, goatData) {
    try {
      this.view.setLoading(true);
      
      // Separate photo file from goat data
      const { photoFile, ...goatInfo } = goatData;
      
      // Update goat record
      const result = await goatService.updateGoat(id, goatInfo);
      
      if (result.success) {
        // If there's a new photo file, upload it
        if (photoFile) {
          try {
            await uploadService.uploadGoatPhoto(id, photoFile);
            this.view.showSuccess(result.message + ' (with photo)');
          } catch (uploadError) {
            console.error('Photo upload failed:', uploadError);
            this.view.showSuccess(result.message + ' (photo upload failed)');
          }
        } else {
          this.view.showSuccess(result.message);
        }
        
        await this.loadGoats(); // Reload list
        return true;
      } else {
        this.view.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view.showError('Failed to update goat: ' + error.message);
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }

  // Delete goat
  async deleteGoat(id) {
    try {
      this.view.setLoading(true);
      const result = await goatService.deleteGoat(id);
      
      if (result.success) {
        this.view.showSuccess(result.message);
        await this.loadGoats(); // Reload list
        return true;
      } else {
        this.view.showError(result.message);
        return false;
      }
    } catch (error) {
      this.view.showError('Failed to delete goat: ' + error.message);
      return false;
    } finally {
      this.view.setLoading(false);
    }
  }

  // Search goats
  async searchGoats(searchTerm) {
    if (!searchTerm.trim()) {
      await this.loadGoats();
      return;
    }

    try {
      this.view.setLoading(true);
      const result = await goatService.searchGoats(searchTerm);
      
      if (result.success) {
        this.view.displayGoats(result.data);
      } else {
        this.view.showError(result.message);
      }
    } catch (error) {
      this.view.showError('Search failed: ' + error.message);
    } finally {
      this.view.setLoading(false);
    }
  }

  // Get offspring
  async getOffspring(id, type = 'both') {
    try {
      this.view.setLoading(true);
      const result = await goatService.getOffspring(id, type);
      
      if (result.success) {
        this.view.displayOffspring(result.data);
      } else {
        this.view.showError(result.message);
      }
    } catch (error) {
      this.view.showError('Failed to load offspring: ' + error.message);
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default GoatPresenter;
