import React, { createContext, useContext, useState, useEffect } from 'react';
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

    useEffect(() => {
        // 1. Check for initial session
        const initAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                await syncUser(session.user);
            } else {
                // Fallback for bypass login
                const storedUser = localStorage.getItem('travel_app_user');
                if (storedUser) {
                    try {
                        setUser(JSON.parse(storedUser));
                    } catch (e) {
                        localStorage.removeItem('travel_app_user');
                    }
                }
            }
            setIsLoading(false);
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session) {
                await syncUser(session.user);
            } else if (event === 'SIGNED_OUT') {
                // Only clear if it was an explicit sign out
                setUser(null);
                localStorage.removeItem('travel_app_user');
            }
            setIsLoading(false);
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
        // This is now primarily handled by onAuthStateChange, 
        // but we keep it for immediate UI feedback if needed.
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
