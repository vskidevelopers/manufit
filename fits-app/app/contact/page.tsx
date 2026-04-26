
import { ContactForm } from '@/components/public/contact/ContactForm';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

// ✅ SEO Metadata (Server Components only)
export const metadata = {
    title: 'Contact Us | ManuFit',
    description: 'Get in touch with ManuFit for custom apparel inquiries, quotes, and support.',
};

export default function ContactPage() {
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

                    {/* Contact Form (Client Component) */}
                    <ContactForm />

                </div>
            </div>
        </div>
    );
}