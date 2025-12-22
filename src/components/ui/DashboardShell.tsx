import { Button } from './Button';
import { LayoutDashboard, Link as LinkIcon, Users, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface DashboardShellProps {
    children: React.ReactNode;
    userRole?: 'admin' | 'affiliate';
}

export function DashboardShell({ children, userRole = 'affiliate' }: DashboardShellProps) {
    const router = useRouter();
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

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 border-r border-border bg-card flex flex-col">
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-gradient">EasyStay Retreats</h1>
                    <p className="text-xs text-secondary mt-1">Affiliate Portal</p>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-secondary hover:text-foreground transition-all duration-200"
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-sm font-medium">{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 h-auto py-3 px-4 text-secondary hover:text-red-500"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Log out</span>
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
