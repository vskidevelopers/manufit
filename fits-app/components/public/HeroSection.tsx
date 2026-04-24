// components/public/HeroSection.tsx
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Shirt, Truck, Shield } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-slate-50 py-12 md:py-20 lg:py-28">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    {/* Left: Content */}
                    <div className="space-y-6 text-center lg:text-left">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                            <Shirt className="h-4 w-4" />
                            <span>Premium Custom Apparel</span>
                        </div>

                        {/* Headline - h1 for SEO */}
                        <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-slate-900 leading-tight">
                            Wear Your Story,
                            <br />
                            <span className="text-blue-600">Your Way</span>
                        </h1>

                        {/* Subheadline */}
                        <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
                            Custom t-shirts, hoodies, and branded merchandise for individuals and organizations.
                            Quality prints, fast turnaround, Kenya-wide delivery.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                            <Link href="/shop">
                                <Button size="lg" className="w-full sm:w-auto gap-2 bg-blue-600 hover:bg-blue-700">
                                    Shop Now
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Link>
                            <Link href="/contact">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                                    Get Bulk Quote
                                </Button>
                            </Link>
                        </div>

                        {/* Trust Indicators */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 text-sm text-slate-500">
                            <div className="flex items-center gap-1.5">
                                <Truck className="h-4 w-4" />
                                <span>Kenya-wide Delivery</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4" />
                                <span>Quality Guarantee</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Hero Image */}
                    <div className="relative lg:order-last">
                        <div className="relative aspect-square md:aspect-[4/3] lg:aspect-square max-w-md mx-auto">
                            {/* Placeholder - Replace with actual hero image */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-blue-400 rounded-2xl md:rounded-3xl shadow-2xl" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Shirt className="h-24 w-24 md:h-32 md:w-32 text-white/80" />
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -bottom-4 -left-4 bg-white rounded-xl shadow-lg p-4 hidden md:block">
                                <p className="text-2xl font-bold text-blue-600">500+</p>
                                <p className="text-xs text-slate-500">Happy Customers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}