import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard';
import Toast from './components/Toast';
import GoatForm from './components/GoatForm';
import GoatList from './components/GoatList';
import GoatDetails from './components/GoatDetails';
import BreedingForm from './components/BreedingForm';
import BreedingList from './components/BreedingList';
import BreedingDetails from './components/BreedingDetails';
import KidGrowthForm from './components/KidGrowthForm';
import KidGrowthList from './components/KidGrowthList';
import KidGrowthDetails from './components/KidGrowthDetails';
import HealthForm from './components/HealthForm';
import HealthList from './components/HealthList';
import HealthDetails from './components/HealthDetails';
import VaccinationForm from './components/VaccinationForm';
import VaccinationList from './components/VaccinationList';
import VaccinationDetails from './components/VaccinationDetails';
import FeedingForm from './components/FeedingForm';
import FeedingList from './components/FeedingList';
import FeedingDetails from './components/FeedingDetails';
import SalesBreedingForm from './components/SalesBreedingForm';
import SalesBreedingList from './components/SalesBreedingList';
import SalesBreedingDetails from './components/SalesBreedingDetails';
import SalesMeatForm from './components/SalesMeatForm';
import SalesMeatList from './components/SalesMeatList';
import SalesMeatDetails from './components/SalesMeatDetails';
import ExpensesForm from './components/ExpensesForm';
import ExpensesList from './components/ExpensesList';
import ExpensesDetails from './components/ExpensesDetails';
import MonthlySummaryForm from './components/MonthlySummaryForm';
import MonthlySummaryList from './components/MonthlySummaryList';
import MonthlySummaryDetails from './components/MonthlySummaryDetails';
import GenerateReport from './components/GenerateReport';
import BreedingFarmSidebar from './components/BreedingFarmSidebar';
import MobileMenuButton from './components/MobileMenuButton';
import CoffeeProject from './components/CoffeeProject';
import MatookeProject from './components/MatookeProject';
import GoatPresenter from './presenters/GoatPresenter';
import BreedingPresenter from './presenters/BreedingPresenter';
import KidGrowthPresenter from './presenters/KidGrowthPresenter';
import HealthPresenter from './presenters/HealthPresenter';
import VaccinationPresenter from './presenters/VaccinationPresenter';
import FeedingPresenter from './presenters/FeedingPresenter';
import SalesBreedingPresenter from './presenters/SalesBreedingPresenter';
import SalesMeatPresenter from './presenters/SalesMeatPresenter';
import ExpensesPresenter from './presenters/ExpensesPresenter';
import MonthlySummaryPresenter from './presenters/MonthlySummaryPresenter';
import Profile from './components/Profile';
import './App.css';

function App({ user, onProfileUpdate, showProfile, onProfileNavigate }) {
  const [currentProject, setCurrentProject] = useState(() => {
    const saved = localStorage.getItem('currentProject');
    return saved || 'dashboard';
  });

  // Listen for dashboard navigation event from header
  useEffect(() => {
    const handleNavigateToDashboard = () => {
      setCurrentProject('dashboard');
    };
    window.addEventListener('navigateToDashboard', handleNavigateToDashboard);
    return () => window.removeEventListener('navigateToDashboard', handleNavigateToDashboard);
  }, []);
  const [breedingFarmTab, setBreedingFarmTab] = useState(() => {
    const saved = localStorage.getItem('breedingFarmTab');
    return saved || 'goats';
  }); // 'goats', 'breeding', 'kid-growth', 'health', 'vaccination', 'feeding', 'sales-breeding', 'sales-meat', 'expenses', 'monthly-summary'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Persist navigation states to localStorage
  useEffect(() => {
    localStorage.setItem('currentProject', currentProject);
  }, [currentProject]);

  useEffect(() => {
    localStorage.setItem('breedingFarmTab', breedingFarmTab);
  }, [breedingFarmTab]);

  // Effect to handle profile navigation from header
  useEffect(() => {
    if (showProfile) {
      setCurrentProject('profile');
      onProfileNavigate(false); // Reset the showProfile flag
    }
  }, [showProfile, onProfileNavigate]);

  const [goats, setGoats] = useState([]);
  const [breedingRecords, setBreedingRecords] = useState([]);
  const [kidGrowthRecords, setKidGrowthRecords] = useState([]);
  const [healthRecords, setHealthRecords] = useState([]);
  const [vaccinationRecords, setVaccinationRecords] = useState([]);
  const [feedingRecords, setFeedingRecords] = useState([]);
  const [salesBreedingRecords, setSalesBreedingRecords] = useState([]);
  const [salesMeatRecords, setSalesMeatRecords] = useState([]);
  const [expensesRecords, setExpensesRecords] = useState([]);
  const [monthlySummaryRecords, setMonthlySummaryRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editingGoat, setEditingGoat] = useState(null);
  const [editingBreeding, setEditingBreeding] = useState(null);
  const [editingKidGrowth, setEditingKidGrowth] = useState(null);
  const [editingHealth, setEditingHealth] = useState(null);
  const [editingVaccination, setEditingVaccination] = useState(null);
  const [editingFeeding, setEditingFeeding] = useState(null);
  const [editingSalesBreeding, setEditingSalesBreeding] = useState(null);
  const [editingSalesMeat, setEditingSalesMeat] = useState(null);
  const [editingExpenses, setEditingExpenses] = useState(null);
  const [editingMonthlySummary, setEditingMonthlySummary] = useState(null);
  const [selectedGoat, setSelectedGoat] = useState(null);
  const [selectedBreeding, setSelectedBreeding] = useState(null);
  const [selectedKidGrowth, setSelectedKidGrowth] = useState(null);
  const [selectedHealth, setSelectedHealth] = useState(null);
  const [selectedVaccination, setSelectedVaccination] = useState(null);
  const [selectedFeeding, setSelectedFeeding] = useState(null);
  const [selectedSalesBreeding, setSelectedSalesBreeding] = useState(null);
  const [selectedSalesMeat, setSelectedSalesMeat] = useState(null);
  const [selectedExpenses, setSelectedExpenses] = useState(null);
  const [selectedMonthlySummary, setSelectedMonthlySummary] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // View interface for Goat Presenter (MVP pattern)
  const goatView = {
    displayGoats: (goatsData) => {
      setGoats(goatsData);
    },
    setLoading: (isLoading) => {
      setLoading(isLoading);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayOffspring: (offspring) => {
      console.log('Offspring:', offspring);
    }
  };

  // View interface for Breeding Presenter (MVP pattern)
  const breedingView = {
    displayRecords: (recordsData) => {
      setBreedingRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayUpcomingKidding: (upcomingData) => {
      console.log('Upcoming kidding:', upcomingData);
    },
    displayStats: (statsData) => {
      console.log('Breeding stats:', statsData);
    }
  };

  // View interface for Kid Growth Presenter (MVP pattern)
  const kidGrowthView = {
    displayRecords: (recordsData) => {
      setKidGrowthRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Kid growth stats:', statsData);
    }
  };

  // View interface for Health Presenter (MVP pattern)
  const healthView = {
    displayRecords: (recordsData) => {
      setHealthRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Health stats:', statsData);
    }
  };

  // View interface for Vaccination Presenter (MVP pattern)
  const vaccinationView = {
    displayRecords: (recordsData) => {
      setVaccinationRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Vaccination stats:', statsData);
    }
  };

  // View interface for Feeding Presenter (MVP pattern)
  const feedingView = {
    displayRecords: (recordsData) => {
      setFeedingRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Feeding stats:', statsData);
    }
  };

  // View interface for Sales Breeding Presenter (MVP pattern)
  const salesBreedingView = {
    displayRecords: (recordsData) => {
      setSalesBreedingRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Sales Breeding stats:', statsData);
    }
  };

  // View interface for Sales Meat Presenter (MVP pattern)
  const salesMeatView = {
    displayRecords: (recordsData) => {
      setSalesMeatRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Sales Meat stats:', statsData);
    }
  };

  // View interface for Expenses Presenter (MVP pattern)
  const expensesView = {
    displayRecords: (recordsData) => {
      setExpensesRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Expenses stats:', statsData);
    }
  };

  // View interface for Monthly Summary Presenter (MVP pattern)
  const monthlySummaryView = {
    displayRecords: (recordsData) => {
      setMonthlySummaryRecords(recordsData);
    },
    showError: (errorMessage) => {
      setMessage({ text: errorMessage, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    showSuccess: (successMessage) => {
      setMessage({ text: successMessage, type: 'success' });
      setTimeout(() => setMessage({ text: '', type: '' }), 5000);
    },
    displayStats: (statsData) => {
      console.log('Monthly Summary stats:', statsData);
    }
  };

  // Initialize presenters
  const [goatPresenter] = useState(() => new GoatPresenter(goatView));
  const [breedingPresenterInstance] = useState(() => {
    const presenter = new BreedingPresenter();
    presenter.setView(breedingView);
    return presenter;
  });
  const [kidGrowthPresenterInstance] = useState(() => {
    const presenter = new KidGrowthPresenter();
    presenter.setView(kidGrowthView);
    return presenter;
  });
  const [healthPresenterInstance] = useState(() => {
    const presenter = new HealthPresenter();
    presenter.setView(healthView);
    return presenter;
  });
  const [vaccinationPresenterInstance] = useState(() => {
    const presenter = new VaccinationPresenter();
    presenter.setView(vaccinationView);
    return presenter;
  });
  const [feedingPresenterInstance] = useState(() => {
    const presenter = new FeedingPresenter();
    presenter.setView(feedingView);
    return presenter;
  });
  const [salesBreedingPresenterInstance] = useState(() => {
    const presenter = new SalesBreedingPresenter();
    presenter.setView(salesBreedingView);
    return presenter;
  });
  const [salesMeatPresenterInstance] = useState(() => {
    const presenter = new SalesMeatPresenter();
    presenter.setView(salesMeatView);
    return presenter;
  });
  const [expensesPresenterInstance] = useState(() => {
    const presenter = new ExpensesPresenter();
    presenter.setView(expensesView);
    return presenter;
  });
  const [monthlySummaryPresenterInstance] = useState(() => {
    const presenter = new MonthlySummaryPresenter();
    presenter.setView(monthlySummaryView);
    return presenter;
  });

  // Load goats when entering breeding farm (needed for all tabs)
  useEffect(() => {
    if (currentProject === 'breeding-farm') {
      goatPresenter.loadGoats();
    }
  }, [currentProject, goatPresenter]);

  // Load tab-specific data when breeding-farm tab changes
  useEffect(() => {
    console.log('🔍 Tab changed to:', breedingFarmTab, 'in project:', currentProject);
    if (currentProject === 'breeding-farm') {
      if (breedingFarmTab === 'goats') {
        console.log('✅ Loading goats data');
        goatPresenter.loadGoats();
      } else if (breedingFarmTab === 'breeding') {
        console.log('✅ Loading breeding data');
        breedingPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'kid-growth') {
        console.log('✅ Loading kid-growth data');
        kidGrowthPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'health') {
        console.log('✅ Loading health data');
        healthPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'vaccination') {
        console.log('✅ Loading vaccination data');
        vaccinationPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'feeding') {
        console.log('✅ Loading feeding data');
        feedingPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'sales-breeding') {
        console.log('✅ Loading sales-breeding data');
        salesBreedingPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'sales-meat') {
        console.log('✅ Loading sales-meat data');
        salesMeatPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'expenses') {
        console.log('✅ Loading expenses data');
        expensesPresenterInstance.loadAllRecords();
      } else if (breedingFarmTab === 'monthly-summary') {
        console.log('✅ Loading monthly-summary data');
        monthlySummaryPresenterInstance.loadAllRecords();
      }
    }
  }, [breedingFarmTab, currentProject, goatPresenter, breedingPresenterInstance, kidGrowthPresenterInstance, healthPresenterInstance, vaccinationPresenterInstance, feedingPresenterInstance, salesBreedingPresenterInstance, salesMeatPresenterInstance, expensesPresenterInstance, monthlySummaryPresenterInstance]);

  // Reset all UI states when switching tabs - ensures users see default list view
  useEffect(() => {
    setShowForm(false);
    setEditingGoat(null);
    setEditingBreeding(null);
    setEditingKidGrowth(null);
    setEditingHealth(null);
    setEditingVaccination(null);
    setEditingFeeding(null);
    setEditingSalesBreeding(null);
    setEditingSalesMeat(null);
    setEditingExpenses(null);
    setEditingMonthlySummary(null);
    setSelectedGoat(null);
    setSelectedBreeding(null);
    setSelectedKidGrowth(null);
    setSelectedHealth(null);
    setSelectedVaccination(null);
    setSelectedFeeding(null);
    setSelectedSalesBreeding(null);
    setSelectedSalesMeat(null);
    setSelectedExpenses(null);
    setSelectedMonthlySummary(null);
    setIsMobileMenuOpen(false);
  }, [breedingFarmTab]);

  // Reset all UI states when switching projects - ensures clean state
  useEffect(() => {
    setShowForm(false);
    setEditingGoat(null);
    setEditingBreeding(null);
    setEditingKidGrowth(null);
    setEditingHealth(null);
    setEditingVaccination(null);
    setEditingFeeding(null);
    setEditingSalesBreeding(null);
    setEditingSalesMeat(null);
    setEditingExpenses(null);
    setEditingMonthlySummary(null);
    setSelectedGoat(null);
    setSelectedBreeding(null);
    setSelectedKidGrowth(null);
    setSelectedHealth(null);
    setSelectedVaccination(null);
    setSelectedFeeding(null);
    setSelectedSalesBreeding(null);
    setSelectedSalesMeat(null);
    setSelectedExpenses(null);
    setSelectedMonthlySummary(null);
  }, [currentProject]);

  // Handler functions for goats
  const handleFormSubmit = async (goatData) => {
    let success;
    
    if (editingGoat) {
      success = await goatPresenter.updateGoat(editingGoat.goat_id, goatData);
    } else {
      success = await goatPresenter.createGoat(goatData);
    }

    if (success) {
      setEditingGoat(null);
      setShowForm(false);
    }
  };

  const handleEdit = (goat) => {
    setEditingGoat(goat);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingGoat(null);
    setShowForm(false);
  };

  const handleDelete = async (goatId) => {
    await goatPresenter.deleteGoat(goatId);
  };

  const handleViewDetails = (goat) => {
    setSelectedGoat(goat);
  };

  const handleSearch = useCallback((searchTerm) => {
    goatPresenter.searchGoats(searchTerm);
  }, [goatPresenter]);

  // Handler functions for breeding records
  const handleBreedingSubmit = async (breedingData) => {
    if (editingBreeding) {
      await breedingPresenterInstance.updateRecord(editingBreeding.breeding_id, breedingData);
    } else {
      await breedingPresenterInstance.createRecord(breedingData);
    }
    setEditingBreeding(null);
    setShowForm(false);
  };

  const handleBreedingEdit = (record) => {
    setEditingBreeding(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBreedingCancelEdit = () => {
    setEditingBreeding(null);
    setShowForm(false);
  };

  const handleBreedingDelete = async (breedingId) => {
    await breedingPresenterInstance.deleteRecord(breedingId);
  };

  const handleBreedingViewDetails = (record) => {
    setSelectedBreeding(record);
  };

  // Handler functions for kid growth records
  const handleKidGrowthSubmit = async (growthData) => {
    if (editingKidGrowth) {
      await kidGrowthPresenterInstance.updateRecord(editingKidGrowth.growth_id, growthData);
    } else {
      await kidGrowthPresenterInstance.createRecord(growthData);
    }
    setEditingKidGrowth(null);
    setShowForm(false);
  };

  const handleKidGrowthEdit = (record) => {
    setEditingKidGrowth(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleKidGrowthCancelEdit = () => {
    setEditingKidGrowth(null);
    setShowForm(false);
  };

  const handleKidGrowthDelete = async (growthId) => {
    await kidGrowthPresenterInstance.deleteRecord(growthId);
  };

  const handleKidGrowthViewDetails = (record) => {
    setSelectedKidGrowth(record);
  };

  // Handler functions for health records
  const handleHealthSubmit = async (healthData) => {
    if (editingHealth) {
      await healthPresenterInstance.updateRecord(editingHealth.health_id, healthData);
    } else {
      await healthPresenterInstance.createRecord(healthData);
    }
    setEditingHealth(null);
    setShowForm(false);
  };

  const handleHealthEdit = (record) => {
    setEditingHealth(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHealthCancelEdit = () => {
    setEditingHealth(null);
    setShowForm(false);
  };

  const handleHealthDelete = async (healthId) => {
    await healthPresenterInstance.deleteRecord(healthId);
  };

  const handleHealthViewDetails = (record) => {
    setSelectedHealth(record);
  };

  // Handler functions for vaccination records
  const handleVaccinationSubmit = async (vaccinationData) => {
    if (editingVaccination) {
      await vaccinationPresenterInstance.updateRecord(editingVaccination.vaccination_id, vaccinationData);
    } else {
      await vaccinationPresenterInstance.createRecord(vaccinationData);
    }
    setEditingVaccination(null);
    setShowForm(false);
  };

  const handleVaccinationEdit = (record) => {
    setEditingVaccination(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleVaccinationCancelEdit = () => {
    setEditingVaccination(null);
    setShowForm(false);
  };

  const handleVaccinationDelete = async (vaccinationId) => {
    await vaccinationPresenterInstance.deleteRecord(vaccinationId);
  };

  const handleVaccinationViewDetails = (record) => {
    setSelectedVaccination(record);
  };

  // Handler functions for feeding records
  const handleFeedingSubmit = async (feedingData) => {
    if (editingFeeding) {
      await feedingPresenterInstance.updateRecord(editingFeeding.feeding_id, feedingData);
    } else {
      await feedingPresenterInstance.createRecord(feedingData);
    }
    setEditingFeeding(null);
    setShowForm(false);
  };

  const handleFeedingEdit = (record) => {
    setEditingFeeding(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFeedingCancelEdit = () => {
    setEditingFeeding(null);
    setShowForm(false);
  };

  const handleFeedingDelete = async (feedingId) => {
    await feedingPresenterInstance.deleteRecord(feedingId);
  };

  const handleFeedingViewDetails = (record) => {
    setSelectedFeeding(record);
  };

  // Handler functions for sales breeding records
  const handleSalesBreedingSubmit = async (saleData) => {
    if (editingSalesBreeding) {
      await salesBreedingPresenterInstance.updateRecord(editingSalesBreeding.sale_id, saleData);
    } else {
      await salesBreedingPresenterInstance.createRecord(saleData);
    }
    setEditingSalesBreeding(null);
    setShowForm(false);
  };

  const handleSalesBreedingEdit = (record) => {
    setEditingSalesBreeding(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalesBreedingCancelEdit = () => {
    setEditingSalesBreeding(null);
    setShowForm(false);
  };

  const handleSalesBreedingDelete = async (saleId) => {
    await salesBreedingPresenterInstance.deleteRecord(saleId);
  };

  const handleSalesBreedingViewDetails = (record) => {
    setSelectedSalesBreeding(record);
  };

  // Handler functions for sales meat records
  const handleSalesMeatSubmit = async (saleData) => {
    if (editingSalesMeat) {
      await salesMeatPresenterInstance.updateRecord(editingSalesMeat.sale_id, saleData);
    } else {
      await salesMeatPresenterInstance.createRecord(saleData);
    }
    setEditingSalesMeat(null);
    setShowForm(false);
  };

  const handleSalesMeatEdit = (record) => {
    setEditingSalesMeat(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSalesMeatCancelEdit = () => {
    setEditingSalesMeat(null);
    setShowForm(false);
  };

  const handleSalesMeatDelete = async (saleId) => {
    await salesMeatPresenterInstance.deleteRecord(saleId);
  };

  const handleSalesMeatViewDetails = (record) => {
    setSelectedSalesMeat(record);
  };

  // Handler functions for expenses records
  const handleExpensesSubmit = async (expenseData) => {
    if (editingExpenses) {
      await expensesPresenterInstance.updateRecord(editingExpenses.expense_id, expenseData);
    } else {
      await expensesPresenterInstance.createRecord(expenseData);
    }
    setEditingExpenses(null);
    setShowForm(false);
  };

  const handleExpensesEdit = (record) => {
    setEditingExpenses(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExpensesCancelEdit = () => {
    setEditingExpenses(null);
    setShowForm(false);
  };

  const handleExpensesDelete = async (expenseId) => {
    await expensesPresenterInstance.deleteRecord(expenseId);
  };

  const handleExpensesViewDetails = (record) => {
    setSelectedExpenses(record);
  };

  // Handler functions for monthly summary records
  const handleMonthlySummarySubmit = async (summaryData) => {
    if (editingMonthlySummary) {
      await monthlySummaryPresenterInstance.updateRecord(editingMonthlySummary.summary_id, summaryData);
    } else {
      await monthlySummaryPresenterInstance.createRecord(summaryData);
    }
    setEditingMonthlySummary(null);
    setShowForm(false);
  };

  const handleMonthlySummaryEdit = (record) => {
    setEditingMonthlySummary(record);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleMonthlySummaryCancelEdit = () => {
    setEditingMonthlySummary(null);
    setShowForm(false);
  };

  const handleMonthlySummaryDelete = async (summaryId) => {
    await monthlySummaryPresenterInstance.deleteRecord(summaryId);
  };

  const handleMonthlySummaryViewDetails = (record) => {
    setSelectedMonthlySummary(record);
  };

  // Load monthly summaries (used by GenerateReport)
  const loadMonthlySummaries = () => {
    monthlySummaryPresenterInstance.loadAllRecords();
  };

  // Render current project
  const renderProject = () => {
    switch (currentProject) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentProject} />;
      
      case 'breeding-farm':
        return (
          <>
            {/* Sidebar Navigation */}
            <BreedingFarmSidebar 
              activeTab={breedingFarmTab}
              onTabChange={setBreedingFarmTab}
              isMobileMenuOpen={isMobileMenuOpen}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              onBackToDashboard={() => setCurrentProject('dashboard')}
            />

            {/* Main Content Area */}
            <div className="breeding-farm-content">
              <div className="project-container">
                <div className="project-header">
                  <div className="header-with-menu">
                    <MobileMenuButton onClick={() => setIsMobileMenuOpen(true)} />
                    <div>
                      <h1>🐐 Hannan Breeding Farm</h1>
                      <p>Goat Livestock & Breeding Management System</p>
                    </div>
                  </div>
                </div>

            {/* Goats Tab Content */}
            {breedingFarmTab === 'goats' && (() => {
              console.log('🐐 Rendering Goats tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{goats.length}</div>
                    <div className="stat-label">Total Goats</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {goats.filter(g => g.sex === 'Male').length}
                    </div>
                    <div className="stat-label">Males</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {goats.filter(g => g.sex === 'Female').length}
                    </div>
                    <div className="stat-label">Females</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {goats.filter(g => g.status === 'Active').length}
                    </div>
                    <div className="stat-label">Active</div>
                  </div>
                </div>

                {showForm && (
                  <GoatForm 
                    onSubmit={handleFormSubmit}
                    editingGoat={editingGoat}
                    onCancel={handleCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Register New Goat
                  </button>
                )}

                {!showForm && (
                  <GoatList 
                    goats={goats}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewDetails={handleViewDetails}
                  />
                )}

                {selectedGoat && (
                  <GoatDetails 
                    goat={selectedGoat}
                    onClose={() => setSelectedGoat(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Breeding & Kidding Tab Content */}
            {breedingFarmTab === 'breeding' && (() => {
              console.log('🍼 Rendering Breeding tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{breedingRecords.length}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {breedingRecords.filter(r => r.actual_kidding_date).length}
                    </div>
                    <div className="stat-label">Completed</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {breedingRecords.filter(r => !r.actual_kidding_date && r.expected_kidding_date).length}
                    </div>
                    <div className="stat-label">Pending</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {breedingRecords.reduce((sum, r) => sum + (r.no_of_kids || 0), 0)}
                    </div>
                    <div className="stat-label">Total Kids</div>
                  </div>
                </div>

                {showForm && (
                  <BreedingForm 
                    onSubmit={handleBreedingSubmit}
                    editingRecord={editingBreeding}
                    onCancel={handleBreedingCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Breeding Record
                  </button>
                )}

                {!showForm && (
                  <BreedingList 
                    records={breedingRecords}
                    onEdit={handleBreedingEdit}
                    onDelete={handleBreedingDelete}
                    onView={handleBreedingViewDetails}
                  />
                )}

                {selectedBreeding && (
                  <BreedingDetails 
                    record={selectedBreeding}
                    onClose={() => setSelectedBreeding(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Kid Growth & Weaning Tab Content */}
            {breedingFarmTab === 'kid-growth' && (() => {
              console.log('📈 Rendering Kid Growth tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{kidGrowthRecords.length}</div>
                    <div className="stat-label">Total Kids</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {kidGrowthRecords.filter(r => r.weaning_weight).length}
                    </div>
                    <div className="stat-label">Weaned</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {kidGrowthRecords.filter(r => r.target_market === 'Breeding').length}
                    </div>
                    <div className="stat-label">For Breeding</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {kidGrowthRecords.filter(r => r.target_market === 'Meat').length}
                    </div>
                    <div className="stat-label">For Meat</div>
                  </div>
                </div>

                {showForm && (
                  <KidGrowthForm 
                    onSubmit={handleKidGrowthSubmit}
                    editingRecord={editingKidGrowth}
                    onCancel={handleKidGrowthCancelEdit}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Kid Growth Record
                  </button>
                )}

                {!showForm && (
                  <KidGrowthList 
                    records={kidGrowthRecords}
                    onEdit={handleKidGrowthEdit}
                    onDelete={handleKidGrowthDelete}
                    onView={handleKidGrowthViewDetails}
                  />
                )}

                {selectedKidGrowth && (
                  <KidGrowthDetails 
                    record={selectedKidGrowth}
                    onClose={() => setSelectedKidGrowth(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Health & Treatment Tab Content */}
            {breedingFarmTab === 'health' && (() => {
              console.log('🏥 Rendering Health tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{healthRecords.length}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {healthRecords.filter(r => r.recovery_status && r.recovery_status.toLowerCase().includes('recovered')).length}
                    </div>
                    <div className="stat-label">Recovered</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {healthRecords.filter(r => !r.recovery_status || !r.recovery_status.toLowerCase().includes('recovered')).length}
                    </div>
                    <div className="stat-label">Ongoing</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {healthRecords.reduce((sum, r) => sum + (parseFloat(r.cost_ugx) || 0), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Costs</div>
                  </div>
                </div>

                {showForm && (
                  <HealthForm 
                    onSubmit={handleHealthSubmit}
                    editingRecord={editingHealth}
                    onCancel={handleHealthCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Health Record
                  </button>
                )}

                {!showForm && (
                  <HealthList 
                    records={healthRecords}
                    onEdit={handleHealthEdit}
                    onDelete={handleHealthDelete}
                    onView={handleHealthViewDetails}
                  />
                )}

                {selectedHealth && (
                  <HealthDetails 
                    record={selectedHealth}
                    onClose={() => setSelectedHealth(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Vaccination & Deworming Tab Content */}
            {breedingFarmTab === 'vaccination' && (() => {
              console.log('💉 Rendering Vaccination tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{vaccinationRecords.length}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {vaccinationRecords.filter(r => r.type === 'Vaccine').length}
                    </div>
                    <div className="stat-label">Vaccines</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {vaccinationRecords.filter(r => r.type === 'Deworming').length}
                    </div>
                    <div className="stat-label">Deworming</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {vaccinationRecords.filter(r => {
                        if (!r.next_due_date) return false;
                        const dueDate = new Date(r.next_due_date);
                        return dueDate < new Date();
                      }).length}
                    </div>
                    <div className="stat-label">Overdue</div>
                  </div>
                </div>

                {showForm && (
                  <VaccinationForm 
                    onSubmit={handleVaccinationSubmit}
                    editingRecord={editingVaccination}
                    onCancel={handleVaccinationCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Vaccination Record
                  </button>
                )}

                {!showForm && (
                  <VaccinationList 
                    records={vaccinationRecords}
                    onEdit={handleVaccinationEdit}
                    onDelete={handleVaccinationDelete}
                    onView={handleVaccinationViewDetails}
                  />
                )}

                {selectedVaccination && (
                  <VaccinationDetails 
                    record={selectedVaccination}
                    onClose={() => setSelectedVaccination(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Feeding & Fattening Tab Content */}
            {breedingFarmTab === 'feeding' && (() => {
              console.log('🌾 Rendering Feeding tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{feedingRecords.length}</div>
                    <div className="stat-label">Total Records</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {feedingRecords.filter(r => r.purpose === 'Fattening').length}
                    </div>
                    <div className="stat-label">Fattening</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {feedingRecords.filter(r => r.purpose === 'Maintenance').length}
                    </div>
                    <div className="stat-label">Maintenance</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {feedingRecords.reduce((sum, r) => sum + (parseFloat(r.weight_gain_kgs) || 0), 0).toFixed(1)} kg
                    </div>
                    <div className="stat-label">Total Weight Gain</div>
                  </div>
                </div>

                {showForm && (
                  <FeedingForm 
                    onSubmit={handleFeedingSubmit}
                    editingRecord={editingFeeding}
                    onCancel={handleFeedingCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Feeding Record
                  </button>
                )}

                {!showForm && (
                  <FeedingList 
                    records={feedingRecords}
                    onEdit={handleFeedingEdit}
                    onDelete={handleFeedingDelete}
                    onView={handleFeedingViewDetails}
                  />
                )}

                {selectedFeeding && (
                  <FeedingDetails 
                    record={selectedFeeding}
                    onClose={() => setSelectedFeeding(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Sales - Breeding Tab Content */}
            {breedingFarmTab === 'sales-breeding' && (() => {
              console.log('💰 Rendering Sales-Breeding tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{salesBreedingRecords.length}</div>
                    <div className="stat-label">Total Sales</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {salesBreedingRecords.filter(r => r.sex === 'Male').length}
                    </div>
                    <div className="stat-label">Males Sold</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {salesBreedingRecords.filter(r => r.sex === 'Female').length}
                    </div>
                    <div className="stat-label">Females Sold</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {salesBreedingRecords.reduce((sum, r) => sum + (parseFloat(r.sale_price_ugx) || 0), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                </div>

                {showForm && (
                  <SalesBreedingForm 
                    onSubmit={handleSalesBreedingSubmit}
                    editingRecord={editingSalesBreeding}
                    onCancel={handleSalesBreedingCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Breeding Sale
                  </button>
                )}

                {!showForm && (
                  <SalesBreedingList 
                    records={salesBreedingRecords}
                    onEdit={handleSalesBreedingEdit}
                    onDelete={handleSalesBreedingDelete}
                    onView={handleSalesBreedingViewDetails}
                  />
                )}

                {selectedSalesBreeding && (
                  <SalesBreedingDetails 
                    record={selectedSalesBreeding}
                    onClose={() => setSelectedSalesBreeding(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Sales - Meat Tab Content */}
            {breedingFarmTab === 'sales-meat' && (() => {
              console.log('🥩 Rendering Sales-Meat tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{salesMeatRecords.length}</div>
                    <div className="stat-label">Total Sales</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {salesMeatRecords.reduce((sum, r) => sum + (parseFloat(r.live_weight) || 0), 0).toFixed(1)} kg
                    </div>
                    <div className="stat-label">Total Weight Sold</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {salesMeatRecords.length > 0 ? (salesMeatRecords.reduce((sum, r) => sum + (parseFloat(r.price_per_kg) || 0), 0) / salesMeatRecords.length).toLocaleString() : 0}
                    </div>
                    <div className="stat-label">Avg Price/kg</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {salesMeatRecords.reduce((sum, r) => sum + (parseFloat(r.total_price) || 0), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Revenue</div>
                  </div>
                </div>

                {showForm && (
                  <SalesMeatForm 
                    onSubmit={handleSalesMeatSubmit}
                    editingRecord={editingSalesMeat}
                    onCancel={handleSalesMeatCancelEdit}
                    goats={goats}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Meat Sale
                  </button>
                )}

                {!showForm && (
                  <SalesMeatList 
                    records={salesMeatRecords}
                    onEdit={handleSalesMeatEdit}
                    onDelete={handleSalesMeatDelete}
                    onView={handleSalesMeatViewDetails}
                  />
                )}

                {selectedSalesMeat && (
                  <SalesMeatDetails 
                    record={selectedSalesMeat}
                    onClose={() => setSelectedSalesMeat(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Expenses Tab Content */}
            {breedingFarmTab === 'expenses' && (() => {
              console.log('💸 Rendering Expenses tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{expensesRecords.length}</div>
                    <div className="stat-label">Total Expenses</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {expensesRecords.filter(r => r.category === 'Feed').length}
                    </div>
                    <div className="stat-label">Feed Expenses</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {expensesRecords.filter(r => r.category === 'Vet').length}
                    </div>
                    <div className="stat-label">Vet Expenses</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {expensesRecords.reduce((sum, r) => sum + (parseFloat(r.amount_ugx) || 0), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Amount</div>
                  </div>
                </div>

                {showForm && (
                  <ExpensesForm 
                    onSubmit={handleExpensesSubmit}
                    editingRecord={editingExpenses}
                    onCancel={handleExpensesCancelEdit}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Expense
                  </button>
                )}

                {!showForm && (
                  <ExpensesList 
                    records={expensesRecords}
                    onEdit={handleExpensesEdit}
                    onDelete={handleExpensesDelete}
                    onView={handleExpensesViewDetails}
                  />
                )}

                {selectedExpenses && (
                  <ExpensesDetails 
                    record={selectedExpenses}
                    onClose={() => setSelectedExpenses(null)}
                  />
                )}
              </>
            );
            })()}

            {/* Monthly Summary Tab Content */}
            {breedingFarmTab === 'monthly-summary' && (() => {
              console.log('📊 Rendering Monthly Summary tab');
              return (
              <>
                {/* Statistics Cards */}
                <div className="stats-cards">
                  <div className="stat-card">
                    <div className="stat-value">{monthlySummaryRecords.length}</div>
                    <div className="stat-label">Total Months</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {monthlySummaryRecords.reduce((sum, r) => sum + (parseInt(r.births) || 0), 0)}
                    </div>
                    <div className="stat-label">Total Births</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      {monthlySummaryRecords.reduce((sum, r) => sum + (parseInt(r.sold_breeding) || 0) + (parseInt(r.sold_meat) || 0), 0)}
                    </div>
                    <div className="stat-label">Total Sold</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-value">
                      UGX {monthlySummaryRecords.reduce((sum, r) => sum + (parseFloat(r.net_profit_ugx) || 0), 0).toLocaleString()}
                    </div>
                    <div className="stat-label">Total Profit</div>
                  </div>
                </div>

                <GenerateReport onReportGenerated={loadMonthlySummaries} />

                {showForm && (
                  <MonthlySummaryForm 
                    onSubmit={handleMonthlySummarySubmit}
                    editingRecord={editingMonthlySummary}
                    onCancel={handleMonthlySummaryCancelEdit}
                  />
                )}

                {!showForm && (
                  <button 
                    className="toggle-form-btn"
                    onClick={() => setShowForm(true)}
                  >
                    + Add New Monthly Summary
                  </button>
                )}

                {!showForm && (
                  <MonthlySummaryList 
                    records={monthlySummaryRecords}
                    onEdit={handleMonthlySummaryEdit}
                    onDelete={handleMonthlySummaryDelete}
                    onView={handleMonthlySummaryViewDetails}
                  />
                )}

                {selectedMonthlySummary && (
                  <MonthlySummaryDetails 
                    record={selectedMonthlySummary}
                    onClose={() => setSelectedMonthlySummary(null)}
                  />
                )}
              </>
            );
            })()}
              </div>
            </div>
          </>
        );
      
      case 'matooke':
        return <MatookeProject onBack={() => setCurrentProject('dashboard')} />;
      
      case 'coffee':
        return <CoffeeProject onBack={() => setCurrentProject('dashboard')} />;
      
      case 'profile':
        return <Profile user={user} onProfileUpdate={onProfileUpdate} onBack={() => setCurrentProject('dashboard')} />;
      
      default:
        return <Dashboard onNavigate={setCurrentProject} />;
    }
  };

  return (
    <div className="App">
      <div className="main-content">
        {/* Toast notification */}
        <Toast 
          message={message.text}
          type={message.type}
          onClose={() => setMessage({ text: '', type: '' })}
        />

        {/* Loading indicator */}
        {loading && (
          <div className="loading-overlay">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        )}

        {renderProject()}
      </div>
    </div>
  );
}

export default App;
