/* eslint-disable react-hooks/set-state-in-effect */
// components/public/checkout/LocationSelector.tsx
'use client';

import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Truck, Phone, MapPin } from 'lucide-react';

// Nairobi areas we serve
const NAIROBI_LOCATIONS = [
    'Karen', 'Langata', 'Lavington', 'Gigiri', 'Muthaiga',
    'Brookside', 'Spring Valley', 'Loresho', 'Kilimani', 'Kileleshwa',
    'Hurlingham', 'Runda', 'Kitisuru', 'Nyari', 'Kyuna',
    'Lower Kabete', 'Westlands', 'Highridge'
];

interface LocationSelectorProps {
    region: 'nairobi' | 'others';
    location: string; // Nairobi area name or custom text for others
    wantsDelivery: boolean;
    onRegionChange: (region: 'nairobi' | 'others') => void;
    onLocationChange: (location: string) => void;
    onDeliveryToggle: (wants: boolean) => void;
    disabled?: boolean;
    error?: string;
}

export function LocationSelector({
    region,
    location,
    wantsDelivery,
    onRegionChange,
    onLocationChange,
    onDeliveryToggle,
    disabled,
    error,
}: LocationSelectorProps) {
    const [localArea, setLocalArea] = useState('');
    const [customLocation, setCustomLocation] = useState('');

    // Sync external state to local inputs
    useEffect(() => {
        if (region === 'nairobi') {
            setLocalArea(location);
        } else {
            setCustomLocation(location);
        }
    }, [region, location]);

    const handleAreaChange = (area: string) => {
        setLocalArea(area);
        onLocationChange(area);
    };

    const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCustomLocation(value);
        onLocationChange(value);
    };

    return (
        <div className="space-y-4">

            {/* Region Selection - Radio Buttons */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Where are you located? *</Label>
                <RadioGroup
                    value={region}
                    onValueChange={(val) => {
                        onRegionChange(val as 'nairobi' | 'others');
                        // Reset delivery opt-in when region changes
                        if (val === 'others') onDeliveryToggle(false);
                    }}
                    className="flex flex-col sm:flex-row gap-4"
                    disabled={disabled}
                >
                    {/* Nairobi Option */}
                    <Label htmlFor="region-nairobi" className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-300 transition-all bg-white">
                        <RadioGroupItem value="nairobi" id="region-nairobi" className="h-5 w-5" />
                        <div>
                            <span className="font-medium text-slate-900">Nairobi</span>
                            <p className="text-xs text-slate-500">Fixed KSh 300 delivery available</p>
                        </div>
                    </Label>

                    {/* Outside Nairobi Option */}
                    <Label htmlFor="region-others" className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-blue-300 transition-all bg-white">
                        <RadioGroupItem value="others" id="region-others" className="h-5 w-5" />
                        <div>
                            <span className="font-medium text-slate-900">Outside Nairobi</span>
                            <p className="text-xs text-slate-500">Courier rates confirmed via call</p>
                        </div>
                    </Label>
                </RadioGroup>
            </div>

            {/* Nairobi: Location Dropdown + Optional Delivery */}
            {region === 'nairobi' && (
                <div className="space-y-4 pl-4 border-l-2 border-blue-100">

                    {/* Location Dropdown */}
                    <div className="space-y-2">
                        <Label htmlFor="nairobi-area">Your Area *</Label>
                        <Select
                            value={localArea}
                            onValueChange={handleAreaChange}
                            disabled={disabled}
                        >
                            <SelectTrigger className={error && region === 'nairobi' && !localArea ? 'border-red-500' : ''}>
                                <SelectValue placeholder="Select your area" />
                            </SelectTrigger>
                            <SelectContent>
                                {NAIROBI_LOCATIONS.map((area) => (
                                    <SelectItem key={area} value={area}>{area}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Optional Delivery Checkbox */}
                    {localArea && (
                        <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                            <Checkbox
                                id="add-delivery"
                                checked={wantsDelivery}
                                onCheckedChange={(checked) => onDeliveryToggle(checked as boolean)}
                                disabled={disabled}
                                className="mt-1"
                            />
                            <Label htmlFor="add-delivery" className="flex-1 cursor-pointer">
                                <div className="flex items-center gap-2 font-medium text-slate-900">
                                    <Truck className="h-4 w-4 text-green-600" />
                                    Add delivery for KSh 300
                                </div>
                                <p className="text-xs text-slate-500 mt-1">
                                    We&apos;ll deliver to {localArea} within 24-48 hours. Pay on delivery via M-Pesa or Cash.
                                </p>
                            </Label>
                        </div>
                    )}
                </div>
            )}

            {/* Outside Nairobi: Custom Location Input + Info */}
            {region === 'others' && (
                <div className="space-y-3 pl-4 border-l-2 border-blue-100">

                    {/* Custom Location Input */}
                    <div className="space-y-2">
                        <Label htmlFor="custom-location">Your Location *</Label>
                        <Input
                            id="custom-location"
                            type="text"
                            placeholder="e.g., Mombasa, Nakuru, Eldoret..."
                            value={customLocation}
                            onChange={handleCustomChange}
                            className={error && region === 'others' && !customLocation ? 'border-red-500' : ''}
                            disabled={disabled}
                        />
                    </div>

                    {/* Info Box */}
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-xs text-blue-800">
                        <div className="flex items-start gap-2">
                            <Phone className="h-4 w-4 mt-0.5 shrink-0" />
                            <p>
                                <span className="font-medium">Delivery fee confirmed via call.</span>
                                <br />
                                We&apos;ll contact you to confirm the courier rate for {customLocation || 'your area'} before dispatch.
                                <span className="font-semibold"> You approve before we send.</span>
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    );
}