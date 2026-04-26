// components/public/checkout/PaymentMethodSelector.tsx
'use client';

import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Banknote, Smartphone, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface PaymentMethodSelectorProps {
    value: 'mpesa' | 'cod';
    mpesaCode?: string;
    grandTotal: number; // ✅ Actual cart total (subtotal + delivery)
    onMethodChange: (value: 'mpesa' | 'cod') => void;
    onCodeChange?: (code: string) => void;
    disabled?: boolean;
}

// Your M-Pesa Till Number
const MPESA_TILL_NUMBER = '123456'; // 🔴 Replace with your actual Till Number

export function PaymentMethodSelector({
    value,
    mpesaCode = '',
    grandTotal,
    onMethodChange,
    onCodeChange,
    disabled,
}: PaymentMethodSelectorProps) {
    const copyTillNumber = async () => {
        await navigator.clipboard.writeText(MPESA_TILL_NUMBER);
        toast.success('Till Number copied!', { description: MPESA_TILL_NUMBER });
    };

    const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

    return (
        <RadioGroup
            value={value}
            onValueChange={(val) => onMethodChange(val as 'mpesa' | 'cod')}
            className="space-y-4"
            disabled={disabled}
        >
            {/* M-Pesa Option */}
            <div className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${value === 'mpesa'
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-blue-300'
                }`}>
                <RadioGroupItem value="mpesa" id="mpesa" className="mt-1" disabled={disabled} />
                <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                    <div className="flex flex-col md:flex-row items-center gap-2 font-medium text-slate-900">
                        <Smartphone className="h-4 w-4 text-green-600" />
                        M-Pesa
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Pay securely via M-Pesa Pay Bill
                    </p>

                    {/* M-Pesa Instructions (shown when selected) */}
                    {value === 'mpesa' && (
                        <div className="mt-4 space-y-3">
                            {/* Instructions */}
                            <div className="bg-white rounded-lg border border-blue-200 p-4 space-y-3">
                                <p className="text-sm font-semibold text-slate-900">How to Pay:</p>
                                <ol className="text-xs text-slate-600 space-y-2 list-decimal list-inside">
                                    <li>Go to <strong>M-Pesa Menu</strong> on your phone</li>
                                    <li>Select <strong>Lipa Na M-Pesa</strong></li>
                                    <li>Select <strong>Pay Bill</strong></li>
                                    <li>Enter <strong>Business Number</strong>: <span className="font-mono font-bold text-blue-600">{MPESA_TILL_NUMBER}</span> <Button variant="ghost" size="icon" className="h-5 w-5 ml-1" onClick={copyTillNumber}><Copy className="h-3 w-3" /></Button></li>
                                    <li>Enter <strong>Amount</strong>: <span className="font-bold text-green-600">{formatPrice(grandTotal)}</span></li>
                                    <li>Enter your <strong>M-Pesa PIN</strong> and confirm</li>
                                    <li>Wait for SMS with <strong>Transaction Code</strong> (e.g., QGH1234567)</li>
                                    <li>Enter the code below to complete your order</li>
                                </ol>
                            </div>

                            {/* M-Pesa Code Input */}
                            <div className="space-y-2">
                                <Label htmlFor="mpesaCode" className="text-sm font-medium">
                                    M-Pesa Transaction Code *
                                </Label>
                                <Input
                                    id="mpesaCode"
                                    type="text"
                                    placeholder="e.g., QGH1234567"
                                    value={mpesaCode}
                                    onChange={(e) => onCodeChange?.(e.target.value.toUpperCase())}
                                    className="font-mono tracking-wider uppercase"
                                    disabled={disabled}
                                    maxLength={10}
                                />
                                <p className="text-xs text-slate-500">
                                    Check your SMS for the confirmation code after payment
                                </p>
                            </div>

                            {/* Visual Guide */}
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                <div className="flex items-start gap-2">
                                    <span className="text-green-600 font-bold">✓</span>
                                    <p className="text-xs text-green-800">
                                        Your order will be confirmed once we verify the M-Pesa transaction code.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </Label>
            </div>

            {/* Cash on Delivery Option */}
            <div className={`flex items-start gap-3 p-4 border rounded-lg transition-all ${value === 'cod'
                ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500'
                : 'border-slate-200 hover:border-blue-300'
                }`}>
                <RadioGroupItem value="cod" id="cod" className="mt-1" disabled={disabled} />
                <Label htmlFor="cod" className="flex-1 cursor-pointer flex-col md:flex-row">
                    <div className="flex items-center gap-2 font-medium text-slate-900">
                        <Banknote className="h-4 w-4 text-blue-600" />
                        Cash on Delivery
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                        Pay when your order arrives. No upfront payment required.
                    </p>

                    {/* COD Info (shown when selected) */}
                    {value === 'cod' && (
                        <div className="mt-4 bg-orange-50 border border-orange-200 rounded-lg p-3">
                            <div className="flex items-start gap-2">
                                <span className="text-orange-600 font-bold">ℹ</span>
                                <p className="text-xs text-orange-800">
                                    Please have exact change ready. Delivery available in Gaberone, Accra, and Khoja.
                                </p>
                            </div>
                        </div>
                    )}
                </Label>
            </div>
        </RadioGroup>
    );
}