import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function AdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    const toggleMobileSidebar = () => {
        setIsMobileOpen(!isMobileOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Mobile Header */}
            <header className="md:hidden h-16 bg-white border-b px-4 flex items-center justify-between sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                        <span className="text-white font-bold text-xl">T</span>
                    </div>
                    <span className="font-bold text-lg">TravelAdmin</span>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleMobileSidebar}>
                    {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </Button>
            </header>

            <div className="flex flex-1">
                {/* Mobile Overlay */}
                {isMobileOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm transition-opacity"
                        onClick={() => setIsMobileOpen(false)}
                    />
                )}

                <AdminSidebar
                    isCollapsed={isCollapsed}
                    toggleSidebar={toggleSidebar}
                    isMobileOpen={isMobileOpen}
                    onClose={() => setIsMobileOpen(false)}
                />

                <div className={cn(
                    "flex-1 transition-all duration-300",
                    isCollapsed ? "md:ml-16" : "md:ml-64"
                )}>
                    <main className="p-4 md:p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

