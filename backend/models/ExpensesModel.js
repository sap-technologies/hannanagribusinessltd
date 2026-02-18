import pool from '../database/config.js';

class ExpensesModel {
  // Get all expense records
  async getAllRecords() {
    const query = `
      SELECT * FROM expenses
      ORDER BY expense_date DESC, created_at DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get expense record by ID
  async getRecordById(expenseId) {
    const query = `SELECT * FROM expenses WHERE expense_id = $1`;
    const result = await pool.query(query, [expenseId]);
    return result.rows[0];
  }

  // Create new expense record
  async createRecord(expenseData) {
    const query = `
      INSERT INTO expenses (
        expense_date, category, description, amount_ugx, paid_by, approved_by
      )
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [
      expenseData.expense_date,
      expenseData.category,
      expenseData.description,
      expenseData.amount_ugx,
      expenseData.paid_by,
      expenseData.approved_by || null
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Update expense record
  async updateRecord(expenseId, expenseData) {
    const query = `
      UPDATE expenses
      SET 
        expense_date = $1,
        category = $2,
        description = $3,
        amount_ugx = $4,
        paid_by = $5,
        approved_by = $6,
        updated_at = CURRENT_TIMESTAMP
      WHERE expense_id = $7
      RETURNING *
    `;
    const values = [
      expenseData.expense_date,
      expenseData.category,
      expenseData.description,
      expenseData.amount_ugx,
      expenseData.paid_by,
      expenseData.approved_by || null,
      expenseId
    ];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  // Delete expense record
  async deleteRecord(expenseId) {
    const query = `DELETE FROM expenses WHERE expense_id = $1 RETURNING *`;
    const result = await pool.query(query, [expenseId]);
    return result.rows[0];
  }

  // Get expenses by category
  async getRecordsByCategory(category) {
    const query = `
      SELECT * FROM expenses
      WHERE category = $1
      ORDER BY expense_date DESC
    `;
    const result = await pool.query(query, [category]);
    return result.rows;
  }

  // Get expenses by date range
  async getRecordsByDateRange(startDate, endDate) {
    const query = `
      SELECT * FROM expenses
      WHERE expense_date BETWEEN $1 AND $2
      ORDER BY expense_date DESC
    `;
    const result = await pool.query(query, [startDate, endDate]);
    return result.rows;
  }

  // Get expenses by paid by
  async getRecordsByPaidBy(paidBy) {
    const query = `
      SELECT * FROM expenses
      WHERE paid_by ILIKE $1
      ORDER BY expense_date DESC
    `;
    const result = await pool.query(query, [`%${paidBy}%`]);
    return result.rows;
  }

  // Search expenses
  async searchRecords(searchTerm) {
    const query = `
      SELECT * FROM expenses
      WHERE 
        description ILIKE $1 OR
        category ILIKE $1 OR
        paid_by ILIKE $1 OR
        approved_by ILIKE $1
      ORDER BY expense_date DESC
    `;
    const result = await pool.query(query, [`%${searchTerm}%`]);
    return result.rows;
  }

  // Get expense statistics
  async getExpenseStats() {
    const query = `
      SELECT 
        COUNT(*) as total_expenses,
        SUM(amount_ugx) as total_amount,
        AVG(amount_ugx) as average_amount,
        COUNT(DISTINCT category) as total_categories,
        COUNT(DISTINCT paid_by) as total_payers
      FROM expenses
    `;
    const result = await pool.query(query);
    return result.rows[0];
  }

  // Get expenses by category with totals
  async getExpensesByCategory() {
    const query = `
      SELECT 
        category,
        COUNT(*) as expense_count,
        SUM(amount_ugx) as total_amount,
        AVG(amount_ugx) as average_amount
      FROM expenses
      GROUP BY category
      ORDER BY total_amount DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }

  // Get monthly expense totals
  async getMonthlyExpenses() {
    const query = `
      SELECT 
        DATE_TRUNC('month', expense_date) as month,
        COUNT(*) as expense_count,
        SUM(amount_ugx) as total_amount
      FROM expenses
      GROUP BY DATE_TRUNC('month', expense_date)
      ORDER BY month DESC
    `;
    const result = await pool.query(query);
    return result.rows;
  }
}

export default new ExpensesModel();
