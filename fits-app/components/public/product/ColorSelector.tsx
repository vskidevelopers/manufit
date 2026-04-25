// components/public/product/ColorSelector.tsx
'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';

// Map color names to Tailwind classes
const COLOR_MAP: Record<string, string> = {
    'Black': 'bg-black',
    'White': 'bg-white border-2 border-slate-300',
    'Red': 'bg-red-600',
    'Blue': 'bg-blue-600',
    'Green': 'bg-green-600',
    'Gray': 'bg-gray-500',
    'Navy': 'bg-blue-900',
    'Pink': 'bg-pink-500',
    'Purple': 'bg-purple-600',
    'Yellow': 'bg-yellow-500',
};

interface ColorSelectorProps {
    colors: string[];
    onColorChange?: (color: string) => void;
}

export function ColorSelector({ colors, onColorChange }: ColorSelectorProps) {
    const [selectedColor, setSelectedColor] = useState<string | undefined>(undefined);

    // Defensive: ensure colors is a valid array
    const validColors = Array.isArray(colors) ? colors.filter(Boolean) : [];

    if (!validColors.length) return null;

    const handleSelect = (color: string) => {
        setSelectedColor(color);
        onColorChange?.(color);
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-semibold text-slate-900">Select Color</Label>
            <div className="flex flex-wrap gap-3">
                {validColors.map((color) => {
                    const bgClass = COLOR_MAP[color] || 'bg-slate-400';
                    const isSelected = selectedColor === color;

                    return (
                        <button
                            key={color}
                            onClick={() => handleSelect(color)}
                            className={`
                h-9 w-9 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                ${bgClass}
                ${isSelected ? 'ring-2 ring-blue-600 ring-offset-2 scale-110 shadow-md' : 'hover:scale-105 shadow-sm'}
              `}
                            aria-label={`Select ${color}`}
                            aria-pressed={isSelected}
                            title={color}
                        />
                    );
                })}
            </div>
            {selectedColor && (
                <p className="text-xs text-slate-500">
                    Selected: <span className="font-medium text-slate-900">{selectedColor}</span>
                </p>
            )}
        </div>
    );
}