// components/public/track/TrackContent.tsx
'use client';

import { useState } from 'react';
import { trackOrderAction } from '@/actions/order-actions';
import { TrackHeader } from './TrackHeader';
import { TrackForm } from './TrackForm';
import { TrackResult } from './TrackResult';
import { TrackNotFound } from './TrackNotFound';
import { Loader2 } from 'lucide-react';

export function TrackContent() {
    const [orderNumber, setOrderNumber] = useState('');
    const [phone, setPhone] = useState('');
    const [result, setResult] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderNumber.trim() || !phone.trim()) {
            setError('Please enter both order number and phone number');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        console.log('🔍 [TRACK] Looking up:', { orderNumber, phone });

        try {
            const data = await trackOrderAction(orderNumber.trim(), phone.trim());

            if (data.success && data.order) {
                console.log('✅ [TRACK] Order found:', data.order.orderNumber);
                setResult(data.order);
            } else {
                console.warn('⚠️ [TRACK] Order not found:', data.error);
                setError(data.error || 'Order not found. Please check your details and try again.');
            }
        } catch (err) {
            console.error('❌ [TRACK] Unexpected error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleReset = () => {
        setOrderNumber('');
        setPhone('');
        setResult(null);
        setError(null);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <TrackHeader />

            {/* Main Content */}
            <div className="container px-4 py-8 md:py-12">
                <div className="max-w-2xl mx-auto">

                    {/* Show Form if no result yet */}
                    {!result && !loading && (
                        <TrackForm
                            orderNumber={orderNumber}
                            phone={phone}
                            onOrderNumberChange={setOrderNumber}
                            onPhoneChange={setPhone}
                            onSubmit={handleTrack}
                            isLoading={loading}
                            error={error}
                        />
                    )}

                    {/* Show Loading State */}
                    {loading && (
                        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-4">
                            <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                            <p className="font-medium text-slate-900">Looking up your order...</p>
                            <p className="text-sm text-slate-500">Please wait while we fetch your order details</p>
                        </div>
                    )}

                    {/* Show Result if found */}
                    {result && (
                        <TrackResult order={result} onNewSearch={handleReset} />
                    )}

                    {/* Show Not Found if error */}
                    {error && !loading && !result && (
                        <TrackNotFound error={error} onRetry={handleReset} />
                    )}

                </div>
            </div>
        </div>
    );
}