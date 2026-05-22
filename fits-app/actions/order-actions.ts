/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/order-actions.ts
"use server";

// ✅ Import adminDb for admin operations (server-only)
import { adminDb } from "@/lib/firebase-admin";

// ✅ Import client db for public operations (checkout, tracking)
import { db } from "@/lib/firebase";

// ✅ Import revalidatePath for cache invalidation
import { revalidatePath } from "next/cache";

// ✅ Import types
import { Order, OrderStatus } from "@/lib/types";

// ✅ Import client-side helpers for public actions
import {
  getCollectionInDb,
  getDocById,
  createDoc,
  updateDocById,
  deleteDocById,
} from "@/lib/firebase";

// ✅ Helper: Serialize Timestamp to ISO string (for client props)
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString(); // Firebase Timestamp (client or admin)
  if (ts instanceof Date) return ts.toISOString();
  return null;
};

// --- HELPER: Generate Order Number ---
function generateOrderNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = Math.floor(100 + Math.random() * 900);
  return `MF-${yy}${mm}${dd}-${seq}`;
}

// ============================================================================
// 🛒 PUBLIC ACTIONS (Anonymous Checkout) - Use Client DB + Rules
// ============================================================================

// --- CREATE ORDER (Public Checkout) ---
export async function createOrderAction(orderData: Partial<Order>) {
  console.log("👔 [ACTION] Create Order Workflow Started (Public)");

  const orderNumber = generateOrderNumber();
  console.log("🔢 [ACTION] Generated:", orderNumber);

  const payload = {
    ...orderData,
    orderNumber,
    status: "pending",
    currency: orderData.currency || "KSh",
    createdAt: new Date().toISOString(),
  };

  // ✅ Use client db + Firestore rules (allow create: if true)
  const result = await createDoc("orders", payload);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed");
    return { success: false, error: "Failed to create order" };
  }

  // Revalidate admin paths (admin uses adminDb, but cache still needs invalidation)
  revalidatePath("/admin/orders");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");

  return { success: true, id: result.id, orderNumber };
}

// --- TRACK ORDER (Public) - Uses adminDb for rule bypass + server validation ---
export const trackOrderAction = async (orderNumber: string, phone: string) => {
  console.log(`🔍 [ACTION] Track order: ${orderNumber} + ${phone}`);

  try {
    // ✅ Use adminDb to bypass rules (public users can't query directly)
    const ordersRef = adminDb.collection("orders");
    const query = ordersRef
      .where("orderNumber", "==", orderNumber)
      .where("customerPhone", "==", phone);

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.warn(`⚠️ [ACTION] Order not found: ${orderNumber}`);
      return { success: false, error: "Order not found" };
    }

    // ✅ Server-side validation: phone match already enforced by query
    const doc = snapshot.docs[0];
    const order = {
      id: doc.id,
      ...doc.data(),
      createdAt: serializeTimestamp(doc.data().createdAt),
    } as Order;

    console.log(`✅ [ACTION] Order found: ${orderNumber}`);
    return { success: true, order } as { success: true; order: Order };
  } catch (error) {
    console.error("❌ [ACTION] Track order failed:", error);
    return { success: false, error: "Failed to track order" };
  }
};

// ============================================================================
// 👔 ADMIN ACTIONS - Use adminDb (Bypass Rules)
// ============================================================================

// --- GET ALL ORDERS (Admin) ---
export async function getOrdersAction(): Promise<Order[]> {
  console.log("👔 [ACTION] Fetch All Orders (Admin)");

  try {
    // ✅ Use adminDb to bypass rules
    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef.orderBy("createdAt", "desc").get();

    const orders = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        currency: data.currency || "KSh",
        status: data.status || "pending",
        items: data.items || [],
        createdAt: serializeTimestamp(data.createdAt),
        updatedAt: serializeTimestamp(data.updatedAt),
      } as Order;
    });

    console.log(`✅ [ACTION] Fetched ${orders.length} orders`);
    return orders;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch orders:", error);
    return [];
  }
}

// --- GET SINGLE ORDER BY ID (Admin) ---
export async function getOrderAction(id: string): Promise<Order | null> {
  console.log(`👔 [ACTION] Fetch Order ${id} (Admin)`);

  try {
    // ✅ Use adminDb to bypass rules
    const orderRef = adminDb.collection("orders").doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      console.warn(`⚠️ [ACTION] Order not found: ${id}`);
      return null;
    }

    const data = doc.data();
    const order = {
      id: doc.id,
      ...data,
      currency: data?.currency || "KSh",
      status: data?.status || "pending",
      items: data?.items || [],
      createdAt: serializeTimestamp(data?.createdAt),
      updatedAt: serializeTimestamp(data?.updatedAt),
    } as Order;

    console.log(`✅ [ACTION] Order fetched: ${id}`);
    return order;
  } catch (error) {
    console.error(`❌ [ACTION] Failed to fetch order ${id}:`, error);
    return null;
  }
}

// --- UPDATE STATUS (Admin) ---
export const updateOrderStatusAction = async (
  id: string,
  status: OrderStatus,
  notes?: string,
) => {
  console.log(`👔 [ACTION] Update ${id} → ${status}`);

  // Validation
  const valid: OrderStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];
  if (!valid.includes(status)) {
    return { success: false, error: "Invalid status" };
  }

  try {
    // ✅ Use adminDb to bypass rules
    const orderRef = adminDb.collection("orders").doc(id);

    const updateData: any = {
      status,
      updatedAt: new Date().toISOString(),
    };

    if (notes) {
      updateData.notes = notes;
    }

    await orderRef.update(updateData);

    console.log(`✅ [ACTION] Order ${id} updated to ${status}`);

    // Revalidate admin paths
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to update order ${id}:`, error);
    return { success: false, error: "Update failed" };
  }
};

// --- DELETE ORDER (Admin) ---
export async function deleteOrderAction(id: string) {
  console.log(`🗑️ [ACTION] Delete Order ${id} (Admin)`);

  try {
    // ✅ Use adminDb to bypass rules
    await adminDb.collection("orders").doc(id).delete();

    console.log(`✅ [ACTION] Order ${id} deleted`);

    // Revalidate admin paths
    revalidatePath("/admin/orders");

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to delete order ${id}:`, error);
    return { success: false, error: "Delete failed" };
  }
}

// --- GET CUSTOMERS (Admin - Aggregated from Orders) ---
export const getCustomersAction = async () => {
  console.log("👔 [ACTION] Fetch customers (Admin)");

  try {
    // ✅ Use adminDb to bypass rules
    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef.get();

    // Aggregate by phone number
    const customerMap = new Map<
      string,
      {
        phone: string;
        name: string;
        totalOrders: number;
        totalSpent: number;
        lastOrderDate: string | null;
        locations: Set<string>;
        orderIds: string[];
      }
    >();

    snapshot.docs.forEach((doc) => {
      const order = doc.data();
      const phone = order.customerPhone;
      if (!phone) return;

      const existing = customerMap.get(phone);
      const orderDate = order.createdAt
        ? order.createdAt.toDate?.()?.toISOString() || order.createdAt
        : null;

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.totalAmount || 0;
        existing.locations.add(order.customerLocation);
        existing.orderIds.push(doc.id);

        // Keep most recent name
        if (order.customerName && orderDate) {
          if (!existing.lastOrderDate || orderDate > existing.lastOrderDate) {
            existing.name = order.customerName;
            existing.lastOrderDate = orderDate;
          }
        }
      } else {
        customerMap.set(phone, {
          phone,
          name: order.customerName || "Unknown",
          totalOrders: 1,
          totalSpent: order.totalAmount || 0,
          lastOrderDate: orderDate,
          locations: new Set([order.customerLocation]),
          orderIds: [doc.id],
        });
      }
    });

    // Convert to array + serialize
    const customers = Array.from(customerMap.values()).map((c) => ({
      ...c,
      locations: Array.from(c.locations),
      lastOrderDate: c.lastOrderDate, // Already ISO string
    }));

    console.log(`✅ [ACTION] Aggregated ${customers.length} unique customers`);
    return customers;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch customers:", error);
    return [];
  }
};
