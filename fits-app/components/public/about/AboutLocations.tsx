// components/public/about/AboutLocations.tsx
'use client';

import { MapPin, Truck, Phone, Clock, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function AboutLocations() {
    // iDRIP's single hub location
    const hub = {
        name: 'iDRIP Nairobi Hub',
        address: 'Ridge Hse, 2nd Flr, Rm 2-4, Munyu Rd, Nairobi',
        phone: '0799 336 502',
        whatsapp: '254799336502',
        hours: 'Mon-Sat: 8AM-6PM | Sun: 10AM-4PM',
        coordinates: { lat: -1.286389, lng: 36.817223 }, // Approx Nairobi center
    };

    // Delivery coverage highlights
    const coverageAreas = [
        'Nairobi County (Same-day delivery)',
        'Kiambu, Kajiado, Machakos (Next-day)',
        'Mombasa, Kisumu, Nakuru, Eldoret (2-3 days)',
        'Nationwide via trusted courier partners',
    ];

    // Service promises
    const promises = [
        { icon: CheckCircle, text: 'Quality inspected before dispatch' },
        { icon: Truck, text: 'Secure packaging for safe delivery' },
        { icon: Phone, text: 'Real-time order tracking via SMS/WhatsApp' },
        { icon: Clock, text: 'Flexible delivery windows' },
    ];

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-slate-50 to-white">
            <div className="container px-4">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                        One Hub, Nationwide Reach
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        We operate from our Nairobi hub to serve customers across Kenya with reliable, tracked delivery.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

                    {/* Left: Hub Location Card */}
                    <div className="space-y-6">
                        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-start gap-4">
                                <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                                    <MapPin className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold text-lg text-slate-900">{hub.name}</h3>
                                    <p className="text-slate-600 mt-1 text-sm">{hub.address}</p>

                                    <div className="mt-4 space-y-3">
                                        <a
                                            href={`tel:${hub.phone}`}
                                            className="flex items-center gap-2 text-sm text-slate-700 hover:text-blue-600 transition-colors"
                                        >
                                            <Phone className="h-4 w-4 text-slate-400" />
                                            {hub.phone}
                                        </a>
                                        <a
                                            href={`https://wa.me/${hub.whatsapp}?text=Hello iDRIP, I have a question about my order.`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-slate-700 hover:text-green-600 transition-colors"
                                        >
                                            <svg
                                                className="h-4 w-4 text-green-500"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                                xmlns="http://w3.org"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Chat on WhatsApp
                                        </a>
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            {hub.hours}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Service Promises */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {promises.map((item, idx) => {
                                const Icon = item.icon;
                                return (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-slate-100">
                                        <Icon className="h-4 w-4 text-blue-600 shrink-0" />
                                        <span className="text-sm text-slate-700">{item.text}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right: Delivery Coverage + Map Placeholder */}
                    <div className="space-y-6">

                        {/* Coverage Card */}
                        <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                    <Truck className="h-5 w-5 text-green-600" />
                                </div>
                                <h3 className="font-semibold text-lg text-slate-900">Delivery Coverage</h3>
                            </div>

                            <ul className="space-y-3">
                                {coverageAreas.map((area, idx) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
                                        <span>{area}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Delivery Fee Note */}
                            <div className="mt-5 p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
                                <p className="font-medium">💡 Delivery Fees:</p>
                                <p className="mt-1">
                                    Nairobi: Fixed KSh 300 • Upcountry: Confirmed via call before dispatch.
                                    You always approve the fee before we send.
                                </p>
                            </div>
                        </div>

                        {/* Map Placeholder / Visual */}
                        <div className="relative h-48 md:h-56 rounded-2xl overflow-hidden border border-slate-200 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
                            {/* Decorative map-like pattern */}
                            <div className="absolute inset-0 opacity-10">
                                <svg width="100%" height="100%" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#94a3b8" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#grid)" />
                                </svg>
                            </div>

                            {/* Hub marker */}
                            <div className="relative z-10 text-center">
                                <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mx-auto mb-2 animate-pulse">
                                    <MapPin className="h-4 w-4 text-white" />
                                </div>
                                <p className="text-xs font-medium text-slate-700">iDRIP Hub</p>
                                <p className="text-[10px] text-slate-500">Nairobi, Kenya</p>
                            </div>

                            {/* Country outline hint */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="h-32 w-32 border-2 border-dashed border-blue-200 rounded-full opacity-50" />
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <Link href="/shop" className="flex-1">
                                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                                    Shop Now
                                </Button>
                            </Link>
                            <a
                                href={`https://wa.me/${hub.whatsapp}?text=Hello iDRIP, I'd like to inquire about delivery to my area.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                            >
                                <Button variant="outline" className="w-full gap-2">
                                    <svg
                                        className="h-4 w-4 text-green-500"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        xmlns="http://w3.org"
                                    >
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.456 5.705 1.457h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>

                                    Ask About Delivery
                                </Button>
                            </a>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}