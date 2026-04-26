// components/public/quote/QuoteForm.tsx
'use client';

import { useState } from 'react';
import { submitQuoteRequest } from '@/actions/quote-actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Loader2, CheckCircle } from 'lucide-react';
import Link from 'next/link';

const ITEM_TYPES = [
    'T-Shirts',
    'Hoodies',
    'Polo Shirts',
    'Kids Wear',
    'Caps & Hats',
    'Bags & Totes',
    'Office Décor',
    'Mugs & Drinkware',
    'Other',
];

const TIMELINES = [
    'ASAP (Rush)',
    '1-2 weeks',
    '2-4 weeks',
    '1-2 months',
    'Flexible',
];

export function QuoteForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        organization: '',
        itemType: '',
        quantity: '',
        timeline: '',
        details: '',
    });

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

        if (!formData.itemType) {
            newErrors.itemType = 'Please select an item type';
        }

        if (!formData.quantity || parseInt(formData.quantity) < 1) {
            newErrors.quantity = 'Please enter a valid quantity';
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

        setIsSubmitting(true);

        try {
            const result = await submitQuoteRequest({
                customerName: formData.customerName.trim(),
                customerPhone: formData.customerPhone.trim(),
                customerEmail: formData.customerEmail.trim() || undefined,
                organization: formData.organization.trim() || undefined,
                itemType: formData.itemType,
                quantity: parseInt(formData.quantity),
                timeline: formData.timeline || undefined,
                details: formData.details.trim() || undefined,
            });

            if (result.success) {
                setIsSuccess(true);
                toast.success('Quote request submitted!', {
                    description: result.message,
                    duration: 6000,
                });
            } else {
                toast.error('Submission failed', {
                    description: result.error,
                    duration: 6000,
                });
            }
        } catch (error) {
            console.error('❌ [QUOTE] Unexpected error:', error);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
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

    if (isSuccess) {
        return (
            <section className="py-12 md:py-16 bg-white">
                <div className="container px-4">
                    <div className="max-w-2xl mx-auto bg-green-50 border border-green-200 rounded-xl p-8 text-center space-y-4">
                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900">Request Received!</h2>
                        <p className="text-slate-600">
                            Thank you for your interest. Our team will review your requirements and contact you within 24 hours with a personalized quote.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                            <Link href="/shop">
                                <Button variant="outline">Browse Products</Button>
                            </Link>
                            <a href="tel:0706406009">
                                <Button className="bg-blue-600 hover:bg-blue-700">Call Us Now</Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-12 md:py-16 bg-white">
            <div className="container px-4">
                <div className="max-w-3xl mx-auto">

                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6">

                        {/* Section: Contact Info */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-slate-900">Contact Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="customerName">Full Name *</Label>
                                    <Input
                                        id="customerName"
                                        placeholder="e.g., John Kamau"
                                        value={formData.customerName}
                                        onChange={(e) => handleChange('customerName', e.target.value)}
                                        className={errors.customerName ? 'border-red-500' : ''}
                                        disabled={isSubmitting}
                                    />
                                    {errors.customerName && <p className="text-xs text-red-600">{errors.customerName}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customerPhone">Phone Number *</Label>
                                    <Input
                                        id="customerPhone"
                                        type="tel"
                                        placeholder="e.g., 0706406009"
                                        value={formData.customerPhone}
                                        onChange={(e) => handleChange('customerPhone', e.target.value)}
                                        className={errors.customerPhone ? 'border-red-500' : ''}
                                        disabled={isSubmitting}
                                    />
                                    {errors.customerPhone && <p className="text-xs text-red-600">{errors.customerPhone}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="customerEmail">Email (Optional)</Label>
                                    <Input
                                        id="customerEmail"
                                        type="email"
                                        placeholder="john@example.com"
                                        value={formData.customerEmail}
                                        onChange={(e) => handleChange('customerEmail', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="organization">Organization/Company (Optional)</Label>
                                    <Input
                                        id="organization"
                                        placeholder="e.g., ABC Company Ltd"
                                        value={formData.organization}
                                        onChange={(e) => handleChange('organization', e.target.value)}
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section: Order Details */}
                        <div className="space-y-4 pt-4 border-t">
                            <h3 className="text-lg font-semibold text-slate-900">Order Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="itemType">Item Type *</Label>
                                    <Select
                                        value={formData.itemType}
                                        onValueChange={(value) => handleChange('itemType', value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger className={errors.itemType ? 'border-red-500' : ''}>
                                            <SelectValue placeholder="Select item type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {ITEM_TYPES.map((type) => (
                                                <SelectItem key={type} value={type}>
                                                    {type}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {errors.itemType && <p className="text-xs text-red-600">{errors.itemType}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="quantity">Estimated Quantity *</Label>
                                    <Input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        placeholder="e.g., 100"
                                        value={formData.quantity}
                                        onChange={(e) => handleChange('quantity', e.target.value)}
                                        className={errors.quantity ? 'border-red-500' : ''}
                                        disabled={isSubmitting}
                                    />
                                    {errors.quantity && <p className="text-xs text-red-600">{errors.quantity}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="timeline">Timeline</Label>
                                    <Select
                                        value={formData.timeline}
                                        onValueChange={(value) => handleChange('timeline', value)}
                                        disabled={isSubmitting}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="When do you need it?" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {TIMELINES.map((time) => (
                                                <SelectItem key={time} value={time}>
                                                    {time}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details">Additional Details (Optional)</Label>
                                <Textarea
                                    id="details"
                                    rows={4}
                                    placeholder="Describe your requirements: colors, sizes, design ideas, special instructions..."
                                    value={formData.details}
                                    onChange={(e) => handleChange('details', e.target.value)}
                                    disabled={isSubmitting}
                                />
                                <p className="text-xs text-slate-500">
                                    Tip: Mention if you need design help, specific colors, or have a logo to share.
                                </p>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                            size="lg"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    Submitting...
                                </>
                            ) : (
                                'Request Quote'
                            )}
                        </Button>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pt-2">
                            <span>⏱️ Response within 24 hours</span>
                            <span>🎨 Free design support for 50+ items</span>
                            <span>💰 Competitive bulk pricing</span>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}