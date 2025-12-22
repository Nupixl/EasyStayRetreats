import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const cookieStore = cookies();
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

    const payload = await req.json();
    const { linkId, sections, publish } = payload;

    try {
        const { data: link, error: linkError } = await supabase
            .from('affiliate_links')
            .select('id')
            .eq('id', linkId)
            .single();

        if (linkError || !link) {
            return NextResponse.json({ error: 'Link not found.' }, { status: 404 });
        }

        const upsertPayload = {
            affiliate_link_id: linkId,
            sections: sections ?? [],
            is_published: Boolean(publish),
            updated_at: new Date().toISOString(),
        };

        const { error: landingError } = await supabase
            .from('landing_pages')
            .upsert(upsertPayload, { onConflict: 'affiliate_link_id' });

        if (landingError) {
            throw landingError;
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unexpected error saving landing page';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}

