// components/public/cart/CartDrawer.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { X, ShoppingBag, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CartItem } from './CartItem';
import Link from 'next/link';

export function CartDrawer() {
    const { items, isOpen, setIsOpen, totalItems, totalPrice, clearCart } = useCart();

    const formatPrice = (amount: number) => {
        return `KSh ${amount.toLocaleString()}`;
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
                    onClick={() => setIsOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Drawer Panel */}
            <div
                className={`
          fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                role="dialog"
                aria-modal="true"
                aria-label="Shopping cart"
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-5 w-5 text-blue-600" />
                        <h2 className="text-lg font-semibold text-slate-900">
                            Your Cart ({totalItems})
                        </h2>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </Button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4" style={{ maxHeight: 'calc(100vh - 200px)' }}>
                    {items.length === 0 ? (
                        <div className="text-center py-12 space-y-4">
                            <ShoppingBag className="h-16 w-16 text-slate-300 mx-auto" />
                            <div>
                                <p className="text-lg font-medium text-slate-900">Your cart is empty</p>
                                <p className="text-sm text-slate-500">Add some products to get started</p>
                            </div>
                            <Button onClick={() => setIsOpen(false)} variant="outline">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {items.map((item) => (
                                <CartItem
                                    key={item.cartId}
                                    item={item}
                                    onRemove={() => { }}
                                    onQuantityChange={() => { }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer: Totals + Checkout */}
                {items.length > 0 && (
                    <div className="border-t p-4 space-y-4 bg-slate-50">
                        {/* Subtotal */}
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Subtotal</span>
                            <span className="font-medium">{formatPrice(totalPrice)}</span>
                        </div>

                        {/* Delivery */}
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-600">Delivery</span>
                            <span className="text-green-600 font-medium">Free</span>
                        </div>

                        {/* Total */}
                        <div className="flex justify-between text-lg font-bold pt-2 border-t">
                            <span>Total</span>
                            <span className="text-blue-600">{formatPrice(totalPrice)}</span>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2 pt-2">
                            <Link href="/checkout" className="block">
                                <Button className="w-full h-12 text-base" size="lg">
                                    Proceed to Checkout
                                </Button>
                            </Link>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsOpen(false)}
                            >
                                Continue Shopping
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                                onClick={clearCart}
                            >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Clear Cart
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}