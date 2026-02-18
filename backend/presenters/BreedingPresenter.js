import BreedingModel from '../models/BreedingModel.js';
import GoatModel from '../models/GoatModel.js';
import notificationHelper from '../utils/notificationHelper.js';

// Presenter - Business logic layer for Breeding operations
class BreedingPresenter {
  async getAllRecords() {
    try {
      const records = await BreedingModel.getAllRecords();
      return {
        success: true,
        data: records,
        message: 'Breeding records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getAllRecords:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve breeding records'
      };
    }
  }

  async getRecordById(breedingId) {
    try {
      const record = await BreedingModel.getRecordById(breedingId);
      
      if (!record) {
        return {
          success: false,
          message: `Breeding record with ID ${breedingId} not found`
        };
      }

      return {
        success: true,
        data: record,
        message: 'Breeding record retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordById:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve breeding record'
      };
    }
  }

  async createRecord(breedingData, performedBy = null, performedByName = null) {
    try {
      const validationError = await this.validateBreedingData(breedingData);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      // Calculate expected kidding date (150 days from mating for goats)
      if (!breedingData.expected_kidding_date && breedingData.mating_time) {
        const matingDate = new Date(breedingData.mating_time);
        const expectedDate = new Date(matingDate);
        expectedDate.setDate(expectedDate.getDate() + 150); // Average goat gestation
        breedingData.expected_kidding_date = expectedDate.toISOString().split('T')[0];
      }

      const newRecord = await BreedingModel.createRecord(breedingData);
      
      // Send notification to admins
      notificationHelper.notifyBreedingCreated(newRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: newRecord,
        message: 'Breeding record created successfully'
      };
    } catch (error) {
      console.error('Error in createRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to create breeding record'
      };
    }
  }

  async updateRecord(breedingId, breedingData, performedBy = null, performedByName = null) {
    try {
      const existingRecord = await BreedingModel.getRecordById(breedingId);
      if (!existingRecord) {
        return {
          success: false,
          message: `Breeding record with ID ${breedingId} not found`
        };
      }

      const validationError = await this.validateBreedingData(breedingData, true);
      if (validationError) {
        return {
          success: false,
          message: validationError
        };
      }

      const updatedRecord = await BreedingModel.updateRecord(breedingId, breedingData);
      
      // Send notification to admins
      notificationHelper.notifyBreedingUpdated(updatedRecord, performedBy, performedByName).catch(err => 
        console.error('Failed to send notification:', err)
      );
      
      return {
        success: true,
        data: updatedRecord,
        message: 'Breeding record updated successfully'
      };
    } catch (error) {
      console.error('Error in updateRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to update breeding record'
      };
    }
  }

  async deleteRecord(breedingId) {
    try {
      const deletedRecord = await BreedingModel.deleteRecord(breedingId);
      
      if (!deletedRecord) {
        return {
          success: false,
          message: `Breeding record with ID ${breedingId} not found`
        };
      }

      return {
        success: true,
        data: deletedRecord,
        message: 'Breeding record deleted successfully'
      };
    } catch (error) {
      console.error('Error in deleteRecord:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete breeding record'
      };
    }
  }

  async getRecordsByDoe(doeId) {
    try {
      const records = await BreedingModel.getRecordsByDoe(doeId);
      return {
        success: true,
        data: records,
        message: 'Doe breeding records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordsByDoe:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve doe breeding records'
      };
    }
  }

  async getRecordsByBuck(buckId) {
    try {
      const records = await BreedingModel.getRecordsByBuck(buckId);
      return {
        success: true,
        data: records,
        message: 'Buck breeding records retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getRecordsByBuck:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve buck breeding records'
      };
    }
  }

  async getUpcomingKidding() {
    try {
      const records = await BreedingModel.getUpcomingKidding();
      return {
        success: true,
        data: records,
        message: 'Upcoming kidding dates retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getUpcomingKidding:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve upcoming kidding dates'
      };
    }
  }

  async searchRecords(searchTerm) {
    try {
      const records = await BreedingModel.searchRecords(searchTerm);
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

  async getBreedingStats() {
    try {
      const stats = await BreedingModel.getBreedingStats();
      return {
        success: true,
        data: stats,
        message: 'Breeding statistics retrieved successfully'
      };
    } catch (error) {
      console.error('Error in getBreedingStats:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve breeding statistics'
      };
    }
  }

  async validateBreedingData(breedingData, isUpdate = false) {
    if (!breedingData.doe_id) {
      return 'Doe ID is required';
    }

    if (!breedingData.buck_id) {
      return 'Buck ID is required';
    }

    // Validate that doe exists and is female
    const doe = await GoatModel.getGoatById(breedingData.doe_id);
    if (!doe) {
      return `Doe with ID ${breedingData.doe_id} not found`;
    }
    if (doe.sex !== 'Female') {
      return `Goat ${breedingData.doe_id} is not a female (doe)`;
    }

    // Validate that buck exists and is male
    const buck = await GoatModel.getGoatById(breedingData.buck_id);
    if (!buck) {
      return `Buck with ID ${breedingData.buck_id} not found`;
    }
    if (buck.sex !== 'Male') {
      return `Goat ${breedingData.buck_id} is not a male (buck)`;
    }

    if (!breedingData.heat_observed || !['Yes', 'No'].includes(breedingData.heat_observed)) {
      return 'Heat observed must be Yes or No';
    }

    if (!breedingData.mating_time) {
      return 'Mating time is required';
    }

    // Validate kidding numbers
    if (breedingData.male_kids && breedingData.female_kids && breedingData.no_of_kids) {
      const totalKids = parseInt(breedingData.male_kids) + parseInt(breedingData.female_kids);
      if (totalKids !== parseInt(breedingData.no_of_kids)) {
        return 'Male kids + Female kids must equal total number of kids';
      }
    }

    return null;
  }
}

export default new BreedingPresenter();
