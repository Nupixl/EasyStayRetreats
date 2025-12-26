"use client";

import { Button } from './Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './Card';
import { LayoutDashboard, Link as LinkIcon, Users, Settings, LogOut, Shield, Home, Calendar, UserCheck, Menu, X, ArrowRight, CheckCircle2, DollarSign, Building, UserPlus, Briefcase, ChevronRight, Activity, TrendingUp, CreditCard, MessageSquare, HelpCircle, Clock, AlertCircle, ArrowUpRight } from 'lucide-react';
import { PermissionSelector, RoleType } from './PermissionSelector';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ThemeToggle } from './ThemeToggle';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DashboardShellProps {
    children: React.ReactNode;
    userRole?: 'admin' | 'affiliate';
}

const mockPropertyManagers = [
    { id: 'pm1', name: 'West Coast Living', email: 'pm@westcoast.com', affiliates: ['John Doe', 'Elite Referrals'] },
    { id: 'pm2', name: 'Urban Retreats LLC', email: 'contact@urban.com', affiliates: ['Marketing Pro', 'Sarah Jenkins'] },
    { id: 'pm3', name: 'Alpine Vibe Management', email: 'ops@alpine.com', affiliates: ['John Doe'] },
];

const mockAffiliates = [
    { id: 'af1', name: 'John Doe', email: 'john@doe.com', managers: ['West Coast Living', 'Alpine Vibe Management'] },
    { id: 'af2', name: 'Elite Referrals', email: 'elite@referrals.com', managers: ['West Coast Living'] },
    { id: 'af3', name: 'Marketing Pro', email: 'pro@marketing.com', managers: ['Urban Retreats LLC'] },
];

const mockDealFlow = [
    { id: 'd1', property: 'Beachfront Villa', affiliate: 'John Doe', status: 'Validated', date: '2025-12-20' },
    { id: 'd2', property: 'Downtown Loft', affiliate: 'Sarah Jenkins', status: 'Meeting Scheduled', date: '2025-12-22' },
    { id: 'd3', property: 'Mountain Cabin', affiliate: 'John Doe', status: 'Payout Processing', date: '2025-12-18' },
    { id: 'd4', property: 'Garden Suite', affiliate: 'Marketing Pro', status: 'New Lead', date: '2025-12-24' },
];

export function DashboardShell({ children, userRole = 'affiliate' }: DashboardShellProps) {
    const router = useRouter();
    const [simulatedRole, setSimulatedRole] = useState<RoleType>(userRole as RoleType);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeSubView, setActiveSubView] = useState('overview');
    const [selectedDeal, setSelectedDeal] = useState<any>(null);
    const [isDealModalOpen, setIsDealModalOpen] = useState(false);
    const [isAffiliateManageOpen, setIsAffiliateManageOpen] = useState<string | null>(null);
    const [pmTimeRange, setPmTimeRange] = useState('30d');
    const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
    const [isEditPartnerModalOpen, setIsEditPartnerModalOpen] = useState(false);
    const [managedPartner, setManagedPartner] = useState<any>(null);

    // Sync with prop if it changes (e.g. on navigation)
    useEffect(() => {
        setSimulatedRole(userRole as RoleType);
    }, [userRole]);

    // Close sidebar on mobile when navigating
    const closeSidebar = () => setIsSidebarOpen(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        router.push('/login');
    };

    const navItems = {
        admin: [
            { name: 'Overview', id: 'overview', icon: LayoutDashboard },
            { name: 'Property Managers', id: 'managers', icon: Building },
            { name: 'Affiliate Partners', id: 'affiliates', icon: Users },
            { name: 'Settings', id: 'settings', icon: Settings },
        ],
        affiliate: [
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'referrals', name: 'My Referrals', icon: Users },
            { id: 'payouts', name: 'Payouts', icon: CreditCard },
            { id: 'disputes', name: 'Disputes', icon: HelpCircle },
            { id: 'settings', name: 'Settings', icon: Settings },
        ],
        property_manager: [
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'deals', name: 'Deal Flow', icon: ArrowUpRight },
            { id: 'affiliates', name: 'My Affiliates', icon: Users },
            { id: 'payouts', name: 'Managed Payouts', icon: CreditCard },
            { id: 'disputes', name: 'Disputes', icon: HelpCircle },
            { id: 'settings', name: 'Settings', icon: Settings },
        ],
    }[simulatedRole];

    return (
        <div className="flex h-screen bg-background overflow-hidden font-sans relative text-foreground">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-40 flex items-center justify-between px-6">
                <h1 className="text-lg font-bold text-gradient">EasyStay</h1>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-xl bg-muted hover:bg-muted/80 transition-colors"
                >
                    {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
            </header>

            {/* Sidebar Backdrop (Mobile) */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
                    onClick={closeSidebar}
                />
            )}

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 w-72 border-r border-border bg-card flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-6 border-b border-border">
                    <h1 className="text-xl font-bold text-gradient">EasyStay Retreats</h1>
                    <p className="text-xs text-secondary mt-1 tracking-wider uppercase opacity-70">
                        {simulatedRole.replace('_', ' ')} Portal
                    </p>
                </div>

                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const isLink = 'href' in item;
                        const isActive = activeSubView === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setActiveSubView(item.id);
                                    closeSidebar();
                                }}
                                className={cn(
                                    "flex items-center gap-3 px-4 py-3 rounded-xl w-full text-left transition-all duration-200 group",
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "hover:bg-muted text-secondary hover:text-foreground"
                                )}
                            >
                                <item.icon className={cn(
                                    "w-5 h-5 transition-opacity",
                                    isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                                )} />
                                <span className="text-sm font-semibold">{item.name}</span>
                            </button>
                        );
                    })}
                </nav>

                <PermissionSelector
                    currentRole={simulatedRole}
                    onRoleChange={(role) => {
                        setSimulatedRole(role);
                        setActiveSubView('overview');
                    }}
                />

                <div className="px-4 py-2 border-t border-border">
                    <ThemeToggle />
                </div>

                <div className="p-4 border-t border-border bg-card/50 backdrop-blur-sm">
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-3 h-auto py-3 px-4 text-secondary hover:text-red-500 hover:bg-red-500/5 transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Log out</span>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 lg:p-8 pt-24 lg:pt-8 bg-background/50 relative w-full">
                {/* Visual indicator for simulation */}
                {simulatedRole !== userRole && (
                    <div className="absolute top-16 lg:top-0 left-0 right-0 bg-blue-600/10 text-blue-600 text-[10px] font-bold py-1 px-4 text-center z-30 flex items-center justify-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        SIMULATED VIEW: {simulatedRole.toUpperCase().replace('_', ' ')}
                    </div>
                )}

                <div className="max-w-6xl mx-auto uppercase tracking-widest text-[10px] font-bold text-secondary/50 mb-4 flex items-center gap-2">
                    <Shield className="w-3 h-3" />
                    <span>{simulatedRole.replace('_', ' ')} environment</span>
                </div>

                <div className="max-w-6xl mx-auto">
                    {/* Admin Specific Views */}
                    {simulatedRole === 'admin' && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {activeSubView === 'overview' && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-900/20 shadow-xl shadow-blue-500/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-xl bg-blue-500/10">
                                                    <Building className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">Total Managers</h3>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <p className="text-3xl font-black text-slate-900 dark:text-white">12</p>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">+2 this month</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-900/20 shadow-xl shadow-emerald-500/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-xl bg-emerald-500/10">
                                                    <Users className="w-5 h-5 text-emerald-600" />
                                                </div>
                                                <Activity className="w-4 h-4 text-emerald-500" />
                                            </div>
                                            <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">Active Affiliates</h3>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <p className="text-3xl font-black text-slate-900 dark:text-white">48</p>
                                                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">84% Engagement</span>
                                            </div>
                                        </CardContent>
                                    </Card>

                                    <Card className="hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-amber-900/20 shadow-xl shadow-amber-500/5">
                                        <CardContent className="p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="p-2 rounded-xl bg-amber-500/10">
                                                    <Briefcase className="w-5 h-5 text-amber-600" />
                                                </div>
                                                <DollarSign className="w-4 h-4 text-amber-500" />
                                            </div>
                                            <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">Total Deals</h3>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <p className="text-3xl font-black text-slate-900 dark:text-white">156</p>
                                                <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">12 Pending</span>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            {activeSubView === 'managers' && (
                                <Card className="overflow-hidden border-none shadow-xl">
                                    <CardHeader className="p-8 border-b border-border bg-muted/30">
                                        <CardTitle className="text-xl font-black">Property Managers</CardTitle>
                                        <CardDescription>Manage and map affiliate partners to specific managers.</CardDescription>
                                    </CardHeader>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-muted/50 text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-border">
                                                <tr>
                                                    <th className="px-8 py-4">Manager Name</th>
                                                    <th className="px-8 py-4">Linked Affiliates</th>
                                                    <th className="px-8 py-4">Status</th>
                                                    <th className="px-8 py-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {mockPropertyManagers.map(pm => (
                                                    <tr key={pm.id} className="hover:bg-muted/30 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-sm text-foreground">{pm.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium tracking-wide mt-1">{pm.email}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {pm.affiliates.map(af => (
                                                                    <span key={af} className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 text-[9px] font-black uppercase tracking-tight border border-blue-500/20">
                                                                        {af}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-[10px] font-bold text-emerald-500 border border-emerald-500/20">
                                                                <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" /> ACTIVE
                                                            </span>
                                                        </td>
                                                        <td className="px-8 py-6 text-right">
                                                            <Button variant="ghost" className="h-8 px-3 text-[10px] font-black uppercase tracking-wider text-primary border border-primary/20 bg-primary/5 hover:bg-primary hover:text-white transition-all">
                                                                Manage Map
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            )}

                            {activeSubView === 'affiliates' && (
                                <Card className="overflow-hidden border-none shadow-xl">
                                    <CardHeader className="p-8 border-b border-border bg-muted/30">
                                        <CardTitle className="text-xl font-black">Affiliate Partner Network</CardTitle>
                                        <CardDescription>Overview of all affiliates and their assigned managers.</CardDescription>
                                    </CardHeader>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left">
                                            <thead className="bg-muted/50 text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-border">
                                                <tr>
                                                    <th className="px-8 py-4">Partner Name</th>
                                                    <th className="px-8 py-4">Assigned Managers</th>
                                                    <th className="px-8 py-4">Total Referrals</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border">
                                                {mockAffiliates.map(af => (
                                                    <tr key={af.id} className="hover:bg-muted/30 transition-colors group">
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-sm text-foreground">{af.name}</p>
                                                            <p className="text-[10px] text-muted-foreground font-medium tracking-wide mt-1">{af.email}</p>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <div className="flex flex-wrap gap-1.5">
                                                                {af.managers.map(pm => (
                                                                    <span key={pm} className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-tight border border-border">
                                                                        {pm}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </td>
                                                        <td className="px-8 py-6">
                                                            <p className="font-black text-lg text-foreground tracking-tighter">24</p>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            )}

                            {activeSubView === 'settings' && (
                                <div className="p-12 rounded-3xl border border-dashed border-border bg-card flex flex-col items-center justify-center text-center">
                                    <Settings className="w-12 h-12 text-slate-300 mb-4" />
                                    <h2 className="text-xl font-bold">Admin Settings</h2>
                                    <p className="text-secondary">System-wide configurations and permissions.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Property Manager Specific Views */}
                    {simulatedRole === 'property_manager' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeSubView === 'overview' && (
                                <div className="space-y-8">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tight">Performance Overview</h2>
                                            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Real-time engagement metrics</p>
                                        </div>
                                        <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-xl border border-border/50">
                                            {['30d', '90d', '6mo', '1yr'].map((range) => (
                                                <button
                                                    key={range}
                                                    onClick={() => setPmTimeRange(range)}
                                                    className={cn(
                                                        "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all",
                                                        pmTimeRange === range
                                                            ? "bg-primary text-white shadow-lg shadow-primary/25"
                                                            : "text-secondary hover:text-foreground hover:bg-muted"
                                                    )}
                                                >
                                                    {range}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="hover:shadow-2xl transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-blue-50/50 dark:from-slate-900 dark:to-blue-900/20 shadow-xl shadow-blue-500/5">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">Total Clicks</h3>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <p className="text-3xl font-black text-foreground">2,842</p>
                                                    <span className="text-[10px] font-bold text-emerald-600">+12%</span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-2xl transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-emerald-50/50 dark:from-slate-900 dark:to-emerald-900/20 shadow-xl shadow-emerald-500/5">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600">
                                                        <UserCheck className="w-5 h-5" />
                                                    </div>
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">New Referrals</h3>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <p className="text-3xl font-black text-foreground">142</p>
                                                    <span className="text-[10px] font-bold text-emerald-600">+8.4%</span>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        <Card className="hover:shadow-2xl transition-all duration-300 border border-border/50 bg-gradient-to-br from-white to-amber-50/50 dark:from-slate-900 dark:to-amber-900/20 shadow-xl shadow-amber-500/5">
                                            <CardContent className="p-6">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600">
                                                        <Activity className="w-5 h-5" />
                                                    </div>
                                                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                                                </div>
                                                <h3 className="text-xs font-bold text-secondary dark:text-secondary-foreground/70 uppercase tracking-widest">Conversion Rate</h3>
                                                <div className="flex items-baseline gap-2 mt-1">
                                                    <p className="text-3xl font-black text-foreground">5.0%</p>
                                                    <span className="text-[10px] font-bold text-emerald-600">+1.2%</span>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>

                                    {/* Simplified Performance Graph */}
                                    <Card className="border-none shadow-xl overflow-hidden">
                                        <CardHeader className="p-6 border-b border-border bg-muted/30">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Referral Volume</CardTitle>
                                                    <CardDescription className="text-[10px]">Daily trends for the selected period</CardDescription>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-bold">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                                        <span className="text-secondary uppercase tracking-widest">Total Leads</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                                        <span className="text-secondary uppercase tracking-widest">Conversions</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="p-8 h-64 flex items-end justify-between gap-2">
                                            {[45, 60, 40, 75, 55, 90, 65, 80, 50, 70, 85, 95].map((val, idx) => (
                                                <div key={idx} className="flex-1 group relative flex flex-col items-center gap-2">
                                                    <div
                                                        className="w-full bg-primary/20 group-hover:bg-primary/40 rounded-t-lg transition-all duration-500 delay-[idx*50ms]"
                                                        style={{ height: `${val}%` }}
                                                    />
                                                    <div
                                                        className="absolute bottom-0 w-full bg-emerald-500 rounded-t-lg transition-all duration-700"
                                                        style={{ height: `${val * 0.6}%` }}
                                                    />
                                                    <div className="opacity-0 group-hover:opacity-100 absolute -top-10 bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded shadow-xl transition-opacity pointer-events-none whitespace-nowrap z-20">
                                                        Day {idx + 1}: {val} Leads
                                                    </div>
                                                </div>
                                            ))}
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                            {activeSubView === 'deals' && (
                                <>
                                    <div className="flex items-center justify-between mb-2">
                                        <h2 className="text-2xl font-black tracking-tight">Deal Flow Tracker</h2>
                                        <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:shadow-lg transition-shadow">
                                            <UserPlus className="w-4 h-4" /> New Prospect
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-6">
                                        {mockDealFlow.map((deal) => {
                                            const steps = ['New Lead', 'Meeting Scheduled', 'Validated', 'Confirmed', 'Payout Processing'];
                                            const currentStepIndex = steps.indexOf(deal.status);

                                            return (
                                                <Card key={deal.id} className="p-0 overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group">
                                                    <div className="p-8">
                                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-10">
                                                            <div className="flex items-start gap-4">
                                                                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                                                    <Home className="w-6 h-6" />
                                                                </div>
                                                                <div>
                                                                    <div className="flex items-center gap-3 mb-1.5">
                                                                        <h3 className="text-xl font-black text-foreground tracking-tight">{deal.property}</h3>
                                                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                                                                            <div className="w-1 h-1 rounded-full bg-emerald-500 mr-1.5" /> Active
                                                                        </span>
                                                                    </div>
                                                                    <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
                                                                        <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                                                            <Users className="w-3.5 h-3.5 opacity-60" />
                                                                            Partner: <span className="text-foreground font-bold">{deal.affiliate}</span>
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground font-semibold flex items-center gap-1.5">
                                                                            <Calendar className="w-3.5 h-3.5 opacity-60" />
                                                                            Referred: <span className="text-foreground font-bold">{deal.date}</span>
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-3 self-end md:self-start">
                                                                <Button
                                                                    variant="outline"
                                                                    className="h-9 px-4 text-[10px] font-bold uppercase tracking-widest border-border bg-transparent hover:bg-muted"
                                                                    onClick={() => {
                                                                        setSelectedDeal(deal);
                                                                        setIsDealModalOpen(true);
                                                                    }}
                                                                >
                                                                    View Details
                                                                </Button>
                                                                <button className="p-2.5 rounded-xl bg-muted text-muted-foreground opacity-0 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary">
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </button>
                                                            </div>
                                                        </div>

                                                        {/* Progress Tracker */}
                                                        <div className="relative pt-2 pb-8 px-2 md:px-10">
                                                            <div className="absolute top-[21px] left-[20px] md:left-[50px] right-[20px] md:right-[50px] h-[3px] bg-muted rounded-full" />
                                                            <div className="absolute top-[21px] left-[20px] md:left-[50px] h-[3px] bg-gradient-to-r from-primary to-emerald-500 rounded-full transition-all duration-1000"
                                                                style={{ width: `${(currentStepIndex / (steps.length - 1)) * 90}%` }} />

                                                            <div className="relative flex justify-between items-center">
                                                                {steps.map((step, idx) => {
                                                                    const isCompleted = idx < currentStepIndex;
                                                                    const isCurrent = idx === currentStepIndex;

                                                                    return (
                                                                        <div key={step} className="flex flex-col items-center gap-4 relative z-10 group/step">
                                                                            <div className={cn(
                                                                                "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 bg-background",
                                                                                isCompleted ? "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50" :
                                                                                    isCurrent ? "border-primary text-primary shadow-xl shadow-primary/20 scale-125 z-20" :
                                                                                        "border-border text-muted-foreground"
                                                                            )}>
                                                                                {isCompleted ? <CheckCircle2 className="w-5 h-5" /> :
                                                                                    isCurrent ? <Activity className="w-5 h-5 animate-pulse" /> :
                                                                                        <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                                                                            </div>
                                                                            <div className="absolute -bottom-2 translate-y-full w-24 text-center">
                                                                                <span className={cn(
                                                                                    "text-[9px] font-black uppercase tracking-tighter transition-all duration-300",
                                                                                    isCurrent ? "text-primary scale-110 opacity-100" :
                                                                                        isCompleted ? "text-emerald-600 opacity-70" : "text-secondary/40 opacity-0 md:opacity-100"
                                                                                )}>
                                                                                    {step}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </>
                            )}

                            {activeSubView === 'affiliates' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-black tracking-tight">Partner Affiliates</h2>
                                        <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{mockAffiliates.length} Partners Linked</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {mockAffiliates.map(af => (
                                            <Card key={af.id} className="p-6 border-none shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all group cursor-default">
                                                <div className="flex items-center gap-5">
                                                    <div className="relative">
                                                        <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-500">
                                                            <UserPlus className="w-7 h-7" />
                                                        </div>
                                                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <h3 className="font-black text-foreground">{af.name}</h3>
                                                        <p className="text-[10px] text-muted-foreground font-medium tracking-tight mt-0.5">{af.email}</p>
                                                        <div className="flex items-center gap-4 mt-3">
                                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-muted-foreground uppercase tracking-tighter">
                                                                <Home className="w-3 h-3 opacity-50" /> 8 Properties
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-500 uppercase tracking-tighter">
                                                                <DollarSign className="w-3 h-3 opacity-50" /> $1,240 Paid
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="relative">
                                                        <button
                                                            onClick={() => setIsAffiliateManageOpen(isAffiliateManageOpen === af.id ? null : af.id)}
                                                            className="p-2 rounded-xl bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary transition-all"
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </button>

                                                        {isAffiliateManageOpen === af.id && (
                                                            <div className="absolute right-0 top-full mt-2 w-48 bg-card border border-border rounded-xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                                                <button
                                                                    onClick={() => {
                                                                        setIsAffiliateManageOpen(null);
                                                                        alert("Link sent to " + af.email);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors"
                                                                >
                                                                    Send Link
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setManagedPartner(af);
                                                                        setIsPermissionModalOpen(true);
                                                                        setIsAffiliateManageOpen(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors"
                                                                >
                                                                    Manage Permissions
                                                                </button>
                                                                <button
                                                                    onClick={() => {
                                                                        setManagedPartner(af);
                                                                        setIsEditPartnerModalOpen(true);
                                                                        setIsAffiliateManageOpen(null);
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider hover:bg-muted transition-colors"
                                                                >
                                                                    Edit Profile
                                                                </button>
                                                                <div className="border-t border-border my-1" />
                                                                <button
                                                                    onClick={() => {
                                                                        if (confirm("Are you sure you want to remove " + af.name + "?")) {
                                                                            setIsAffiliateManageOpen(null);
                                                                        }
                                                                    }}
                                                                    className="w-full px-4 py-2 text-left text-[10px] font-bold uppercase tracking-wider text-red-500 hover:bg-red-500/10 transition-colors"
                                                                >
                                                                    Remove Partner
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSubView === 'payouts' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/10 border-none shadow-xl">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Earned</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">$12,840</p>
                                        </Card>
                                        <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 border-none shadow-xl">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Pending Clear</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">$1,450</p>
                                        </Card>
                                        <Card className="p-6 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-900/10 border-none shadow-xl">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Next Payout</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">Jan 01</p>
                                        </Card>
                                    </div>

                                    <Card className="overflow-hidden border-border bg-card shadow-2xl">
                                        <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-primary" /> Payout History
                                            </h2>
                                            <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary">Export CSV</Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-muted/50 border-b border-border">
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Date</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Property / Deal</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Amount</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Status</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">Receipt</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {[
                                                        { date: 'Dec 24, 2025', property: 'Beachfront Villa', amount: '$450.00', status: 'Paid' },
                                                        { date: 'Dec 20, 2025', property: 'Mountain Retreat', amount: '$320.00', status: 'Pending' },
                                                        { date: 'Dec 15, 2025', property: 'Urban Loft', amount: '$210.00', status: 'Paid' },
                                                    ].map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                                            <td className="px-6 py-4 text-xs font-bold text-foreground">{p.date}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-foreground">{p.property}</td>
                                                            <td className="px-6 py-4 text-xs font-black text-foreground">{p.amount}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                                    }`}>
                                                                    {p.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                                                                    <ArrowUpRight className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {activeSubView === 'disputes' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tighter italic">Resolution Center</h2>
                                            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Resolve and track referral issues</p>
                                        </div>
                                        <Button className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.2em]">New Dispute</Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'DSP-124', type: 'Missing Referral', property: 'Sunset Condo', status: 'Under Review', date: '2 days ago' },
                                            { id: 'DSP-119', type: 'Incorrect Payout', property: 'Lake House', status: 'Resolved', date: '5 days ago' },
                                        ].map((d, idx) => (
                                            <Card key={idx} className="p-6 border-border hover:border-primary/30 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-3 rounded-2xl ${d.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                                        <AlertCircle className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{d.id}</span>
                                                            <div className="w-1 h-1 rounded-full bg-border" />
                                                            <span className="text-[10px] font-black text-primary tracking-widest uppercase">{d.type}</span>
                                                        </div>
                                                        <h3 className="text-lg font-black text-foreground tracking-tight">{d.property}</h3>
                                                        <p className="text-xs text-muted-foreground font-medium mt-1">Reported {d.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 ${d.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'
                                                            }`}>
                                                            {d.status}
                                                        </span>
                                                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-primary group-hover:gap-3 transition-all">
                                                            Manage Resolution <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>

                                    <div className="p-12 rounded-3xl border border-dashed border-border bg-muted/20 flex flex-col items-center justify-center text-center">
                                        <div className="p-4 rounded-full bg-primary/5 text-primary/40 mb-4">
                                            <MessageSquare className="w-8 h-8" />
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-widest mb-1">Need Direct Support?</h3>
                                        <p className="text-xs text-secondary font-medium max-w-xs mx-auto mb-6">Our partner success team is available 24/7 for complex resolution requirements.</p>
                                        <Button variant="outline" className="h-9 px-6 text-[10px] font-black uppercase tracking-widest border-border">Contact Support</Button>
                                    </div>
                                </div>
                            )}

                            {activeSubView === 'settings' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex flex-col gap-1">
                                        <h2 className="text-2xl font-black tracking-tighter">Manager Settings</h2>
                                        <p className="text-xs text-secondary font-bold uppercase tracking-widest">Configure your business and link preferences</p>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                        <Card className="p-8 border-none shadow-xl">
                                            <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                                <Building className="w-4 h-4 text-primary" /> Business Profile
                                            </h3>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 gap-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Business Name</label>
                                                    <input type="text" defaultValue="West Coast Living" className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Support Email</label>
                                                    <input type="email" defaultValue="pm@westcoast.com" className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                                </div>
                                                <div className="grid grid-cols-1 gap-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Contact Phone</label>
                                                    <input type="text" defaultValue="+1 (555) 123-4567" className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                                                </div>
                                                <Button className="w-full mt-4 h-12 font-black uppercase tracking-[0.15em]">Save Profile</Button>
                                            </div>
                                        </Card>

                                        <div className="space-y-8">
                                            <Card className="p-8 border-none shadow-xl bg-gradient-to-br from-white to-blue-50/20 dark:from-card dark:to-blue-900/10">
                                                <h3 className="text-sm font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <CreditCard className="w-4 h-4 text-primary" /> Payout Integration
                                                </h3>
                                                <p className="text-[10px] text-secondary font-bold uppercase tracking-widest mb-6">Connect your merchant account for affiliate payouts</p>
                                                <button className="w-full flex items-center justify-center gap-3 bg-[#635BFF] text-white rounded-xl py-4 font-black uppercase tracking-widest text-[11px] hover:shadow-xl hover:scale-[1.02] transition-all">
                                                    <CreditCard className="w-5 h-5" /> Connect with Stripe
                                                </button>
                                                <p className="text-[9px] text-center text-secondary/60 mt-4 italic">Next automatic payout: Jan 1st, 2026</p>
                                            </Card>

                                            <Card className="p-8 border-none shadow-xl">
                                                <h3 className="text-sm font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                                                    <LinkIcon className="w-4 h-4 text-primary" /> Multi-Link Config
                                                </h3>
                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Default Link Path</span>
                                                            <span className="text-[9px] text-secondary font-black opacity-60">/referral/join</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase">Edit</Button>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                                                        <div className="flex flex-col">
                                                            <span className="text-[10px] font-black uppercase tracking-widest">Custom Branding</span>
                                                            <span className="text-[9px] text-secondary font-black opacity-60">Enabled</span>
                                                        </div>
                                                        <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase">Config</Button>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Affiliate Specific Views */}
                    {simulatedRole === 'affiliate' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                            {activeSubView === 'overview' && children}

                            {activeSubView === 'referrals' && (
                                <div className="p-12 rounded-3xl border border-dashed border-border bg-card flex flex-col items-center justify-center text-center">
                                    <Users className="w-12 h-12 text-slate-300 mb-4" />
                                    <h2 className="text-xl font-bold">My Referrals</h2>
                                    <p className="text-secondary">Tracking for all your property referrals will appear here.</p>
                                </div>
                            )}

                            {activeSubView === 'payouts' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <Card className="p-6 bg-gradient-to-br from-white to-emerald-50/30 dark:from-slate-900 dark:to-emerald-900/10 border-none shadow-xl shadow-emerald-500/5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                                                    <DollarSign className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Earned</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">$4,250</p>
                                        </Card>
                                        <Card className="p-6 bg-gradient-to-br from-white to-blue-50/30 dark:from-slate-900 dark:to-blue-900/10 border-none shadow-xl shadow-blue-500/5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
                                                    <Clock className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Pending Clear</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">$850</p>
                                        </Card>
                                        <Card className="p-6 bg-gradient-to-br from-white to-purple-50/30 dark:from-slate-900 dark:to-purple-900/10 border-none shadow-xl shadow-purple-500/5">
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
                                                    <CreditCard className="w-5 h-5" />
                                                </div>
                                            </div>
                                            <p className="text-xs font-bold text-secondary uppercase tracking-widest">Next Payout</p>
                                            <p className="text-3xl font-black text-foreground tracking-tighter mt-1">Jan 01</p>
                                        </Card>
                                    </div>

                                    <Card className="overflow-hidden border-border bg-card shadow-2xl">
                                        <div className="p-6 border-b border-border bg-muted/30 flex justify-between items-center">
                                            <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                                <CreditCard className="w-4 h-4 text-primary" /> Payment History
                                            </h2>
                                            <Button variant="ghost" className="h-8 text-[10px] font-bold uppercase tracking-widest text-primary">Download Statements</Button>
                                        </div>
                                        <div className="overflow-x-auto">
                                            <table className="w-full text-left">
                                                <thead>
                                                    <tr className="bg-muted/50 border-b border-border">
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Date</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Ref ID</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Amount</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary">Status</th>
                                                        <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-secondary text-right">View</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-border">
                                                    {[
                                                        { date: 'Dec 24, 2025', id: 'REF-801', amount: '$450.00', status: 'Paid' },
                                                        { date: 'Dec 20, 2025', id: 'REF-792', amount: '$320.00', status: 'Processing' },
                                                        { date: 'Dec 15, 2025', id: 'REF-788', amount: '$210.00', status: 'Paid' },
                                                    ].map((p, idx) => (
                                                        <tr key={idx} className="hover:bg-muted/30 transition-colors">
                                                            <td className="px-6 py-4 text-xs font-bold text-foreground">{p.date}</td>
                                                            <td className="px-6 py-4 text-xs font-bold text-foreground font-mono">{p.id}</td>
                                                            <td className="px-6 py-4 text-xs font-black text-foreground">{p.amount}</td>
                                                            <td className="px-6 py-4">
                                                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${p.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-500'
                                                                    }`}>
                                                                    {p.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 rounded-lg hover:bg-primary/10 hover:text-primary transition-all">
                                                                    <ArrowUpRight className="w-4 h-4" />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {activeSubView === 'disputes' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h2 className="text-2xl font-black tracking-tighter italic">Resolution Center</h2>
                                            <p className="text-xs text-secondary font-bold uppercase tracking-widest mt-1">Track and resolve referral disputes</p>
                                        </div>
                                        <Button className="h-10 px-6 text-[10px] font-black uppercase tracking-[0.2em]">Open New Dispute</Button>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        {[
                                            { id: 'DSP-992', type: 'Uncredited Referral', property: 'Ocean Front Villa', status: 'Pending', date: '1 day ago' },
                                            { id: 'DSP-988', type: 'Payout Mismatch', property: 'Urban Hideaway', status: 'Resolved', date: '4 days ago' },
                                        ].map((d, idx) => (
                                            <Card key={idx} className="p-6 border-border hover:border-primary/30 transition-all cursor-pointer group">
                                                <div className="flex items-center gap-6">
                                                    <div className={`p-3 rounded-2xl ${d.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-orange-500/10 text-orange-500'}`}>
                                                        <AlertCircle className="w-6 h-6" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <span className="text-[10px] font-black text-secondary tracking-widest uppercase">{d.id}</span>
                                                            <div className="w-1 h-1 rounded-full bg-border" />
                                                            <span className="text-[10px] font-black text-primary tracking-widest uppercase">{d.type}</span>
                                                        </div>
                                                        <h3 className="text-lg font-black text-foreground tracking-tight">{d.property}</h3>
                                                        <p className="text-xs text-muted-foreground font-medium mt-1">Status: <span className="text-foreground">{d.status}</span> • Updated {d.date}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center justify-end gap-2 text-[10px] font-bold text-primary group-hover:gap-3 transition-all">
                                                            View Case Details <ArrowRight className="w-4 h-4" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeSubView === 'settings' && (
                                <div className="p-12 rounded-3xl border border-dashed border-border bg-card flex flex-col items-center justify-center text-center">
                                    <Settings className="w-12 h-12 text-slate-300 mb-4" />
                                    <h2 className="text-xl font-bold">Account Settings</h2>
                                    <p className="text-secondary">Update your profile, notification settings, and payment methods.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Deal Details Modal */}
                {isDealModalOpen && selectedDeal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsDealModalOpen(false)} />
                        <Card className="relative w-full max-w-2xl bg-card border border-border shadow-3xl animate-in zoom-in-95 duration-300">
                            <CardHeader className="p-8 border-b border-border bg-muted/30 relative">
                                <button
                                    onClick={() => setIsDealModalOpen(false)}
                                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-muted text-secondary transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                                        <Home className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-2xl font-black italic tracking-tighter">{selectedDeal.property}</CardTitle>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{selectedDeal.status}</span>
                                            <div className="w-1 h-1 rounded-full bg-secondary/30" />
                                            <span className="text-[10px] font-bold text-secondary uppercase tracking-[0.2em]">{selectedDeal.date}</span>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="p-8 space-y-8">
                                <div className="grid grid-cols-2 gap-8">
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Deal Worth</label>
                                        <p className="text-3xl font-black text-foreground tracking-tighter">$4,500 <span className="text-xs font-bold text-emerald-500">+$250 Bonus</span></p>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-2">Location</label>
                                        <p className="text-sm font-bold text-foreground">Santa Monica, CA</p>
                                        <button className="text-[10px] font-bold text-primary hover:underline mt-1">View on G-Maps</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-3">Associated Partner</label>
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/50 border border-border">
                                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                            <UserCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-foreground">{selectedDeal.affiliate}</p>
                                            <p className="text-[10px] text-muted-foreground font-medium">Lifetime Deals: 14</p>
                                        </div>
                                        <Button variant="ghost" className="ml-auto text-[10px] font-bold uppercase tracking-wider text-primary">Chat</Button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-secondary block mb-3">Internal Project Notes</label>
                                    <div className="p-5 rounded-2xl bg-muted/30 border border-border/50 text-xs font-medium text-foreground leading-relaxed italic opacity-80">
                                        "Property audit complete. Owner is waiting for the refined contract before final launch. Expected confirmed date: Jan 15th."
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 pt-4 border-t border-border">
                                    <Button className="flex-1 py-6 h-auto text-[10px] font-black uppercase tracking-[0.2em]">Launch Listing</Button>
                                    <Button variant="outline" className="flex-1 py-6 h-auto text-[10px] font-black uppercase tracking-[0.2em] border-border">Manage Payout</Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
            {/* Affiliate Permissions Modal */}
            {isPermissionModalOpen && managedPartner && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPermissionModalOpen(false)} />
                    <Card className="w-full max-w-lg relative z-10 p-0 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <CardHeader className="bg-muted/30 p-8 border-b border-border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Manage Access</p>
                                    <CardTitle className="text-2xl font-black">Partner Permissions</CardTitle>
                                    <CardDescription className="text-xs font-bold">{managedPartner.name} • {managedPartner.email}</CardDescription>
                                </div>
                                <button onClick={() => setIsPermissionModalOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {[
                                { id: 'view_analytics', label: 'View Real-time Analytics', desc: 'Allows partner to see detailed traffic and funnel data' },
                                { id: 'edit_links', label: 'Create Custom Links', desc: 'Allows partner to create and manage their own referral paths' },
                                { id: 'payout_mgmt', label: 'Self-Manage Payouts', desc: 'Allows partner to request early payouts and manage bank info' },
                                { id: 'support_chat', label: 'Priority Support Chat', desc: 'Enables direct communication channel with management' }
                            ].map((perm) => (
                                <div key={perm.id} className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50 group hover:border-primary/30 transition-all">
                                    <div className="relative flex items-center justify-center h-6 w-11 rounded-full bg-slate-200 dark:bg-slate-800 cursor-pointer transition-colors duration-300 peer-checked:bg-primary">
                                        <input type="checkbox" className="sr-only peer" defaultChecked={perm.id === 'view_analytics'} />
                                        <div className="absolute left-1 h-4 w-4 rounded-full bg-white shadow-sm transition-all duration-300 peer-checked:translate-x-5" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black uppercase tracking-tight mb-1">{perm.label}</p>
                                        <p className="text-[10px] text-secondary font-medium leading-relaxed">{perm.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                        <div className="p-8 border-t border-border bg-muted/10 flex gap-3">
                            <Button className="w-full font-black uppercase tracking-widest h-12" onClick={() => setIsPermissionModalOpen(false)}>Update Permissions</Button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Edit Partner Profile Modal */}
            {isEditPartnerModalOpen && managedPartner && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditPartnerModalOpen(false)} />
                    <Card className="w-full max-w-lg relative z-10 p-0 overflow-hidden animate-in fade-in zoom-in duration-300">
                        <CardHeader className="bg-muted/30 p-8 border-b border-border">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Partner Profile</p>
                                    <CardTitle className="text-2xl font-black">Edit Partner</CardTitle>
                                </div>
                                <button onClick={() => setIsEditPartnerModalOpen(false)} className="p-2 rounded-xl hover:bg-muted transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 space-y-4">
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Full Name</label>
                                <input type="text" defaultValue={managedPartner.name} className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Email Address</label>
                                <input type="email" defaultValue={managedPartner.email} className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Assigned Commission (%)</label>
                                <input type="number" defaultValue="15" className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" />
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-secondary">Notes</label>
                                <textarea className="bg-muted/50 border border-border/50 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all h-24 resize-none" placeholder="Add internal partner notes..." />
                            </div>
                        </CardContent>
                        <div className="p-8 border-t border-border bg-muted/10 flex gap-3">
                            <Button className="w-full font-black uppercase tracking-widest h-12" onClick={() => setIsEditPartnerModalOpen(false)}>Save Changes</Button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
