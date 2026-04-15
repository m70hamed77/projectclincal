import { db } from './src/lib/db';

async function switchAdminAccess() {
  try {
    console.log('🔄 Switching admin access...');
    console.log('='.repeat(50));

    // Enable first admin: admin@smileydentalclinac.com
    const firstAdmin = await db.user.update({
      where: {
        email: 'admin@smileydentalclinac.com'
      },
      data: {
        status: 'ACTIVE',
        deleteReason: null
      }
    });

    console.log('✅ First Admin ENABLED:');
    console.log(`  Email: ${firstAdmin.email}`);
    console.log(`  Status: ✅ ${firstAdmin.status}`);

    // Disable second admin: admin@smileydental.com
    const secondAdmin = await db.user.update({
      where: {
        email: 'admin@smileydental.com'
      },
      data: {
        status: 'BANNED',
        deleteReason: 'Disabled - using only admin@smileydentalclinac.com'
      }
    });

    console.log('\n❌ Second Admin DISABLED:');
    console.log(`  Email: ${secondAdmin.email}`);
    console.log(`  Status: 🚫 ${secondAdmin.status}`);

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Only admin@smileydentalclinac.com can now access!');

  } catch (error) {
    console.error('❌ Error switching admin access:', error);
  } finally {
    await db.$disconnect();
  }
}

switchAdminAccess();
