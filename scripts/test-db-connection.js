const { PrismaClient } = require('@prisma/client');

console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'Not set');
console.log('DATABASE_URL prefix:', process.env.DATABASE_URL?.substring(0, 20));

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function test() {
  try {
    console.log('Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connected successfully!');
    
    const count = await prisma.user.count();
    console.log('✅ User count:', count);
    
    await prisma.$disconnect();
    console.log('✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Error details:', error);
    process.exit(1);
  }
}

test();
