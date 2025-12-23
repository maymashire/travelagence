import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, MapPin, Filter } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

const filters = ['All', 'Beach', 'City', 'Adventure', 'Luxury'];

export function Destinations() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [selectedFilter, setSelectedFilter] = useState('All');
    const [destinations, setDestinations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getTrendingDestinations().then((data: any) => {
            setDestinations(data);
            setLoading(false);
        });
    }, []);

    const filteredDestinations = destinations.filter(d => {
        const matchesFilter = selectedFilter === 'All' || d.category === selectedFilter;
        const matchesQuery = !query ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.country.toLowerCase().includes(query.toLowerCase()) ||
            d.city.toLowerCase().includes(query.toLowerCase());
        return matchesFilter && matchesQuery;
    });

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className="w-full lg:w-64 space-y-6 lg:space-y-8">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4 lg:mb-6 flex items-center gap-2">
                                <Filter className="w-5 h-5" /> Filters
                            </h3>
                            {/* Mobile Filters Scrollable */}
                            <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0">
                                {filters.map((filter) => (
                                    <button
                                        key={filter}
                                        onClick={() => setSelectedFilter(filter)}
                                        className={`whitespace-nowrap lg:w-full text-left px-6 lg:px-4 py-2.5 lg:py-3 rounded-full lg:rounded-xl transition-all duration-200 font-medium border lg:border-none ${selectedFilter === filter
                                            ? 'bg-primary text-white shadow-lg shadow-blue-200 border-primary'
                                            : 'bg-white text-gray-600 hover:bg-blue-50 hover:text-primary border-gray-200'
                                            }`}
                                    >
                                        {filter}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="hidden lg:block bg-blue-50 p-6 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-900 mb-2">Need Help?</h4>
                            <p className="text-sm text-blue-700 mb-4">
                                Can't decide where to go? Let our travel experts help you plan your dream vacation.
                            </p>
                            <Button className="w-full bg-primary hover:bg-blue-600 text-white shadow-md">
                                Contact Us
                            </Button>
                        </div>
                    </aside>

                    {/* Results Grid */}
                    <div className="flex-1">
                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Explore Destinations</h1>
                            <p className="text-gray-500">Discover your next adventure from our curated list of top destinations.</p>
                        </div>

                        {loading ? (
                            <div className="flex items-center justify-center h-64">Loading...</div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredDestinations.map((dest, index) => (
                                    <motion.div
                                        key={dest.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: index * 0.1 }}
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
                                            <CardContent className="p-6">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary transition-colors">{dest.name}</h3>
                                                        <div className="flex items-center text-sm text-gray-500 mt-1">
                                                            <MapPin className="w-3.5 h-3.5 mr-1" />
                                                            {dest.country}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center justify-between pt-4 border-t border-gray-100 gap-2">
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
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
