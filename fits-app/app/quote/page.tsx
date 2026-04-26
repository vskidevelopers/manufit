
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { QuoteHeader } from '@/components/public/quote/QuoteHeader';
import { QuoteForm } from '@/components/public/quote/QuoteForm';
import { QuoteBenefits } from '@/components/public/quote/QuoteBenefits';

// ✅ SEO Metadata
export const metadata = {
    title: 'Request a Quote | ManuFit - Bulk Orders & Custom Branding',
    description: 'Get a custom quote for bulk orders, corporate branding, school uniforms, or event merchandise. Free design support for orders 50+.',
    keywords: ['bulk t-shirt quote', 'corporate branding Kenya', 'custom merchandise quote', 'ManuFit bulk order'],
};

export default function QuotePage() {
    return (
        <div className="min-h-screen bg-slate-50">

            {/* Breadcrumb Nav */}
            <div className="container px-4 py-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Page Sections */}
            <QuoteHeader />
            <QuoteForm />
            <QuoteBenefits />

        </div>
    );
}