// lib/types.ts

export interface Product {
  id?: string; // Firestore ID
  name: string;
  description: string;
  category: "t-shirt" | "hoodie" | "kids" | "decor" | "merchandise" | "other";
  basePrice: number;
  images: string[]; // Cloudinary URLs
  availableSizes: string[]; // e.g., ['S', 'M', 'L', 'XL']
  availableColors: string[]; // e.g., ['Red', 'Blue', 'Black']
  isActive: boolean;
  createdAt: any; // Firestore Timestamp
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  size?: string;
  color?: string;
  priceAtPurchase: number;
}

export interface Order {
  id?: string;
  orderNumber: string; // e.g., MF-231024-001
  customerName: string;
  customerPhone: string;
  customerLocation: string; // Gaberone, Accra, Khoja
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: "mpesa" | "cod";
  status: "pending" | "processing" | "completed" | "cancelled";
  createdAt: any;
}
