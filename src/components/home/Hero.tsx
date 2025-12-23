import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Calendar, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { DestinationSelect } from './DestinationSelect';

export function Hero() {
    const navigate = useNavigate();
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [guests, setGuests] = useState('1');

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (destination) params.append('query', destination);
        if (date) params.append('date', date);
        if (guests) params.append('guests', guests);

        navigate(`/destinations?${params.toString()}`);
    };

    return (
        <div className="relative h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Background with gradient and overlay */}
            <div className="absolute inset-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-blue-600/60 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-12 md:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-4 md:mb-6 tracking-tight drop-shadow-lg leading-tight">
                        Discover Your Next <br className="hidden sm:block" />
                        <span className="text-blue-100">Adventure</span>
                    </h1>
                    <p className="text-lg md:text-2xl text-blue-50 mb-8 md:mb-12 max-w-2xl mx-auto font-light drop-shadow-md px-4">
                        Explore the world's most beautiful destinations with exclusive deals and curated experiences.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white/95 backdrop-blur-md p-4 md:p-2 rounded-2xl md:rounded-full shadow-2xl max-w-4xl mx-auto border border-white/20"
                >
                    <div className="flex flex-col md:flex-row gap-2 md:items-center">
                        <div className="flex-1">
                            <DestinationSelect
                                value={destination}
                                onSelect={setDestination}
                            />
                        </div>
                        <div className="h-px md:h-8 w-full md:w-px bg-gray-100 md:bg-gray-200 my-1 md:my-0"></div>
                        <div className="relative flex-1">
                            <Calendar className="absolute left-4 top-3 h-5 w-5 text-blue-500" />
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-12 bg-transparent border-none hover:bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-500 h-12 rounded-xl md:rounded-full text-base focus-visible:ring-0"
                            />
                        </div>
                        <div className="h-px md:h-8 w-full md:w-px bg-gray-100 md:bg-gray-200 my-1 md:my-0"></div>
                        <div className="relative flex-1">
                            <Users className="absolute left-4 top-3 h-5 w-5 text-blue-500" />
                            <Input
                                placeholder="Guests"
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="pl-12 bg-transparent border-none hover:bg-gray-50 focus:bg-white text-gray-900 placeholder:text-gray-500 h-12 rounded-xl md:rounded-full text-base focus-visible:ring-0"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="w-full md:w-auto h-12 md:h-14 px-8 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl md:rounded-full shadow-lg shadow-blue-200 text-base transition-all hover:scale-105 active:scale-95"
                        >
                            <Search className="w-5 h-5 mr-2" />
                            Search
                        </Button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
