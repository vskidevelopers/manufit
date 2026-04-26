// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/CartContext";
import { ConditionalLayout } from "@/components/layout/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ManuFit | Custom Apparel & Branded Merchandise",
  description: "Quality custom t-shirts, hoodies, kids wear, office décor, and branded merchandise. Kenya-wide delivery.",
};

// ✅ Root Layout (Server Component - NO 'use client')
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <AuthProvider>
          <CartProvider>
            {/* Client component handles conditional Navbar/Footer */}
            <ConditionalLayout>{children}</ConditionalLayout>
            <Toaster position="top-right" richColors closeButton duration={4000} />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}