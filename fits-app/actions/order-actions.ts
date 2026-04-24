/* eslint-disable @typescript-eslint/no-explicit-any */
// actions/order-actions.ts
"use server";

import {
  getCollectionInDb,
  getDocById,
  getDocsByField,
  createDoc,
  updateDocById,
  deleteDocById,
} from "@/lib/firebase";

import { revalidatePath } from "next/cache";
import { Order, OrderStatus } from "@/lib/types";

// --- HELPER: Generate Order Number ---
function generateOrderNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const seq = Math.floor(100 + Math.random() * 900);
  return `MF-${yy}${mm}${dd}-${seq}`;
}

// --- CREATE ORDER ---
export async function createOrderAction(orderData: Partial<Order>) {
  console.log("👔 [ACTION] Create Order Workflow Started");

  const orderNumber = generateOrderNumber();
  console.log("🔢 [ACTION] Generated:", orderNumber);

  const payload = {
    ...orderData,
    orderNumber,
    status: "pending",
    currency: orderData.currency || "KSh",
    createdAt: new Date().toISOString(), // Or let Firestore add serverTimestamp
  };

  const result = await createDoc("orders", payload);

  if (!result.success) {
    console.error("👔 [ACTION] Workflow Failed");
    return { success: false, error: "Failed to create order" };
  }

  revalidatePath("/admin/orders");
  console.log("🔄 [ACTION] Path Revalidated. Workflow Complete.");
  return { success: true, id: result.id, orderNumber };
}

// --- GET ALL ORDERS ---
export async function getOrdersAction(): Promise<Order[]> {
  console.log("👔 [ACTION] Fetch All Orders Workflow Started");
  const orders = await getCollectionInDb("orders");

  // Type coercion with defaults for resilience
  return orders.map((order: any) => ({
    ...order,
    currency: order.currency || "KSh",
    status: order.status || "pending",
    items: order.items || [],
  })) as Order[];
}

// --- GET SINGLE ORDER BY ID ---
export async function getOrderAction(id: string): Promise<Order | null> {
  console.log(`👔 [ACTION] Fetch Order ${id} Workflow Started`);
  const order = await getDocById("orders", id);
  return order ? (order as Order) : null;
}

// --- TRACK ORDER (Public) ---
export async function trackOrderAction(orderNumber: string, phone: string) {
  console.log("👔 [ACTION] Track Order Workflow Started");

  if (!orderNumber || !phone) {
    return { success: false, error: "Missing order number or phone" };
  }

  // Use generic query helper
  const orders = (await getDocsByField(
    "orders",
    "orderNumber",
    orderNumber,
    1,
  )) as Order[];

  // Filter by phone in memory (Firestore doesn't allow multiple where on different fields without index)
  const order = orders.find((o) => o?.customerPhone === phone);

  if (!order) {
    return { success: false, error: "Order not found" };
  }

  return { success: true, order: order as Order };
}

// --- UPDATE STATUS ---
export const updateOrderStatusAction = async (
  id: string,
  status: OrderStatus,
) => {
  console.log(`👔 [ACTION] Update ${id} → ${status}`);

  // Validation remains the same
  const valid: OrderStatus[] = [
    "pending",
    "processing",
    "completed",
    "cancelled",
  ];
  if (!valid.includes(status))
    return { success: false, error: "Invalid status" };

  const res = await updateDocById("orders", id, { status });
  if (!res.success) return { success: false, error: "Update failed" };

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${id}`);
  return { success: true };
};

// --- DELETE ORDER ---
export async function deleteOrderAction(id: string) {
  console.log(`🗑️ [ACTION] Delete Order Workflow for ${id}`);

  const result = await deleteDocById("orders", id);

  if (!result.success) {
    return { success: false, error: "Delete failed" };
  }

  revalidatePath("/admin/orders");
  console.log("🔄 [ACTION] Path Revalidated.");

  return { success: true };
}

export const getCustomersAction = async () => {
  console.log("👔 [ACTION] Fetch customers workflow started");

  const orders = await getCollectionInDb("orders");

  // Aggregate by phone number
  const customerMap = new Map<
    string,
    {
      phone: string;
      name: string;
      totalOrders: number;
      totalSpent: number;
      lastOrderDate: any;
      locations: Set<string>;
      orderIds: string[];
    }
  >();

  orders.forEach((order: any) => {
    const phone = order.customerPhone;
    if (!phone) return;

    const existing = customerMap.get(phone);

    if (existing) {
      existing.totalOrders += 1;
      existing.totalSpent += order.totalAmount || 0;
      existing.locations.add(order.customerLocation);
      existing.orderIds.push(order.id);

      // Keep most recent name
      if (order.customerName && order.createdAt) {
        const lastDate =
          existing.lastOrderDate?.toDate?.() || existing.lastOrderDate;
        const newDate = order.createdAt?.toDate?.() || order.createdAt;
        if (newDate > lastDate) {
          existing.name = order.customerName;
          existing.lastOrderDate = order.createdAt;
        }
      }
    } else {
      customerMap.set(phone, {
        phone,
        name: order.customerName || "Unknown",
        totalOrders: 1,
        totalSpent: order.totalAmount || 0,
        lastOrderDate: order.createdAt,
        locations: new Set([order.customerLocation]),
        orderIds: [order.id],
      });
    }
  });

  // Convert to array
  const customers = Array.from(customerMap.values()).map((c) => ({
    ...c,
    locations: Array.from(c.locations),
  }));

  console.log(`✅ [ACTION] Aggregated ${customers.length} unique customers`);
  return customers;
};
