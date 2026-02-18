import pool from '../database/config.js';

class SalesMeatModel {
  // Get all meat sales records with goat details
  async getAllRecords() {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.production_type,
        g.status as goat_status
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      ORDER BY s.sale_date DESC, s.created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get sale record by ID
  async getRecordById(saleId) {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth,
        g.production_type,
        g.status as goat_status
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.sale_id = $1
    `;
    const result = await pool.query(query, [saleId]);
    return result.rows[0];
  }

  // Get sales by goat ID
  async getRecordsByGoatId(goatId) {
    const query = `
      SELECT * FROM sales_meat
      WHERE goat_id = $1
      ORDER BY sale_date DESC
    `;
    const result = await pool.query(query, [goatId]);
    return result.rows;
  }

  // Get sales by buyer
  async getRecordsByBuyer(buyer) {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.buyer ILIKE $1
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [`%${buyer}%`]);
    return result.rows;
  }

  // Get sales by date range
  async getRecordsByDateRange(startDate, endDate) {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.sale_date BETWEEN $1 AND $2
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  // Get sales by payment method
  async getRecordsByPaymentMethod(paymentMethod) {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.payment_method = $1
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [paymentMethod]);
    return result.rows;
  }

  // Create new meat sale record
  async createRecord(recordData) {
    const query = `
      INSERT INTO sales_meat 
      (sale_date, goat_id, live_weight, price_per_kg, total_price, buyer, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    const values = [
      recordData.sale_date,
      recordData.goat_id,
      recordData.live_weight,
      recordData.price_per_kg,
      recordData.total_price,
      recordData.buyer,
      recordData.payment_method
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update meat sale record
  async updateRecord(saleId, recordData) {
    const query = `
      UPDATE sales_meat
      SET sale_date = $1,
          goat_id = $2,
          live_weight = $3,
          price_per_kg = $4,
          total_price = $5,
          buyer = $6,
          payment_method = $7,
          updated_at = CURRENT_TIMESTAMP
      WHERE sale_id = $8
      RETURNING *
    `;
    const values = [
      recordData.sale_date,
      recordData.goat_id,
      recordData.live_weight,
      recordData.price_per_kg,
      recordData.total_price,
      recordData.buyer,
      recordData.payment_method,
      saleId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete meat sale record
  async deleteRecord(saleId) {
    const query = 'DELETE FROM sales_meat WHERE sale_id = $1 RETURNING *';
    const result = await pool.query(query, [saleId]);
    return result.rows[0];
  }

  // Search meat sale records
  async searchRecords(searchTerm) {
    const query = `
      SELECT 
        s.*,
        g.breed,
        g.sex,
        g.date_of_birth
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.goat_id ILIKE $1
         OR g.breed ILIKE $1
         OR s.buyer ILIKE $1
         OR s.payment_method ILIKE $1
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get meat sales statistics
  async getSalesStats() {
    const query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(total_price) as total_revenue,
        AVG(total_price) as average_price,
        SUM(live_weight) as total_weight_sold,
        AVG(live_weight) as average_weight,
        AVG(price_per_kg) as average_price_per_kg,
        COUNT(DISTINCT buyer) as total_buyers
      FROM sales_meat
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get sales by breed
  async getSalesByBreed() {
    const query = `
      SELECT 
        g.breed,
        COUNT(*) as count,
        SUM(s.total_price) as total_revenue,
        AVG(s.total_price) as average_price,
        SUM(s.live_weight) as total_weight,
        AVG(s.live_weight) as average_weight
      FROM sales_meat s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE g.breed IS NOT NULL
      GROUP BY g.breed
      ORDER BY total_revenue DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new SalesMeatModel();
