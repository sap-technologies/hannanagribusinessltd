import pool from '../database/config.js';

// Model - Data layer for Breeding & Kidding entity
class BreedingModel {
  // Get all breeding records
  async getAllRecords() {
    const query = `
      SELECT br.*, 
             d.breed as doe_breed, 
             b.breed as buck_breed
      FROM breeding_records br
      LEFT JOIN goats d ON br.doe_id = d.goat_id
      LEFT JOIN goats b ON br.buck_id = b.goat_id
      ORDER BY br.mating_time DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get breeding record by ID
  async getRecordById(breedingId) {
    const query = `
      SELECT br.*, 
             d.breed as doe_breed, 
             b.breed as buck_breed
      FROM breeding_records br
      LEFT JOIN goats d ON br.doe_id = d.goat_id
      LEFT JOIN goats b ON br.buck_id = b.goat_id
      WHERE br.breeding_id = $1
    `;
    const result = await pool.query(query, [breedingId]);
    return result.rows[0];
  }

  // Create new breeding record
  async createRecord(breedingData) {
    const {
      doe_id,
      buck_id,
      heat_observed,
      mating_time,
      expected_kidding_date,
      actual_kidding_date,
      no_of_kids,
      male_kids,
      female_kids,
      kidding_outcome,
      remarks
    } = breedingData;

    const query = `
      INSERT INTO breeding_records (
        doe_id, buck_id, heat_observed, mating_time, expected_kidding_date,
        actual_kidding_date, no_of_kids, male_kids, female_kids, 
        kidding_outcome, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      doe_id,
      buck_id,
      heat_observed,
      mating_time,
      expected_kidding_date || null,
      actual_kidding_date || null,
      no_of_kids || null,
      male_kids || null,
      female_kids || null,
      kidding_outcome || null,
      remarks || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update breeding record
  async updateRecord(breedingId, breedingData) {
    const {
      doe_id,
      buck_id,
      heat_observed,
      mating_time,
      expected_kidding_date,
      actual_kidding_date,
      no_of_kids,
      male_kids,
      female_kids,
      kidding_outcome,
      remarks
    } = breedingData;

    const query = `
      UPDATE breeding_records
      SET doe_id = $1, buck_id = $2, heat_observed = $3, mating_time = $4,
          expected_kidding_date = $5, actual_kidding_date = $6, no_of_kids = $7,
          male_kids = $8, female_kids = $9, kidding_outcome = $10, 
          remarks = $11, updated_at = CURRENT_TIMESTAMP
      WHERE breeding_id = $12
      RETURNING *
    `;

    const values = [
      doe_id,
      buck_id,
      heat_observed,
      mating_time,
      expected_kidding_date,
      actual_kidding_date,
      no_of_kids,
      male_kids,
      female_kids,
      kidding_outcome,
      remarks,
      breedingId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete breeding record
  async deleteRecord(breedingId) {
    const query = 'DELETE FROM breeding_records WHERE breeding_id = $1 RETURNING *';
    const result = await pool.query(query, [breedingId]);
    return result.rows[0];
  }

  // Get breeding records by doe
  async getRecordsByDoe(doeId) {
    const query = `
      SELECT br.*, b.breed as buck_breed
      FROM breeding_records br
      LEFT JOIN goats b ON br.buck_id = b.goat_id
      WHERE br.doe_id = $1
      ORDER BY br.mating_time DESC
    `;
    const result = await pool.query(query, [doeId]);
    return result.rows;
  }

  // Get breeding records by buck
  async getRecordsByBuck(buckId) {
    const query = `
      SELECT br.*, d.breed as doe_breed
      FROM breeding_records br
      LEFT JOIN goats d ON br.doe_id = d.goat_id
      WHERE br.buck_id = $1
      ORDER BY br.mating_time DESC
    `;
    const result = await pool.query(query, [buckId]);
    return result.rows;
  }

  // Get upcoming kidding dates
  async getUpcomingKidding() {
    const query = `
      SELECT br.*, 
             d.breed as doe_breed, 
             b.breed as buck_breed
      FROM breeding_records br
      LEFT JOIN goats d ON br.doe_id = d.goat_id
      LEFT JOIN goats b ON br.buck_id = b.goat_id
      WHERE br.expected_kidding_date IS NOT NULL
        AND br.actual_kidding_date IS NULL
        AND br.expected_kidding_date >= CURRENT_DATE
      ORDER BY br.expected_kidding_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Search breeding records
  async searchRecords(searchTerm) {
    const query = `
      SELECT br.*, 
             d.breed as doe_breed, 
             b.breed as buck_breed
      FROM breeding_records br
      LEFT JOIN goats d ON br.doe_id = d.goat_id
      LEFT JOIN goats b ON br.buck_id = b.goat_id
      WHERE br.doe_id ILIKE $1
         OR br.buck_id ILIKE $1
         OR br.kidding_outcome ILIKE $1
      ORDER BY br.mating_time DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get breeding statistics
  async getBreedingStats() {
    const query = `
      SELECT 
        COUNT(*) as total_breedings,
        COUNT(CASE WHEN actual_kidding_date IS NOT NULL THEN 1 END) as completed_kiddings,
        COUNT(CASE WHEN expected_kidding_date IS NOT NULL AND actual_kidding_date IS NULL THEN 1 END) as pending_kiddings,
        SUM(no_of_kids) as total_kids_born,
        SUM(male_kids) as total_male_kids,
        SUM(female_kids) as total_female_kids
      FROM breeding_records
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new BreedingModel();
