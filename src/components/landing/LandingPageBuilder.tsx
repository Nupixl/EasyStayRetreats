'use client';

import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    closestCenter,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    SortableContext,
    arrayMove,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { ReferralForm } from '@/components/referral/ReferralForm';

type SectionType = 'hero' | 'benefits' | 'testimonial' | 'form' | 'feature';

interface HeroSectionData {
    headline: string;
    subheadline: string;
    ctaText: string;
    backgroundImage: string;
    backgroundColor: string;
    backgroundType?: 'color' | 'image';
}

interface BenefitCard {
    title: string;
    body: string;
    icon: string;
}

interface BenefitsSectionData {
    cards: BenefitCard[];
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundType?: 'color' | 'image';
}

interface TestimonialSectionData {
    quote: string;
    author: string;
    accentColor: string;
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundType?: 'color' | 'image';
}

interface FormSectionData {
    headline: string;
    subheadline: string;
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundType?: 'color' | 'image';
    companySource?: string; // Track which company/brand this form is for
}

interface FeatureSectionData {
    title: string;
    description: string;
    imageUrl: string;
    imagePosition: 'left' | 'right';
    backgroundImage?: string;
    backgroundColor?: string;
    backgroundType?: 'color' | 'image';
}

type SectionCard =
    | { id: string; type: 'hero'; data: HeroSectionData }
    | { id: string; type: 'benefits'; data: BenefitsSectionData }
    | { id: string; type: 'testimonial'; data: TestimonialSectionData }
    | { id: string; type: 'form'; data: FormSectionData }
    | { id: string; type: 'feature'; data: FeatureSectionData };

export type { SectionCard };

interface LandingPageBuilderProps {
    link: {
        id: string;
        name: string;
        slug: string;
    };
    initialSections: SectionCard[];
    isPublished: boolean;
    onNavigateBack?: () => void;
}

const generateId = () => (typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).slice(2));

const createDefaultSection = (type: SectionType): SectionCard => {
    switch (type) {
        case 'hero':
            return {
                id: generateId(),
                type,
                data: {
                    headline: 'Unlock Your Property&apos;s Full Potential',
                    subheadline: 'Experience increased bookings with our expert services. We handle everything from professional photography to dynamic pricing strategies.',
                    ctaText: 'SEE HOW',
                    backgroundImage: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80',
                    backgroundColor: '#1e3a5f',
                    backgroundType: 'image',
                },
            };
        case 'benefits':
            return {
                id: generateId(),
                type,
                data: {
                    cards: [
                        {
                            title: 'Higher RevPAR',
                            body: 'Optimized pricing and demand forecasting tuned to your region.',
                            icon: '📈',
                        },
                        {
                            title: 'Concierge service',
                            body: '24/7 guest support plus cleaning coordination so you can stay hands-off.',
                            icon: '🤝',
                        },
                        {
                            title: 'Transparent ops',
                            body: 'Weekly performance reports with actionable recommendations.',
                            icon: '🧭',
                        },
                    ],
                    backgroundImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                    backgroundColor: '#ffffff',
                    backgroundType: 'image',
                },
            };
        case 'testimonial':
            return {
                id: generateId(),
                type,
                data: {
                    quote: '"EasyStay transformed three listings into my most profitable assets. The team feels like an extension of my own."',
                    author: 'Ava Martinez',
                    accentColor: '#a855f7',
                    backgroundImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1400&q=80',
                    backgroundColor: '#1e3a5f',
                    backgroundType: 'image',
                },
            };
        case 'form':
            return {
                id: generateId(),
                type,
                data: {
                    headline: 'Ready to grow?',
                    subheadline: 'Share some quick details and our specialists will reach out within 24 hours.',
                    backgroundImage: '',
                    backgroundColor: '#f8fafc',
                    backgroundType: 'image',
                    companySource: 'EasyStay',
                },
            };
        case 'feature':
            return {
                id: generateId(),
                type,
                data: {
                    title: 'Why Guests Choose Easy Stay',
                    description: 'Book confidently. Every home is professionally prepared, easy to access, and supported 24/7—so your trip stays simple from search to checkout.',
                    imageUrl: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
                    imagePosition: 'left',
                    backgroundType: 'color',
                    backgroundColor: '#ffffff',
                    backgroundImage: '',
                },
            };
        default:
            // Fallback to hero section if unknown type
            return {
                id: generateId(),
                type: 'hero',
                data: {
                    headline: 'Unlock Your Property&apos;s Full Potential',
                    subheadline: 'Experience increased bookings with our expert services.',
                    ctaText: 'SEE HOW',
                    backgroundImage: '',
                    backgroundColor: '#1e3a5f',
                    backgroundType: 'color',
                },
            };
    }
};

const getDefaultSections = (): SectionCard[] => [
    createDefaultSection('hero') as SectionCard,
    createDefaultSection('benefits') as SectionCard,
    createDefaultSection('feature') as SectionCard,
    createDefaultSection('form') as SectionCard,
    createDefaultSection('testimonial') as SectionCard,
];

function SectionListItem({
    section,
    isActive,
    onSelect,
    onRemove,
    onUpdate,
    onCardUpdate,
    theme,
}: {
    section: SectionCard;
    isActive: boolean;
    onSelect: () => void;
    onRemove: () => void;
    onUpdate: (updates: SectionCard['data']) => void;
    onCardUpdate: (cardIndex: number, field: keyof BenefitCard, value: string) => void;
    theme: 'dark' | 'light';
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const cardRef = useRef<HTMLDivElement>(null);
    
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: section.id,
    });

    // Scroll the active card into view when it becomes active
    useEffect(() => {
        if (isActive && cardRef.current) {
            cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [isActive]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 50 : 'auto',
    };

    const labelMap: Record<SectionType, string> = {
        hero: 'Hero',
        benefits: 'Benefits',
        testimonial: 'Testimonial',
        form: 'Referral form',
        feature: 'Feature',
    };

    return (
        <div
            ref={(node) => {
                setNodeRef(node);
                (cardRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            }}
            style={style}
            className={`rounded-2xl border text-sm transition-all ${
                isActive 
                    ? theme === 'dark'
                        ? 'border-[#667eea] bg-[#334155] shadow-lg'
                        : 'border-[#667eea] bg-indigo-50 shadow-lg'
                    : theme === 'dark'
                        ? 'border-[#334155] bg-[#1e293b]'
                        : 'border-[#e5e7eb] bg-white'
            } ${isDragging ? 'shadow-2xl scale-105' : 'hover:shadow-md'}`}
        >
            <div className="flex items-center justify-between px-3 py-3">
                <div className="flex flex-1 items-center gap-2">
                    <button
                        type="button"
                        {...attributes}
                        {...listeners}
                        className={`flex h-8 w-8 cursor-grab items-center justify-center rounded-lg text-lg transition-all active:cursor-grabbing ${
                            theme === 'dark'
                                ? 'text-[#94a3b8] hover:bg-[#475569] hover:text-white active:bg-[#64748b]'
                                : 'text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#475569] active:bg-[#e2e8f0]'
                        }`}
                        aria-label="Drag to reorder"
                    >
                        ⋮⋮
                    </button>
                    {isActive ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsExpanded(!isExpanded);
                            }}
                            className={`flex h-8 w-8 items-center justify-center transition-all ${
                                theme === 'dark'
                                    ? 'text-[#94a3b8] hover:text-white'
                                    : 'text-[#94a3b8] hover:text-[#475569]'
                            }`}
                            aria-label={isExpanded ? 'Collapse' : 'Expand'}
                            title={isExpanded ? 'Collapse' : 'Expand'}
                        >
                            <span className={`text-base transition-transform ${isExpanded ? 'rotate-90' : ''}`}>▶</span>
                        </button>
                    ) : (
                        <button 
                            type="button" 
                            onClick={onSelect} 
                            className={`flex h-8 w-8 items-center justify-center transition-all ${
                                theme === 'dark'
                                    ? 'text-[#94a3b8] hover:text-white'
                                    : 'text-[#94a3b8] hover:text-[#475569]'
                            }`}
                        >
                            <span className="text-base">▶</span>
                        </button>
                    )}
                    <button 
                        type="button" 
                        onClick={onSelect} 
                        className="flex-1 text-left"
                    >
                        <span className={`block text-xs uppercase tracking-[0.3em] ${
                            theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'
                        }`}>
                            {labelMap[section.type]}
                        </span>
                    </button>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        onRemove();
                    }}
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all ${
                        theme === 'dark'
                            ? 'text-[#94a3b8] hover:bg-[#7f1d1d] hover:text-[#fca5a5]'
                            : 'text-[#94a3b8] hover:bg-[#fef2f2] hover:text-[#ef4444]'
                    }`}
                    aria-label="Remove section"
                    title="Remove"
                >
                    <span className="text-xl">×</span>
                </button>
            </div>
            
            {isActive && isExpanded && (
                <div className={`border-t px-3 py-4 ${
                    theme === 'dark' ? 'border-[#475569]' : 'border-[#e5e7eb]'
                }`}>
                    <SectionInspector
                        section={section}
                        onUpdate={onUpdate}
                        onCardUpdate={onCardUpdate}
                        theme={theme}
                    />
                </div>
            )}
        </div>
    );
}

function BackgroundSelector({
    backgroundType,
    backgroundColor,
    backgroundImage,
    onUpdate,
    onReset,
    theme,
}: {
    backgroundType: 'color' | 'image';
    backgroundColor: string;
    backgroundImage: string;
    onUpdate: (updates: { backgroundType?: 'color' | 'image'; backgroundColor?: string; backgroundImage?: string }) => void;
    onReset: () => void;
    theme: 'dark' | 'light';
}) {
    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // For now, create a data URL. In production, upload to storage service
        const reader = new FileReader();
        reader.onloadend = () => {
            onUpdate({ backgroundImage: reader.result as string });
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className={`space-y-3 rounded-2xl border px-3 py-3 ${
            theme === 'dark'
                ? 'border-[#475569] bg-[#1e293b]'
                : 'border-[#e5e7eb] bg-white'
        }`}>
            <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
            }`}>Background</p>
            
            {/* Background Type Selector */}
            <div className="flex gap-2">
                <button
                    type="button"
                    onClick={() => onUpdate({ backgroundType: 'color' })}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                        backgroundType === 'color'
                            ? 'bg-[#667eea] text-white'
                            : theme === 'dark'
                                ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569] hover:text-white'
                                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                >
                    Color
                </button>
                <button
                    type="button"
                    onClick={() => onUpdate({ backgroundType: 'image' })}
                    className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                        backgroundType === 'image'
                            ? 'bg-[#667eea] text-white'
                            : theme === 'dark'
                                ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569] hover:text-white'
                                : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                    }`}
                >
                    Image
                </button>
            </div>

            {/* Color Picker */}
            {backgroundType === 'color' && (
                <div className="space-y-1">
                    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                        theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
                    }`}>Color</p>
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        className={`h-10 w-full rounded-xl border cursor-pointer ${
                            theme === 'dark'
                                ? 'border-[#475569] bg-[#334155]'
                                : 'border-[#d1d5db]'
                        }`}
                    />
                    <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
                        className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-[#667eea] focus:outline-none ${
                            theme === 'dark'
                                ? 'border-[#475569] bg-[#334155] text-white'
                                : 'border-[#d1d5db] text-[#0f172a]'
                        }`}
                        placeholder="#000000"
                    />
                </div>
            )}

            {/* Image Upload */}
            {backgroundType === 'image' && (
                <div className="space-y-1">
                    <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                        theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
                    }`}>Upload Image</p>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className={`w-full rounded-xl border px-3 py-2 text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-[#667eea] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white hover:file:bg-[#5568d3] focus:border-[#667eea] focus:outline-none ${
                            theme === 'dark'
                                ? 'border-[#475569] bg-[#334155] text-white'
                                : 'border-[#d1d5db] text-[#0f172a]'
                        }`}
                    />
                    {backgroundImage && (
                        <div className="space-y-2">
                            <div className={`relative mt-2 h-20 w-full overflow-hidden rounded-lg border ${
                                theme === 'dark' ? 'border-[#475569]' : 'border-[#e5e7eb]'
                            }`}>
                                <Image src={backgroundImage} alt="Background preview" fill className="object-cover" />
                            </div>
                            <button
                                type="button"
                                onClick={onReset}
                                className={`w-full rounded-lg border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                                    theme === 'dark'
                                        ? 'border-[#dc2626] bg-[#7f1d1d] text-[#fca5a5] hover:bg-[#991b1b]'
                                        : 'border-[#ef4444] bg-[#fef2f2] text-[#ef4444] hover:bg-[#fee2e2]'
                                }`}
                            >
                                Reset to Template
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

function SectionInspector({
    section,
    onUpdate,
    onCardUpdate,
    theme,
}: {
    section: SectionCard;
    onUpdate: (updates: SectionCard['data']) => void;
    onCardUpdate: (cardIndex: number, field: keyof BenefitCard, value: string) => void;
    theme: 'dark' | 'light';
}) {
    switch (section.type) {
        case 'hero':
            return (
                <div className="space-y-3">
                    <InputField label="Headline" value={section.data.headline} onChange={(value) => onUpdate({ ...section.data, headline: value })} theme={theme} />
                    <InputField label="Subheadline" value={section.data.subheadline} onChange={(value) => onUpdate({ ...section.data, subheadline: value })} theme={theme} />
                    <InputField label="CTA text" value={section.data.ctaText} onChange={(value) => onUpdate({ ...section.data, ctaText: value })} theme={theme} />
                    <BackgroundSelector
                        backgroundType={section.data.backgroundType || 'image'}
                        backgroundColor={section.data.backgroundColor}
                        backgroundImage={section.data.backgroundImage}
                        onUpdate={(updates) => onUpdate({ ...section.data, ...updates })}
                        onReset={() => onUpdate(createDefaultSection('hero').data as HeroSectionData)}
                        theme={theme}
                    />
                </div>
            );
        case 'benefits':
            return (
                <div className="space-y-3">
                    {section.data.cards.map((card, index) => (
                        <div key={index} className={`space-y-2 rounded-2xl border px-3 py-3 text-xs uppercase tracking-[0.3em] ${
                            theme === 'dark'
                                ? 'border-[#475569] bg-[#1e293b] text-white'
                                : 'border-[#e5e7eb] bg-white text-[#94a3b8]'
                        }`}>
                            <span>Card {index + 1}</span>
                            <InputField label="Title" value={card.title} onChange={(value) => onCardUpdate(index, 'title', value)} theme={theme} />
                            <InputField label="Body" value={card.body} onChange={(value) => onCardUpdate(index, 'body', value)} theme={theme} />
                            <InputField label="Icon" value={card.icon} onChange={(value) => onCardUpdate(index, 'icon', value)} theme={theme} />
                        </div>
                    ))}
                    <BackgroundSelector
                        backgroundType={section.data.backgroundType || 'image'}
                        backgroundColor={section.data.backgroundColor || '#ffffff'}
                        backgroundImage={section.data.backgroundImage || ''}
                        onUpdate={(updates) => onUpdate({ ...section.data, ...updates })}
                        onReset={() => onUpdate(createDefaultSection('benefits').data as BenefitsSectionData)}
                        theme={theme}
                    />
                </div>
            );
        case 'testimonial':
            return (
                <div className="space-y-3">
                    <TextareaField label="Quote" value={section.data.quote} onChange={(value) => onUpdate({ ...section.data, quote: value })} theme={theme} />
                    <InputField label="Author" value={section.data.author} onChange={(value) => onUpdate({ ...section.data, author: value })} theme={theme} />
                    <BackgroundSelector
                        backgroundType={section.data.backgroundType || 'image'}
                        backgroundColor={section.data.backgroundColor || '#1e3a5f'}
                        backgroundImage={section.data.backgroundImage || ''}
                        onUpdate={(updates) => onUpdate({ ...section.data, ...updates })}
                        onReset={() => onUpdate(createDefaultSection('testimonial').data as TestimonialSectionData)}
                        theme={theme}
                    />
                </div>
            );
        case 'form':
            return (
                <div className="space-y-3">
                    <InputField label="Headline" value={section.data.headline} onChange={(value) => onUpdate({ ...section.data, headline: value })} theme={theme} />
                    <InputField label="Subheadline" value={section.data.subheadline} onChange={(value) => onUpdate({ ...section.data, subheadline: value })} theme={theme} />
                    <InputField 
                        label="Company Source" 
                        value={section.data.companySource || 'EasyStay'} 
                        onChange={(value) => onUpdate({ ...section.data, companySource: value })}
                        theme={theme}
                    />
                    <p className={`text-[10px] italic ${
                        theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'
                    }`}>
                        Hidden field to track which company/brand this form is for (e.g., EasyStay, PartnerCo)
                    </p>
                    <BackgroundSelector
                        backgroundType={section.data.backgroundType || 'image'}
                        backgroundColor={section.data.backgroundColor || '#f8fafc'}
                        backgroundImage={section.data.backgroundImage || ''}
                        onUpdate={(updates) => onUpdate({ ...section.data, ...updates })}
                        onReset={() => onUpdate(createDefaultSection('form').data as FormSectionData)}
                        theme={theme}
                    />
                </div>
            );
        case 'feature':
            return (
                <div className="space-y-3">
                    <InputField label="Title" value={section.data.title} onChange={(value) => onUpdate({ ...section.data, title: value })} theme={theme} />
                    <TextareaField label="Description" value={section.data.description} onChange={(value) => onUpdate({ ...section.data, description: value })} theme={theme} />
                    <InputField label="Image URL" value={section.data.imageUrl} onChange={(value) => onUpdate({ ...section.data, imageUrl: value })} theme={theme} />
                    <div className="space-y-1">
                        <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${
                            theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
                        }`}>Image Position</p>
                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={() => onUpdate({ ...section.data, imagePosition: 'left' })}
                                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                                    section.data.imagePosition === 'left'
                                        ? 'bg-[#667eea] text-white'
                                        : theme === 'dark'
                                            ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569] hover:text-white'
                                            : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                                }`}
                            >
                                Left
                            </button>
                            <button
                                type="button"
                                onClick={() => onUpdate({ ...section.data, imagePosition: 'right' })}
                                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition-all ${
                                    section.data.imagePosition === 'right'
                                        ? 'bg-[#667eea] text-white'
                                        : theme === 'dark'
                                            ? 'bg-[#334155] text-[#94a3b8] hover:bg-[#475569] hover:text-white'
                                            : 'bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]'
                                }`}
                            >
                                Right
                            </button>
                        </div>
                    </div>
                    <BackgroundSelector
                        backgroundType={section.data.backgroundType || 'color'}
                        backgroundColor={section.data.backgroundColor || '#ffffff'}
                        backgroundImage={section.data.backgroundImage || ''}
                        onUpdate={(updates) => onUpdate({ ...section.data, ...updates })}
                        onReset={() => onUpdate(createDefaultSection('feature').data as FeatureSectionData)}
                        theme={theme}
                    />
                </div>
            );
        default:
            return null;
    }
}

function InputField({
    label,
    value,
    onChange,
    theme,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    theme: 'dark' | 'light';
}) {
    return (
        <div className={`space-y-1 text-xs font-semibold uppercase tracking-[0.3em] ${
            theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
        }`}>
            <p>{label}</p>
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-[#667eea] focus:outline-none ${
                    theme === 'dark'
                        ? 'border-[#475569] bg-[#334155] text-white placeholder-[#94a3b8]'
                        : 'border-[#d1d5db] bg-white text-[#0f172a]'
                }`}
            />
        </div>
    );
}

function TextareaField({
    label,
    value,
    onChange,
    theme,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
    theme: 'dark' | 'light';
}) {
    return (
        <div className={`space-y-1 text-xs font-semibold uppercase tracking-[0.3em] ${
            theme === 'dark' ? 'text-white' : 'text-[#94a3b8]'
        }`}>
            <p>{label}</p>
            <textarea
                rows={3}
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className={`w-full rounded-xl border px-3 py-2 text-sm focus:border-[#667eea] focus:outline-none ${
                    theme === 'dark'
                        ? 'border-[#475569] bg-[#334155] text-white placeholder-[#94a3b8]'
                        : 'border-[#d1d5db] bg-white text-[#0f172a]'
                }`}
            />
        </div>
    );
}

function LandingPreview({
    sections,
    link,
    activeSectionId,
    previewMode = 'desktop',
}: {
    sections: SectionCard[];
    link: { id: string; name: string; slug: string };
    activeSectionId?: string;
    previewMode?: 'desktop' | 'mobile';
}) {
    const [isFormVisible, setIsFormVisible] = useState(false);
    
    // Find first form section - all buttons should link to it
    const formSection = sections.find(s => s.type === 'form');
    const formLink = formSection ? `#form-${formSection.id}` : '#';
    
    const heroSection = sections.find(s => s.type === 'hero');
    
    // Determine CTA button text
    const mobileCTAText = heroSection?.data.ctaText || 'Get Started';
    
    // Smooth scroll to form
    const scrollToForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        if (!formSection) return;
        
        const formElement = document.getElementById(`preview-section-${formSection.id}`);
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    
    // Scroll to active section when it changes
    useEffect(() => {
        if (!activeSectionId) return;
        
        const sectionElement = document.getElementById(`preview-section-${activeSectionId}`);
        if (sectionElement) {
            // Use 'start' to scroll section to top of its scroll container
            // This keeps the sidebar visible since it's in a separate container
            sectionElement.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
        }
    }, [activeSectionId]);
    
    // Observe form visibility
    useEffect(() => {
        if (!formSection) return;
        
        const formElement = document.getElementById(`preview-section-${formSection.id}`);
        if (!formElement) return;
        
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsFormVisible(entry.isIntersecting);
            },
            { threshold: 0.1 }
        );
        
        observer.observe(formElement);
        return () => observer.disconnect();
    }, [formSection]);
    
    return (
        <div className="relative space-y-6 pb-24 sm:pb-0 md:space-y-8">
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
                                id={`preview-section-${section.id}`}
                                className="relative overflow-hidden rounded-lg shadow-2xl"
                                style={{
                                    minHeight: '400px',
                                }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
                                            ? `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${section.data.backgroundImage})`
                                            : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: section.data.backgroundType === 'color' ? section.data.backgroundColor : (section.data.backgroundColor || '#0f172a'),
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
                                            onClick={scrollToForm}
                                            className="max-sm:hidden inline-flex rounded-md bg-[#5a8f7b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#4a7f6b] sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
                                        >
                                            {section.data.ctaText}
                                        </a>
                                    )}
                                </div>
                            </div>
                        );
                    case 'benefits':
                        return (
                            <div key={section.id} id={`preview-section-${section.id}`} className="overflow-hidden rounded-lg shadow-lg" style={{ backgroundColor: section.data.backgroundType === 'color' ? section.data.backgroundColor : '#ffffff' }}>
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
                                                onClick={scrollToForm}
                                                className="max-sm:hidden inline-flex rounded-md bg-[#5a8f7b] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-white transition-all hover:bg-[#4a7f6b] sm:px-6 sm:py-3 sm:text-sm sm:tracking-[0.2em]"
                                            >
                                                CONTACT US
                                            </a>
                                        </div>
                                    </div>
                                    <div className="order-1 relative min-h-[250px] bg-gray-200 sm:min-h-[300px] md:order-2 md:min-h-[400px]">
                                        {((section.data.backgroundType === 'image' || !section.data.backgroundType) && section.data.backgroundImage) && (
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
                                id={`preview-section-${section.id}`}
                                className="relative overflow-hidden rounded-lg shadow-2xl"
                                style={{
                                    minHeight: '350px',
                                }}
                            >
                                <div
                                    className="absolute inset-0"
                                    style={{
                                        backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
                                            ? `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${section.data.backgroundImage})`
                                            : undefined,
                                        backgroundSize: 'cover',
                                        backgroundPosition: 'center',
                                        backgroundColor: section.data.backgroundType === 'color' ? section.data.backgroundColor : (section.data.backgroundColor || '#1e3a5f'),
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
                                        onClick={scrollToForm}
                                        className="max-sm:hidden inline-flex rounded-md bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-[0.1em] text-[#1f2937] transition-all hover:bg-gray-100 sm:px-8 sm:py-4 sm:text-sm sm:tracking-[0.2em]"
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
                                id={`preview-section-${section.id}`}
                                className="overflow-hidden rounded-lg shadow-lg"
                                style={{
                                    backgroundColor: section.data.backgroundType === 'color' ? section.data.backgroundColor : '#f8fafc',
                                    backgroundImage: (section.data.backgroundType === 'image' && section.data.backgroundImage)
                                        ? `url(${section.data.backgroundImage})`
                                        : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <section className="c-referral-form bg-gradient-to-b from-[#F5F3FF] to-white px-4 py-12" style={{ width: '100%' }}>
                                    <div className="mx-auto max-w-6xl">
                                        <ReferralForm
                                            linkId={link.id}
                                            headline={section.data.headline}
                                            subheadline={section.data.subheadline}
                                            companySource={section.data.companySource || 'EasyStay'}
                                        />
                                    </div>
                                </section>
                            </div>
                        );
                    case 'feature':
                        return (
                            <section
                                key={section.id}
                                id={`preview-section-${section.id}`}
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
                                    <div className={`flex flex-nowrap gap-8 ${
                                        previewMode === 'mobile' 
                                            ? 'flex-col' 
                                            : 'flex-col lg:flex-row lg:items-center lg:gap-12'
                                    } ${previewMode === 'desktop' && section.data.imagePosition === 'right' ? 'lg:flex-row-reverse' : ''}`}>
                                        {/* Image Column */}
                                        <div className={`w-full ${previewMode === 'desktop' ? 'lg:flex-1' : ''}`}>
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
                                        <div className={`w-full space-y-4 ${previewMode === 'desktop' ? 'lg:flex-1' : ''}`}>
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
                                                onClick={scrollToForm}
                                                className="max-sm:hidden inline-flex rounded-md bg-[#5a8f7b] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all hover:bg-[#4a7f6b]"
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
            
            {/* Mobile Sticky CTA Button - Hidden when form is visible */}
            {!isFormVisible && (
                <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)] p-4 transition-transform duration-300">
                    <a
                        href={formLink}
                        onClick={scrollToForm}
                        className="flex w-full items-center justify-center rounded-full bg-[#5a8f7b] px-8 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-lg transition-all hover:bg-[#4a7f6b] active:scale-95"
                    >
                        {mobileCTAText}
                    </a>
                </div>
            )}
        </div>
    );
}

export function LandingPageBuilder({ link, initialSections, onNavigateBack }: LandingPageBuilderProps) {
    const resolvedInitialSections: SectionCard[] =
        initialSections && initialSections.length > 0
            ? (initialSections.map((section) => ({
                  ...section,
                  id: section.id ?? generateId(),
                  data: { ...section.data },
              })) as SectionCard[])
            : getDefaultSections();
    const [sections, setSections] = useState<SectionCard[]>(resolvedInitialSections);
    const [activeSectionId, setActiveSectionId] = useState<string>(() => sections[0]?.id ?? '');
    const [activeId, setActiveId] = useState<string | null>(null);
    const [savingState, setSavingState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [showComponentLibrary, setShowComponentLibrary] = useState(false);
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const hasFormSection = useMemo(() => sections.some((section) => section.type === 'form'), [sections]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: undefined,
        })
    );

    useEffect(() => {
        if (!toastMessage) return;
        const timer = setTimeout(() => setToastMessage(null), 3500);
        return () => clearTimeout(timer);
    }, [toastMessage]);

    useEffect(() => {
        if (!sections.length) {
            setActiveSectionId('');
            return;
        }

        if (!sections.find((section) => section.id === activeSectionId)) {
            setActiveSectionId(sections[0].id);
        }
    }, [sections, activeSectionId]);

    const handleDragStart = (event: { active: { id: string | number } }) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        
        setActiveId(null);
        
        if (over && active.id !== over.id) {
            setSections((prev) => {
                const oldIndex = prev.findIndex((section) => section.id === active.id);
                const newIndex = prev.findIndex((section) => section.id === over.id);
                return arrayMove(prev, oldIndex, newIndex);
            });
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    const updateSection = (id: string, updates: SectionCard['data']) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id === id) {
                    return { ...section, data: updates } as SectionCard;
                }
                return section;
            })
        );
    };

    const updateBenefitCard = (sectionId: string, cardIndex: number, field: keyof BenefitCard, value: string) => {
        setSections((prev) =>
            prev.map((section) => {
                if (section.id !== sectionId || section.type !== 'benefits') return section;
                const cards = section.data.cards ?? [];
                const nextCards = cards.map((card: BenefitCard, index: number) =>
                    index === cardIndex ? { ...card, [field]: value } : card
                );
                return { ...section, data: { ...section.data, cards: nextCards } } as SectionCard;
            })
        );
    };

    const removeSection = (id: string) => {
        const target = sections.find((section) => section.id === id);
        if (!target) return;

        // Form sections are mandatory and cannot be deleted
        if (target.type === 'form') {
            setToastMessage('The referral form is mandatory and cannot be removed.');
            return;
        }

        setSections((prev) => prev.filter((section) => section.id !== id));
    };

    const addSection = (type: SectionType) => {
        setSections((prev) => [...prev, createDefaultSection(type)]);
    };

    const handleSave = async (publish: boolean) => {
        setSavingState('saving');
        try {
            const response = await fetch('/api/landing-pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    linkId: link.id,
                    sections,
                    publish,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
                throw new Error(errorData.error || 'Unable to save layout.');
            }

            setSavingState('saved');
            setTimeout(() => setSavingState('idle'), 2500);
        } catch (error) {
            setSavingState('error');
            console.error('Save error:', error);
            setTimeout(() => setSavingState('idle'), 2500);
        }
    };

    const canPublish = hasFormSection;

    return (
        <div className={`flex min-h-screen transition-colors ${theme === 'dark' ? 'bg-[#0f172a]' : 'bg-[#f4f6fb]'}`}>
            <aside className={`sticky top-0 flex h-screen w-72 flex-col border-r px-4 py-6 transition-colors ${
                theme === 'dark' 
                    ? 'border-[#1e293b] bg-[#1e293b]' 
                    : 'border-[#e5e7eb] bg-white'
            }`}>
                {/* Header Section */}
                <div className={`space-y-3 pb-4 border-b ${
                    theme === 'dark' ? 'border-[#334155]' : 'border-[#e5e7eb]'
                }`}>
                    <div>
                        <p className={`text-xs uppercase tracking-[0.3em] ${
                            theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'
                        }`}>Landing editor</p>
                        <h1 className={`text-lg font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
                        }`}>
                            {link.name}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {onNavigateBack && (
                            <button
                                type="button"
                                onClick={onNavigateBack}
                                className={`flex-1 rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] transition ${
                                    theme === 'dark'
                                        ? 'border-[#475569] text-[#94a3b8] hover:border-[#667eea] hover:text-white'
                                        : 'border-[#CBD5F5] text-[#475569] hover:border-[#667eea] hover:text-[#0f172a]'
                                }`}
                            >
                                ← Back
                            </button>
                        )}
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
                    </div>
                </div>

                {/* Blocks Section */}
                <div className="flex items-center justify-between mt-4">
                    <p className={`text-xs uppercase tracking-[0.4em] ${theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'}`}>Blocks</p>
                    <button
                        type="button"
                        onClick={() => setActiveSectionId(sections[0]?.id ?? '')}
                        className={`text-xs font-semibold uppercase tracking-[0.4em] ${
                            theme === 'dark' ? 'text-[#94a3b8] hover:text-white' : 'text-[#94a3b8] hover:text-[#475569]'
                        }`}
                    >
                        Reset
                    </button>
                </div>
                <button
                    type="button"
                    onClick={() => setShowComponentLibrary(true)}
                    className={`mt-4 w-full rounded-xl border border-dashed px-3 py-2 text-xs font-semibold uppercase tracking-[0.4em] transition-all ${
                        theme === 'dark'
                            ? 'border-[#475569] text-[#94a3b8] hover:border-[#667eea] hover:bg-[#334155]'
                            : 'border-[#cbd5f5] text-[#475569] hover:border-[#667eea] hover:bg-[#f8fafc]'
                    }`}
                >
                    + Add component
                </button>
                <div className="mt-4 flex-1 space-y-3 overflow-y-auto">
                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDragCancel={handleDragCancel}
                    >
                        <SortableContext
                            items={sections.map((section) => section.id)}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className="space-y-2">
                                {sections.map((section) => (
                                    <SectionListItem
                                        key={section.id}
                                        section={section}
                                        isActive={activeSectionId === section.id}
                                        onSelect={() => setActiveSectionId(section.id === activeSectionId ? '' : section.id)}
                                        onRemove={() => removeSection(section.id)}
                                        onUpdate={(updates) => updateSection(section.id, updates)}
                                        onCardUpdate={(index, field, value) => updateBenefitCard(section.id, index, field, value)}
                                        theme={theme}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                        <DragOverlay>
                            {activeId ? (
                                <div className="rounded-2xl border-2 border-[#667eea] bg-indigo-50 p-3 shadow-2xl">
                                    <span className="block text-xs font-semibold uppercase tracking-[0.3em] text-[#667eea]">
                                        {sections.find(s => s.id === activeId)?.type || 'Section'}
                                    </span>
                                </div>
                            ) : null}
                        </DragOverlay>
                    </DndContext>
                </div>
                {toastMessage && (
                    <div className={`mt-4 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                        theme === 'dark'
                            ? 'border-amber-700 bg-amber-900/30 text-amber-300'
                            : 'border-amber-200 bg-amber-50 text-amber-900'
                    }`}>
                        {toastMessage}
                    </div>
                )}
                {!hasFormSection && (
                    <p className={`mt-4 rounded-xl border px-3 py-2 text-xs font-semibold uppercase tracking-[0.3em] ${
                        theme === 'dark'
                            ? 'border-rose-700 bg-rose-900/30 text-rose-300'
                            : 'border-rose-200 bg-rose-50 text-rose-700'
                    }`}>
                        Form required before publishing.
                    </p>
                )}
            </aside>

            <main className="flex flex-1 flex-col">
                <div className={`flex items-center justify-between border-b px-6 py-4 transition-colors ${
                    theme === 'dark'
                        ? 'border-[#1e293b] bg-[#1e293b]'
                        : 'border-[#e5e7eb] bg-white'
                }`}>
                    <div>
                        <p className={`text-xs uppercase tracking-[0.4em] ${
                            theme === 'dark' ? 'text-[#94a3b8]' : 'text-[#94a3b8]'
                        }`}>Live preview</p>
                        <h2 className={`text-base font-semibold ${
                            theme === 'dark' ? 'text-white' : 'text-[#0f172a]'
                        }`}>{link.name}</h2>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className={`flex gap-2 rounded-full border p-1 ${
                            theme === 'dark'
                                ? 'border-[#334155] bg-[#1e293b]'
                                : 'border-[#E0E7FF] bg-white'
                        }`}>
                            {(['desktop', 'mobile'] as const).map((mode) => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setPreviewMode(mode)}
                                    className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.3em] transition ${
                                        previewMode === mode 
                                            ? theme === 'dark'
                                                ? 'bg-[#667eea] text-white'
                                                : 'bg-[#0f172a] text-white'
                                            : theme === 'dark'
                                                ? 'text-[#94a3b8] hover:text-white'
                                                : 'text-[#94a3b8]'
                                    }`}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => handleSave(true)}
                            disabled={!canPublish || savingState === 'saving'}
                            className={`rounded-full px-4 py-2 text-xs uppercase tracking-[0.3em] ${
                                canPublish
                                    ? theme === 'dark'
                                        ? 'bg-[#667eea] text-white enabled:hover:bg-[#5a67d8]'
                                        : 'bg-[#0f172a] text-white enabled:hover:bg-[#0d1a36]'
                                    : theme === 'dark'
                                        ? 'bg-[#64748b] text-white'
                                        : 'bg-[#a6adbc] text-white'
                            }`}
                        >
                            Publish
                        </button>
                    </div>
                </div>

                <div className={`flex-1 overflow-y-auto p-8 transition-colors ${
                    theme === 'dark' ? 'bg-[#0f172a] text-[#f4f7fa]' : 'bg-[#f5f5f5] text-[#0f172a]'
                }`}>
                    <div className={`transition-all duration-300 ${previewMode === 'mobile' ? 'mx-auto max-w-[440px]' : 'w-full'}`}>
                        <LandingPreview sections={sections} link={link} activeSectionId={activeSectionId} previewMode={previewMode} />
                    </div>
                </div>
            </main>

            {isPreviewOpen && (
                <div className="fixed inset-0 z-50 flex items-start justify-center overflow-auto bg-black/40 p-4">
                    <div className="relative w-full max-w-5xl overflow-hidden rounded-[3rem] bg-white">
                        <div className="flex items-center justify-between border-b border-[#E2E8F0] px-6 py-4">
                            <h2 className="text-lg font-bold text-[#0f172a]">Preview</h2>
                            <button
                                type="button"
                                onClick={() => setIsPreviewOpen(false)}
                                className="text-sm font-semibold uppercase tracking-[0.4em] text-[#a855f7]"
                            >
                                Close
                            </button>
                        </div>
                        <div className="space-y-8 p-6">
                            <LandingPreview sections={sections} link={link} activeSectionId={activeSectionId} previewMode={previewMode} />
                        </div>
                    </div>
                </div>
            )}

            {/* Component Library Overlay */}
            {showComponentLibrary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-8 py-6">
                            <div>
                                <h2 className="text-2xl font-bold text-[#0f172a]">Component Library</h2>
                                <p className="mt-1 text-sm text-[#64748b]">Choose a component to add to your page</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowComponentLibrary(false)}
                                className="flex h-10 w-10 items-center justify-center rounded-full text-[#64748b] transition-all hover:bg-[#f1f5f9] hover:text-[#0f172a]"
                            >
                                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 p-8 md:grid-cols-3">
                            {/* Hero Component */}
                            <button
                                type="button"
                                onClick={() => {
                                    addSection('hero');
                                    setShowComponentLibrary(false);
                                }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#e5e7eb] bg-white p-6 transition-all hover:border-[#667eea] hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#667eea] to-[#764ba2] text-3xl text-white shadow-lg">
                                    🎯
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#0f172a]">Hero</p>
                                    <p className="mt-1 text-xs text-[#64748b]">Large header section</p>
                                </div>
                            </button>

                            {/* Benefits Component */}
                            <button
                                type="button"
                                onClick={() => {
                                    addSection('benefits');
                                    setShowComponentLibrary(false);
                                }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#e5e7eb] bg-white p-6 transition-all hover:border-[#667eea] hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#f093fb] to-[#f5576c] text-3xl text-white shadow-lg">
                                    ⭐
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#0f172a]">Benefits</p>
                                    <p className="mt-1 text-xs text-[#64748b]">Feature showcase</p>
                                </div>
                            </button>

                            {/* Testimonial Component */}
                            <button
                                type="button"
                                onClick={() => {
                                    addSection('testimonial');
                                    setShowComponentLibrary(false);
                                }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#e5e7eb] bg-white p-6 transition-all hover:border-[#667eea] hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#4facfe] to-[#00f2fe] text-3xl text-white shadow-lg">
                                    💬
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#0f172a]">Testimonial</p>
                                    <p className="mt-1 text-xs text-[#64748b]">Customer quote</p>
                                </div>
                            </button>

                            {/* Form Component */}
                            <button
                                type="button"
                                onClick={() => {
                                    addSection('form');
                                    setShowComponentLibrary(false);
                                }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#e5e7eb] bg-white p-6 transition-all hover:border-[#667eea] hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#43e97b] to-[#38f9d7] text-3xl text-white shadow-lg">
                                    📝
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#0f172a]">Referral Form</p>
                                    <p className="mt-1 text-xs text-[#64748b]">Lead capture form</p>
                                </div>
                            </button>

                            {/* Feature Component */}
                            <button
                                type="button"
                                onClick={() => {
                                    addSection('feature');
                                    setShowComponentLibrary(false);
                                }}
                                className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-[#e5e7eb] bg-white p-6 transition-all hover:border-[#667eea] hover:shadow-lg"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-br from-[#fa709a] to-[#fee140] text-3xl text-white shadow-lg">
                                    🖼️
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-[#0f172a]">Feature</p>
                                    <p className="mt-1 text-xs text-[#64748b]">Two-column layout</p>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

