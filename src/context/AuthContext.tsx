import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

type UserRole = 'admin' | 'user' | null;

interface User {
    id: string;
    full_name: string;
    email: string;
    role: UserRole;
    phone?: string;
    avatar_url?: string;
}

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => Promise<void>;
    refreshUser: () => Promise<void>;
    updateLocalUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const lastSessionId = useRef<string | null>(null);

    useEffect(() => {
        // 1. Check for initial session
        const initAuth = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                if (session) {
                    lastSessionId.current = session.access_token;
                    await syncUser(session.user);
                } else {
                    // Fallback for bypass login
                    const storedUser = localStorage.getItem('travel_app_user');
                    if (storedUser) {
                        try {
                            const parsed = JSON.parse(storedUser);
                            setUser(parsed);
                            console.log('Restored bypass user from storage:', parsed.email);
                        } catch (e) {
                            localStorage.removeItem('travel_app_user');
                        }
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth event:', event, session ? `session present (${session.user.email})` : 'no session');

            if (session) {
                // Only sync if the session has actually changed to avoid 429 errors
                if (session.access_token !== lastSessionId.current) {
                    lastSessionId.current = session.access_token;
                    await syncUser(session.user);
                }
            } else if (event === 'SIGNED_OUT') {
                lastSessionId.current = null;
                // Only clear if we don't have a bypass user
                setUser(prev => {
                    if (prev?.id === 'admin-id') {
                        console.log('Ignoring SIGNED_OUT event for bypass admin');
                        return prev;
                    }
                    return null;
                });

                // Only remove from localStorage if it's not a bypass user
                const stored = localStorage.getItem('travel_app_user');
                if (stored) {
                    try {
                        const parsed = JSON.parse(stored);
                        if (parsed.id !== 'admin-id') {
                            localStorage.removeItem('travel_app_user');
                        }
                    } catch (e) {
                        localStorage.removeItem('travel_app_user');
                    }
                }
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const syncUser = async (authUser: any) => {
        const updatedUser: User = {
            id: authUser.id,
            email: authUser.email || '',
            full_name: authUser.user_metadata?.full_name || '',
            role: authUser.user_metadata?.role || 'user',
            phone: authUser.phone || authUser.user_metadata?.phone || '',
            avatar_url: authUser.user_metadata?.avatar_url || ''
        };
        setUser(updatedUser);
        localStorage.setItem('travel_app_user', JSON.stringify(updatedUser));
    };

    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem('travel_app_user', JSON.stringify(userData));
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setUser(null);
        localStorage.removeItem('travel_app_user');
        navigate('/login');
    };

    const refreshUser = async () => {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            await syncUser(authUser);
        }
    };

    const updateLocalUser = (data: Partial<User>) => {
        if (!user) return;
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('travel_app_user', JSON.stringify(updatedUser));

        // Persist avatar for bypass admin specifically
        if (user.id === 'admin-id' && data.avatar_url) {
            localStorage.setItem(`persistent_avatar_${user.email}`, data.avatar_url);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout, refreshUser, updateLocalUser }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
