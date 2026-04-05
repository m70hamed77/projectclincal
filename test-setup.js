/**
 * Quick Setup Test
 * Test if everything is configured correctly
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Running setup tests...\n');

let allPassed = true;

// Test 1: Check if package.json exists
console.log('Test 1: Checking package.json...');
if (fs.existsSync('package.json')) {
  console.log('✅ package.json exists\n');
} else {
  console.log('❌ package.json not found\n');
  allPassed = false;
}

// Test 2: Check if .env exists
console.log('Test 2: Checking .env...');
if (fs.existsSync('.env')) {
  console.log('✅ .env exists\n');
} else {
  console.log('❌ .env not found\n');
  allPassed = false;
}

// Test 3: Check if db folder exists
console.log('Test 3: Checking db folder...');
if (fs.existsSync('db')) {
  console.log('✅ db folder exists\n');
} else {
  console.log('⚠️  db folder not found (run: mkdir db)\n');
}

// Test 4: Check if prisma folder exists
console.log('Test 4: Checking prisma folder...');
if (fs.existsSync('prisma')) {
  console.log('✅ prisma folder exists\n');
} else {
  console.log('❌ prisma folder not found\n');
  allPassed = false;
}

// Test 5: Check if src folder exists
console.log('Test 5: Checking src folder...');
if (fs.existsSync('src')) {
  console.log('✅ src folder exists\n');
} else {
  console.log('❌ src folder not found\n');
  allPassed = false;
}

// Test 6: Check if scripts folder exists
console.log('Test 6: Checking scripts folder...');
if (fs.existsSync('scripts')) {
  console.log('✅ scripts folder exists\n');
} else {
  console.log('⚠️  scripts folder not found\n');
}

// Test 7: Check .env content
console.log('Test 7: Checking .env content...');
try {
  const envContent = fs.readFileSync('.env', 'utf8');
  if (envContent.includes('DATABASE_URL')) {
    console.log('✅ DATABASE_URL found in .env\n');
  } else {
    console.log('❌ DATABASE_URL not found in .env\n');
    allPassed = false;
  }
} catch (e) {
  console.log('⚠️  Could not read .env\n');
}

// Test 8: Check node_modules
console.log('Test 8: Checking node_modules...');
if (fs.existsSync('node_modules')) {
  console.log('✅ node_modules exists\n');
} else {
  console.log('⚠️  node_modules not found (run: npm install)\n');
}

// Summary
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
if (allPassed) {
  console.log('✅ All critical tests passed!');
  console.log('\nNext steps:');
  console.log('1. npm install (if not done)');
  console.log('2. mkdir db (if db folder doesn\'t exist)');
  console.log('3. npx prisma generate');
  console.log('4. npx prisma db push');
  console.log('5. npm run create-admin');
  console.log('6. npm run dev');
} else {
  console.log('❌ Some tests failed. Please fix the issues above.');
}
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
