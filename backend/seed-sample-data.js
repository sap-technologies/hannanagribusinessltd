import sql from './db.js';

async function seedSampleData() {
  try {
    console.log('🌱 Seeding sample data...\n');

    // ========== GOATS ==========
    console.log('Adding sample goats...');
    
    // Add goats without parents first
    await sql`
      INSERT INTO goats (goat_id, breed, sex, date_of_birth, production_type, source, status, weight, remarks)
      VALUES 
        ('G001', 'Boer', 'Female', '2022-01-15', 'Meat', 'Purchased', 'Active', 45.5, 'Healthy breeding doe'),
        ('G002', 'Boer', 'Male', '2021-11-20', 'Meat', 'Purchased', 'Active', 65.0, 'Prime breeding buck'),
        ('G003', 'Saanen', 'Female', '2022-03-10', 'Dairy', 'Born on farm', 'Active', 42.0, 'Good milk producer'),
        ('G006', 'Alpine', 'Female', '2022-05-20', 'Dairy', 'Purchased', 'Active', 38.0, 'High yield milker'),
        ('G007', 'Boer', 'Female', '2021-08-15', 'Meat', 'Purchased', 'Sold', 48.0, 'Sold for breeding'),
        ('G008', 'Kiko', 'Male', '2022-06-30', 'Meat', 'Purchased', 'Active', 55.0, 'Disease resistant breed')
    `;
    
    // Add goats with parent references
    await sql`
      INSERT INTO goats (goat_id, breed, sex, date_of_birth, production_type, source, mother_id, father_id, status, weight, remarks)
      VALUES 
        ('G004', 'Boer', 'Female', '2023-02-14', 'Meat', 'Born on farm', 'G001', 'G002', 'Active', 28.5, 'First generation offspring'),
        ('G005', 'Boer', 'Male', '2023-02-14', 'Meat', 'Born on farm', 'G001', 'G002', 'Active', 30.0, 'First generation offspring')
    `;
    
    console.log(`✅ Added 8 goats`);

    // ========== BREEDING RECORDS ==========
    console.log('\nAdding breeding records...');
    
    // Completed breeding
    await sql`
      INSERT INTO breeding_records (doe_id, buck_id, heat_observed, mating_time, expected_kidding_date, actual_kidding_date, no_of_kids, male_kids, female_kids, kidding_outcome, remarks)
      VALUES 
        ('G001', 'G002', 'Yes', '2022-09-15 08:30:00', '2023-02-13', '2023-02-14', 2, 1, 1, 'Successful', 'Successful natural mating, twins born healthy'),
        ('G006', 'G008', 'Yes', '2023-07-10 09:45:00', '2023-12-08', '2023-12-07', 1, 0, 1, 'Successful', 'Single kid, very healthy')
    `;
    
    // Pending breeding
    await sql`
      INSERT INTO breeding_records (doe_id, buck_id, heat_observed, mating_time, expected_kidding_date, remarks)
      VALUES ('G003', 'G008', 'Yes', '2023-05-20 14:00:00', '2023-10-18', 'First time breeding, monitoring closely')
    `;
    
    console.log(`✅ Added 3 breeding records`);

    // ========== FEEDING RECORDS ==========
    console.log('\nAdding feeding records...');
    const feedingRecords = [
      { goat_id: 'G001', feed_date: '2024-01-15', feed_type: 'Hay', quantity_kg: 2.5, cost: 5000, remarks: 'Regular feeding' },
      { goat_id: 'G002', feed_date: '2024-01-15', feed_type: 'Concentrate', quantity_kg: 1.0, cost: 3000, remarks: 'Buck supplement' },
      { goat_id: 'G003', feed_date: '2024-01-16', feed_type: 'Hay', quantity_kg: 2.0, cost: 4000, remarks: 'Dairy goat feeding' },
      { goat_id: 'G004', feed_date: '2024-01-16', feed_type: 'Grain mix', quantity_kg: 1.5, cost: 4500, remarks: 'Growing kid nutrition' },
      { goat_id: 'G001', feed_date: '2024-01-20', feed_type: 'Mineral supplement', quantity_kg: 0.2, cost: 2000, remarks: 'Monthly mineral boost' },
    ];

    for (const record of feedingRecords) {
      await sql`
        INSERT INTO feeding_records ${sql(record, 'goat_id', 'feed_date', 'feed_type', 'quantity_kg', 'cost', 'remarks')}
      `;
    }
    console.log(`✅ Added ${feedingRecords.length} feeding records`);

    // ========== HEALTH RECORDS ==========
    console.log('\nAdding health records...');
    const healthRecords = [
      { goat_id: 'G001', visit_date: '2023-12-10', diagnosis: 'Routine checkup', treatment: 'Deworming', veterinarian: 'Dr. Mukasa', cost: 15000, next_visit: '2024-03-10', remarks: 'Good health condition' },
      { goat_id: 'G002', visit_date: '2023-11-25', diagnosis: 'Hoof trimming needed', treatment: 'Hoof care', veterinarian: 'Dr. Nakato', cost: 10000, next_visit: '2024-02-25', remarks: 'Regular maintenance' },
      { goat_id: 'G004', visit_date: '2024-01-05', diagnosis: 'Minor skin irritation', treatment: 'Topical cream', veterinarian: 'Dr. Mukasa', cost: 8000, next_visit: '2024-01-19', remarks: 'Follow-up required' },
    ];

    for (const record of healthRecords) {
      await sql`
        INSERT INTO health_records ${sql(record, 'goat_id', 'visit_date', 'diagnosis', 'treatment', 'veterinarian', 'cost', 'next_visit', 'remarks')}
      `;
    }
    console.log(`✅ Added ${healthRecords.length} health records`);

    // ========== VACCINATION RECORDS ==========
    console.log('\nAdding vaccination records...');
    const vaccinationRecords = [
      { goat_id: 'G001', vaccine_name: 'PPR Vaccine', vaccination_date: '2023-06-15', next_due_date: '2024-06-15', veterinarian: 'Dr. Mukasa', cost: 12000, remarks: 'Annual PPR vaccination' },
      { goat_id: 'G002', vaccine_name: 'Foot and Mouth Disease', vaccination_date: '2023-07-20', next_due_date: '2024-01-20', veterinarian: 'Dr. Nakato', cost: 15000, remarks: 'Biannual FMD vaccine' },
      { goat_id: 'G003', vaccine_name: 'PPR Vaccine', vaccination_date: '2023-08-10', next_due_date: '2024-08-10', veterinarian: 'Dr. Mukasa', cost: 12000, remarks: 'First time vaccination' },
    ];

    for (const record of vaccinationRecords) {
      await sql`
        INSERT INTO vaccination_records ${sql(record, 'goat_id', 'vaccine_name', 'vaccination_date', 'next_due_date', 'veterinarian', 'cost', 'remarks')}
      `;
    }
    console.log(`✅ Added ${vaccinationRecords.length} vaccination records`);

    // ========== KID GROWTH ==========
    console.log('\nAdding kid growth records...');
    const kidGrowthRecords = [
      { kid_id: 'G004', measurement_date: '2023-02-14', weight_kg: 3.2, height_cm: 28, remarks: 'Birth weight' },
      { kid_id: 'G004', measurement_date: '2023-03-14', weight_kg: 8.5, height_cm: 35, remarks: '1 month - healthy growth' },
      { kid_id: 'G004', measurement_date: '2023-04-14', weight_kg: 14.2, height_cm: 42, remarks: '2 months - excellent progress' },
      { kid_id: 'G005', measurement_date: '2023-02-14', weight_kg: 3.5, height_cm: 29, remarks: 'Birth weight' },
      { kid_id: 'G005', measurement_date: '2023-03-14', weight_kg: 9.0, height_cm: 36, remarks: '1 month - strong kid' },
    ];

    for (const record of kidGrowthRecords) {
      await sql`
        INSERT INTO kid_growth ${sql(record, 'kid_id', 'measurement_date', 'weight_kg', 'height_cm', 'remarks')}
      `;
    }
    console.log(`✅ Added ${kidGrowthRecords.length} kid growth records`);

    // ========== MEAT SALES ==========
    console.log('\nAdding meat sales records...');
    const meatSales = [
      { goat_id: 'G007', sale_date: '2023-12-20', buyer_name: 'Kampala Butchery', buyer_contact: '0701234567', weight_kg: 48.0, price_per_kg: 15000, total_amount: 720000, payment_status: 'Paid', remarks: 'Quality meat goat' },
    ];

    for (const sale of meatSales) {
      await sql`
        INSERT INTO sales_meat ${sql(sale, 'goat_id', 'sale_date', 'buyer_name', 'buyer_contact', 'weight_kg', 'price_per_kg', 'total_amount', 'payment_status', 'remarks')}
      `;
    }
    console.log(`✅ Added ${meatSales.length} meat sales`);

    // ========== BREEDING SALES ==========
    console.log('\nAdding breeding sales records...');
    const breedingSales = [
      { goat_id: 'G007', sale_date: '2023-12-20', buyer_name: 'Mbarara Farm', buyer_contact: '0709876543', sale_price: 800000, payment_status: 'Paid', remarks: 'Premium breeding doe' },
    ];

    for (const sale of breedingSales) {
      await sql`
        INSERT INTO sales_breeding ${sql(sale, 'goat_id', 'sale_date', 'buyer_name', 'buyer_contact', 'sale_price', 'payment_status', 'remarks')}
      `;
    }
    console.log(`✅ Added ${breedingSales.length} breeding sales`);

    // ========== EXPENSES ==========
    console.log('\nAdding expense records...');
    const expenses = [
      { expense_date: '2024-01-05', category: 'Feed', description: 'Bulk hay purchase', amount: 500000, payment_method: 'Bank Transfer', remarks: 'Monthly feed stock' },
      { expense_date: '2024-01-10', category: 'Veterinary', description: 'Vaccination campaign', amount: 150000, payment_method: 'Cash', remarks: 'All goats vaccinated' },
      { expense_date: '2024-01-12', category: 'Infrastructure', description: 'Shed repairs', amount: 300000, payment_method: 'Mobile Money', remarks: 'Roof maintenance' },
      { expense_date: '2024-01-15', category: 'Medicine', description: 'Dewormers and supplements', amount: 80000, payment_method: 'Cash', remarks: 'Preventive care' },
      { expense_date: '2024-01-20', category: 'Labor', description: 'Farm worker salaries', amount: 600000, payment_method: 'Bank Transfer', remarks: 'January wages' },
    ];

    for (const expense of expenses) {
      await sql`
        INSERT INTO expenses ${sql(expense, 'expense_date', 'category', 'description', 'amount', 'payment_method', 'remarks')}
      `;
    }
    console.log(`✅ Added ${expenses.length} expense records`);

    // ========== COFFEE FARM ==========
    console.log('\nAdding coffee farm records...');
    const coffeeRecords = [
      { plot_number: 'CF-001', variety: 'Robusta', planting_date: '2020-03-15', number_of_trees: 500, area_acres: 2.5, harvest_date: '2023-11-20', quantity_kg: 1200, price_per_kg: 4500, total_amount: 5400000, buyer_name: 'Uganda Coffee Traders', remarks: 'Good season yield' },
      { plot_number: 'CF-002', variety: 'Arabica', planting_date: '2019-08-10', number_of_trees: 300, area_acres: 1.5, harvest_date: '2023-12-05', quantity_kg: 800, price_per_kg: 8000, total_amount: 6400000, buyer_name: 'Premium Coffee Ltd', remarks: 'Premium quality beans' },
    ];

    for (const record of coffeeRecords) {
      await sql`
        INSERT INTO coffee_farms ${sql(record, 'plot_number', 'variety', 'planting_date', 'number_of_trees', 'area_acres', 'harvest_date', 'quantity_kg', 'price_per_kg', 'total_amount', 'buyer_name', 'remarks')}
      `;
    }
    console.log(`✅ Added ${coffeeRecords.length} coffee farm records`);

    // ========== MATOOKE FARM ==========
    console.log('\nAdding matooke farm records...');
    const matookeRecords = [
      { plot_number: 'MF-001', variety: 'Mbwazirume', planting_date: '2022-01-20', number_of_plants: 200, area_acres: 1.0, harvest_date: '2023-10-15', quantity_bunches: 180, price_per_bunch: 15000, total_amount: 2700000, buyer_name: 'Kampala Market', remarks: 'First harvest excellent' },
      { plot_number: 'MF-002', variety: 'Nakabululu', planting_date: '2022-02-10', number_of_plants: 150, area_acres: 0.8, harvest_date: '2023-11-20', quantity_bunches: 120, price_per_bunch: 18000, total_amount: 2160000, buyer_name: 'Local wholesaler', remarks: 'Premium variety, good price' },
    ];

    for (const record of matookeRecords) {
      await sql`
        INSERT INTO matooke_farms ${sql(record, 'plot_number', 'variety', 'planting_date', 'number_of_plants', 'area_acres', 'harvest_date', 'quantity_bunches', 'price_per_bunch', 'total_amount', 'buyer_name', 'remarks')}
      `;
    }
    console.log(`✅ Added ${matookeRecords.length} matooke farm records`);

    console.log('\n✅ Sample data seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - 8 Goats`);
    console.log(`   - 3 Breeding Records`);
    console.log(`   - ${feedingRecords.length} Feeding Records`);
    console.log(`   - ${healthRecords.length} Health Records`);
    console.log(`   - ${vaccinationRecords.length} Vaccination Records`);
    console.log(`   - ${kidGrowthRecords.length} Kid Growth Records`);
    console.log(`   - ${meatSales.length} Meat Sales`);
    console.log(`   - ${breedingSales.length} Breeding Sales`);
    console.log(`   - ${expenses.length} Expenses`);
    console.log(`   - ${coffeeRecords.length} Coffee Records`);
    console.log(`   - ${matookeRecords.length} Matooke Records`);

    await sql.end();
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    process.exit(1);
  }
}

seedSampleData();
