import { Hero } from '@/components/home/Hero';
import { TrendingDestinations } from '@/components/home/TrendingDestinations';

export function Home() {
    return (
        <div className="min-h-screen bg-gray-50">
            <Hero />
            <div className="container mx-auto px-4 py-16">
                <TrendingDestinations />
            </div>
        </div>
    );
}
