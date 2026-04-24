// components/public/B2BBanner.tsx
'use client';

import { Button } from '@/components/ui/button';
import { Package, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function B2BBanner() {
    return (
        <section className="py-12 md:py-16 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="container px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
                    {/* Content */}
                    <div className="text-center lg:text-left space-y-4 max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-white text-sm font-medium">
                            <Package className="h-4 w-4" />
                            <span>Bulk Orders & Corporate Branding</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            Need 50+ Items for Your Team?
                        </h2>
                        <p className="text-blue-100 text-sm md:text-base">
                            Get custom quotes, free design support, and special pricing for bulk orders.
                            Perfect for companies, schools, events, and organizations.
                        </p>
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                        <Link href="/contact">
                            <Button size="lg" variant="secondary" className="gap-2 w-full sm:w-auto">
                                Request a Quote
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}