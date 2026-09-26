const { cloudinary, configureCloudinary } = require("../config/cloudinary");
const { logger } = require("../utils/logger");

// Upload ONLY encrypted buffer as raw backup
const uploadEncryptedBackup = async (encryptedBuffer, fileName = "encrypted.bin") => {
  try {
    const configured = configureCloudinary();
    if (!configured) {
      return {
        success: false,
        url: null,
        publicId: null,
        message: "Cloudinary not configured",
      };
    }

    if (!Buffer.isBuffer(encryptedBuffer)) {
      throw new Error("Encrypted backup requires a Buffer");
    }

    const publicId =
      "blockdocs_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);

    return await new Promise((resolve) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "blockdocs_encrypted_backups",
          public_id: publicId,
          tags: ["blockdocs", "encrypted", "backup"],
          context: {
            app: "BlockDocs",
            encrypted: "true",
            originalName: String(fileName).substring(0, 100),
          },
        },
        (error, result) => {
          if (error) {
            logger.error("Cloudinary backup failed: " + error.message);
            return resolve({
              success: false,
              url: null,
              publicId: null,
              message: error.message,
            });
          }

          logger.info("Cloudinary backup success: " + result.public_id);
          return resolve({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            createdAt: result.created_at,
            message: "Encrypted backup uploaded",
          });
        }
      );

      stream.end(encryptedBuffer);
    });
  } catch (error) {
    logger.error("Cloudinary backup exception: " + error.message);
    return {
      success: false,
      url: null,
      publicId: null,
      message: error.message,
    };
  }
};

// Delete encrypted backup
const deleteEncryptedBackup = async (publicId) => {
  try {
    if (!publicId) return false;
    const configured = configureCloudinary();
    if (!configured) return false;

    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw",
    });

    logger.info("Cloudinary backup deleted: " + publicId);
    return result.result === "ok" || result.result === "not found";
  } catch (error) {
    logger.error("Cloudinary delete failed: " + error.message);
    return false;
  }
};

// Cloudinary health status
const getCloudinaryStatus = async () => {
  try {
    const configured = configureCloudinary();
    if (!configured) {
      return {
        configured: false,
        status: "not_configured",
        message: "Cloudinary credentials missing in .env",
      };
    }

    const ping = await cloudinary.api.ping();
    return {
      configured: true,
      status: ping.status === "ok" ? "operational" : "degraded",
      message: "Cloudinary encrypted backup service is reachable",
    };
  } catch (error) {
    return {
      configured: true,
      status: "error",
      message: error.message,
    };
  }
};

module.exports = {
  uploadEncryptedBackup,
  deleteEncryptedBackup,
  getCloudinaryStatus,
};
