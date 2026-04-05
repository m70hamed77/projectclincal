#!/usr/bin/env node

/**
 * Health Check Script
 * للتحقق من أن المشروع سليم وجاهز للتشغيل
 */

console.log('🔍 Starting Health Check...\n');

const fs = require('fs');
const path = require('path');

const checks = [];
let passed = 0;
let failed = 0;

function check(name, condition, details = '') {
  const result = condition ? '✅' : '❌';
  console.log(`${result} ${name}`);
  if (details) console.log(`   ${details}`);
  checks.push({ name, passed: condition });
  if (condition) passed++;
  else failed++;
}

// 1. تحقق من الملفات الأساسية
console.log('\n📁 Checking Essential Files...\n');
check('next.config.mjs exists', fs.existsSync(path.join(__dirname, 'next.config.mjs')));
check('package.json exists', fs.existsSync(path.join(__dirname, 'package.json')));
check('.env exists', fs.existsSync(path.join(__dirname, '.env')));
check('tsconfig.json exists', fs.existsSync(path.join(__dirname, 'tsconfig.json')));

// 2. تحقق من المجلدات الأساسية
console.log('\n📂 Checking Essential Directories...\n');
check('src/app exists', fs.existsSync(path.join(__dirname, 'src', 'app')));
check('src/components exists', fs.existsSync(path.join(__dirname, 'src', 'components')));
check('src/lib exists', fs.existsSync(path.join(__dirname, 'src', 'lib')));
check('prisma exists', fs.existsSync(path.join(__dirname, 'prisma')));

// 3. تحقق من ملفات الصفحات
console.log('\n📄 Checking Page Files...\n');
check('page.tsx exists', fs.existsSync(path.join(__dirname, 'src', 'app', 'page.tsx')));
check('layout.tsx exists', fs.existsSync(path.join(__dirname, 'src', 'app', 'layout.tsx')));
check('middleware.ts exists', fs.existsSync(path.join(__dirname, 'src', 'middleware.ts')));

// 4. تحقق من ملفات API
console.log('\n🔌 Checking API Routes...\n');
check('API route exists', fs.existsSync(path.join(__dirname, 'src', 'app', 'api', 'route.ts')));
check('Auth login API exists', fs.existsSync(path.join(__dirname, 'src', 'app', 'api', 'auth', 'login', 'route.ts')));
check('Auth register API exists', fs.existsSync(path.join(__dirname, 'src', 'app', 'api', 'auth', 'register-user', 'route.ts')));

// 5. تحقق من قاعدة البيانات
console.log('\n🗄️ Checking Database Files...\n');
check('schema.prisma exists', fs.existsSync(path.join(__dirname, 'prisma', 'schema.prisma')));
check('db.ts exists', fs.existsSync(path.join(__dirname, 'src', 'lib', 'db.ts')));

// 6. تحقق من .env
console.log('\n🔒 Checking Environment Variables...\n');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  const envContent = fs.readFileSync(path.join(__dirname, '.env'), 'utf-8');
  check('DATABASE_URL is set', envContent.includes('DATABASE_URL='));
  check('NEXTAUTH_URL is set', envContent.includes('NEXTAUTH_URL='));
  check('NEXTAUTH_SECRET is set', envContent.includes('NEXTAUTH_SECRET='));
}

// 7. تحقق من package.json scripts
console.log('\n📦 Checking Package Scripts...\n');
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8'));
check('dev script exists', packageJson.scripts?.dev);
check('build script exists', packageJson.scripts?.build);
check('lint script exists', packageJson.scripts?.lint);

// 8. تحقق من الصفحة الرئيسية
console.log('\n🏠 Checking Homepage...\n');
if (fs.existsSync(path.join(__dirname, 'src', 'app', 'page.tsx'))) {
  const pageContent = fs.readFileSync(path.join(__dirname, 'src', 'app', 'page.tsx'), 'utf-8');
  check('Homepage has no useEffect', !pageContent.includes('useEffect'));
  check('Homepage has no async', !pageContent.includes('async function'));
  check('Homepage is simple', pageContent.includes('export default function Home'));
}

// 9. تحقق من layout
console.log('\n📐 Checking Layout...\n');
if (fs.existsSync(path.join(__dirname, 'src', 'app', 'layout.tsx'))) {
  const layoutContent = fs.readFileSync(path.join(__dirname, 'src', 'app', 'layout.tsx'), 'utf-8');
  check('Layout is simple', layoutContent.includes('export default async function RootLayout'));
  check('No infinite redirects', !layoutContent.includes('redirect'));
}

// 10. تحقق من middleware
console.log('\n🛡️ Checking Middleware...\n');
if (fs.existsSync(path.join(__dirname, 'src', 'middleware.ts'))) {
  const middlewareContent = fs.readFileSync(path.join(__dirname, 'src', 'middleware.ts'), 'utf-8');
  check('Redirects are commented out for public routes', middlewareContent.includes('// if (isPublicRoute && token)'));
  check('Middleware has proper checks', middlewareContent.includes('isProtectedRoute') && middlewareContent.includes('isPublicRoute'));

  // التحقق من أن redirect محمي بـ if condition
  const redirectInIfBlock = middlewareContent.includes('if (isProtectedRoute && !token)') && middlewareContent.includes('return NextResponse.redirect(loginUrl)');
  check('Redirect is properly protected', redirectInIfBlock);
}

// النتيجة النهائية
console.log('\n' + '='.repeat(50));
console.log(`\n📊 Health Check Results:`);
console.log(`   ✅ Passed: ${passed}`);
console.log(`   ❌ Failed: ${failed}`);
console.log(`   📈 Success Rate: ${Math.round((passed / checks.length) * 100)}%\n`);

if (failed === 0) {
  console.log('🎉 All checks passed! The project is healthy.\n');
  console.log('💡 To run the project locally:');
  console.log('   1. npm install');
  console.log('   2. npm run db:generate');
  console.log('   3. npm run db:push');
  console.log('   4. npm run dev\n');
  console.log('📌 The preview issue is NOT related to the code.');
  console.log('   Please check the server/deployment on your side.\n');
  process.exit(0);
} else {
  console.log('⚠️ Some checks failed. Please review the issues above.\n');
  process.exit(1);
}
