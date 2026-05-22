/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

// ✅ Import adminDb (server-only)
import { adminDb } from "@/lib/firebase-admin";

// ✅ Helper: Serialize Timestamp to ISO string (still needed for client props)
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  // This check handles both client-side and Admin SDK Timestamp objects,
  // as both have a .toDate() method.
  if (ts.toDate) return ts.toDate().toISOString();
  if (ts instanceof Date) return ts.toISOString();
  // The problematic line 'if (ts instanceof adminDb.Timestamp)' has been removed
  // because adminDb is a Firestore instance, not the admin namespace itself,
  // and the check 'if (ts.toDate)' already covers this case robustly.
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
    createdAt: string | null;
  }>;
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  console.log("📊 [ACTION] Fetching dashboard stats (adminDb)");

  try {
    // --- Orders Stats ---
    // ✅ Get a collection reference from adminDb
    const ordersRef = adminDb.collection("orders");

    // Total orders
    const allOrdersSnapshot = await ordersRef.get(); // ✅ Use .get() directly on the collection reference
    const totalOrders = allOrdersSnapshot.size;

    // Pending orders
    // ✅ Chain .where() directly on the collection reference
    const pendingQuery = ordersRef.where("status", "==", "pending");
    const pendingSnapshot = await pendingQuery.get();
    const pendingOrders = pendingSnapshot.size;

    // Completed orders (for revenue calc)
    // ✅ Chain .where() directly on the collection reference
    const completedQuery = ordersRef.where("status", "==", "completed");
    const completedSnapshot = await completedQuery.get();

    // Today's revenue (completed orders today)
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let todayRevenue = 0;
    completedSnapshot.docs.forEach((doc) => {
      const order = doc.data();
      // ✅ Adjust Timestamp conversion. The serializeTimestamp handles the conversion
      // For direct comparison, ensure order.createdAt is converted to a Date object first.
      const orderCreatedAt = order.createdAt;
      const orderDate =
        orderCreatedAt && orderCreatedAt.toDate
          ? orderCreatedAt.toDate()
          : orderCreatedAt instanceof Date
            ? orderCreatedAt
            : new Date(orderCreatedAt); // Fallback if it's a string, though serializeTimestamp should handle this.

      if (orderDate >= today && order.totalAmount) {
        todayRevenue += order.totalAmount;
      }
    });

    // --- Products Stats ---
    const productsRef = adminDb.collection("products"); // ✅ adminDb
    const productsSnapshot = await productsRef.get();
    const totalProducts = productsSnapshot.size;
    const activeProducts = productsSnapshot.docs.filter(
      (doc) => doc.data().isActive !== false,
    ).length;

    // --- Quotes Stats ---
    const quotesRef = adminDb.collection("quotes"); // ✅ adminDb
    // ✅ Chain .where() directly on the collection reference
    const pendingQuotesQuery = quotesRef.where("status", "==", "pending");
    const pendingQuotesSnapshot = await pendingQuotesQuery.get();
    const pendingQuotes = pendingQuotesSnapshot.size;

    // --- Recent Orders (last 5) - ✅ SERIALIZED ---
    // ✅ Chain .orderBy() and .limit() directly on the collection reference
    const recentOrdersQuery = ordersRef.orderBy("createdAt", "desc").limit(5);
    const recentOrdersSnapshot = await recentOrdersQuery.get();

    // ✅ Map and serialize each order
    const recentOrders = recentOrdersSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        orderNumber: data.orderNumber,
        customerName: data.customerName,
        totalAmount: data.totalAmount || 0,
        status: data.status || "unknown",
        // ✅ Convert Timestamp to ISO string for client
        createdAt: serializeTimestamp(data.createdAt),
      };
    });

    console.log("✅ [ACTION] Dashboard stats fetched (adminDb)");

    return {
      totalOrders,
      pendingOrders,
      completedOrders: completedSnapshot.size,
      todayRevenue,
      totalProducts,
      activeProducts,
      pendingQuotes,
      recentOrders,
    };
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch dashboard stats:", error);
    // Return safe defaults on error
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
