import { db } from './src/lib/db';
import { hashPassword } from './src/lib/password';

async function activateNewAdmin() {
  try {
    console.log('🔄 Activating new admin account...');
    console.log('='.repeat(60));

    const newAdminEmail = 'admin@smileydentalclinacaal.com';
    const newPassword = 'Admin@mo#abdomor^aa*';
    const newPhone = '01010491760';
    const newName = 'System Admin';

    // Hash the new password
    const hashedPassword = await hashPassword(newPassword);

    console.log('\n🔑 Hashing new password...');
    console.log('✅ Password hashed successfully!');

    // Disable all existing admins
    console.log('\n🚫 Disabling all existing admins...');

    const existingAdmins = await db.user.findMany({
      where: {
        role: 'ADMIN',
        NOT: {
          email: newAdminEmail
        }
      }
    });

    for (const admin of existingAdmins) {
      await db.user.update({
        where: { id: admin.id },
        data: {
          status: 'BANNED',
          deleteReason: 'Disabled - new admin activated'
        }
      });
      console.log(`  ❌ Disabled: ${admin.email}`);
    }

    // Check if new admin exists
    let admin;
    const existingNewAdmin = await db.user.findUnique({
      where: { email: newAdminEmail }
    });

    if (existingNewAdmin) {
      // Update existing admin
      console.log('\n✏️  Updating existing admin account...');

      admin = await db.user.update({
        where: { email: newAdminEmail },
        data: {
          password: hashedPassword,
          name: newName,
          phone: newPhone,
          role: 'ADMIN',
          status: 'ACTIVE',
          deleteReason: null
        }
      });
    } else {
      // Create new admin
      console.log('\n✅ Creating new admin account...');

      admin = await db.user.create({
        data: {
          email: newAdminEmail,
          password: hashedPassword,
          name: newName,
          phone: newPhone,
          role: 'ADMIN',
          status: 'ACTIVE'
        }
      });
    }

    console.log('\n' + '═'.repeat(60));
    console.log('✅ NEW ADMIN ACCOUNT ACTIVATED:');
    console.log('═'.repeat(60));
    console.log(`  📧 Email: ${newAdminEmail}`);
    console.log(`  🔑 Password: ${newPassword}`);
    console.log(`  👤 Name: ${admin.name}`);
    console.log(`  📱 Phone: ${admin.phone}`);
    console.log(`  🛡️ Role: ${admin.role}`);
    console.log(`  ✅ Status: ${admin.status}`);
    console.log(`  🆔 ID: ${admin.id}`);
    console.log('═'.repeat(60));

    console.log('\n📊 SUMMARY:');
    console.log(`  • Disabled ${existingAdmins.length} old admin(s)`);
    console.log(`  • Activated new admin: ${newAdminEmail}`);
    console.log('\n✅ Only the new admin can now access!');

  } catch (error) {
    console.error('❌ Error activating new admin:', error);
  } finally {
    await db.$disconnect();
  }
}

activateNewAdmin();
