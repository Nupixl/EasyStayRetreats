'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
    type: 'signup' | 'login';
}

export function AuthForm({ type }: AuthFormProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (type === 'signup') {
                const { data, error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: {
                            display_name: displayName,
                        },
                    },
                });
                if (error) throw error;

                // Profiles are handled by the database trigger
                alert('Verification email sent! Please check your inbox.');
                router.push('/login');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                router.refresh();
                router.push('/affiliate/dashboard');
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">{type === 'signup' ? 'Join the Program' : 'Welcome Back'}</CardTitle>
                <CardDescription>
                    {type === 'signup'
                        ? 'Start earning commissions by recommending property owners.'
                        : 'Access your performance metrics and affiliate links.'}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleAuth} className="space-y-4">
                    {type === 'signup' && (
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">Display Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                placeholder="John Doe"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                            />
                        </div>
                    )}
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-medium">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

                    <Button type="submit" className="w-full py-6 text-base font-semibold" disabled={loading}>
                        {loading ? 'Processing...' : type === 'signup' ? 'Create Account' : 'Log In'}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-secondary">
                    {type === 'signup' ? (
                        <p>Already have an account? <Link href="/login" className="text-primary hover:underline">Log in</Link></p>
                    ) : (
                        <p>Don't have an account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link></p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
