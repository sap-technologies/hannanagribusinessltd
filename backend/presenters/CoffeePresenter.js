import CoffeeModel from '../models/CoffeeModel.js';
import notificationHelper from '../utils/notificationHelper.js';

// Presenter - Business logic layer for Coffee operations
class CoffeePresenter {
  async getAllFarms() {
    try {
      const farms = await CoffeeModel.getAllFarms();
      return {
        success: true,
        data: farms,
        message: 'Coffee farms retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllFarms:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve coffee farms'
      };
    }
  }

  async getFarmById(farmId) {
    try {
      const farm = await CoffeeModel.getFarmById(farmId);
      
      if (!farm) {
        return {
          success: false,
          message: `Farm with ID ${farmId} not found`
        };
      }

      return {
        success: true,
        data: farm,
        message: 'Farm retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getFarmById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve farm'
      };
    }
  }

  async createFarm(farmData) {
    try {
      const validationError = this.validateFarmData(farmData);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const existingFarm = await CoffeeModel.getFarmById(farmData.farm_id);
      if (existingFarm) {
        return {
          success: false,
          message: `Farm with ID ${farmData.farm_id} already exists`
        };
      }

      const newFarm = await CoffeeModel.createFarm(farmData);
      
      // Send notification to admins
      notificationHelper.notifyCoffeeCreated(newFarm).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: newFarm,
        message: 'Coffee farm registered successfully'
      };
    } catch (error) {
      console.error('Error in createFarm:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to register farm'
      };
    }
  }

  async updateFarm(farmId, farmData) {
    try {
      const existingFarm = await CoffeeModel.getFarmById(farmId);
      if (!existingFarm) {
        return {
          success: false,
          message: `Farm with ID ${farmId} not found`
        };
      }

      const validationError = this.validateFarmData(farmData, true);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const updatedFarm = await CoffeeModel.updateFarm(farmId, farmData);
      
      // Send notification to admins
      notificationHelper.notifyCoffeeUpdated(updatedFarm).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedFarm,
        message: 'Farm updated successfully'
      };
    } catch (error) {
      console.error('Error in updateFarm:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update farm'
      };
    }
  }

  async deleteFarm(farmId) {
    try {
      const deletedFarm = await CoffeeModel.deleteFarm(farmId);
      
      if (!deletedFarm) {
        return {
          success: false,
          message: `Farm with ID ${farmId} not found`
        };
      }

      return {
        success: true,
        data: deletedFarm,
        message: 'Farm deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteFarm:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete farm'
      };
    }
  }

  async searchFarms(searchTerm) {
    try {
      const farms = await CoffeeModel.searchFarms(searchTerm);
      return {
        success: true,
        data: farms,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error in searchFarms:', error);
      return {
        success: false,
        error: error.message,
        message: 'Search failed'
      };
    }
  }

  async getProductionStats() {
    try {
      const stats = await CoffeeModel.getProductionStats();
      return {
        success: true,
        data: stats,
        message: 'Production statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getProductionStats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve statistics'
      };
    }
  }

  validateFarmData(farmData, isUpdate = false) {
    if (!isUpdate && !farmData.farm_id) {
      return 'Farm ID is required';
    }

    if (!farmData.farm_name) {
      return 'Farm name is required';
    }

    if (!farmData.location) {
      return 'Location is required';
    }

    if (!farmData.size_acres || isNaN(farmData.size_acres) || farmData.size_acres <= 0) {
      return 'Valid farm size in acres is required';
    }

    if (!farmData.coffee_variety) {
      return 'Coffee variety is required';
    }

    return null;
  }
}

export default new CoffeePresenter();
