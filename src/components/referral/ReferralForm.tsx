 'use client';

import { useState, useEffect, useRef, type FormEvent } from 'react';
import { Button } from '@/components/ui/Button';

const defaultHeadline = 'Let EasyStay Manage Your Property';
const defaultSubheadline =
    "Share a few details about your property and our management specialists will reach out within 24 hours with a custom plan.";

const propertyTypeOptions = [
    { label: 'Single Family Home', value: 'single-family' },
    { label: 'Condo/Apartment', value: 'condo' },
    { label: 'Townhouse', value: 'townhouse' },
    { label: 'Multi-Unit Building', value: 'multi-unit' },
    { label: 'Vacation Home', value: 'vacation-home' },
    { label: 'Other', value: 'other' },
];

const managementInterestOptions = [
    { label: 'Full Property Management', value: 'full-management' },
    { label: 'Guest Communication Only', value: 'guest-communication' },
    { label: 'Cleaning & Maintenance', value: 'cleaning-maintenance' },
    { label: 'Listing Optimization', value: 'listing-optimization' },
    { label: 'Not Sure - Need Consultation', value: 'consultation' },
];

interface ReferralFormProps {
    linkId: string;
    headline?: string;
    subheadline?: string;
    companySource?: string; // Hidden field to track which company the form is for
}

interface Property {
    id: string;
    propertyType: string;
    propertyLocation: string;
    managementInterest: string;
    currentlyListed: string;
    listingLinks: string;
}

export function ReferralForm({ linkId, headline, subheadline, companySource = 'EasyStay' }: ReferralFormProps) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
    });
    const [properties, setProperties] = useState<Property[]>([
        {
            id: crypto.randomUUID(),
            propertyType: '',
            propertyLocation: '',
            managementInterest: '',
            currentlyListed: '',
            listingLinks: '',
        }
    ]);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [formStartTime, setFormStartTime] = useState<number | null>(null);
    const [hasInteracted, setHasInteracted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    // Track when user first interacts with the form
    useEffect(() => {
        const handleFirstInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                setFormStartTime(Date.now());
            }
        };

        const form = formRef.current;
        if (form) {
            form.addEventListener('input', handleFirstInteraction);
            form.addEventListener('focus', handleFirstInteraction, true);
            return () => {
                form.removeEventListener('input', handleFirstInteraction);
                form.removeEventListener('focus', handleFirstInteraction, true);
            };
        }
    }, [hasInteracted]);

    // Track partial submissions when user leaves with data
    useEffect(() => {
        const handleBeforeUnload = async () => {
            if (hasInteracted && status === 'idle') {
                // Check if user has filled any meaningful data
                const hasData = formData.firstName || formData.lastName || formData.email || formData.phone;
                if (hasData) {
                    // Send partial submission tracking (non-blocking)
                    navigator.sendBeacon('/api/referral', JSON.stringify({
                        linkId,
                        companySource,
                        formEngagement: 'partial',
                        startedAt: formStartTime ? new Date(formStartTime).toISOString() : new Date().toISOString(),
                        partialData: {
                            hasFirstName: !!formData.firstName,
                            hasLastName: !!formData.lastName,
                            hasEmail: !!formData.email,
                            hasPhone: !!formData.phone,
                            propertiesCount: properties.length,
                        }
                    }));
                }
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [hasInteracted, status, formData, properties, linkId, companySource, formStartTime]);

    const addProperty = () => {
        setProperties([...properties, {
            id: crypto.randomUUID(),
            propertyType: '',
            propertyLocation: '',
            managementInterest: '',
            currentlyListed: '',
            listingLinks: '',
        }]);
    };

    const removeProperty = (id: string) => {
        if (properties.length > 1) {
            setProperties(properties.filter(p => p.id !== id));
        }
    };

    const updateProperty = (id: string, field: keyof Property, value: string) => {
        setProperties(properties.map(p => 
            p.id === id ? { ...p, [field]: value } : p
        ));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        setError(null);

        try {
            const completedAt = new Date().toISOString();
            const timeToComplete = formStartTime ? Math.round((Date.now() - formStartTime) / 1000) : null;

            const response = await fetch('/api/referral', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkId,
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.trim(),
                    phone: formData.phone.trim(),
                    propertiesCount: properties.length,
                    properties: properties.map(p => ({
                        propertyType: p.propertyType,
                        propertyLocation: p.propertyLocation.trim(),
                        managementInterest: p.managementInterest,
                        currentlyListed: p.currentlyListed,
                        listingLinks: p.listingLinks.trim(),
                    })),
                    // Tracking fields
                    companySource,
                    formEngagement: 'completed',
                    startedAt: formStartTime ? new Date(formStartTime).toISOString() : completedAt,
                    completedAt,
                    timeToComplete,
                }),
            });

            if (!response.ok) throw new Error('Failed to submit referral');

            setStatus('success');
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong.';
            setError(message);
            setStatus('error');
        }
    };

    if (status === 'success') {
        return (
            <section className="c-referral-form px-4 py-12">
                <div className="mx-auto max-w-3xl rounded-[2.5rem] border border-emerald-200 bg-white/90 p-10 text-center shadow-2xl shadow-emerald-500/10">
                    <div className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                        <svg className="h-10 w-10" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-[#0F172A]">Thank You for Your Interest!</h2>
                    <p className="mt-4 text-lg text-[#475569]">
                        Your property information has been received. An EasyStay management specialist will review your details and contact you within 24 hours to discuss how we can maximize your property&apos;s potential.
                    </p>
                    <p className="mt-4 text-sm text-[#64748B]">
                        In the meantime, feel free to explore our services or contact us directly at{' '}
                        <a href="mailto:info@easystayretreats.com" className="font-medium text-emerald-600 hover:text-emerald-700">
                            info@easystayretreats.com
                        </a>
                    </p>
                </div>
            </section>
        );
    }

    return (
        <div className="rounded-[2.25rem] border border-emerald-100 bg-white p-8 shadow-xl">
            <div className="mb-8">
                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
                    Get Started Today
                </p>
                <h3 className="mt-3 text-3xl font-bold text-[#0F172A]">{headline || defaultHeadline}</h3>
                <p className="mt-2 text-base text-[#64748B]">{subheadline || defaultSubheadline}</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} className="space-y-5" aria-live="polite">
                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">Your Information</h4>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <input
                                    type="text"
                                    required
                                    aria-label="First Name"
                                    placeholder="First Name *"
                                    value={formData.firstName}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, firstName: event.target.value }))}
                                    className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/30 px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                />
                                <input
                                    type="text"
                                    required
                                    aria-label="Last Name"
                                    placeholder="Last Name *"
                                    value={formData.lastName}
                                    onChange={(event) => setFormData((prev) => ({ ...prev, lastName: event.target.value }))}
                                    className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/30 px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                />
                            </div>

                            <input
                                type="email"
                                required
                                aria-label="Email"
                                placeholder="Email Address *"
                                value={formData.email}
                                onChange={(event) => setFormData((prev) => ({ ...prev, email: event.target.value }))}
                                className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/30 px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                            />

                            <input
                                type="tel"
                                required
                                aria-label="Phone"
                                placeholder="Phone Number *"
                                value={formData.phone}
                                onChange={(event) => setFormData((prev) => ({ ...prev, phone: event.target.value }))}
                                className="w-full rounded-2xl border border-emerald-200 bg-emerald-50/30 px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                            />
                        </div>

                        {/* Property Details */}
                        <div className="space-y-6 pt-2">
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-semibold uppercase tracking-wider text-[#64748B]">
                                    {properties.length === 1 ? 'Property Details' : `Your Properties (${properties.length})`}
                                </h4>
                                {properties.length < 10 && (
                                    <button
                                        type="button"
                                        onClick={addProperty}
                                        className="flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-700 transition-all hover:bg-emerald-100 active:scale-95"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Property
                                    </button>
                                )}
                            </div>
                            
                            {properties.map((property, index) => (
                                <div key={property.id} className="relative space-y-4 rounded-2xl border-2 border-emerald-100 bg-emerald-50/20 p-5">
                                    {properties.length > 1 && (
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-emerald-700">Property {index + 1}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeProperty(property.id)}
                                                className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 transition-all hover:bg-red-50 active:scale-95"
                                                aria-label={`Remove property ${index + 1}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    )}

                                    <div className="relative">
                                        <select
                                            required
                                            aria-label={`Property Type ${index + 1}`}
                                            value={property.propertyType}
                                            onChange={(e) => updateProperty(property.id, 'propertyType', e.target.value)}
                                            className="w-full appearance-none rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 pr-12 text-[#0F172A] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                        >
                                            <option value="" disabled>
                                                Property Type *
                                            </option>
                                            {propertyTypeOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <input
                                        type="text"
                                        required
                                        aria-label={`Property Location ${index + 1}`}
                                        placeholder="Property Location (City, State) *"
                                        value={property.propertyLocation}
                                        onChange={(e) => updateProperty(property.id, 'propertyLocation', e.target.value)}
                                        className="w-full rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />

                                    <div className="relative">
                                        <select
                                            required
                                            aria-label={`Management Interest ${index + 1}`}
                                            value={property.managementInterest}
                                            onChange={(e) => updateProperty(property.id, 'managementInterest', e.target.value)}
                                            className="w-full appearance-none rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 pr-12 text-[#0F172A] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                        >
                                            <option value="" disabled>
                                                What services are you interested in? *
                                            </option>
                                            {managementInterestOptions.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <select
                                            required
                                            aria-label={`Currently Listed ${index + 1}`}
                                            value={property.currentlyListed}
                                            onChange={(e) => updateProperty(property.id, 'currentlyListed', e.target.value)}
                                            className="w-full appearance-none rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 pr-12 text-[#0F172A] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                        >
                                            <option value="" disabled>
                                                Is this property currently listed? *
                                            </option>
                                            <option value="yes-airbnb">Yes, on Airbnb</option>
                                            <option value="yes-vrbo">Yes, on VRBO</option>
                                            <option value="yes-multiple">Yes, on multiple platforms</option>
                                            <option value="no">No, not yet listed</option>
                                        </select>
                                        <div className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-emerald-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>

                                    <textarea
                                        rows={3}
                                        aria-label={`Listing Links ${index + 1}`}
                                        placeholder="Property listing links or additional details (optional)"
                                        value={property.listingLinks}
                                        onChange={(e) => updateProperty(property.id, 'listingLinks', e.target.value)}
                                        className="w-full resize-none rounded-2xl border border-emerald-200 bg-white px-5 py-3.5 text-[#0F172A] placeholder:text-[#94A3B8] focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-100 transition-all"
                                    />
                                </div>
                            ))}
                        </div>

                        {error && (
                            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600" role="alert">
                                {error}
                            </p>
                        )}

                        <div className="pt-2">
                            <Button 
                                type="submit" 
                                variant="primary" 
                                size="lg" 
                                className="w-full py-4 text-base font-semibold"
                                disabled={status === 'loading'}
                            >
                                {status === 'loading' ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                ) : (
                                    'Get Your Free Property Assessment'
                                )}
                            </Button>
                            <p className="mt-4 text-center text-xs uppercase tracking-[0.4em] text-[#A2A6B3]">
                                Response within 24 hours • No obligation
                            </p>
                        </div>
            </form>
        </div>
    );
}
