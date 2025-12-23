'use client';

import { DashboardShell } from '@/components/ui/DashboardShell';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Copy, Plus, ExternalLink, Link as LinkIcon, Edit2, Check, X, BarChart3, Eye, EyeOff, Trash2, GripVertical } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type AffiliateLink = {
    id: string;
    name: string;
    slug: string;
    clicks?: number;
    referrals_count?: number;
    created_at?: string;
    headline?: string | null;
    landing_page?: {
        is_published: boolean;
        status: 'draft' | 'paused' | 'published';
        id: string;
    } | null;
};

function SortableLinkCard({
    link,
    editingId,
    editName,
    expandedAnalytics,
    onStartEditing,
    onCancelEditing,
    onSaveEdit,
    onSetEditName,
    onToggleAnalytics,
    onTogglePublishStatus,
    onCopyToClipboard,
    onDeleteLink,
    onNavigateToBuilder,
}: {
    link: AffiliateLink;
    editingId: string | null;
    editName: string;
    expandedAnalytics: string | null;
    onStartEditing: (link: AffiliateLink) => void;
    onCancelEditing: () => void;
    onSaveEdit: (linkId: string) => void;
    onSetEditName: (name: string) => void;
    onToggleAnalytics: (linkId: string) => void;
    onTogglePublishStatus: (link: AffiliateLink, newStatus: 'draft' | 'paused' | 'published') => void;
    onCopyToClipboard: (slug: string) => void;
    onDeleteLink: (link: AffiliateLink) => void;
    onNavigateToBuilder: (linkId: string) => void;
}) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: link.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <Card key={link.id} className="group" ref={setNodeRef} style={style}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    {/* Drag Handle */}
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className="mt-1 cursor-grab text-secondary hover:text-primary transition-colors active:cursor-grabbing"
                        title="Drag to reorder"
                    >
                        <GripVertical className="w-5 h-5" />
                    </button>

                    <div className="space-y-1 flex-1">
                        {editingId === link.id ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => onSetEditName(e.target.value)}
                                    className="flex-1 px-3 py-1 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') onSaveEdit(link.id);
                                        if (e.key === 'Escape') onCancelEditing();
                                    }}
                                />
                                <button
                                    onClick={() => onSaveEdit(link.id)}
                                    className="p-1.5 hover:bg-green-500/10 rounded-lg text-green-600 transition-colors"
                                    title="Save"
                                >
                                    <Check className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={onCancelEditing}
                                    className="p-1.5 hover:bg-red-500/10 rounded-lg text-red-600 transition-colors"
                                    title="Cancel"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-3 group/name">
                                <h4 className="font-semibold text-lg">{link.name}</h4>
                                <select
                                    value={link.landing_page?.status || 'draft'}
                                    onChange={(e) => {
                                        const newStatus = e.target.value as 'draft' | 'paused' | 'published';
                                        if (newStatus !== link.landing_page?.status) {
                                            onTogglePublishStatus(link, newStatus);
                                        }
                                    }}
                                    disabled={!link.landing_page}
                                    className={`min-w-[130px] px-3 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed ${
                                        link.landing_page?.status === 'published'
                                            ? 'bg-green-500/10 text-green-600 border-green-500/20 hover:bg-green-500/20' 
                                            : link.landing_page?.status === 'paused'
                                            ? 'bg-orange-500/10 text-orange-600 border-orange-500/20 hover:bg-orange-500/20'
                                            : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20 hover:bg-yellow-500/20'
                                    }`}
                                    title={!link.landing_page ? 'Create a landing page first' : 'Change publish status'}
                                >
                                    <option value="draft">📝 Draft</option>
                                    <option value="paused">⏸️ Paused</option>
                                    <option value="published">✓ Published</option>
                                </select>
                                <button
                                    onClick={() => onStartEditing(link)}
                                    className="opacity-0 group-hover/name:opacity-100 p-1 hover:bg-muted rounded transition-all"
                                    title="Edit name"
                                >
                                    <Edit2 className="w-3.5 h-3.5 text-secondary" />
                                </button>
                            </div>
                        )}
                        <a 
                            href={`/refer/${link.slug}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:text-primary/80 font-mono hover:underline flex items-center gap-1 transition-colors"
                            title="Click to open landing page in new tab"
                        >
                            /refer/{link.slug}
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onNavigateToBuilder(link.id)}
                        >
                            Landing Builder
                        </Button>
                        {link.landing_page && (
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    const currentStatus = link.landing_page?.status || 'draft';
                                    const nextStatus = 
                                        currentStatus === 'draft' ? 'paused' : 
                                        currentStatus === 'paused' ? 'published' : 
                                        'draft';
                                    onTogglePublishStatus(link, nextStatus);
                                }}
                                title={`Status: ${link.landing_page.status || 'draft'} (click to cycle)`}
                                className={
                                    link.landing_page.status === 'published' 
                                        ? 'text-green-600 border-green-500/20' 
                                        : link.landing_page.status === 'paused'
                                        ? 'text-orange-600 border-orange-500/20'
                                        : 'text-yellow-600 border-yellow-500/20'
                                }
                            >
                                {link.landing_page.status === 'published' ? (
                                    <Eye className="w-4 h-4" />
                                ) : link.landing_page.status === 'paused' ? (
                                    <span className="text-sm">⏸️</span>
                                ) : (
                                    <EyeOff className="w-4 h-4" />
                                )}
                            </Button>
                        )}
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onToggleAnalytics(link.id)}
                            title="View Analytics"
                        >
                            <BarChart3 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => onCopyToClipboard(link.slug)}>
                            <Copy className="w-4 h-4 mr-2" />
                            Copy
                        </Button>
                        <Button variant="outline" size="sm" href={`/refer/${link.slug}`} target="_blank">
                            <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => onDeleteLink(link)}
                            title="Delete link"
                            className="text-red-600 border-red-500/20 hover:bg-red-500/10"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-border">
                    <div className="grid grid-cols-3 gap-8">
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
                            <p className="text-base font-medium mt-1">{link.created_at ? new Date(link.created_at).toLocaleDateString() : 'N/A'}</p>
                        </div>
                    </div>

                    {/* Expanded Analytics */}
                    {expandedAnalytics === link.id && (
                        <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border space-y-4">
                            <h5 className="text-sm font-semibold uppercase tracking-wider text-secondary">Performance Metrics</h5>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-background rounded-lg">
                                    <p className="text-xs text-secondary mb-1">Conversion Rate</p>
                                    <p className="text-lg font-bold">
                                        {link.clicks && link.clicks > 0 
                                            ? ((((link.referrals_count || 0) / link.clicks) * 100).toFixed(1) + '%')
                                            : '0%'}
                                    </p>
                                </div>
                                <div className="p-3 bg-background rounded-lg">
                                    <p className="text-xs text-secondary mb-1">Avg. Daily Clicks</p>
                                    <p className="text-lg font-bold">
                                        {link.created_at 
                                            ? (link.clicks || 0) / Math.max(1, Math.floor((Date.now() - new Date(link.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                                            : 0}
                                    </p>
                                </div>
                                <div className="p-3 bg-background rounded-lg">
                                    <p className="text-xs text-secondary mb-1">Days Active</p>
                                    <p className="text-lg font-bold">
                                        {link.created_at 
                                            ? Math.floor((Date.now() - new Date(link.created_at).getTime()) / (1000 * 60 * 60 * 24))
                                            : 0}
                                    </p>
                                </div>
                                    <div className="p-3 bg-background rounded-lg">
                                        <p className="text-xs text-secondary mb-1">Publish Status</p>
                                        {link.landing_page ? (
                                            <select
                                                value={link.landing_page.status || 'draft'}
                                                onChange={(e) => {
                                                    const newStatus = e.target.value as 'draft' | 'paused' | 'published';
                                                    if (newStatus !== link.landing_page?.status) {
                                                        onTogglePublishStatus(link, newStatus);
                                                    }
                                                }}
                                                className={`w-full px-3 py-2 text-sm font-semibold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${
                                                    link.landing_page.status === 'published'
                                                        ? 'bg-green-500/10 text-green-600 border-green-500/20' 
                                                        : link.landing_page.status === 'paused'
                                                        ? 'bg-orange-500/10 text-orange-600 border-orange-500/20'
                                                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20'
                                                }`}
                                            >
                                                <option value="draft">📝 Draft</option>
                                                <option value="paused">⏸️ Paused</option>
                                                <option value="published">✓ Published</option>
                                            </select>
                                        ) : (
                                            <p className="text-sm font-semibold text-gray-400">
                                                No Landing Page
                                            </p>
                                        )}
                                    </div>
                            </div>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

export default function LinksPage() {
    const [links, setLinks] = useState<AffiliateLink[]>([]);
    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkSlug, setNewLinkSlug] = useState('');
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [expandedAnalytics, setExpandedAnalytics] = useState<string | null>(null);
    const [showDebug, setShowDebug] = useState(false);
    const [activeId, setActiveId] = useState<string | null>(null);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const router = useRouter();

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    async function fetchLinks() {
        try {
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            if (userError) {
                console.error('Error getting user:', userError);
                return;
            }
            
            if (!user) {
                console.log('No user found');
                return;
            }

            console.log('Fetching links for user:', user.id);

            // First try with the join
            let { data, error } = await supabase
                .from('affiliate_links')
                .select(`
                    *,
                    landing_pages(id, is_published, status)
                `)
                .eq('affiliate_id', user.id)
                .order('created_at', { ascending: false });

            // If join fails, try without it
            if (error) {
                console.warn('Join query failed, trying without landing_pages:', error);
                
                const simpleQuery = await supabase
            .from('affiliate_links')
            .select('*')
            .eq('affiliate_id', user.id)
            .order('created_at', { ascending: false });

                if (simpleQuery.error) {
                    console.error('Error fetching links:', {
                        message: simpleQuery.error.message,
                        details: simpleQuery.error.details,
                        hint: simpleQuery.error.hint,
                        code: simpleQuery.error.code
                    });
                    alert(`Failed to load links: ${simpleQuery.error.message}`);
                    return;
                }
                
                data = simpleQuery.data;
                error = null;
                console.log('Simple query succeeded, fetching landing pages separately...');
                
                // Fetch landing pages separately if simple query worked
                if (data && data.length > 0) {
                    const linkIds = data.map(link => link.id);
                    const { data: landingPages } = await supabase
                        .from('landing_pages')
                        .select('id, is_published, status, affiliate_link_id')
                        .in('affiliate_link_id', linkIds);
                    
                    // Attach landing pages to links
                    data = data.map((link: any) => ({
                        ...link,
                        landing_pages: landingPages?.filter(lp => lp.affiliate_link_id === link.id) || []
                    }));
                }
            }

            console.log('Raw data from Supabase:', data);

            // Transform the data to flatten landing_pages array to single object
            const transformedData = (data || []).map((link: any) => {
                const landingPage = link.landing_pages && link.landing_pages.length > 0 
                    ? link.landing_pages[0] 
                    : null;
                
                // If status doesn't exist, default to draft
                if (landingPage && !landingPage.status) {
                    console.warn(`Landing page ${landingPage.id} has no status field - defaulting to 'draft'. You may need to run the migration.`);
                    landingPage.status = 'draft';
                }
                
                return {
                    ...link,
                    landing_page: landingPage
                };
            });

            console.log('Transformed data:', transformedData);
            
            // Check if any landing pages exist and log status field availability
            const hasLandingPages = transformedData.some(l => l.landing_page);
            if (hasLandingPages) {
                const sampleLandingPage = transformedData.find(l => l.landing_page)?.landing_page;
                console.log('Sample landing page fields:', Object.keys(sampleLandingPage || {}));
            }
            
            setLinks(transformedData);
        } catch (error) {
            console.error('Unexpected error fetching links:', error);
        }
    }

    useEffect(() => {
        console.log('Component mounted, fetching links...');
        fetchLinks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Refetch links when page becomes visible (e.g., navigating back from builder)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                console.log('Page visible, refetching links...');
                fetchLinks();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 3000);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    async function handleCreateLink(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        
        try {
        const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert('You must be logged in to create a link.');
                setLoading(false);
                return;
            }

            const slug = newLinkSlug.trim() || Math.random().toString(36).substring(7);
            
            console.log('Creating link with:', { name: newLinkName, slug, user: user.id });

            const { data, error } = await supabase
                .from('affiliate_links')
                .insert([
            {
                affiliate_id: user.id,
                        name: newLinkName.trim(),
                        slug: slug,
                headline: 'Maximize Your Airbnb Potential',
                subheadline: 'Fill out this short form and we\'ll show you how EasyStay can increase your revenue.',
            },
                ])
                .select();

            if (error) {
                console.error('Error creating link:', error);
                alert(`Failed to create link: ${error.message}`);
                setLoading(false);
                return;
            }

            console.log('Link created successfully:', data);
            setNewLinkName('');
            setNewLinkSlug('');
            
            // Refresh the links list
            await fetchLinks();
            alert('Link created successfully!');
        } catch (error) {
            console.error('Unexpected error creating link:', error);
            alert('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    const copyToClipboard = (slug: string) => {
        const url = `${window.location.origin}/refer/${slug}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
    };

    const startEditing = (link: AffiliateLink) => {
        setEditingId(link.id);
        setEditName(link.name);
    };

    const cancelEditing = () => {
        setEditingId(null);
        setEditName('');
    };

    const saveEdit = async (linkId: string) => {
        if (!editName.trim()) return;

        const { error } = await supabase
            .from('affiliate_links')
            .update({ name: editName })
            .eq('id', linkId);

        if (!error) {
            setLinks(links.map(link => 
                link.id === linkId ? { ...link, name: editName } : link
            ));
            setEditingId(null);
            setEditName('');
        } else {
            alert(error.message);
        }
    };

    const toggleAnalytics = (linkId: string) => {
        setExpandedAnalytics(expandedAnalytics === linkId ? null : linkId);
    };

    const runDiagnostics = async () => {
        console.log('=== RUNNING DIAGNOSTICS ===');
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        console.log('1. User:', user?.id, userError);
        
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user?.id)
            .single();
        console.log('2. Profile:', profile, profileError);
        
        const { data: affiliate, error: affiliateError } = await supabase
            .from('affiliates')
            .select('*')
            .eq('id', user?.id)
            .single();
        console.log('3. Affiliate:', affiliate, affiliateError);
        
        const { data: links, error: linksError } = await supabase
            .from('affiliate_links')
            .select('*')
            .eq('affiliate_id', user?.id);
        console.log('4. Links:', links, linksError);
        
        alert(`Diagnostics complete! Check console (F12) for details.\n\nUser ID: ${user?.id}\nProfile: ${profile ? '✓' : '✗'}\nAffiliate: ${affiliate ? '✓' : '✗'}\nLinks found: ${links?.length || 0}`);
        setShowDebug(true);
    };

    const handleDragStart = (event: { active: { id: string | number } }) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveId(null);
        
        if (over && active.id !== over.id) {
            setLinks((prev) => {
                const oldIndex = prev.findIndex((link) => link.id === active.id);
                const newIndex = prev.findIndex((link) => link.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const togglePublishStatus = async (link: AffiliateLink, newStatus: 'draft' | 'paused' | 'published') => {
        if (!link.landing_page) {
            alert('No landing page exists yet. Please create one in the Landing Builder first.');
            return;
        }

        console.log('Attempting to change status:', {
            linkId: link.id,
            landingPageId: link.landing_page.id,
            currentStatus: link.landing_page.status,
            newStatus: newStatus
        });

        const isPublished = newStatus === 'published';

        const { data, error } = await supabase
            .from('landing_pages')
            .update({ 
                status: newStatus,
                is_published: isPublished 
            })
            .eq('id', link.landing_page.id)
            .select();

        console.log('Update result:', { data, error });

        if (!error) {
            // Update local state
            setLinks(links.map(l => 
                l.id === link.id && l.landing_page
                    ? { 
                        ...l, 
                        landing_page: { 
                            ...l.landing_page, 
                            status: newStatus,
                            is_published: isPublished 
                        } 
                    }
                    : l
            ));
            
            // Show success message
            const statusEmoji = newStatus === 'published' ? '✓' : newStatus === 'paused' ? '⏸️' : '📝';
            setToastMessage(`${statusEmoji} "${link.name}" is now ${newStatus}!`);
        } else {
            console.error('Error updating status:', {
                message: error.message,
                details: error.details,
                hint: error.hint,
                code: error.code
            });
            alert(`Failed to change status: ${error.message}\n\nDetails: ${error.details || 'None'}\nHint: ${error.hint || 'None'}\n\nThis might mean the database migration hasn't been run yet. Check the console for details.`);
        }
    };

    const deleteLink = async (link: AffiliateLink) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${link.name}"?\n\n` +
            `This will permanently delete:\n` +
            `• The affiliate link\n` +
            `• Any associated landing page\n` +
            `• Click and referral tracking data\n\n` +
            `This action cannot be undone.`
        );

        if (!confirmDelete) return;

        try {
            // Delete landing page first (if exists)
            if (link.landing_page) {
                const { error: landingError } = await supabase
                    .from('landing_pages')
                    .delete()
                    .eq('id', link.landing_page.id);

                if (landingError) {
                    console.error('Error deleting landing page:', landingError);
                    alert(`Failed to delete landing page: ${landingError.message}`);
                    return;
                }
            }

            // Delete the link
            const { error: linkError } = await supabase
                .from('affiliate_links')
                .delete()
                .eq('id', link.id);

            if (linkError) {
                console.error('Error deleting link:', linkError);
                alert(`Failed to delete link: ${linkError.message}`);
                return;
            }

            // Update local state
            setLinks(links.filter(l => l.id !== link.id));
            alert(`"${link.name}" has been deleted successfully.`);
        } catch (error) {
            console.error('Unexpected error deleting link:', error);
            alert('An unexpected error occurred while deleting the link.');
        }
    };

    return (
        <DashboardShell>
            <div className="space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Manage Links</h2>
                        <p className="text-secondary mt-1">Create and track custom affiliate links for different channels.</p>
                    </div>
                    <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={runDiagnostics}
                        className="text-xs"
                    >
                        🔍 Run Diagnostics
                    </Button>
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

                {showDebug && (
                    <Card className="bg-yellow-500/10 border-yellow-500/20">
                        <CardContent className="p-4">
                            <p className="text-sm font-semibold text-yellow-600 mb-2">🔍 Debug Information</p>
                            <p className="text-xs text-secondary">Check browser console (F12) for detailed diagnostics</p>
                            <p className="text-xs text-secondary mt-1">Links in state: {links.length}</p>
                            <button 
                                onClick={() => setShowDebug(false)}
                                className="text-xs text-yellow-600 underline mt-2"
                            >
                                Hide Debug Info
                            </button>
                        </CardContent>
                    </Card>
                )}

                <DndContext 
                    sensors={sensors} 
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    onDragCancel={handleDragCancel}
                >
                    <SortableContext
                        items={links.map((link) => link.id)}
                        strategy={verticalListSortingStrategy}
                    >
                <div className="grid gap-6">
                    {links.length > 0 ? (
                        links.map((link) => (
                                    <SortableLinkCard
                                        key={link.id}
                                        link={link}
                                        editingId={editingId}
                                        editName={editName}
                                        expandedAnalytics={expandedAnalytics}
                                        onStartEditing={startEditing}
                                        onCancelEditing={cancelEditing}
                                        onSaveEdit={saveEdit}
                                        onSetEditName={setEditName}
                                        onToggleAnalytics={toggleAnalytics}
                                        onTogglePublishStatus={togglePublishStatus}
                                        onCopyToClipboard={copyToClipboard}
                                        onDeleteLink={deleteLink}
                                        onNavigateToBuilder={(linkId) => router.push(`/affiliate/links/${linkId}/builder`)}
                                    />
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
                    </SortableContext>
                    
                    <DragOverlay>
                        {activeId ? (
                            <Card className="opacity-50">
                                <CardContent className="p-6">
                                    <div className="flex items-center gap-2">
                                        <GripVertical className="w-5 h-5 text-secondary" />
                                        <p className="font-semibold">
                                            {links.find(l => l.id === activeId)?.name || 'Link'}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : null}
                    </DragOverlay>
                </DndContext>

                {/* Toast Notification */}
                {toastMessage && (
                    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in">
                        <div className="rounded-lg bg-green-600 px-4 py-3 text-white shadow-lg">
                            <p className="text-sm font-medium">{toastMessage}</p>
                        </div>
                    </div>
                )}

            </div>
        </DashboardShell>
    );
}
