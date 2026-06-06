/* eslint-disable @typescript-eslint/no-explicit-any */
// components/public/checkout/CheckoutForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Loader2, ShoppingBag, MapPin, CreditCard, Copy, Smartphone, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface CheckoutFormProps {
    onSubmit: (data: any) => Promise<void>;
    isLoading: boolean;
    subtotal: number;
}

export function CheckoutForm({ onSubmit, isLoading, subtotal }: CheckoutFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        phone: '',
        email: '',
        fulfillmentMethod: 'delivery' as 'pickup' | 'delivery',
        location: '',
        paymentMethod: 'pay_later' as 'pay_now' | 'pay_later',
        mpesaCode: '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^07\d{8}$|^\+2547\d{8}$/.test(formData.phone.replace(/\s/g, ''))) {
            newErrors.phone = 'Enter a valid Kenyan phone number';
        }
        if (formData.fulfillmentMethod === 'delivery' && !formData.location.trim()) {
            newErrors.location = 'Please enter your delivery location or landmark';
        }
        if (formData.paymentMethod === 'pay_now' && formData.mpesaCode.length < 6) {
            newErrors.mpesaCode = 'Enter a valid M-Pesa confirmation code';
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
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-8">

            {/* 1. Contact Info */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <ShoppingBag className="h-5 w-5 text-blue-600" /> Contact Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Full Name *</Label>
                        <Input value={formData.name} onChange={(e) => handleChange('name', e.target.value)} placeholder="Jane Doe" />
                        {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>Phone Number (M-Pesa) *</Label>
                        <Input value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} placeholder="0712345678" />
                        {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Email (Optional)</Label>
                    <Input type="email" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} placeholder="jane@example.com" />
                </div>
            </div>

            {/* 2. Fulfillment Choice */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" /> How do you want your order?
                </h2>
                <RadioGroup
                    value={formData.fulfillmentMethod}
                    onValueChange={(val) => handleChange('fulfillmentMethod', val)}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <Label htmlFor="ful-pickup" className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.fulfillmentMethod === 'pickup' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <RadioGroupItem value="pickup" id="ful-pickup" />
                        <div>
                            <p className="font-medium text-slate-900">Pickup</p>
                            <p className="text-xs text-slate-500">Collect from our Nairobi hub</p>
                        </div>
                    </Label>
                    <Label htmlFor="ful-delivery" className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${formData.fulfillmentMethod === 'delivery' ? 'border-blue-500 bg-blue-50' : 'border-slate-200'}`}>
                        <RadioGroupItem value="delivery" id="ful-delivery" />
                        <div>
                            <p className="font-medium text-slate-900">Delivery</p>
                            <p className="text-xs text-slate-500">We&apos;ll call to confirm details</p>
                        </div>
                    </Label>
                </RadioGroup>

                {formData.fulfillmentMethod === 'delivery' && (
                    <div className="space-y-2 pl-2 border-l-2 border-blue-100">
                        <Label>Delivery Location / Landmark *</Label>
                        <Input value={formData.location} onChange={(e) => handleChange('location', e.target.value)} placeholder="e.g. Westlands, near Sarit Centre" />
                        {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
                        <p className="text-xs text-slate-500">We will WhatsApp you to confirm the exact location and courier details.</p>
                    </div>
                )}
            </div>

            {/* 3. Payment Choice */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-blue-600" /> Payment Method
                </h2>

                <RadioGroup
                    value={formData.paymentMethod}
                    onValueChange={(val) => handleChange('paymentMethod', val)}
                    className="space-y-4"
                >
                    {/* Pay Later Option (POPULAR) */}
                    <div className={`relative flex items-start gap-3 p-4 border rounded-lg transition-all ${formData.paymentMethod === 'pay_later'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-blue-300'
                        }`}>
                        <Badge className="absolute -top-2.5 right-4 bg-green-500 hover:bg-green-600 text-[10px] px-2 py-0.5">POPULAR</Badge>
                        <RadioGroupItem value="pay_later" id="pay_later" className="mt-1" />
                        <Label htmlFor="pay_later" className="flex-1 cursor-pointer flex-col md:flex-row items-start md:items-center gap-2">
                            <div className="flex items-center gap-2 font-medium text-slate-900">
                                <Clock className="h-4 w-4 text-blue-600" />
                                Order Now, Pay Later
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Skip upfront payment. Place your order now & we&apos;ll call to confirm details before delivery.
                            </p>

                            {/* Pay Later Info (shown when selected) */}
                            {formData.paymentMethod === 'pay_later' && (
                                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-2 w-full">
                                    <div className="flex items-start gap-2">
                                        <span className="text-blue-600 font-bold">📞</span>
                                        <p className="text-xs text-blue-800 font-medium">How it works:</p>
                                    </div>
                                    <ol className="text-xs text-slate-600 space-y-1 ml-6 list-decimal">
                                        <li>Place your order now – no payment needed upfront.</li>
                                        <li>Our team will call/WhatsApp to confirm items & delivery time.</li>
                                        <li>Pay securely via M-Pesa when your order arrives. Simple & safe!</li>
                                    </ol>
                                </div>
                            )}
                        </Label>
                    </div>

                    {/* M-Pesa Pay Now Option */}
                    <div className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${formData.paymentMethod === 'pay_now'
                        ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                        : 'border-slate-200 hover:border-blue-300'
                        }`}>
                        <RadioGroupItem value="pay_now" id="pay_now" className="mt-1" />
                        <Label htmlFor="pay_now" className="flex-1 cursor-pointer flex-col md:flex-row items-start md:items-center gap-2">
                            <div className="flex flex-col md:flex-row items-center gap-2 font-medium text-slate-900">
                                <Smartphone className="h-4 w-4 text-green-600" />
                                M-Pesa (Pay Now)
                            </div>
                            <p className="text-xs text-slate-500 mt-1">
                                Pay securely via M-Pesa Buy Goods
                            </p>

                            {/* M-Pesa Instructions (shown when selected) */}
                            {formData.paymentMethod === 'pay_now' && (
                                <div className="mt-4 space-y-3 w-full">
                                    {/* Instructions */}
                                    <div className="bg-white rounded-lg border border-blue-200 p-4 space-y-3">
                                        <p className="text-sm font-semibold text-slate-900">How to Pay:</p>
                                        <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                                            <li>Go to <strong>M-Pesa Menu</strong> on your phone</li>
                                            <li>Select <strong>Lipa Na M-Pesa</strong></li>
                                            <li>Select <strong>Buy Goods and Services</strong></li>
                                            <li>
                                                Enter <strong>Till Number</strong>: <span className="font-mono font-bold text-blue-600">1111111</span>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 ml-1"
                                                    onClick={async () => {
                                                        await navigator.clipboard.writeText('1111111');
                                                        toast.success('Till Number copied!', { description: '1111111' });
                                                    }}
                                                >
                                                    <Copy className="h-3 w-3" />
                                                </Button>
                                            </li>
                                            <li>Enter <strong>Amount</strong>: <span className="font-bold text-green-600">KSh {subtotal.toLocaleString()}</span></li>
                                            <li>Enter your <strong>M-Pesa PIN</strong> and confirm</li>
                                            <li>Wait for SMS with <strong>Transaction Code</strong> (e.g., RJK38H7Y29)</li>
                                            <li>Enter the code below to complete your order</li>
                                        </ol>
                                    </div>

                                    {/* M-Pesa Code Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="mpesaCode" className="text-sm font-medium">
                                            M-Pesa Transaction Code *
                                        </Label>
                                        <Input
                                            id="mpesaCode"
                                            type="text"
                                            placeholder="e.g., RJK38H7Y29"
                                            value={formData.mpesaCode}
                                            onChange={(e) => handleChange('mpesaCode', e.target.value.toUpperCase())}
                                            className="font-mono tracking-wider uppercase"
                                            disabled={isLoading}
                                            maxLength={10}
                                        />
                                        {errors.mpesaCode && <p className="text-xs text-red-500">{errors.mpesaCode}</p>}
                                        <p className="text-xs text-slate-500">
                                            Check your SMS for the confirmation code after payment
                                        </p>
                                    </div>

                                    {/* Visual Guide */}
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 font-bold">✓</span>
                                            <p className="text-xs text-green-800">
                                                Your order will be confirmed once we verify the M-Pesa transaction code.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Label>
                    </div>
                </RadioGroup>
            </div>

            <Button type="submit" className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : 'Place Order'}
            </Button>
        </form>
    );
}