/**
 * Test script for Goat Auto-Integration Service
 * Run this with: node backend/test-auto-integration.js
 */

import goatAutoIntegrationService from './services/goatAutoIntegrationService.js';

// Test goat data samples
const testGoats = [
  {
    goat_id: 'TEST-KID-001',
    breed: 'Boer',
    sex: 'Female',
    date_of_birth: new Date(Date.now() - (2 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 2 months old
    production_type: 'Breeding',
    source: 'Born on farm',
    status: 'Active',
    weight: 8.5,
    mother_id: 'DOE-001'
  },
  {
    goat_id: 'TEST-DOE-002',
    breed: 'Savana',
    sex: 'Female',
    date_of_birth: new Date(Date.now() - (8 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 8 months old
    production_type: 'Breeding',
    source: 'Purchased',
    status: 'Active',
    weight: 25.0
  },
  {
    goat_id: 'TEST-BUCK-003',
    breed: 'Karahali',
    sex: 'Male',
    date_of_birth: new Date(Date.now() - (24 * 30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0], // 24 months old
    production_type: 'Breeding',
    source: 'Purchased',
    status: 'Active',
    weight: 45.0
  }
];

console.log('🧪 Testing Goat Auto-Integration Service\n');
console.log('=' .repeat(60));

async function runTests() {
  for (const goat of testGoats) {
    console.log(`\n📝 Testing integration for: ${goat.goat_id}`);
    console.log(`   Age: ${goatAutoIntegrationService.calculateAgeInMonths(goat.date_of_birth)} months`);
    console.log(`   Sex: ${goat.sex}, Breed: ${goat.breed}`);
    console.log('-'.repeat(60));
    
    try {
      const result = await goatAutoIntegrationService.integrateNewGoat(
        goat,
        1, // Test user ID
        'Test User'
      );
      
      console.log('\n✅ Integration Results:');
      console.log(`   • Vaccination Reminders: ${result.vaccinationReminders}`);
      console.log(`   • Health Reminders: ${result.healthReminders}`);
      console.log(`   • Growth Tracking: ${result.growthTracking ? 'Yes' : 'No'}`);
      console.log(`   • Breeding Reminder: ${result.breedingReminder ? 'Yes' : 'No'}`);
      console.log(`   • Feeding Record: ${result.feedingRecord ? 'Yes' : 'No'}`);
      console.log(`   • Notifications Sent: ${result.notifications}`);
      
    } catch (error) {
      console.error(`\n❌ Error:`, error.message);
    }
    
    console.log('=' .repeat(60));
  }
  
  console.log('\n✨ Test completed!\n');
  process.exit(0);
}

runTests().catch(err => {
  console.error('Test failed:', err);
  process.exit(1);
});
