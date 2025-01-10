const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../src/images");
const outputDir = path.join(__dirname, "../public/images");

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
function processImages(dir, subDir = "") {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // Process subdirectories
      const subDirPath = path.join(subDir, file);
      processImages(inputPath, subDirPath);
    } else if (file.match(/\.(jpg|jpeg|png)$/i)) {
      const postName = path.basename(dir);
      const outputPath = path.join(outputDir, subDir);

      // Ensure output subdirectory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const baseName = path.parse(file).name;

      // Generate sizes
      Object.entries(sizes).forEach(([sizeName, size]) => {
        const outputFileName = `${baseName}-${sizeName}.webp`
        const outputFile = path.join(outputPath, outputFileName);

        let transformer = sharp(inputPath).webp({ quality: 80 });

        if (sizeName === "thumbnail") {
          // Crop and resize for square thumbnails
          transformer = transformer.resize(size, size, {
            fit: "cover",
          });
        } else {
          // Resize normally
          transformer = transformer.resize(size);
        }

        transformer
          .toFile(outputFile)
          .then(() => console.log(`Generated: ${outputFile}`))
          .catch((err) => console.error(`Error processing ${file}:`, err));
      });
    }
  });
}

// Start processing
processImages(inputDir);
