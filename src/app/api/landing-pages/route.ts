import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value;
                },
                set(name: string, value: string, options) {
                    cookieStore.set({ name, value, ...options });
                },
                remove(name: string, options) {
                    cookieStore.set({ name, value: '', ...options });
                },
            },
        }
    );

    // Check authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        console.error('Authentication error:', authError);
        return NextResponse.json({ error: 'Unauthorized. Please log in.' }, { status: 401 });
    }

    const payload = await req.json();
    const { linkId, sections, publish } = payload;

    try {
        // Log for debugging
        console.log('Attempting to save landing page for linkId:', linkId, 'by user:', user.id);

        // Verify link exists and user owns it
        const { data: link, error: linkError } = await supabase
            .from('affiliate_links')
            .select('id, affiliate_id')
            .eq('id', linkId)
            .single();

        if (linkError) {
            console.error('Link lookup error:', linkError);
            return NextResponse.json({ 
                error: `Link not found: ${linkError.message}`,
                details: linkError 
            }, { status: 404 });
        }

        if (!link) {
            console.error('No link found with id:', linkId);
            return NextResponse.json({ 
                error: 'Link not found. The affiliate link may not exist in the database.',
                linkId 
            }, { status: 404 });
        }

        // Verify ownership
        if (link.affiliate_id !== user.id) {
            console.error('User does not own link:', { userId: user.id, linkOwnerId: link.affiliate_id });
            return NextResponse.json({ 
                error: 'Forbidden. You do not have permission to edit this link.' 
            }, { status: 403 });
        }

        const upsertPayload = {
            affiliate_link_id: linkId,
            sections: sections ?? [],
            is_published: Boolean(publish),
            status: publish ? 'published' : 'draft',
            updated_at: new Date().toISOString(),
        };

        const { error: landingError, data: landingData } = await supabase
            .from('landing_pages')
            .upsert(upsertPayload, { onConflict: 'affiliate_link_id' })
            .select();

        if (landingError) {
            console.error('Landing page upsert error:', landingError);
            return NextResponse.json({ 
                error: `Failed to save landing page: ${landingError.message}`,
                details: landingError 
            }, { status: 500 });
        }

        console.log('Landing page saved successfully:', {
            id: landingData[0]?.id,
            linkId,
            status: landingData[0]?.status,
            sectionCount: landingData[0]?.sections?.length,
            publish
        });
        return NextResponse.json({ success: true, data: landingData });
    } catch (error) {
        console.error('Unexpected error in landing-pages API:', error);
        const message = error instanceof Error ? error.message : 'Unexpected error saving landing page';
        const details = error instanceof Error ? error.stack : String(error);
        return NextResponse.json({ 
            error: message,
            details: details
        }, { status: 500 });
    }
}

