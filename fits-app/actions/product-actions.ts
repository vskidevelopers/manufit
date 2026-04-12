"use server";

// ✅ Import Workers (No direct Firebase imports)
import {
  createProductInDb,
  updateProductInDb,
  deleteProductInDb,
  getCollectionInDb,
} from "@/lib/firebase";

// ✅ Import External Services
import { v2 as cloudinary } from "cloudinary";

// ✅ Import Next.js Utilities
import { revalidatePath } from "next/cache";

// Configure Cloudinary (Server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 🛍️ PRODUCT ACTIONS (BUSINESS LOGIC)
// ==========================================

export async function createProductAction(productData: any) {
  console.log("👔 [ACTION] Create Product Workflow Started");

  // 1. Delegate to DB Worker
  const result = await createProductInDb(productData);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed at DB step");
    return { success: false, error: "Database error" };
  }

  // 2. Refresh UI
  revalidatePath("/admin/products");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");

  return { success: true, id: result.id };
}

export async function updateProductAction(id: string, productData: any) {
  console.log("👔 [ACTION] Update Product Workflow Started for:", id);

  // 1. Delegate to DB Worker
  const result = await updateProductInDb(id, productData);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed at DB step");
    return { success: false, error: "Database error" };
  }

  // 2. Refresh UI
  revalidatePath("/admin/products");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");

  return { success: true };
}

export async function deleteProductAction(id: string, imageUrls: string[]) {
  console.log("👔 [ACTION] Delete Product Workflow Started for:", id);

  // 1. Cloudinary Cleanup (External Service)
  if (imageUrls && imageUrls.length > 0) {
    console.log(`☁️ [ACTION] Cleaning up ${imageUrls.length} images...`);

    const cleanupPromises = imageUrls.map(async (url) => {
      const parts = url.split("/");
      const filename = parts[parts.length - 1];
      const publicId = `manufit/products/${filename.split(".")[0]}`;

      try {
        await cloudinary.uploader.destroy(publicId);
        console.log(`☁️ [ACTION] Destroyed: ${publicId}`);
      } catch (err) {
        console.warn(`⚠️ [ACTION] Failed to destroy ${publicId}`, err);
      }
    });

    await Promise.all(cleanupPromises);
  }

  // 2. Delegate to DB Worker
  const result = await deleteProductInDb(id);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed at DB step");
    return { success: false, error: "Database error" };
  }

  // 3. Refresh UI
  revalidatePath("/admin/products");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");

  return { success: true };
}

export async function getProductsAction() {
  console.log("👔 [ACTION] Fetch Products Workflow Started");
  // Delegate to DB Worker
  return await getCollectionInDb("products");
}
