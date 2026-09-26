const cloudinary = require("cloudinary").v2;
const { logger } = require("../utils/logger");

const configureCloudinary = () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret ||
    cloudName === "your_cloud_name_here" ||
    apiKey === "your_api_key_here" ||
    apiSecret === "your_api_secret_here"
  ) {
    logger.warn("Cloudinary credentials missing. Cloud backup will be skipped.");
    return false;
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  });

  return true;
};

module.exports = {
  cloudinary,
  configureCloudinary,
};
