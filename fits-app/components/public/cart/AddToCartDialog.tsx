
'use client';

import { useCart } from '@/lib/CartContext';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Check, ShoppingBag, } from 'lucide-react';

interface AddToCartDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    productName: string;
    quantity: number;
}

export function AddToCartDialog({
    open,
    onOpenChange,
    productName,
    quantity,
}: AddToCartDialogProps) {
    const { setIsOpen: setCartDrawerOpen } = useCart();

    const handleViewCart = () => {
        onOpenChange(false);
        setCartDrawerOpen(true);
    };

    const handleContinueShopping = () => {
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Check className="h-5 w-5 text-green-600" />
                        Added to Cart!
                    </DialogTitle>
                    <DialogDescription>
                        {quantity}x {productName} has been added to your cart.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                        <ShoppingBag className="h-8 w-8 text-blue-600" />
                        <div>
                            <p className="font-medium text-slate-900">{productName}</p>
                            <p className="text-sm text-slate-500">Quantity: {quantity}</p>
                        </div>
                    </div>
                </div>

                <DialogFooter className="flex-col sm:flex-row gap-2">
                    <Button
                        variant="outline"
                        onClick={handleContinueShopping}
                        className="flex-1"
                    >
                        Continue Shopping
                    </Button>
                    <Button
                        onClick={handleViewCart}
                        className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                        View Cart
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}