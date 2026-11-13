import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export function isCloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export interface CloudinaryUploadResult {
  success: boolean;
  url: string;
  publicId?: string;
  width?: number;
  height?: number;
  format?: string;
  bytes?: number;
  error?: string;
}

/**
 * Upload an image (base64 data URL or raw buffer) to Cloudinary
 */
export async function uploadToCloudinary(
  fileData: string | Buffer,
  folder: string = "rangmanch26/payments"
): Promise<CloudinaryUploadResult> {
  if (!isCloudinaryConfigured()) {
    // Graceful fallback for local development without credentials
    if (typeof fileData === "string" && fileData.startsWith("data:")) {
      return {
        success: true,
        url: fileData, // Retain data URL as fallback
        publicId: `local-fallback-${Date.now()}`,
      };
    }
    return {
      success: false,
      url: "",
      error: "Cloudinary credentials not configured in environment variables.",
    };
  }

  try {
    let uploadSource: string;

    if (Buffer.isBuffer(fileData)) {
      uploadSource = `data:image/jpeg;base64,${fileData.toString("base64")}`;
    } else {
      uploadSource = fileData;
    }

    const result: UploadApiResponse = await cloudinary.uploader.upload(uploadSource, {
      folder,
      resource_type: "image",
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
    };
  } catch (err: any) {
    console.error("Cloudinary upload failed:", err);
    return {
      success: false,
      url: "",
      error: err?.message || "Failed to upload image to Cloudinary.",
    };
  }
}

/**
 * Delete an image from Cloudinary by its public ID
 */
export async function deleteFromCloudinary(publicId: string): Promise<boolean> {
  if (!isCloudinaryConfigured()) return false;
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return res.result === "ok";
  } catch (err) {
    console.error("Cloudinary deletion failed:", err);
    return false;
  }
}

export default cloudinary;
