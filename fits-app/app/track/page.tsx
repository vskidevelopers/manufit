
import { TrackContent } from '@/components/public/track/TrackContent';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ✅ SEO Metadata (Server Components only)
export const metadata = {
    title: 'Track Order | ManuFit',
    description: 'Track your ManuFit order status. Enter your order number and phone number to see real-time updates.',
    robots: 'noindex', // Prevent indexing of tracking pages
};

export default function TrackPage() {
    return (
        <>
            {/* Breadcrumb Nav */}
            <div className="container px-4 py-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Tracking Content */}
            <TrackContent />
        </>
    );
}