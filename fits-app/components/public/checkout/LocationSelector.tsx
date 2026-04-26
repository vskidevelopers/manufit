// components/public/checkout/LocationSelector.tsx
'use client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

// Hardcoded locations as requested
const LOCATIONS = [
    { value: 'Karen', label: 'Karen' },
    { value: 'Langata', label: 'Langata' },
    { value: 'Lavington', label: 'Lavington' },
    { value: 'Gigiri', label: 'Gigiri' },
    { value: 'Muthaiga', label: 'Muthaiga' },
    { value: 'Brookside', label: 'Brookside' },
    { value: 'Spring Valley', label: 'Spring Valley' },
    { value: 'Loresho', label: 'Loresho' },
    { value: 'Kilimani', label: 'Kilimani' },
    { value: 'Kileleshwa', label: 'Kileleshwa' },
    { value: 'Hurlingham', label: 'Hurlingham' },
    { value: 'Runda', label: 'Runda' },
    { value: 'Kitisuru', label: 'Kitisuru' },
    { value: 'Nyari', label: 'Nyari' },
    { value: 'Kyuna', label: 'Kyuna' },
    { value: 'Lower Kabete', label: 'Lower Kabete' },
    { value: 'Westlands', label: 'Westlands' },
    { value: 'Highridge', label: 'Highridge' },
];

interface LocationSelectorProps {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    error?: string;
}

export function LocationSelector({ value, onChange, disabled, error }: LocationSelectorProps) {
    return (
        <div className="space-y-2">
            <Select
                value={value}
                onValueChange={onChange}
                disabled={disabled}
            >
                <SelectTrigger className={error ? 'border-red-500 focus:ring-red-500' : ''}>
                    <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                    {LOCATIONS.map((location) => (
                        <SelectItem key={location.value} value={location.value}>
                            {location.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}