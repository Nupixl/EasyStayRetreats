-- Add tracking fields to referrals table
ALTER TABLE public.referrals
ADD COLUMN IF NOT EXISTS company_source TEXT DEFAULT 'EasyStay',
ADD COLUMN IF NOT EXISTS form_engagement TEXT CHECK (form_engagement IN ('partial', 'completed')) DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS time_to_complete INTEGER; -- in seconds

-- Add index for analytics queries
CREATE INDEX IF NOT EXISTS idx_referrals_company_source ON public.referrals(company_source);
CREATE INDEX IF NOT EXISTS idx_referrals_engagement ON public.referrals(form_engagement);
CREATE INDEX IF NOT EXISTS idx_referrals_completed_at ON public.referrals(completed_at);

-- Create a view for conversion metrics
CREATE OR REPLACE VIEW public.referral_conversion_metrics AS
SELECT 
    affiliate_link_id,
    company_source,
    COUNT(*) as total_submissions,
    COUNT(*) FILTER (WHERE form_engagement = 'completed') as completed_submissions,
    COUNT(*) FILTER (WHERE form_engagement = 'partial') as partial_submissions,
    ROUND(
        (COUNT(*) FILTER (WHERE form_engagement = 'completed')::NUMERIC / 
        NULLIF(COUNT(*), 0) * 100), 2
    ) as completion_rate,
    AVG(time_to_complete) FILTER (WHERE time_to_complete IS NOT NULL) as avg_time_to_complete,
    MIN(completed_at) as first_submission,
    MAX(completed_at) as last_submission
FROM public.referrals
GROUP BY affiliate_link_id, company_source;

-- Grant access to the view
GRANT SELECT ON public.referral_conversion_metrics TO authenticated;

-- Add comment for documentation
COMMENT ON COLUMN public.referrals.company_source IS 'Tracks which company/brand the referral came from (e.g., EasyStay, PartnerCo)';
COMMENT ON COLUMN public.referrals.form_engagement IS 'Tracks if form was partially filled or fully completed';
COMMENT ON COLUMN public.referrals.time_to_complete IS 'Time taken to complete form in seconds';
COMMENT ON VIEW public.referral_conversion_metrics IS 'Analytics view for form conversion rates and engagement metrics';



