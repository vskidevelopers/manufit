
'use client';

export function AboutStory() {
    return (
        <section className="py-12 md:py-16 lg:py-20 bg-white">
            <div className="container px-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                {/* Left: Image */}
                <div className="relative aspect-square md:aspect-4/3 lg:aspect-square bg-linear-to-br from-blue-100 to-blue-200 rounded-2xl overflow-hidden">
                    <img
                        src="https://wrmohoehmtaqh7kq.public.blob.vercel-storage.com/manu%20fits%20assets/blob-2026-04-26%20at%203.52.04%20PM.jpg"
                        alt="ManuFit workshop"
                        className="absolute inset-0 h-full w-full object-cover"
                    />
                </div>

                    {/* Right: Story Content */}
                    <div className="space-y-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Our Story
                        </h2>
                        <div className="prose prose-slate text-slate-600 space-y-4">
                            <p>
                                ManuFit was born from a simple idea: <strong className="text-slate-900">everyone deserves quality custom apparel that tells their story.</strong>
                            </p>
                            <p>
                                What started as a small printing operation in Nairobi has grown into Kenya&apos;s trusted partner for custom t-shirts, hoodies, kids wear, office décor, and branded merchandise.
                            </p>
                            <p>
                                We serve individuals, businesses, schools, churches, and organizations across East Africa . Every order, whether 1 piece or 1,000, gets the same attention to detail and commitment to quality.
                            </p>
                            <p>
                                <strong className="text-slate-900">Our promise?</strong> Premium materials, crisp prints, fast turnaround, and delivery you can count on.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}