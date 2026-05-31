// components/public/checkout/CheckoutSuccess.tsx
'use client';

import { Button } from '@/components/ui/button';
import { CheckCircle, Package, Truck, Copy, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface CheckoutSuccessProps {
    orderNumber: string;
}

export function CheckoutSuccess({ orderNumber }: CheckoutSuccessProps) {
    const copyOrderNumber = async () => {
        await navigator.clipboard.writeText(orderNumber);
        toast.success('Order number copied!', { description: orderNumber });
    };

    // ✅ WhatsApp link with pre-filled message
    const whatsappNumber = '+254799336502'; // Your business WhatsApp (international format, no +)
    const whatsappMessage = `Hello iDRIP, I just placed order *${orderNumber}*. Please confirm my order details and delivery timeline. Thank you!`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl border border-slate-200 p-8 max-w-md w-full text-center space-y-6 shadow-lg">

                {/* Success Icon */}
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>

                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Order Placed!</h1>
                    <p className="text-slate-600 mt-2">
                        Thank you for your order. We&apos;ll confirm via WhatsApp shortly.
                    </p>
                </div>

                {/* Order Number */}
                <div className="bg-slate-50 rounded-lg p-4 space-y-2">
                    <p className="text-sm text-slate-500">Your Order Number</p>
                    <div className="flex items-center justify-center gap-2">
                        <code className="text-lg font-mono font-bold text-blue-600">{orderNumber}</code>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={copyOrderNumber}
                            aria-label="Copy order number"
                        >
                            <Copy className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* ✅ WhatsApp CTA - Primary Action */}
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="block">
                    <Button className="w-full h-12 text-base bg-green-600 hover:bg-green-700 gap-2">
                        <MessageCircle className="h-5 w-5" />
                        Chat on WhatsApp to Confirm
                    </Button>
                </a>
                <p className="text-xs text-slate-500 -mt-2">
                    Pre-filled with your order number • We typically respond within 15 mins
                </p>

                {/* Next Steps */}
                <div className="space-y-3 text-left pt-2">
                    <div className="flex items-start gap-3">
                        <Package className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Order Processing</p>
                            <p className="text-sm text-slate-500">We&apos;re preparing your items for delivery</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Truck className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div>
                            <p className="font-medium text-slate-900">Track Your Order</p>
                            <p className="text-sm text-slate-500">Use your order number + phone to track status</p>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                    <Link href="/track" className="block">
                        <Button variant="outline" className="w-full h-12 text-base">
                            Track Your Order
                        </Button>
                    </Link>
                    <Link href="/shop">
                        <Button variant="ghost" className="w-full">
                            Continue Shopping
                        </Button>
                    </Link>
                </div>

                {/* Support */}
                <p className="text-xs text-slate-500 pt-4 border-t">
                    Need help? Contact us at 0706 406 009 or hello@i-Drip.co.ke
                </p>
            </div>
        </div>
    );
}