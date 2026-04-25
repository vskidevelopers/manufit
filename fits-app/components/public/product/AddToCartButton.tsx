// components/public/product/AddToCartButton.tsx
'use client';

import { useState } from 'react';
import { Product } from '@/lib/types';
import { useCart } from '@/lib/CartContext';
import { AddToCartDialog } from '@/components/public/cart/AddToCartDialog';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Check, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addItem } = useCart();

    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    // Defensive price formatting
    const formatPrice = (amount: number | undefined) => {
        const safeAmount = amount ?? 0;
        const currency = 'KSh';
        return `${currency} ${safeAmount.toLocaleString()}`;
    };

    const handleAddToCart = async () => {
        // Validation
        if (quantity < 1) {
            toast.error('Quantity must be at least 1');
            return;
        }

        setAdding(true);

        // Prepare cart item data (defensive for undefined values)
        const cartItem = {
            productId: product.id ?? '',
            productName: product.name ?? 'Untitled Product',
            category: product.category,
            quantity: quantity ?? 1,
            size: selectedSize || undefined,
            color: selectedColor || undefined,
            unitPrice: product.basePrice ?? 0,
            currency: 'KSh',
            image: product.images?.[0],
        };

        try {
            // Add to cart via context (persists to localStorage)
            addItem(cartItem);

            console.log('🛒 [CART] Item added:', cartItem);

            // Show dialog: "View Cart" OR "Continue Shopping"
            setShowDialog(true);
        } catch (error) {
            console.error('❌ [CART] Failed to add item:', error);
            toast.error('Failed to add to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    const isDisabled = !product.isActive || adding;

    return (
        <>
            <div className="space-y-4 pt-4 border-t">
                {/* Size Selector (if applicable) */}
                {product.availableSizes?.length ? (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900">Select Size</label>
                        <div className="flex flex-wrap gap-2">
                            {product.availableSizes.map((size) => (
                                <Button
                                    key={size}
                                    variant={selectedSize === size ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() => setSelectedSize(size)}
                                    className="min-w-[3rem]"
                                    aria-pressed={selectedSize === size}
                                >
                                    {size}
                                </Button>
                            ))}
                        </div>
                    </div>
                ) : null}

                {/* Color Selector (if applicable) */}
                {product.availableColors?.length ? (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-900">Select Color</label>
                        <div className="flex flex-wrap gap-3">
                            {product.availableColors.map((color) => {
                                const bgClass = {
                                    'Black': 'bg-black',
                                    'White': 'bg-white border-2 border-slate-300',
                                    'Red': 'bg-red-600',
                                    'Blue': 'bg-blue-600',
                                    'Green': 'bg-green-600',
                                    'Gray': 'bg-gray-500',
                                    'Navy': 'bg-blue-900',
                                    'Pink': 'bg-pink-500',
                                }[color] || 'bg-slate-400';

                                return (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`
                      h-9 w-9 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                      ${bgClass}
                      ${selectedColor === color ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-md' : 'hover:scale-105 shadow-sm'}
                    `}
                                        aria-label={`Select ${color}`}
                                        aria-pressed={selectedColor === color}
                                        title={color}
                                    />
                                );
                            })}
                        </div>
                    </div>
                ) : null}

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 pt-2">
                    <label className="text-sm font-semibold text-slate-900">Quantity</label>
                    <div className="flex items-center border border-slate-200 rounded-lg">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="px-3 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                            aria-label="Decrease quantity"
                        >
                            −
                        </button>
                        <span className="px-4 py-2 font-medium min-w-[3rem] text-center">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="px-3 py-2 hover:bg-slate-50 transition-colors text-slate-600"
                            aria-label="Increase quantity"
                        >
                            +
                        </button>
                    </div>
                </div>

                {/* Total Price */}
                <div className="flex justify-between items-center pt-4 border-t">
                    <span className="text-sm text-slate-600">Total</span>
                    <span className="text-2xl font-bold text-slate-900">
                        {formatPrice((product.basePrice ?? 0) * quantity)}
                    </span>
                </div>

                {/* Add to Cart Button */}
                <Button
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={isDisabled}
                    className="w-full h-12 text-base gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {adding ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Adding...
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="h-5 w-5" />
                            {product.isActive ? 'Add to Cart' : 'Out of Stock'}
                        </>
                    )}
                </Button>

                {/* Trust Badges */}
                <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                    <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" />
                        Secure Checkout
                    </span>
                    <span className="flex items-center gap-1">
                        <Check className="h-3 w-3 text-green-600" />
                        Easy Returns
                    </span>
                </div>
            </div>

            {/* Add to Cart Dialog: "View Cart" OR "Continue Shopping" */}
            <AddToCartDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                productName={product.name ?? 'Product'}
                quantity={quantity}
            />
        </>
    );
}