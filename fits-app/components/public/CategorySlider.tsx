'use client';

import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Shirt, Armchair, Coffee, Gift, Baby } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'T-Shirts', href: '/shop?category=t-shirt', icon: Shirt, color: 'bg-blue-100 text-blue-600' },
    { name: 'Hoodies', href: '/shop?category=hoodie', icon: Shirt, color: 'bg-purple-100 text-purple-600' },
    { name: 'Kids Wear', href: '/shop?category=kids', icon: Baby, color: 'bg-pink-100 text-pink-600' },
    { name: 'Office Decor', href: '/shop?category=decor', icon: Armchair, color: 'bg-teal-100 text-teal-600' },
    { name: 'Merchandise', href: '/shop?category=merchandise', icon: Gift, color: 'bg-orange-100 text-orange-600' },
    { name: 'Custom', href: '/contact', icon: Coffee, color: 'bg-slate-100 text-slate-600' },
];

export function CategorySlider() {
    return (
        <section className="flex justify-center py-12 md:py-16 bg-slate-50">
            <div className="container px-4">
                {/* Section Header */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Browse by Category
                    </h2>
                    <p className="text-slate-600 text-sm">
                        Find exactly what you are looking for.
                    </p>
                </div>

                {/* Horizontal Scroll */}
                <ScrollArea className="w-full whitespace-nowrap">
                    <div className="flex gap-4 pb-4">
                        {categories.map((category) => {
                            const Icon = category.icon;
                            return (
                                <Link
                                    key={category.name}
                                    href={category.href}
                                    className="flex-shrink-0 w-32 md:w-40 group"
                                >
                                    <div className="bg-white rounded-xl p-6 border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 text-center">
                                        <div className={`h-14 w-14 rounded-full ${category.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h3>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                    <ScrollBar orientation="horizontal" className="md:hidden" />
                </ScrollArea>
            </div>
        </section>
    );
}