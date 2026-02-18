import sql from '../db.js';

const createTables = async () => {
  try {
    console.log('🔧 Creating database tables for Hannan Agribusiness Limited...\n');

    // ========== BREEDING FARM PROJECT (Goats) ==========
    console.log('📊 Creating Breeding Farm tables...');
    const createGoatsTable = `
      CREATE TABLE IF NOT EXISTS goats (
        goat_id VARCHAR(50) PRIMARY KEY,
        breed VARCHAR(100) NOT NULL,
        sex VARCHAR(10) NOT NULL CHECK (sex IN ('Male', 'Female')),
        date_of_birth DATE NOT NULL,
        production_type VARCHAR(50) NOT NULL,
        source VARCHAR(100),
        mother_id VARCHAR(50),
        father_id VARCHAR(50),
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        weight DECIMAL(10, 2),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (mother_id) REFERENCES goats(goat_id) ON DELETE SET NULL,
        FOREIGN KEY (father_id) REFERENCES goats(goat_id) ON DELETE SET NULL
      );
    `;

    const createGoatIndexes = `
      CREATE INDEX IF NOT EXISTS idx_goats_breed ON goats(breed);
      CREATE INDEX IF NOT EXISTS idx_goats_status ON goats(status);
      CREATE INDEX IF NOT EXISTS idx_goats_mother ON goats(mother_id);
      CREATE INDEX IF NOT EXISTS idx_goats_father ON goats(father_id);
    `;

    await sql.unsafe(createGoatsTable);
    await sql.unsafe(createGoatIndexes);
    console.log('✅ Breeding Farm (Goats) tables created');

    // Breeding & Kidding Records
    const createBreedingTable = `
      CREATE TABLE IF NOT EXISTS breeding_records (
        breeding_id SERIAL PRIMARY KEY,
        doe_id VARCHAR(50) NOT NULL,
        buck_id VARCHAR(50) NOT NULL,
        heat_observed VARCHAR(3) NOT NULL CHECK (heat_observed IN ('Yes', 'No')),
        mating_time TIMESTAMP NOT NULL,
        expected_kidding_date DATE,
        actual_kidding_date DATE,
        no_of_kids INTEGER,
        male_kids INTEGER,
        female_kids INTEGER,
        kidding_outcome VARCHAR(100),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (doe_id) REFERENCES goats(goat_id) ON DELETE CASCADE,
        FOREIGN KEY (buck_id) REFERENCES goats(goat_id) ON DELETE CASCADE
      );
    `;

    const createBreedingIndexes = `
      CREATE INDEX IF NOT EXISTS idx_breeding_doe ON breeding_records(doe_id);
      CREATE INDEX IF NOT EXISTS idx_breeding_buck ON breeding_records(buck_id);
      CREATE INDEX IF NOT EXISTS idx_breeding_date ON breeding_records(mating_time);
    `;

    await sql.unsafe(createBreedingTable);
    await sql.unsafe(createBreedingIndexes);
    console.log('✅ Breeding Farm (Breeding & Kidding) tables created');

    // Kid Growth & Weaning table
    const createKidGrowthTable = `
      CREATE TABLE IF NOT EXISTS kid_growth (
        growth_id SERIAL PRIMARY KEY,
        kid_id VARCHAR(50) NOT NULL,
        mother_id VARCHAR(50),
        birth_weight DECIMAL(6, 2),
        weaning_date DATE,
        weaning_weight DECIMAL(6, 2),
        target_market VARCHAR(20) CHECK (target_market IN ('Breeding', 'Meat')),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (kid_id) REFERENCES goats(goat_id) ON DELETE CASCADE,
        FOREIGN KEY (mother_id) REFERENCES goats(goat_id) ON DELETE SET NULL
      );
    `;

    const createKidGrowthIndexes = `
      CREATE INDEX IF NOT EXISTS idx_growth_kid ON kid_growth(kid_id);
      CREATE INDEX IF NOT EXISTS idx_growth_mother ON kid_growth(mother_id);
    `;

    await sql.unsafe(createKidGrowthTable);
    await sql.unsafe(createKidGrowthIndexes);
    console.log('✅ Breeding Farm (Kid Growth & Weaning) tables created');

    // Health & Treatment table
    const createHealthTable = `
      CREATE TABLE IF NOT EXISTS health_records (
        health_id SERIAL PRIMARY KEY,
        record_date DATE NOT NULL,
        goat_id VARCHAR(50) NOT NULL,
        problem_observed TEXT NOT NULL,
        treatment_given TEXT,
        vet_person_treated VARCHAR(100),
        cost_ugx DECIMAL(10, 2),
        recovery_status VARCHAR(50),
        next_action TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goat_id) REFERENCES goats(goat_id) ON DELETE CASCADE
      );
    `;

    const createHealthIndexes = `
      CREATE INDEX IF NOT EXISTS idx_health_goat ON health_records(goat_id);
      CREATE INDEX IF NOT EXISTS idx_health_date ON health_records(record_date);
    `;

    await sql.unsafe(createHealthTable);
    await sql.unsafe(createHealthIndexes);
    console.log('✅ Breeding Farm (Health & Treatment) tables created');

    // Vaccination & Deworming table
    const createVaccinationTable = `
      CREATE TABLE IF NOT EXISTS vaccination_records (
        vaccination_id SERIAL PRIMARY KEY,
        record_date DATE NOT NULL,
        goat_id VARCHAR(50) NOT NULL,
        type VARCHAR(20) NOT NULL CHECK (type IN ('Vaccine', 'Deworming')),
        drug_used VARCHAR(200) NOT NULL,
        dosage VARCHAR(100),
        next_due_date DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goat_id) REFERENCES goats(goat_id) ON DELETE CASCADE
      );
    `;

    const createVaccinationIndexes = `
      CREATE INDEX IF NOT EXISTS idx_vaccination_goat ON vaccination_records(goat_id);
      CREATE INDEX IF NOT EXISTS idx_vaccination_date ON vaccination_records(record_date);
      CREATE INDEX IF NOT EXISTS idx_vaccination_type ON vaccination_records(type);
      CREATE INDEX IF NOT EXISTS idx_vaccination_next_due ON vaccination_records(next_due_date);
    `;

    await sql.unsafe(createVaccinationTable);
    await sql.unsafe(createVaccinationIndexes);
    console.log('✅ Breeding Farm (Vaccination & Deworming) tables created');

    // Feeding & Fattening table
    const createFeedingTable = `
      CREATE TABLE IF NOT EXISTS feeding_records (
        feeding_id SERIAL PRIMARY KEY,
        record_date DATE NOT NULL,
        goat_id VARCHAR(50),
        group_name VARCHAR(100),
        feed_type VARCHAR(200) NOT NULL,
        quantity_used DECIMAL(10, 2),
        purpose VARCHAR(20) CHECK (purpose IN ('Maintenance', 'Fattening')),
        weight_gain_kgs DECIMAL(6, 2),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goat_id) REFERENCES goats(goat_id) ON DELETE CASCADE,
        CHECK (goat_id IS NOT NULL OR group_name IS NOT NULL)
      );
    `;

    const createFeedingIndexes = `
      CREATE INDEX IF NOT EXISTS idx_feeding_goat ON feeding_records(goat_id);
      CREATE INDEX IF NOT EXISTS idx_feeding_date ON feeding_records(record_date);
      CREATE INDEX IF NOT EXISTS idx_feeding_purpose ON feeding_records(purpose);
    `;

    await sql.unsafe(createFeedingTable);
    await sql.unsafe(createFeedingIndexes);
    console.log('✅ Breeding Farm (Feeding & Fattening) tables created');

    // Sales - Breeding table
    const createSalesBreedingTable = `
      CREATE TABLE IF NOT EXISTS sales_breeding (
        sale_id SERIAL PRIMARY KEY,
        sale_date DATE NOT NULL,
        goat_id VARCHAR(50) NOT NULL,
        breed VARCHAR(100),
        sex VARCHAR(10),
        age_months INTEGER,
        buyer VARCHAR(200) NOT NULL,
        sale_price_ugx DECIMAL(12, 2) NOT NULL,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goat_id) REFERENCES goats(goat_id) ON DELETE CASCADE
      );
    `;

    const createSalesBreedingIndexes = `
      CREATE INDEX IF NOT EXISTS idx_sales_breeding_goat ON sales_breeding(goat_id);
      CREATE INDEX IF NOT EXISTS idx_sales_breeding_date ON sales_breeding(sale_date);
      CREATE INDEX IF NOT EXISTS idx_sales_breeding_buyer ON sales_breeding(buyer);
    `;

    await sql.unsafe(createSalesBreedingTable);
    await sql.unsafe(createSalesBreedingIndexes);
    console.log('✅ Breeding Farm (Sales - Breeding) tables created');

    // Sales - Meat table
    const createSalesMeatTable = `
      CREATE TABLE IF NOT EXISTS sales_meat (
        sale_id SERIAL PRIMARY KEY,
        sale_date DATE NOT NULL,
        goat_id VARCHAR(50) NOT NULL,
        live_weight DECIMAL(6, 2) NOT NULL,
        price_per_kg DECIMAL(10, 2) NOT NULL,
        total_price DECIMAL(12, 2) NOT NULL,
        buyer VARCHAR(200) NOT NULL,
        payment_method VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (goat_id) REFERENCES goats(goat_id) ON DELETE CASCADE
      );
    `;

    const createSalesMeatIndexes = `
      CREATE INDEX IF NOT EXISTS idx_sales_meat_goat ON sales_meat(goat_id);
      CREATE INDEX IF NOT EXISTS idx_sales_meat_date ON sales_meat(sale_date);
      CREATE INDEX IF NOT EXISTS idx_sales_meat_buyer ON sales_meat(buyer);
    `;

    await sql.unsafe(createSalesMeatTable);
    await sql.unsafe(createSalesMeatIndexes);
    console.log('✅ Breeding Farm (Sales - Meat) tables created');

    // Expenses Table
    const createExpensesTable = `
      CREATE TABLE IF NOT EXISTS expenses (
        expense_id SERIAL PRIMARY KEY,
        expense_date DATE NOT NULL,
        category VARCHAR(50) NOT NULL,
        description TEXT NOT NULL,
        amount_ugx DECIMAL(12, 2) NOT NULL,
        paid_by VARCHAR(100) NOT NULL,
        approved_by VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createExpensesIndexes = `
      CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(expense_date);
      CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
      CREATE INDEX IF NOT EXISTS idx_expenses_paid_by ON expenses(paid_by);
    `;

    await sql.unsafe(createExpensesTable);
    await sql.unsafe(createExpensesIndexes);
    console.log('✅ Breeding Farm (Expenses) tables created');

    // Monthly Summary Table
    const createMonthlySummaryTable = `
      CREATE TABLE IF NOT EXISTS monthly_summary (
        summary_id SERIAL PRIMARY KEY,
        month DATE NOT NULL UNIQUE,
        opening_goats INTEGER NOT NULL DEFAULT 0,
        births INTEGER NOT NULL DEFAULT 0,
        purchases INTEGER NOT NULL DEFAULT 0,
        deaths INTEGER NOT NULL DEFAULT 0,
        sold_breeding INTEGER NOT NULL DEFAULT 0,
        sold_meat INTEGER NOT NULL DEFAULT 0,
        closing_goats INTEGER NOT NULL DEFAULT 0,
        total_expenses_ugx DECIMAL(12, 2) NOT NULL DEFAULT 0,
        total_income_ugx DECIMAL(12, 2) NOT NULL DEFAULT 0,
        net_profit_ugx DECIMAL(12, 2) NOT NULL DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createMonthlySummaryIndexes = `
      CREATE INDEX IF NOT EXISTS idx_monthly_summary_month ON monthly_summary(month);
    `;

    await sql.unsafe(createMonthlySummaryTable);
    await sql.unsafe(createMonthlySummaryIndexes);
    console.log('✅ Breeding Farm (Monthly Summary) tables created');

    // ========== MATOOKE PROJECT ==========
    console.log('📊 Creating Matooke Project tables...');
    const createMatookeTable = `
      CREATE TABLE IF NOT EXISTS matooke_farms (
        farm_id VARCHAR(50) PRIMARY KEY,
        farm_name VARCHAR(200) NOT NULL,
        location VARCHAR(200) NOT NULL,
        size_acres DECIMAL(10, 2) NOT NULL,
        planting_date DATE,
        variety VARCHAR(100),
        expected_harvest_date DATE,
        actual_harvest_date DATE,
        estimated_yield_kg DECIMAL(10, 2),
        actual_yield_kg DECIMAL(10, 2),
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        manager VARCHAR(100),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createMatookeIndexes = `
      CREATE INDEX IF NOT EXISTS idx_matooke_location ON matooke_farms(location);
      CREATE INDEX IF NOT EXISTS idx_matooke_status ON matooke_farms(status);
      CREATE INDEX IF NOT EXISTS idx_matooke_variety ON matooke_farms(variety);
    `;

    await sql.unsafe(createMatookeTable);
    await sql.unsafe(createMatookeIndexes);
    console.log('✅ Matooke Project tables created');

    // ========== COFFEE PROJECT ==========
    console.log('📊 Creating Coffee Project tables...');
    const createCoffeeTable = `
      CREATE TABLE IF NOT EXISTS coffee_farms (
        farm_id VARCHAR(50) PRIMARY KEY,
        farm_name VARCHAR(200) NOT NULL,
        location VARCHAR(200) NOT NULL,
        size_acres DECIMAL(10, 2) NOT NULL,
        coffee_variety VARCHAR(100) NOT NULL,
        planting_date DATE,
        tree_count INTEGER,
        production_season VARCHAR(50),
        estimated_yield_kg DECIMAL(10, 2),
        actual_yield_kg DECIMAL(10, 2),
        quality_grade VARCHAR(50),
        processing_method VARCHAR(100),
        status VARCHAR(50) NOT NULL DEFAULT 'Active',
        manager VARCHAR(100),
        remarks TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    const createCoffeeIndexes = `
      CREATE INDEX IF NOT EXISTS idx_coffee_location ON coffee_farms(location);
      CREATE INDEX IF NOT EXISTS idx_coffee_status ON coffee_farms(status);
      CREATE INDEX IF NOT EXISTS idx_coffee_variety ON coffee_farms(coffee_variety);
      CREATE INDEX IF NOT EXISTS idx_coffee_season ON coffee_farms(production_season);
    `;

    await sql.unsafe(createCoffeeTable);
    await sql.unsafe(createCoffeeIndexes);
    console.log('✅ Coffee Project tables created');

    console.log('\n🎉 All database tables created successfully!');
    console.log('📋 Projects: Breeding Farm (10 tables), Matooke, Coffee');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
    process.exit(0);
  }
};

createTables();
