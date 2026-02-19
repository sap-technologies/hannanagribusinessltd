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
      console.log('Creating goat with data:', JSON.stringify(goatData, null, 2));
      
      // Sanitize data: convert empty strings to null for optional fields
      const sanitizedData = { ...goatData };
      const optionalFields = ['source', 'mother_id', 'father_id', 'weight', 'remarks', 'production_type'];
      optionalFields.forEach(field => {
        if (sanitizedData[field] === '' || sanitizedData[field] === undefined) {
          sanitizedData[field] = null;
        }
      });
      
      // Validation
      const validationError = this.validateGoatData(sanitizedData);
      if (validationError) {
        console.error('Validation failed for new goat:', {
          error: validationError,
          receivedData: sanitizedData
        });
        return {
          success: false,
          message: validationError,
          field: this.getValidationField(validationError)
        };
      }

      // Check if goat ID already exists
      const existingGoat = await GoatModel.getGoatById(sanitizedData.goat_id);
      if (existingGoat) {
        return {
          success: false,
          message: `Goat with ID ${sanitizedData.goat_id} already exists`
        };
      }

      // Validate parent IDs if provided
      if (sanitizedData.mother_id) {
        const mother = await GoatModel.getGoatById(sanitizedData.mother_id);
        if (!mother || mother.sex !== 'Female') {
          return {
            success: false,
            message: 'Invalid mother ID or mother is not female'
          };
        }
      }

      if (sanitizedData.father_id) {
        const father = await GoatModel.getGoatById(sanitizedData.father_id);
        if (!father || father.sex !== 'Male') {
          return {
            success: false,
            message: 'Invalid father ID or father is not male'
          };
        }
      }

      const newGoat = await GoatModel.createGoat(sanitizedData);
      
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
      // Log what we're receiving
      console.log('🔍 UpdateGoat called with:', {
        goatId,
        dataKeys: Object.keys(goatData),
        photoFilePresent: !!goatData.photoFile,
        performedBy
      });
      
      // Sanitize data: convert empty strings to null for optional fields
      const sanitizedData = { ...goatData };
      const optionalFields = ['source', 'mother_id', 'father_id', 'weight', 'remarks', 'production_type'];
      optionalFields.forEach(field => {
        if (sanitizedData[field] === '' || sanitizedData[field] === undefined) {
          sanitizedData[field] = null;
        }
      });
      
      // Check if goat exists
      const existingGoat = await GoatModel.getGoatById(goatId);
      if (!existingGoat) {
        return {
          success: false,
          message: `Goat with ID ${goatId} not found`
        };
      }

      // Validation
      const validationError = this.validateGoatData(sanitizedData, true);
      if (validationError) {
        console.error('❌ Validation failed for goat update:', {
          goatId,
          error: validationError,
          receivedDataKeys: Object.keys(goatData),
          problematicFields: Object.entries(goatData).filter(([k, v]) => 
            v !== null && v !== undefined && v !== '' && typeof v === 'object' && !(v instanceof Date)
          )
        });
        return {
          success: false,
          message: validationError
        };
      }

      // Track changes for detailed notification
      const changes = this.detectChanges(existingGoat, sanitizedData);

      const updatedGoat = await GoatModel.updateGoat(goatId, sanitizedData);
      
      // Send notification to admins with details of what changed
      notificationHelper.notifyGoatUpdated(updatedGoat, changes, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedGoat,
        message: 'Goat updated successfully'
      };
    } catch (error) {
      console.error('💥 Error in updateGoat:', error);
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

  // Helper to identify which field caused validation error
  getValidationField(errorMessage) {
    if (errorMessage.includes('Goat ID')) return 'goat_id';
    if (errorMessage.includes('Breed')) return 'breed';
    if (errorMessage.includes('Sex')) return 'sex';
    if (errorMessage.includes('Date of birth')) return 'date_of_birth';
    if (errorMessage.includes('Weight')) return 'weight';
    return null;
  }

  // Helper to detect what changed in goat data
  detectChanges(oldData, newData) {
    const changes = [];
    const fieldsToCheck = {
      breed: 'Breed',
      sex: 'Sex',
      date_of_birth: 'Date of Birth',
      production_type: 'Production Type',
      status: 'Status',
      weight: 'Weight',
      source: 'Source',
      mother_id: 'Mother ID',
      father_id: 'Father ID',
      remarks: 'Remarks',
      photo_url: 'Photo'
    };

    for (const [field, label] of Object.entries(fieldsToCheck)) {
      if (newData[field] !== undefined && newData[field] !== oldData[field]) {
        const oldValue = oldData[field] || '(empty)';
        const newValue = newData[field] || '(empty)';
        
        // Special handling for date fields
        if (field === 'date_of_birth') {
          changes.push(`${label}: ${new Date(oldValue).toLocaleDateString()} → ${new Date(newValue).toLocaleDateString()}`);
        } 
        // Special handling for photo
        else if (field === 'photo_url') {
          changes.push(`${label} updated`);
        }
        else {
          changes.push(`${label}: ${oldValue} → ${newValue}`);
        }
      }
    }

    return changes;
  }
}

export default new GoatPresenter();
