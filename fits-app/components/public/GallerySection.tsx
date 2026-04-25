'use client';

const galleryImages = [
    { src: '/images/gallery-1.jpg', alt: 'Custom t-shirts for corporate event' },
    { src: '/images/gallery-2.jpg', alt: 'Branded hoodies for school team' },
    { src: '/images/gallery-3.jpg', alt: 'Office decor with company logo' },
    { src: '/images/gallery-4.jpg', alt: 'Kids wear collection' },
];

export function GallerySection() {
    return (
        <section className="flex justify-center py-12 md:py-16 bg-slate-50">
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
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                        Follow us on Instagram for more
                    </a>
                </div>
            </div>
        </section>
    );
}