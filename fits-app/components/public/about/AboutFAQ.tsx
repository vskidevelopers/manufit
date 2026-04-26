
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: 'What is the minimum order quantity?',
        answer: 'We accept orders as small as 1 piece! However, bulk orders (50+ items) qualify for special pricing and free design support.',
    },
    {
        question: 'How long does delivery take?',
        answer: 'Most orders are ready within 3-5 business days. Delivery time depends on your location – Nairobi same-day, up-country 2-4 days.',
    },
    {
        question: 'Can I submit my own design?',
        answer: 'Absolutely! Send us your artwork (PNG, AI, or PSD format) and we will handle the rest. Need help? Our design team is here for you.',
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept M-Pesa (Pay Bill), Cash on Delivery, and bank transfers for corporate orders. Secure and flexible.',
    },
    {
        question: 'Do you offer refunds or exchanges?',
        answer: 'Yes! If there is a quality issue or printing error on our end, we will reprint or refund. Contact us within 7 days of delivery.',
    },
    {
        question: 'Can I visit your workshop?',
        answer: 'Yes! Visit our Gaberone location during business hours. For large groups or school visits, please call ahead to schedule.',
    },
];

export function AboutFAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="py-12 md:py-16 lg:py-20 bg-slate-50">
            <div className="container px-4">

                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3">
                        Frequently Asked Questions
                    </h2>
                    <p className="text-slate-600 text-sm md:text-base">
                        Got questions? We have answers.
                    </p>
                </div>

                {/* FAQ List */}
                <div className="max-w-3xl mx-auto space-y-3">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-4 md:p-5 text-left hover:bg-slate-50 transition-colors"
                                aria-expanded={openIndex === index}
                            >
                                <span className="font-medium text-slate-900 pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`h-5 w-5 text-slate-400 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>

                            {openIndex === index && (
                                <div className="px-4 md:px-5 pb-4 md:pb-5 text-sm text-slate-600 leading-relaxed border-t">
                                    {faq.answer}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}