import sql from './db.js';

async function testDatabaseConnection() {
  console.log('\n🔍 Testing Database Connection...\n');
  
  try {
    // Test 1: Simple query
    console.log('Test 1: Running SELECT 1...');
    const result1 = await sql`SELECT 1 as test`;
    console.log('✅ Basic query successful:', result1);
    
    // Test 2: Check current database
    console.log('\nTest 2: Checking current database...');
    const result2 = await sql`SELECT current_database()`;
    console.log('✅ Current database:', result2[0].current_database);
    
    // Test 3: Check PostgreSQL version
    console.log('\nTest 3: Checking PostgreSQL version...');
    const result3 = await sql`SELECT version()`;
    console.log('✅ PostgreSQL version:', result3[0].version.split(',')[0]);
    
    // Test 4: List all tables
    console.log('\nTest 4: Listing all tables...');
    const tables = await sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `;
    
    if (tables.length > 0) {
      console.log('✅ Found', tables.length, 'tables:');
      tables.forEach(table => {
        console.log('   -', table.table_name);
      });
    } else {
      console.log('⚠️  No tables found in database. You may need to run: npm run db:setup');
    }
    
    // Test 5: Check connection info
    console.log('\nTest 5: Connection information...');
    const connInfo = await sql`
      SELECT 
        current_user as user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `;
    console.log('✅ Connected as user:', connInfo[0].user);
    console.log('✅ Server IP:', connInfo[0].server_ip);
    console.log('✅ Server port:', connInfo[0].server_port);
    
    console.log('\n✅ ALL TESTS PASSED! Database connection is working properly.\n');
    
  } catch (error) {
    console.error('\n❌ Database connection test FAILED:');
    console.error('Error:', error.message);
    console.error('\nPossible causes:');
    console.error('- DATABASE_URL is incorrect in .env file');
    console.error('- Supabase database is not accessible');
    console.error('- SSL certificate issues');
    console.error('- Network/firewall blocking connection');
    console.error('\nCurrent DATABASE_URL:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@'));
    process.exit(1);
  } finally {
    // Close the connection
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
  }
}

testDatabaseConnection();
