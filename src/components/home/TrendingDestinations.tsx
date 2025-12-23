import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/services/api';
import { Link } from 'react-router-dom';

export function TrendingDestinations() {
    const [destinations, setDestinations] = useState<any[]>([]);

    useEffect(() => {
        api.getTrendingDestinations().then((data: any) => setDestinations(data));
    }, []);

    return (
        <section className="py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">
                        Popular Destinations
                    </h2>
                    <p className="text-gray-500 mt-2">Explore our top-rated locations for your next trip.</p>
                </div>
                <Button variant="outline" className="hidden sm:flex border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700" asChild>
                    <Link to="/destinations">View All <ArrowRight className="ml-2 w-4 h-4" /></Link>
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {destinations.map((dest, index) => (
                    <motion.div
                        key={dest.id}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                    >
                        <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col bg-white rounded-2xl">
                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={dest.image}
                                    alt={dest.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-blue-600 text-sm font-bold shadow-sm">
                                    <Star className="w-3.5 h-3.5 mr-1 fill-blue-600" />
                                    {dest.rating}
                                </div>
                            </div>
                            <CardContent className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{dest.name}</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-6 flex-1 line-clamp-2">{dest.description}</p>
                                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100 gap-2">
                                    <div>
                                        <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">From</span>
                                        <div className="text-xl font-bold text-primary">${dest.price}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Link to={`/details/${dest.id}`}>
                                            <Button size="sm" variant="outline" className="text-blue-600 border-blue-200 hover:bg-blue-50">
                                                Details
                                            </Button>
                                        </Link>
                                        <Link to="/booking" state={{ destination: dest }}>
                                            <Button size="sm" className="bg-primary hover:bg-blue-700 text-white shadow-md">
                                                Book Now
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
