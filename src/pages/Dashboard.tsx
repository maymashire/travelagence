import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Loader2, Plane, DollarSign, TrendingUp, Globe } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function Dashboard() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchBookings();
        }
    }, [user]);

    const fetchBookings = async () => {
        try {
            const { data, error } = await supabase
                .from('bookings')
                .select(`
                    *,
                    destinations (name, image, city, country)
                `)
                .eq('user_id', user?.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to fetch bookings', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate Stats
    const totalSpent = bookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
    const totalTrips = bookings.length;
    const uniqueCountries = new Set(bookings.map(b => b.destinations?.country)).size;

    // Chart Data
    const spendingData = bookings.map(b => ({
        name: b.destinations?.name || 'Trip',
        amount: b.total_price || 0
    })).reverse(); // Show oldest first

    const typeData = bookings.reduce((acc: any[], curr) => {
        const type = curr.booking_type || 'Other';
        const existing = acc.find(i => i.name === type);
        if (existing) {
            existing.value += 1;
        } else {
            acc.push({ name: type, value: 1 });
        }
        return acc;
    }, []);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="container mx-auto px-4 py-8 pt-24">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-muted-foreground">Welcome back, {user?.full_name}!</p>
                </div>
                <Link to="/booking">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg shadow-blue-200">Plan a New Trip</Button>
                </Link>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-none shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-blue-100 font-medium">Total Spent</p>
                            <h3 className="text-3xl font-bold mt-1">${totalSpent.toLocaleString()}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <DollarSign className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-none shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 font-medium">Total Trips</p>
                            <h3 className="text-3xl font-bold mt-1">{totalTrips}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <Plane className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-lg">
                    <CardContent className="p-6 flex items-center justify-between">
                        <div>
                            <p className="text-emerald-100 font-medium">Countries Visited</p>
                            <h3 className="text-3xl font-bold mt-1">{uniqueCountries}</h3>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="bg-white p-1 border border-gray-100 rounded-xl shadow-sm">
                    <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">Overview</TabsTrigger>
                    <TabsTrigger value="bookings" className="rounded-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-600">My Bookings</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Spending Chart */}
                        <Card className="shadow-md border-gray-100">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-blue-500" /> Spending History
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full">
                                    {bookings.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={spendingData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={(value) => `$${value}`} />
                                                <Tooltip
                                                    cursor={{ fill: '#f9fafb' }}
                                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar dataKey="amount" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Booking Types Chart */}
                        <Card className="shadow-md border-gray-100">
                            <CardHeader>
                                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                                    <Plane className="w-5 h-5 text-purple-500" /> Trip Types
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px] w-full flex items-center justify-center">
                                    {bookings.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={typeData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={60}
                                                    outerRadius={80}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {typeData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="text-muted-foreground">No data available</div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="bookings">
                    <div className="grid gap-6">
                        {bookings.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center text-muted-foreground">
                                    <Plane className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-lg">No bookings found yet.</p>
                                    <Link to="/destinations" className="mt-4 inline-block">
                                        <Button variant="outline">Explore Destinations</Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        ) : (
                            bookings.map((booking) => (
                                <Card key={booking.id} className="overflow-hidden hover:shadow-md transition-shadow border-gray-100">
                                    <CardContent className="p-0 flex flex-col md:flex-row">
                                        <div className="w-full md:w-64 h-48 md:h-auto relative">
                                            <img
                                                src={booking.destinations?.image || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop'}
                                                alt={booking.destinations?.name}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold uppercase tracking-wider shadow-sm">
                                                {booking.status}
                                            </div>
                                        </div>
                                        <div className="flex-1 p-6 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-2xl font-bold text-gray-900">{booking.destinations?.name || 'Unknown Trip'}</h3>
                                                    <div className="flex items-center text-muted-foreground mt-1">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        {booking.destinations?.city}, {booking.destinations?.country}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-2xl font-bold text-primary">${booking.total_price?.toLocaleString()}</div>
                                                    <div className="text-sm text-muted-foreground">{booking.travelers} Traveler(s)</div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                                                <div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Start Date</div>
                                                    <div className="flex items-center mt-1 font-medium">
                                                        <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                                                        {booking.start_date ? new Date(booking.start_date).toLocaleDateString() : 'TBD'}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Type</div>
                                                    <div className="mt-1 font-medium">{booking.booking_type}</div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Booking ID</div>
                                                    <div className="mt-1 font-mono text-sm text-gray-500">#{booking.id}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
