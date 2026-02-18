import sql from './db.js';

async function checkData() {
  try {
    console.log('🔍 Checking database for data...\n');

    // Check users
    const users = await sql`SELECT user_id, email, full_name, role FROM users`;
    console.log(`Users: ${users.length} records`);
    if (users.length > 0) {
      console.log('Sample user:', users[0]);
    }

    // Check goats
    const goats = await sql`SELECT * FROM goats LIMIT 5`;
    console.log(`\nGoats: ${goats.length} records (showing first 5)`);
    if (goats.length > 0) {
      console.log('Sample goat:', goats[0]);
    }

    // Check breeding records
    const breeding = await sql`SELECT COUNT(*) as count FROM breeding_records`;
    console.log(`\nBreeding Records: ${breeding[0].count} records`);

    // Check feeding records
    const feeding = await sql`SELECT COUNT(*) as count FROM feeding_records`;
    console.log(`Feeding Records: ${feeding[0].count} records`);

    // Check health records
    const health = await sql`SELECT COUNT(*) as count FROM health_records`;
    console.log(`Health Records: ${health[0].count} records`);

    // Check sales
    const salesMeat = await sql`SELECT COUNT(*) as count FROM sales_meat`;
    console.log(`Meat Sales: ${salesMeat[0].count} records`);

    const salesBreeding = await sql`SELECT COUNT(*) as count FROM sales_breeding`;
    console.log(`Breeding Sales: ${salesBreeding[0].count} records`);

    // Check coffee
    const coffee = await sql`SELECT COUNT(*) as count FROM coffee_farms`;
    console.log(`Coffee Records: ${coffee[0].count} records`);

    // Check matooke
    const matooke = await sql`SELECT COUNT(*) as count FROM matooke_farms`;
    console.log(`Matooke Records: ${matooke[0].count} records`);

    // Check expenses
    const expenses = await sql`SELECT COUNT(*) as count FROM expenses`;
    console.log(`Expenses: ${expenses[0].count} records`);

    await sql.end();
  } catch (error) {
    console.error('Error checking data:', error);
    process.exit(1);
  }
}

checkData();
