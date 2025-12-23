import { Routes, Route, Navigate } from 'react-router-dom';
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

    if (isLoading) return <div>Loading...</div>;

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (role && user.role !== role) {
        return <Navigate to="/home" replace />;
    }

    return <>{children}</>;
}

function App() {
    return (
        <AuthProvider>
            <Routes>
                <Route path="/" element={<SplashPage />} />
                <Route path="/home" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="assistant" element={<Assistant />} />
                    <Route path="destinations" element={<Destinations />} />
                    <Route path="about" element={<About />} />
                    <Route path="contact" element={<Contact />} />
                    <Route path="details/:id" element={<Details />} />
                    <Route path="booking" element={<Booking />} />
                    <Route path="profile" element={
                        <ProtectedRoute>
                            <Profile />
                        </ProtectedRoute>
                    } />
                    <Route path="dashboard" element={
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
