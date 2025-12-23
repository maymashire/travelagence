import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Star, MapPin, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '@/services/api';

export function SearchResults() {
    const [priceRange, setPriceRange] = useState([1000]);
    const [results, setResults] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real app, we would use the search query from the URL
        api.getTrendingDestinations().then((data: any) => {
            setResults(data);
            setLoading(false);
        });
    }, []);

    const filteredResults = results.filter(r => r.price <= priceRange[0]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Filters Sidebar */}
                <aside className="w-full md:w-64 space-y-6">
                    <div className="flex items-center gap-2 font-semibold text-lg">
                        <Filter className="w-5 h-5" /> Filters
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Price Range</h3>
                        <Slider
                            defaultValue={[1000]}
                            max={1000}
                            step={10}
                            value={priceRange}
                            onValueChange={setPriceRange}
                        />
                        <div className="flex justify-between text-sm text-muted-foreground">
                            <span>$0</span>
                            <span>${priceRange[0]}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Accommodation Type</h3>
                        <div className="space-y-2">
                            {['Hotel', 'Villa', 'Apartment', 'Resort'].map((type) => (
                                <div key={type} className="flex items-center space-x-2">
                                    <Checkbox id={type} />
                                    <label htmlFor={type} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {type}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-medium">Rating</h3>
                        <div className="space-y-2">
                            {[5, 4, 3].map((rating) => (
                                <div key={rating} className="flex items-center space-x-2">
                                    <Checkbox id={`rating-${rating}`} />
                                    <label htmlFor={`rating-${rating}`} className="text-sm font-medium leading-none flex items-center">
                                        {Array(rating).fill(0).map((_, i) => (
                                            <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-0.5" />
                                        ))}
                                        <span className="ml-1">& up</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <div className="flex-1">
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold mb-2">Stays in Popular Destinations</h1>
                        <p className="text-muted-foreground">{filteredResults.length} properties found</p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-64">Loading...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredResults.map((result) => (
                                <Link key={result.id} to={`/details/${result.id}`}>
                                    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow h-full flex flex-col">
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={result.image}
                                                alt={result.name}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                            />
                                            <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-md px-2 py-1 rounded-md flex items-center text-white text-xs font-bold">
                                                <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                                                {result.rating}
                                            </div>
                                        </div>
                                        <CardContent className="p-4 flex-1 flex flex-col">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-semibold truncate pr-2">{result.name}</h3>
                                                    <div className="flex items-center text-sm text-muted-foreground">
                                                        <MapPin className="w-3 h-3 mr-1" />
                                                        {result.location}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="mt-auto pt-4 flex items-center justify-between">
                                                <div>
                                                    <span className="text-lg font-bold text-primary">${result.price}</span>
                                                    <span className="text-sm text-muted-foreground">/night</span>
                                                </div>
                                                <Button size="sm" variant="outline">View Details</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
