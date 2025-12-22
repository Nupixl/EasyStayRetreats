import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    cookieStore.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    cookieStore.set({ name, value: '', ...options })
                },
            },
        }
    )

    const body = await req.json();

    const {
        opportunity_id,
        status,
        pipeline_stage_name,
        deal_value
    } = body;

    if (!opportunity_id) {
        return NextResponse.json({ error: 'Missing opportunity_id' }, { status: 400 });
    }

    try {
        let internalStatus = 'pipeline';
        if (pipeline_stage_name?.toLowerCase().includes('contracted') || pipeline_stage_name?.toLowerCase().includes('contacted')) {
            internalStatus = 'contacted';
        } else if (pipeline_stage_name?.toLowerCase().includes('signed')) {
            internalStatus = 'signed';
        } else if (pipeline_stage_name?.toLowerCase().includes('completed') || status === 'won') {
            internalStatus = 'completed';
        }

        const { error } = await supabase
            .from('referrals')
            .update({
                status: internalStatus,
                deal_amount: deal_value,
                ghl_opportunity_id: opportunity_id
            })
            .eq('ghl_opportunity_id', opportunity_id);

        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
