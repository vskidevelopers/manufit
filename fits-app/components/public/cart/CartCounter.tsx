// components/public/cart/CartCounter.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CartCounter() {
    const { totalItems, setIsOpen } = useCart();

    return (
        <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setIsOpen(true)}
            aria-label={`View cart with ${totalItems} items`}
        >
            <ShoppingCart className="h-5 w-5" />
            {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-blue-600 text-[10px] font-bold text-white flex items-center justify-center animate-in zoom-in">
                    {totalItems > 99 ? '99+' : totalItems}
                </span>
            )}
        </Button>
    );
}