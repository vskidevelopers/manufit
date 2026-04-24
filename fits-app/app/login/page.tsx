/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { loginUser } from '@/lib/firebase';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shirt, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const { user } = useAuth();

    // ✅ CORRECT: Redirect in useEffect (runs AFTER render)
    useEffect(() => {
        if (user) {
            console.log('🔍 [CLIENT] Auth state: active user →', user.email);
            console.log('🔄 [CLIENT] Redirecting to /admin...');
            router.push('/admin');
        }
    }, [user, router]); // ✅ Dependency array: runs only when user changes

    // ✅ Show loading state while redirect is in progress
    if (user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="text-center space-y-3">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
                    <p className="text-gray-600 font-medium">Redirecting to dashboard...</p>
                </div>
            </div>
        );
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🖱️ [CLIENT] Login form submitted');
        setError('');
        setLoading(true);

        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            setLoading(false);
            return;
        }

        try {
            console.log('🚀 [CLIENT] Calling loginUser with:', { email });
            await loginUser(email, password);
            console.log('✅ [CLIENT] Login successful');
            toast.success('Welcome back!', {
                description: 'Redirecting to your dashboard...',
                duration: 3000,
            });
            // Redirect handled by useEffect above
        } catch (err: any) {
            console.error('❌ [CLIENT] Login failed:', err?.code, err?.message);
            const errorMessage =
                err?.code === 'auth/invalid-credential'
                    ? 'Invalid email or password. Please try again.'
                    : err?.code === 'auth/too-many-requests'
                        ? 'Too many failed attempts. Please try again later.'
                        : 'Unable to sign in. Please check your connection.';
            setError(errorMessage);
            toast.error('Sign in failed', { description: errorMessage, duration: 5000 });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4">
            <Card className="w-full max-w-md shadow-xl border-slate-200/60 backdrop-blur-sm bg-white/95">
                <CardHeader className="space-y-1 text-center pb-2">
                    <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600 shadow-sm">
                        <Shirt size={26} className="stroke-[1.5]" />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">ManuFit Admin</CardTitle>
                    <CardDescription className="text-slate-500">Sign in to manage your store</CardDescription>
                </CardHeader>

                <form onSubmit={handleLogin} className="px-6">
                    <CardContent className="space-y-5 pb-2">
                        {error && (
                            <Alert variant="destructive" className="border-red-200 bg-red-50/50 animate-in fade-in slide-in-from-top-2">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-sm">{error}</AlertDescription>
                            </Alert>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email address</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@manufit.com"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                                required
                                disabled={loading}
                                className="bg-white/80 border-slate-200 focus:border-blue-500 focus:ring-blue-500/20 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                                <button
                                    type="button"
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors disabled:opacity-50"
                                    disabled={loading}
                                    onClick={() => toast.info('Contact support to reset password')}
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                                required
                                disabled={loading}
                                className="bg-white/80 border-slate-200 focus:border-blue-600 focus:ring-blue-600/20 transition-all"
                            />
                        </div>
                    </CardContent>

                    <CardFooter className="px-6 pb-6 pt-2">
                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-sm hover:shadow-md transition-all disabled:opacity-70 h-11"
                            disabled={loading}
                        >
                            {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...</> : 'Sign In'}
                        </Button>
                    </CardFooter>
                </form>

                <div className="px-6 pb-6 text-center">
                    <p className="text-xs text-slate-400">Secured with Firebase Authentication</p>
                </div>
            </Card>
        </div>
    );
}