import sql from './db.js';

async function addRemainingData() {
  try {
    console.log('🌱 Adding remaining sample data...\n');

    // Check if goats exist
    const goatsCount = await sql`SELECT COUNT(*) as count FROM goats`;
    console.log(`Current goats: ${goatsCount[0].count}`);
    
    if (goatsCount[0].count < 8) {
      console.log('Adding remaining goats...');
      const existingGoats = await sql`SELECT goat_id FROM goats`;
      const existingIds = existingGoats.map(g => g.goat_id);
      
      if (!existingIds.includes('G004')) {
        await sql`INSERT INTO goats (goat_id, breed, sex, date_of_birth, production_type, source, mother_id, father_id, status, weight, remarks)
                  VALUES ('G004', 'Boer', 'Female', '2023-02-14', 'Meat', 'Born on farm', 'G001', 'G002', 'Active', 28.5, 'First generation offspring')`;
      }
      if (!existingIds.includes('G005')) {
        await sql`INSERT INTO goats (goat_id, breed, sex, date_of_birth, production_type, source, mother_id, father_id, status, weight, remarks)
                  VALUES ('G005', 'Boer', 'Male', '2023-02-14', 'Meat', 'Born on farm', 'G001', 'G002', 'Active', 30.0, 'First generation offspring')`;
      }
      console.log('✅ Added remaining goats');
    }

    // ========== FEEDING RECORDS ==========
    const feedingCount = await sql`SELECT COUNT(*) as count FROM feeding_records`;
    if (feedingCount[0].count === 0) {
      console.log('\nAdding feeding records...');
      await sql`
        INSERT INTO feeding_records (goat_id, feed_date, feed_type, quantity_kg, cost, remarks)
        VALUES 
          ('G001', '2024-01-15', 'Hay', 2.5, 5000, 'Regular feeding'),
          ('G002', '2024-01-15', 'Concentrate', 1.0, 3000, 'Buck supplement'),
          ('G003', '2024-01-16', 'Hay', 2.0, 4000, 'Dairy goat feeding'),
          ('G001', '2024-01-20', 'Mineral supplement', 0.2, 2000, 'Monthly mineral boost')
      `;
      console.log('✅ Added 4 feeding records');
    }

    // ========== HEALTH RECORDS ==========
    const healthCount = await sql`SELECT COUNT(*) as count FROM health_records`;
    if (healthCount[0].count === 0) {
      console.log('\nAdding health records...');
      await sql`
        INSERT INTO health_records (goat_id, visit_date, diagnosis, treatment, veterinarian, cost, next_visit, remarks)
        VALUES 
          ('G001', '2023-12-10', 'Routine checkup', 'Deworming', 'Dr. Mukasa', 15000, '2024-03-10', 'Good health condition'),
          ('G002', '2023-11-25', 'Hoof trimming needed', 'Hoof care', 'Dr. Nakato', 10000, '2024-02-25', 'Regular maintenance')
      `;
      console.log('✅ Added 2 health records');
    }

    // ========== VACCINATION RECORDS ==========
    const vaccinationCount = await sql`SELECT COUNT(*) as count FROM vaccination_records`;
    if (vaccinationCount[0].count === 0) {
      console.log('\nAdding vaccination records...');
      await sql`
        INSERT INTO vaccination_records (goat_id, vaccine_name, vaccination_date, next_due_date, veterinarian, cost, remarks)
        VALUES 
          ('G001', 'PPR Vaccine', '2023-06-15', '2024-06-15', 'Dr. Mukasa', 12000, 'Annual PPR vaccination'),
          ('G002', 'Foot and Mouth Disease', '2023-07-20', '2024-01-20', 'Dr. Nakato', 15000, 'Biannual FMD vaccine'),
          ('G003', 'PPR Vaccine', '2023-08-10', '2024-08-10', 'Dr. Mukasa', 12000, 'First time vaccination')
      `;
      console.log('✅ Added 3 vaccination records');
    }

    // ========== KID GROWTH ==========
    const kidGrowthCount = await sql`SELECT COUNT(*) as count FROM kid_growth`;
    if (kidGrowthCount[0].count === 0) {
      console.log('\nAdding kid growth records...');
       await sql`
        INSERT INTO kid_growth (kid_id, mother_id, measurement_date, weight_kg, height_cm, remarks)
        VALUES 
          ('G004', 'G001', '2023-02-14', 3.2, 28, 'Birth weight'),
          ('G004', 'G001', '2023-03-14', 8.5, 35, '1 month - healthy growth'),
          ('G004', 'G001', '2023-04-14', 14.2, 42, '2 months - excellent progress'),
          ('G005', 'G001', '2023-02-14', 3.5, 29, 'Birth weight'),
          ('G005', 'G001', '2023-03-14', 9.0, 36, '1 month - strong kid')
      `;
      console.log('✅ Added 5 kid growth records');
    }

    // ========== MEAT SALES ==========
    const meatSalesCount = await sql`SELECT COUNT(*) as count FROM sales_meat`;
    if (meatSalesCount[0].count === 0) {
      console.log('\nAdding meat sales records...');
      await sql`
        INSERT INTO sales_meat (goat_id, sale_date, buyer_name, buyer_contact, weight_kg, price_per_kg, total_amount, payment_status, remarks)
        VALUES ('G007', '2023-12-20', 'Kampala Butchery', '0701234567', 48.0, 15000, 720000, 'Paid', 'Quality meat goat')
      `;
      console.log('✅ Added 1 meat sale');
    }

    // ========== BREEDING SALES ==========
    const breedingSalesCount = await sql`SELECT COUNT(*) as count FROM sales_breeding`;
    if (breedingSalesCount[0].count === 0) {
      console.log('\nAdding breeding sales records...');
      await sql`
        INSERT INTO sales_breeding (goat_id, sale_date, buyer_name, buyer_contact, sale_price, payment_status, remarks)
        VALUES ('G007', '2023-12-20', 'Mbarara Farm', '0709876543', 800000, 'Paid', 'Premium breeding doe')
      `;
      console.log('✅ Added 1 breeding sale');
    }

    // ========== EXPENSES ==========
    const expensesCount = await sql`SELECT COUNT(*) as count FROM expenses`;
    if (expensesCount[0].count === 0) {
      console.log('\nAdding expense records...');
      await sql`
        INSERT INTO expenses (expense_date, category, description, amount, payment_method, remarks)
        VALUES 
          ('2024-01-05', 'Feed', 'Bulk hay purchase', 500000, 'Bank Transfer', 'Monthly feed stock'),
          ('2024-01-10', 'Veterinary', 'Vaccination campaign', 150000, 'Cash', 'All goats vaccinated'),
          ('2024-01-12', 'Infrastructure', 'Shed repairs', 300000, 'Mobile Money', 'Roof maintenance'),
          ('2024-01-15', 'Medicine', 'Dewormers and supplements', 80000, 'Cash', 'Preventive care'),
          ('2024-01-20', 'Labor', 'Farm worker salaries', 600000, 'Bank Transfer', 'January wages')
      `;
      console.log('✅ Added 5 expense records');
    }

    // ========== COFFEE FARM ==========
    const coffeeCount = await sql`SELECT COUNT(*) as count FROM coffee_farms`;
    if (coffeeCount[0].count === 0) {
      console.log('\nAdding coffee farm records...');
      await sql`
        INSERT INTO coffee_farms (plot_number, variety, planting_date, number_of_trees, area_acres, harvest_date, quantity_kg, price_per_kg, total_amount, buyer_name, remarks)
        VALUES 
          ('CF-001', 'Robusta', '2020-03-15', 500, 2.5, '2023-11-20', 1200, 4500, 5400000, 'Uganda Coffee Traders', 'Good season yield'),
          ('CF-002', 'Arabica', '2019-08-10', 300, 1.5, '2023-12-05', 800, 8000, 6400000, 'Premium Coffee Ltd', 'Premium quality beans')
      `;
      console.log('✅ Added 2 coffee records');
    }

    // ========== MATOOKE FARM ==========
    const matookeCount = await sql`SELECT COUNT(*) as count FROM matooke_farms`;
    if (matookeCount[0].count === 0) {
      console.log('\nAdding matooke farm records...');
      await sql`
        INSERT INTO matooke_farms (plot_number, variety, planting_date, number_of_plants, area_acres, harvest_date, quantity_bunches, price_per_bunch, total_amount, buyer_name, remarks)
        VALUES 
          ('MF-001', 'Mbwazirume', '2022-01-20', 200, 1.0, '2023-10-15', 180, 15000, 2700000, 'Kampala Market', 'First harvest excellent'),
          ('MF-002', 'Nakabululu', '2022-02-10', 150, 0.8, '2023-11-20', 120, 18000, 2160000, 'Local wholesaler', 'Premium variety, good price')
      `;
      console.log('✅ Added 2 matooke records');
    }

    console.log('\n✅ Sample data completed!');
    
    await sql.end();
  } catch (error) {
    console.error('❌ Error adding data:', error);
    process.exit(1);
  }
}

addRemainingData();
