import sql from '../db.js';

async function createAuthTables() {
  console.log('\n🔐 Creating Authentication Tables...\n');
  
  try {
    // Create users table
    console.log('Creating users table...');
    await sql.unsafe(`
      CREATE TABLE IF NOT EXISTS users (
        user_id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(200) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'manager', 'staff')) DEFAULT 'staff',
        is_active BOOLEAN DEFAULT true,
        last_login TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    await sql.unsafe(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
      CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active);
    `);
    
    console.log('✅ Users table created');
    
    // Add audit fields to existing tables
    console.log('\n📝 Adding audit logging fields...');
    
    const tables = ['goats', 'breeding_records', 'kid_growth', 'health_records', 
                    'vaccination_records', 'feeding_records', 'sales_breeding', 
                    'sales_meat', 'expenses', 'monthly_summary'];
    
    for (const table of tables) {
      try {
        await sql.unsafe(`
          ALTER TABLE ${table} 
          ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(user_id),
          ADD COLUMN IF NOT EXISTS updated_by INTEGER REFERENCES users(user_id)
        `);
        console.log(`✅ Added audit fields to ${table}`);
      } catch (err) {
        if (!err.message.includes('already exists')) {
          console.log(`⚠️  ${table}: ${err.message}`);
        }
      }
    }
    
    // Create default admin user (password: Admin123!)
    console.log('\n👤 Creating default admin user...');
    const bcrypt = await import('bcryptjs');
    const hashedPassword = await bcrypt.default.hash('Admin123!', 10);
    
    try {
      await sql`
        INSERT INTO users (email, password_hash, full_name, role)
        VALUES ('admin@hannan.com', ${hashedPassword}, 'System Administrator', 'admin')
        ON CONFLICT (email) DO NOTHING
      `;
      console.log('✅ Default admin user created');
      console.log('   Email: admin@hannan.com');
      console.log('   Password: Admin123!');
      console.log('   ⚠️  CHANGE THIS PASSWORD IMMEDIATELY AFTER FIRST LOGIN!');
    } catch (err) {
      console.log('ℹ️  Admin user already exists');
    }
    
    console.log('\n✅ Authentication system tables created successfully!\n');
    
  } catch (error) {
    console.error('\n❌ Error creating auth tables:', error);
    process.exit(1);
  } finally {
    await sql.end({ timeout: 5 });
    console.log('Database connection closed.\n');
    process.exit(0);
  }
}

createAuthTables();
