import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ABWrapper from '../components/ABWrapper';
import { analytics } from '../utils/analytics';
import { personalization } from '../utils/personalization';

// Mock the analytics and personalization modules
vi.mock('../utils/analytics', () => ({
  analytics: {
    track: vi.fn()
  }
}));

vi.mock('../utils/personalization', () => ({
  personalization: {
    getUserSegment: vi.fn()
  }
}));

describe('ABWrapper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock localStorage
    global.localStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn()
    };
  });

  it('renders children by default', () => {
    render(
      <ABWrapper testId="test-1">
        <div>Test Content</div>
      </ABWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders with loading state initially', () => {
    render(
      <ABWrapper testId="test-1">
        <div>Test Content</div>
      </ABWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('tracks A/B test assignment when initialized', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(analytics.track).toHaveBeenCalledWith('ab_test_assigned', expect.objectContaining({
        testId: 'test-1',
        userSegment: 'business_traveler'
      }));
    });
  });

  it('tracks user interaction when clicked', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <button>Click Me</button>
      </ABWrapper>
    );

    await waitFor(() => {
      const button = screen.getByText('Click Me');
      fireEvent.click(button);
    });

    expect(analytics.track).toHaveBeenCalledWith('ab_test_interaction', expect.objectContaining({
      testId: 'test-1',
      action: 'click'
    }));
  });

  it('renders variant content when provided', async () => {
    const variants = [
      <div key="variant-0">Variant A</div>,
      <div key="variant-1">Variant B</div>
    ];

    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" variants={variants}>
        <div>Default Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      // Should render one of the variants
      const variantA = screen.queryByText('Variant A');
      const variantB = screen.queryByText('Variant B');
      expect(variantA || variantB).toBeInTheDocument();
    });
  });

  it('renders function variants with correct props', async () => {
    const variants = [
      ({ variant, userSegment }) => <div>Variant A - {variant} - {userSegment}</div>,
      ({ variant, userSegment }) => <div>Variant B - {variant} - {userSegment}</div>
    ];

    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" variants={variants}>
        <div>Default Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      // Should render variant with props
      const variantContent = screen.getByText(/Variant [AB] - \d+ - business_traveler/);
      expect(variantContent).toBeInTheDocument();
    });
  });

  it('calls onVariantChange when variant is determined', async () => {
    const onVariantChange = vi.fn();
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" onVariantChange={onVariantChange}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(onVariantChange).toHaveBeenCalledWith(expect.any(Number));
    });
  });

  it('uses stored variant from localStorage', async () => {
    global.localStorage.getItem.mockReturnValue('1');
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    const variants = [
      <div key="variant-0">Variant A</div>,
      <div key="variant-1">Variant B</div>
    ];

    render(
      <ABWrapper testId="test-1" variants={variants}>
        <div>Default Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Variant B')).toBeInTheDocument();
    });
  });

  it('handles initialization errors gracefully', async () => {
    personalization.getUserSegment.mockRejectedValue(new Error('API Error'));
    
    render(
      <ABWrapper testId="test-1" defaultVariant={1}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('applies correct CSS classes based on variant', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" className="custom-class">
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      const wrapper = screen.getByText('Test Content').closest('.ab-wrapper');
      expect(wrapper).toHaveClass('ab-wrapper', 'custom-class');
      expect(wrapper).toHaveClass(/ab-wrapper--variant-\d+/);
    });
  });

  it('sets correct data attributes', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1">
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      const wrapper = screen.getByText('Test Content').closest('.ab-wrapper');
      expect(wrapper).toHaveAttribute('data-test-id', 'test-1');
      expect(wrapper).toHaveAttribute('data-variant');
      expect(wrapper).toHaveAttribute('data-user-segment', 'business_traveler');
    });
  });
});
