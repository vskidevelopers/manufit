// lib/firebase-admin.ts
import * as admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    // ✅ Parse raw JSON string directly (no base64 decoding needed)
    const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
      ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
      : undefined;

    if (!serviceAccount) {
      throw new Error(
        "Missing FIREBASE_SERVICE_ACCOUNT_KEY in environment variables",
      );
    }

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });

    console.log("✅ [FIREBASE-ADMIN] Initialized successfully");
  } catch (error) {
    console.error("❌ [FIREBASE-ADMIN] Initialization failed:", error);
    throw error;
  }
}

export const adminDb = admin.firestore();
export const adminAuth = admin.auth();
