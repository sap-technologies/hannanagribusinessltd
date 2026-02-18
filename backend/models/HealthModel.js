import pool from '../database/config.js';

// Model - Data layer for Health & Treatment entity
class HealthModel {
  // Get all health records
  async getAllRecords() {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex, g.status as goat_status
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      ORDER BY hr.record_date DESC, hr.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get health record by ID
  async getRecordById(healthId) {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex, g.status as goat_status
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      WHERE hr.health_id = $1
    `;
    const result = await pool.query(query, [healthId]);
    return result.rows[0];
  }

  // Create new health record
  async createRecord(healthData) {
    const {
      record_date,
      goat_id,
      problem_observed,
      treatment_given,
      vet_person_treated,
      cost_ugx,
      recovery_status,
      next_action
    } = healthData;

    const query = `
      INSERT INTO health_records (
        record_date, goat_id, problem_observed, treatment_given,
        vet_person_treated, cost_ugx, recovery_status, next_action
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const values = [
      record_date,
      goat_id,
      problem_observed,
      treatment_given || null,
      vet_person_treated || null,
      cost_ugx || null,
      recovery_status || null,
      next_action || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update health record
  async updateRecord(healthId, healthData) {
    const {
      record_date,
      goat_id,
      problem_observed,
      treatment_given,
      vet_person_treated,
      cost_ugx,
      recovery_status,
      next_action
    } = healthData;

    const query = `
      UPDATE health_records
      SET record_date = $1, goat_id = $2, problem_observed = $3,
          treatment_given = $4, vet_person_treated = $5, cost_ugx = $6,
          recovery_status = $7, next_action = $8, updated_at = CURRENT_TIMESTAMP
      WHERE health_id = $9
      RETURNING *
    `;

    const values = [
      record_date,
      goat_id,
      problem_observed,
      treatment_given,
      vet_person_treated,
      cost_ugx,
      recovery_status,
      next_action,
      healthId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete health record
  async deleteRecord(healthId) {
    const query = 'DELETE FROM health_records WHERE health_id = $1 RETURNING *';
    const result = await pool.query(query, [healthId]);
    return result.rows[0];
  }

  // Get health records by goat ID
  async getRecordsByGoatId(goatId) {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      WHERE hr.goat_id = $1
      ORDER BY hr.record_date DESC
    `;
    const result = await pool.query(query, [goatId]);
    return result.rows;
  }

  // Get records by recovery status
  async getRecordsByRecoveryStatus(status) {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      WHERE hr.recovery_status = $1
      ORDER BY hr.record_date DESC
    `;
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  // Get pending follow-up records (those with next_action and not fully recovered)
  async getPendingFollowUp() {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex, g.status as goat_status
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      WHERE hr.next_action IS NOT NULL
        AND hr.next_action != ''
        AND (hr.recovery_status IS NULL OR hr.recovery_status != 'Fully Recovered')
      ORDER BY hr.record_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Search health records
  async searchRecords(searchTerm) {
    const query = `
      SELECT hr.*, 
             g.breed as goat_breed, g.sex as goat_sex
      FROM health_records hr
      LEFT JOIN goats g ON hr.goat_id = g.goat_id
      WHERE hr.goat_id ILIKE $1
         OR hr.problem_observed ILIKE $1
         OR hr.treatment_given ILIKE $1
         OR hr.vet_person_treated ILIKE $1
         OR hr.recovery_status ILIKE $1
      ORDER BY hr.record_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get health statistics
  async getHealthStats() {
    const query = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT goat_id) as total_goats_treated,
        COUNT(CASE WHEN recovery_status = 'Fully Recovered' THEN 1 END) as fully_recovered,
        COUNT(CASE WHEN recovery_status IS NULL OR recovery_status != 'Fully Recovered' THEN 1 END) as ongoing_treatment,
        SUM(cost_ugx) as total_treatment_cost,
        AVG(cost_ugx) as avg_treatment_cost
      FROM health_records
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get treatment costs by date range
  async getCostsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        SUM(cost_ugx) as total_cost,
        COUNT(*) as treatment_count
      FROM health_records
      WHERE record_date BETWEEN $1 AND $2
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows[0];
  }
}

export default new HealthModel();
