
'use client';

import { Button } from '@/components/ui/button';
import { ArrowRight, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export function AboutCTA() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-linear-to-r from-blue-600 to-blue-700">
            <div className="container px-4">
                <div className="max-w-3xl mx-auto text-center space-y-6">

                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                        Ready to Bring Your Ideas to Life?
                    </h2>

                    <p className="text-blue-100 text-sm md:text-base">
                        Whether you need 1 custom t-shirt or 1,000 branded hoodies for your team; we are here to help.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                        <Link href="/shop">
                            <Button size="lg" className="w-full sm:w-auto gap-2 bg-white text-blue-700 hover:bg-slate-100">
                                Browse Products
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </Link>
                        <Link href="/contact">
                            <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2 border-white/30 text-white hover:bg-white/20">
                                Get a Quote
                            </Button>
                        </Link>
                    </div>

                    {/* Contact Info */}
                    <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-blue-100">
                        <a href="tel:0706406009" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Phone className="h-4 w-4" />
                            0706 406 009
                        </a>
                        <a href="mailto:hello@manufit.co.ke" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail className="h-4 w-4" />
                            hello@manufit.co.ke
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}