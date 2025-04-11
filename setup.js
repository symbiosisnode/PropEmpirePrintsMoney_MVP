#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 PropEmpire Setup Script');
console.log('=========================');

// Check if .env file exists
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.log('Creating .env file...');
  
  // Create .env file with default values
  const envContent = `MONGO_URI=your_mongo_atlas_connection_string
ATLAS_SECRET_LOGIN=superSecretPassword123
JWT_SECRET=makeThisSuperStrongAndRandom
PORT=3001`;
  
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created with default values');
  console.log('⚠️  Please update the values in .env with your actual credentials');
} else {
  console.log('✅ .env file already exists');
}

// Check if node_modules exists
const nodeModulesPath = path.join(__dirname, 'node_modules');
if (!fs.existsSync(nodeModulesPath)) {
  console.log('Installing dependencies...');
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.error('❌ Failed to install dependencies:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Dependencies already installed');
}

// Create dist directory if it doesn't exist
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.log('Creating dist directory...');
  fs.mkdirSync(distPath);
  console.log('✅ dist directory created');
} else {
  console.log('✅ dist directory already exists');
}

// Create server directory if it doesn't exist
const serverPath = path.join(__dirname, 'server');
if (!fs.existsSync(serverPath)) {
  console.log('Creating server directory...');
  fs.mkdirSync(serverPath);
  console.log('✅ server directory created');
} else {
  console.log('✅ server directory already exists');
}

console.log('\n🎉 Setup completed successfully!');
console.log('\nTo start the application:');
console.log('1. Update the .env file with your actual credentials');
console.log('2. Run: npm start');
console.log('3. Open your browser and navigate to: http://localhost:3001');
console.log('\nFor development with auto-restart:');
console.log('Run: npm run dev'); 