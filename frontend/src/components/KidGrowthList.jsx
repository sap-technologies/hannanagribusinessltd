import React from 'react';
import './KidGrowthList.css';

const KidGrowthList = ({ records, onEdit, onDelete, onView }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getWeightGain = (record) => {
    if (record.birth_weight && record.weaning_weight) {
      const gain = (record.weaning_weight - record.birth_weight).toFixed(2);
      return `${gain} kg`;
    }
    return 'N/A';
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Kid Growth & Weaning Records</h3>
      {records.length === 0 ? (
        <p style={styles.emptyMessage}>No kid growth records found. Create a new record to get started.</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Kid ID</th>
                <th style={styles.th}>Mother ID</th>
                <th style={styles.th}>Birth Weight</th>
                <th style={styles.th}>Weaning Date</th>
                <th style={styles.th}>Weaning Weight</th>
                <th style={styles.th}>Weight Gain</th>
                <th style={styles.th}>Target Market</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.growth_id} style={styles.tr}>
                  <td style={styles.td}>
                    <strong>{record.kid_id}</strong>
                    {record.kid_breed && <div style={styles.subText}>{record.kid_breed} - {record.kid_sex}</div>}
                  </td>
                  <td style={styles.td}>
                    {record.mother_id || 'N/A'}
                    {record.mother_breed && <div style={styles.subText}>{record.mother_breed}</div>}
                  </td>
                  <td style={styles.td}>
                    {record.birth_weight ? `${record.birth_weight} kg` : 'Not recorded'}
                  </td>
                  <td style={styles.td}>{formatDate(record.weaning_date)}</td>
                  <td style={styles.td}>
                    {record.weaning_weight ? `${record.weaning_weight} kg` : 'Not weaned'}
                  </td>
                  <td style={styles.td}>
                    <strong>{getWeightGain(record)}</strong>
                  </td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.badge,
                      backgroundColor: record.target_market === 'Breeding' ? '#2196F3' : '#ff9800'
                    }}>
                      {record.target_market || 'Not set'}
                    </span>
                  </td>
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
                          if (window.confirm('Are you sure you want to delete this growth record?')) {
                            onDelete(record.growth_id);
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

export default KidGrowthList;
