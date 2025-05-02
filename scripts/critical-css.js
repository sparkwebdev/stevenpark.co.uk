import * as critical from 'critical';
import { glob } from 'glob';
import path from 'path';
import { promises as fs } from 'fs';

async function generateCriticalCSS() {
  try {
    // Find all HTML files in the dist directory
    const files = await glob('dist/**/*.html');
    
    // Process each HTML file
    for (const file of files) {
      const filename = path.basename(file, '.html');
      console.log(`Generating critical CSS for ${filename}`);
      
      try {
        // Generate critical CSS
        const result = await critical.generate({
          base: 'dist/',
          src: file,
          target: {
            css: `dist/css/critical/${filename}.css`,
            html: file
          },
          inline: true,
          extract: true,
          dimensions: [
            {
              height: 900,
              width: 375,
            },
            {
              height: 1080,
              width: 1920,
            },
          ],
          ignore: {
            atrule: ['@font-face']
          }
        });

        console.log(`✓ Generated critical CSS for ${filename}`);
      } catch (err) {
        console.error(`× Error generating critical CSS for ${filename}:`, err);
      }
    }
  } catch (err) {
    console.error('Error in critical CSS generation:', err);
    process.exit(1);
  }
}

// Ensure the critical CSS directory exists
async function init() {
  try {
    await fs.mkdir('dist/css/critical', { recursive: true });
    await generateCriticalCSS();
  } catch (err) {
    console.error('Initialization error:', err);
    process.exit(1);
  }
}

init(); 