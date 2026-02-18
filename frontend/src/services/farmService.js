import api from './authService';

// Coffee Farm Service - API calls
export const coffeeService = {
  // Get all coffee farms
  async getAllFarms() {
    try {
      const response = await api.get('/coffee/farms');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to load farms' };
    }
  },

  // Get farm by ID
  async getFarmById(farmId) {
    try {
      const response = await api.get(`/coffee/farms/${farmId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to load farm' };
    }
  },

  // Create new farm
  async createFarm(farmData) {
    try {
      const response = await api.post('/coffee/farms', farmData);
      return { success: true, data: response.data.data, message: 'Farm created successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to create farm' };
    }
  },

  // Update farm
  async updateFarm(farmId, farmData) {
    try {
      const response = await api.put(`/coffee/farms/${farmId}`, farmData);
      return { success: true, data: response.data.data, message: 'Farm updated successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to update farm' };
    }
  },

  // Delete farm
  async deleteFarm(farmId) {
    try {
      await api.delete(`/coffee/farms/${farmId}`);
      return { success: true, message: 'Farm deleted successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to delete farm' };
    }
  }
};

// Matooke Farm Service - API calls
export const matookeService = {
  // Get all matooke farms
  async getAllFarms() {
    try {
      const response = await api.get('/matooke/farms');
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to load farms' };
    }
  },

  // Get farm by ID
  async getFarmById(farmId) {
    try {
      const response = await api.get(`/matooke/farms/${farmId}`);
      return { success: true, data: response.data.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to load farm' };
    }
  },

  // Create new farm
  async createFarm(farmData) {
    try {
      const response = await api.post('/matooke/farms', farmData);
      return { success: true, data: response.data.data, message: 'Farm created successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to create farm' };
    }
  },

  // Update farm
  async updateFarm(farmId, farmData) {
    try {
      const response = await api.put(`/matooke/farms/${farmId}`, farmData);
      return { success: true, data: response.data.data, message: 'Farm updated successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to update farm' };
    }
  },

  // Delete farm
  async deleteFarm(farmId) {
    try {
      await api.delete(`/matooke/farms/${farmId}`);
      return { success: true, message: 'Farm deleted successfully' };
    } catch (error) {
      return { success: false, message: error.response?.data?.error || 'Failed to delete farm' };
    }
  }
};
