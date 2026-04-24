'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { logoutUser } from '@/lib/firebase';
import { toast } from 'sonner';
import {
    LogOut, LayoutDashboard, ShoppingBag, Users, Package,
    Menu, X
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // Mobile menu state
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!loading && !user) {
            console.log('🔍 [LAYOUT] No active user → redirecting to /login');
            router.push('/login');
        }
    }, [loading, user, router]);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    // Close mobile menu on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        if (isMobileMenuOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isMobileMenuOpen]);

    // Show loading while checking auth
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

    // If no user after loading, return null (redirect is happening)
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

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Customers', href: '/admin/customers', icon: Users },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile: Backdrop Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar - Fixed on desktop, slide-over on mobile */}
            <aside
                className={`
          fixed md:static inset-y-0 left-0 z-50
          w-64 bg-white shadow-md flex flex-col border-r
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
                aria-label="Admin navigation"
            >
                {/* Header */}
                <div className="p-6 border-b flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                            <Package size={18} className="text-blue-600" />
                        </div>
                        <h1 className="text-lg font-bold text-slate-900">ManuFit Admin</h1>
                    </div>

                    {/* Mobile: Close button */}
                    <button
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg 
                  transition-all duration-200
                  ${isActive
                                        ? 'bg-blue-50 text-blue-700 font-medium shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }
                `}
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

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile: Header Bar with Hamburger */}
                <header className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-lg hover:bg-gray-100"
                        aria-label="Open menu"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-sidebar"
                    >
                        <Menu size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-slate-900">ManuFit</h1>
                    <div className="w-10" /> {/* Spacer for alignment */}
                </header>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-slate-50/50">
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}