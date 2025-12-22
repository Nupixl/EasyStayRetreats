'use client';

import { DashboardShell } from '@/components/ui/DashboardShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MousePointer2, Users, DollarSign, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AffiliateDashboard() {
    const [stats, setStats] = useState({
        clicks: 0,
        referrals: 0,
        earnings: 0,
        conversion: 0
    });

    useEffect(() => {
        async function fetchStats() {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: links } = await supabase
                .from('affiliate_links')
                .select('clicks, referrals_count')
                .eq('affiliate_id', user.id);

            const { data: affiliate } = await supabase
                .from('affiliates')
                .select('total_earnings')
                .eq('id', user.id)
                .single();

            if (links) {
                const totalClicks = links.reduce((acc, link) => acc + (link.clicks || 0), 0);
                const totalReferrals = links.reduce((acc, link) => acc + (link.referrals_count || 0), 0);
                setStats({
                    clicks: totalClicks,
                    referrals: totalReferrals,
                    earnings: affiliate?.total_earnings || 0,
                    conversion: totalClicks > 0 ? (totalReferrals / totalClicks) * 100 : 0
                });
            }
        }
        fetchStats();
    }, []);

    const statCards = [
        { label: 'Total Clicks', value: stats.clicks, icon: MousePointer2, color: 'text-blue-500' },
        { label: 'Total Referrals', value: stats.referrals, icon: Users, color: 'text-green-500' },
        { label: 'Total Earnings', value: `$${stats.earnings}`, icon: DollarSign, color: 'text-amber-500' },
        { label: 'Conversion Rate', value: `${stats.conversion.toFixed(1)}%`, icon: TrendingUp, color: 'text-purple-500' },
    ];

    return (
        <DashboardShell>
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Performance Overview</h2>
                    <p className="text-secondary mt-1">Track your affiliate performance and earnings in real-time.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {statCards.map((stat) => (
                        <Card key={stat.label} className="hover:scale-[1.02] transition-transform cursor-default">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                </div>
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-secondary">{stat.label}</p>
                                    <p className="text-2xl font-bold mt-1">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Referrals</CardTitle>
                            <CardDescription>The last property owners you referred.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {/* Future: Map through recent referrals */}
                                <p className="text-sm text-secondary text-center py-8 bg-muted/30 rounded-xl border border-dashed border-border">
                                    No referrals yet. Share your links to get started!
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="premium-gradient text-white border-0">
                        <CardHeader>
                            <CardTitle>Create New Link</CardTitle>
                            <CardDescription className="text-white/80">Generate a custom link for your latest campaign.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm">Customize slugs and names to track where your leads are coming from.</p>
                            <Button variant="glass" className="w-full" href="/affiliate/links">
                                Manage Links
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardShell>
    );
}
