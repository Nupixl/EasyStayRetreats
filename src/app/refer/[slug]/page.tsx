import { createClient } from '@supabase/supabase-js';
import { ReferralForm } from '@/components/referral/ReferralForm';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import type { SectionCard } from '@/components/landing/LandingPageBuilder';

// Disable caching for this page to always show latest published version
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReferralPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Create server-side Supabase client
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Fetch link with affiliate_id to check ownership
    const { data: link, error } = await supabase
        .from('affiliate_links')
        .select('id, name, headline, subheadline, hero_image_url, affiliate_id')
        .eq('slug', slug)
        .single();

    if (error || !link) {
        notFound();
    }

    // Fetch landing page if it exists (use maybeSingle to handle 0 rows gracefully)
    const { data: landingPage, error: landingError } = await supabase
        .from('landing_pages')
        .select('sections, is_published, status')
        .eq('affiliate_link_id', link.id)
        .maybeSingle();

    // Debug logging
    console.log('🔍 Landing page fetch result:', {
        slug,
        linkId: link.id,
        hasLandingPage: !!landingPage,
        status: landingPage?.status,
        isPublished: landingPage?.is_published,
        hasSections: !!landingPage?.sections,
        sectionCount: Array.isArray(landingPage?.sections) ? landingPage.sections.length : 0,
        firstSectionType: Array.isArray(landingPage?.sections) && landingPage.sections.length > 0 
            ? (landingPage.sections[0] as any)?.type 
            : 'none',
        error: landingError?.message,
        willRenderCustom: landingPage?.status === 'published' && !!landingPage?.sections
    });

    // Only increment click count if visitor is NOT the owner
    const { data: { user } } = await supabase.auth.getUser();
    const isOwner = user && user.id === link.affiliate_id;
    
    if (!isOwner) {
        // Increment click count (fire and forget for performance)
        supabase.rpc('increment_link_clicks', { link_id: link.id }).then();
    }

    // If landing page exists and is published (not paused), render it
    if (landingPage?.status === 'published' && landingPage?.sections && Array.isArray(landingPage.sections) && landingPage.sections.length > 0) {
        const sections = landingPage.sections as SectionCard[];
        
        // Find first form section - all buttons should link to it
        const formSection = sections.find(s => s.type === 'form');
        const formLink = formSection ? `#form-${formSection.id}` : '#';
        
        const heroSection = sections.find(s => s.type === 'hero');
        
        // Determine CTA button text
        const mobileCTAText = heroSection?.data.ctaText || 'Get Started';

        return (
            <div className="min-h-screen bg-[#f4f6fb]">
                <div className="relative space-y-6 pb-24 sm:pb-0 md:space-y-8 p-4 sm:p-8">
                    {/* Header/Nav */}
                    <header className="overflow-hidden rounded-lg bg-white shadow-sm">
                        <div className="mx-auto flex h-20 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center">
                                <span className="text-2xl font-bold tracking-wider text-[#5a5a5a] sm:text-3xl">
                                    EASY<span className="text-[#5a8f7b]">STAY</span>
                                </span>
                                <span className="ml-2 text-xs font-light uppercase tracking-[0.3em] text-[#9ca3af]">
                                    RETREATS
                                </span>
                            </div>
                        </div>
                    </header>
                    
                    {/* Sections */}
                    {sections.map((section) => {
                        switch (section.type) {
                            case 'hero':
                                return (
                                    <div
                                        key={section.id}
                                        className="relative overflow-hidden rounded-lg shadow-2xl"
                                        style={{
                                            minHeight: '400px',
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundImage: section.data.backgroundImage
                                                    ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${section.data.backgroundImage})`
                                                    : undefined,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: section.data.backgroundColor || '#0f172a',
                                            }}
                                        />
                                        <div className="relative z-10 flex h-full min-h-[400px] flex-col items-center justify-center px-6 py-12 text-center text-white sm:px-8 sm:py-16 md:min-h-[500px]">
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
                                                OUR SERVICE
                                            </p>
                                            <h1 className="mb-4 w-full max-w-[90%] text-xl font-bold leading-[1.2] sm:mb-6 sm:max-w-3xl sm:text-4xl md:text-5xl lg:text-6xl" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                {section.data.headline}
                                            </h1>
                                            <p className="mb-6 w-full max-w-[90%] text-xs leading-relaxed text-white/90 sm:mb-8 sm:max-w-2xl sm:text-base md:text-lg lg:text-xl" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                {section.data.subheadline}
                                            </p>
                                            {section.data.ctaText && (
                                                <a
                                                    href={formLink}
                                                    className="hidden sm:inline-flex rounded-md bg-[#5a8f7b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#4a7f6b] sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
                                                >
                                                    {section.data.ctaText}
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                );
                            case 'benefits':
                                return (
                                    <div key={section.id} className="overflow-hidden rounded-lg shadow-lg" style={{ backgroundColor: section.data.backgroundColor || '#ffffff' }}>
                                        <div className="flex flex-col gap-0">
                                            <div className="order-2 flex flex-col justify-center space-y-3 p-5 sm:space-y-6 sm:p-8 md:order-1 md:p-10 lg:p-16 lg:space-y-8">
                                                <div>
                                                    <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#6b7280] sm:mb-3 sm:text-xs sm:tracking-[0.3em]">
                                                        OUR STORY
                                                    </p>
                                                    <h2 className="mb-3 text-lg font-bold leading-[1.2] text-[#1f2937] sm:mb-4 sm:text-2xl md:text-3xl lg:mb-6 lg:text-4xl xl:text-5xl" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                        Hosting is stressful, time-consuming.
                                                    </h2>
                                                    <p className="mb-4 text-xs leading-relaxed text-[#6b7280] sm:mb-6 sm:text-sm md:text-base lg:mb-8 lg:text-lg" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                        Managing an Airbnb isn&apos;t just about putting your property online — it&apos;s late-night guest messages, last-minute cleanings, maintenance emergencies, and keeping up with constantly changing regulations. For many property owners, what starts as a side hustle quickly turns into a full-time job.
                                                    </p>
                                                    <a
                                                        href={formLink}
                                                        className="hidden sm:inline-flex rounded-md bg-[#5a8f7b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#4a7f6b] sm:px-6 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
                                                    >
                                                        CONTACT US
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="order-1 relative min-h-[250px] bg-gray-200 sm:min-h-[300px] md:order-2 md:min-h-[400px]">
                                                {section.data.backgroundImage && (
                                                    <Image
                                                        src={section.data.backgroundImage}
                                                        alt="Benefits"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            case 'testimonial':
                                return (
                                    <div
                                        key={section.id}
                                        className="relative overflow-hidden rounded-lg shadow-2xl"
                                        style={{
                                            minHeight: '350px',
                                        }}
                                    >
                                        <div
                                            className="absolute inset-0"
                                            style={{
                                                backgroundImage: section.data.backgroundImage 
                                                    ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${section.data.backgroundImage})`
                                                    : undefined,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                backgroundColor: section.data.backgroundColor || '#1e3a5f',
                                            }}
                                        />
                                        <div className="relative z-10 flex h-full min-h-[350px] flex-col items-center justify-center px-6 py-12 text-center sm:px-8 sm:py-16 md:min-h-[400px]">
                                            <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/90 sm:mb-6 sm:text-xs sm:tracking-[0.3em]">
                                                OUR PROMISE
                                            </p>
                                            <h2 className="mb-6 w-full max-w-[90%] text-lg font-bold leading-[1.2] text-white sm:mb-8 sm:max-w-4xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl" style={{ wordWrap: 'break-word', whiteSpace: 'normal' }}>
                                                Get Unparalleled Peace Of Mind From Start To Finish
                                            </h2>
                                            <a
                                                href={formLink}
                                                className="hidden sm:inline-flex rounded-md bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1f2937] transition-all hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
                                            >
                                                CONTACT US
                                            </a>
                                        </div>
                                    </div>
                                );
                            case 'form':
                                return (
                                    <div 
                                        key={section.id}
                                        id={`form-${section.id}`}
                                        className="overflow-hidden rounded-lg shadow-lg"
                                        style={{
                                            backgroundColor: section.data.backgroundColor || '#f8fafc',
                                            backgroundImage: section.data.backgroundImage 
                                                ? `url(${section.data.backgroundImage})`
                                                : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                    >
                                        <div>
                                            <ReferralForm
                                                linkId={link.id}
                                                headline={section.data.headline}
                                                subheadline={section.data.subheadline}
                                            />
                                        </div>
                                    </div>
                                );
                            case 'feature':
                                return (
                                    <section
                                        key={section.id}
                                        className="relative overflow-hidden rounded-lg"
                                        style={{
                                            backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
                                                ? `url(${section.data.backgroundImage})`
                                                : undefined,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                            backgroundColor: section.data.backgroundType === 'color' ? section.data.backgroundColor : (section.data.backgroundColor || '#ffffff'),
                                        }}
                                    >
                                        <div className="mx-auto max-w-7xl px-6 py-12 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
                                            <div className={`flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12 ${section.data.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                                                {/* Image Column */}
                                                <div className="w-full lg:flex-1">
                                                    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
                                                        <Image
                                                            src={section.data.imageUrl}
                                                            alt={section.data.title}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* Content Column */}
                                                <div className="w-full lg:flex-1 space-y-4">
                                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#94A3B8]">
                                                        WHY WE WORK
                                                    </p>
                                                    <h2 className="text-3xl font-bold leading-tight text-[#0F172A] sm:text-4xl lg:text-5xl">
                                                        {section.data.title}
                                                    </h2>
                                                    <p className="text-lg leading-relaxed text-[#64748B]">
                                                        {section.data.description}
                                                    </p>
                                                    <a
                                                        href={formLink}
                                                        className="hidden sm:inline-flex rounded-md bg-[#5a8f7b] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#4a7f6b]"
                                                    >
                                                        SEE STAYS
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </section>
                                );
                            default:
                                return null;
                        }
                    })}
                    
                    {/* Mobile Sticky CTA Button */}
                    <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4">
                        <a
                            href={formLink}
                            className="flex w-full items-center justify-center rounded-full bg-[#5a8f7b] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-[#4a7f6b] active:scale-95"
                        >
                            {mobileCTAText}
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    // Fallback to simple referral form
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Image Section */}
            {link.hero_image_url && (
                <div className="w-full h-[300px] md:h-[400px] relative overflow-hidden">
                    <img
                        src={link.hero_image_url}
                        alt="EasyStay Retreats"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>
            )}

            <div className={`py-12 px-4 sm:px-6 lg:px-8 ${link.hero_image_url ? '-mt-24 relative z-10' : ''}`}>
                <div className="max-w-4xl mx-auto">
                    {!link.hero_image_url && (
                        <div className="text-center mb-12">
                            <h1 className="text-4xl font-extrabold text-gradient mb-4">EasyStay Retreats</h1>
                            <p className="text-xl text-[#718096]">Premium Airbnb Management in Florida</p>
                        </div>
                    )}

                    <ReferralForm
                        linkId={link.id}
                        headline={link.headline}
                        subheadline={link.subheadline}
                    />

                    <footer className="mt-20 text-center text-sm text-[#718096]">
                        <p>© 2023 EasyStay Retreats. All rights reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
    );
}
