// actions/dashboard-actions.ts
"use server";

import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

// ✅ Helper: Serialize Timestamp to ISO string
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts; // Already serialized
  if (ts.toDate) return ts.toDate().toISOString(); // Firebase Timestamp
  if (ts instanceof Date) return ts.toISOString(); // Native Date
  return null;
};

export interface DashboardStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  todayRevenue: number;
  totalProducts: number;
  activeProducts: number;
  pendingQuotes: number;
  recentOrders: Array<{
    id: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    status: string;
    createdAt: string | null; // ✅ String, not Timestamp
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  console.log("📊 [ACTION] Fetching dashboard stats");

  try {
    // --- Orders Stats ---
    const ordersRef = collection(db, "orders");

    // Total orders
    const allOrdersSnapshot = await getDocs(ordersRef);
    const totalOrders = allOrdersSnapshot.size;

    // Pending orders
    const pendingQuery = query(ordersRef, where("status", "==", "pending"));
    const pendingSnapshot = await getDocs(pendingQuery);
    const pendingOrders = pendingSnapshot.size;

    // Completed orders (for revenue calc)
    const completedQuery = query(ordersRef, where("status", "==", "completed"));
    const completedSnapshot = await getDocs(completedQuery);

    // Today's revenue (completed orders today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayRevenue = 0;
    completedSnapshot.docs.forEach((doc) => {
      const order = doc.data();
      const orderDate =
        order.createdAt?.toDate?.() || new Date(order.createdAt);
      if (orderDate >= today && order.totalAmount) {
        todayRevenue += order.totalAmount;
      }
    });

    // --- Products Stats ---
    const productsRef = collection(db, "products");
    const productsSnapshot = await getDocs(productsRef);
    const totalProducts = productsSnapshot.size;
    const activeProducts = productsSnapshot.docs.filter(
      (doc) => doc.data().isActive !== false,
    ).length;

    // --- Quotes Stats ---
    const quotesRef = collection(db, "quotes");
    const pendingQuotesQuery = query(
      quotesRef,
      where("status", "==", "pending"),
    );
    const pendingQuotesSnapshot = await getDocs(pendingQuotesQuery);
    const pendingQuotes = pendingQuotesSnapshot.size;

    // --- Recent Orders (last 5) - ✅ SERIALIZED ---
    const recentOrdersQuery = query(
      ordersRef,
      orderBy("createdAt", "desc"),
      limit(5),
    );
    const recentOrdersSnapshot = await getDocs(recentOrdersQuery);

    // ✅ Map and serialize each order
    const recentOrders = recentOrdersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        totalAmount: data.totalAmount || 0,
        status: data.status || "unknown",
        // ✅ Convert Timestamp to ISO string
        createdAt: serializeTimestamp(data.createdAt),
      };
    });

    console.log("✅ [ACTION] Dashboard stats fetched");

    return {
      totalOrders,
      pendingOrders,
      completedOrders: completedSnapshot.size,
      todayRevenue,
      totalProducts,
      activeProducts,
      pendingQuotes,
      recentOrders, // ✅ Now contains plain objects only
    };
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch dashboard stats:", error);
    return {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      todayRevenue: 0,
      totalProducts: 0,
      activeProducts: 0,
      pendingQuotes: 0,
      recentOrders: [],
    };
  }
};
