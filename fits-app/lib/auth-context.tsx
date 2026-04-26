// lib/auth-context.tsx
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log('🔐 [AUTH] Setting up auth listener...');

        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log('🔐 [AUTH] Auth state changed:', firebaseUser?.email || 'null');
            setUser(firebaseUser || null);
            setLoading(false); // ✅ Critical: Always set to false after auth check
        });

        return () => {
            console.log('🔐 [AUTH] Cleaning up auth listener');
            unsubscribe();
        };
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};