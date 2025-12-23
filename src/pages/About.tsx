import { motion } from 'framer-motion';

export function About() {
    return (
        <div className="min-h-screen bg-white pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto"
                >
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        {/* Text Content */}
                        <div className="space-y-8">
                            <div className="relative">
                                <h1 className="text-5xl font-bold text-gray-900 leading-tight">
                                    Our Story
                                </h1>
                                <div className="absolute -left-6 top-0 bottom-0 w-1 bg-primary rounded-full hidden lg:block"></div>
                            </div>

                            <div className="space-y-6 text-lg text-gray-600 leading-relaxed">
                                <p>
                                    Founded with a passion for exploration, Som Travel Agency began as a simple idea: to make the world's most breathtaking destinations accessible to everyone, without compromising on quality or comfort.
                                </p>
                                <p>
                                    We believe that travel is not just about moving from one place to another; it's about the stories you create, the people you meet, and the memories that last a lifetime. Our team of dedicated travel experts works tirelessly to curate unique experiences that go beyond the ordinary.
                                </p>
                                <p>
                                    From the pristine beaches of the Maldives to the bustling streets of Tokyo, we handpick every hotel, tour, and activity to ensure that your journey is nothing short of perfection.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-100">
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">10k+</div>
                                    <div className="text-sm text-gray-500">Happy Travelers</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">500+</div>
                                    <div className="text-sm text-gray-500">Destinations</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                                    <div className="text-sm text-gray-500">Support</div>
                                </div>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="relative">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.2 }}
                                className="relative z-10"
                            >
                                <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-100 bg-white p-2">
                                    <img
                                        src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=2021&auto=format&fit=crop"
                                        alt="Traveler looking at mountains"
                                        className="w-full h-[600px] object-cover rounded-2xl"
                                    />
                                </div>
                            </motion.div>

                            {/* Decorative Elements */}
                            <div className="absolute -top-10 -right-10 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                            <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-purple-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
