'use client';

import { DashboardShell } from '@/components/ui/DashboardShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Plus, ExternalLink, Link as LinkIcon } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

type AffiliateLink = {
    id: string;
    name: string;
    slug: string;
    clicks?: number;
    referrals_count?: number;
    created_at?: string;
    headline?: string | null;
};

export default function LinksPage() {
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkSlug, setNewLinkSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    async function fetchLinks() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('affiliate_links')
            .select('*')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false });

        setLinks(data || []);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchLinks();
    }, []);

    async function handleCreateLink(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { error } = await supabase.from('affiliate_links').insert([
            {
                affiliate_id: user.id,
                name: newLinkName,
                slug: newLinkSlug || Math.random().toString(36).substring(7),
                headline: 'Maximize Your Airbnb Potential',
                subheadline: 'Fill out this short form and we\'ll show you how EasyStay can increase your revenue.',
            },
        ]);

        if (!error) {
            setNewLinkName('');
            setNewLinkSlug('');
            fetchLinks();
        } else {
            alert(error.message);
        }
        setLoading(false);
    }

    const copyToClipboard = (slug: string) => {
        const url = `${window.location.origin}/refer/${slug}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    return (
        <DashboardShell>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Manage Links</h2>
                        <p className="text-secondary mt-1">Create and track custom affiliate links for different channels.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Create New Link</CardTitle>
                        <CardDescription>Enter a name and optional slug for your tracking link.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateLink} className="flex flex-col md:flex-row gap-4">
                            <input
                                type="text"
                                required
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Link Name (e.g. Winter Campaign)"
                                value={newLinkName}
                                onChange={(e) => setNewLinkName(e.target.value)}
                            />
                            <input
                                type="text"
                                className="flex-1 px-4 py-2 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all"
                                placeholder="Custom Slug (optional)"
                                value={newLinkSlug}
                                onChange={(e) => setNewLinkSlug(e.target.value)}
                            />
                            <Button type="submit" disabled={loading}>
                                <Plus className="w-4 h-4 mr-2" />
                                {loading ? 'Creating...' : 'Create Link'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="grid gap-6">
                    {links.length > 0 ? (
                        links.map((link) => (
                            <Card key={link.id} className="group">
                                <CardContent className="p-6">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <h4 className="font-semibold text-lg">{link.name}</h4>
                                            <p className="text-sm text-secondary font-mono">/refer/{link.slug}</p>
                                        </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/affiliate/links/${link.id}/builder`)}
                        >
                            Landing Builder
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.slug)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                        <Button variant="outline" size="sm" href={`/refer/${link.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                    </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-8 mt-6 pt-6 border-t border-border">
                                        <div>
                                            <p className="text-xs text-secondary font-medium uppercase tracking-wider">Clicks</p>
                                            <p className="text-xl font-bold mt-1">{link.clicks || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary font-medium uppercase tracking-wider">Referrals</p>
                                            <p className="text-xl font-bold mt-1">{link.referrals_count || 0}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-secondary font-medium uppercase tracking-wider">Created</p>
                                            <p className="text-base font-medium mt-1">{new Date(link.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                    {link.headline && (
                                        <div className="mt-4 p-3 bg-muted/30 rounded-lg border border-border/50">
                                            <p className="text-[10px] uppercase font-bold text-secondary mb-1">Custom Headline</p>
                                    <p className="text-xs italic">&ldquo;{link.headline}&rdquo;</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-border">
                            <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                                <LinkIcon className="w-8 h-8 text-secondary" />
                            </div>
                            <p className="text-lg font-medium">No links created yet</p>
                            <p className="text-secondary mb-6 italic">Create your first link above to start tracking referrals</p>
                        </div>
                    )}
                </div>

            </div>
        </DashboardShell>
    );
}
