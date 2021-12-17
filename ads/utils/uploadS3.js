const S3 = require('aws-sdk/clients/s3');
const { v4: uuidv4 } = require('uuid');

const uploadImageS3 = (file, region, accessKeyId, secretAccessKey, bucketName) => {
  const s3 = new S3({
    region,
    accessKeyId,
    secretAccessKey,
  });
  const uploadParams = {
    Bucket: bucketName,
    Body: file,
    Key: `${uuidv4()}.jpg`,
  };
  return s3.upload(uploadParams).promise();
};

module.exports = uploadImageS3;
