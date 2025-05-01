const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
const dotenv = require ("dotenv");
dotenv.config({});

cloudinary.config({
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  cloud_name: process.env.CLOUD_NAME,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "products",
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

const uploadMedia = async (filePath) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(filePath , {
      resource_type: "auto"
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

const upload = multer({storage})

module.exports = { uploadMedia , upload };
