'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mail } from 'lucide-react';
import { toast } from 'sonner';

export function NewsletterSection() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setLoading(true);
        console.log('📧 [CLIENT] Newsletter signup:', email);

        // TODO: Connect to email service (e.g., Mailchimp, SendGrid)
        await new Promise((resolve) => setTimeout(resolve, 1000));

        toast.success('Thanks for subscribing!', {
            description: 'Check your inbox for a 10% discount code.',
        });

        setEmail('');
        setLoading(false);
    };

    return (
        <section className="flex justify-center py-12 md:py-16 bg-white">
            <div className="container px-4">
                <div className="max-w-2xl mx-auto text-center space-y-6">
                    <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 text-blue-600">
                        <Mail className="h-6 w-6" />
                    </div>

                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                        Get 10% Off Your First Order
                    </h2>

                    <p className="text-slate-600 text-sm">
                        Subscribe to our newsletter for exclusive deals, design tips, and new product launches.
                    </p>

                    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="flex-1"
                            disabled={loading}
                        />
                        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
                            {loading ? 'Subscribing...' : 'Subscribe'}
                        </Button>
                    </form>

                    <p className="text-xs text-slate-500">
                        No spam. Unsubscribe anytime.
                    </p>
                </div>
            </div>
        </section>
    );
}