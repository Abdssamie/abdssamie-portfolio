import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, '../public');
const OPTIMIZED_DIR = path.join(PUBLIC_DIR, 'optimized');

async function optimizeImages() {
  if (!fs.existsSync(OPTIMIZED_DIR)) {
    fs.mkdirSync(OPTIMIZED_DIR, { recursive: true });
  }

  const files = fs.readdirSync(PUBLIC_DIR).filter(
    file => file.endsWith('.png') || file.endsWith('.jpg') || file.endsWith('.jpeg')
  );

  console.log(`Found ${files.length} images to optimize`);

  for (const file of files) {
    const inputPath = path.join(PUBLIC_DIR, file);
    const outputName = path.basename(file, path.extname(file));
    const outputPath = path.join(OPTIMIZED_DIR, `${outputName}.webp`);

    try {
      await sharp(inputPath)
        .resize(1280, 1280, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp({ quality: 80, effort: 4 })
        .toFile(outputPath);
      
      const originalSize = fs.statSync(inputPath).size;
      const optimizedSize = fs.statSync(outputPath).size;
      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1);
      
      console.log(`✓ ${file} → ${outputName}.webp (${savings}% smaller)`);
    } catch (err) {
      console.error(`✗ Error processing ${file}:`, err.message);
    }
  }

  // Generate responsive sizes for profile image
  const profilePath = path.join(PUBLIC_DIR, 'profile.png');
  if (fs.existsSync(profilePath)) {
    const sizes = [320, 480, 640];
    for (const size of sizes) {
      const outputPath = path.join(OPTIMIZED_DIR, `profile-${size}.webp`);
      await sharp(profilePath)
        .resize(size, Math.round(size * 1.1), { fit: 'cover' })
        .webp({ quality: 80 })
        .toFile(outputPath);
      console.log(`✓ Generated responsive: profile-${size}.webp`);
    }
  }

  console.log('\nOptimization complete!');
  console.log(`Output directory: ${OPTIMIZED_DIR}`);
}

optimizeImages().catch(console.error);