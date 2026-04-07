const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    console.log('🧹 Starting Database Cleanup...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Get admin email to keep
    const admin = await prisma.user.findFirst({
      where: { role: 'ADMIN' },
      select: { email: true, name: true }
    });

    if (!admin) {
      console.log('❌ No admin found! Aborting...');
      return;
    }

    console.log('✅ Keeping admin account:', admin.email, '(' + admin.name + ')');
    console.log('');

    // Delete in order respecting foreign key constraints
    const operations = [
      { name: 'Messages', model: prisma.message },
      { name: 'Case Photos', model: prisma.casePhoto },
      { name: 'Patient Consents', model: prisma.patientConsent },
      { name: 'Patient Certificates', model: prisma.patientCertificate },
      { name: 'Ratings', model: prisma.rating },
      { name: 'Appointments', model: prisma.appointment },
      { name: 'Cases', model: prisma.case },
      { name: 'Applications', model: prisma.application },
      { name: 'Application Medical Data', model: prisma.applicationMedicalData },
      { name: 'Conversations', model: prisma.conversation },
      { name: 'Posts', model: prisma.post },
      { name: 'Notifications', model: prisma.notification },
      { name: 'Reports', model: prisma.report },
      { name: 'User Bans', model: prisma.userBan },
      { name: 'User Strikes', model: prisma.userStrike },
      { name: 'Admin Action Logs', model: prisma.adminActionLog },
      { name: 'Student Badges', model: prisma.studentBadge },
      { name: 'Student Points', model: prisma.studentPoints },
      { name: 'Student Stats', model: prisma.studentStats },
      { name: 'Google Calendar Syncs', model: prisma.googleCalendarSync },
      { name: 'Patient Medical Profiles', model: prisma.patientMedicalProfile },
    ];

    let totalDeleted = 0;

    for (const op of operations) {
      try {
        const count = await op.model.count();
        if (count > 0) {
          console.log(`🗑️  Deleting ${count} ${op.name}...`);
          await op.model.deleteMany({});
          totalDeleted += count;
          console.log(`   ✅ ${op.name} deleted`);
        }
      } catch (error) {
        console.log(`   ⚠️  Error deleting ${op.name}:`, error.message);
      }
    }

    // Delete all users except admin
    console.log('\n🗑️  Deleting non-admin users...');
    const usersDeleted = await prisma.user.deleteMany({
      where: {
        role: { not: 'ADMIN' }
      }
    });
    console.log(`   ✅ Deleted ${usersDeleted.count} users`);
    totalDeleted += usersDeleted.count;

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ DATABASE CLEANUP COMPLETED!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Summary:');
    console.log('   Total records deleted:', totalDeleted);
    console.log('   Admin account preserved:', admin.email);
    console.log('\n💡 Database is now clean and ready for fresh data!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase();
