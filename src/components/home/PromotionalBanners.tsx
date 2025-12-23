import { Button } from '@/components/ui/button';
import { ArrowRight, Percent } from 'lucide-react';

export function PromotionalBanners() {
    return (
        <section className="py-12 container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 p-8 text-white shadow-lg">
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                            <Percent className="mr-2 h-4 w-4" />
                            Limited Offer
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">Get 20% off your first AI-planned trip</h3>
                        <p className="mb-6 text-blue-100">
                            Sign up today and let our AI assistant craft your perfect itinerary for less.
                        </p>
                        <Button variant="secondary" className="font-semibold">
                            Claim Offer <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-blue-900/20 blur-3xl" />
                </div>

                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-600 to-pink-500 p-8 text-white shadow-lg">
                    <div className="relative z-10">
                        <div className="mb-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-sm font-medium backdrop-blur-sm">
                            New Feature
                        </div>
                        <h3 className="mb-2 text-2xl font-bold">Explore with Augmented Reality</h3>
                        <p className="mb-6 text-purple-100">
                            Preview your destinations in immersive AR before you book.
                        </p>
                        <Button variant="secondary" className="font-semibold">
                            Try AR Mode <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                    <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
                    <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-purple-900/20 blur-3xl" />
                </div>
            </div>
        </section>
    );
}
