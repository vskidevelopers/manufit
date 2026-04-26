
'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, Package, Phone } from 'lucide-react';

interface TrackFormProps {
    orderNumber: string;
    phone: string;
    onOrderNumberChange: (value: string) => void;
    onPhoneChange: (value: string) => void;
    onSubmit: (e: React.FormEvent) => void;
    isLoading: boolean;
    error?: string | null;
}

export function TrackForm({
    orderNumber,
    phone,
    onOrderNumberChange,
    onPhoneChange,
    onSubmit,
    isLoading,
    error,
}: TrackFormProps) {
    return (
        <form onSubmit={onSubmit} className="bg-white rounded-xl border border-slate-200 p-6 md:p-8 space-y-6">

            {/* Header */}
            <div className="text-center space-y-2">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                    <Search className="h-6 w-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Enter Your Order Details</h2>
                <p className="text-sm text-slate-500">
                    Find your order using the number from your confirmation SMS/email
                </p>
            </div>

            {/* Order Number Field */}
            <div className="space-y-2">
                <Label htmlFor="orderNumber">Order Number *</Label>
                <div className="relative">
                    <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        id="orderNumber"
                        type="text"
                        placeholder="e.g., MF-260426-626"
                        value={orderNumber}
                        onChange={(e) => onOrderNumberChange(e.target.value.toUpperCase())}
                        className="pl-10 font-mono tracking-wide uppercase"
                        disabled={isLoading}
                        required
                    />
                </div>
                <p className="text-xs text-slate-500">
                    Starts with <code className="bg-slate-100 px-1 rounded">MF-</code>
                </p>
            </div>

            {/* Phone Number Field */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="e.g., 0706406009"
                        value={phone}
                        onChange={(e) => onPhoneChange(e.target.value)}
                        className="pl-10"
                        disabled={isLoading}
                        required
                    />
                </div>
                <p className="text-xs text-slate-500">
                    The phone number used when placing the order
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Submit Button */}
            <Button
                type="submit"
                className="w-full h-12 text-base bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                size="lg"
                disabled={isLoading}
            >
                {isLoading ? 'Searching...' : 'Track My Order'}
            </Button>

            {/* Help Text */}
            <div className="text-center text-xs text-slate-500 pt-2">
                <p>Can&apos;t find your order?</p>
                <a href="/contact" className="text-blue-600 hover:underline">
                    Contact support for help
                </a>
            </div>
        </form>
    );
}