import pool from '../database/config.js';

class MonthlySummaryModel {
  // Get all monthly summary records
  async getAllRecords() {
    const query = `
      SELECT * FROM monthly_summary
      ORDER BY month DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get summary record by ID
  async getRecordById(summaryId) {
    const query = `SELECT * FROM monthly_summary WHERE summary_id = $1`;
    const result = await pool.query(query, [summaryId]);
    return result.rows[0];
  }

  // Get summary by month
  async getRecordByMonth(month) {
    const query = `SELECT * FROM monthly_summary WHERE month = $1`;
    const result = await pool.query(query, [month]);
    return result.rows[0];
  }

  // Create new monthly summary record
  async createRecord(summaryData) {
    const query = `
      INSERT INTO monthly_summary (
        month, opening_goats, births, purchases, deaths, 
        sold_breeding, sold_meat, closing_goats,
        total_expenses_ugx, total_income_ugx, net_profit_ugx
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;
    const values = [
      summaryData.month,
      summaryData.opening_goats || 0,
      summaryData.births || 0,
      summaryData.purchases || 0,
      summaryData.deaths || 0,
      summaryData.sold_breeding || 0,
      summaryData.sold_meat || 0,
      summaryData.closing_goats || 0,
      summaryData.total_expenses_ugx || 0,
      summaryData.total_income_ugx || 0,
      summaryData.net_profit_ugx || 0
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update monthly summary record
  async updateRecord(summaryId, summaryData) {
    const query = `
      UPDATE monthly_summary
      SET 
        month = $1,
        opening_goats = $2,
        births = $3,
        purchases = $4,
        deaths = $5,
        sold_breeding = $6,
        sold_meat = $7,
        closing_goats = $8,
        total_expenses_ugx = $9,
        total_income_ugx = $10,
        net_profit_ugx = $11,
        updated_at = CURRENT_TIMESTAMP
      WHERE summary_id = $12
      RETURNING *
    `;
    const values = [
      summaryData.month,
      summaryData.opening_goats || 0,
      summaryData.births || 0,
      summaryData.purchases || 0,
      summaryData.deaths || 0,
      summaryData.sold_breeding || 0,
      summaryData.sold_meat || 0,
      summaryData.closing_goats || 0,
      summaryData.total_expenses_ugx || 0,
      summaryData.total_income_ugx || 0,
      summaryData.net_profit_ugx || 0,
      summaryId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete monthly summary record
  async deleteRecord(summaryId) {
    const query = `DELETE FROM monthly_summary WHERE summary_id = $1 RETURNING *`;
    const result = await pool.query(query, [summaryId]);
    return result.rows[0];
  }

  // Get summaries by date range
  async getRecordsByDateRange(startMonth, endMonth) {
    const query = `
      SELECT * FROM monthly_summary
      WHERE month BETWEEN $1 AND $2
      ORDER BY month DESC
    `;
    const result = await pool.query(query, [startMonth, endMonth]);
    return result.rows;
  }

  // Get summaries by year
  async getRecordsByYear(year) {
    const query = `
      SELECT * FROM monthly_summary
      WHERE EXTRACT(YEAR FROM month) = $1
      ORDER BY month DESC
    `;
    const result = await pool.query(query, [year]);
    return result.rows;
  }

  // Search summaries
  async searchRecords(searchTerm) {
    const query = `
      SELECT * FROM monthly_summary
      WHERE 
        TO_CHAR(month, 'Month YYYY') ILIKE $1 OR
        CAST(opening_goats AS TEXT) ILIKE $1 OR
        CAST(closing_goats AS TEXT) ILIKE $1
      ORDER BY month DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get summary statistics
  async getSummaryStats() {
    const query = `
      SELECT 
        COUNT(*) as total_months,
        SUM(births) as total_births,
        SUM(purchases) as total_purchases,
        SUM(deaths) as total_deaths,
        SUM(sold_breeding) as total_sold_breeding,
        SUM(sold_meat) as total_sold_meat,
        SUM(total_expenses_ugx) as total_expenses,
        SUM(total_income_ugx) as total_income,
        SUM(net_profit_ugx) as total_profit,
        AVG(net_profit_ugx) as average_monthly_profit
      FROM monthly_summary
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get yearly summary aggregates
  async getYearlySummary() {
    const query = `
      SELECT 
        EXTRACT(YEAR FROM month) as year,
        COUNT(*) as months_recorded,
        SUM(births) as total_births,
        SUM(deaths) as total_deaths,
        SUM(sold_breeding + sold_meat) as total_sold,
        SUM(total_expenses_ugx) as total_expenses,
        SUM(total_income_ugx) as total_income,
        SUM(net_profit_ugx) as total_profit
      FROM monthly_summary
      GROUP BY EXTRACT(YEAR FROM month)
      ORDER BY year DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get latest summary
  async getLatestSummary() {
    const query = `
      SELECT * FROM monthly_summary
      ORDER BY month DESC
      LIMIT 1
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }
}

export default new MonthlySummaryModel();
