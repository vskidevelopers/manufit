// components/public/product/SizeSelector.tsx
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

interface SizeSelectorProps {
    sizes: string[];
    selectedSize?: string;
    onSizeChange?: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
    const [localSize, setLocalSize] = useState<string | undefined>(undefined);

    const activeSize = selectedSize ?? localSize;

    const handleSelect = (size: string) => {
        setLocalSize(size);
        onSizeChange?.(size);
    };

    // Defensive: ensure sizes is a valid array
    const validSizes = Array.isArray(sizes) ? sizes.filter(Boolean) : [];

    if (!validSizes.length) return null;

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
                        variant={activeSize === size ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => handleSelect(size)}
                        className={`min-w-[3rem] h-10 ${activeSize === size ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
                        aria-pressed={activeSize === size}
                    >
                        {size}
                    </Button>
                ))}
            </div>
            {activeSize && (
                <p className="text-xs text-slate-500">
                    Selected: <span className="font-medium text-slate-900">{activeSize}</span>
                </p>
            )}
        </div>
    );
}