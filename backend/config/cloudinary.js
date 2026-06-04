import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (filePath) => {
//   console.log("[Cloudinary] Called with filePath:", filePath);

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });



  if (!filePath) {
    console.error("[Cloudinary] No file path provided");
    throw new Error("No file path provided");
  }

  try {
  
    const uploadResult = await cloudinary.uploader.upload(filePath);
    

    if (fs.existsSync(filePath)) {
   
      fs.unlinkSync(filePath);
    }

    return uploadResult.secure_url;
  } catch (error) {
    console.error("[Cloudinary] Upload Error:", error); // full error object
    if (fs.existsSync(filePath)) {
      console.log("[Cloudinary] Deleting local file after error:", filePath);
      fs.unlinkSync(filePath);
    }
    throw new Error("Failed to upload image to Cloudinary");
  }
};

export default uploadOnCloudinary;
