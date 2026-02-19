import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';
import goatAutoIntegrationService from '../services/goatAutoIntegrationService.js';

// Presenter - Business logic layer
class GoatPresenter {
  // Get all goats
  async getAllGoats() {
    try {
      const goats = await GoatModel.getAllGoats();
      return {
        success: true,
        data: goats,
        message: 'Goats retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllGoats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goats'
      };
    }
  }

  // Get goat by ID
  async getGoatById(goatId) {
    try {
      const goat = await GoatModel.getGoatById(goatId);
      
      if (!goat) {
        return {
          success: false,
          message: `Goat with ID ${goatId} not found`
        };
      }

      return {
        success: true,
        data: goat,
        message: 'Goat retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getGoatById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goat'
      };
    }
  }

  // Create new goat
  async createGoat(goatData, user = null) {
    try {
      // Validation
      const validationError = this.validateGoatData(goatData);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      // Check if goat ID already exists
      const existingGoat = await GoatModel.getGoatById(goatData.goat_id);
      if (existingGoat) {
        return {
          success: false,
          message: `Goat with ID ${goatData.goat_id} already exists`
        };
      }

      // Validate parent IDs if provided
      if (goatData.mother_id) {
        const mother = await GoatModel.getGoatById(goatData.mother_id);
        if (!mother || mother.sex !== 'Female') {
          return {
            success: false,
            message: 'Invalid mother ID or mother is not female'
          };
        }
      }

      if (goatData.father_id) {
        const father = await GoatModel.getGoatById(goatData.father_id);
        if (!father || father.sex !== 'Male') {
          return {
            success: false,
            message: 'Invalid father ID or father is not male'
          };
        }
      }

      const newGoat = await GoatModel.createGoat(goatData);
      
      // Run auto-integration service (vaccinations, health checks, growth tracking, etc.)
      // This runs asynchronously to not block the response
      const performedBy = user?.userId || null;
      const performedByName = user?.fullName || user?.email || null;
      
      goatAutoIntegrationService.integrateNewGoat(newGoat, performedBy, performedByName).catch(err => 
        console.error('Failed to complete auto-integration:', err)
      );
      
      return {
        success: true,
        data: newGoat,
        message: 'Goat registered successfully with auto-integration scheduled'
      };
    } catch (error) {
      console.error('Error in createGoat:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to register goat'
      };
    }
  }

  // Update goat
  async updateGoat(goatId, goatData, performedBy = null, performedByName = null) {
    try {
      // Check if goat exists
      const existingGoat = await GoatModel.getGoatById(goatId);
      if (!existingGoat) {
        return {
          success: false,
          message: `Goat with ID ${goatId} not found`
        };
      }

      // Validation
      const validationError = this.validateGoatData(goatData, true);
      if (validationError) {
        console.error('Validation failed for goat update:', {
          goatId,
          error: validationError,
          receivedData: goatData
        });
        return {
          success: false,
          message: validationError
        };
      }

      const updatedGoat = await GoatModel.updateGoat(goatId, goatData);
      
      // Send notification to admins
      notificationHelper.notifyGoatUpdated(updatedGoat, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedGoat,
        message: 'Goat updated successfully'
      };
    } catch (error) {
      console.error('Error in updateGoat:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update goat'
      };
    }
  }

  // Delete goat
  async deleteGoat(goatId) {
    try {
      // Check if goat has offspring
      const offspring = await GoatModel.getOffspring(goatId);
      if (offspring.length > 0) {
        return {
          success: false,
          message: `Cannot delete goat ${goatId}. It has ${offspring.length} registered offspring.`
        };
      }

      const deletedGoat = await GoatModel.deleteGoat(goatId);
      
      if (!deletedGoat) {
        return {
          success: false,
          message: `Goat with ID ${goatId} not found`
        };
      }

      return {
        success: true,
        data: deletedGoat,
        message: 'Goat deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteGoat:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete goat'
      };
    }
  }

  // Get goats by status
  async getGoatsByStatus(status) {
    try {
      const goats = await GoatModel.getGoatsByStatus(status);
      return {
        success: true,
        data: goats,
        message: `Goats with status '${status}' retrieved successfully`
      };
    } catch (error) {
      console.error('Error in getGoatsByStatus:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve goats by status'
      };
    }
  }

  // Get offspring
  async getOffspring(goatId, parentType = 'both') {
    try {
      const offspring = await GoatModel.getOffspring(goatId, parentType);
      return {
        success: true,
        data: offspring,
        message: 'Offspring retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getOffspring:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve offspring'
      };
    }
  }

  // Search goats
  async searchGoats(searchTerm) {
    try {
      const goats = await GoatModel.searchGoats(searchTerm);
      return {
        success: true,
        data: goats,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error in searchGoats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Search failed'
      };
    }
  }

  // Validation helper
  validateGoatData(goatData, isUpdate = false) {
    if (!isUpdate && !goatData.goat_id) {
      return 'Goat ID is required';
    }

    // For new goats, require all essential fields
    // For updates, only validate if fields are provided (not empty)
    if (!isUpdate) {
      if (!goatData.breed) {
        return 'Breed is required';
      }
      if (!goatData.sex || !['Male', 'Female'].includes(goatData.sex)) {
        return 'Sex must be either Male or Female';
      }
      if (!goatData.date_of_birth) {
        return 'Date of birth is required';
      }
    } else {
      // For updates, validate format only if provided
      if (goatData.sex && !['Male', 'Female'].includes(goatData.sex)) {
        return 'Sex must be either Male or Female';
      }
    }

    // Production type is optional now
    // Status defaults to 'Active' if not provided
    
    if (goatData.weight && goatData.weight !== '' && (isNaN(goatData.weight) || goatData.weight < 0)) {
      return 'Weight must be a positive number';
    }

    return null;
  }
}

export default new GoatPresenter();
