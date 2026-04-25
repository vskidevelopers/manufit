// components/public/checkout/CheckoutContent.tsx
'use client';

import { useCart } from '@/lib/CartContext';
import { CheckoutForm } from './CheckoutForm';
import { OrderReview } from './OrderReview';
import { CheckoutSummary } from './CheckoutSummary';
import { CheckoutSuccess } from './CheckoutSuccess';
import { createOrderAction } from '@/actions/order-actions';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

export function CheckoutContent() {
    const { items, totalPrice, clearCart } = useCart();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [deliveryFee, setDeliveryFee] = useState(0);


    // ✅ NEW: Clear cart AFTER success state is rendered (not during render)
    useEffect(() => {
        if (orderNumber) {
            console.log('🧹 [CHECKOUT] Clearing cart after successful order');
            clearCart();
        }
    }, [orderNumber, clearCart]);

    const handleSubmit = async (formData: {
        customerName: string;
        customerPhone: string;
        customerLocation: string;
        paymentMethod: 'mpesa' | 'cod';
    }) => {
        setIsSubmitting(true);
        console.log('🛒 [CHECKOUT] Submitting order:', { ...formData, items, totalPrice, deliveryFee });

        try {
            // Prepare order data for server action
            const orderData = {
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                customerLocation: formData.customerLocation,
                paymentMethod: formData.paymentMethod,
                items: items.map((item) => ({
                    productId: item.productId,
                    productName: item.productName,
                    quantity: item.quantity,
                    size: item.size,
                    color: item.color,
                    priceAtPurchase: item.unitPrice,
                })),
                totalAmount: totalPrice + deliveryFee,
                currency: 'KSh',
                deliveryFee: deliveryFee > 0 ? deliveryFee : undefined,
            };

            // Create order via server action
            const result = await createOrderAction(orderData);

            if (result.success && result.orderNumber) {
                console.log('✅ [CHECKOUT] Order created:', result.orderNumber);
                toast.success('Order placed successfully!', {
                    description: `Your order number is ${result.orderNumber}`,
                    duration: 5000,
                });
                setOrderNumber(result.orderNumber);
            } else {
                console.error('❌ [CHECKOUT] Order creation failed:', result.error);
                toast.error('Failed to place order', {
                    description: result.error || 'Please try again or contact support.',
                    duration: 6000,
                });
            }
        } catch (error) {
            console.error('❌ [CHECKOUT] Unexpected error:', error);
            toast.error('Unexpected error occurred', {
                description: 'Please refresh and try again.',
                duration: 6000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (orderNumber) {
        return <CheckoutSuccess orderNumber={orderNumber} />;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Page Header */}
            <header className="bg-linear-to-br from-slate-900 to-blue-900 py-4 md:py-5">
                <div className="container px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                        Checkout
                        <span className="block text-sm md:text-base font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-300">
                            Complete your order securely
                        </span>
                    </h1>
                </div>
            </header>

            {/* Main Content */}
            <div className="container px-4 py-6 md:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left: Form + Review */}
                    <div className="lg:col-span-2 space-y-6">
                        <CheckoutForm onSubmit={handleSubmit} isLoading={isSubmitting} totalPrice={totalPrice} deliveryFee={deliveryFee} />
                        <OrderReview items={items} totalPrice={totalPrice} deliveryFee={deliveryFee} />
                    </div>

                    {/* Right: Sticky Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <CheckoutSummary
                                items={items}
                                totalPrice={totalPrice}
                                onDeliveryChange={setDeliveryFee}
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Loading Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <div className="bg-white rounded-xl p-6 shadow-2xl text-center space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                        <p className="font-medium text-slate-900">Processing your order...</p>
                        <p className="text-sm text-slate-500">Please do not close this window</p>
                    </div>
                </div>
            )}
        </div>
    );
}