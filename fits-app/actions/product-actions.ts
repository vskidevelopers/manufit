/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/product-actions.ts
"use server";

// ✅ Import adminDb for admin operations (server-only, bypasses rules)
import { adminDb } from "@/lib/firebase-admin";

// ✅ Import client helpers for public operations (respects Firestore rules)
import { getCollectionInDb, getDocById } from "@/lib/firebase";

// ✅ Import types
import { Product } from "@/lib/types";

// ✅ Import Cloudinary for image cleanup (server-only)
import { v2 as cloudinary } from "cloudinary";

// ✅ Import Next.js utilities
import { revalidatePath } from "next/cache";

// Configure Cloudinary (Server-side only)
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ==========================================
// 🔧 HELPERS
// ==========================================

// --- Helper: Serialize Timestamps for Client Props ---
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString(); // Firebase Timestamp (client or admin)
  if (ts instanceof Date) return ts.toISOString();
  return null;
};

// --- Helper: Normalize Product Data ---
const normalizeProduct = (raw: any): Product => ({
  ...raw,
  currency: raw.currency || "KSh",
  isActive: raw.isActive ?? true,
  images: raw.images || [],
  availableSizes: raw.availableSizes || [],
  availableColors: raw.availableColors || [],
  createdAt: serializeTimestamp(raw.createdAt),
  updatedAt: serializeTimestamp(raw.updatedAt),
});

// ==========================================
// 🛍️ PUBLIC ACTIONS (Respect Firestore Rules)
// ==========================================

// --- GET ALL PRODUCTS (Public: /shop page) ---
// ✅ Now uses adminDb - server action controls access, not Firestore rules
export async function getProductsAction(): Promise<Product[]> {
  console.log("👔 [ACTION] Fetch products (Public, adminDb)");

  try {
    // ✅ Use adminDb directly - bypasses rules, reliable server connection
    const productsRef = adminDb.collection("products");
    const snapshot = await productsRef
      .where("isActive", "==", true) // ✅ Only fetch active products
      .get();

    const products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return normalizeProduct({
        id: doc.id,
        ...data,
      });
    });

    console.log(`✅ [ACTION] Fetched ${products.length} active products`);
    return products;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch products:", error);
    return [];
  }
}

// --- GET SINGLE PRODUCT (Public: /product/[id] page) ---
// ✅ Now uses adminDb - server action controls access
export const getProductAction = async (id: string): Promise<Product | null> => {
  console.log(`👔 [ACTION] Fetch product ${id} (Public, adminDb)`);

  try {
    // ✅ Use adminDb directly
    const productRef = adminDb.collection("products").doc(id);
    const doc = await productRef.get();

    if (!doc.exists) {
      console.warn(`⚠️ [ACTION] Product ${id} not found`);
      return null;
    }

    const data = doc.data();

    // ✅ Optional: Check isActive before returning (soft delete)
    if (data?.isActive === false) {
      console.warn(`⚠️ [ACTION] Product ${id} is inactive`);
      return null;
    }

    return normalizeProduct({
      id: doc.id,
      ...data,
    });
  } catch (error) {
    console.error(`❌ [ACTION] Failed to fetch product ${id}:`, error);
    return null;
  }
};

// ==========================================
// 👔 ADMIN ACTIONS (Use adminDb - Bypass Rules)
// ==========================================

// --- CREATE PRODUCT (Admin Only) ---
// ✅ Uses adminDb to bypass rules (admin-only write)
export async function createProductAction(productData: any) {
  console.log("👔 [ACTION] Create Product (Admin)");

  try {
    // ✅ Use adminDb directly for admin operations
    const productsRef = adminDb.collection("products");
    const docRef = await productsRef.add({
      ...productData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ [ACTION] Product created: ${docRef.id}`);

    // Revalidate admin + public paths
    revalidatePath("/admin/products");
    revalidatePath("/shop"); // Refresh product list for public

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ [ACTION] Failed to create product:", error);
    return { success: false, error: "Database error" };
  }
}

// --- UPDATE PRODUCT (Admin Only) ---
// ✅ Uses adminDb to bypass rules
export async function updateProductAction(id: string, productData: any) {
  console.log(`👔 [ACTION] Update Product ${id} (Admin)`);

  try {
    // ✅ Use adminDb directly
    const productRef = adminDb.collection("products").doc(id);

    await productRef.update({
      ...productData,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ [ACTION] Product updated: ${id}`);

    // Revalidate paths
    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidatePath(`/product/${id}`); // Refresh product detail page

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to update product ${id}:`, error);
    return { success: false, error: "Update failed" };
  }
}

// --- DELETE PRODUCT (Admin Only) ---
// ✅ Uses adminDb + Cloudinary cleanup
export async function deleteProductAction(id: string, imageUrls: string[]) {
  console.log(`👔 [ACTION] Delete Product ${id} (Admin)`);

  try {
    // 1. Cloudinary Cleanup (External Service)
    if (imageUrls && imageUrls.length > 0) {
      console.log(`☁️ [ACTION] Cleaning up ${imageUrls.length} images...`);

      const cleanupPromises = imageUrls.map(async (url) => {
        try {
          // Extract public_id from Cloudinary URL
          const urlParts = url.split("/");
          const filename = urlParts[urlParts.length - 1];
          const publicId = `manufit/products/${filename.split(".")[0]}`;

          await cloudinary.uploader.destroy(publicId);
          console.log(`☁️ [ACTION] Destroyed: ${publicId}`);
        } catch (err) {
          console.warn(`⚠️ [ACTION] Failed to destroy image: ${url}`, err);
          // Continue even if one image fails
        }
      });

      await Promise.all(cleanupPromises);
    }

    // 2. Delete from Firestore using adminDb
    await adminDb.collection("products").doc(id).delete();

    console.log(`✅ [ACTION] Product deleted: ${id}`);

    // Revalidate paths
    revalidatePath("/admin/products");
    revalidatePath("/shop");

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to delete product ${id}:`, error);
    return { success: false, error: "Delete failed" };
  }
}
