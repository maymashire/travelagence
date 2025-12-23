import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Mail, Globe, AlertCircle } from 'lucide-react';

export function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // 1. Hardcoded Admin Bypass (Requested by User)
            if (email === 'maymashire177@gmail.com' && password === '112233') {
                const savedAvatar = localStorage.getItem(`persistent_avatar_${email}`);
                const adminUser = {
                    id: 'admin-id',
                    full_name: 'System Admin',
                    email: email,
                    role: 'admin' as const,
                    avatar_url: savedAvatar || ''
                };
                login(adminUser);
                navigate('/admin');
                return;
            }

            // 2. Real Supabase Auth
            const { data, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (authError) {
                if (authError.message.includes('Email not confirmed')) {
                    setError('Please confirm your email address before logging in. Check your inbox for a confirmation link.');
                } else if (authError.message.includes('Invalid login credentials')) {
                    setError('Invalid email or password. Please try again.');
                } else {
                    setError(authError.message);
                }
                return;
            }

            if (data.user) {
                // The AuthContext will pick up the session change automatically
                if (data.user.user_metadata?.role === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/home');
                }
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop')] bg-cover bg-center opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/50 to-background" />

            <Card className="w-full max-w-md relative z-10 border-white/10 bg-background/60 backdrop-blur-xl shadow-2xl">
                <CardHeader className="text-center">
                    <div className="mx-auto w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                        <Globe className="w-7 h-7 text-white" />
                    </div>
                    <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Welcome Back
                    </CardTitle>
                    <CardDescription>
                        Sign in to continue your journey
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    className="pl-9 bg-background/50"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="password"
                                    type="password"
                                    className="pl-9 bg-background/50"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-md">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        <Button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium">
                            Register here
                        </Link>
                    </p>
                    <div className="pt-4 border-t border-white/10 w-full text-center">
                        <p className="text-xs text-muted-foreground/60 font-medium">
                            Powered By <span className="text-blue-400">Eng Maria</span>
                        </p>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
