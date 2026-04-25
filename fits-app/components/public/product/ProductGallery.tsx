// components/public/product/ProductGallery.tsx
'use client';

import { useState } from 'react';
import { Image as ImageIcon, ZoomIn } from 'lucide-react';

interface ProductGalleryProps {
    images: string[];
    productName?: string;
}

export function ProductGallery({ images, productName }: ProductGalleryProps) {
    const [mainImage, setMainImage] = useState(images[0] || '');

    // Defensive: ensure images is a valid array
    const validImages = Array.isArray(images) ? images.filter(Boolean) : [];

    // Fallback if no images
    if (!validImages.length) {
        return (
            <div className="aspect-square bg-slate-200 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-300">
                <div className="text-center space-y-2">
                    <ImageIcon className="h-12 w-12 text-slate-400 mx-auto" />
                    <p className="text-sm text-slate-500">No image available</p>
                </div>
                <span className="sr-only">No image available for {productName}</span>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 group">
                {mainImage ? (
                    <>
                        <img
                            src={mainImage}
                            alt={productName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="eager"
                        />
                        {/* Zoom Hint */}
                        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg">
                                <ZoomIn className="h-4 w-4 text-slate-600" />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="h-12 w-12 text-slate-400" />
                    </div>
                )}
            </div>

            {/* Thumbnails */}
            {validImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {validImages.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => setMainImage(img)}
                            className={`
                shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden border-2 transition-all
                ${mainImage === img
                                    ? 'border-blue-600 ring-2 ring-blue-200 scale-105'
                                    : 'border-transparent hover:border-slate-300'
                                }
              `}
                            aria-label={`View image ${idx + 1} of ${productName}`}
                        >
                            <img
                                src={img}
                                alt={`${productName} - view ${idx + 1}`}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}