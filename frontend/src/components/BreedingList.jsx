import React from 'react';
import './BreedingList.css';

const BreedingList = ({ records, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusBadge = (record) => {
    if (record.actual_kidding_date) {
      return <span style={{...styles.badge, ...styles.completedBadge}}>Completed</span>;
    }
    const today = new Date();
    const expectedDate = new Date(record.expected_kidding_date);
    if (expectedDate < today) {
      return <span style={{...styles.badge, ...styles.overdueBadge}}>Overdue</span>;
    }
    return <span style={{...styles.badge, ...styles.pendingBadge}}>Pending</span>;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Breeding & Kidding Records</h3>
      {records.length === 0 ? (
        <p style={styles.emptyMessage}>No breeding records found. Create a new record to get started.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Doe ID</th>
                <th style={styles.th}>Buck ID</th>
                <th style={styles.th}>Heat Observed</th>
                <th style={styles.th}>Mating Time</th>
                <th style={styles.th}>Expected Kidding</th>
                <th style={styles.th}>Actual Kidding</th>
                <th style={styles.th}>Kids</th>
                <th style={styles.th}>Outcome</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.breeding_id} style={styles.tr}>
                  <td style={styles.td}>{getStatusBadge(record)}</td>
                  <td style={styles.td}>
                    <strong>{record.doe_id}</strong>
                    {record.doe_breed && <div style={styles.subText}>{record.doe_breed}</div>}
                  </td>
                  <td style={styles.td}>
                    <strong>{record.buck_id}</strong>
                    {record.buck_breed && <div style={styles.subText}>{record.buck_breed}</div>}
                  </td>
                  <td style={styles.td}>
                    <span style={record.heat_observed === 'Yes' ? styles.yesText : styles.noText}>
                      {record.heat_observed}
                    </span>
                  </td>
                  <td style={styles.td}>{formatDateTime(record.mating_time)}</td>
                  <td style={styles.td}>{formatDate(record.expected_kidding_date)}</td>
                  <td style={styles.td}>{formatDate(record.actual_kidding_date)}</td>
                  <td style={styles.td}>
                    {record.no_of_kids ? (
                      <div>
                        <strong>{record.no_of_kids} total</strong>
                        <div style={styles.subText}>
                          ♂ {record.male_kids || 0} | ♀ {record.female_kids || 0}
                        </div>
                      </div>
                    ) : 'N/A'}
                  </td>
                  <td style={styles.td}>{record.kidding_outcome || 'N/A'}</td>
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
                          if (window.confirm('Are you sure you want to delete this breeding record?')) {
                            onDelete(record.breeding_id);
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
  badge: {
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    display: 'inline-block'
  },
  completedBadge: {
    backgroundColor: '#4CAF50',
    color: 'white'
  },
  pendingBadge: {
    backgroundColor: '#2196F3',
    color: 'white'
  },
  overdueBadge: {
    backgroundColor: '#ff9800',
    color: 'white'
  },
  yesText: {
    color: '#4CAF50',
    fontWeight: '600'
  },
  noText: {
    color: '#999',
    fontWeight: '600'
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

export default BreedingList;
