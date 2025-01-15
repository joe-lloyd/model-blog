const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const inputDir = path.join(__dirname, './media-in/images');
const outputDir = path.join(__dirname, './media-out/images');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sizes to generate
const sizes = {
  thumbnail: 480, // Square thumbnails
  small: 600,
  medium: 800,
  large: 1200,
  extraLarge: 1920,
};

// Process images recursively, preserving folder structure
async function processImages(dir, subDir = '') {
  const files = fs.readdirSync(dir);
  const promises = files.map(async (file) => {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // Process subdirectories
      const subDirPath = path.join(subDir, file);
      return processImages(inputPath, subDirPath);
    }
    else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const outputPath = path.join(outputDir, subDir);

      // Ensure output subdirectory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const baseName = path.parse(file).name;

      // Read image metadata to determine orientation and dimensions
      const metadata = await sharp(inputPath).metadata();

      // Portrait flag
      const isPortrait = metadata.height > metadata.width;

      console.log(`Processing: ${inputPath}, isPortrait: ${isPortrait}`);

      // Generate sizes
      const sizePromises = Object.entries(sizes).map(async ([sizeName, size]) => {
        const outputFileName = `${baseName}-${sizeName}.webp`;
        const outputFile = path.join(outputPath, outputFileName);

        // Skip processing if the output file already exists
        if (fs.existsSync(outputFile)) {
          console.log(`Skipping (already exists): ${outputFile}`);
          return; // Skip to the next size
        }

        let transformer = sharp(inputPath)
          .rotate() // Respect EXIF orientation
          .webp({ quality: 80 });

        if (sizeName === 'thumbnail') {
          // Crop and resize for square thumbnails
          transformer = transformer.resize(size, size, { fit: 'cover' });
        }
        else {
          // Resize normally, adjusting for portrait images
          transformer = isPortrait
            ? transformer.resize({ height: size })
            : transformer.resize({ width: size });
        }

        return transformer
          .toFile(outputFile)
          .then(() => console.log(`Generated: ${outputFile}`))
          .catch((err) => console.error(`Error processing ${file}:`, err));
      });

      // Wait for all sizes to finish processing
      return Promise.all(sizePromises);
    }
  });

  // Wait for all files in this directory to finish processing
  return Promise.all(promises);
}

// Start processing and measure time
console.time('Total Processing Time');
processImages(inputDir)
  .then(() => {
    console.timeEnd('Total Processing Time');
    console.log('Image processing completed!');
  })
  .catch((err) => {
    console.error('Error during image processing:', err);
  });
