/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/order-actions.ts
"use server";

// ✅ Import adminDb for admin operations (server-only)
import { adminDb } from "@/lib/firebase-admin";

// ✅ Import revalidatePath for cache invalidation
import { revalidatePath } from "next/cache";

// ✅ Import new types
import { Order, FulfillmentStatus, PaymentStatus } from "@/lib/types";

// ============================================================================
// 🔧 HELPERS
// ============================================================================

// ✅ Helper: Serialize Timestamp to ISO string (for client props)
const serializeTimestamp = (ts: any): string | null => {
  if (!ts) return null;
  if (typeof ts === "string") return ts;
  if (ts.toDate) return ts.toDate().toISOString(); // Firebase Timestamp (client or admin)
  if (ts instanceof Date) return ts.toISOString();
  return null;
};

// ✅ Helper: Normalize Firestore order doc to plain, serializable Order object (New Lean Schema)
const normalizeOrder = (id: string, data: any): Order => ({
  id,
  orderNumber: data.orderNumber,
  createdAt: serializeTimestamp(data.createdAt) || new Date().toISOString(),

  customer: {
    name: data.customer?.name || "Unknown",
    phone: data.customer?.phone || "",
    email: data.customer?.email || null,
  },

  items:
    data.items?.map((item: any) => ({
      productId: item.productId,
      name: item.name || item.productName, 
      quantity: item.quantity || 1,
      size: item.size || null,
      color: item.color || null,
      price: item.price || item.priceAtPurchase || 0, 
      image: item.image || null,
    category: item.category || null,
    })) || [],

  totals: {
    subtotal: data.totals?.subtotal || data.totalAmount || 0,
    grandTotal: data.totals?.grandTotal || data.totalAmount || 0,
  },

  fulfillment: {
    method: data.fulfillment?.method || "pickup",
    location: data.fulfillment?.location || null,
    status: (data.fulfillment?.status as FulfillmentStatus) || "pending",
  },

  payment: {
    method: data.payment?.method || "pay_later",
    tillNumber: data.payment?.tillNumber || null,
    mpesaCode: data.payment?.mpesaCode || null,
    status: (data.payment?.status as PaymentStatus) || "pending",
  },

  notes: data.notes || null,
});

// --- HELPER: Generate Order Number ---
function generateOrderNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = Math.floor(100 + Math.random() * 900);
  return `IDRP-${yy}${mm}${dd}-${seq}`;
}

// ============================================================================
// 🛒 PUBLIC ACTIONS (Anonymous Checkout)
// ============================================================================

// --- CREATE ORDER (Public Checkout) ---
export async function createOrderAction(orderData: {
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  fulfillmentMethod: "pickup" | "delivery";
  location?: string | null;
  paymentMethod: "pay_now" | "pay_later";
  mpesaCode?: string | null;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    size?: string | null;
    color?: string | null;
    price: number;
  }>;
  totalAmount: number;
}) {
  console.log("👔 [ACTION] Create Order Workflow Started (Lean Schema)");

  try {
    const orderNumber = generateOrderNumber();
    console.log("🔢 [ACTION] Generated:", orderNumber);

    const ordersRef = adminDb.collection("orders");

    // Build the lean payload matching our new types.ts
    const payload = {
      orderNumber,
      createdAt: new Date().toISOString(),

      customer: {
        name: orderData.customerName.trim(),
        phone: orderData.customerPhone.trim(),
        email: orderData.customerEmail || null,
      },

      items: orderData.items,

      totals: {
        subtotal: orderData.totalAmount,
        grandTotal: orderData.totalAmount, // Zero delivery fee logic
      },

      fulfillment: {
        method: orderData.fulfillmentMethod,
        location:
          orderData.fulfillmentMethod === "delivery"
            ? orderData.location
            : null,
        status: "pending",
      },

      payment: {
        method: orderData.paymentMethod,
        // Only add tillNumber and mpesaCode if they chose Pay Now
        ...(orderData.paymentMethod === "pay_now" && {
          tillNumber: "1111111", // Your hardcoded Till Number
          mpesaCode: orderData.mpesaCode,
        }),
        status: "pending",
      },
    };

    const docRef = await ordersRef.add(payload);
    console.log("✅ [ACTION] Order created:", docRef.id);

    revalidatePath("/admin/orders");

    return {
      success: true,
      id: docRef.id,
      orderNumber,
    };
  } catch (error) {
    console.error("❌ [ACTION] Order creation failed:", error);
    return {
      success: false,
      error: "Failed to create order. Please try again or contact support.",
    };
  }
}

// --- TRACK ORDER (Public) ---
export const trackOrderAction = async (orderNumber: string, phone: string) => {
  console.log(`🔍 [ACTION] Track order: ${orderNumber} + ${phone}`);

  try {
    // ✅ Use adminDb to bypass rules
    const ordersRef = adminDb.collection("orders");
    const query = ordersRef
      .where("orderNumber", "==", orderNumber)
      .where("customer.phone", "==", phone); // Updated path for nested schema

    const snapshot = await query.get();

    if (snapshot.empty) {
      console.warn(`⚠️ [ACTION] Order not found: ${orderNumber}`);
      return { success: false, error: "Order not found" };
    }

    // ✅ Normalize the order to a plain, serializable object
    const doc = snapshot.docs[0];
    const order = normalizeOrder(doc.id, doc.data());

    console.log(`✅ [ACTION] Order found: ${order.orderNumber}`);
    return { success: true, order };
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
    const ordersRef = adminDb.collection("orders");
    const snapshot = await ordersRef.orderBy("createdAt", "desc").get();

    const orders = snapshot.docs.map((doc) =>
      normalizeOrder(doc.id, doc.data()),
    );

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
    const orderRef = adminDb.collection("orders").doc(id);
    const doc = await orderRef.get();

    if (!doc.exists) {
      console.warn(`⚠️ [ACTION] Order not found: ${id}`);
      return null;
    }

    const order = normalizeOrder(doc.id, doc.data());
    console.log(`✅ [ACTION] Order fetched: ${id}`);
    return order;
  } catch (error) {
    console.error(`❌ [ACTION] Failed to fetch order ${id}:`, error);
    return null;
  }
}

// --- UPDATE FULFILLMENT STATUS (Admin) ---
export const updateFulfillmentStatusAction = async (
  id: string,
  status: FulfillmentStatus,
) => {
  console.log(`👔 [ACTION] Update Fulfillment ${id} → ${status}`);

  const valid: FulfillmentStatus[] = [
    "pending",
    "processing",
    "dispatched",
    "completed",
    "cancelled",
  ];
  if (!valid.includes(status)) {
    return { success: false, error: "Invalid fulfillment status" };
  }

  try {
    const orderRef = adminDb.collection("orders").doc(id);
    await orderRef.update({
      "fulfillment.status": status,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ [ACTION] Order ${id} fulfillment updated to ${status}`);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to update fulfillment ${id}:`, error);
    return { success: false, error: "Update failed" };
  }
};

// --- UPDATE PAYMENT STATUS (Admin) ---
export const updatePaymentStatusAction = async (
  id: string,
  status: PaymentStatus,
) => {
  console.log(`👔 [ACTION] Update Payment ${id} → ${status}`);

  const valid: PaymentStatus[] = ["pending", "paid", "verified"];
  if (!valid.includes(status)) {
    return { success: false, error: "Invalid payment status" };
  }

  try {
    const orderRef = adminDb.collection("orders").doc(id);
    await orderRef.update({
      "payment.status": status,
      updatedAt: new Date().toISOString(),
    });

    console.log(`✅ [ACTION] Order ${id} payment updated to ${status}`);
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${id}`);

    return { success: true };
  } catch (error) {
    console.error(`❌ [ACTION] Failed to update payment ${id}:`, error);
    return { success: false, error: "Update failed" };
  }
};

// --- DELETE ORDER (Admin) ---
export async function deleteOrderAction(id: string) {
  console.log(`🗑️ [ACTION] Delete Order ${id} (Admin)`);

  try {
    await adminDb.collection("orders").doc(id).delete();
    console.log(`✅ [ACTION] Order ${id} deleted`);
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
      const phone = order.customer?.phone;
      if (!phone) return;

      const existing = customerMap.get(phone);
      const orderDate = serializeTimestamp(order.createdAt);

      if (existing) {
        existing.totalOrders += 1;
        existing.totalSpent += order.totals?.grandTotal || 0;
        if (order.fulfillment?.location) {
          existing.locations.add(order.fulfillment.location);
        }
        existing.orderIds.push(doc.id);

        // Keep most recent name
        if (order.customer?.name && orderDate) {
          if (!existing.lastOrderDate || orderDate > existing.lastOrderDate) {
            existing.name = order.customer.name;
            existing.lastOrderDate = orderDate;
          }
        }
      } else {
        customerMap.set(phone, {
          phone,
          name: order.customer?.name || "Unknown",
          totalOrders: 1,
          totalSpent: order.totals?.grandTotal || 0,
          lastOrderDate: orderDate,
          locations: new Set(
            order.fulfillment?.location ? [order.fulfillment.location] : [],
          ),
          orderIds: [doc.id],
        });
      }
    });

    // Convert to array + serialize
    const customers = Array.from(customerMap.values()).map((c) => ({
      ...c,
      locations: Array.from(c.locations),
    }));

    console.log(`✅ [ACTION] Aggregated ${customers.length} unique customers`);
    return customers;
  } catch (error) {
    console.error("❌ [ACTION] Failed to fetch customers:", error);
    return [];
  }
};
