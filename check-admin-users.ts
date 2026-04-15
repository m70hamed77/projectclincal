import { db } from './src/lib/db';

async function checkAdminUsers() {
  try {
    // Get all admin users
    const adminUsers = await db.user.findMany({
      where: {
        role: 'ADMIN'
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        createdAt: true
      }
    });

    console.log('🔍 Found Admin Users:');
    console.log('='.repeat(50));

    adminUsers.forEach((admin, index) => {
      const statusEmoji = admin.status === 'ACTIVE' ? '✅' :
                         admin.status === 'SUSPENDED' ? '⚠️' :
                         admin.status === 'BANNED' ? '🚫' :
                         admin.status === 'DELETED' ? '🗑️' : '⏳';

      console.log(`\nAdmin #${index + 1}:`);
      console.log(`  ID: ${admin.id}`);
      console.log(`  Name: ${admin.name || 'N/A'}`);
      console.log(`  Email: ${admin.email}`);
      console.log(`  Status: ${statusEmoji} ${admin.status}`);
      console.log(`  Created: ${admin.createdAt.toLocaleString()}`);
    });

    console.log('\n' + '='.repeat(50));
    console.log(`\nTotal Admin Users: ${adminUsers.length}`);

  } catch (error) {
    console.error('❌ Error checking admin users:', error);
  } finally {
    await db.$disconnect();
  }
}

checkAdminUsers();
