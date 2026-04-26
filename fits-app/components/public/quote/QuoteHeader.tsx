
'use client';

export function QuoteHeader() {
    return (
        <header className="bg-linear-to-br from-slate-900 to-blue-900 py-12 md:py-16">
            <div className="container px-4">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        Request a Quote
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300">
                        Bulk orders, corporate branding, and custom merchandise – get personalized pricing within 24 hours
                    </p>
                </div>
            </div>
        </header>
    );
}