/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types.ts

// ==========================================
// 🛍️ PRODUCT TYPES
// ==========================================

export interface Product {
  id?: string; // Firestore ID
  name?: string;
  description?: string;
  category?: "t-shirt" | "hoodie" | "kids" | "decor" | "merchandise" | "other";
  basePrice?: number;
  images?: string[]; // Cloudinary URLs
  availableSizes?: string[]; // e.g., ['S', 'M', 'L', 'XL']
  availableColors?: string[]; // e.g., ['Red', 'Blue', 'Black']
  isActive?: boolean;
  createdAt?: any; // Serialized to ISO string
  updatedAt?: any;

  // Future-proof: allow additional fields
  [key: string]: any;
}

// ==========================================
// 📦 NEW LEAN ORDER TYPES
// ==========================================

// 1. Enums for the Dual-Status Architecture
export type FulfillmentMethod = "pickup" | "delivery";
export type PaymentMethod = "pay_now" | "pay_later";

export type FulfillmentStatus =
  | "pending"
  | "processing"
  | "dispatched"
  | "completed"
  | "cancelled";
export type PaymentStatus = "pending" | "paid" | "verified";

// 2. Lean Order Item
// lib/types.ts
export interface OrderItem {
  productId: string;
  name: string;
  image?: string | null;
  category?: string | null;
  size?: string | null;
  color?: string | null;
  quantity: number;
  price: number;
}

// 3. The New Lean Order Interface
export interface Order {
  id: string; // Firestore document ID
  orderNumber: string; // e.g., IDRP-260607-001
  createdAt: string; // ISO string

  // Grouped Customer Data
  customer: {
    name: string;
    phone: string;
    email?: string | null;
  };

  // Items Array
  items: OrderItem[];

  // Lean Totals (No delivery fee math)
  totals: {
    subtotal: number;
    grandTotal: number; // Always equals subtotal in this flow
  };

  // Fulfillment Block
  fulfillment: {
    method: FulfillmentMethod;
    location?: string | null; // Null if method is 'pickup'
    status: FulfillmentStatus;
  };

  // Payment Block
  payment: {
    method: PaymentMethod;
    tillNumber?: string | null; // Null if method is 'pay_later'
    mpesaCode?: string | null; // Null if method is 'pay_later'
    status: PaymentStatus;
  };

  // Optional Admin Notes
  notes?: string | null;

  // Future-proof: allow additional fields without breaking types
  [key: string]: any;
}

// ==========================================
// 👥 CUSTOMER TYPES (Aggregated from Orders)
// ==========================================

export interface Customer {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string | null; // ISO string
  locations: string[];
  orderIds: string[];
  [key: string]: any;
}
