import sql from './db.js';
import notificationHelper from './utils/notificationHelper.js';

/**
 * Test script for notification system
 * Verifies that notifications are sent to admin users
 */

async function testNotificationSystem() {
  console.log('🧪 Testing Notification System...\n');

  try {
    // 1. Check for admin users
    console.log('1️⃣ Checking for admin users...');
    const admins = await notificationHelper.getAdminUsers();
    
    if (admins.length === 0) {
      console.log('⚠️  No admin users found!');
      console.log('💡 To test notifications, create an admin user:');
      console.log('   INSERT INTO users (email, password_hash, full_name, role, is_active)');
      console.log('   VALUES (\'admin@test.com\', \'$2a$10$...\', \'Test Admin\', \'admin\', true);');
      return;
    }
    
    console.log(`✅ Found ${admins.length} admin user(s):`);
    admins.forEach(admin => {
      console.log(`   - ${admin.full_name} (${admin.email})`);
    });
    console.log('');

    // 2. Test notification creation
    console.log('2️⃣ Testing notification creation...');
    const testNotification = await notificationHelper.notifyAdmins({
      type: 'system',
      title: '🧪 Test Notification',
      message: 'This is a test notification from the notification system',
      link: '/test',
      priority: 'low'
    });
    
    if (testNotification.length > 0) {
      console.log(`✅ Successfully created ${testNotification.length} test notification(s)\n`);
    } else {
      console.log('❌ Failed to create test notifications\n');
      return;
    }

    // 3. Verify notifications in database
    console.log('3️⃣ Verifying notifications in database...');
    const notifications = await sql`
      SELECT notification_id, user_id, type, title, message, is_read, priority, created_at
      FROM notifications
      ORDER BY created_at DESC
      LIMIT 5
    `;
    
    console.log(`✅ Latest ${notifications.length} notification(s):`);
    notifications.forEach(notif => {
      const readStatus = notif.is_read ? '✓ Read' : '○ Unread';
      const priorityEmoji = notif.priority === 'urgent' ? '🔴' : 
                           notif.priority === 'high' ? '🟡' : 
                           notif.priority === 'medium' ? '🟢' : '⚪';
      console.log(`   ${priorityEmoji} [${readStatus}] ${notif.title}`);
      console.log(`      ${notif.message}`);
      console.log(`      Created: ${new Date(notif.created_at).toLocaleString()}`);
      console.log('');
    });

    // 4. Test different notification types
    console.log('4️⃣ Testing different notification types...\n');
    
    const testGoatNotif = await notificationHelper.notifyAdmins({
      type: 'goat',
      title: '🐐 Test Goat Notification',
      message: 'Test goat notification message',
      link: '/goats/TEST001',
      priority: 'low'
    });
    console.log(`   ✅ Goat notification: ${testGoatNotif.length} sent`);

    const testHealthNotif = await notificationHelper.notifyAdmins({
      type: 'health',
      title: '🏥 Test Health Notification',
      message: 'Test health alert message',
      link: '/health/1',
      priority: 'high'
    });
    console.log(`   ✅ Health notification: ${testHealthNotif.length} sent`);

    const testSaleNotif = await notificationHelper.notifyAdmins({
      type: 'sale',
      title: '💵 Test Sale Notification',
      message: 'Test sale notification message',
      link: '/sales/1',
      priority: 'medium'
    });
    console.log(`   ✅ Sale notification: ${testSaleNotif.length} sent\n`);

    // 5. Show unread count
    console.log('5️⃣ Checking unread notification count...');
    for (const admin of admins) {
      const unreadCount = await sql`
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = ${admin.user_id} AND is_read = false
      `;
      console.log(`   📬 ${admin.full_name}: ${unreadCount[0].count} unread notification(s)`);
    }

    console.log('\n✨ Notification System Test Complete! ✨');
    console.log('');
    console.log('📝 Summary:');
    console.log(`   • Admin users: ${admins.length}`);
    console.log(`   • Test notifications sent: ${testNotification.length + testGoatNotif.length + testHealthNotif.length + testSaleNotif.length}`);
    console.log(`   • System is ready to send notifications on create/update operations`);
    console.log('');
    console.log('🎯 What happens now:');
    console.log('   • When any record is created → Admin gets notification');
    console.log('   • When any record is updated → Admin gets notification');
    console.log('   • Admins can view notifications in the UI');
    console.log('   • Notifications include direct links to the records');

  } catch (error) {
    console.error('❌ Error during testing:', error.message);
    console.error(error);
  } finally {
    await sql.end();
  }
}

// Run the test
testNotificationSystem();
