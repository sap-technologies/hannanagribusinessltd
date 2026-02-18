import pool from '../database/config.js';

// Model - Data layer for Coffee Farm entity
class CoffeeModel {
  // Get all coffee farms
  async getAllFarms() {
    const query = 'SELECT * FROM coffee_farms ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get farm by ID
  async getFarmById(farmId) {
    const query = 'SELECT * FROM coffee_farms WHERE farm_id = $1';
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
      coffee_variety,
      planting_date,
      tree_count,
      production_season,
      estimated_yield_kg,
      actual_yield_kg,
      quality_grade,
      processing_method,
      status,
      manager,
      remarks
    } = farmData;

    const query = `
      INSERT INTO coffee_farms (
        farm_id, farm_name, location, size_acres, coffee_variety, planting_date,
        tree_count, production_season, estimated_yield_kg, actual_yield_kg,
        quality_grade, processing_method, status, manager, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
      RETURNING *
    `;

    const values = [
      farm_id,
      farm_name,
      location,
      size_acres,
      coffee_variety,
      planting_date || null,
      tree_count || null,
      production_season || null,
      estimated_yield_kg || null,
      actual_yield_kg || null,
      quality_grade || null,
      processing_method || null,
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
      coffee_variety,
      planting_date,
      tree_count,
      production_season,
      estimated_yield_kg,
      actual_yield_kg,
      quality_grade,
      processing_method,
      status,
      manager,
      remarks
    } = farmData;

    const query = `
      UPDATE coffee_farms
      SET farm_name = $1, location = $2, size_acres = $3, coffee_variety = $4,
          planting_date = $5, tree_count = $6, production_season = $7,
          estimated_yield_kg = $8, actual_yield_kg = $9, quality_grade = $10,
          processing_method = $11, status = $12, manager = $13, remarks = $14,
          updated_at = CURRENT_TIMESTAMP
      WHERE farm_id = $15
      RETURNING *
    `;

    const values = [
      farm_name,
      location,
      size_acres,
      coffee_variety,
      planting_date,
      tree_count,
      production_season,
      estimated_yield_kg,
      actual_yield_kg,
      quality_grade,
      processing_method,
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
    const query = 'DELETE FROM coffee_farms WHERE farm_id = $1 RETURNING *';
    const result = await pool.query(query, [farmId]);
    return result.rows[0];
  }

  // Get farms by status
  async getFarmsByStatus(status) {
    const query = 'SELECT * FROM coffee_farms WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  // Search farms
  async searchFarms(searchTerm) {
    const query = `
      SELECT * FROM coffee_farms
      WHERE farm_id ILIKE $1
         OR farm_name ILIKE $1
         OR location ILIKE $1
         OR coffee_variety ILIKE $1
         OR manager ILIKE $1
         OR quality_grade ILIKE $1
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get production stats
  async getProductionStats() {
    const query = `
      SELECT 
        COUNT(*) as total_farms,
        SUM(size_acres) as total_acres,
        SUM(tree_count) as total_trees,
        SUM(estimated_yield_kg) as total_estimated_yield,
        SUM(actual_yield_kg) as total_actual_yield,
        COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_farms
      FROM coffee_farms
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new CoffeeModel();
