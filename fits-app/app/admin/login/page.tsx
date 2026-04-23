'use client';

import { useEffect } from 'react'; // ✅ Add this import
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { loginUser } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { Shirt } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    // const { user } = useAuth();
    const user = {
        email: 'exampleUser@gmail.com',

    }

    // ✅ REDIRECT LOGIC MOVED TO USEEFFECT
    useEffect(() => {
        if (user) {
            console.log('🔍 [CLIENT] Auth state detected active user:', user.email);
            console.log('🔄 [CLIENT] Redirecting to /admin...');
            router.push('/admin');
        } else {
            console.log('🔍 [CLIENT] Auth state detected no active user, staying on login page.');
        }
    }, []); // Runs only when 'user' changes

    // ✅ Early return ONLY after effect handles redirect
    if (user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-gray-500 animate-pulse">Redirecting to dashboard...</p>
            </div>
        );
    } else {
        console.log('🔍 [CLIENT] No active user detected, showing login form.');
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('🖱️ [CLIENT] Login form submitted.');
        setError('');
        setLoading(true);

        try {
            console.log('🚀 [CLIENT] Calling loginUser function...');
            await loginUser(email, password);
            // Note: The redirect will happen via the useEffect above when 'user' updates
            console.log('🎉 [CLIENT] Login hook completed.');
            toast.success("Welcome back!");
        } catch (err: any) {
            console.error('💥 [CLIENT] Login caught an error:', err);
            setError('Invalid email or password. Check console for details.');
            toast.error("Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
            <Card className="w-full max-w-md shadow-lg border-slate-200">
                <CardHeader className="space-y-1 text-center">
                    <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                        <Shirt size={24} />
                    </div>
                    <CardTitle className="text-2xl font-bold tracking-tight">ManuFit Admin</CardTitle>
                    <CardDescription>Enter your credentials to access the dashboard</CardDescription>
                </CardHeader>
                <form onSubmit={handleLogin}>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="admin@manufit.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-white"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                                className="bg-white"
                            />
                        </div>
                    </CardContent>

                    <CardFooter>
                        <Button type="button" className="w-full" disabled={loading}>
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}