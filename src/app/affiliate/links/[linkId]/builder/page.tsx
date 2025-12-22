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
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');

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
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f4f6fb]'}`}>
                <div className={`mx-auto max-w-4xl px-4 py-20 text-center text-lg ${
                    theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#475569]'
                }`}>
                    Loading landing builder…
                </div>
            </div>
        );
    }

    if (status === 'error' || !payload) {
        return (
            <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f4f6fb]'}`}>
                <div className="mx-auto max-w-4xl px-4 py-20 text-center">
                    <p className={`text-xl font-semibold ${
                        theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
                    }`}>We couldn&apos;t load this builder.</p>
                    <p className={`mt-2 ${
                        theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#475569]'
                    }`}>Please refresh the page or contact support if the issue persists.</p>
                    {errorMessage && (
                        <p className={`mt-3 text-sm ${
                            theme === 'dark' ? 'text-red-400' : 'text-red-600'
                        }`}>Error: {errorMessage}</p>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen transition-colors ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f4f6fb]'}`}>
            <div className={`flex items-center justify-between rounded-2xl border px-4 py-3 shadow-sm md:px-6 transition-colors ${
                theme === 'dark'
                    ? 'border-[#334155] bg-[#1e293b]'
                    : 'border-[#E2E8F0] bg-white'
            }`}>
                <div>
                    <p className={`text-xs uppercase tracking-[0.3em] ${
                        theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'
                    }`}>Landing editor</p>
                    <h1 className={`text-lg font-semibold md:text-2xl ${
                        theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
                    }`}>
                        {payload.link.name}
                    </h1>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                            theme === 'dark'
                                ? 'bg-[#334155] text-yellow-400 hover:bg-[#475569]'
                                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                        }`}
                        title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {theme === 'dark' ? '☀️' : '🌙'}
                    </button>
                    <button
                        type="button"
                        onClick={() => router.push('/affiliate/links')}
                        className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition ${
                            theme === 'dark'
                                ? 'border-[#475569] text-[#94a3b8] hover:border-[#667eea] hover:text-white'
                                : 'border-[#CBD5F5] text-[#475569] hover:border-[#667eea] hover:text-[#0f172a]'
                        }`}
                    >
                        Back to links
                    </button>
                </div>
            </div>
            <LandingPageBuilder
                link={payload.link}
                initialSections={(payload.landingPage?.sections ?? []) as SectionCard[]}
                isPublished={payload.landingPage?.is_published ?? false}
            />
        </div>
    );
}

