import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Plane, Wallet, Loader2, CheckCircle } from 'lucide-react';
import { api } from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

export function Booking() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { destination } = location.state || {};

    const [destinations, setDestinations] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.full_name || '',
        email: user?.email || '',
        phone: '',
        destination: destination?.name || '',
        departureCity: '',
        departureDate: '',
        returnDate: '',
        travelers: 1,
        travelType: 'Flight + Hotel',
        seatPreference: 'Window',
        hotelRating: '4★',
        roomType: 'Double',
        specialRequests: '',
        paymentMethod: 'Credit Card',
        cardName: '',
        cardNumber: '',
        expiryDate: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchDestinations = async () => {
            try {
                const data = await api.getTrendingDestinations();
                setDestinations(data);
            } catch (error) {
                console.error("Failed to fetch destinations", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Calculate total amount
    const selectedDest = destinations.find(d => d.name === formData.destination) || destination;
    const pricePerPerson = selectedDest?.price || 500;
    const totalAmount = pricePerPerson * formData.travelers;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            alert("Please login to book a trip.");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            // Find destination ID
            const destId = selectedDest?.id;

            const { error } = await supabase
                .from('bookings')
                .insert([{
                    user_id: user.id,
                    destination_id: destId,
                    booking_type: formData.travelType,
                    total_price: totalAmount,
                    travelers: formData.travelers,
                    start_date: formData.departureDate,
                    end_date: formData.returnDate || null,
                    status: 'pending',
                    user_name: formData.fullName,
                    user_email: formData.email,
                    phone: formData.phone
                }]);

            if (error) throw error;

            setShowConfirmation(true);
        } catch (error: any) {
            console.error('Booking failed:', error);
            alert(`Booking failed: ${error.message}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseConfirmation = () => {
        setShowConfirmation(false);
        // Redirect based on role
        if (user?.role === 'admin') {
            navigate('/admin');
        } else {
            navigate('/dashboard');
        }
    };

    if (isLoading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

    return (
        <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="container mx-auto max-w-4xl">
                <Card className="w-full shadow-xl bg-white border-white/20">
                    <CardHeader className="text-center border-b border-gray-100 pb-8">
                        <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
                            Complete Your Booking
                        </CardTitle>
                        <p className="text-muted-foreground mt-2">Finalize your trip details and payment securely.</p>
                    </CardHeader>
                    <CardContent className="pt-8">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Booking Summary */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    <Plane className="w-5 h-5 text-blue-500" /> Trip Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/30 p-6 rounded-xl border border-blue-100">
                                    <div className="space-y-2">
                                        <Label htmlFor="travelType">Service Type</Label>
                                        <select
                                            id="travelType"
                                            name="travelType"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.travelType}
                                            onChange={handleChange}
                                        >
                                            <option value="Flight">Flight Only</option>
                                            <option value="Hotel">Hotel Only</option>
                                            <option value="Flight + Hotel">Flight + Hotel</option>
                                            <option value="Tour Package">All-Inclusive Tour</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="destination">Destination</Label>
                                        <select
                                            id="destination"
                                            name="destination"
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            value={formData.destination}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="" disabled>Select a destination</option>
                                            {destinations.map((dest: any) => (
                                                <option key={dest.id} value={dest.name}>
                                                    {dest.name} ({dest.country}) - ${dest.price}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="departureDate">Dates</Label>
                                        <div className="flex gap-2 items-center">
                                            <Input id="departureDate" name="departureDate" type="date" className="bg-white" value={formData.departureDate} onChange={handleChange} required />
                                            <span className="text-gray-400 text-sm">to</span>
                                            <Input id="returnDate" name="returnDate" type="date" className="bg-white" value={formData.returnDate} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="travelers">Travelers</Label>
                                        <Input id="travelers" name="travelers" type="number" min="1" className="bg-white" value={formData.travelers} onChange={handleChange} required />
                                    </div>
                                    <div className="md:col-span-2 pt-4 border-t border-blue-200/50 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-semibold text-gray-700">Estimated Total:</span>
                                            <span className="text-3xl font-bold text-blue-600">${totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    <Wallet className="w-5 h-5 text-blue-500" /> Payment Method
                                </h3>
                                <div className="space-y-2">
                                    <select
                                        id="paymentMethod"
                                        name="paymentMethod"
                                        className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                    >
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="Debit Card">Debit Card</option>
                                        <option value="PayPal">PayPal</option>
                                        <option value="Bank Transfer">Bank Transfer</option>
                                    </select>
                                </div>
                            </div>

                            {/* Payment Details */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                                    <CreditCard className="w-5 h-5 text-blue-500" /> Card Details
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="cardName">Cardholder Name</Label>
                                        <Input id="cardName" name="cardName" placeholder="John Doe" value={formData.cardName} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <Label htmlFor="cardNumber">Card Number</Label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Input id="cardNumber" name="cardNumber" className="pl-9" placeholder="0000 0000 0000 0000" value={formData.cardNumber} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="expiryDate">Expiry Date</Label>
                                        <Input id="expiryDate" name="expiryDate" placeholder="MM/YY" value={formData.expiryDate} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cvv">CVV</Label>
                                        <Input id="cvv" name="cvv" placeholder="123" maxLength={4} value={formData.cvv} onChange={handleChange} required />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6">
                                <Button type="submit" disabled={isSubmitting} className="w-full text-lg py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-xl shadow-blue-200 transform transition hover:scale-[1.01]">
                                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                                    {isSubmitting ? 'Processing...' : 'Confirm Booking'}
                                </Button>
                                <p className="text-xs text-center text-muted-foreground mt-4">
                                    Secure payment processing. Your data is encrypted.
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Dialog open={showConfirmation} onOpenChange={handleCloseConfirmation}>
                <DialogContent className="sm:max-w-md text-center">
                    <DialogHeader>
                        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <DialogTitle className="text-2xl font-bold text-center">Booking Confirmed!</DialogTitle>
                        <DialogDescription className="text-center pt-2">
                            Your trip to <span className="font-semibold text-primary">{formData.destination}</span> has been successfully booked.
                            <br />
                            We've sent a confirmation email to {formData.email}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-center mt-4">
                        <Button onClick={handleCloseConfirmation} className="w-full sm:w-auto px-8">
                            Go to Dashboard
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
}
