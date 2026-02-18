import KidGrowthModel from '../models/KidGrowthModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

// Presenter - Business logic layer for Kid Growth operations
class KidGrowthPresenter {
  async getAllRecords() {
    try {
      const records = await KidGrowthModel.getAllRecords();
      return {
        success: true,
        data: records,
        message: 'Kid growth records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllRecords:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kid growth records'
      };
    }
  }

  async getRecordById(growthId) {
    try {
      const record = await KidGrowthModel.getRecordById(growthId);
      
      if (!record) {
        return {
          success: false,
          message: `Kid growth record with ID ${growthId} not found`
        };
      }

      return {
        success: true,
        data: record,
        message: 'Kid growth record retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kid growth record'
      };
    }
  }

  async getRecordByKidId(kidId) {
    try {
      const record = await KidGrowthModel.getRecordByKidId(kidId);
      
      if (!record) {
        return {
          success: false,
          message: `No growth record found for kid ${kidId}`
        };
      }

      return {
        success: true,
        data: record,
        message: 'Kid growth record retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordByKidId:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kid growth record'
      };
    }
  }

  async createRecord(growthData, performedBy = null, performedByName = null) {
    try {
      const validationError = await this.validateGrowthData(growthData);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      // Check if record already exists for this kid
      const existingRecord = await KidGrowthModel.getRecordByKidId(growthData.kid_id);
      if (existingRecord) {
        return {
          success: false,
          message: `Growth record already exists for kid ${growthData.kid_id}. Use update instead.`
        };
      }

      const newRecord = await KidGrowthModel.createRecord(growthData);
      
      // Send notification to admins
      notificationHelper.notifyKidGrowthCreated(newRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: newRecord,
        message: 'Kid growth record created successfully'
      };
    } catch (error) {
      console.error('Error in createRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create kid growth record'
      };
    }
  }

  async updateRecord(growthId, growthData, performedBy = null, performedByName = null) {
    try {
      const existingRecord = await KidGrowthModel.getRecordById(growthId);
      if (!existingRecord) {
        return {
          success: false,
          message: `Kid growth record with ID ${growthId} not found`
        };
      }

      const validationError = await this.validateGrowthData(growthData, true);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const updatedRecord = await KidGrowthModel.updateRecord(growthId, growthData);
      
      // Send notification to admins
      notificationHelper.notifyKidGrowthUpdated(updatedRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedRecord,
        message: 'Kid growth record updated successfully'
      };
    } catch (error) {
      console.error('Error in updateRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update kid growth record'
      };
    }
  }

  async deleteRecord(growthId) {
    try {
      const deletedRecord = await KidGrowthModel.deleteRecord(growthId);
      
      if (!deletedRecord) {
        return {
          success: false,
          message: `Kid growth record with ID ${growthId} not found`
        };
      }

      return {
        success: true,
        data: deletedRecord,
        message: 'Kid growth record deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete kid growth record'
      };
    }
  }

  async getRecordsByTargetMarket(targetMarket) {
    try {
      const records = await KidGrowthModel.getRecordsByTargetMarket(targetMarket);
      return {
        success: true,
        data: records,
        message: `${targetMarket} kids retrieved successfully`
      };
    } catch (error) {
      console.error('Error in getRecordsByTargetMarket:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kids by target market'
      };
    }
  }

  async getReadyForWeaning() {
    try {
      const records = await KidGrowthModel.getReadyForWeaning();
      return {
        success: true,
        data: records,
        message: 'Kids ready for weaning retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getReadyForWeaning:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kids ready for weaning'
      };
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await KidGrowthModel.searchRecords(searchTerm);
      return {
        success: true,
        data: records,
        message: 'Search completed successfully'
      };
    } catch (error) {
      console.error('Error in searchRecords:', error);
      return {
        success: false,
        error: error.message,
        message: 'Search failed'
      };
    }
  }

  async getGrowthStats() {
    try {
      const stats = await KidGrowthModel.getGrowthStats();
      return {
        success: true,
        data: stats,
        message: 'Kid growth statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getGrowthStats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve kid growth statistics'
      };
    }
  }

  async validateGrowthData(growthData, isUpdate = false) {
    if (!growthData.kid_id) {
      return 'Kid ID is required';
    }

    // Validate that kid exists
    const kid = await GoatModel.getGoatById(growthData.kid_id);
    if (!kid) {
      return `Kid with ID ${growthData.kid_id} not found`;
    }

    // Validate mother if provided
    if (growthData.mother_id) {
      const mother = await GoatModel.getGoatById(growthData.mother_id);
      if (!mother) {
        return `Mother with ID ${growthData.mother_id} not found`;
      }
      if (mother.sex !== 'Female') {
        return `Goat ${growthData.mother_id} is not a female (mother)`;
      }
    }

    // Validate target market
    if (growthData.target_market && !['Breeding', 'Meat'].includes(growthData.target_market)) {
      return 'Target market must be either Breeding or Meat';
    }

    // Validate weight values
    if (growthData.birth_weight && growthData.birth_weight < 0) {
      return 'Birth weight cannot be negative';
    }

    if (growthData.weaning_weight && growthData.weaning_weight < 0) {
      return 'Weaning weight cannot be negative';
    }

    return null;
  }
}

export default new KidGrowthPresenter();
