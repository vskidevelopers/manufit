// components/public/cart/CartItem.tsx
'use client';

import { CartItem as CartItemType } from '@/lib/CartContext';
import { useCart } from '@/lib/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CartItemProps {
    item: CartItemType;
    onRemove?: () => void;
    onQuantityChange?: (qty: number) => void;
}

export function CartItem({ item, onRemove, onQuantityChange }: CartItemProps) {
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
        onQuantityChange?.(newQty);
    };

    return (
        <div className="flex gap-3 p-3 bg-white rounded-lg border border-slate-200">
            {/* Product Image */}
            <div className="h-20 w-20 flex-shrink-0 bg-slate-100 rounded-md overflow-hidden">
                {item.image ? (
                    <img
                        src={item.image}
                        alt={item.productName}
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <div className="h-full w-full flex items-center justify-center">
                        <span className="text-xs text-slate-400">No Image</span>
                    </div>
                )}
            </div>

            {/* Product Details */}
            <div className="flex-1 min-w-0 space-y-2">
                <h3 className="font-medium text-slate-900 text-sm truncate">
                    {item.productName}
                </h3>

                {/* Variants */}
                {(item.size || item.color) && (
                    <div className="flex gap-2 text-xs text-slate-500">
                        {item.size && <span>Size: {item.size}</span>}
                        {item.color && <span>• Color: {item.color}</span>}
                    </div>
                )}

                {/* Quantity Controls */}
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-slate-200 rounded-md">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.quantity - 1)}
                        >
                            <Minus className="h-3 w-3" />
                        </Button>
                        <span className="px-2 text-sm font-medium min-w-[2rem] text-center">
                            {item.quantity}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => handleQuantityChange(item.quantity + 1)}
                        >
                            <Plus className="h-3 w-3" />
                        </Button>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                        {formatPrice(item.totalPrice)}
                    </span>
                </div>
            </div>

            {/* Remove Button */}
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => {
                    removeItem(item.cartId);
                    onRemove?.();
                }}
                aria-label={`Remove ${item.productName} from cart`}
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}