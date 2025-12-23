import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star } from 'lucide-react';

interface DestinationCardProps {
    destination: {
        id: number | string;
        name: string;
        image: string;
        rating: number;
        description: string;
        price: number;
    };
}

export function DestinationCard({ destination }: DestinationCardProps) {
    return (
        <Link to={`/details/${destination.id}`} className="block h-full">
            <Card className="overflow-hidden border-none shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer h-full flex flex-col bg-white rounded-2xl">
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={destination.image}
                        alt={destination.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center text-blue-600 text-sm font-bold shadow-sm">
                        <Star className="w-3.5 h-3.5 mr-1 fill-blue-600" />
                        {destination.rating}
                    </div>
                </div>
                <CardContent className="p-4 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">{destination.name}</h3>
                    </div>
                    <p className="text-sm text-gray-500 mb-4 flex-1 line-clamp-2">{destination.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                        <div>
                            <span className="text-xs text-gray-400 uppercase font-semibold tracking-wider">From</span>
                            <div className="text-lg font-bold text-primary">${destination.price}</div>
                        </div>
                        <Button size="sm" className="bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg">
                            Details
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
