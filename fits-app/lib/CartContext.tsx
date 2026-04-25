
'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

export interface CartItem {
    cartId: string; // Unique cart item ID (for removal)
    productId: string;
    productName: string;
    category?: string;
    quantity: number;
    size?: string;
    color?: string;
    unitPrice: number;
    totalPrice: number;
    currency: string;
    image?: string;
    addedAt: string;
}

interface CartContextType {
    items: CartItem[];
    addItem: (item: Omit<CartItem, 'cartId' | 'addedAt' | 'totalPrice'>) => void;
    removeItem: (cartId: string) => void;
    updateQuantity: (cartId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = 'manufit_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    // Load cart from localStorage on mount
    useEffect(() => {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                const parsed = JSON.parse(stored);
                setItems(Array.isArray(parsed) ? parsed : []);
            }
        } catch (error) {
            console.error('❌ [CART] Failed to load cart from localStorage:', error);
        } finally {
            setIsLoaded(true);
        }
    }, []);

    // Save cart to localStorage on change
    useEffect(() => {
        if (!isLoaded) return;
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (error) {
            console.error('❌ [CART] Failed to save cart to localStorage:', error);
        }
    }, [items, isLoaded]);

    // Generate unique cart item ID
    const generateCartId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Add item to cart
    const addItem = useCallback((item: Omit<CartItem, 'cartId' | 'addedAt' | 'totalPrice'>) => {
        const cartId = generateCartId();
        const addedAt = new Date().toISOString();
        const totalPrice = (item.unitPrice ?? 0) * (item.quantity ?? 1);

        const newItem: CartItem = {
            ...item,
            cartId,
            addedAt,
            totalPrice,
            quantity: item.quantity ?? 1,
            currency: item.currency || 'KSh',
        };

        console.log('🛒 [CART] Adding item:', newItem);

        setItems((prev) => {
            // Check if same product + size + color exists (merge quantities)
            const existingIndex = prev.findIndex(
                (p) =>
                    p.productId === item.productId &&
                    p.size === item.size &&
                    p.color === item.color
            );

            if (existingIndex > -1) {
                // Merge with existing item
                const updated = [...prev];
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantity: updated[existingIndex].quantity + newItem.quantity,
                    totalPrice:
                        (updated[existingIndex].quantity + newItem.quantity) *
                        (updated[existingIndex].unitPrice ?? 0),
                };
                console.log('🔄 [CART] Merged with existing item');
                return updated;
            }

            // Add as new item
            console.log('✅ [CART] Added new item to cart');
            return [...prev, newItem];
        });

        toast.success('Added to cart!', {
            description: `${newItem.quantity}x ${item.productName}`,
        });
    }, []);

    // Remove item from cart
    const removeItem = useCallback((cartId: string) => {
        console.log('🗑️ [CART] Removing item:', cartId);
        setItems((prev) => prev.filter((item) => item.cartId !== cartId));
        toast.success('Item removed from cart');
    }, []);

    // Update item quantity
    const updateQuantity = useCallback((cartId: string, quantity: number) => {
        if (quantity < 1) {
            removeItem(cartId);
            return;
        }

        console.log('📝 [CART] Updating quantity:', { cartId, quantity });
        setItems((prev) =>
            prev.map((item) =>
                item.cartId === cartId
                    ? { ...item, quantity, totalPrice: quantity * (item.unitPrice ?? 0) }
                    : item
            )
        );
    }, [removeItem]);

    // Clear entire cart
    const clearCart = useCallback(() => {
        console.log('🧹 [CART] Clearing all items');
        setItems([]);
        toast.success('Cart cleared');
    }, []);

    // Calculate totals
    const totalItems = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
    const totalPrice = items.reduce((sum, item) => sum + (item.totalPrice ?? 0), 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                totalItems,
                totalPrice,
                isOpen,
                setIsOpen,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};