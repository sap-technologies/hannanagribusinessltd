import pool from '../database/config.js';

// Model - Data layer for Kid Growth & Weaning entity
class KidGrowthModel {
  // Get all kid growth records
  async getAllRecords() {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      ORDER BY kg.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get growth record by ID
  async getRecordById(growthId) {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex, k.date_of_birth,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      WHERE kg.growth_id = $1
    `;
    const result = await pool.query(query, [growthId]);
    return result.rows[0];
  }

  // Get growth record by kid ID
  async getRecordByKidId(kidId) {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex, k.date_of_birth,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      WHERE kg.kid_id = $1
    `;
    const result = await pool.query(query, [kidId]);
    return result.rows[0];
  }

  // Create new growth record
  async createRecord(growthData) {
    const {
      kid_id,
      mother_id,
      birth_weight,
      weaning_date,
      weaning_weight,
      target_market,
      remarks
    } = growthData;

    const query = `
      INSERT INTO kid_growth (
        kid_id, mother_id, birth_weight, weaning_date, weaning_weight,
        target_market, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;

    const values = [
      kid_id,
      mother_id || null,
      birth_weight || null,
      weaning_date || null,
      weaning_weight || null,
      target_market || null,
      remarks || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update growth record
  async updateRecord(growthId, growthData) {
    const {
      kid_id,
      mother_id,
      birth_weight,
      weaning_date,
      weaning_weight,
      target_market,
      remarks
    } = growthData;

    const query = `
      UPDATE kid_growth
      SET kid_id = $1, mother_id = $2, birth_weight = $3, weaning_date = $4,
          weaning_weight = $5, target_market = $6, remarks = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE growth_id = $8
      RETURNING *
    `;

    const values = [
      kid_id,
      mother_id,
      birth_weight,
      weaning_date,
      weaning_weight,
      target_market,
      remarks,
      growthId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete growth record
  async deleteRecord(growthId) {
    const query = 'DELETE FROM kid_growth WHERE growth_id = $1 RETURNING *';
    const result = await pool.query(query, [growthId]);
    return result.rows[0];
  }

  // Get records by target market
  async getRecordsByTargetMarket(targetMarket) {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      WHERE kg.target_market = $1
      ORDER BY kg.created_at DESC
    `;
    const result = await pool.query(query, [targetMarket]);
    return result.rows;
  }

  // Get kids ready for weaning (past weaning date but no weaning weight)
  async getReadyForWeaning() {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      WHERE kg.weaning_date IS NOT NULL
        AND kg.weaning_date <= CURRENT_DATE
        AND kg.weaning_weight IS NULL
      ORDER BY kg.weaning_date ASC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Search growth records
  async searchRecords(searchTerm) {
    const query = `
      SELECT kg.*, 
             k.breed as kid_breed, k.sex as kid_sex,
             m.breed as mother_breed
      FROM kid_growth kg
      LEFT JOIN goats k ON kg.kid_id = k.goat_id
      LEFT JOIN goats m ON kg.mother_id = m.goat_id
      WHERE kg.kid_id ILIKE $1
         OR kg.mother_id ILIKE $1
         OR kg.target_market ILIKE $1
      ORDER BY kg.created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get growth statistics
  async getGrowthStats() {
    const query = `
      SELECT 
        COUNT(*) as total_kids,
        COUNT(CASE WHEN weaning_weight IS NOT NULL THEN 1 END) as weaned_kids,
        COUNT(CASE WHEN target_market = 'Breeding' THEN 1 END) as breeding_kids,
        COUNT(CASE WHEN target_market = 'Meat' THEN 1 END) as meat_kids,
        AVG(birth_weight) as avg_birth_weight,
        AVG(weaning_weight) as avg_weaning_weight
      FROM kid_growth
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new KidGrowthModel();
