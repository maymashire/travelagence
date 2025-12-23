import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Star, Sparkles, Check, Sun, Calendar, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { DestinationCard } from '@/components/ui/DestinationCard';

export function Details() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [destination, setDestination] = useState<any>(null);
    const [relatedDestinations, setRelatedDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!id) return;
            setLoading(true);
            try {
                const data: any = await api.getDestinationById(id);
                setDestination(data);

                // Fetch related destinations
                // In a real app, this might be a separate API call or included in the response
                if (data && data.relatedDestinations) {
                    const allDestinations: any = await api.getTrendingDestinations(); // Using this to simulate fetching by IDs
                    const related = allDestinations.filter((d: any) => data.relatedDestinations.includes(d.id));
                    setRelatedDestinations(related);
                }
            } catch (error) {
                console.error("Failed to fetch destination", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
        // Scroll to top when id changes
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!destination) {
        return <div className="min-h-screen flex items-center justify-center">Destination not found</div>;
    }

    return (
        <div className="min-h-screen pb-20">
            {/* Hero Image */}
            <div className="relative h-[50vh]">
                <img
                    src={destination.image}
                    alt={destination.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-8 container mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">{destination.name}</h1>
                        <div className="flex items-center text-white/80 text-lg">
                            <MapPin className="w-5 h-5 mr-2" />
                            {destination.location}
                            <div className="mx-4 h-4 w-px bg-white/30"></div>
                            <Star className="w-5 h-5 mr-1 text-yellow-400 fill-yellow-400" />
                            {destination.rating}
                        </div>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    {/* About */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">About this destination</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {destination.description}
                        </p>
                    </section>

                    {/* Best Season & Weather */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Calendar className="w-6 h-6 text-primary" />
                                    <h3 className="font-bold text-lg">Best Season</h3>
                                </div>
                                <p className="text-muted-foreground">{destination.bestSeason}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <Sun className="w-6 h-6 text-orange-500" />
                                    <h3 className="font-bold text-lg">Weather</h3>
                                </div>
                                <p className="text-muted-foreground">{destination.weather}</p>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Activities */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            <Activity className="w-6 h-6 text-primary" />
                            Things to do
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {destination.activities?.map((activity: string, i: number) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-secondary/20 border border-secondary">
                                    <div className="w-2 h-2 rounded-full bg-primary" />
                                    <span className="font-medium">{activity}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Gallery */}
                    <section>
                        <h2 className="text-2xl font-bold mb-4">Gallery</h2>
                        <div className="grid grid-cols-2 gap-4">
                            {destination.gallery?.map((img: string, i: number) => (
                                <img key={i} src={img} alt="Gallery" className="rounded-lg object-cover h-64 w-full hover:opacity-90 transition-opacity cursor-pointer" />
                            ))}
                        </div>
                    </section>

                    {/* AI Insights */}
                    <section>
                        <Card className="bg-primary/5 border-primary/20">
                            <CardContent className="p-6">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                    <h3 className="text-xl font-bold text-primary">AI Travel Insights</h3>
                                </div>
                                <ul className="space-y-3">
                                    {destination.aiInsights?.map((insight: string, i: number) => (
                                        <li key={i} className="flex items-start gap-3">
                                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                            <span>{insight}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </section>
                </div>

                {/* Booking Card */}
                <div className="lg:col-span-1">
                    <div className="sticky top-24">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex justify-between items-end mb-6">
                                    <div>
                                        <span className="text-3xl font-bold">${destination.price}</span>
                                        <span className="text-muted-foreground"> / night</span>
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
                                        {destination.rating}
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div className="border rounded-md p-3">
                                            <label className="text-xs text-muted-foreground block mb-1">Check-in</label>
                                            <div className="font-medium">Oct 15</div>
                                        </div>
                                        <div className="border rounded-md p-3">
                                            <label className="text-xs text-muted-foreground block mb-1">Check-out</label>
                                            <div className="font-medium">Oct 20</div>
                                        </div>
                                    </div>
                                    <div className="border rounded-md p-3">
                                        <label className="text-xs text-muted-foreground block mb-1">Guests</label>
                                        <div className="font-medium">2 Adults</div>
                                    </div>
                                </div>

                                <Button
                                    className="w-full text-lg py-6"
                                    onClick={() => navigate('/booking', { state: { destination } })}
                                >
                                    Reserve Now
                                </Button>

                                <p className="text-center text-xs text-muted-foreground mt-4">
                                    You won't be charged yet
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Related Destinations */}
            {relatedDestinations.length > 0 && (
                <div className="container mx-auto px-4 py-12 border-t mt-12">
                    <h2 className="text-3xl font-bold mb-8">You might also like</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedDestinations.map((dest) => (
                            <div key={dest.id} className="h-full">
                                <DestinationCard destination={dest} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
