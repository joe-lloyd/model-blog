const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

// Configure AWS S3
const s3 = new AWS.S3({
  region: 'eu-central-1',
});

// Bucket name
const bucketName = 'modelblogbucket';

// Directories to upload
const directories = {
  images: path.join(__dirname, '../public/images'),
  videos: path.join(__dirname, '../public/videos'),
};

// Function to upload a single file
const uploadFile = (filePath, s3Path) => {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
      console.error(`Error reading file ${filePath}:`, err);
      reject(err);
    });

    const params = {
      Bucket: bucketName,
      Key: s3Path, // S3 object key (folder path in bucket)
      Body: fileStream,
      ContentType: getContentType(filePath),
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error(`Error uploading file ${filePath}:`, err);
        reject(err);
      } else {
        console.log(`Uploaded ${filePath} to ${data.Location}`);
        resolve(data);
      }
    });
  });
};

// Function to determine MIME type
const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.mp4') return 'video/mp4';
  return 'application/octet-stream';
};

// Recursive function to upload all files in a directory
const uploadDirectory = async (directoryPath, s3Folder) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const s3Path = path.join(s3Folder, file).replace(/\\/g, '/'); // For Windows compatibility

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      // Recurse into subdirectory
      await uploadDirectory(fullPath, s3Path);
    } else {
      // Upload file
      await uploadFile(fullPath, s3Path);
    }
  }
};

// Main function
const main = async () => {
  console.time('Upload Time');

  try {
    // Upload images
    console.log('Uploading images...');
    await uploadDirectory(directories.images, 'images');

    // Upload videos
    console.log('Uploading videos...');
    await uploadDirectory(directories.videos, 'videos');

    console.log('All files uploaded successfully!');
  } catch (err) {
    console.error('Error uploading files:', err);
  }

  console.timeEnd('Upload Time');
};

main();
