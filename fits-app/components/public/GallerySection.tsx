'use client';

const galleryImages = [
    { src: '/images/gallery-1.jpg', alt: 'Custom t-shirts for corporate event' },
    { src: '/images/gallery-2.jpg', alt: 'Branded hoodies for school team' },
    { src: '/images/gallery-3.jpg', alt: 'Office decor with company logo' },
    { src: '/images/gallery-4.jpg', alt: 'Kids wear collection' },
];

export function GallerySection() {
    return (
        <section className="py-12 md:py-16 bg-slate-50">
            <div className="container px-4">
                {/* Section Header */}
                <div className="text-center max-w-2xl mx-auto mb-8 md:mb-12">
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                        Recent Work
                    </h2>
                    <p className="text-slate-600 text-sm">
                        See what we have created for our customers.
                    </p>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="aspect-square bg-slate-200 rounded-xl overflow-hidden group"
                        >
                            {/* Placeholder - Replace with actual <img> tags */}
                            <div className="w-full h-full bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                                <span className="text-slate-500 text-xs text-center px-2">
                                    Image {index + 1}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Instagram CTA */}
                <div className="text-center mt-8">
                    <a
                        href="https://instagram.com/manufit"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm"
                    >
                        <Instagram className="h-4 w-4" />
                        Follow us on Instagram for more
                    </a>
                </div>
            </div>
        </section>
    );
}