import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, DollarSign, Map, TrendingUp, Calendar, ArrowRight } from 'lucide-react';
import { adminService, Booking } from '@/services/adminService';
import { Link } from 'react-router-dom';

export function AdminDashboardHome() {
    const { user } = useAuth();
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const bookings = await adminService.getBookings();
                // Get the 5 most recent bookings
                setRecentBookings(bookings.slice(0, 5));
            } catch (error) {
                console.error('Failed to load dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
                <div className="text-sm text-muted-foreground">
                    Welcome back, <span className="font-semibold text-primary">{user?.full_name}</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* ... (Keep stats grid as is) */}
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$45,231.89</div>
                        <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+2350</div>
                        <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Bookings</CardTitle>
                        <Map className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+{recentBookings.length}</div>
                        <p className="text-xs text-muted-foreground">Recent activity</p>
                    </CardContent>
                </Card>
                <Card className="hover:shadow-lg transition-shadow duration-300">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">+573</div>
                        <p className="text-xs text-muted-foreground">+201 since last hour</p>
                    </CardContent>
                </Card>
            </div>

            {/* Recent Bookings Section */}
            <Card className="col-span-4 hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Bookings</CardTitle>
                    <Link to="/admin/bookings" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                        View All <ArrowRight className="w-3 h-3" />
                    </Link>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="h-[200px] flex items-center justify-center">Loading...</div>
                    ) : recentBookings.length > 0 ? (
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50">
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Destination</th>
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">User</th>
                                        <th className="h-10 px-2 text-left align-middle font-medium text-muted-foreground">Date</th>
                                        <th className="h-10 px-2 text-right align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {recentBookings.map((booking) => (
                                        <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-2 align-middle font-medium">{booking.destinations?.name}</td>
                                            <td className="p-2 align-middle">{booking.user_name}</td>
                                            <td className="p-2 align-middle text-muted-foreground">
                                                {new Date(booking.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="p-2 align-middle text-right">
                                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${booking.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                            'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="h-[200px] flex items-center justify-center text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                            No recent bookings to display.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
