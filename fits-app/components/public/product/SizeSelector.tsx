// components/public/product/SizeSelector.tsx
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SizeSelectorProps {
    sizes: string[];
    onSizeChange?: (size: string) => void;
}

export function SizeSelector({ sizes, onSizeChange }: SizeSelectorProps) {
    const [selectedSize, setSelectedSize] = useState<string | undefined>(undefined);

    // Defensive: ensure sizes is a valid array
    const validSizes = Array.isArray(sizes) ? sizes.filter(Boolean) : [];

    if (!validSizes.length) return null;

    const handleSelect = (size: string) => {
        setSelectedSize(size);
        onSizeChange?.(size);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-slate-900">Select Size</Label>
                <button className="text-xs text-blue-600 hover:text-blue-700 underline">
                    Size Guide
                </button>
            </div>
            <div className="flex flex-wrap gap-2">
                {validSizes.map((size) => (
                    <Button
                        key={size}
                        variant={selectedSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSelect(size)}
                        className={`min-w-[3rem] h-10 ${selectedSize === size ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        aria-pressed={selectedSize === size}
                    >
                        {size}
                    </Button>
                ))}
            </div>
            {selectedSize && (
                <p className="text-xs text-slate-500">
                    Selected: <span className="font-medium text-slate-900">{selectedSize}</span>
                </p>
            )}
        </div>
    );
}