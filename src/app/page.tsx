import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
      <div className="max-w-3xl space-y-8">
        <h1 className="text-6xl font-extrabold tracking-tight text-gradient">
          EasyStay Retreats Affiliate Program
        </h1>
        <p className="text-xl text-secondary max-w-2xl mx-auto">
          Partner with the leading Airbnb management company. Recommend property owners and earn premium commissions on every signed deal.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" className="w-full sm:w-auto" href="/signup">
            Become an Affiliate
          </Button>
          <Button size="lg" variant="outline" className="w-full sm:w-auto" href="/login">
            Partner Login
          </Button>
        </div>
      </div>

      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl w-full">
        <div className="p-8 rounded-3xl bg-muted/30 border border-border">
          <h3 className="text-lg font-bold mb-2">Multi-Link Tracking</h3>
          <p className="text-sm text-secondary">Generate unique links for every campaign and track performance separately.</p>
        </div>
        <div className="p-8 rounded-3xl bg-muted/30 border border-border">
          <h3 className="text-lg font-bold mb-2">Pipeline Transparency</h3>
          <p className="text-sm text-secondary">See exactly where your referrals are in our sales process, from first contact to signed deal.</p>
        </div>
        <div className="p-8 rounded-3xl bg-muted/30 border border-border">
          <h3 className="text-lg font-bold mb-2">Fast Payouts</h3>
          <p className="text-sm text-secondary">Automatic notifications and clear earnings tracking for every successful property onboarded.</p>
        </div>
      </div>
    </div>
  );
}
