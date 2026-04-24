'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';
import { LogOut, LayoutDashboard, ShoppingBag, Users, Package } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // ✅ Redirect to login if not authenticated (with proper dependencies)
    useEffect(() => {
        if (!loading && !user) {
            console.log('🔍 [LAYOUT] No active user → redirecting to /admin/login');
            router.push('/login');
        }
    }, [loading, user, router]); // ✅ Dependencies: re-run when auth state changes

    // ✅ Show loading while checking auth
    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-slate-50">
                <div className="text-center space-y-3">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto" />
                    <p className="text-gray-600 font-medium">Verifying access...</p>
                </div>
            </div>
        );
    }

    // ✅ If no user after loading, return null (redirect is happening)
    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        console.log('👋 [LAYOUT] Logout initiated by user');
        try {
            await logoutUser();
            toast.success('Signed out successfully', {
                description: 'You have been logged out of ManuFit Admin.',
                duration: 3000,
            });
            console.log('✅ [LAYOUT] Logout complete → redirecting to login');
            router.push('/login');
        } catch (error) {
            console.error('❌ [LAYOUT] Logout failed:', error);
            toast.error('Sign out failed', {
                description: 'Please try again or refresh the page.',
                duration: 5000,
            });
        }
    };

    // ✅ Navigation items
    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Customers', href: '/admin/customers', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Integrated Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col border-r">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package size={18} className="text-blue-600" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900">ManuFit Admin</h1>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 truncate" title={user.email || ''}>
                        {user.email}
                    </p>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <Icon size={18} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                                <span className="text-sm">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Logout */}
                <div className="p-4 border-t bg-gray-50">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors text-sm font-medium"
                        aria-label="Sign out"
                    >
                        <LogOut size={18} />
                        <span>Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-slate-50/50">
                <div className="p-6 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}