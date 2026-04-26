"use server";

import { db } from "@/lib/firebase";
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
import { revalidatePath } from "next/cache";

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
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  [key: string]: any;
}

// --- SUBMIT QUOTE REQUEST (Public) ---
export const submitQuoteRequest = async (
  data: Omit<QuoteRequest, "id" | "status" | "createdAt" | "updatedAt">,
) => {
  console.log("📝 [ACTION] Submit quote request:", data);

  try {
    const quoteData: Omit<QuoteRequest, "id"> = {
      ...data,
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "quotes"), quoteData);

    console.log("✅ [ACTION] Quote submitted:", docRef.id);

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

// --- GET ALL QUOTES (Admin) ---
export const getQuotesAction = async (): Promise<QuoteRequest[]> => {
  console.log("👔 [ACTION] Fetch all quotes");

  try {
    const q = query(collection(db, "quotes"), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    const quotes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QuoteRequest[];

    console.log(`✅ [ACTION] Fetched ${quotes.length} quotes`);
    return quotes;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch quotes:", error);
    return [];
  }
};

// --- UPDATE QUOTE STATUS (Admin) ---
export const updateQuoteStatus = async (
  id: string,
  status: QuoteRequest["status"],
  notes?: string,
) => {
  console.log(`👔 [ACTION] Update quote ${id} → ${status}`);

  try {
    const quoteRef = doc(db, "quotes", id);
    const updateData: any = {
      status,
      updatedAt: Timestamp.now(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await updateDoc(quoteRef, updateData);

    console.log("✅ [ACTION] Quote updated:", id);

    revalidatePath("/admin/quotes");

    return {
      success: true,
      message: "Quote status updated successfully.",
    };
  } catch (error) {
    console.error("❌ [ACTION] Failed to update quote:", error);
    return {
      success: false,
      error: "Failed to update quote status.",
    };
  }
};
