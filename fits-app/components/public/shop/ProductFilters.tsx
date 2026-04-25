// components/public/shop/ProductFilters.tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CATEGORIES = [
    { value: 't-shirt', label: 'T-Shirts' },
    { value: 'hoodie', label: 'Hoodies' },
    { value: 'kids', label: 'Kids Wear' },
    { value: 'decor', label: 'Office Decor' },
    { value: 'merchandise', label: 'Merchandise' },
];

const SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Green', 'Gray'];

interface ProductFiltersProps {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    sizes?: string[];
    colors?: string[];
    isMobile?: boolean;
}

export function ProductFilters({
    category,
    minPrice,
    maxPrice,
    sizes,
    colors,
    isMobile = false,
}: ProductFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const updateFilter = (key: string, value: string | string[] | undefined) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value || (Array.isArray(value) && value.length === 0)) {
            params.delete(key);
        } else if (Array.isArray(value)) {
            params.delete(key);
            value.forEach(v => params.append(key, v));
        } else {
            params.set(key, value);
        }

        // Reset to page 1 when filters change
        params.delete('page');

        router.push(`/shop?${params.toString()}`);
    };

    const handleCategoryChange = (catValue: string, checked: boolean) => {
        const current = searchParams.getAll('category');
        const updated = checked
            ? [...current, catValue]
            : current.filter(c => c !== catValue);
        updateFilter('category', updated);
    };

    const handleSizeChange = (size: string, checked: boolean) => {
        const current = searchParams.getAll('size');
        const updated = checked
            ? [...current, size]
            : current.filter(s => s !== size);
        updateFilter('size', updated);
    };

    const handleColorChange = (color: string, checked: boolean) => {
        const current = searchParams.getAll('color');
        const updated = checked
            ? [...current, color]
            : current.filter(c => c !== color);
        updateFilter('color', updated);
    };

    const handlePriceChange = (type: 'min' | 'max', value: string) => {
        const numValue = value ? Number(value) : undefined;
        if (type === 'min') {
            updateFilter('minPrice', numValue?.toString());
        } else {
            updateFilter('maxPrice', numValue?.toString());
        }
    };

    const clearAll = () => {
        router.push('/shop');
    };

    return (
        <div className="space-y-6">
            {/* Category */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-3">Category</h3>
                <div className="space-y-2">
                    {CATEGORIES.map((cat) => (
                        <div key={cat.value} className="flex items-center space-x-2">
                            <Checkbox
                                id={`cat-${cat.value}`}
                                checked={category === cat.value || (Array.isArray(category) && category.includes(cat.value))}
                                onCheckedChange={(checked) => handleCategoryChange(cat.value, checked as boolean)}
                            />
                            <Label htmlFor={`cat-${cat.value}`} className="text-sm text-slate-700 cursor-pointer">
                                {cat.label}
                            </Label>
                        </div>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Price Range */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-3">Price Range</h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        defaultValue={minPrice}
                        onBlur={(e) => handlePriceChange('min', e.target.value)}
                        className="h-8 text-sm"
                    />
                    <span className="text-slate-400">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        defaultValue={maxPrice}
                        onBlur={(e) => handlePriceChange('max', e.target.value)}
                        className="h-8 text-sm"
                    />
                </div>
                <p className="text-xs text-slate-500 mt-1">In KSh</p>
            </div>

            <Separator />

            {/* Sizes */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                    {SIZES.map((size) => (
                        <Button
                            key={size}
                            variant={sizes?.includes(size) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSizeChange(size, !sizes?.includes(size))}
                            className="text-xs"
                        >
                            {size}
                        </Button>
                    ))}
                </div>
            </div>

            <Separator />

            {/* Colors */}
            <div>
                <h3 className="font-semibold text-slate-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-2">
                    {COLORS.map((color) => (
                        <Button
                            key={color}
                            variant={colors?.includes(color) ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleColorChange(color, !colors?.includes(color))}
                            className="text-xs"
                        >
                            {color}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Clear Filters */}
            {(category || minPrice || maxPrice || sizes?.length || colors?.length) && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="w-full text-blue-600">
                    Clear All Filters
                </Button>
            )}
        </div>
    );
}