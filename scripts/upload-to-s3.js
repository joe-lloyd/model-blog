const fs = require("fs");
const path = require("path");
const {
  S3Client,
  HeadObjectCommand,
  PutObjectCommand,
} = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: "eu-central-1",
});

const bucketName = "modelblogbucket";

const directories = {
  images: path.join(__dirname, "./media-out/images"),
  videos: path.join(__dirname, "./media-out/videos"),
};

const fileExistsInS3 = async (s3Path) => {
  try {
    await s3Client.send(
      new HeadObjectCommand({
        Bucket: bucketName,
        Key: s3Path,
      })
    );
    return true;
  } catch (err) {
    if (err.name === "NotFound" || err.$metadata?.httpStatusCode === 404) {
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

  try {
    const fileContent = fs.readFileSync(filePath);

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Path,
      Body: fileContent,
      ContentType: getContentType(filePath),
    });

    await s3Client.send(command);
    console.log(`Uploaded ${filePath} to s3://${bucketName}/${s3Path}`);
  } catch (err) {
    console.error(`Error uploading file ${filePath}:`, err.message);
    throw err;
  }
};

const getContentType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".mp4") return "video/mp4";
  return "application/octet-stream";
};

const uploadDirectory = async (directoryPath, s3Folder) => {
  const files = fs.readdirSync(directoryPath);

  for (const file of files) {
    const fullPath = path.join(directoryPath, file);
    const s3Path = path.join(s3Folder, file).replace(/\\/g, "/");

    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await uploadDirectory(fullPath, s3Path);
    } else {
      await uploadFile(fullPath, s3Path);
    }
  }
};

const main = async () => {
  console.time("Upload Time");

  try {
    console.log("Uploading images...");
    await uploadDirectory(directories.images, "images");

    console.log("Uploading videos...");
    await uploadDirectory(directories.videos, "videos");

    console.log("All files uploaded successfully!");
  } catch (err) {
    console.error("Error uploading files:", err.message);
    if (err.$metadata) {
      console.error("HTTP Status:", err.$metadata.httpStatusCode);
    }
    if (err.name === "CredentialsProviderError") {
      console.error("\n⚠️  AWS Credentials not found!");
      console.error(
        "Please check ~/.aws/credentials or set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables."
      );
    }
  }

  console.timeEnd("Upload Time");
};

main();
