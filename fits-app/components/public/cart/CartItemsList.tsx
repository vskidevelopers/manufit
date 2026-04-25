// components/public/cart/CartItemsList.tsx
'use client';

import { CartItem as CartItemType } from '@/lib/CartContext';
import { CartItemRow } from './CartItemRow';

interface CartItemsListProps {
    items: CartItemType[];
}

export function CartItemsList({ items }: CartItemsListProps) {
    return (
        <div className="space-y-4">
            {items.map((item) => (
                <CartItemRow key={item.cartId} item={item} />
            ))}
        </div>
    );
}