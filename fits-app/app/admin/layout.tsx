'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { LogOut, LayoutDashboard, ShoppingBag, Users, Package, Shirt } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();



    useEffect(() => {
        if (!loading && !user) {
            console.log('🔍 [CLIENT] No active user detected, redirecting to /login');
            router.push('/login');
        } else if (!user) {
            console.log('🔍 [CLIENT] Auth state checked: no active user, showing loading state before redirect.');
            router.push('/login');
        } else {
            <div className="flex h-screen items-center justify-center">Loading Admin LOGIN FORM...</div>;
            console.log('🔍 [CLIENT] Auth state checked: user is', user ? 'logged in' : 'not logged in');
        }
    }, []);

    if (loading) {
        return <div className="flex h-screen items-center justify-center">Loading Admin...</div>;
    }


    // Sidebar Links
    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Customers', href: '/admin/customers', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Integrated Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-6 border-b">
                    <h1 className="text-xl font-bold text-blue-600">ManuFit Admin</h1>
                    <p className="text-xs text-gray-500 mt-1">{user?.email}</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-blue-50 text-blue-600 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon size={20} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={logout}
                        className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto p-8">
                {children}
            </main>
        </div>
    );
}