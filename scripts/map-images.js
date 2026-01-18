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
        if (!imageMap.has(cleanName)) {
          let isPortrait = false;
          let mtime = 0;
          try {
            const stats = fs.statSync(path.join(folderPath, file));
            mtime = stats.mtimeMs;

            const metadata = await sharp(
              path.join(folderPath, file),
            ).metadata();
            if (metadata.orientation && metadata.orientation >= 5) {
              isPortrait = metadata.width > metadata.height;
            } else {
              isPortrait = metadata.height > metadata.width;
            }
          } catch (err) {
            console.warn(`Could not read metadata for ${file}: ${err.message}`);
          }
          imageMap.set(cleanName, {
            name: cleanName,
            portrait: isPortrait,
            mtime,
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
        if (img.portrait) entry.portrait = true;
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
