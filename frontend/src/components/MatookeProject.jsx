import React, { useState, useEffect } from 'react';
import MatookePresenter from '../presenters/MatookePresenter';
import BackButton from './BackButton';import './FarmProject.css';import './FarmProject.css';

const MatookeProject = ({ onBack }) => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [showForm, setShowForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
  const [formData, setFormData] = useState({
    farm_id: '',
    farm_name: '',
    location: '',
    size_acres: '',
    planting_date: '',
    variety: '',
    expected_harvest_date: '',
    actual_harvest_date: '',
    estimated_yield_kg: '',
    actual_yield_kg: '',
    status: 'Active',
    manager: '',
    remarks: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Presenter setup
  const [presenter] = useState(() => {
    const p = new MatookePresenter();
    p.setView({
      displayFarms: (data) => setFarms(data),
      setLoading: (loading) => setLoading(loading),
      showError: (msg) => {
        setMessage({ text: msg, type: 'error' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      },
      showSuccess: (msg) => {
        setMessage({ text: msg, type: 'success' });
        setTimeout(() => setMessage({ text: '', type: '' }), 5000);
      }
    });
    return p;
  });

  useEffect(() => {
    presenter.loadFarms();
  }, [presenter]);

  useEffect(() => {
    if (editingFarm) {
      setFormData({
        farm_id: editingFarm.farm_id || '',
        farm_name: editingFarm.farm_name || '',
        location: editingFarm.location || '',
        size_acres: editingFarm.size_acres || '',
        planting_date: editingFarm.planting_date ? editingFarm.planting_date.split('T')[0] : '',
        variety: editingFarm.variety || '',
        expected_harvest_date: editingFarm.expected_harvest_date ? editingFarm.expected_harvest_date.split('T')[0] : '',
        actual_harvest_date: editingFarm.actual_harvest_date ? editingFarm.actual_harvest_date.split('T')[0] : '',
        estimated_yield_kg: editingFarm.estimated_yield_kg || '',
        actual_yield_kg: editingFarm.actual_yield_kg || '',
        status: editingFarm.status || 'Active',
        manager: editingFarm.manager || '',
        remarks: editingFarm.remarks || ''
      });
      setShowForm(true);
    }
  }, [editingFarm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const success = editingFarm
        ? await presenter.updateFarm(editingFarm.farm_id, formData)
        : await presenter.createFarm(formData);

      if (success) {
        setShowForm(false);
        setEditingFarm(null);
        resetForm();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (farmId) => {
    if (window.confirm('Are you sure you want to delete this farm?')) {
      await presenter.deleteFarm(farmId);
    }
  };

  const resetForm = () => {
    setFormData({
      farm_id: '',
      farm_name: '',
      location: '',
      size_acres: '',
      planting_date: '',
      variety: '',
      expected_harvest_date: '',
      actual_harvest_date: '',
      estimated_yield_kg: '',
      actual_yield_kg: '',
      status: 'Active',
      manager: '',
      remarks: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingFarm(null);
    resetForm();
  };

  return (
    <div className="farm-project-container">
      <BackButton onClick={onBack} label="Back to Dashboard" />
      
      <div className="farm-project-header">
        <div className="header-content">
          <h1>🍌 Matooke Farm Management</h1>
          <p>Manage your matooke plantation operations</p>
        </div>
      </div>

      {message.text && (
        <div className={`farm-message ${message.type}`}>
          {message.text}
        </div>
      )}

      {/* Statistics */}
      <div className="farm-stats">
        <div className="stat-card">
          <div className="stat-value">{farms.length}</div>
          <div className="stat-label">Total Farms</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {farms.reduce((sum, f) => sum + (parseFloat(f.size_acres) || 0), 0).toFixed(1)}
          </div>
          <div className="stat-label">Total Acres</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {farms.filter(f => f.status === 'Active').length}
          </div>
          <div className="stat-label">Active Farms</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            {farms.reduce((sum, f) => sum + (parseFloat(f.actual_yield_kg) || 0), 0).toFixed(0)} kg
          </div>
          <div className="stat-label">Total Yield</div>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="farm-form-container matooke">
          <h3>{editingFarm ? 'Edit Matooke Farm' : 'Add New Matooke Farm'}</h3>
          <form onSubmit={handleSubmit} className="farm-form">
            <div className="form-section">
              <h4>Farm Information</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Farm ID *</label>
                  <input
                    type="text"
                    value={formData.farm_id}
                    onChange={(e) => setFormData({...formData, farm_id: e.target.value})}
                    placeholder="e.g., MF001"
                    required
                    disabled={editingFarm}
                  />
                </div>
                <div className="form-field">
                  <label>Farm Name *</label>
                  <input
                    type="text"
                    value={formData.farm_name}
                    onChange={(e) => setFormData({...formData, farm_name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Size (Acres) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.size_acres}
                    onChange={(e) => setFormData({...formData, size_acres: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Planting Details</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Variety</label>
                  <select
                    value={formData.variety}
                    onChange={(e) => setFormData({...formData, variety: e.target.value})}
                  >
                    <option value="">Select Variety</option>
                    <option value="Mbwazirume">Mbwazirume (Cooking)</option>
                    <option value="Nakabululu">Nakabululu (Cooking)</option>
                    <option value="Gonja">Gonja (Roasting)</option>
                    <option value="Kisubi">Kisubi (Sweet)</option>
                    <option value="Kayinja">Kayinja (Juice)</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Planting Date</label>
                  <input
                    type="date"
                    value={formData.planting_date}
                    onChange={(e) => setFormData({...formData, planting_date: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Expected Harvest Date</label>
                  <input
                    type="date"
                    value={formData.expected_harvest_date}
                    onChange={(e) => setFormData({...formData, expected_harvest_date: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Actual Harvest Date</label>
                  <input
                    type="date"
                    value={formData.actual_harvest_date}
                    onChange={(e) => setFormData({...formData, actual_harvest_date: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Yield Information</h4>
              <div className="form-grid">
                <div className="form-field">
                  <label>Estimated Yield (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.estimated_yield_kg}
                    onChange={(e) => setFormData({...formData, estimated_yield_kg: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Actual Yield (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.actual_yield_kg}
                    onChange={(e) => setFormData({...formData, actual_yield_kg: e.target.value})}
                  />
                </div>
                <div className="form-field">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="Active">Active</option>
                    <option value="Harvested">Harvested</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Farm Manager</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h4>Additional Notes</h4>
              <div className="form-grid">
                <div className="form-field full-width">
                  <label>Remarks</label>
                  <textarea
                    value={formData.remarks}
                    onChange={(e) => setFormData({...formData, remarks: e.target.value})}
                    rows="2"
                  />
                </div>
              </div>
            </div>

            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingFarm ? 'Update Farm' : 'Add Farm'}
              </button>
              <button type="button" onClick={handleCancel} className="btn-cancel" disabled={isSubmitting}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {!showForm && (
        <button className="btn-add-farm matooke" onClick={() => setShowForm(true)}>
          + Add New Matooke Farm
        </button>
      )}

      {/* Farm List */}
      <div className="farm-list-container">
        <h3>Matooke Farms ({farms.length})</h3>
        {loading ? (
          <div className="loading-state">Loading farms...</div>
        ) : farms.length === 0 ? (
          <div className="empty-state">
            <p>No matooke farms registered yet. Add your first farm above.</p>
          </div>
        ) : (
          <div className="farm-grid">
            {farms.map((farm) => (
              <div key={farm.farm_id} className="farm-card matooke">
                <div className="farm-card-header">
                  <h4>{farm.farm_name}</h4>
                  <span className={`status-badge ${farm.status.toLowerCase()}`}>
                    {farm.status}
                  </span>
                </div>
                <div className="farm-card-body">
                  <div className="farm-detail">
                    <span className="label">Farm ID:</span>
                    <span className="value">{farm.farm_id}</span>
                  </div>
                  <div className="farm-detail">
                    <span className="label">Location:</span>
                    <span className="value">{farm.location}</span>
                  </div>
                  <div className="farm-detail">
                    <span className="label">Size:</span>
                    <span className="value">{farm.size_acres} acres</span>
                  </div>
                  <div className="farm-detail">
                    <span className="label">Variety:</span>
                    <span className="value">{farm.variety || 'N/A'}</span>
                  </div>
                  {farm.planting_date && (
                    <div className="farm-detail">
                      <span className="label">Planted:</span>
                      <span className="value">{new Date(farm.planting_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  <div className="farm-detail">
                    <span className="label">Actual Yield:</span>
                    <span className="value highlight">{farm.actual_yield_kg ? `${parseFloat(farm.actual_yield_kg).toFixed(1)} kg` : 'N/A'}</span>
                  </div>
                  {farm.manager && (
                    <div className="farm-detail">
                      <span className="label">Manager:</span>
                      <span className="value">{farm.manager}</span>
                    </div>
                  )}
                </div>
                <div className="farm-card-actions">
                  <button onClick={() => setEditingFarm(farm)} className="btn-edit">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(farm.farm_id)} className="btn-delete">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatookeProject;
