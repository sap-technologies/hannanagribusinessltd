import sql from './db.js';

async function forceAddData() {
  try {
    console.log('🌱 Force adding all sample data...\n');

    // Get all goats
    const allGoats = await sql`SELECT goat_id FROM goats ORDER BY goat_id`;
    console.log(`Existing goats: ${allGoats.map(g => g.goat_id).join(', ')}`);
    console.log(`Total: ${allGoats.length} goats\n`);

    // ========== FEEDING RECORDS ==========
    console.log('Adding feeding records...');
    await sql`DELETE FROM feeding_records`;
    await sql`
      INSERT INTO feeding_records (goat_id, record_date, feed_type, quantity_used, purpose, remarks)
      VALUES 
        ('G001', '2024-01-15', 'Hay', 2.5, 'Maintenance', 'Regular feeding'),
        ('G002', '2024-01-15', 'Concentrate', 1.0, 'Fattening', 'Buck supplement'),
        ('G003', '2024-01-16', 'Hay', 2.0, 'Maintenance', 'Dairy goat feeding'),
        ('G001', '2024-01-20', 'Mineral supplement', 0.2, 'Maintenance', 'Monthly mineral boost')
    `;
    console.log('✅ Added 4 feeding records');

    // ========== HEALTH RECORDS ==========
    console.log('\nAdding health records...');
    await sql`DELETE FROM health_records`;
    await sql`
      INSERT INTO health_records (goat_id, record_date, problem_observed, treatment_given, vet_person_treated, cost_ugx, recovery_status, next_action)
      VALUES 
        ('G001', '2023-12-10', 'Routine checkup', 'Deworming medication administered', 'Dr. Mukasa', 15000, 'Fully Recovered', 'Regular checkup in 3 months'),
        ('G002', '2023-11-25', 'Hoof overgrowth', 'Hoof trimming and cleaning', 'Dr. Nakato', 10000, 'Fully Recovered', 'Monitor hoof condition')
    `;
    console.log('✅ Added 2 health records');

    // ========== VACCINATION RECORDS ==========
    console.log('\nAdding vaccination records...');
    await sql`DELETE FROM vaccination_records`;
    await sql`
      INSERT INTO vaccination_records (goat_id, record_date, type, drug_used, dosage, next_due_date)
      VALUES 
        ('G001', '2023-06-15', 'Vaccine', 'PPR Vaccine', '2ml', '2024-06-15'),
        ('G002', '2023-07-20', 'Vaccine', 'Foot and Mouth Disease Vaccine', '2ml', '2024-01-20'),
        ('G003', '2023-08-10', 'Vaccine', 'PPR Vaccine', '2ml', '2024-08-10'),
        ('G001', '2024-01-05', 'Deworming', 'Ivermectin', '5ml', '2024-04-05')
    `;
    console.log('✅ Added 4 vaccination/deworming records');

// ========== EXPENSES ==========
    console.log('\nAdding expense records...');
    await sql`DELETE FROM expenses`;
    await sql`
      INSERT INTO expenses (expense_date, category, description, amount_ugx, paid_by, approved_by)
      VALUES 
        ('2024-01-05', 'Feed', 'Bulk hay purchase - 100 bales', 500000, 'Farm Manager', 'Admin'),
        ('2024-01-10', 'Veterinary', 'Vaccination services for all goats', 150000, 'Farm Manager', 'Admin'),
        ('2024-01-12', 'Infrastructure', 'Shed roof repairs and maintenance', 300000, 'Farm Manager', 'Admin'),
        ('2024-01-15', 'Medicine', 'Dewormers and supplements', 80000, 'Farm Manager', 'Admin'),
        ('2024-01-20', 'Labor', 'Farm worker salaries for January', 600000, 'Admin', 'Admin')
    `;
    console.log('✅ Added 5 expense records');

    // ========== COFFEE FARM ==========
    console.log('\nAdding coffee farm records...');
    await sql`DELETE FROM coffee_farms`;
    await sql`
      INSERT INTO coffee_farms (farm_id, farm_name, location, size_acres, coffee_variety, planting_date, tree_count, production_season, estimated_yield_kg, actual_yield_kg, quality_grade, processing_method, status, manager, remarks)
      VALUES 
        ('CF-001', 'Robusta Block A', 'Masaka District', 2.5, 'Robusta', '2020-03-15', 500, '2023/2024', 1500, 1200, 'Grade A', 'Wet Processing', 'Active', 'John Mukasa', 'Good season yield'),
        ('CF-002', 'Arabica Block B', 'Mbale District', 1.5, 'Arabica', '2019-08-10', 300, '2023/2024', 900, 800, 'Premium', 'Washed', 'Active', 'Mary Nambi', 'Premium quality beans')
    `;
    console.log('✅ Added 2 coffee records');

    // ========== MATOOKE FARM ==========
    console.log('\nAdding matooke farm records...');
    await sql`DELETE FROM matooke_farms`;
    await sql`
      INSERT INTO matooke_farms (farm_id, farm_name, location, size_acres, variety, planting_date, expected_harvest_date, actual_harvest_date, estimated_yield_kg, actual_yield_kg, status, manager, remarks)
      VALUES 
        ('MF-001', 'Matooke Block East', 'Mbarara District', 1.0, 'Mbwazirume', '2022-01-20', '2023-10-20', '2023-10-15', 2000, 1800, 'Active', 'Peter Tumusiime', 'First harvest excellent'),
        ('MF-002', 'Matooke Block West', 'Bushenyi District', 0.8, 'Nakabululu', '2022-02-10', '2023-11-25', '2023-11-20', 1500, 1200, 'Active', 'Sarah Kyomuhendo', 'Premium variety, good results')
    `;
    console.log('✅ Added 2 matooke records');

    console.log('\n✅ All sample data added successfully!');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error adding data:', error);
    process.exit(1);
  }
}

forceAddData();
