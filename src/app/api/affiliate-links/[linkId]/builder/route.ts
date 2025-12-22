import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(_: Request, context: { params: Promise<{ linkId: string }> }) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
        cookies: {
            get(name: string) {
                return cookieStore.get(name)?.value ?? null;
            },
            set(name: string, value: string, options) {
                cookieStore.set({ name, value, ...options });
            },
            remove(name: string) {
                cookieStore.delete(name);
            },
        },
        }
    );

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const resolvedParams = await context.params;
    const linkId = resolvedParams?.linkId;

    if (!linkId) {
        return NextResponse.json({ error: 'Missing linkId' }, { status: 400 });
    }

    const { data: link, error: linkError } = await supabase
        .from('affiliate_links')
        .select('id, name, slug, affiliate_id')
        .eq('id', linkId)
        .maybeSingle();

    console.log('landing builder', {
        action: 'fetch-link',
        requestedLink: linkId,
        user: user?.id ?? null,
        hasLink: Boolean(link),
        linkError: linkError?.message ?? null,
    });

    if (linkError || !link) {
        return NextResponse.json({ error: 'Link not found' }, { status: 404 });
    }

    if (link.affiliate_id !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { data: landingPage } = await supabase
        .from('landing_pages')
        .select('sections, is_published')
        .eq('affiliate_link_id', link.id)
        .maybeSingle();

    return NextResponse.json({
        link: {
            id: link.id,
            name: link.name,
            slug: link.slug,
        },
        landingPage: landingPage ?? null,
    });
}

