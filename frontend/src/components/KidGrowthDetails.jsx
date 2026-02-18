import React from 'react';
import './KidGrowthDetails.css';

const KidGrowthDetails = ({ record, onClose }) => {
  if (!record) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Not recorded';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const calculateWeightGain = () => {
    if (record.birth_weight && record.weaning_weight) {
      return (record.weaning_weight - record.birth_weight).toFixed(2);
    }
    return 'N/A';
  };

  const calculateGrowthRate = () => {
    if (record.birth_weight && record.weaning_weight && record.date_of_birth && record.weaning_date) {
      const birthDate = new Date(record.date_of_birth);
      const weanDate = new Date(record.weaning_date);
      const daysDiff = Math.ceil((weanDate - birthDate) / (1000 * 60 * 60 * 24));
      const weightGain = record.weaning_weight - record.birth_weight;
      if (daysDiff > 0) {
        return `${(weightGain / daysDiff).toFixed(3)} kg/day`;
      }
    }
    return 'N/A';
  };

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Kid Growth Record Details</h2>
          <button onClick={onClose} style={styles.closeButton}>×</button>
        </div>

        <div style={styles.content}>
          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Kid Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Kid ID</label>
                <div style={styles.value}><strong>{record.kid_id}</strong></div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Breed</label>
                <div style={styles.value}>{record.kid_breed || 'N/A'}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Sex</label>
                <div style={styles.value}>{record.kid_sex || 'N/A'}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Mother ID</label>
                <div style={styles.value}>
                  {record.mother_id || 'Not recorded'}
                  {record.mother_breed && <span style={styles.breed}> ({record.mother_breed})</span>}
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Weight & Growth Metrics</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Birth Weight</label>
                <div style={styles.value}>
                  {record.birth_weight ? <strong>{record.birth_weight} kg</strong> : 'Not recorded'}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Weaning Weight</label>
                <div style={styles.value}>
                  {record.weaning_weight ? <strong>{record.weaning_weight} kg</strong> : 'Not weaned yet'}
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Total Weight Gain</label>
                <div style={styles.value}>
                  <span style={styles.highlight}>{calculateWeightGain()} {calculateWeightGain() !== 'N/A' && 'kg'}</span>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Average Growth Rate</label>
                <div style={styles.value}>
                  <span style={styles.highlight}>{calculateGrowthRate()}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={styles.section}>
            <h3 style={styles.sectionTitle}>Weaning Information</h3>
            <div style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>Weaning Date</label>
                <div style={styles.value}>{formatDate(record.weaning_date)}</div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Target Market</label>
                <div style={styles.value}>
                  <span style={{
                    ...styles.badge,
                    backgroundColor: record.target_market === 'Breeding' ? '#2196F3' : '#ff9800'
                  }}>
                    {record.target_market || 'Not set'}
                  </span>
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
                <div style={styles.value}>{record.growth_id}</div>
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
  highlight: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#2196F3'
  },
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    color: 'white',
    display: 'inline-block'
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

export default KidGrowthDetails;
