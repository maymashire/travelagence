import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { adminService, Booking } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Loader2, Check, X, Trash2, Calendar, Search, MapPin, User, Eye } from 'lucide-react';
import { ConfirmationDialog } from '@/components/ui/ConfirmationDialog';

export function AdminBookings() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [deleteId, setDeleteId] = useState<number | string | null>(null);

    useEffect(() => {
        loadBookings();
    }, []);

    const loadBookings = async () => {
        try {
            const data = await adminService.getBookings();
            setBookings(data || []);
        } catch (error) {
            console.error('Failed to load bookings', error);
            toast.error('Failed to load bookings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: number | string, status: 'approved' | 'cancelled') => {
        try {
            await adminService.updateBookingStatus(id, status);
            setBookings(bookings.map(b => b.id === id ? { ...b, status } : b));
            toast.success(`Booking ${status} successfully`);
        } catch (error) {
            console.error('Failed to update booking status', error);
            toast.error('Failed to update status');
        }
    };

    const handleDeleteClick = (id: number | string) => {
        setDeleteId(id);
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            await adminService.deleteBooking(deleteId);
            setBookings(bookings.filter(b => b.id !== deleteId));
            toast.success('Booking deleted successfully');
            setDeleteId(null);
        } catch (error) {
            console.error('Failed to delete booking', error);
            toast.error('Failed to delete booking');
        } finally {
            setIsDeleting(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'approved':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>;
            case 'cancelled':
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Cancelled</span>;
            default:
                return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>;
        }
    };

    const filteredBookings = bookings.filter(b =>
        b.destinations?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.user_email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) return <div className="flex items-center justify-center h-96"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bookings</h1>
                    <p className="text-muted-foreground">Manage user bookings.</p>
                </div>
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search bookings..."
                        className="pl-8"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block rounded-md border bg-white shadow-sm">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Destination</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">User</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {filteredBookings.map((booking) => (
                            <tr key={booking.id} className="border-b transition-colors hover:bg-muted/50">
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-3">
                                        {booking.destinations?.image && (
                                            <img src={booking.destinations.image} alt="" className="w-10 h-10 rounded-md object-cover" />
                                        )}
                                        <span className="font-medium">{booking.destinations?.name || 'Unknown'}</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="flex flex-col">
                                        <span className="font-medium">{booking.user_name || 'Unknown User'}</span>
                                        <span className="text-xs text-muted-foreground">{booking.user_email}</span>
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="w-4 h-4" />
                                        {new Date(booking.created_at).toLocaleDateString()}
                                    </div>
                                </td>
                                <td className="p-4 align-middle">
                                    {getStatusBadge(booking.status)}
                                </td>
                                <td className="p-4 align-middle text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600 hover:bg-blue-50" title="View Details">
                                                    <Eye className="w-4 h-4" />
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="max-w-md">
                                                <DialogHeader>
                                                    <DialogTitle>Booking Details</DialogTitle>
                                                    <DialogDescription>
                                                        Full information for booking #{booking.id}
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="space-y-4 py-4">
                                                    <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                                        {booking.destinations?.image && (
                                                            <img src={booking.destinations.image} alt="" className="w-16 h-16 rounded-md object-cover" />
                                                        )}
                                                        <div>
                                                            <h4 className="font-bold text-lg">{booking.destinations?.name}</h4>
                                                            <p className="text-sm text-muted-foreground">{booking.destinations?.city}, {booking.destinations?.country}</p>
                                                        </div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground">Customer Name</p>
                                                            <p className="font-medium">{booking.user_name}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground">Customer Email</p>
                                                            <p className="font-medium">{booking.user_email}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground">Booking Date</p>
                                                            <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-muted-foreground">Status</p>
                                                            <div>{getStatusBadge(booking.status)}</div>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 border-t">
                                                        <p className="text-muted-foreground text-xs mb-1">Booking Reference</p>
                                                        <p className="font-mono text-xs bg-muted p-2 rounded">{booking.id}</p>
                                                    </div>
                                                </div>
                                                <DialogFooter>
                                                    <DialogClose asChild>
                                                        <Button variant="outline">Close</Button>
                                                    </DialogClose>
                                                </DialogFooter>
                                            </DialogContent>
                                        </Dialog>
                                        {booking.status === 'pending' && (
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-green-600 hover:bg-green-50" onClick={() => handleStatusUpdate(booking.id, 'approved')} title="Approve">
                                                <Check className="w-4 h-4" />
                                            </Button>
                                        )}
                                        {booking.status !== 'cancelled' && (
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-red-600 hover:bg-red-50" onClick={() => handleStatusUpdate(booking.id, 'cancelled')} title="Cancel">
                                                <X className="w-4 h-4" />
                                            </Button>
                                        )}
                                        <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => handleDeleteClick(booking.id)}>
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {filteredBookings.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-muted-foreground">
                                    No bookings found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden grid grid-cols-1 gap-4">
                {filteredBookings.map((booking) => (
                    <Card key={booking.id} className="overflow-hidden">
                        <CardContent className="p-4 space-y-4">
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-3">
                                    {booking.destinations?.image && (
                                        <img src={booking.destinations.image} alt="" className="w-12 h-12 rounded-md object-cover" />
                                    )}
                                    <div>
                                        <h3 className="font-bold">{booking.destinations?.name || 'Unknown'}</h3>
                                        <div className="flex items-center text-xs text-muted-foreground">
                                            <MapPin className="w-3 h-3 mr-1" />
                                            {booking.destinations?.city}
                                        </div>
                                    </div>
                                </div>
                                {getStatusBadge(booking.status)}
                            </div>

                            <div className="flex items-center gap-2 bg-muted/50 p-2 rounded-md">
                                <User className="w-4 h-4 text-muted-foreground" />
                                <div className="text-sm">
                                    <span className="font-medium block">{booking.user_name}</span>
                                    <span className="text-xs text-muted-foreground">{booking.user_email}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-2 border-t">
                                <span className="text-xs text-muted-foreground">{new Date(booking.created_at).toLocaleDateString()}</span>
                                <div className="flex gap-2">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button size="icon" variant="outline" className="h-8 w-8 text-blue-600">
                                                <Eye className="w-4 h-4" />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="max-w-[90vw] rounded-lg">
                                            <DialogHeader>
                                                <DialogTitle>Booking Details</DialogTitle>
                                                <DialogDescription>
                                                    View full booking information.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4 py-4">
                                                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                                                    {booking.destinations?.image && (
                                                        <img src={booking.destinations.image} alt="" className="w-16 h-16 rounded-md object-cover" />
                                                    )}
                                                    <div>
                                                        <h4 className="font-bold">{booking.destinations?.name}</h4>
                                                        <p className="text-xs text-muted-foreground">{booking.destinations?.city}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-3 text-sm">
                                                    <div>
                                                        <p className="text-muted-foreground text-xs">Customer</p>
                                                        <p className="font-medium">{booking.user_name}</p>
                                                        <p className="text-xs text-muted-foreground">{booking.user_email}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs">Date</p>
                                                        <p className="font-medium">{new Date(booking.created_at).toLocaleDateString()}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-muted-foreground text-xs">Status</p>
                                                        <div>{getStatusBadge(booking.status)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                    {booking.status === 'pending' && (
                                        <Button size="sm" variant="outline" className="text-green-600 h-8" onClick={() => handleStatusUpdate(booking.id, 'approved')}>
                                            Approve
                                        </Button>
                                    )}
                                    {booking.status !== 'cancelled' && (
                                        <Button size="sm" variant="outline" className="text-red-600 h-8" onClick={() => handleStatusUpdate(booking.id, 'cancelled')}>
                                            Cancel
                                        </Button>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground" onClick={() => handleDeleteClick(booking.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <ConfirmationDialog
                isOpen={deleteId !== null}
                onClose={() => setDeleteId(null)}
                onConfirm={handleConfirmDelete}
                title="Delete Booking"
                description="Are you sure you want to delete this booking? This action cannot be undone."
                confirmText="Delete"
                variant="danger"
                isLoading={isDeleting}
            />
        </div>
    );
}
