import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function check() {
  try {
    console.log('=== USERS with role PATIENT ===');
    const users = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      select: { id: true, email: true, name: true, status: true, role: true, createdAt: true }
    });
    console.log(JSON.stringify(users, null, 2));

    console.log('\n=== PATIENTS ===');
    const patients = await prisma.patient.findMany({
      include: {
        user: {
          select: { id: true, email: true, name: true, status: true, role: true }
        }
      }
    });
    console.log(JSON.stringify(patients, null, 2));

    console.log('\n=== STATS ===');
    const activeUsers = await prisma.user.count({
      where: { role: 'PATIENT', status: 'ACTIVE' }
    });
    const pendingUsers = await prisma.user.count({
      where: { role: 'PATIENT', status: 'PENDING' }
    });
    const allPatients = await prisma.patient.count();
    const patientsWithActiveUser = await prisma.patient.count({
      where: { user: { status: 'ACTIVE' } }
    });

    console.log('Active PATIENT users:', activeUsers);
    console.log('Pending PATIENT users:', pendingUsers);
    console.log('All Patient records:', allPatients);
    console.log('Patients with ACTIVE user:', patientsWithActiveUser);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
