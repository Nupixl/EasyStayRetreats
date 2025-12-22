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
        linkId,
        firstName,
        lastName,
        email,
        phone,
        role,
        propertiesCount,
        properties, // NEW: Array of property objects
        listingLinks,
        // Tracking fields
        companySource = 'EasyStay',
        formEngagement = 'completed',
        startedAt,
        completedAt,
        timeToComplete,
        partialData
    } = body;

    const parsedPropertiesCount =
        propertiesCount === null || propertiesCount === undefined
            ? null
            : Number(propertiesCount);
    const normalizedPropertiesCount =
        parsedPropertiesCount !== null && Number.isFinite(parsedPropertiesCount)
            ? parsedPropertiesCount
            : null;

    try {
        // Handle partial submissions (tracking only, no full referral record)
        if (formEngagement === 'partial') {
            // Log partial submission for analytics
            const { error: partialError } = await supabase
                .from('referrals')
                .insert([
                    {
                        affiliate_link_id: linkId,
                        first_name: firstName || '',
                        last_name: lastName || '',
                        owner_email: email || '',
                        phone: phone || '',
                        role: role || null,
                        properties_count: null,
                        listing_links: null,
                        status: 'partial',
                        company_source: companySource,
                        form_engagement: 'partial',
                        started_at: startedAt || new Date().toISOString(),
                        completed_at: null,
                        time_to_complete: null
                    }
                ]);

            if (partialError) console.error('Error logging partial submission:', partialError);
            
            return NextResponse.json({ success: true, type: 'partial' });
        }

        // 1. Save completed referral to Supabase
        const { data: referral, error: referralError } = await supabase
            .from('referrals')
            .insert([
                {
                    affiliate_link_id: linkId,
                    first_name: firstName,
                    last_name: lastName,
                    owner_email: email,
                    phone: phone,
                    role: role,
                    properties_count: normalizedPropertiesCount,
                    properties: properties || null, // NEW: Store properties array
                    listing_links: listingLinks,
                    status: 'new',
                    // Tracking fields
                    company_source: companySource,
                    form_engagement: 'completed',
                    started_at: startedAt || completedAt || new Date().toISOString(),
                    completed_at: completedAt || new Date().toISOString(),
                    time_to_complete: timeToComplete
                }
            ])
            .select()
            .single();

        if (referralError) throw referralError;

        // 2. Increment referrals_count in affiliate_links
        const { error: updateError } = await supabase.rpc('increment_referral_count', { link_id: linkId });
        if (updateError) console.error('Error incrementing referral count:', updateError);

        // 3. Send to Airtable Webhook
        try {
            const airtablePayload = {
                firstName,
                lastName,
                email,
                phone,
                propertiesCount: normalizedPropertiesCount,
                properties: properties || [],
                listingLinks,
                companySource,
                submittedAt: completedAt || new Date().toISOString(),
                timeToComplete,
                referralId: referral.id
            };

            const airtableResponse = await fetch(
                'https://hooks.airtable.com/workflows/v1/genericWebhook/appgCDGkSJ1XpodGS/wflvULnylMNWY17o3/wtrfGQ2D49embpvMR',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(airtablePayload)
                }
            );

            if (!airtableResponse.ok) {
                console.error('Airtable webhook failed:', await airtableResponse.text());
            } else {
                console.log('Successfully sent to Airtable webhook');
            }
        } catch (airtableError) {
            // Don't fail the whole request if Airtable fails
            console.error('Error sending to Airtable:', airtableError);
        }

        // 4. Trigger GHL Opportunity Creation (Mocked for now)
        console.log('Would create GHL Opportunity for:', referral.id);
        console.log('Tracking data:', { companySource, formEngagement, timeToComplete });

        return NextResponse.json({ success: true, referralId: referral.id });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Something went wrong while submitting your referral.';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
