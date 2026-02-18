import sql from '../db.js';

class SearchService {
  /**
   * Search and filter goats
   */
  async searchGoats(filters = {}) {
    const { 
      search, 
      breed, 
      sex, 
      status, 
      purpose,
      minWeight,
      maxWeight,
      sortBy = 'goat_id',
      sortOrder = 'DESC',
      limit = 100,
      offset = 0
    } = filters;

    let conditions = [];
    let params = {};

    // Full-text search across multiple fields
    if (search) {
      conditions.push(`(
        tag_number ILIKE ${'%' + search + '%'} OR
        breed ILIKE ${'%' + search + '%'} OR
        color_markings ILIKE ${'%' + search + '%'} OR
        location ILIKE ${'%' + search + '%'}
      )`);
    }

    // Filter by breed
    if (breed) {
      conditions.push(sql`breed = ${breed}`);
    }

    // Filter by sex
    if (sex) {
      conditions.push(sql`sex = ${sex}`);
    }

    // Filter by status
    if (status) {
      conditions.push(sql`status = ${status}`);
    }

    // Filter by purpose
    if (purpose) {
      conditions.push(sql`purpose = ${purpose}`);
    }

    // Filter by weight range
    if (minWeight) {
      conditions.push(sql`weight_kg >= ${minWeight}`);
    }
    if (maxWeight) {
      conditions.push(sql`weight_kg <= ${maxWeight}`);
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Valid sort columns
    const validSortColumns = ['goat_id', 'tag_number', 'breed', 'date_of_birth', 'weight_kg', 'date_acquired'];
    const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'goat_id';
    const sortDirection = sortOrder.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    let query;
    if (search) {
      query = await sql`
        SELECT * FROM goats 
        WHERE (
          tag_number ILIKE ${'%' + search + '%'} OR
          breed ILIKE ${'%' + search + '%'} OR
          color_markings ILIKE ${'%' + search + '%'} OR
          location ILIKE ${'%' + search + '%'}
        )
        ${breed ? sql`AND breed = ${breed}` : sql``}
        ${sex ? sql`AND sex = ${sex}` : sql``}
        ${status ? sql`AND status = ${status}` : sql``}
        ${purpose ? sql`AND purpose = ${purpose}` : sql``}
        ${minWeight ? sql`AND weight_kg >= ${minWeight}` : sql``}
        ${maxWeight ? sql`AND weight_kg <= ${maxWeight}` : sql``}
        ORDER BY ${sql(sortColumn)} ${sortDirection === 'ASC' ? sql`ASC` : sql`DESC`}
        LIMIT ${limit} OFFSET ${offset}
      `;
    } else {
      query = await sql`
        SELECT * FROM goats 
        WHERE 1=1
        ${breed ? sql`AND breed = ${breed}` : sql``}
        ${sex ? sql`AND sex = ${sex}` : sql``}
        ${status ? sql`AND status = ${status}` : sql``}
        ${purpose ? sql`AND purpose = ${purpose}` : sql``}
        ${minWeight ? sql`AND weight_kg >= ${minWeight}` : sql``}
        ${maxWeight ? sql`AND weight_kg <= ${maxWeight}` : sql``}
        ORDER BY ${sql(sortColumn)} ${sortDirection === 'ASC' ? sql`ASC` : sql`DESC`}
        LIMIT ${limit} OFFSET ${offset}
      `;
    }

    return query;
  }

  /**
   * Search health records
   */
  async searchHealthRecords(filters = {}) {
    const { 
      search,
      goatTag,
      illnessType,
      treatmentType,
      startDate,
      endDate,
      sortBy = 'treatment_date',
      sortOrder = 'DESC'
    } = filters;

    let query;
    
    if (search) {
      query = await sql`
        SELECT hr.*, g.tag_number as goat_tag, g.breed
        FROM health_records hr
        LEFT JOIN goats g ON hr.goat_id = g.goat_id
        WHERE (
          g.tag_number ILIKE ${'%' + search + '%'} OR
          hr.illness_type ILIKE ${'%' + search + '%'} OR
          hr.treatment_type ILIKE ${'%' + search + '%'} OR
          hr.medication_given ILIKE ${'%' + search + '%'}
        )
        ${illnessType ? sql`AND hr.illness_type = ${illnessType}` : sql``}
        ${startDate ? sql`AND hr.treatment_date >= ${startDate}` : sql``}
        ${endDate ? sql`AND hr.treatment_date <= ${endDate}` : sql``}
        ORDER BY hr.${sql(sortBy)} ${sortOrder === 'ASC' ? sql`ASC` : sql`DESC`}
      `;
    } else {
      query = await sql`
        SELECT hr.*, g.tag_number as goat_tag, g.breed
        FROM health_records hr
        LEFT JOIN goats g ON hr.goat_id = g.goat_id
        WHERE 1=1
        ${goatTag ? sql`AND g.tag_number = ${goatTag}` : sql``}
        ${illnessType ? sql`AND hr.illness_type = ${illnessType}` : sql``}
        ${startDate ? sql`AND hr.treatment_date >= ${startDate}` : sql``}
        ${endDate ? sql`AND hr.treatment_date <= ${endDate}` : sql``}
        ORDER BY hr.treatment_date ${sortOrder === 'ASC' ? sql`ASC` : sql`DESC`}
      `;
    }

    return query;
  }

  /**
   * Search sales records
   */
  async searchSales(filters = {}) {
    const {
      search,
      type = 'breeding', // 'breeding' or 'meat'
      startDate,
      endDate,
      minAmount,
      maxAmount,
      sortBy = 'sale_date',
      sortOrder = 'DESC'
    } = filters;

    const table = type === 'breeding' ? 'sales_breeding' : 'sales_meat';

    let query;
    
    if (search) {
      query = await sql`
        SELECT * FROM ${sql(table)}
        WHERE (
          buyer_name ILIKE ${'%' + search + '%'} OR
          buyer_contact ILIKE ${'%' + search + '%'}
        )
        ${startDate ? sql`AND sale_date >= ${startDate}` : sql``}
        ${endDate ? sql`AND sale_date <= ${endDate}` : sql``}
        ${minAmount ? sql`AND total_amount >= ${minAmount}` : sql``}
        ${maxAmount ? sql`AND total_amount <= ${maxAmount}` : sql``}
        ORDER BY ${sql(sortBy)} ${sortOrder === 'ASC' ? sql`ASC` : sql`DESC`}
      `;
    } else {
      query = await sql`
        SELECT * FROM ${sql(table)}
        WHERE 1=1
        ${startDate ? sql`AND sale_date >= ${startDate}` : sql``}
        ${endDate ? sql`AND sale_date <= ${endDate}` : sql``}
        ${minAmount ? sql`AND total_amount >= ${minAmount}` : sql``}
        ${maxAmount ? sql`AND total_amount <= ${maxAmount}` : sql``}
        ORDER BY sale_date ${sortOrder === 'ASC' ? sql`ASC` : sql`DESC`}
      `;
    }

    return query;
  }

  /**
   * Get filter options (distinct values for dropdowns)
   */
  async getFilterOptions() {
    const [breeds, statuses, purposes] = await Promise.all([
      sql`SELECT DISTINCT breed FROM goats WHERE breed IS NOT NULL ORDER BY breed`,
      sql`SELECT DISTINCT status FROM goats WHERE status IS NOT NULL ORDER BY status`,
      sql`SELECT DISTINCT purpose FROM goats WHERE purpose IS NOT NULL ORDER BY purpose`
    ]);

    return {
      breeds: breeds.map(b => b.breed),
      statuses: statuses.map(s => s.status),
      purposes: purposes.map(p => p.purpose)
    };
  }
}

export default new SearchService();
