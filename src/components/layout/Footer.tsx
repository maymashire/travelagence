import { useLocation } from 'react-router-dom';

export function Footer() {
    const location = useLocation();
    const allowedPaths = ['/', '/destinations', '/about', '/contact'];

    if (!allowedPaths.includes(location.pathname)) {
        return null;
    }

    return (
        <footer className="bg-white border-t border-gray-100 py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <p className="text-xs text-gray-400">
                    Powered By <span className="text-blue-600 font-bold">Eng Maria Shire</span>
                </p>
            </div>
        </footer>
    );
}
