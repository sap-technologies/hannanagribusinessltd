import pool from '../database/config.js';

class FeedingModel {
  // Get all feeding records with goat details
  async getAllRecords() {
    const query = `
      SELECT 
        f.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.weight as current_weight
      FROM feeding_records f
      LEFT JOIN goats g ON f.goat_id = g.goat_id
      ORDER BY f.record_date DESC, f.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get feeding record by ID
  async getRecordById(feedingId) {
    const query = `
      SELECT 
        f.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.weight as current_weight
      FROM feeding_records f
      LEFT JOIN goats g ON f.goat_id = g.goat_id
      WHERE f.feeding_id = $1
    `;
    const result = await pool.query(query, [feedingId]);
    return result.rows[0];
  }

  // Get all feeding records for a specific goat
  async getRecordsByGoatId(goatId) {
    const query = `
      SELECT * FROM feeding_records
      WHERE goat_id = $1
      ORDER BY record_date DESC
    `;
    const result = await pool.query(query, [goatId]);
    return result.rows;
  }

  // Get all feeding records for a group
  async getRecordsByGroup(groupName) {
    const query = `
      SELECT * FROM feeding_records
      WHERE group_name = $1
      ORDER BY record_date DESC
    `;
    const result = await pool.query(query, [groupName]);
    return result.rows;
  }

  // Get records by purpose (Maintenance or Fattening)
  async getRecordsByPurpose(purpose) {
    const query = `
      SELECT 
        f.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.weight as current_weight
      FROM feeding_records f
      LEFT JOIN goats g ON f.goat_id = g.goat_id
      WHERE f.purpose = $1
      ORDER BY f.record_date DESC
    `;
    const result = await pool.query(query, [purpose]);
    return result.rows;
  }

  // Get records by date range
  async getRecordsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        f.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.weight as current_weight
      FROM feeding_records f
      LEFT JOIN goats g ON f.goat_id = g.goat_id
      WHERE f.record_date BETWEEN $1 AND $2
      ORDER BY f.record_date DESC
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  // Create new feeding record
  async createRecord(recordData) {
    const query = `
      INSERT INTO feeding_records 
      (record_date, goat_id, group_name, feed_type, quantity_used, purpose, weight_gain_kgs, remarks)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      recordData.record_date,
      recordData.goat_id || null,
      recordData.group_name || null,
      recordData.feed_type,
      recordData.quantity_used,
      recordData.purpose,
      recordData.weight_gain_kgs,
      recordData.remarks
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update feeding record
  async updateRecord(feedingId, recordData) {
    const query = `
      UPDATE feeding_records
      SET record_date = $1,
          goat_id = $2,
          group_name = $3,
          feed_type = $4,
          quantity_used = $5,
          purpose = $6,
          weight_gain_kgs = $7,
          remarks = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE feeding_id = $9
      RETURNING *
    `;
    const values = [
      recordData.record_date,
      recordData.goat_id || null,
      recordData.group_name || null,
      recordData.feed_type,
      recordData.quantity_used,
      recordData.purpose,
      recordData.weight_gain_kgs,
      recordData.remarks,
      feedingId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete feeding record
  async deleteRecord(feedingId) {
    const query = 'DELETE FROM feeding_records WHERE feeding_id = $1 RETURNING *';
    const result = await pool.query(query, [feedingId]);
    return result.rows[0];
  }

  // Search feeding records
  async searchRecords(searchTerm) {
    const query = `
      SELECT 
        f.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.weight as current_weight
      FROM feeding_records f
      LEFT JOIN goats g ON f.goat_id = g.goat_id
      WHERE f.goat_id ILIKE $1
         OR f.group_name ILIKE $1
         OR f.feed_type ILIKE $1
         OR f.purpose ILIKE $1
         OR g.breed ILIKE $1
      ORDER BY f.record_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get feeding statistics
  async getFeedingStats() {
    const query = `
      SELECT 
        COUNT(*) as total_records,
        COUNT(DISTINCT goat_id) as goats_fed,
        COUNT(DISTINCT group_name) as groups_fed,
        SUM(quantity_used) as total_feed_used,
        SUM(weight_gain_kgs) as total_weight_gain,
        AVG(weight_gain_kgs) as avg_weight_gain,
        SUM(CASE WHEN purpose = 'Fattening' THEN 1 ELSE 0 END) as fattening_records,
        SUM(CASE WHEN purpose = 'Maintenance' THEN 1 ELSE 0 END) as maintenance_records
      FROM feeding_records
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get feed consumption by feed type
  async getFeedConsumptionByType() {
    const query = `
      SELECT 
        feed_type,
        COUNT(*) as record_count,
        SUM(quantity_used) as total_quantity,
        AVG(quantity_used) as avg_quantity
      FROM feeding_records
      WHERE feed_type IS NOT NULL
      GROUP BY feed_type
      ORDER BY total_quantity DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new FeedingModel();
