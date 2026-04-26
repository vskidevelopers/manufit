
'use client';

import { MapPin, Phone, Clock } from 'lucide-react';

const locations = [
    {
        city: 'Gaberone, Nairobi',
        address: 'Main Distribution Center',
        phone: '0706 406 009',
        hours: 'Mon-Sat: 8AM-6PM',
    },
    {
        city: 'Accra',
        address: 'Regional Office',
        phone: '0706 406 009',
        hours: 'Mon-Fri: 9AM-5PM',
    },
    {
        city: 'Khoja',
        address: 'Pickup Point',
        phone: '0706 406 009',
        hours: 'Mon-Sat: 9AM-6PM',
    },
];

export function AboutLocations() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container px-4">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                        Find Us
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Multiple locations to serve you better. Visit, call, or order online.
                    </p>
                </div>

                {/* Locations Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {locations.map((location, index) => (
                        <div
                            key={index}
                            className="p-6 rounded-xl border border-slate-200 bg-slate-50 space-y-4"
                        >
                            <div className="flex items-center gap-2 text-blue-600">
                                <MapPin className="h-5 w-5" />
                                <h3 className="font-semibold text-slate-900">{location.city}</h3>
                            </div>

                            <div className="space-y-3 text-sm text-slate-600">
                                <p>{location.address}</p>

                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-slate-400" />
                                    <a href={`tel:${location.phone}`} className="hover:text-blue-600 transition-colors">
                                        {location.phone}
                                    </a>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-slate-400" />
                                    <span>{location.hours}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}