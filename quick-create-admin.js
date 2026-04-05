const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function quickCreateAdmin() {
  try {
    console.log('🔍 Checking if admin exists...');

    // البحث عن أي حساب أدمن
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Admin already exists:');
      console.log('   Email:', existingAdmin.email);
      console.log('   Name:', existingAdmin.name);
      console.log('   Status:', existingAdmin.status);

      // التحقق من سجل Admin
      const adminRecord = await prisma.admin.findUnique({
        where: { userId: existingAdmin.id }
      });

      if (!adminRecord) {
        console.log('📋 Creating Admin record...');
        await prisma.admin.create({
          data: {
            userId: existingAdmin.id,
            permissions: 'all'
          }
        });
        console.log('✅ Admin record created!');
      } else {
        console.log('✅ Admin record exists');
      }
    } else {
      console.log('❌ No admin found. Creating new admin account...');

      // إنشاء حساب أدمن جديد
      const hashedPassword = await bcrypt.hash('Admin@123456', 12);

      const admin = await prisma.user.create({
        data: {
          email: 'admin@smileydental.com',
          password: hashedPassword,
          name: 'System Admin',
          role: 'ADMIN',
          status: 'ACTIVE',
          emailVerified: new Date(),
          phone: '+970123456789'
        }
      });

      console.log('✅ Admin user created:', admin.id);

      // إنشاء سجل Admin
      await prisma.admin.create({
        data: {
          userId: admin.id,
          permissions: 'all'
        }
      });

      console.log('✅ Admin profile created!');

      console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('✅ ADMIN ACCOUNT CREATED SUCCESSFULLY!');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('\n📝 Login Credentials:');
      console.log('   Email:   admin@smileydental.com');
      console.log('   Password: Admin@123456');
      console.log('\n⚠️  Please change the password after first login!');
    }

    // عرض جميع الأدمن
    const allAdmins = await prisma.user.findMany({
      where: { role: 'ADMIN' },
      select: {
        id: true,
        name: true,
        email: true,
        status: true,
        createdAt: true
      }
    });

    console.log('\n📊 All admin accounts:');
    allAdmins.forEach((admin, index) => {
      console.log(`\n  ${index + 1}. ${admin.name}`);
      console.log(`     Email: ${admin.email}`);
      console.log(`     Status: ${admin.status}`);
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

quickCreateAdmin();
