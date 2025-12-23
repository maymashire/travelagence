import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/services/api';

interface Destination {
    id: number;
    name: string;
    country: string;
    city: string;
}

interface DestinationSelectProps {
    onSelect: (destination: string) => void;
    value: string;
}

export function DestinationSelect({ onSelect, value }: DestinationSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true);
            try {
                const data = await api.getTrendingDestinations();
                setDestinations(data);
            } catch (error) {
                console.error('Failed to fetch destinations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredDestinations = destinations.filter(dest =>
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.city.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (name: string) => {
        onSelect(name);
        setSearchQuery('');
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            <div className="relative group">
                <MapPin className={`absolute left-4 top-3.5 h-5 w-5 transition-colors duration-200 ${isOpen ? 'text-primary' : 'text-blue-500'}`} />
                <input
                    type="text"
                    placeholder="Where to?"
                    value={isOpen ? searchQuery : value}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (!isOpen) setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    className="w-full pl-12 pr-10 bg-gray-50 border-transparent hover:bg-gray-100 focus:bg-white text-gray-900 placeholder:text-gray-500 h-12 rounded-xl text-base focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none"
                />
                {value && !isOpen && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect('');
                        }}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                )}
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto"
                    >
                        {loading ? (
                            <div className="p-4 text-center text-gray-500">Loading destinations...</div>
                        ) : filteredDestinations.length > 0 ? (
                            <div className="py-2">
                                {filteredDestinations.map((dest) => (
                                    <button
                                        key={dest.id}
                                        onClick={() => handleSelect(dest.name)}
                                        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-blue-50 transition-colors text-left group"
                                    >
                                        <div className="mt-1 p-1.5 bg-blue-50 rounded-lg group-hover:bg-white transition-colors">
                                            <MapPin className="h-4 w-4 text-primary" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{dest.name}</div>
                                            <div className="text-sm text-gray-500">{dest.city}, {dest.country}</div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <Search className="h-12 w-12 text-gray-200 mx-auto mb-3" />
                                <p className="text-gray-500">No destinations found for "{searchQuery}"</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
