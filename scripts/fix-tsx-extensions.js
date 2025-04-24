// scripts/fix-tsx-extensions.js
const fs = require('fs');
const path = require('path');

/**
 * Recursively walk through a directory and rename .ts files containing JSX to .tsx
 * @param {string} dir Directory to scan
 */
function fixTsxExtensions(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git')) {
        // Recursively process subdirectories
        fixTsxExtensions(filePath);
      } else if (file.endsWith('.ts') && !file.endsWith('.d.ts')) {
        // Check if .ts file contains JSX
        const content = fs.readFileSync(filePath, 'utf8');
        if (content.includes('JSX') || content.includes('jsx') || 
            content.includes('React.FC') || 
            (content.includes('<') && content.includes('>') && content.includes('import React'))) {
          // Rename to .tsx
          const newPath = filePath.replace('.ts', '.tsx');
          console.log(`Renaming ${filePath} to ${newPath}`);
          fs.renameSync(filePath, newPath);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Start from the src directory
const srcDir = path.join(__dirname, '../src');
if (fs.existsSync(srcDir)) {
  console.log('Fixing .tsx extensions in src directory...');
  fixTsxExtensions(srcDir);
}

// Also check the app directory for Next.js pages
const appDir = path.join(__dirname, '../app');
if (fs.existsSync(appDir)) {
  console.log('Fixing .tsx extensions in app directory...');
  fixTsxExtensions(appDir);
}

console.log('Done fixing .tsx extensions!');
