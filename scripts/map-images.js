const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");
const sharp = require("sharp");

const imagesDir = path.join(__dirname, "media-in/images");
const videosDir = path.join(__dirname, "media-in/videos");
const contentDir = path.join(__dirname, "../src/content");

/**
 * Strips extensions and known suffixes like -thumbnail, -small, etc.
 */
function cleanImageName(filename) {
  const base = path.parse(filename).name;
  return base.replace(/-(small|medium|large|extraLarge|thumbnail)$/i, "");
}

/**
 * Strips extensions and -preview suffix for videos.
 */
function cleanVideoName(filename) {
  const base = path.parse(filename).name;
  return base.replace(/-preview$/i, "");
}

async function mapMedia() {
  // Get all unique slugs from both images and videos directories
  const imageSlugs = fs.existsSync(imagesDir)
    ? fs
        .readdirSync(imagesDir)
        .filter((f) => fs.statSync(path.join(imagesDir, f)).isDirectory())
    : [];
  const videoSlugs = fs.existsSync(videosDir)
    ? fs
        .readdirSync(videosDir)
        .filter((f) => fs.statSync(path.join(videosDir, f)).isDirectory())
    : [];

  const allSlugs = [...new Set([...imageSlugs, ...videoSlugs])];

  for (const slug of allSlugs) {
    const mdxPath = path.join(contentDir, `${slug}.mdx`);

    if (!fs.existsSync(mdxPath)) {
      console.warn(`No MDX file found for slug: ${slug} at ${mdxPath}`);
      continue;
    }

    // Process Images
    let uniqueImages = [];
    const folderPath = path.join(imagesDir, slug);
    if (fs.existsSync(folderPath)) {
      const files = fs
        .readdirSync(folderPath)
        .filter((f) => f.match(/\.(jpg|jpeg|png|webp)$/i));
      const imageMap = new Map();

      for (const file of files) {
        const cleanName = cleanImageName(file);

        let isPortrait = false;
        let width = 0;
        let height = 0;
        let mtime = 0;

        // Try to read dimensions from processed output file first (media-out)
        // This is safer as it represents exactly what the user sees
        const processedPath = path.join(
          __dirname,
          "media-out/images",
          slug,
          `${cleanName}-extraLarge.webp`,
        );

        let loadedFromProcessed = false;

        try {
          if (fs.existsSync(processedPath)) {
            const metadata = await sharp(processedPath).metadata();
            width = metadata.width;
            height = metadata.height;
            loadedFromProcessed = true;

            // Processed files should already be rotated, but we check orientation just in case
            if (metadata.orientation && metadata.orientation >= 5) {
              const temp = width;
              width = height;
              height = temp;
            }
            isPortrait = width < height;
          }
        } catch (err) {
          // Ignore error reading processed file, fallback to source
        }

        if (!loadedFromProcessed) {
          try {
            const stats = fs.statSync(path.join(folderPath, file));
            mtime = stats.mtimeMs;

            const metadata = await sharp(
              path.join(folderPath, file),
            ).metadata();

            width = metadata.width;
            height = metadata.height;

            if (metadata.orientation && metadata.orientation >= 5) {
              // Swap width and height for rotated images (e.g. 90deg or 270deg)
              const temp = width;
              width = height;
              height = temp;
              isPortrait = width < height; // effectively true usually
            } else {
              isPortrait = height > width;
            }
          } catch (err) {
            console.warn(`Could not read metadata for ${file}: ${err.message}`);
          }
        }

        const existing = imageMap.get(cleanName);

        // If it's the first time seeing this image, or if this file is explicitly the 'extraLarge' version
        // or if we find a larger version than what we currently have
        // (Note: if loadedFromProcessed is true, we have the definitive dimensions already, but we still need mtime from source or loop)
        // If loadedFromProcessed is true, we should overwrite whatever we have because it is "truth".

        const shouldUpdate =
          !existing ||
          file.includes("extraLarge") ||
          activeIsBigger(width, existing.width) ||
          loadedFromProcessed;

        function activeIsBigger(w, existingW) {
          return (w || 0) > (existingW || 0);
        }

        if (shouldUpdate) {
          imageMap.set(cleanName, {
            name: cleanName,
            portrait: isPortrait,
            mtime: existing ? existing.mtime : mtime, // keep original mtime if available
            width,
            height,
          });
        }
      }

      // Sort images based on timestamp in name or mtime fallback
      uniqueImages = Array.from(imageMap.values()).sort((a, b) => {
        const parseTimestamp = (name) => {
          const match = name.match(
            /^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$/,
          );
          if (match) {
            return new Date(
              `${match[1]}-${match[2]}-${match[3]}T${match[4]}:${match[5]}:${match[6]}`,
            ).getTime();
          }
          return null;
        };

        const tsA = parseTimestamp(a.name);
        const tsB = parseTimestamp(b.name);

        if (tsA !== null && tsB !== null) return tsA - tsB;
        if (tsA !== null) return 1; // Timestamps go last
        if (tsB !== null) return -1;

        // If both are numbers, sort numerically
        const numA = parseInt(a.name);
        const numB = parseInt(b.name);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

        // Fallback to mtime
        return a.mtime - b.mtime;
      });
    }

    // Process Videos
    let uniqueVideos = [];
    const videoFolderPath = path.join(videosDir, slug);
    if (fs.existsSync(videoFolderPath)) {
      const vFiles = fs
        .readdirSync(videoFolderPath)
        .filter((f) => f.match(/\.(mp4|webm|mov)$/i));
      uniqueVideos = [...new Set(vFiles.map(cleanVideoName))];
    }

    // Read MDX
    const fileContents = fs.readFileSync(mdxPath, "utf8");
    const { data, content } = matter(fileContents);

    let updated = false;

    // Update imageNames
    if (uniqueImages.length > 0) {
      data.imageNames = uniqueImages.map((img) => {
        const entry = { name: img.name };
        // Clean up portrait property as we use explicit width/height

        // Add dimensions
        if (img.width) entry.width = img.width;
        if (img.height) entry.height = img.height;

        return entry;
      });
      data.coverImage = uniqueImages[uniqueImages.length - 1].name;
      updated = true;
    }

    // Update videoNames (as Array<string> to match VideoGallery)
    if (uniqueVideos.length > 0) {
      data.videoNames = uniqueVideos;
      updated = true;
    }

    if (updated) {
      const updatedMdx = matter.stringify(content, data);
      fs.writeFileSync(mdxPath, updatedMdx);
      console.log(
        `Updated ${slug}.mdx: ${uniqueImages.length} images, ${uniqueVideos.length} videos.`,
      );
    }
  }
}

mapMedia()
  .then(() => console.log("Media mapping complete!"))
  .catch((err) => console.error(err));
