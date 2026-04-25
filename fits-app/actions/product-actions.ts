/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

// ✅ Import Workers (No direct Firebase imports)
import {
  createDoc,
  updateDocById,
  deleteDocById,
  getCollection,
  getDocById,
} from "@/lib/firebase";
import { Product } from "@/lib/types";

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

// --- HELPER: Serialize Timestamps ---
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString();
  if (ts instanceof Date) return ts.toISOString();
  return null;
}; // --- GET SINGLE PRODUCT BY ID ---
export const getProductAction = async (id: string): Promise<Product | null> => {
  console.log(`👔 [ACTION] Fetch product ${id}`);

  const product = await getDocById("products", id);

  if (!product) {
    console.warn(`⚠️ [ACTION] Product ${id} not found`);
    return null;
  }

  // Normalize with defaults + serialize timestamps
  const productData = product as any;
  return {
    ...product,
    currency: "KSh",
    isActive: productData.isActive ?? true,
    images: productData.images || [],
    availableSizes: productData.availableSizes || [],
    availableColors: productData.availableColors || [],
    createdAt: serializeTimestamp(productData.createdAt),
    updatedAt: serializeTimestamp(productData.updatedAt),
  } as Product;
};

export async function createProductAction(productData: any) {
  console.log("👔 [ACTION] Create Product Workflow Started");

  // 1. Delegate to DB Worker
  const result = await createDoc("products", productData);

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
  const result = await updateDocById("products", id, productData);

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
  const result = await deleteDocById("products", id);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed at DB step");
    return { success: false, error: "Database error" };
  }

  // 3. Refresh UI
  revalidatePath("/admin/products");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");

  return { success: true };
}

// actions/product-actions.ts

export async function getProductsAction(): Promise<Product[]> {
  console.log("👔 [ACTION] Fetch products");
  const raw = await getCollection("products");

  // ✅ Serialize: Convert Firebase Timestamps to ISO strings
  return raw.map((p: any) => ({
    ...p,
    currency: p.currency || "KSh",
    isActive: p.isActive ?? true,
    images: p.images || [],
    // Convert Timestamps to plain strings
    createdAt: p.createdAt?.toDate?.()?.toISOString() || null,
    updatedAt: p.updatedAt?.toDate?.()?.toISOString() || null,
  })) as Product[];
}
