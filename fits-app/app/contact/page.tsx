// app/contact/page.tsx
'use client';

import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export const metadata = {
    title: 'Contact Us | ManuFit',
    description: 'Get in touch with ManuFit for custom apparel inquiries, quotes, and support.',
};

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success('Message sent!', {
            description: 'We will get back to you within 24 hours.',
        });
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Breadcrumb */}
            <div className="container px-4 py-4">
                <Link href="/">
                    <Button variant="ghost" size="sm" className="gap-1 text-slate-600 hover:text-blue-700">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Button>
                </Link>
            </div>

            {/* Header */}
            <header className="bg-gradient-to-br from-slate-900 to-blue-900 py-8 md:py-12">
                <div className="container px-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-white text-center">
                        Contact Us
                    </h1>
                    <p className="text-slate-300 text-center mt-2">
                        We would love to hear from you
                    </p>
                </div>
            </header>

            {/* Content */}
            <div className="container px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">

                    {/* Contact Info */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                            <h2 className="text-lg font-semibold text-slate-900">Get in Touch</h2>

                            <a href="tel:0706406009" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                                <Phone className="h-5 w-5 text-blue-600" />
                                0706 406 009
                            </a>

                            <a href="mailto:hello@manufit.co.ke" className="flex items-center gap-3 text-slate-600 hover:text-blue-600 transition-colors">
                                <Mail className="h-5 w-5 text-blue-600" />
                                hello@manufit.co.ke
                            </a>

                            <div className="flex items-start gap-3 text-slate-600">
                                <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                                <div>
                                    <p>Gaberone, Nairobi</p>
                                    <p className="text-sm text-slate-500">Also serving Accra & Khoja</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-slate-600">
                                <Clock className="h-5 w-5 text-blue-600" />
                                <span>Mon-Sat: 8AM-6PM</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
                        <h2 className="text-lg font-semibold text-slate-900">Send a Message</h2>

                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" placeholder="Your name" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="your@email.com" required />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input id="phone" type="tel" placeholder="07XXXXXXXX" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                                placeholder="Tell us about your order or inquiry..."
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                            Send Message
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}