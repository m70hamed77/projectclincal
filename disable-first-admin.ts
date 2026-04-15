import { db } from './src/lib/db';

async function disableFirstAdmin() {
  try {
    const adminEmail = 'admin@smileydentalclinac.com';

    console.log('🔒 Disabling admin account...');
    console.log('Target:', adminEmail);
    console.log('='.repeat(50));

    // Update the admin status to BANNED
    const updatedAdmin = await db.user.update({
      where: {
        email: adminEmail
      },
      data: {
        status: 'BANNED',
        deleteReason: 'Disabled per user request - keeping only admin@smileydental.com'
      }
    });

    console.log('✅ Admin account disabled successfully!');
    console.log('\nUpdated Account Details:');
    console.log(`  ID: ${updatedAdmin.id}`);
    console.log(`  Name: ${updatedAdmin.name}`);
    console.log(`  Email: ${updatedAdmin.email}`);
    console.log(`  Status: 🚫 ${updatedAdmin.status}`);
    console.log(`  Reason: ${updatedAdmin.deleteReason}`);

    console.log('\n' + '='.repeat(50));
    console.log('\n✅ Only admin@smileydental.com can now access the admin panel!');

  } catch (error) {
    console.error('❌ Error disabling admin:', error);
  } finally {
    await db.$disconnect();
  }
}

disableFirstAdmin();
