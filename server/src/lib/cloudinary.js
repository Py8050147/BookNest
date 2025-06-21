/////////////////////////
// Uploads an image file
/////////////////////////
import { v2 as cloudinary } from "cloudinary"
import fs from 'fs'

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

const uploadImage = async (imagePath) => {

    // Use the uploaded file's name as the asset's public ID and 
    // allow overwriting the asset with new versions


    try {
        // Upload the image
        if (!imagePath) return
        console.log("Uploading file: ", imagePath);
        const response = await cloudinary.uploader.upload(imagePath, {
            resource_type: "auto"
        });
        console.log("file is uploaded on cloudinary ", response.url)
        fs.unlinkSync(imagePath)
        return response;
    } catch (error) {
        fs.unlinkSync(imagePath)
        console.error(error);
    }
};

export { uploadImage }