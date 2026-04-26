// components/layout/ConditionalLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/public/Navbar';
import { Footer } from '@/components/public/Footer';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide Navbar & Footer for admin routes
    const isAdminRoute = pathname?.startsWith('/admin');

    return (
        <>
            {!isAdminRoute && <Navbar />}
            <main className="flex-1">{children}</main>
            {!isAdminRoute && <Footer />}
        </>
    );
}