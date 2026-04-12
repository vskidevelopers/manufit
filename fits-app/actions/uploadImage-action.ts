"use server";

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImageAction(
  formData: FormData,
): Promise<{ url: string } | { error: string }> {
  console.log("☁️ [SERVER] Upload request received...");

  const file = formData.get("file") as File;
  if (!file) {
    console.warn("⚠️ [SERVER] No file provided in FormData.");
    return { error: "No file provided" };
  }

  console.log(
    `📄 [SERVER] Processing file: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`,
  );

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("⏳ [SERVER] Sending to Cloudinary...");

    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "manufit/products" },
        (error, result) => {
          if (error) {
            console.error("❌ [SERVER] Cloudinary upload error:", error);
            reject(error);
          } else {
            console.log(
              "✅ [SERVER] Cloudinary upload success:",
              result?.secure_url,
            );
            resolve(result);
          }
        },
      );
      uploadStream.end(buffer);
    });

    return { url: result?.secure_url };
  } catch (error) {
    console.error("❌ [SERVER] Upload action failed:", error);
    return { error: "Failed to upload image" };
  }
}
