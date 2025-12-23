'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LandingPageBuilder, type SectionCard } from '@/components/landing/LandingPageBuilder';
import { useParams } from 'next/navigation';

interface BuilderPayload {
    link: {
        id: string;
        name: string;
        slug: string;
    };
    landingPage: {
        sections: unknown[];
        is_published: boolean;
    } | null;
}

export default function LandingBuilderPage() {
    const router = useRouter();
    const params = useParams();
    const linkId = params?.linkId;
    const [payload, setPayload] = useState<BuilderPayload | null>(null);
    const [status, setStatus] = useState<'idle' | 'loading' | 'error'>(() =>
        linkId ? 'loading' : 'error'
    );
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (!linkId) {
            return;
        }

        const fetchPayload = async () => {
            setStatus('loading');
            try {
                const response = await fetch(`/api/affiliate-links/${linkId}/builder`, {
                    cache: 'no-store',
                    credentials: 'include',
                });

                if (response.status === 401) {
                    router.push(`/auth/login?next=/affiliate/links/${linkId}/builder`);
                    return;
                }

                if (!response.ok) {
                    const text = await response.text();
                    let message = 'Unable to fetch builder data.';
                    try {
                        const json = JSON.parse(text);
                        if (json?.error) {
                            message = json.error;
                        }
                    } catch {
                        if (text) {
                            message = text;
                        }
                    }

                    setErrorMessage(message);
                    setStatus('error');
                    return;
                }

                const data = await response.json();
                if (!data?.link) {
                    setErrorMessage('Builder payload is empty.');
                    setStatus('error');
                    return;
                }

                console.log('🔍 Builder loaded:', {
                    linkName: data.link.name,
                    hasLandingPage: Boolean(data.landingPage),
                    sectionCount: data.landingPage?.sections?.length ?? 0,
                    isPublished: data.landingPage?.is_published ?? false
                });

                setPayload(data);
                setStatus('idle');
            } catch (error) {
                console.error(error);
                setErrorMessage('An unexpected error occurred while loading the builder.');
                setStatus('error');
            }
        };

        fetchPayload();
    }, [linkId, router]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-[#0f172a]">
                <div className="mx-auto max-w-4xl px-4 py-20 text-center text-lg text-[#94a3b8]">
                    Loading landing builder…
                </div>
            </div>
        );
    }

    if (status === 'error' || !payload) {
        return (
            <div className="min-h-screen bg-[#0f172a]">
                <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                    <p className="text-xl font-semibold text-white">We couldn&apos;t load this builder.</p>
                    <p className="mt-2 text-[#94a3b8]">Please refresh the page or contact support if the issue persists.</p>
                    {errorMessage && (
                        <p className="mt-3 text-sm text-red-400">Error: {errorMessage}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <LandingPageBuilder
            link={payload.link}
            initialSections={(payload.landingPage?.sections ?? []) as SectionCard[]}
            isPublished={payload.landingPage?.is_published ?? false}
            onNavigateBack={() => {
                router.push('/affiliate/links');
                // Force refresh to get latest data
                router.refresh();
            }}
        />
    );
}

