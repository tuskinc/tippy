// This script will test if environment variables are being loaded
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '.env');

console.log('Checking .env file at:', envPath);
console.log('File exists:', fs.existsSync(envPath));

if (fs.existsSync(envPath)) {
  console.log('File contents:');
  console.log(fs.readFileSync(envPath, 'utf8'));
} else {
  console.error('Error: .env file not found at', envPath);
}
