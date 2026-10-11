const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const cwd = process.cwd();
const frontendDir = path.join(cwd, 'frontend');

if (fs.existsSync(frontendDir)) {
  console.log('[DocSmart Build] Running from project root...');
  execSync('npm --prefix frontend install', { stdio: 'inherit' });
  execSync('npm --prefix frontend run build', { stdio: 'inherit' });
  const srcDist = path.join(frontendDir, 'dist');
  const targetDist = path.join(cwd, 'dist');
  if (fs.existsSync(srcDist)) {
    fs.cpSync(srcDist, targetDist, { recursive: true });
    console.log('[DocSmart Build] Copied frontend/dist to ./dist for root output.');
  }
} else {
  console.log('[DocSmart Build] Running from frontend directory...');
  execSync('npm run build', { stdio: 'inherit' });
}
console.log('[DocSmart Build] Build completed successfully.');
