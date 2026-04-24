/* eslint-disable @typescript-eslint/no-explicit-any */
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
  getDoc,
  query,
  where,
  limit,
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
    console.error("❌ [DB-AUTH] Login failed:", error);
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
    console.log("data from firebase firestore >>> ", data);
    return data;
  } catch (error) {
    console.error(`❌ [DB-CORE] Fetch failed: ${collectionName}`, error);
    throw error;
  }
};

// --- GENERIC CRUD ---
export const createDoc = async (col: string, data: any) => {
  console.log(`💾 [DB] Create in ${col}:`, data);
  try {
    const ref = await addDoc(collection(db, col), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log(`✅ [DB] Created ${col}/${ref.id}`);
    return { success: true, id: ref.id };
  } catch (e) {
    console.error(`❌ [DB] Create failed ${col}:`, e);
    return { success: false, error: e };
  }
};

export const getCollection = async (col: string) => {
  console.log(`📥 [DB] Fetch ${col}`);
  try {
    const snap = await getDocs(collection(db, col));
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`✅ [DB] Fetched ${data.length} from ${col}`);
    return data;
  } catch (e) {
    console.error(`❌ [DB] Fetch failed ${col}:`, e);
    throw e;
  }
};

export const getDocById = async (col: string, id: string) => {
  console.log(`🔍 [DB] Get ${col}/${id}`);
  try {
    const snap = await getDoc(doc(db, col, id));
    if (!snap.exists()) {
      console.warn(`⚠️ [DB] Not found: ${col}/${id}`);
      return null;
    }
    const data = { id: snap.id, ...snap.data() };
    console.log(`✅ [DB] Retrieved:`, data);
    return data;
  } catch (e) {
    console.error(`❌ [DB] Get failed ${col}/${id}:`, e);
    throw e;
  }
};

export const getDocsByField = async (
  col: string,
  field: string,
  value: any,
  limitCount?: number,
) => {
  console.log(`🔍 [DB] Query ${col} where ${field}==${value}`);
  try {
    const q = query(
      collection(db, col),
      where(field, "==", value),
      ...(limitCount ? [limit(limitCount)] : []),
    );
    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    console.log(`✅ [DB] Found ${data.length} matches`);
    return data;
  } catch (e) {
    console.error(`❌ [DB] Query failed ${col}.${field}:`, e);
    throw e;
  }
};

export const updateDocById = async (col: string, id: string, data: any) => {
  console.log(`✏️ [DB] Update ${col}/${id}:`, data);
  try {
    await updateDoc(doc(db, col, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log(`✅ [DB] Updated ${col}/${id}`);
    return { success: true };
  } catch (e) {
    console.error(`❌ [DB] Update failed ${col}/${id}:`, e);
    return { success: false, error: e };
  }
};

export const deleteDocById = async (col: string, id: string) => {
  console.log(`🗑️ [DB] Delete ${col}/${id}`);
  try {
    await deleteDoc(doc(db, col, id));
    console.log(`✅ [DB] Deleted ${col}/${id}`);
    return { success: true };
  } catch (e) {
    console.error(`❌ [DB] Delete failed ${col}/${id}:`, e);
    return { success: false, error: e };
  }
};
