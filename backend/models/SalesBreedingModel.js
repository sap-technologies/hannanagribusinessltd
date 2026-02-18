import pool from '../database/config.js';

class SalesBreedingModel {
  // Get all breeding sales records with goat details
  async getAllRecords() {
    const query = `
      SELECT 
        s.*,
        g.date_of_birth,
        g.production_type,
        g.status as goat_status
      FROM sales_breeding s
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
        g.date_of_birth,
        g.production_type,
        g.status as goat_status
      FROM sales_breeding s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.sale_id = $1
    `;
    const result = await pool.query(query, [saleId]);
    return result.rows[0];
  }

  // Get sales by goat ID
  async getRecordsByGoatId(goatId) {
    const query = `
      SELECT * FROM sales_breeding
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
        g.date_of_birth,
        g.production_type
      FROM sales_breeding s
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
        g.date_of_birth,
        g.production_type
      FROM sales_breeding s
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
        g.date_of_birth,
        g.production_type
      FROM sales_breeding s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.payment_method = $1
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [paymentMethod]);
    return result.rows;
  }

  // Create new breeding sale record
  async createRecord(recordData) {
    const query = `
      INSERT INTO sales_breeding 
      (sale_date, goat_id, breed, sex, age_months, buyer, sale_price_ugx, payment_method)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const values = [
      recordData.sale_date,
      recordData.goat_id,
      recordData.breed,
      recordData.sex,
      recordData.age_months,
      recordData.buyer,
      recordData.sale_price_ugx,
      recordData.payment_method
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update breeding sale record
  async updateRecord(saleId, recordData) {
    const query = `
      UPDATE sales_breeding
      SET sale_date = $1,
          goat_id = $2,
          breed = $3,
          sex = $4,
          age_months = $5,
          buyer = $6,
          sale_price_ugx = $7,
          payment_method = $8,
          updated_at = CURRENT_TIMESTAMP
      WHERE sale_id = $9
      RETURNING *
    `;
    const values = [
      recordData.sale_date,
      recordData.goat_id,
      recordData.breed,
      recordData.sex,
      recordData.age_months,
      recordData.buyer,
      recordData.sale_price_ugx,
      recordData.payment_method,
      saleId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete breeding sale record
  async deleteRecord(saleId) {
    const query = 'DELETE FROM sales_breeding WHERE sale_id = $1 RETURNING *';
    const result = await pool.query(query, [saleId]);
    return result.rows[0];
  }

  // Search breeding sale records
  async searchRecords(searchTerm) {
    const query = `
      SELECT 
        s.*,
        g.date_of_birth,
        g.production_type
      FROM sales_breeding s
      LEFT JOIN goats g ON s.goat_id = g.goat_id
      WHERE s.goat_id ILIKE $1
         OR s.breed ILIKE $1
         OR s.buyer ILIKE $1
         OR s.payment_method ILIKE $1
      ORDER BY s.sale_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get breeding sales statistics
  async getSalesStats() {
    const query = `
      SELECT 
        COUNT(*) as total_sales,
        SUM(sale_price_ugx) as total_revenue,
        AVG(sale_price_ugx) as average_price,
        COUNT(DISTINCT buyer) as total_buyers,
        SUM(CASE WHEN sex = 'Male' THEN 1 ELSE 0 END) as male_sold,
        SUM(CASE WHEN sex = 'Female' THEN 1 ELSE 0 END) as female_sold,
        AVG(age_months) as average_age_months
      FROM sales_breeding
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get sales by breed
  async getSalesByBreed() {
    const query = `
      SELECT 
        breed,
        COUNT(*) as count,
        SUM(sale_price_ugx) as total_revenue,
        AVG(sale_price_ugx) as average_price
      FROM sales_breeding
      WHERE breed IS NOT NULL
      GROUP BY breed
      ORDER BY total_revenue DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new SalesBreedingModel();
