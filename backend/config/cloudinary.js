import {v2 as cloudinary } from 'cloudinary'
import fs from 'fs'

const uploadOncloudinary=async (file)=>{
try{
    cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
  });

 const result=await cloudinary.uploader
.upload(file,{
    resource_type:'auto'
})
  return result.secure_url
}
finally{
    if(fs.existsSync(file)){
        fs.unlinkSync(file)
    }
}
}
export default uploadOncloudinary;

export const deleteFromCloudinary = async (mediaUrl, resourceType) => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const mediaPath = new URL(mediaUrl).pathname;
  const uploadIndex = mediaPath.indexOf("/upload/");
  if (uploadIndex === -1) {
    throw new Error("Unable to identify Cloudinary media");
  }

  const pathParts = mediaPath.slice(uploadIndex + "/upload/".length).split("/");
  const versionIndex = pathParts.findIndex(part => /^v\d+$/.test(part));
  const publicIdParts = versionIndex >= 0 ? pathParts.slice(versionIndex + 1) : pathParts;
  const lastPartIndex = publicIdParts.length - 1;
  publicIdParts[lastPartIndex] = publicIdParts[lastPartIndex].replace(/\.[^.]+$/, "");
  const publicId = publicIdParts.join("/");

  if (!publicId) {
    throw new Error("Unable to identify Cloudinary media");
  }

  const result = await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  if (result.result !== "ok" && result.result !== "not found") {
    throw new Error(`Cloudinary media deletion failed: ${result.result}`);
  }
};