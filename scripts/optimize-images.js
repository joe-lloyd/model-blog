const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = path.join(__dirname, "../src/images");
const outputDir = path.join(__dirname, "../public/optimized-images");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Sizes to generate
const sizes = [400, 800, 1200]; // Thumbnail, medium, and large

fs.readdir(inputDir, (err, files) => {
  if (err) {
    console.error("Error reading input directory:", err);
    return;
  }

  files.forEach((file) => {
    const inputFile = path.join(inputDir, file);
    const fileName = path.parse(file).name;

    sizes.forEach((size) => {
      const outputFile = path.join(outputDir, `${fileName}-${size}.webp`);

      sharp(inputFile)
        .resize(size) // Resize to specified width
        .webp({ quality: 80 }) // Convert to WebP
        .toFile(outputFile)
        .then(() => console.log(`Generated: ${outputFile}`))
        .catch((err) => console.error(`Error processing ${file}:`, err));
    });
  });
});
