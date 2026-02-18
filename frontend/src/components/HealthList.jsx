import React from 'react';
import './HealthList.css';

const HealthList = ({ records, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount) => {
    if (!amount) return 'Not recorded';
    return `UGX ${parseFloat(amount).toLocaleString()}`;
  };

  const getRecoveryBadge = (status) => {
    if (!status) return <span style={{...styles.badge, backgroundColor: '#999'}}>Not set</span>;
    
    const statusLower = status.toLowerCase();
    let bgColor = '#999';
    
    if (statusLower.includes('fully recovered') || statusLower.includes('recovered')) {
      bgColor = '#4CAF50';
    } else if (statusLower.includes('recovering') || statusLower.includes('improving')) {
      bgColor = '#2196F3';
    } else if (statusLower.includes('no improvement') || statusLower.includes('worsening')) {
      bgColor = '#f44336';
    }
    
    return <span style={{...styles.badge, backgroundColor: bgColor}}>{status}</span>;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Health & Treatment Records</h3>
      {records.length === 0 ? (
        <p style={styles.emptyMessage}>No health records found. Create a new record to get started.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Goat ID</th>
                <th style={styles.th}>Problem</th>
                <th style={styles.th}>Treatment</th>
                <th style={styles.th}>Treated By</th>
                <th style={styles.th}>Cost</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.health_id} style={styles.tr}>
                  <td style={styles.td}>{formatDate(record.record_date)}</td>
                  <td style={styles.td}>
                    <strong>{record.goat_id}</strong>
                    {record.goat_breed && <div style={styles.subText}>{record.goat_breed} - {record.goat_sex}</div>}
                  </td>
                  <td style={styles.td}>
                    <div style={styles.truncate}>{record.problem_observed}</div>
                  </td>
                  <td style={styles.td}>
                    <div style={styles.truncate}>{record.treatment_given || 'Not recorded'}</div>
                  </td>
                  <td style={styles.td}>{record.vet_person_treated || 'N/A'}</td>
                  <td style={styles.td}>{formatCurrency(record.cost_ugx)}</td>
                  <td style={styles.td}>{getRecoveryBadge(record.recovery_status)}</td>
                  <td style={styles.td}>
                    <div style={styles.actionButtons}>
                      <button
                        onClick={() => onView(record)}
                        style={{...styles.button, ...styles.viewButton}}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => onEdit(record)}
                        style={{...styles.button, ...styles.editButton}}
                        title="Edit"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this health record?')) {
                            onDelete(record.health_id);
                          }
                        }}
                        style={{...styles.button, ...styles.deleteButton}}
                        title="Delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  title: {
    marginTop: 0,
    marginBottom: '20px',
    color: '#333'
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#666',
    padding: '40px',
    fontSize: '16px'
  },
  tableContainer: {
    overflowX: 'auto'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '14px'
  },
  th: {
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '12px 8px',
    textAlign: 'left',
    fontWeight: '600',
    whiteSpace: 'nowrap'
  },
  tr: {
    borderBottom: '1px solid #ddd'
  },
  td: {
    padding: '12px 8px',
    verticalAlign: 'top'
  },
  subText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '2px'
  },
  truncate: {
    maxWidth: '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap'
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
  actionButtons: {
    display: 'flex',
    gap: '5px'
  },
  button: {
    padding: '6px 10px',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'opacity 0.2s'
  },
  viewButton: {
    backgroundColor: '#2196F3'
  },
  editButton: {
    backgroundColor: '#ff9800'
  },
  deleteButton: {
    backgroundColor: '#f44336'
  }
};

export default HealthList;
