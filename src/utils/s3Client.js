import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const region = process.env.REACT_APP_S3_REGION;
const endpoint = process.env.REACT_APP_S3_ENDPOINT;
const accessKeyId = process.env.REACT_APP_S3_ACCESS_KEY_ID;
const secretAccessKey = process.env.REACT_APP_S3_SECRET_ACCESS_KEY;

export const s3 = new S3Client({
  region,
  endpoint,
  forcePathStyle: true, // Suele ser necesario para endpoints S3 custom
  credentials: {
    accessKeyId,
    secretAccessKey
  }
});

export const uploadToS3 = async (bucket, key, file) => {
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: file,
    ContentType: file.type
  });
  const response = await s3.send(command);
  return response;
};
