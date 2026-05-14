// components/public/Navbar.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, ShoppingBag, Home, Package, Info, Mail } from 'lucide-react';
import { CartCounter } from '@/components/public/cart/CartCounter';
import Logo from './logo.png';

const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Shop', href: '/shop', icon: ShoppingBag },
    { name: 'Track Order', href: '/track', icon: Package },
    { name: 'About', href: '/about', icon: Info },
    { name: 'Contact', href: '/contact', icon: Mail },
];

export function Navbar() {
    const pathname = usePathname();
    // ✅ Explicitly set to false - drawer closed by default
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // ✅ Close menu when route changes
    useEffect(() => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    }, []);

    // ✅ Close menu on Escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsMobileMenuOpen(false);
        };
        if (isMobileMenuOpen) {
            window.addEventListener('keydown', handleEscape);
            return () => window.removeEventListener('keydown', handleEscape);
        }
    }, [isMobileMenuOpen]);

    // ✅ Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    // ✅ Explicit close function (ensures it actually closes)
    const closeMenu = () => {
        setIsMobileMenuOpen(false);
        document.body.style.overflow = '';
    };

    return (
        <>
            <header className="sticky top-0 z-40 w-full border-b bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
                <div className="container flex h-16 items-center justify-between px-4">

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 font-bold text-xl text-slate-900">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center">
                            <img src={Logo.src} alt="ManuFit Logo" className="h-8 w-8" />
                        </div>
                        <span>ManuFit</span>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden md:flex items-center gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`text-sm font-medium transition-colors hover:text-blue-600 ${pathname === link.href ? 'text-blue-600' : 'text-slate-600'
                                    }`}
                            >
                                {link.name}
                            </Link>
                        ))}
                    </nav>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        <Link href="/cart" className="relative">
                            <CartCounter />
                        </Link>

                        {/* Mobile Hamburger */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                            onClick={() => setIsMobileMenuOpen(true)}
                            aria-label="Open menu"
                            aria-expanded={isMobileMenuOpen}
                        >
                            <Menu size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobile Menu Overlay (Backdrop) */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden animate-in fade-in duration-200"
                    onClick={closeMenu}
                    aria-hidden="true"
                />
            )}

            {/* Mobile Menu Drawer (Slides from Right) */}
            <div
                className={`
          fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-2xl
          transform transition-transform duration-300 ease-in-out
          md:hidden
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
                role="dialog"
                aria-modal="true"
                aria-label="Navigation menu"
            >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-900">
                        <div className="h-7 w-7 rounded-lg flex items-center justify-center">
                            {/* <Shirt className="h-4 w-4 text-white" /> */}
                            <img src={Logo.src} alt="ManuFit Logo" className="h-8 w-8" />
                        </div>
                        <span>ManuFit</span>
                    </div>
                    <button
                        onClick={closeMenu}
                        className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                        aria-label="Close menu"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation Links with Icons */}
                <nav className="p-4 space-y-1">
                    {navLinks.map((link) => {
                        const Icon = link.icon;
                        return (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={closeMenu}
                                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${pathname === link.href
                                        ? 'bg-blue-50 text-blue-700'
                                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                    }
                `}
                            >
                                <Icon className={`h-4 w-4 ${pathname === link.href ? 'text-blue-600' : 'text-slate-400'}`} />
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer with Cart CTA */}
                <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-slate-50">
                    <Link
                        href="/cart"
                        onClick={closeMenu}
                        className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        <ShoppingBag className="h-4 w-4" />
                        View Cart
                    </Link>
                </div>
            </div>
        </>
    );
}
