/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/quote-actions.ts
"use server";

// ✅ Import adminDb for admin operations (server-only, bypasses rules)
import { adminDb } from "@/lib/firebase-admin";

// ✅ Import client db for public operations (respects Firestore rules)
import { db } from "@/lib/firebase";

// ✅ Import Firestore methods for client operations
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  updateDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// ✅ Import Next.js utilities
import { revalidatePath } from "next/cache";

// ==========================================
// 🔧 TYPES & HELPERS
// ==========================================

export interface QuoteRequest {
  id?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  organization?: string;
  itemType: string;
  quantity: number;
  timeline?: string;
  details?: string;
  status: "pending" | "contacted" | "quoted" | "converted" | "lost";
  notes?: string;
  createdAt?: any; // Can be Timestamp or ISO string
  updatedAt?: any;
  [key: string]: any;
}

// --- Helper: Serialize Timestamp to ISO string (for client props) ---
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString(); // Firebase Timestamp (client or admin)
  if (ts instanceof Date) return ts.toISOString();
  return null;
};

// --- Helper: Normalize Quote Data ---
const normalizeQuote = (raw: any): QuoteRequest => ({
  ...raw,
  status: raw.status || "pending",
  createdAt: serializeTimestamp(raw.createdAt),
  updatedAt: serializeTimestamp(raw.updatedAt),
});

// ==========================================
// 📝 PUBLIC ACTIONS (Respect Firestore Rules)
// ==========================================

// --- SUBMIT QUOTE REQUEST (Public: /quote page) ---
// ✅ Uses client db + rules: allow create: if true
export const submitQuoteRequest = async (
  data: Omit<QuoteRequest, "id" | "status" | "createdAt" | "updatedAt">,
) => {
  console.log("📝 [ACTION] Submit quote request (Public):", data);

  try {
    const quoteData: Omit<QuoteRequest, "id"> = {
      ...data,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    // ✅ Use client db + Firestore rules (allow create: if true)
    const docRef = await addDoc(collection(db, "quotes"), quoteData);

    console.log("✅ [ACTION] Quote submitted:", docRef.id);

    // Revalidate admin path (admin uses adminDb, but cache still needs invalidation)
    revalidatePath("/admin/quotes");

    return {
      success: true,
      quoteId: docRef.id,
      message:
        "Quote request submitted successfully. We will contact you within 24 hours.",
    };
  } catch (error) {
    console.error("❌ [ACTION] Quote submission failed:", error);
    return {
      success: false,
      error: "Failed to submit quote. Please try again or call us directly.",
    };
  }
};

// ==========================================
// 👔 ADMIN ACTIONS (Use adminDb - Bypass Rules)
// ==========================================

// --- GET ALL QUOTES (Admin: /admin/quotes page) ---
// ✅ Uses adminDb to bypass rules (admin-only read)
export const getQuotesAction = async (): Promise<QuoteRequest[]> => {
  console.log("👔 [ACTION] Fetch all quotes (Admin)");

  try {
    // ✅ Use adminDb directly for admin operations
    const quotesRef = adminDb.collection("quotes");
    const snapshot = await quotesRef.orderBy("createdAt", "desc").get();

    const quotes = snapshot.docs.map((doc) => {
      const data = doc.data();
      return normalizeQuote({
        id: doc.id,
        ...data,
      });
    });

    console.log(`✅ [ACTION] Fetched ${quotes.length} quotes`);
    return quotes;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch quotes:", error);
    return [];
  }
};

// --- UPDATE QUOTE STATUS (Admin Only) ---
// ✅ Uses adminDb to bypass rules
export const updateQuoteStatus = async (
  id: string,
  status: QuoteRequest["status"],
  notes?: string,
) => {
  console.log(`👔 [ACTION] Update quote ${id} → ${status} (Admin)`);

  // Validation
  const validStatuses: QuoteRequest["status"][] = [
    "pending",
    "contacted",
    "quoted",
    "converted",
    "lost",
  ];
  if (!validStatuses.includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    // ✅ Use adminDb directly
    const quoteRef = adminDb.collection("quotes").doc(id);

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await quoteRef.update(updateData);

    console.log("✅ [ACTION] Quote updated:", id);

    // Revalidate admin path
    revalidatePath("/admin/quotes");

    return {
      success: true,
      message: "Quote status updated successfully.",
    };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to update quote ${id}:`, error);
    return {
      success: false,
      error: "Failed to update quote status.",
    };
  }
};
