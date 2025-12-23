import { useState } from 'react';
import { Button } from './Button';
import { LayoutDashboard, Link as LinkIcon, Users, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardShellProps {
    children: React.ReactNode;
    userRole?: 'admin' | 'affiliate';
}

export function DashboardShell({ children, userRole = 'affiliate' }: DashboardShellProps) {
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    const navItems = userRole === 'admin'
        ? [
            { name: 'Overview', href: '/admin/dashboard', icon: LayoutDashboard },
            { name: 'Affiliates', href: '/admin/affiliates', icon: Users },
            { name: 'Settings', href: '/admin/settings', icon: Settings },
        ]
        : [
            { name: 'Dashboard', href: '/affiliate/dashboard', icon: LayoutDashboard },
            { name: 'My Links', href: '/affiliate/links', icon: LinkIcon },
            { name: 'Settings', href: '/affiliate/settings', icon: Settings },
        ];

    const toggleCollapse = () => setIsCollapsed((prev) => !prev);
    const asideWidthClass = isCollapsed ? 'w-20' : 'w-64';

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className={`${asideWidthClass} border-r border-border bg-card flex flex-col transition-[width] duration-200`}>
                <div className="flex items-center justify-between gap-2 px-4 py-5 border-b border-border">
                    <div className="flex flex-1 flex-col gap-1">
                        <h1 className={`text-xl font-bold text-gradient transition-opacity duration-200 ${isCollapsed ? 'sr-only' : 'opacity-100'}`}>
                            EasyStay Retreats
                        </h1>
                        <p className={`text-xs text-secondary transition-opacity duration-200 ${isCollapsed ? 'sr-only' : 'opacity-100'}`}>
                            Affiliate Portal
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        aria-expanded={!isCollapsed}
                        aria-label={isCollapsed ? 'Expand navigation' : 'Collapse navigation'}
                        onClick={toggleCollapse}
                        className="h-10 w-10 p-0 text-secondary hover:text-foreground"
                    >
                        {isCollapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </Button>
                </div>

                <nav className="flex-1 p-4 space-y-2" aria-label="main navigation">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-secondary hover:text-foreground transition-all duration-200 ${isCollapsed ? 'justify-center' : ''}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className={`text-sm font-medium transition-opacity duration-200 ${isCollapsed ? 'sr-only' : 'opacity-100'}`}>
                                {item.name}
                            </span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className={`w-full gap-3 h-auto py-3 px-4 text-secondary hover:text-red-500 ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                        <LogOut className="w-5 h-5" />
                        <span className={`text-sm font-medium transition-opacity duration-200 ${isCollapsed ? 'sr-only' : 'opacity-100'}`}>
                            Log out
                        </span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-8">
                <div className="max-w-6xl mx-auto uppercase tracking-wider text-[10px] font-bold text-secondary mb-2">
                    {userRole} view
                </div>
                <div className="max-w-6xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
