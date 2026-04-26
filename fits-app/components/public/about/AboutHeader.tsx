// components/public/about/AboutHeader.tsx
'use client';

export function AboutHeader() {
    return (
        <header className="bg-linear-to-br from-slate-900 to-blue-900 py-12 md:py-16 lg:py-20">
            <div className="container px-4">
                <div className="max-w-3xl mx-auto text-center space-y-4">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                        About ManuFit
                    </h1>
                    <p className="text-lg md:text-xl text-slate-300">
                        Your trusted partner for custom apparel and branded merchandise across Kenya
                    </p>
                </div>
            </div>
        </header>
    );
}