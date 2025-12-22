'use client';

import { DashboardShell } from '@/components/ui/DashboardShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Users, FileText, CheckCircle, Clock, MoreVertical } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
    const [referrals, setReferrals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllData() {
            const { data } = await supabase
                .from('referrals')
                .select(`
          *,
          affiliate_link:affiliate_links(
            name,
            affiliate:affiliates(display_name)
          )
        `)
                .order('created_at', { ascending: false });

            setReferrals(data || []);
            setLoading(false);
        }
        fetchAllData();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'pipeline': return 'bg-amber-100 text-amber-700';
            case 'signed': return 'bg-purple-100 text-purple-700';
            case 'completed': return 'bg-green-100 text-green-700';
            case 'paid': return 'bg-emerald-100 text-emerald-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <DashboardShell userRole="admin">
            <div className="space-y-8">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Admin Overview</h2>
                    <p className="text-secondary mt-1">Manage all referrals, affiliates, and pipeline progress.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <FileText className="w-8 h-8 mx-auto text-blue-500 mb-2" />
                            <p className="text-sm font-medium text-secondary">Total Leads</p>
                            <p className="text-2xl font-bold mt-1">{referrals.length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Clock className="w-8 h-8 mx-auto text-amber-500 mb-2" />
                            <p className="text-sm font-medium text-secondary">In Pipeline</p>
                            <p className="text-2xl font-bold mt-1">{referrals.filter(r => r.status === 'pipeline').length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <CheckCircle className="w-8 h-8 mx-auto text-green-500 mb-2" />
                            <p className="text-sm font-medium text-secondary">Signed Deals</p>
                            <p className="text-2xl font-bold mt-1">{referrals.filter(r => r.status === 'signed' || r.status === 'completed').length}</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6 text-center">
                            <Users className="w-8 h-8 mx-auto text-purple-500 mb-2" />
                            <p className="text-sm font-medium text-secondary">Active Affiliates</p>
                            <p className="text-2xl font-bold mt-1">12</p> {/* Mock count */}
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Master Lead List</CardTitle>
                        <CardDescription>All property owner referrals across all affiliate links.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-secondary uppercase bg-muted/50">
                                    <tr>
                                        <th className="px-6 py-4 rounded-tl-xl font-semibold">Owner</th>
                                        <th className="px-6 py-4 font-semibold">Location</th>
                                        <th className="px-6 py-4 font-semibold">Affiliate</th>
                                        <th className="px-6 py-4 font-semibold">Status</th>
                                        <th className="px-6 py-4 rounded-tr-xl font-semibold text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {referrals.map((referral) => (
                                        <tr key={referral.id} className="hover:bg-muted/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-medium text-foreground">{referral.owner_name}</div>
                                                <div className="text-xs text-secondary">{referral.owner_email}</div>
                                            </td>
                                            <td className="px-6 py-4 text-secondary font-medium">{referral.property_location}</td>
                                            <td className="px-6 py-4 text-foreground font-medium">
                                                {referral.affiliate_link?.affiliate?.display_name || 'Direct / Deleted'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(referral.status)}`}>
                                                    {referral.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                    {referrals.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-12 text-center text-secondary italic">
                                                No referrals found.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
