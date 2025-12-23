import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function SplashPage() {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/login');
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-500 to-white overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 90, 0],
                        opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-white rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.5, 1],
                        rotate: [0, -90, 0],
                        opacity: [0.1, 0.3, 0.1]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-blue-200 rounded-full blur-3xl"
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="mb-8"
                >
                    <div className="w-24 h-24 border-4 border-white/30 border-t-white rounded-full animate-spin shadow-xl"></div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-center px-6"
                >
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-wider drop-shadow-lg mb-2">
                        Som Travel
                    </h1>
                    <p className="text-blue-50 text-base sm:text-lg font-light tracking-widest uppercase">
                        Your Journey Begins Here
                    </p>
                </motion.div>
            </div>

            {/* Footer Text */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5, duration: 1 }}
                className="absolute bottom-12 left-0 right-0 text-center px-4"
            >
                <p className="text-white font-bold text-[10px] md:text-xs tracking-[0.3em] uppercase drop-shadow-md opacity-80">
                    POWERED BY ENG MARIA SHIRE
                </p>
            </motion.div>
        </div>
    );
}
