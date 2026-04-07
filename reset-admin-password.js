const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function resetAdminPassword() {
  try {
    const email = 'admin@smileydentalclinac.com';
    const newPassword = 'Admin@mo#abdo*';

    console.log('🔍 Finding admin account...');
    const admin = await prisma.user.findUnique({
      where: { email }
    });

    if (!admin) {
      console.log('❌ Admin account not found!');
      return;
    }

    console.log('✅ Admin found:', admin.name);

    // تشفير كلمة المرور الجديدة
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    console.log('✅ Password hashed');

    // تحديث كلمة المرور
    console.log('🔄 Updating password...');
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    console.log('✅ Password updated successfully!');

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ ADMIN PASSWORD RESET SUCCESSFULLY!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📝 New Login Credentials:');
    console.log('   Email:   ' + email);
    console.log('   Password: ' + newPassword);
    console.log('\n💡 Please copy the password carefully!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

resetAdminPassword();
