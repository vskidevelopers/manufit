
'use client';

import { Shield, Clock, Palette, Headphones, Truck, Heart } from 'lucide-react';

const values = [
    {
        icon: Shield,
        title: 'Quality First',
        description: 'We use premium materials and modern printing technology to ensure every product lasts wash after wash.',
        color: 'text-blue-600 bg-blue-100',
    },
    {
        icon: Clock,
        title: 'Fast Turnaround',
        description: 'Most orders ready within 3-5 business days. Rush orders available for urgent needs.',
        color: 'text-green-600 bg-green-100',
    },
    {
        icon: Palette,
        title: 'Custom Designs',
        description: 'Free design support for bulk orders. Your vision, brought to life by our creative team.',
        color: 'text-purple-600 bg-purple-100',
    },
    {
        icon: Truck,
        title: 'Kenya-Wide Delivery',
        description: 'Reliable shipping to Nairobi, Mombasa, Kisumu, and beyond. Track your order every step.',
        color: 'text-orange-600 bg-orange-100',
    },
    {
        icon: Headphones,
        title: 'Dedicated Support',
        description: 'We are here to help via phone, WhatsApp, or email. Real humans, real solutions.',
        color: 'text-teal-600 bg-teal-100',
    },
    {
        icon: Heart,
        title: 'Customer Obsessed',
        description: 'Your satisfaction is our success. We go the extra mile to make every order perfect.',
        color: 'text-pink-600 bg-pink-100',
    },
];

export function AboutValues() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
            <div className="container px-4">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                        Why Customers Trust Us
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Built on values that matter – quality, speed, and service you can count on.
                    </p>
                </div>

                {/* Values Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {values.map((value, index) => {
                        const Icon = value.icon;
                        return (
                            <div
                                key={index}
                                className="group p-6 rounded-xl border border-slate-200 bg-white hover:border-blue-300 hover:shadow-lg transition-all duration-300"
                            >
                                <div className={`h-12 w-12 rounded-lg ${value.color} flex items-center justify-center mb-4`}>
                                    <Icon className="h-6 w-6" />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                                    {value.title}
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed">
                                    {value.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}