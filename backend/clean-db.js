import sql from './db.js';

async function cleanDatabase() {
  console.log('\n🧹 Cleaning Database - Dropping all tables...\n');
  
  try {
    // Get all table names
    console.log('Fetching all tables...');
    const tables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
      ORDER BY tablename
    `;
    
    if (tables.length === 0) {
      console.log('✅ Database is already clean - no tables found.\n');
      return;
    }
    
    console.log(`Found ${tables.length} tables to drop:`);
    tables.forEach(table => {
      console.log(`   - ${table.tablename}`);
    });
    
    console.log('\nDropping tables...');
    
    // Drop all tables with CASCADE to handle foreign key dependencies
    for (const table of tables) {
      try {
        await sql`DROP TABLE IF EXISTS ${sql(table.tablename)} CASCADE`;
        console.log(`✅ Dropped: ${table.tablename}`);
      } catch (err) {
        console.error(`❌ Failed to drop ${table.tablename}:`, err.message);
      }
    }
    
    // Verify all tables are dropped
    const remainingTables = await sql`
      SELECT tablename 
      FROM pg_tables 
      WHERE schemaname = 'public'
    `;
    
    if (remainingTables.length === 0) {
      console.log('\n✅ SUCCESS: All tables have been dropped!');
      console.log('Database is now clean and ready for setup.\n');
    } else {
      console.log(`\n⚠️  Warning: ${remainingTables.length} tables still remain:`);
      remainingTables.forEach(table => {
        console.log(`   - ${table.tablename}`);
      });
    }
    
  } catch (error) {
    console.error('\n❌ Database cleanup FAILED:');
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
  }
}

cleanDatabase();
