'use client';

import React, { useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import Link from 'next/link';
import { Sparkles, Rocket, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError('Invalid email or password');
            } else {
                toast.success('Welcome back!');
                router.push('/dashboards');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGuestSession = async () => {
        try {
            const response = await fetch('/api/auth/guest', { method: 'POST' });
            const data = await response.json();

            if (data.success) {
                toast.success('Welcome to the demo!');
                router.push('/dashboards');
            }
        } catch (err) {
            toast.error('Failed to start demo session');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent pointer-events-none" />

            <Card className="w-full max-w-md relative bg-slate-900/60 border-cyan-500/20 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500">
                        AI Data Analyst
                    </CardTitle>
                    <CardDescription className="text-slate-400 mt-2">
                        Sign in to your account or try the demo
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {error && (
                        <Alert variant="destructive" className="bg-rose-500/10 border-rose-500/20">
                            <AlertCircle className="w-4 h-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-slate-300">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="bg-slate-950/50 border-slate-700 focus:border-cyan-500"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="bg-slate-950/50 border-slate-700 focus:border-cyan-500"
                                required
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gradient-to-r from-cyan-600 to-fuchsia-600 hover:from-cyan-500 hover:to-fuchsia-500 shadow-lg"
                            disabled={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-slate-900 px-2 text-slate-500">Or</span>
                        </div>
                    </div>

                    <Button
                        onClick={handleGuestSession}
                        variant="outline"
                        className="w-full border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
                    >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Try Demo (No Signup)
                    </Button>
                </CardContent>

                <CardFooter className="flex justify-center">
                    <p className="text-sm text-slate-400">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-bold">
                            Sign up for free
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
