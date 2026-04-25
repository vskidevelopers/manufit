/* eslint-disable @typescript-eslint/no-explicit-any */
// lib/types.ts
import { Timestamp } from "firebase/firestore";

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
  createdAt?: any; // Firestore Timestamp
}

// ==========================================
// 📦 ORDER TYPES
// ==========================================

export type OrderStatus = "pending" | "processing" | "completed" | "cancelled";

export type PaymentMethod = "mpesa" | "cod"; // Cash on Delivery

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  priceAtPurchase: number;
  size?: string;
  color?: string;

  // Future-proof: allow additional item metadata
  [key: string]: any;
}

export interface OrderNote {
  text: string;
  timestamp: Timestamp | any;
  admin?: string; // Email of admin who added the note
}

export interface Order {
  id?: string; // Firestore document ID

  // Required core fields (should always exist for a valid order)
  orderNumber?: string; // e.g., MF-240413-001
  customerName?: string;
  customerPhone?: string;
  customerLocation?: string; // Gaberone, Accra, Khoja
  items?: OrderItem[];
  totalAmount?: number;
  paymentMethod?: PaymentMethod;
  status?: OrderStatus;

  // Optional but common fields
  currency?: string; // Default to 'KSh' if missing
  notes?: OrderNote[]; // Admin notes array
  adminNotes?: string; // Simple string note (legacy support)

  // Metadata (optional, server-managed)
  createdAt?: Timestamp | any;
  updatedAt?: Timestamp | any;
  mpesaCode?: string;

  // Future-proof: allow additional fields without breaking types
  [key: string]: any;
}

export interface Customer {
  phone: string;
  name: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Timestamp | any;
  locations: string[];
  orderIds: string[];
  [key: string]: any;
}
