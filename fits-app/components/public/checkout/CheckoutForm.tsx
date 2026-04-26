// components/public/checkout/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PaymentMethodSelector } from './PaymentMethodSelector';
import { LocationSelector } from './LocationSelector';
import { toast } from 'sonner';

interface CheckoutFormProps {
    onSubmit: (data: {
        customerName: string;
        customerPhone: string;
        customerLocation: string;
        paymentMethod: 'mpesa' | 'cod';
        mpesaCode?: string;
    }) => Promise<void>;
    isLoading: boolean;
    totalPrice: number;
    deliveryFee: number;
}

export function CheckoutForm({ onSubmit, isLoading, totalPrice, deliveryFee }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerLocation: '',
        paymentMethod: 'cod' as 'mpesa' | 'cod',
        mpesaCode: '',
    });
    const grandTotal = totalPrice + deliveryFee;

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.customerName.trim()) {
            newErrors.customerName = 'Name is required';
        }

        if (!formData.customerPhone.trim()) {
            newErrors.customerPhone = 'Phone number is required';
        } else if (!/^07\d{8}$|^\+2547\d{8}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
            newErrors.customerPhone = 'Enter a valid Kenyan phone number';
        }

        if (!formData.customerLocation) {
            newErrors.customerLocation = 'Please select a location';
        }

        // M-Pesa code required only if M-Pesa selected
        if (formData.paymentMethod === 'mpesa' && !formData.mpesaCode.trim()) {
            newErrors.mpesaCode = 'M-Pesa transaction code is required';
        } else if (formData.paymentMethod === 'mpesa' && formData.mpesaCode.length < 6) {
            newErrors.mpesaCode = 'Enter a valid transaction code';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            toast.error('Please fix the errors above');
            return;
        }

        await onSubmit(formData);
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-6">

            {/* Section Header */}
            <div>
                <h2 className="text-lg font-semibold text-slate-900">Contact Information</h2>
                <p className="text-sm text-slate-500 mt-1">We&apos;ll use this to confirm your order</p>
            </div>

            {/* Name Field */}
            <div className="space-y-2">
                <Label htmlFor="customerName">Full Name *</Label>
                <Input
                    id="customerName"
                    type="text"
                    placeholder="enter your name"
                    value={formData.customerName}
                    onChange={(e) => handleChange('customerName', e.target.value)}
                    className={errors.customerName ? 'border-red-500 focus:ring-red-500' : ''}
                    disabled={isLoading}
                />
                {errors.customerName && (
                    <p className="text-xs text-red-600">{errors.customerName}</p>
                )}
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
                <Label htmlFor="customerPhone">Phone Number *</Label>
                <Input
                    id="customerPhone"
                    type="tel"
                    placeholder="e.g., 0706406009"
                    value={formData.customerPhone}
                    onChange={(e) => handleChange('customerPhone', e.target.value)}
                    className={errors.customerPhone ? 'border-red-500 focus:ring-red-500' : ''}
                    disabled={isLoading}
                />
                {errors.customerPhone && (
                    <p className="text-xs text-red-600">{errors.customerPhone}</p>
                )}
                <p className="text-xs text-slate-500">We&apos;ll send order updates via SMS/WhatsApp</p>
            </div>

            {/* Location Field */}
            <div className="space-y-2">
                <Label>Delivery Location *</Label>
                <LocationSelector
                    value={formData.customerLocation}
                    onChange={(value) => handleChange('customerLocation', value)}
                    disabled={isLoading}
                    error={errors.customerLocation}
                />
            </div>

            {/* Payment Method */}
            <div className="space-y-2 pt-2">
                <Label>Payment Method *</Label>
                <PaymentMethodSelector
                    value={formData.paymentMethod}
                    mpesaCode={formData.mpesaCode}
                    onMethodChange={(value) => handleChange('paymentMethod', value)}
                    onCodeChange={(code) => handleChange('mpesaCode', code)}
                    disabled={isLoading} grandTotal={grandTotal} />
                {errors.mpesaCode && (
                    <p className="text-xs text-red-600 -mt-2">{errors.mpesaCode}</p>
                )}
            </div>

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                size="lg"
                disabled={isLoading}
            >
                {isLoading ? 'Processing...' : `Pay KSh ${grandTotal.toLocaleString()} & Place Order`}
            </Button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                <span className="flex items-center gap-1">
                    🔒 Secure Checkout
                </span>
                <span className="flex items-center gap-1">
                    ✅ Order Confirmation
                </span>
                <span className="flex items-center gap-1">
                    📱 M-Pesa Verified
                </span>
            </div>
        </form>
    );
}