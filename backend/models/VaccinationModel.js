import pool from '../database/config.js';

class VaccinationModel {
  // Get all vaccination records with goat details
  async getAllRecords() {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      ORDER BY v.record_date DESC, v.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get vaccination record by ID
  async getRecordById(vaccinationId) {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.vaccination_id = $1
    `;
    const result = await pool.query(query, [vaccinationId]);
    return result.rows[0];
  }

  // Get all vaccination records for a specific goat
  async getRecordsByGoatId(goatId) {
    const query = `
      SELECT * FROM vaccination_records
      WHERE goat_id = $1
      ORDER BY record_date DESC
    `;
    const result = await pool.query(query, [goatId]);
    return result.rows;
  }

  // Get records by type (Vaccine or Deworming)
  async getRecordsByType(type) {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.type = $1
      ORDER BY v.record_date DESC
    `;
    const result = await pool.query(query, [type]);
    return result.rows;
  }

  // Get upcoming due vaccinations/deworming
  async getUpcomingDue(daysAhead = 30) {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.next_due_date IS NOT NULL
        AND v.next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + $1
      ORDER BY v.next_due_date ASC
    `;
    const result = await pool.query(query, [daysAhead]);
    return result.rows;
  }

  // Get overdue vaccinations/deworming
  async getOverdue() {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.next_due_date IS NOT NULL
        AND v.next_due_date < CURRENT_DATE
      ORDER BY v.next_due_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Create new vaccination record
  async createRecord(recordData) {
    const query = `
      INSERT INTO vaccination_records 
      (record_date, goat_id, type, drug_used, dosage, next_due_date)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      recordData.record_date,
      recordData.goat_id,
      recordData.type,
      recordData.drug_used,
      recordData.dosage,
      recordData.next_due_date
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update vaccination record
  async updateRecord(vaccinationId, recordData) {
    const query = `
      UPDATE vaccination_records
      SET record_date = $1,
          goat_id = $2,
          type = $3,
          drug_used = $4,
          dosage = $5,
          next_due_date = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE vaccination_id = $7
      RETURNING *
    `;
    const values = [
      recordData.record_date,
      recordData.goat_id,
      recordData.type,
      recordData.drug_used,
      recordData.dosage,
      recordData.next_due_date,
      vaccinationId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete vaccination record
  async deleteRecord(vaccinationId) {
    const query = 'DELETE FROM vaccination_records WHERE vaccination_id = $1 RETURNING *';
    const result = await pool.query(query, [vaccinationId]);
    return result.rows[0];
  }

  // Search vaccination records
  async searchRecords(searchTerm) {
    const query = `
      SELECT 
        v.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM vaccination_records v
      LEFT JOIN goats g ON v.goat_id = g.goat_id
      WHERE v.goat_id ILIKE $1
         OR v.drug_used ILIKE $1
         OR v.type ILIKE $1
         OR g.breed ILIKE $1
      ORDER BY v.record_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get vaccination statistics
  async getVaccinationStats() {
    const query = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT goat_id) as total_goats_vaccinated,
        SUM(CASE WHEN type = 'Vaccine' THEN 1 ELSE 0 END) as total_vaccines,
        SUM(CASE WHEN type = 'Deworming' THEN 1 ELSE 0 END) as total_deworming,
        COUNT(CASE WHEN next_due_date < CURRENT_DATE THEN 1 END) as overdue_count,
        COUNT(CASE WHEN next_due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + 30 THEN 1 END) as upcoming_count
      FROM vaccination_records
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new VaccinationModel();
