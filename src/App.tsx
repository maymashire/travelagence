import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Layout } from '@/components/layout/Layout';
import { Home } from '@/pages/Home';
import { Assistant } from '@/pages/Assistant';
import { Destinations } from '@/pages/Destinations';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Details } from '@/pages/Details';
import { Booking } from '@/pages/Booking';
import { Profile } from '@/pages/Profile';
import { Dashboard } from '@/pages/Dashboard';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { SplashPage } from '@/pages/SplashPage';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminDashboardHome } from '@/pages/admin/AdminDashboardHome';
import { AdminDestinations } from '@/pages/admin/AdminDestinations';
import { AdminBookings } from '@/pages/admin/AdminBookings';
import { AdminUsers } from '@/pages/admin/AdminUsers';
import { AuthProvider, useAuth } from '@/context/AuthContext';

function ProtectedRoute({ children, role }: { children: React.ReactNode, role?: 'admin' | 'user' }) {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                    <p className="text-muted-foreground animate-pulse">Verifying session...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        console.log('No user found in ProtectedRoute, redirecting to login');
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        console.log(`User role ${user.role} does not match required role ${role}, redirecting to home`);
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-center" richColors />
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route element={<Layout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/assistant" element={<Assistant />} />
                    <Route path="/destinations" element={<Destinations />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/details/:id" element={<Details />} />
                    <Route path="/booking" element={<Booking />} />
                    <Route path="/profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                </Route>
                <Route path="/admin" element={
                    <ProtectedRoute role="admin">
                        <AdminLayout />
                    </ProtectedRoute>
                }>
                    <Route index element={<AdminDashboardHome />} />
                    <Route path="destinations" element={<AdminDestinations />} />
                    <Route path="bookings" element={<AdminBookings />} />
                    <Route path="users" element={<AdminUsers />} />
                </Route>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
