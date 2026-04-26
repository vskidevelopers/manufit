


import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AboutHeader } from '@/components/public/about/AboutHeader';
import { AboutStory } from '@/components/public/about/AboutStory';
import { AboutValues } from '@/components/public/about/AboutValues';
import { AboutLocations } from '@/components/public/about/AboutLocations';
import { AboutFAQ } from '@/components/public/about/AboutFAQ';
import { AboutCTA } from '@/components/public/about/AboutCTA';

// ✅ SEO Metadata
export const metadata = {
    title: "About Us | ManuFit - Custom Apparel & Branded Merchandise",
    description: 'Learn about ManuFit Kenya&apos; trusted partner for custom t-shirts, hoodies, and branded merchandise. Quality prints, fast turnaround, Kenya-wide delivery.',
    keywords: ['about ManuFit', 'custom apparel Kenya', 'branded merchandise', 't-shirt printing Nairobi'],
};

export default function AboutPage() {
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
            <AboutHeader />
            <AboutStory />
            <AboutValues />
            <AboutLocations />
            <AboutFAQ />
            <AboutCTA />

        </div>
    );
}