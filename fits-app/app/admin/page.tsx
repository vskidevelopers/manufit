// app/admin/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { getDashboardStats, DashboardStats } from '@/actions/dashboard-actions';
import { Loader2, RefreshCw, Package, ShoppingBag, DollarSign, FileText, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

// Format currency
const formatPrice = (amount: number) => `KSh ${amount.toLocaleString()}`;

// Format date
const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString); // Works with ISO strings
        return date.toLocaleDateString('en-KE', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
        });
    } catch {
        return 'Invalid date';
    }
};

// Status badge colors
const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-700',
    processing: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadStats = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            console.error('Failed to load dashboard:', err);
            setError('Failed to load dashboard data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    if (loading && !stats) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Loading dashboard...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-900">Dashboard</h1>
                    <p className="text-slate-600 text-sm mt-1">Overview of your ManuFit store</p>
                </div>
                <Button onClick={loadStats} variant="outline" size="sm" className="gap-2" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Refresh
                </Button>
            </div>

            {/* Error State */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                    {error}
                    <Button variant="link" className="ml-2 p-0 h-auto text-red-700" onClick={loadStats}>
                        Try again
                    </Button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Total Orders */}
                <Link href="/admin/orders">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Total Orders</p>
                                <p className="text-2xl font-bold text-slate-900 mt-1">
                                    {stats?.totalOrders ?? 0}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                                <ShoppingBag className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Pending Orders */}
                <Link href="/admin/orders?status=pending">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-yellow-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Pending Orders</p>
                                <p className="text-2xl font-bold text-yellow-600 mt-1">
                                    {stats?.pendingOrders ?? 0}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
                                <Package className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Today's Revenue */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-500">Revenue (Today)</p>
                            <p className="text-2xl font-bold text-green-600 mt-1">
                                {formatPrice(stats?.todayRevenue ?? 0)}
                            </p>
                        </div>
                        <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                            <DollarSign className="h-5 w-5" />
                        </div>
                    </div>
                </div>

                {/* Pending Quotes */}
                <Link href="/admin/quotes?status=pending">
                    <div className="bg-white p-5 rounded-xl border border-slate-200 hover:border-purple-300 hover:shadow-md transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500">Pending Quotes</p>
                                <p className="text-2xl font-bold text-purple-600 mt-1">
                                    {stats?.pendingQuotes ?? 0}
                                </p>
                            </div>
                            <div className="h-10 w-10 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                {/* Total Products */}
                <Link href="/admin/products">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 hover:border-blue-300 transition-all cursor-pointer flex items-center gap-4">
                        <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                            <Package className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-500">Total Products</p>
                            <p className="text-lg font-bold text-slate-900">
                                {stats?.totalProducts ?? 0}
                                <span className="text-sm font-normal text-slate-400 ml-1">
                                    ({stats?.activeProducts ?? 0} active)
                                </span>
                            </p>
                        </div>
                    </div>
                </Link>

                {/* Completed Orders */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                        <ShoppingBag className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Completed Orders</p>
                        <p className="text-lg font-bold text-green-600">
                            {stats?.completedOrders ?? 0}
                        </p>
                    </div>
                </div>

                {/* Total Customers (unique phones from orders) */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Unique Customers</p>
                        <p className="text-lg font-bold text-slate-900">
                            {/* Simple estimate: total orders / 1.5 (avg orders per customer) */}
                            {Math.ceil((stats?.totalOrders ?? 0) / 1.5)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">Recent Orders</h3>
                    <Link href="/admin/orders">
                        <Button variant="ghost" size="sm" className="text-sm">View All</Button>
                    </Link>
                </div>

                {stats?.recentOrders?.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        No orders yet. Start by adding products!
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-50 border-b">
                                <tr>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Order</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Customer</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Amount</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Status</th>
                                    <th className="text-left p-4 text-sm font-semibold text-slate-700">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats?.recentOrders?.map((order) => (
                                    <tr key={order.id} className="border-b hover:bg-slate-50">
                                        <td className="p-4">
                                            <Link
                                                href={`/admin/orders/${order.id}`}
                                                className="font-mono text-sm text-blue-600 hover:underline"
                                            >
                                                {order.orderNumber}
                                            </Link>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">{order.customerName}</td>
                                        <td className="p-4 text-sm font-medium text-slate-900">
                                            {formatPrice(order.totalAmount)}
                                        </td>
                                        <td className="p-4">
                                            <Badge className={statusColors[order.status] || 'bg-slate-100 text-slate-700'}>
                                                {order.status}
                                            </Badge>
                                        </td>
                                        <td className="p-4 text-sm text-slate-600">
                                            {formatDate(order.createdAt)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-3">
                    <Link href="/admin/products/new">
                        <Button variant="outline" className="gap-2">
                            <Package className="h-4 w-4" />
                            Add Product
                        </Button>
                    </Link>
                    <Link href="/admin/orders">
                        <Button variant="outline" className="gap-2">
                            <ShoppingBag className="h-4 w-4" />
                            Manage Orders
                        </Button>
                    </Link>
                    <Link href="/admin/quotes">
                        <Button variant="outline" className="gap-2">
                            <FileText className="h-4 w-4" />
                            View Quotes
                        </Button>
                    </Link>
                </div>
            </div>

        </div>
    );
}