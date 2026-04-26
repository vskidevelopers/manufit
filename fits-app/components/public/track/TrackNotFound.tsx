
'use client';

import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface TrackNotFoundProps {
    error: string;
    onRetry: () => void;
}

export function TrackNotFound({ error, onRetry }: TrackNotFoundProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-8 text-center space-y-6">

            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8 text-red-600" />
            </div>

            {/* Message */}
            <div>
                <h2 className="text-xl font-semibold text-slate-900">Order Not Found</h2>
                <p className="text-slate-600 mt-2">{error}</p>
            </div>

            {/* Tips */}
            <div className="bg-slate-50 rounded-lg p-4 text-left space-y-2 text-sm">
                <p className="font-medium text-slate-900">Check your details:</p>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                    <li>Order number starts with <code className="bg-white px-1 rounded">MF-</code></li>
                    <li>Phone number matches what you used at checkout</li>
                    <li>No extra spaces or characters</li>
                </ul>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1" onClick={onRetry}>
                    Try Again
                </Button>
                <a href="/contact">
                    <Button variant="default" className="flex-1 bg-blue-600 hover:bg-blue-700">
                        Contact Support
                    </Button>
                </a>
            </div>
        </div>
    );
}