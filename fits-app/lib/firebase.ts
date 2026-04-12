// lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";

// --- CONFIGURATION ---
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// --- INITIALIZATION ---
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ==========================================
// 🔐 AUTHENTICATION WORKERS
// ==========================================

export const loginUser = async (email: string, password: string) => {
  console.log("🔐 [DB-AUTH] Login attempt:", email);
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    console.log("✅ [DB-AUTH] Login success:", result.user.uid);
    return result;
  } catch (error: any) {
    console.error("❌ [DB-AUTH] Login failed:", error.code);
    throw error;
  }
};

export const logoutUser = async () => {
  console.log("👋 [DB-AUTH] Logout initiated");
  try {
    await signOut(auth);
    console.log("✅ [DB-AUTH] Logout success");
  } catch (error: any) {
    console.error("❌ [DB-AUTH] Logout failed:", error);
    throw error;
  }
};

export const subscribeToAuthChanges = (
  callback: (user: User | null) => void,
) => {
  return onAuthStateChanged(auth, (user) => {
    if (user) console.log("🟢 [DB-AUTH] User active:", user.email);
    else console.log("🔴 [DB-AUTH] User inactive");
    callback(user);
  });
};

// ==========================================
// 💾 DATABASE WORKERS (GENERIC READS)
// ==========================================

export const getCollectionInDb = async (collectionName: string) => {
  console.log(`📥 [DB-CORE] Fetching: ${collectionName}`);
  try {
    const snapshot = await getDocs(collection(db, collectionName));
    const data = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(
      `✅ [DB-CORE] Fetched ${data.length} items from ${collectionName}`,
    );
    return data;
  } catch (error) {
    console.error(`❌ [DB-CORE] Fetch failed: ${collectionName}`, error);
    throw error;
  }
};

// ==========================================
// 🛍️ DATABASE WORKERS (PRODUCT SPECIFIC)
// ==========================================

export const createProductInDb = async (productData: any) => {
  console.log("💾 [DB-PROD] Creating product...", productData.name);
  try {
    const docRef = await addDoc(collection(db, "products"), {
      ...productData,
      createdAt: serverTimestamp(),
    });
    console.log("✅ [DB-PROD] Created ID:", docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("❌ [DB-PROD] Create failed", error);
    return { success: false, error };
  }
};

export const updateProductInDb = async (id: string, data: any) => {
  console.log("✏️ [DB-PROD] Updating ID:", id);
  try {
    await updateDoc(doc(db, "products", id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log("✅ [DB-PROD] Updated ID:", id);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB-PROD] Update failed", error);
    return { success: false, error };
  }
};

export const deleteProductInDb = async (id: string) => {
  console.log("🗑️ [DB-PROD] Deleting ID:", id);
  try {
    await deleteDoc(doc(db, "products", id));
    console.log("✅ [DB-PROD] Deleted ID:", id);
    return { success: true };
  } catch (error) {
    console.error("❌ [DB-PROD] Delete failed", error);
    return { success: false, error };
  }
};
