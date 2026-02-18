import sql from '../db.js';

class MonthlySummaryService {
  /**
   * Generate monthly summary report for a specific month
   * Automatically calculates from actual data
   */
  async generateMonthlySummary(year, month) {
    try {
      // Format month as YYYY-MM
      const monthStr = `${year}-${String(month).padStart(2, '0')}`;
      const startDate = `${monthStr}-01`;
      
      // Calculate last day of month
      const lastDay = new Date(year, month, 0).getDate();
      const endDate = `${monthStr}-${lastDay}`;
      
      // Get previous month for opening goats
      const prevMonth = month === 1 ? 12 : month - 1;
      const prevYear = month === 1 ? year - 1 : year;
      const prevMonthStr = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;

      // 1. Get opening goats (closing goats from previous month or current total)
      const [prevSummary] = await sql`
        SELECT closing_goats FROM monthly_summary 
        WHERE month = ${prevMonthStr}
      `;
      
      const [currentGoatCount] = await sql`
        SELECT COUNT(*) as count FROM goats WHERE status = 'Active'
      `;
      
      const opening_goats = prevSummary?.closing_goats || currentGoatCount?.count || 0;

      // 2. Count births (kids born in this month)
      const [births] = await sql`
        SELECT COUNT(*) as count FROM goats
        WHERE date_of_birth >= ${startDate} 
        AND date_of_birth <= ${endDate}
      `;

      // 3. Count purchases (goats with purchase date or acquisition in this month)
      const [purchases] = await sql`
        SELECT COUNT(*) as count FROM goats
        WHERE created_at >= ${startDate} 
        AND created_at <= ${endDate}
        AND source != 'Born on farm'
      `;

      // 4. Count deaths (from health records or status change)
      const [deaths] = await sql`
        SELECT COUNT(DISTINCT goat_id) as count FROM health_records
        WHERE treatment_date >= ${startDate} 
        AND treatment_date <= ${endDate}
        AND (illness_type ILIKE '%death%' OR treatment ILIKE '%died%')
      `;

      // 5. Count breeding sales
      const [breedingSales] = await sql`
        SELECT COUNT(*) as count, COALESCE(SUM(sale_price_ugx), 0) as total
        FROM sales_breeding
        WHERE sale_date >= ${startDate} 
        AND sale_date <= ${endDate}
      `;

      // 6. Count meat sales
      const [meatSales] = await sql`
        SELECT COUNT(*) as count, COALESCE(SUM(sale_price_ugx), 0) as total
        FROM sales_meat
        WHERE sale_date >= ${startDate} 
        AND sale_date <= ${endDate}
      `;

      // 7. Calculate total expenses
      const [expenses] = await sql`
        SELECT COALESCE(SUM(amount_ugx), 0) as total
        FROM expenses
        WHERE expense_date >= ${startDate} 
        AND expense_date <= ${endDate}
      `;

      // 8. Calculate closing goats
      const sold_breeding = parseInt(breedingSales?.count || 0);
      const sold_meat = parseInt(meatSales?.count || 0);
      const births_count = parseInt(births?.count || 0);
      const purchases_count = parseInt(purchases?.count || 0);
      const deaths_count = parseInt(deaths?.count || 0);
      
      const closing_goats = opening_goats + births_count + purchases_count - deaths_count - sold_breeding - sold_meat;

      // 9. Calculate financials
      const total_income_ugx = parseFloat(breedingSales?.total || 0) + parseFloat(meatSales?.total || 0);
      const total_expenses_ugx = parseFloat(expenses?.total || 0);
      const net_profit_ugx = total_income_ugx - total_expenses_ugx;

      const summaryData = {
        month: monthStr,
        opening_goats: parseInt(opening_goats),
        births: births_count,
        purchases: purchases_count,
        deaths: deaths_count,
        sold_breeding,
        sold_meat,
        closing_goats: Math.max(0, closing_goats), // Ensure non-negative
        total_expenses_ugx: Math.round(total_expenses_ugx),
        total_income_ugx: Math.round(total_income_ugx),
        net_profit_ugx: Math.round(net_profit_ugx)
      };

      // Check if summary already exists
      const [existing] = await sql`
        SELECT summary_id FROM monthly_summary WHERE month = ${monthStr}
      `;

      if (existing) {
        // Update existing summary
        const [updated] = await sql`
          UPDATE monthly_summary
          SET 
            opening_goats = ${summaryData.opening_goats},
            births = ${summaryData.births},
            purchases = ${summaryData.purchases},
            deaths = ${summaryData.deaths},
            sold_breeding = ${summaryData.sold_breeding},
            sold_meat = ${summaryData.sold_meat},
            closing_goats = ${summaryData.closing_goats},
            total_expenses_ugx = ${summaryData.total_expenses_ugx},
            total_income_ugx = ${summaryData.total_income_ugx},
            net_profit_ugx = ${summaryData.net_profit_ugx},
            updated_at = CURRENT_TIMESTAMP
          WHERE month = ${monthStr}
          RETURNING *
        `;
        return updated;
      } else {
        // Insert new summary
        const [created] = await sql`
          INSERT INTO monthly_summary (
            month, opening_goats, births, purchases, deaths,
            sold_breeding, sold_meat, closing_goats,
            total_expenses_ugx, total_income_ugx, net_profit_ugx
          )
          VALUES (
            ${summaryData.month}, ${summaryData.opening_goats}, ${summaryData.births},
            ${summaryData.purchases}, ${summaryData.deaths}, ${summaryData.sold_breeding},
            ${summaryData.sold_meat}, ${summaryData.closing_goats}, ${summaryData.total_expenses_ugx},
            ${summaryData.total_income_ugx}, ${summaryData.net_profit_ugx}
          )
          RETURNING *
        `;
        return created;
      }

    } catch (error) {
      console.error('Error generating monthly summary:', error);
      throw error;
    }
  }

  /**
   * Generate summaries for multiple months
   */
  async generateMultipleMonths(startYear, startMonth, endYear, endMonth) {
    const summaries = [];
    
    let currentYear = startYear;
    let currentMonth = startMonth;
    
    while (currentYear < endYear || (currentYear === endYear && currentMonth <= endMonth)) {
      try {
        const summary = await this.generateMonthlySummary(currentYear, currentMonth);
        summaries.push(summary);
      } catch (error) {
        console.error(`Failed to generate summary for ${currentYear}-${currentMonth}:`, error.message);
      }
      
      // Move to next month
      currentMonth++;
      if (currentMonth > 12) {
        currentMonth = 1;
        currentYear++;
      }
    }
    
    return summaries;
  }

  /**
   * Generate summary for current month
   */
  async generateCurrentMonth() {
    const now = new Date();
    return await this.generateMonthlySummary(now.getFullYear(), now.getMonth() + 1);
  }

  /**
   * Generate summary for last month
   */
  async generateLastMonth() {
    const now = new Date();
    const lastMonth = now.getMonth() === 0 ? 12 : now.getMonth();
    const year = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
    return await this.generateMonthlySummary(year, lastMonth);
  }

  /**
   * Get breakdown details for a specific month
   */
  async getMonthBreakdown(year, month) {
    const monthStr = `${year}-${String(month).padStart(2, '0')}`;
    const startDate = `${monthStr}-01`;
    const lastDay = new Date(year, month, 0).getDate();
    const endDate = `${monthStr}-${lastDay}`;

    // Get detailed breakdown
    const [expensesByCategory] = await sql`
      SELECT 
        expense_category,
        COUNT(*) as count,
        SUM(amount_ugx) as total
      FROM expenses
      WHERE expense_date >= ${startDate} AND expense_date <= ${endDate}
      GROUP BY expense_category
      ORDER BY total DESC
    `;

    const [salesBreakdown] = await sql`
      SELECT 
        'Breeding' as type,
        COUNT(*) as count,
        SUM(sale_price_ugx) as total
      FROM sales_breeding
      WHERE sale_date >= ${startDate} AND sale_date <= ${endDate}
      UNION ALL
      SELECT 
        'Meat' as type,
        COUNT(*) as count,
        SUM(sale_price_ugx) as total
      FROM sales_meat
      WHERE sale_date >= ${startDate} AND sale_date <= ${endDate}
    `;

    return {
      expenses_by_category: expensesByCategory,
      sales_breakdown: salesBreakdown
    };
  }
}

export default new MonthlySummaryService();
