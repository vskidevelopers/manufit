// components/public/ValuePropsSection.tsx
'use client';

import { Truck, Shield, Clock, CreditCard, Palette, Headphones } from 'lucide-react';

const valueProps = [
    {
        icon: Truck,
        title: 'Nationwide Delivery',
        description: 'Fast shipping to Nairobi, Mombasa, Kisumu, and beyond.',
        color: 'text-blue-600 bg-blue-100',
    },
    {
        icon: Shield,
        title: 'Quality Guarantee',
        description: 'Premium materials and prints that last wash after wash.',
        color: 'text-green-600 bg-green-100',
    },
    {
        icon: Clock,
        title: 'Fast Turnaround',
        description: 'Most orders ready within 3-5 business days.',
        color: 'text-purple-600 bg-purple-100',
    },
    {
        icon: CreditCard,
        title: 'Flexible Payment',
        description: 'Pay via M-Pesa or Cash on Delivery.',
        color: 'text-orange-600 bg-orange-100',
    },
    {
        icon: Palette,
        title: 'Custom Designs',
        description: 'Free design support for bulk orders.',
        color: 'text-pink-600 bg-pink-100',
    },
    {
        icon: Headphones,
        title: 'Dedicated Support',
        description: 'We are here to help via phone or WhatsApp.',
        color: 'text-teal-600 bg-teal-100',
    },
];

export function ValuePropsSection() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                        Why Choose ManuFit?
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        We make custom apparel simple, affordable, and stress-free.
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {valueProps.map((prop, index) => {
                        const Icon = prop.icon;
                        return (
                            <div
                                key={index}
                                className="group p-6 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`h-12 w-12 rounded-lg ${prop.color} flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {prop.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {prop.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}