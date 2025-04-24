// scripts/find-commonjs-modules.js
const fs = require('fs');
const path = require('path');

/**
 * Find files using ES module syntax but should be converted to CommonJS
 * @param {string} dir Directory to scan
 */
function findEsModules(dir) {
  try {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat.isDirectory() && !file.startsWith('node_modules') && !file.startsWith('.git') && !file.startsWith('.next')) {
        // Recursively process subdirectories
        findEsModules(filePath);
      } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
        // Check if file contains ES module syntax
        const content = fs.readFileSync(filePath, 'utf8');
        if ((content.includes('export default') || content.includes('export {') || content.includes('export const')) && 
            !file.endsWith('.d.ts') && 
            !filePath.includes('node_modules') && 
            !filePath.includes('.next')) {
          console.log(`Found ES module export in: ${filePath}`);
        }
      }
    });
  } catch (error) {
    console.error(`Error processing directory ${dir}:`, error);
  }
}

// Start from the project root
const rootDir = path.join(__dirname, '..');
console.log('Searching for ES module exports...');
findEsModules(rootDir);
console.log('Search complete!');
