
'use client';

import { Palette, TrendingUp, Clock, Shield } from 'lucide-react';

const benefits = [
    {
        icon: Palette,
        title: 'Free Design Support',
        description: 'Our creative team helps bring your vision to life – no extra cost for bulk orders.',
    },
    {
        icon: TrendingUp,
        title: 'Volume Discounts',
        description: 'The more you order, the more you save. Custom pricing for 50, 100, 500+ items.',
    },
    {
        icon: Clock,
        title: 'Fast Turnaround',
        description: 'Rush orders available. Most bulk orders completed within 5-10 business days.',
    },
    {
        icon: Shield,
        title: 'Quality Guarantee',
        description: 'Premium materials and prints. We reprint or refund if you are not satisfied.',
    },
];

export function QuoteBenefits() {
    return (
        <section className="py-12 md:py-16 bg-slate-50">
            <div className="container px-4">
                <div className="text-center max-w-2xl mx-auto mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                        Why Request a Quote?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Bulk orders deserve personalized attention. Here is what you get:
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <div key={index} className="bg-white p-6 rounded-xl border border-slate-200 text-center space-y-3">
                                <div className="h-12 w-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="font-semibold text-slate-900">{benefit.title}</h3>
                                <p className="text-sm text-slate-600">{benefit.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}