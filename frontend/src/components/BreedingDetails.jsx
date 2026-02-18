import React from 'react';
import './BreedingDetails.css';

const BreedingDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const calculateDaysPregnant = () => {
    if (!record.mating_time) return 'N/A';
    const matingDate = new Date(record.mating_time);
    const endDate = record.actual_kidding_date ? new Date(record.actual_kidding_date) : new Date();
    const diffTime = Math.abs(endDate - matingDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getDaysUntilKidding = () => {
    if (record.actual_kidding_date) return 'Kidding completed';
    if (!record.expected_kidding_date) return 'N/A';
    
    const today = new Date();
    const expectedDate = new Date(record.expected_kidding_date);
    const diffTime = expectedDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today!';
    } else {
      return `${diffDays} days remaining`;
    }
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Breeding Record Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Breeding Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Doe ID</label>
                <div style={styles.value}>
                  <strong>{record.doe_id}</strong>
                  {record.doe_breed && <span style={styles.breed}> ({record.doe_breed})</span>}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Buck ID</label>
                <div style={styles.value}>
                  <strong>{record.buck_id}</strong>
                  {record.buck_breed && <span style={styles.breed}> ({record.buck_breed})</span>}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Heat Observed</label>
                <div style={styles.value}>
                  <span style={record.heat_observed === 'Yes' ? styles.yesText : styles.noText}>
                    {record.heat_observed}
                  </span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Mating Time</label>
                <div style={styles.value}>{formatDateTime(record.mating_time)}</div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Pregnancy & Kidding Timeline</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Expected Kidding Date</label>
                <div style={styles.value}>{formatDate(record.expected_kidding_date)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Days Until Kidding</label>
                <div style={styles.value}>
                  <span style={styles.highlight}>{getDaysUntilKidding()}</span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Actual Kidding Date</label>
                <div style={styles.value}>{formatDate(record.actual_kidding_date)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Gestation Period</label>
                <div style={styles.value}>{calculateDaysPregnant()}</div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Kidding Outcome</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Total Number of Kids</label>
                <div style={styles.value}>
                  <strong style={styles.kidsCount}>{record.no_of_kids || 'Not recorded'}</strong>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Male Kids</label>
                <div style={styles.value}>
                  <span style={styles.maleIcon}>♂</span> {record.male_kids || 0}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Female Kids</label>
                <div style={styles.value}>
                  <span style={styles.femaleIcon}>♀</span> {record.female_kids || 0}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Kidding Outcome</label>
                <div style={styles.value}>
                  {record.kidding_outcome || 'Not recorded'}
                </div>
              </div>
            </div>
          </div>

          {record.remarks && (
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>Remarks</h3>
              <div style={styles.remarks}>{record.remarks}</div>
            </div>
          )}

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Record Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Record ID</label>
                <div style={styles.value}>{record.breeding_id}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Created At</label>
                <div style={styles.value}>{formatDateTime(record.created_at)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Last Updated</label>
                <div style={styles.value}>{formatDateTime(record.updated_at)}</div>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.footer}>
          <button onClick={onClose} style={styles.closeFooterButton}>Close</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: '8px',
    maxWidth: '800px',
    width: '90%',
    maxHeight: '90vh',
    overflow: 'auto',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px',
    borderBottom: '1px solid #ddd',
    position: 'sticky',
    top: 0,
    backgroundColor: 'white',
    zIndex: 1
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '32px',
    cursor: 'pointer',
    color: '#666',
    lineHeight: 1,
    padding: '0 10px'
  },
  content: {
    padding: '20px'
  },
  section: {
    marginBottom: '25px'
  },
  sectionTitle: {
    fontSize: '18px',
    color: '#4CAF50',
    marginTop: 0,
    marginBottom: '15px',
    paddingBottom: '8px',
    borderBottom: '2px solid #4CAF50'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontSize: '12px',
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: '5px'
  },
  value: {
    fontSize: '16px',
    color: '#333'
  },
  breed: {
    color: '#666',
    fontSize: '14px'
  },
  yesText: {
    color: '#4CAF50',
    fontWeight: '600'
  },
  noText: {
    color: '#999',
    fontWeight: '600'
  },
  highlight: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2196F3'
  },
  kidsCount: {
    fontSize: '20px',
    color: '#4CAF50'
  },
  maleIcon: {
    color: '#2196F3',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  femaleIcon: {
    color: '#e91e63',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  remarks: {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333'
  },
  footer: {
    padding: '15px 20px',
    borderTop: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'sticky',
    bottom: 0,
    backgroundColor: 'white'
  },
  closeFooterButton: {
    padding: '10px 24px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  }
};

export default BreedingDetails;
