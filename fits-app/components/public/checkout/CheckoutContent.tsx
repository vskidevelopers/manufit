/* eslint-disable @typescript-eslint/no-explicit-any */
// components/public/checkout/CheckoutContent.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { CheckoutForm } from './CheckoutForm';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutSuccess } from './CheckoutSuccess';
import { createOrderAction } from '@/actions/order-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CheckoutContent() {
    const { items, totalPrice, clearCart } = useCart(); // totalPrice is our pure subtotal

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);

    // Clear cart AFTER success state is rendered
    useEffect(() => {
        if (orderNumber) {
            console.log('🧹 [CHECKOUT] Clearing cart after successful order');
            clearCart();
        }
    }, [orderNumber, clearCart]);

    const handleSubmit = async (formData: any) => {
        setIsSubmitting(true);

        try {
            // Map cart items to the new lean schema (name/price instead of productName/unitPrice)

            const mappedItems = items.map((item) => ({
                productId: item.productId,
                name: item.productName,
                image: item.image || null,
                category: item.category || null,
                quantity: item.quantity,
                size: item.size || null,
                color: item.color || null,
                price: item.unitPrice,
            }));

            // Prepare the exact payload for the new Server Action
            const orderData = {
                customerName: formData.name.trim(),
                customerPhone: formData.phone.trim(),
                customerEmail: formData.email?.trim() || null,
                fulfillmentMethod: formData.fulfillmentMethod,
                location: formData.location?.trim() || null,
                paymentMethod: formData.paymentMethod,
                mpesaCode: formData.mpesaCode?.trim().toUpperCase() || null,
                items: mappedItems,
                totalAmount: totalPrice, // This is the pure subtotal
            };

            const result = await createOrderAction(orderData);

            if (result.success && result.orderNumber) {
                toast.success('Order placed successfully!', {
                    description: `Your order number is ${result.orderNumber}`,
                    duration: 5000,
                });
                setOrderNumber(result.orderNumber);
            } else {
                toast.error('Failed to place order', {
                    description: result.error || 'Please try again.',
                    duration: 6000,
                });
            }
        } catch (error) {
            console.error('❌ [CHECKOUT] Unexpected error:', error);
            toast.error('Unexpected error occurred. Please refresh and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Show Success Page if order is placed
    if (orderNumber) {
        return <CheckoutSuccess orderNumber={orderNumber} />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <header className="bg-gradient-to-br from-slate-900 to-blue-900 py-4 md:py-5">
                <div className="container px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Checkout
                        <span className="block text-sm md:text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                            Secure your order in seconds
                        </span>
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="container px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutForm
                            onSubmit={handleSubmit}
                            isLoading={isSubmitting}
                            subtotal={totalPrice}
                        />
                    </div>

                    {/* Right: Sticky Summary (We already stripped delivery from this) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CheckoutSummary />
                        </div>
                    </div>

                </div>
            </div>

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 shadow-2xl text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                        <p className="font-medium text-slate-900">Securing your order...</p>
                        <p className="text-sm text-slate-500">Please do not close this window</p>
                    </div>
                </div>
            )}
        </div>
    );
}