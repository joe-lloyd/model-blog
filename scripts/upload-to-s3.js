const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');


const s3 = new AWS.S3({
  region: 'eu-central-1',
});


const bucketName = 'modelblogbucket';


const directories = {
  images: path.join(__dirname, './media-out/images'),
  videos: path.join(__dirname, './media-out/videos'),
};


const fileExistsInS3 = async (s3Path) => {
  try {
    await s3.headObject({ Bucket: bucketName, Key: s3Path }).promise();
    return true;
  } catch (err) {
    if (err.code === 'NotFound') {
      return false;
    }
    throw err;
  }
};


const uploadFile = async (filePath, s3Path) => {
  const exists = await fileExistsInS3(s3Path);

  if (exists) {
    console.log(`Skipping ${filePath} (already exists in S3)`);
    return;
  }

  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    fileStream.on('error', (err) => {
      console.error(`Error reading file ${filePath}:`, err);
      reject(err);
    });

    const params = {
      Bucket: bucketName,
      Key: s3Path,
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


const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.webp') return 'image/webp';
  if (ext === '.mp4') return 'video/mp4';
  return 'application/octet-stream';
};


const uploadDirectory = async (directoryPath, s3Folder) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const s3Path = path.join(s3Folder, file).replace(/\\/g, '/');

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {

      await uploadDirectory(fullPath, s3Path);
    } else {

      await uploadFile(fullPath, s3Path);
    }
  }
};


const main = async () => {
  console.time('Upload Time');

  try {

    console.log('Uploading images...');
    await uploadDirectory(directories.images, 'images');


    console.log('Uploading videos...');
    await uploadDirectory(directories.videos, 'videos');

    console.log('All files uploaded successfully!');
  } catch (err) {
    console.error('Error uploading files:', err);
  }

  console.timeEnd('Upload Time');
};

main();
