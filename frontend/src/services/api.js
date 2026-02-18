import axios from 'axios';

// Use environment variable for API URL, fallback to relative path in development
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add authentication token to all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle authentication errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

// ========== BREEDING FARM (GOAT) API ==========
export const goatService = {
  getAllGoats: async () => {
    const response = await apiClient.get('/breeding-farm/goats');
    return response.data;
  },

  getGoatById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/goats/${id}`);
    return response.data;
  },

  createGoat: async (goatData) => {
    const response = await apiClient.post('/breeding-farm/goats', goatData);
    return response.data;
  },

  updateGoat: async (id, goatData) => {
    const response = await apiClient.put(`/breeding-farm/goats/${id}`, goatData);
    return response.data;
  },

  deleteGoat: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/goats/${id}`);
    return response.data;
  },

  getGoatsByStatus: async (status) => {
    const response = await apiClient.get(`/breeding-farm/goats/status/${status}`);
    return response.data;
  },

  getOffspring: async (id, type = 'both') => {
    const response = await apiClient.get(`/breeding-farm/goats/${id}/offspring?type=${type}`);
    return response.data;
  },

  searchGoats: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/goats/search/${searchTerm}`);
    return response.data;
  },
};

// ========== BREEDING & KIDDING API ==========
export const breedingService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/breeding');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/breeding/${id}`);
    return response.data;
  },

  createRecord: async (breedingData) => {
    const response = await apiClient.post('/breeding-farm/breeding', breedingData);
    return response.data;
  },

  updateRecord: async (id, breedingData) => {
    const response = await apiClient.put(`/breeding-farm/breeding/${id}`, breedingData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/breeding/${id}`);
    return response.data;
  },

  getRecordsByDoe: async (doeId) => {
    const response = await apiClient.get(`/breeding-farm/breeding/doe/${doeId}`);
    return response.data;
  },

  getRecordsByBuck: async (buckId) => {
    const response = await apiClient.get(`/breeding-farm/breeding/buck/${buckId}`);
    return response.data;
  },

  getUpcomingKidding: async () => {
    const response = await apiClient.get('/breeding-farm/breeding/upcoming');
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/breeding/search?term=${searchTerm}`);
    return response.data;
  },

  getBreedingStats: async () => {
    const response = await apiClient.get('/breeding-farm/breeding/stats');
    return response.data;
  },
};

// ========== KID GROWTH & WEANING API ==========
export const kidGrowthService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/kid-growth');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/kid-growth/${id}`);
    return response.data;
  },

  getRecordByKidId: async (kidId) => {
    const response = await apiClient.get(`/breeding-farm/kid-growth/kid/${kidId}`);
    return response.data;
  },

  createRecord: async (growthData) => {
    const response = await apiClient.post('/breeding-farm/kid-growth', growthData);
    return response.data;
  },

  updateRecord: async (id, growthData) => {
    const response = await apiClient.put(`/breeding-farm/kid-growth/${id}`, growthData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/kid-growth/${id}`);
    return response.data;
  },

  getRecordsByTargetMarket: async (targetMarket) => {
    const response = await apiClient.get(`/breeding-farm/kid-growth/market/${targetMarket}`);
    return response.data;
  },

  getReadyForWeaning: async () => {
    const response = await apiClient.get('/breeding-farm/kid-growth/ready-for-weaning');
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/kid-growth/search?term=${searchTerm}`);
    return response.data;
  },

  getGrowthStats: async () => {
    const response = await apiClient.get('/breeding-farm/kid-growth/stats');
    return response.data;
  },
};

// ========== HEALTH & TREATMENT API ==========
export const healthService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/health');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/health/${id}`);
    return response.data;
  },

  createRecord: async (healthData) => {
    const response = await apiClient.post('/breeding-farm/health', healthData);
    return response.data;
  },

  updateRecord: async (id, healthData) => {
    const response = await apiClient.put(`/breeding-farm/health/${id}`, healthData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/health/${id}`);
    return response.data;
  },

  getRecordsByGoatId: async (goatId) => {
    const response = await apiClient.get(`/breeding-farm/health/goat/${goatId}`);
    return response.data;
  },

  getRecordsByRecoveryStatus: async (status) => {
    const response = await apiClient.get(`/breeding-farm/health/status/${status}`);
    return response.data;
  },

  getPendingFollowUp: async () => {
    const response = await apiClient.get('/breeding-farm/health/pending-followup');
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/health/search?term=${searchTerm}`);
    return response.data;
  },

  getHealthStats: async () => {
    const response = await apiClient.get('/breeding-farm/health/stats');
    return response.data;
  },

  getCostsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/breeding-farm/health/costs?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },
};

// ========== VACCINATION & DEWORMING API ==========
export const vaccinationService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/vaccination');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/vaccination/${id}`);
    return response.data;
  },

  createRecord: async (vaccinationData) => {
    const response = await apiClient.post('/breeding-farm/vaccination', vaccinationData);
    return response.data;
  },

  updateRecord: async (id, vaccinationData) => {
    const response = await apiClient.put(`/breeding-farm/vaccination/${id}`, vaccinationData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/vaccination/${id}`);
    return response.data;
  },

  getRecordsByGoatId: async (goatId) => {
    const response = await apiClient.get(`/breeding-farm/vaccination/goat/${goatId}`);
    return response.data;
  },

  getRecordsByType: async (type) => {
    const response = await apiClient.get(`/breeding-farm/vaccination/type/${type}`);
    return response.data;
  },

  getUpcomingDue: async (daysAhead = 30) => {
    const response = await apiClient.get(`/breeding-farm/vaccination/upcoming-due?days=${daysAhead}`);
    return response.data;
  },

  getOverdue: async () => {
    const response = await apiClient.get('/breeding-farm/vaccination/overdue');
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/vaccination/search?term=${searchTerm}`);
    return response.data;
  },

  getVaccinationStats: async () => {
    const response = await apiClient.get('/breeding-farm/vaccination/stats');
    return response.data;
  },
};

// ========== FEEDING & FATTENING API ==========
export const feedingService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/feeding');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/feeding/${id}`);
    return response.data;
  },

  createRecord: async (feedingData) => {
    const response = await apiClient.post('/breeding-farm/feeding', feedingData);
    return response.data;
  },

  updateRecord: async (id, feedingData) => {
    const response = await apiClient.put(`/breeding-farm/feeding/${id}`, feedingData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/feeding/${id}`);
    return response.data;
  },

  getRecordsByGoatId: async (goatId) => {
    const response = await apiClient.get(`/breeding-farm/feeding/goat/${goatId}`);
    return response.data;
  },

  getRecordsByGroup: async (groupName) => {
    const response = await apiClient.get(`/breeding-farm/feeding/group/${groupName}`);
    return response.data;
  },

  getRecordsByPurpose: async (purpose) => {
    const response = await apiClient.get(`/breeding-farm/feeding/purpose/${purpose}`);
    return response.data;
  },

  getRecordsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/breeding-farm/feeding/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/feeding/search?term=${searchTerm}`);
    return response.data;
  },

  getFeedingStats: async () => {
    const response = await apiClient.get('/breeding-farm/feeding/stats');
    return response.data;
  },

  getFeedConsumptionByType: async () => {
    const response = await apiClient.get('/breeding-farm/feeding/consumption-by-type');
    return response.data;
  },
};

// ========== SALES - BREEDING API ==========
export const salesBreedingService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/sales-breeding');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/${id}`);
    return response.data;
  },

  createRecord: async (saleData) => {
    const response = await apiClient.post('/breeding-farm/sales-breeding', saleData);
    return response.data;
  },

  updateRecord: async (id, saleData) => {
    const response = await apiClient.put(`/breeding-farm/sales-breeding/${id}`, saleData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/sales-breeding/${id}`);
    return response.data;
  },

  getRecordsByGoatId: async (goatId) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/goat/${goatId}`);
    return response.data;
  },

  getRecordsByBuyer: async (buyer) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/buyer/${buyer}`);
    return response.data;
  },

  getRecordsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getRecordsByPaymentMethod: async (method) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/payment/${method}`);
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/sales-breeding/search?term=${searchTerm}`);
    return response.data;
  },

  getSalesStats: async () => {
    const response = await apiClient.get('/breeding-farm/sales-breeding/stats');
    return response.data;
  },

  getSalesByBreed: async () => {
    const response = await apiClient.get('/breeding-farm/sales-breeding/by-breed');
    return response.data;
  },
};

// ========== SALES - MEAT API ==========
export const salesMeatService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/sales-meat');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/${id}`);
    return response.data;
  },

  createRecord: async (saleData) => {
    const response = await apiClient.post('/breeding-farm/sales-meat', saleData);
    return response.data;
  },

  updateRecord: async (id, saleData) => {
    const response = await apiClient.put(`/breeding-farm/sales-meat/${id}`, saleData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/sales-meat/${id}`);
    return response.data;
  },

  getRecordsByGoatId: async (goatId) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/goat/${goatId}`);
    return response.data;
  },

  getRecordsByBuyer: async (buyer) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/buyer/${buyer}`);
    return response.data;
  },

  getRecordsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getRecordsByPaymentMethod: async (method) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/payment/${method}`);
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/sales-meat/search?term=${searchTerm}`);
    return response.data;
  },

  getSalesStats: async () => {
    const response = await apiClient.get('/breeding-farm/sales-meat/stats');
    return response.data;
  },

  getSalesByBreed: async () => {
    const response = await apiClient.get('/breeding-farm/sales-meat/by-breed');
    return response.data;
  },
};

// ========== EXPENSES API ==========
export const expensesService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/expenses');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/expenses/${id}`);
    return response.data;
  },

  createRecord: async (expenseData) => {
    const response = await apiClient.post('/breeding-farm/expenses', expenseData);
    return response.data;
  },

  updateRecord: async (id, expenseData) => {
    const response = await apiClient.put(`/breeding-farm/expenses/${id}`, expenseData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/expenses/${id}`);
    return response.data;
  },

  getRecordsByCategory: async (category) => {
    const response = await apiClient.get(`/breeding-farm/expenses/category/${category}`);
    return response.data;
  },

  getRecordsByDateRange: async (startDate, endDate) => {
    const response = await apiClient.get(`/breeding-farm/expenses/date-range?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  },

  getRecordsByPaidBy: async (paidBy) => {
    const response = await apiClient.get(`/breeding-farm/expenses/paid-by/${paidBy}`);
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/expenses/search?term=${searchTerm}`);
    return response.data;
  },

  getExpenseStats: async () => {
    const response = await apiClient.get('/breeding-farm/expenses/stats');
    return response.data;
  },

  getExpensesByCategory: async () => {
    const response = await apiClient.get('/breeding-farm/expenses/by-category');
    return response.data;
  },

  getMonthlyExpenses: async () => {
    const response = await apiClient.get('/breeding-farm/expenses/monthly');
    return response.data;
  },
};

// ========== MONTHLY SUMMARY API ==========
export const monthlySummaryService = {
  getAllRecords: async () => {
    const response = await apiClient.get('/breeding-farm/monthly-summary');
    return response.data;
  },

  getRecordById: async (id) => {
    const response = await apiClient.get(`/breeding-farm/monthly-summary/${id}`);
    return response.data;
  },

  getRecordByMonth: async (month) => {
    const response = await apiClient.get(`/breeding-farm/monthly-summary/month/${month}`);
    return response.data;
  },

  createRecord: async (summaryData) => {
    const response = await apiClient.post('/breeding-farm/monthly-summary', summaryData);
    return response.data;
  },

  updateRecord: async (id, summaryData) => {
    const response = await apiClient.put(`/breeding-farm/monthly-summary/${id}`, summaryData);
    return response.data;
  },

  deleteRecord: async (id) => {
    const response = await apiClient.delete(`/breeding-farm/monthly-summary/${id}`);
    return response.data;
  },

  getRecordsByDateRange: async (startMonth, endMonth) => {
    const response = await apiClient.get(`/breeding-farm/monthly-summary/date-range?startMonth=${startMonth}&endMonth=${endMonth}`);
    return response.data;
  },

  getRecordsByYear: async (year) => {
    const response = await apiClient.get(`/breeding-farm/monthly-summary/year/${year}`);
    return response.data;
  },

  searchRecords: async (searchTerm) => {
    const response = await apiClient.get(`/breeding-farm/monthly-summary/search?term=${searchTerm}`);
    return response.data;
  },

  getSummaryStats: async () => {
    const response = await apiClient.get('/breeding-farm/monthly-summary/stats');
    return response.data;
  },

  getYearlySummary: async () => {
    const response = await apiClient.get('/breeding-farm/monthly-summary/yearly');
    return response.data;
  },

  getLatestSummary: async () => {
    const response = await apiClient.get('/breeding-farm/monthly-summary/latest');
    return response.data;
  },
};

// ========== MATOOKE PROJECT API ==========
export const matookeService = {
  getAllFarms: async () => {
    const response = await apiClient.get('/matooke');
    return response.data;
  },

  getFarmById: async (id) => {
    const response = await apiClient.get(`/matooke/${id}`);
    return response.data;
  },

  createFarm: async (farmData) => {
    const response = await apiClient.post('/matooke', farmData);
    return response.data;
  },

  updateFarm: async (id, farmData) => {
    const response = await apiClient.put(`/matooke/${id}`, farmData);
    return response.data;
  },

  deleteFarm: async (id) => {
    const response = await apiClient.delete(`/matooke/${id}`);
    return response.data;
  },

  searchFarms: async (searchTerm) => {
    const response = await apiClient.get(`/matooke/search/${searchTerm}`);
    return response.data;
  },

  getProductionStats: async () => {
    const response = await apiClient.get('/matooke/stats/production');
    return response.data;
  },
};

// ========== COFFEE PROJECT API ==========
export const coffeeService = {
  getAllFarms: async () => {
    const response = await apiClient.get('/coffee');
    return response.data;
  },

  getFarmById: async (id) => {
    const response = await apiClient.get(`/coffee/${id}`);
    return response.data;
  },

  createFarm: async (farmData) => {
    const response = await apiClient.post('/coffee', farmData);
    return response.data;
  },

  updateFarm: async (id, farmData) => {
    const response = await apiClient.put(`/coffee/${id}`, farmData);
    return response.data;
  },

  deleteFarm: async (id) => {
    const response = await apiClient.delete(`/coffee/${id}`);
    return response.data;
  },

  searchFarms: async (searchTerm) => {
    const response = await apiClient.get(`/coffee/search/${searchTerm}`);
    return response.data;
  },

  getProductionStats: async () => {
    const response = await apiClient.get('/coffee/stats/production');
    return response.data;
  },
};

// ========== UPLOAD API ==========
export const uploadService = {
  uploadGoatPhoto: async (goatId, photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/upload/goat-photo/${goatId}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  uploadProfilePhoto: async (photoFile) => {
    const formData = new FormData();
    formData.append('photo', photoFile);

    const token = localStorage.getItem('authToken');
    const response = await axios.post(
      `${API_BASE_URL}/upload/profile-photo`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },

  deleteProfilePhoto: async () => {
    const token = localStorage.getItem('authToken');
    const response = await axios.delete(
      `${API_BASE_URL}/upload/profile-photo`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};

// ========== NOTIFICATION API ==========
export const notificationService = {
  getUnreadCount: async () => {
    const response = await apiClient.get('/notifications/unread-count');
    return response.data;
  },

  getAll: async () => {
    const response = await apiClient.get('/notifications');
    return response.data;
  },

  markAsRead: async (id) => {
    const response = await apiClient.put(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiClient.put('/notifications/mark-all-read');
    return response.data;
  },

  delete: async (id) => {
    const response = await apiClient.delete(`/notifications/${id}`);
    return response.data;
  },
};

// ========== REMINDER API ==========
export const reminderService = {
  getActiveReminders: async () => {
    const response = await apiClient.get('/reminders');
    return response.data;
  },

  completeReminder: async (id) => {
    const response = await apiClient.put(`/reminders/${id}/complete`);
    return response.data;
  },

  runDailyChecks: async () => {
    const response = await apiClient.post('/reminders/daily-checks');
    return response.data;
  },

  checkVaccinations: async () => {
    const response = await apiClient.post('/reminders/check-vaccinations');
    return response.data;
  },

  checkBreeding: async () => {
    const response = await apiClient.post('/reminders/check-breeding');
    return response.data;
  },

  checkHealth: async () => {
    const response = await apiClient.post('/reminders/check-health');
    return response.data;
  },
};

// ========== REPORT API ==========
export const reportService = {
  generateMonthlySummaryPDF: async (year, month) => {
    const response = await apiClient.get(`/reports/pdf/monthly-summary/${year}/${month}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  generateGoatsListPDF: async () => {
    const response = await apiClient.get('/reports/pdf/goats-list', {
      responseType: 'blob'
    });
    return response.data;
  },

  generateHealthSummaryPDF: async () => {
    const response = await apiClient.get('/reports/pdf/health-summary', {
      responseType: 'blob'
    });
    return response.data;
  },

  generateSalesSummaryPDF: async (year, month) => {
    const response = await apiClient.get(`/reports/pdf/sales-summary/${year}/${month}`, {
      responseType: 'blob'
    });
    return response.data;
  },

  exportGoatsToExcel: async () => {
    const response = await apiClient.get('/reports/excel/goats', {
      responseType: 'blob'
    });
    return response.data;
  },

  exportHealthToExcel: async () => {
    const response = await apiClient.get('/reports/excel/health', {
      responseType: 'blob'
    });
    return response.data;
  },

  exportSalesToExcel: async () => {
    const response = await apiClient.get('/reports/excel/sales', {
      responseType: 'blob'
    });
    return response.data;
  },
};

// ========== SEARCH API ==========
export const searchService = {
  searchGoats: async (filters) => {
    const response = await apiClient.post('/search/goats', filters);
    return response.data;
  },

  searchHealthRecords: async (filters) => {
    const response = await apiClient.post('/search/health-records', filters);
    return response.data;
  },

  searchSales: async (filters) => {
    const response = await apiClient.post('/search/sales', filters);
    return response.data;
  },

  getFilterOptions: async () => {
    const response = await apiClient.get('/search/filter-options');
    return response.data;
  },
};

export default apiClient;
