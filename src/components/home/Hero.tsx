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

            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                        Discover Your Next <br />
                        <span className="text-blue-100">Adventure</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-blue-50 mb-12 max-w-2xl mx-auto font-light drop-shadow-md">
                        Explore the world's most beautiful destinations with exclusive deals and curated experiences.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="bg-white p-4 rounded-3xl shadow-2xl max-w-4xl mx-auto"
                >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <DestinationSelect
                            value={destination}
                            onSelect={setDestination}
                        />
                        <div className="relative">
                            <Calendar className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
                            <Input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="pl-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white text-gray-900 placeholder:text-gray-500 h-12 rounded-xl text-base"
                            />
                        </div>
                        <div className="relative">
                            <Users className="absolute left-4 top-3.5 h-5 w-5 text-blue-500" />
                            <Input
                                placeholder="Guests"
                                type="number"
                                min="1"
                                value={guests}
                                onChange={(e) => setGuests(e.target.value)}
                                className="pl-12 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white text-gray-900 placeholder:text-gray-500 h-12 rounded-xl text-base"
                            />
                        </div>
                        <Button
                            onClick={handleSearch}
                            className="w-full h-12 bg-primary hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 text-base"
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
