import { db } from './src/lib/db';
import { hashPassword } from './src/lib/password';

async function resetAdminPasswords() {
  try {
    console.log('🔐 Resetting admin passwords...');
    console.log('='.repeat(60));

    // Generate new passwords
    const password1 = 'Admin1234!';
    const password2 = 'Admin1234!';

    // Update first admin: admin@smileydentalclinac.com
    const hashedPassword1 = await hashPassword(password1);

    const admin1 = await db.user.update({
      where: {
        email: 'admin@smileydentalclinac.com'
      },
      data: {
        password: hashedPassword1,
        status: 'ACTIVE'
      }
    });

    console.log('\n✅ Admin #1 (Active):');
    console.log('─'.repeat(60));
    console.log(`  📧 Email: ${admin1.email}`);
    console.log(`  📛 Name: ${admin1.name}`);
    console.log(`  🔑 Password: ${password1}`);
    console.log(`  ✅ Status: ${admin1.status}`);
    console.log(`  🆔 ID: ${admin1.id}`);

    // Update second admin: admin@smileydental.com
    const hashedPassword2 = await hashPassword(password2);

    const admin2 = await db.user.update({
      where: {
        email: 'admin@smileydental.com'
      },
      data: {
        password: hashedPassword2,
        status: 'BANNED'
      }
    });

    console.log('\n❌ Admin #2 (Banned):');
    console.log('─'.repeat(60));
    console.log(`  📧 Email: ${admin2.email}`);
    console.log(`  📛 Name: ${admin2.name}`);
    console.log(`  🔑 Password: ${password2}`);
    console.log(`  🚫 Status: ${admin2.status}`);
    console.log(`  🆔 ID: ${admin2.id}`);

    console.log('\n' + '='.repeat(60));
    console.log('\n⚠️  REMINDER:');
    console.log('   • Only Admin #1 can access (admin@smileydentalclinac.com)');
    console.log('   • Admin #2 is disabled (admin@smileydental.com)');
    console.log('   • Change these passwords after first login!');

  } catch (error) {
    console.error('❌ Error resetting passwords:', error);
  } finally {
    await db.$disconnect();
  }
}

resetAdminPasswords();
