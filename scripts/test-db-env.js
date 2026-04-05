require('dotenv').config({ path: '/home/z/my-project/.env' });

console.log('=== Environment Variables ===');
console.log('DATABASE_URL length:', process.env.DATABASE_URL?.length || 0);
console.log('DATABASE_URL:', process.env.DATABASE_URL);
console.log('DATABASE_URL starts with postgresql://?', process.env.DATABASE_URL?.startsWith('postgresql://'));
console.log('DATABASE_URL starts with file://?', process.env.DATABASE_URL?.startsWith('file://'));

// Check if there's a DATABASE_URL in any other source
console.log('\n=== Checking all possible sources ===');
const fs = require('fs');
const path = require('path');

const possibleEnvFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.example'
];

possibleEnvFiles.forEach(file => {
  const filePath = path.join('/home/z/my-project', file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/^DATABASE_URL=(.*)$/m);
    if (match) {
      console.log(`\nFound in ${file}:`);
      console.log(`  Value: ${match[1].substring(0, 50)}...`);
    }
  }
});
