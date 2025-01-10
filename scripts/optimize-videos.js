const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");

const inputDir = path.join(__dirname, "../src/videos");
const outputDir = path.join(__dirname, "../public/videos");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Default resolution for WebM and preview videos
const resolution = 720;

// Convert video to WebM
function convertToWebM(inputPath, outputPath, resolution) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${inputPath}" -vf scale=-1:${resolution} -c:v libvpx-vp9 -b:v 1M -c:a libopus "${outputPath}"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(`Error processing ${inputPath}: ${stderr}`);
      } else {
        console.log(`Generated WebM: ${outputPath}`);
        resolve(stdout);
      }
    });
  });
}

// Generate a 1-second preview video (no sound)
function generatePreview(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const cmd = `ffmpeg -i "${inputPath}" -t 1 -vf "scale=-1:480,crop=480:480" -an -c:v libvpx-vp9 -b:v 1M "${outputPath}"`;
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(`Error generating preview for ${inputPath}: ${stderr}`);
      } else {
        console.log(`Generated Preview: ${outputPath}`);
        resolve(stdout);
      }
    });
  });
}

function processVideos(dir, subDir = "") {
  const files = fs.readdirSync(dir);

  files.forEach(async (file) => {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);

    if (stat.isDirectory()) {
      // Process subdirectories
      const subDirPath = path.join(subDir, file);
      processVideos(inputPath, subDirPath);
    } else if (file.match(/\.(mp4|mov|avi)$/i)) {
      const outputPath = path.join(outputDir, subDir);

      // Ensure output subdirectory exists
      if (!fs.existsSync(outputPath)) {
        fs.mkdirSync(outputPath, { recursive: true });
      }

      const baseName = path.parse(file).name;

      // WebM output
      const webmOutput = path.join(outputPath, `${baseName}.webm`);
      try {
        await convertToWebM(inputPath, webmOutput, resolution);
      } catch (err) {
        console.error(err);
      }

      // Preview output
      const previewOutput = path.join(outputPath, `${baseName}-preview.webm`);
      try {
        await generatePreview(inputPath, previewOutput);
      } catch (err) {
        console.error(err);
      }
    }
  });
}

// Start processing
processVideos(inputDir);
