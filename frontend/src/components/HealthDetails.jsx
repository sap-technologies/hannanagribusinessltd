import React from 'react';
import './HealthDetails.css';

const HealthDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'No cost recorded';
    return `UGX ${parseFloat(amount).toLocaleString()}`;
  };

  const getRecoveryColor = (status) => {
    if (!status) return '#999';
    const statusLower = status.toLowerCase();
    if (statusLower.includes('fully recovered')) return '#4CAF50';
    if (statusLower.includes('recovering')) return '#2196F3';
    if (statusLower.includes('no improvement')) return '#f44336';
    return '#ff9800';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Health Record Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Goat Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Goat ID</label>
                <div style={styles.value}><strong>{record.goat_id}</strong></div>
              </div>

              {record.goat_breed && (
                <div style={styles.field}>
                  <label style={styles.label}>Breed</label>
                  <div style={styles.value}>{record.goat_breed}</div>
                </div>
              )}

              {record.goat_sex && (
                <div style={styles.field}>
                  <label style={styles.label}>Sex</label>
                  <div style={styles.value}>{record.goat_sex}</div>
                </div>
              )}

              {record.goat_status && (
                <div style={styles.field}>
                  <label style={styles.label}>Current Status</label>
                  <div style={styles.value}>{record.goat_status}</div>
                </div>
              )}
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Treatment Record</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Record Date</label>
                <div style={styles.value}>{formatDate(record.record_date)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Treated By</label>
                <div style={styles.value}>{record.vet_person_treated || 'Not recorded'}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Treatment Cost</label>
                <div style={styles.value}>
                  <strong style={{color: '#4CAF50'}}>{formatCurrency(record.cost_ugx)}</strong>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Medical Details</h3>
            
            <div style={styles.field}>
              <label style={styles.label}>Problem Observed</label>
              <div style={styles.textBlock}>{record.problem_observed}</div>
            </div>

            {record.treatment_given && (
              <div style={styles.field}>
                <label style={styles.label}>Treatment Given</label>
                <div style={styles.textBlock}>{record.treatment_given}</div>
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Recovery Status</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Current Status</label>
                <div style={styles.value}>
                  <span style={{
                    ...styles.statusBadge,
                    backgroundColor: getRecoveryColor(record.recovery_status)
                  }}>
                    {record.recovery_status || 'Not set'}
                  </span>
                </div>
              </div>
            </div>

            {record.next_action && (
              <div style={styles.field}>
                <label style={styles.label}>Next Action Required</label>
                <div style={styles.textBlock}>{record.next_action}</div>
              </div>
            )}
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Record Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Health ID</label>
                <div style={styles.value}>{record.health_id}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Created At</label>
                <div style={styles.value}>{formatDate(record.created_at)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Last Updated</label>
                <div style={styles.value}>{formatDate(record.updated_at)}</div>
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
    gap: '15px',
    marginBottom: '15px'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '15px'
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
  textBlock: {
    padding: '12px',
    backgroundColor: '#f5f5f5',
    borderRadius: '4px',
    fontSize: '14px',
    lineHeight: '1.6',
    color: '#333',
    marginTop: '5px'
  },
  statusBadge: {
    padding: '6px 12px',
    borderRadius: '16px',
    fontSize: '13px',
    fontWeight: '600',
    color: 'white',
    display: 'inline-block'
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

export default HealthDetails;
