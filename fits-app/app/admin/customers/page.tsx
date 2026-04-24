// app/admin/customers/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCustomersAction } from '@/actions/order-actions';
import { Customer } from '@/lib/types';
import { toast } from 'sonner';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { PaginationWrapper } from '@/components/ui/pagination-wrapper';
import { Search, RefreshCw, AlertCircle, Users, Phone, MapPin, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ITEMS_PER_PAGE = 20;

export default function CustomersPage() {
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Load customers
    const loadCustomers = async () => {
        console.log('🔄 [CLIENT] Loading customers...');
        setLoading(true);
        setError(null);

        try {
            const data = await getCustomersAction();
            console.log(`✅ [CLIENT] Loaded ${data.length} customers`);
            setCustomers(data);
        } catch (err) {
            console.error('❌ [CLIENT] Failed to load customers:', err);
            setError('Failed to load customers. Please refresh.');
            toast.error('Failed to load customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCustomers();
    }, []);

    // Filter customers
    const filteredCustomers = customers.filter((customer) => {
        const matchesSearch =
            customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            customer.phone?.includes(searchTerm) ||
            customer.locations?.some(loc => loc.toLowerCase().includes(searchTerm.toLowerCase()));

        return matchesSearch;
    });

    // Format date
    const formatDate = (timestamp: any): string => {
        if (!timestamp) return 'N/A';
        try {
            const date = timestamp.toDate?.() || new Date(timestamp);
            return date.toLocaleDateString('en-KE', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
            });
        } catch {
            return 'Invalid date';
        }
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return `KSh ${amount.toLocaleString()}`;
    };

    // View customer orders
    const viewCustomerOrders = (customer: Customer) => {
        console.log('👁️ [CLIENT] Viewing orders for:', customer.phone);
        // Navigate to orders list with filter
        router.push(`/admin/orders?customer=${encodeURIComponent(customer.phone)}`);
    };

    // Loading state
    if (loading) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-3">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">Loading customers...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="flex h-64 items-center justify-center">
                <div className="text-center space-y-4 max-w-md">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Failed to load customers</h3>
                        <p className="text-gray-500 mt-1">{error}</p>
                    </div>
                    <Button onClick={loadCustomers}>Try Again</Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-900">Customers</h2>
                    <p className="text-sm text-gray-500">
                        {customers.length} unique customers • {filteredCustomers.length} showing
                    </p>
                </div>
                <Button variant="outline" size="sm" onClick={loadCustomers} disabled={loading}>
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="Search by name, phone, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 bg-white"
                    aria-label="Search customers"
                />
            </div>

            {/* Empty State */}
            {filteredCustomers.length === 0 ? (
                <div className="border rounded-lg bg-white p-12 text-center">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                        {customers.length === 0 ? (
                            <Users className="h-8 w-8 text-gray-400" />
                        ) : (
                            <AlertCircle className="h-8 w-8 text-gray-400" />
                        )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {customers.length === 0 ? 'No customers yet' : 'No matching customers'}
                    </h3>
                    <p className="text-gray-500 mt-1">
                        {customers.length === 0
                            ? 'Customers will appear here once orders are placed.'
                            : 'Try adjusting your search.'}
                    </p>
                    {customers.length === 0 && (
                        <Button className="mt-4" variant="outline" onClick={() => router.push('/admin/orders')}>
                            View Orders
                        </Button>
                    )}
                </div>
            ) : (
                /* Customers Table */
                <PaginationWrapper totalItems={filteredCustomers.length} itemsPerPage={ITEMS_PER_PAGE}>
                    {({ startIndex, endIndex }) => {
                        const currentCustomers = filteredCustomers.slice(startIndex, endIndex);

                        return (
                            <div className="border rounded-lg bg-white overflow-hidden">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-slate-50">
                                            <TableHead>Customer</TableHead>
                                            <TableHead className="hidden md:table-cell">Phone</TableHead>
                                            <TableHead className="hidden lg:table-cell">Locations</TableHead>
                                            <TableHead className="text-right">Orders</TableHead>
                                            <TableHead className="text-right">Total Spent</TableHead>
                                            <TableHead className="hidden sm:table-cell">Last Order</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {currentCustomers.map((customer) => (
                                            <TableRow key={customer.phone} className="hover:bg-slate-50 transition-colors">
                                                {/* Customer Name */}
                                                <TableCell>
                                                    <div className="font-medium text-sm">{customer.name}</div>
                                                    <div className="text-xs text-gray-500 md:hidden">{customer.phone}</div>
                                                </TableCell>

                                                {/* Phone (hidden on mobile) */}
                                                <TableCell className="hidden md:table-cell">
                                                    <div className="flex items-center gap-2 text-sm">
                                                        <Phone className="h-3 w-3 text-gray-400" />
                                                        {customer.phone}
                                                    </div>
                                                </TableCell>

                                                {/* Locations (hidden on medium) */}
                                                <TableCell className="hidden lg:table-cell">
                                                    <div className="flex flex-wrap gap-1">
                                                        {customer.locations.slice(0, 3).map((loc, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">
                                                                <MapPin className="h-2 w-2 mr-1" />
                                                                {loc}
                                                            </Badge>
                                                        ))}
                                                        {customer.locations.length > 3 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{customer.locations.length - 3}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>

                                                {/* Total Orders */}
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-1 text-sm">
                                                        <ShoppingCart className="h-3 w-3 text-gray-400" />
                                                        <span className="font-medium">{customer.totalOrders}</span>
                                                    </div>
                                                </TableCell>

                                                {/* Total Spent */}
                                                <TableCell className="text-right font-bold text-sm text-green-600">
                                                    {formatCurrency(customer.totalSpent)}
                                                </TableCell>

                                                {/* Last Order Date (hidden on small) */}
                                                <TableCell className="hidden sm:table-cell text-xs text-gray-500">
                                                    {formatDate(customer.lastOrderDate)}
                                                </TableCell>

                                                {/* Actions */}
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => viewCustomerOrders(customer)}
                                                        className="text-blue-600 hover:text-blue-700"
                                                    >
                                                        View Orders
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        );
                    }}
                </PaginationWrapper>
            )}

            {/* Stats Summary */}
            {customers.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Users className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Customers</p>
                                    <p className="text-2xl font-bold">{customers.length}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <ShoppingCart className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Avg Orders/Customer</p>
                                    <p className="text-2xl font-bold">
                                        {(customers.reduce((sum, c) => sum + c.totalOrders, 0) / customers.length).toFixed(1)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                                    <span className="text-lg font-bold text-purple-600">KSh</span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total Revenue</p>
                                    <p className="text-2xl font-bold">
                                        {formatCurrency(customers.reduce((sum, c) => sum + c.totalSpent, 0))}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}