const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");


// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API,
  api_secret: process.env.CLOUD_SECRET_KEY// Fixed variable name
});

// Cloudinary Storage Setup
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "my_images",
    allowed_formats: ["jpg", "png", "jpeg"], // Use allowed_formats instead of allowedFormats

   // format: async (req, file) => file.mimetype.split("/")[1] || "png",
    
   // format: async (req, file) => "png", // Convert images to PNG (or use file.mimetype)
    },
});

module.exports = { storage, cloudinary };
