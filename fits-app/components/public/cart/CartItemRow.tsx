// components/public/cart/CartItemRow.tsx
'use client';

import { CartItem as CartItemType } from '@/lib/CartContext';
import { useCart } from '@/lib/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemRowProps {
    item: CartItemType;
    compact?: boolean; // For drawer vs page
}

export function CartItemRow({ item, compact = false }: CartItemRowProps) {
    const { removeItem, updateQuantity } = useCart();

    const formatPrice = (amount: number) => {
        return `KSh ${amount.toLocaleString()}`;
    };

    const handleQuantityChange = (newQty: number) => {
        if (newQty < 1) {
            removeItem(item.cartId);
        } else {
            updateQuantity(item.cartId, newQty);
        }
    };

    return (
        <div className={`flex gap-4 p-4 bg-white rounded-xl border border-slate-200 ${compact ? 'p-3' : ''}`}>

            {/* Product Image */}
            <div className={`flex-shrink-0 bg-slate-100 rounded-lg overflow-hidden ${compact ? 'h-16 w-16' : 'h-24 w-24'}`}>
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <span className={`text-slate-400 ${compact ? 'text-[10px]' : 'text-xs'}`}>No Image</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className={`font-medium text-slate-900 ${compact ? 'text-sm' : 'text-base'} line-clamp-2`}>
                        {item.productName}
                    </h3>
                    <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 ${compact ? 'h-7 w-7' : ''}`}
                        onClick={() => removeItem(item.cartId)}
                        aria-label={`Remove ${item.productName}`}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>

                {/* Variants */}
                {(item.size || item.color) && (
                    <div className={`flex flex-wrap gap-x-3 gap-y-1 ${compact ? 'text-[10px]' : 'text-xs'} text-slate-500`}>
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>Color: {item.color}</span>}
                        {item.category && <span className="capitalize">• {item.category}</span>}
                    </div>
                )}

                {/* Quantity + Price */}
                <div className="flex items-center justify-between pt-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center border border-slate-200 rounded-lg">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${compact ? 'h-6 w-6' : ''}`}
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className={`font-medium min-w-[2rem] text-center ${compact ? 'text-xs px-1' : 'text-sm px-2'}`}>
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`h-7 w-7 ${compact ? 'h-6 w-6' : ''}`}
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>

                    {/* Total Price */}
                    <span className={`font-bold text-blue-600 ${compact ? 'text-sm' : 'text-base'}`}>
                        {formatPrice(item.totalPrice)}
                    </span>
                </div>
            </div>
        </div>
    );
}