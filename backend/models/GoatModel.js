import pool from '../database/config.js';

// Model - Data layer for Goat entity
class GoatModel {
  // Get all goats (active only by default)
  async getAllGoats(includeInactive = false) {
    let query = 'SELECT * FROM goats';
    if (!includeInactive) {
      query += " WHERE status = 'Active'";
    }
    query += ' ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get all goats including inactive (for reporting/history)
  async getAllGoatsIncluding() {
    const query = 'SELECT * FROM goats ORDER BY created_at DESC';
    const result = await pool.query(query);
    return result.rows;
  }

  // Get goat by ID
  async getGoatById(goatId) {
    const query = 'SELECT * FROM goats WHERE goat_id = $1';
    const result = await pool.query(query, [goatId]);
    return result.rows[0];
  }

  // Create new goat
  async createGoat(goatData) {
    const {
      goat_id,
      breed,
      sex,
      date_of_birth,
      production_type,
      source,
      mother_id,
      father_id,
      status,
      weight,
      remarks
    } = goatData;

    const query = `
      INSERT INTO goats (
        goat_id, breed, sex, date_of_birth, production_type,
        source, mother_id, father_id, status, weight, remarks
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
      goat_id,
      breed,
      sex,
      date_of_birth,
      production_type,
      source || null,
      mother_id || null,
      father_id || null,
      status || 'Active',
      weight || null,
      remarks || null
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update goat
  async updateGoat(goatId, goatData) {
    const {
      breed,
      sex,
      date_of_birth,
      production_type,
      source,
      mother_id,
      father_id,
      status,
      weight,
      remarks
    } = goatData;

    const query = `
      UPDATE goats
      SET breed = $1, sex = $2, date_of_birth = $3, production_type = $4,
          source = $5, mother_id = $6, father_id = $7, status = $8,
          weight = $9, remarks = $10, updated_at = CURRENT_TIMESTAMP
      WHERE goat_id = $11
      RETURNING *
    `;

    const values = [
      breed,
      sex,
      date_of_birth,
      production_type,
      source,
      mother_id,
      father_id,
      status,
      weight,
      remarks,
      goatId
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete goat
  async deleteGoat(goatId) {
    const query = 'DELETE FROM goats WHERE goat_id = $1 RETURNING *';
    const result = await pool.query(query, [goatId]);
    return result.rows[0];
  }

  // Get goats by status
  async getGoatsByStatus(status) {
    const query = 'SELECT * FROM goats WHERE status = $1 ORDER BY created_at DESC';
    const result = await pool.query(query, [status]);
    return result.rows;
  }

  // Update goat status only (convenience method)
  async updateGoatStatus(goatId, status) {
    const query = `
      UPDATE goats
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE goat_id = $2
      RETURNING *
    `;
    const result = await pool.query(query, [status, goatId]);
    return result.rows[0];
  }

  // Get offspring of a goat
  async getOffspring(goatId, parentType = 'both') {
    let query;
    if (parentType === 'mother') {
      query = 'SELECT * FROM goats WHERE mother_id = $1 ORDER BY date_of_birth DESC';
    } else if (parentType === 'father') {
      query = 'SELECT * FROM goats WHERE father_id = $1 ORDER BY date_of_birth DESC';
    } else {
      query = 'SELECT * FROM goats WHERE mother_id = $1 OR father_id = $1 ORDER BY date_of_birth DESC';
    }
    const result = await pool.query(query, [goatId]);
    return result.rows;
  }

  // Search goats (active only)
  async searchGoats(searchTerm) {
    const query = `
      SELECT * FROM goats
      WHERE (
        goat_id ILIKE $1
        OR breed ILIKE $1
        OR production_type ILIKE $1
        OR remarks ILIKE $1
      )
      AND status = 'Active'
      ORDER BY created_at DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }
}

export default new GoatModel();
