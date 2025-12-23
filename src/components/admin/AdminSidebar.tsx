import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Map, CalendarCheck, LogOut, Globe, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

interface AdminSidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

export function AdminSidebar({ isCollapsed, toggleSidebar }: AdminSidebarProps) {
    const location = useLocation();
    const { logout } = useAuth();

    const menuItems = [
        {
            title: 'Dashboard',
            icon: LayoutDashboard,
            path: '/admin'
        },
        {
            title: 'Destinations',
            icon: Map,
            path: '/admin/destinations'
        },
        {
            title: 'Bookings',
            icon: CalendarCheck,
            path: '/admin/bookings'
        },
        {
            title: 'Users',
            icon: User,
            path: '/admin/users'
        }
    ];

    return (
        <div className={cn(
            "hidden md:flex flex-col bg-card border-r min-h-screen fixed left-0 top-0 z-50 transition-all duration-300",
            isCollapsed ? "w-16" : "w-64"
        )}>
            {/* Header */}
            <div className={cn(
                "h-16 flex items-center border-b px-4",
                isCollapsed ? "justify-center" : "justify-between"
            )}>
                <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary-foreground" />
                    </div>
                    <span className="font-bold text-xl">TravelAdmin</span>
                </div>
                {isCollapsed && (
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary-foreground" />
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className={cn("hidden md:flex", isCollapsed && "hidden group-hover:flex")}
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                </Button>
            </div>

            {/* Menu Items */}
            <div className="flex-1 py-6 px-2 space-y-1">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            title={isCollapsed ? item.title : undefined}
                            className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                                isActive
                                    ? "bg-primary text-primary-foreground shadow-md"
                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                                isCollapsed && "justify-center px-2"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 min-w-[1.25rem]", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-accent-foreground")} />
                            {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">{item.title}</span>}
                        </Link>
                    );
                })}
            </div>

            {/* Footer / Toggle / Logout */}
            <div className="p-2 border-t space-y-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleSidebar}
                    className="w-full justify-center hidden md:flex"
                >
                    {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <div className="flex items-center gap-2"><ChevronLeft className="w-4 h-4" /> <span>Collapse</span></div>}
                </Button>

                <button
                    onClick={logout}
                    title="Logout"
                    className={cn(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-red-500 hover:bg-red-50 transition-colors",
                        isCollapsed ? "justify-center" : "text-left"
                    )}
                >
                    <LogOut className="w-5 h-5 min-w-[1.25rem]" />
                    {!isCollapsed && <span className="font-medium whitespace-nowrap overflow-hidden">Logout</span>}
                </button>
            </div>
        </div>
    );
}
