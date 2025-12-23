import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X, Globe, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        setIsOpen(false);
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/home" className="flex items-center gap-2 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:shadow-blue-300 transition-all duration-300">
                                <Globe className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 tracking-tight">
                                Som <span className="text-blue-600">Travel</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/home" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
                            Home
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/destinations" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
                            Destinations
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
                            About
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors relative group">
                            Contact
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                    </div>

                    {/* Right Side Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <Link to="/booking">
                            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-200 rounded-full px-6 transition-all duration-300 hover:scale-105">
                                Book Now
                            </Button>
                        </Link>

                        {user ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-blue-50 p-0 overflow-hidden border-2 border-transparent hover:border-blue-200 transition-all">
                                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100 text-blue-600 font-bold">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-lg">S</span>
                                            )}
                                        </div>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56 mt-2" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.full_name}</p>
                                            <p className="text-xs leading-none text-muted-foreground">
                                                {user.email}
                                            </p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => navigate(user.role === 'admin' ? "/admin" : "/dashboard")} className="cursor-pointer">
                                        <LayoutDashboard className="mr-2 h-4 w-4" />
                                        <span>Dashboard</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>Profile</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>Settings</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
                                        <LogOut className="mr-2 h-4 w-4" />
                                        <span>Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link to="/login">
                                    <Button variant="ghost" className="text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full">Login</Button>
                                </Link>
                                <Link to="/register">
                                    <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 rounded-full">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="-mr-2 flex md:hidden">
                        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)} className="text-gray-600 hover:bg-gray-100 rounded-full">
                            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="md:hidden bg-white/98 backdrop-blur-xl border-b border-gray-100 shadow-2xl absolute w-full left-0 top-20 overflow-hidden"
                >
                    <div className="px-4 pt-4 pb-8 space-y-1">
                        {[
                            { name: 'Home', path: '/home' },
                            { name: 'Destinations', path: '/destinations' },
                            { name: 'About', path: '/about' },
                            { name: 'Contact', path: '/contact' }
                        ].map((item) => (
                            <Link
                                key={item.name}
                                to={item.path}
                                className="text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 block px-4 py-3.5 rounded-xl text-lg font-semibold transition-all active:scale-95"
                                onClick={() => setIsOpen(false)}
                            >
                                {item.name}
                            </Link>
                        ))}

                        <Link to="/booking" onClick={() => setIsOpen(false)} className="block pt-2">
                            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-100 rounded-xl py-6 text-lg font-bold">
                                Book Now
                            </Button>
                        </Link>

                        {user ? (
                            <div className="border-t border-gray-100 pt-6 mt-6">
                                <div className="flex items-center gap-4 mb-6 px-2">
                                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden shadow-inner">
                                        {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.full_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <span className="text-xl">{user.full_name[0]}</span>
                                        )}
                                    </div>
                                    <div>
                                        <div className="text-base font-bold text-gray-900">{user.full_name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 gap-2">
                                    <Link
                                        to={user.role === 'admin' ? "/admin" : "/dashboard"}
                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-3.5 rounded-xl text-lg font-semibold transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <LayoutDashboard className="w-5 h-5" />
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 text-gray-700 hover:text-blue-600 hover:bg-blue-50/50 px-4 py-3.5 rounded-xl text-lg font-semibold transition-all"
                                        onClick={() => setIsOpen(false)}
                                    >
                                        <User className="w-5 h-5" />
                                        Profile
                                    </Link>
                                    <button
                                        className="flex items-center gap-3 w-full text-left text-red-500 hover:bg-red-50/50 px-4 py-3.5 rounded-xl text-lg font-semibold transition-all"
                                        onClick={handleLogout}
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Log out
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="border-t border-gray-100 pt-6 mt-6 grid grid-cols-2 gap-3">
                                <Link to="/login" onClick={() => setIsOpen(false)}>
                                    <Button variant="ghost" className="w-full h-12 text-gray-700 hover:bg-gray-50 rounded-xl font-bold">Login</Button>
                                </Link>
                                <Link to="/register" onClick={() => setIsOpen(false)}>
                                    <Button variant="outline" className="w-full h-12 border-blue-200 text-blue-600 hover:bg-blue-50 rounded-xl font-bold">Register</Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </nav>
    );
}
