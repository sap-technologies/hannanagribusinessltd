import pool from '../database/config.js';

// Model - Data layer for Matooke Farm entity
class MatookeModel {
  // Get all matooke farms
  async getAllFarms() {
    const query = 'SELECT * FROM matooke_farms ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get farm by ID
  async getFarmById(farmId) {
    const query = 'SELECT * FROM matooke_farms WHERE farm_id = $1';
    const result = await pool.query(query, [farmId]);
    return result.rows[0];
  }

  // Create new farm
  async createFarm(farmData) {
    const {
      farm_id,
      farm_name,
      location,
      size_acres,
      planting_date,
      variety,
      expected_harvest_date,
      actual_harvest_date,
      estimated_yield_kg,
      actual_yield_kg,
      status,
      manager,
      remarks
    } = farmData;

    const query = `
      INSERT INTO matooke_farms (
        farm_id, farm_name, location, size_acres, planting_date, variety,
        expected_harvest_date, actual_harvest_date, estimated_yield_kg,
        actual_yield_kg, status, manager, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      farm_id,
      farm_name,
      location,
      size_acres,
      planting_date || null,
      variety || null,
      expected_harvest_date || null,
      actual_harvest_date || null,
      estimated_yield_kg || null,
      actual_yield_kg || null,
      status || 'Active',
      manager || null,
      remarks || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update farm
  async updateFarm(farmId, farmData) {
    const {
      farm_name,
      location,
      size_acres,
      planting_date,
      variety,
      expected_harvest_date,
      actual_harvest_date,
      estimated_yield_kg,
      actual_yield_kg,
      status,
      manager,
      remarks
    } = farmData;

    const query = `
      UPDATE matooke_farms
      SET farm_name = $1, location = $2, size_acres = $3, planting_date = $4,
          variety = $5, expected_harvest_date = $6, actual_harvest_date = $7,
          estimated_yield_kg = $8, actual_yield_kg = $9, status = $10,
          manager = $11, remarks = $12, updated_at = CURRENT_TIMESTAMP
      WHERE farm_id = $13
      RETURNING *
    `;

    const values = [
      farm_name,
      location,
      size_acres,
      planting_date,
      variety,
      expected_harvest_date,
      actual_harvest_date,
      estimated_yield_kg,
      actual_yield_kg,
      status,
      manager,
      remarks,
      farmId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete farm
  async deleteFarm(farmId) {
    const query = 'DELETE FROM matooke_farms WHERE farm_id = $1 RETURNING *';
    const result = await pool.query(query, [farmId]);
    return result.rows[0];
  }

  // Get farms by status
  async getFarmsByStatus(status) {
    const query = 'SELECT * FROM matooke_farms WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  // Search farms
  async searchFarms(searchTerm) {
    const query = `
      SELECT * FROM matooke_farms
      WHERE farm_id ILIKE $1
         OR farm_name ILIKE $1
         OR location ILIKE $1
         OR variety ILIKE $1
         OR manager ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get total production stats
  async getProductionStats() {
    const query = `
      SELECT 
        COUNT(*) as total_farms,
        SUM(size_acres) as total_acres,
        SUM(estimated_yield_kg) as total_estimated_yield,
        SUM(actual_yield_kg) as total_actual_yield,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_farms
      FROM matooke_farms
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new MatookeModel();
