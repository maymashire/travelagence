import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AdminSidebar } from './AdminSidebar';
import { cn } from '@/lib/utils';

export function AdminLayout() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <div className="flex flex-1">
                <AdminSidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
                <div className={cn(
                    "flex-1 transition-all duration-300",
                    isCollapsed ? "md:ml-16" : "md:ml-64"
                )}>
                    <main className="p-8">
                        <Outlet />
                    </main>
                </div>
            </div>
        </div>
    );
}

