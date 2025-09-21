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

describe('ABWrapper Logging', () => {
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

  it('logs A/B test assignment with correct data structure', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(analytics.track).toHaveBeenCalledWith('ab_test_assigned', {
        testId: 'test-1',
        variant: expect.any(Number),
        userSegment: 'business_traveler',
        timestamp: expect.any(String)
      });
    });
  });

  it('logs user interaction with detailed event data', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <button data-testid="test-button">Click Me</button>
      </ABWrapper>
    );

    await waitFor(() => {
      const button = screen.getByTestId('test-button');
      fireEvent.click(button);
    });

    expect(analytics.track).toHaveBeenCalledWith('ab_test_interaction', {
      testId: 'test-1',
      variant: expect.any(Number),
      action: 'click',
      element: 'BUTTON',
      timestamp: expect.any(String)
    });
  });

  it('logs multiple interactions correctly', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>
          <button data-testid="button-1">Button 1</button>
          <button data-testid="button-2">Button 2</button>
          <a href="#" data-testid="link-1">Link 1</a>
        </div>
      </ABWrapper>
    );

    await waitFor(() => {
      const button1 = screen.getByTestId('button-1');
      const button2 = screen.getByTestId('button-2');
      const link1 = screen.getByTestId('link-1');

      fireEvent.click(button1);
      fireEvent.click(button2);
      fireEvent.click(link1);
    });

    expect(analytics.track).toHaveBeenCalledTimes(4); // 1 assignment + 3 interactions
  });

  it('logs variant changes when onVariantChange is called', async () => {
    const onVariantChange = vi.fn();
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" onVariantChange={onVariantChange} enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(onVariantChange).toHaveBeenCalled();
      expect(analytics.track).toHaveBeenCalledWith('ab_test_assigned', expect.objectContaining({
        testId: 'test-1'
      }));
    });
  });

  it('logs error events when initialization fails', async () => {
    personalization.getUserSegment.mockRejectedValue(new Error('Personalization API Error'));
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      // Should still render content even if initialization fails
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('logs with correct timestamp format', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      const call = analytics.track.mock.calls.find(call => call[0] === 'ab_test_assigned');
      expect(call).toBeDefined();
      
      const timestamp = call[1].timestamp;
      expect(timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/);
    });
  });

  it('logs user segment information correctly', async () => {
    const testCases = [
      'business_traveler',
      'luxury_seeker',
      'budget_conscious',
      'family_traveler',
      'solo_traveler',
      'senior_traveler',
      'general_traveler'
    ];

    for (const segment of testCases) {
      vi.clearAllMocks();
      personalization.getUserSegment.mockResolvedValue(segment);
      
      render(
        <ABWrapper testId="test-1" enableAnalytics={true}>
          <div>Test Content</div>
        </ABWrapper>
      );

      await waitFor(() => {
        expect(analytics.track).toHaveBeenCalledWith('ab_test_assigned', expect.objectContaining({
          userSegment: segment
        }));
      });
    }
  });

  it('logs variant consistency across multiple renders', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    global.localStorage.getItem.mockReturnValue('2'); // Force variant 2
    
    const { rerender } = render(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      const firstCall = analytics.track.mock.calls.find(call => call[0] === 'ab_test_assigned');
      expect(firstCall[1].variant).toBe(2);
    });

    // Rerender the component
    rerender(
      <ABWrapper testId="test-1" enableAnalytics={true}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      // Should not log again since variant is already stored
      const assignmentCalls = analytics.track.mock.calls.filter(call => call[0] === 'ab_test_assigned');
      expect(assignmentCalls).toHaveLength(1);
    });
  });

  it('logs different test IDs separately', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <div>
        <ABWrapper testId="test-1" enableAnalytics={true}>
          <div>Test 1 Content</div>
        </ABWrapper>
        <ABWrapper testId="test-2" enableAnalytics={true}>
          <div>Test 2 Content</div>
        </ABWrapper>
      </div>
    );

    await waitFor(() => {
      const test1Call = analytics.track.mock.calls.find(call => 
        call[0] === 'ab_test_assigned' && call[1].testId === 'test-1'
      );
      const test2Call = analytics.track.mock.calls.find(call => 
        call[0] === 'ab_test_assigned' && call[1].testId === 'test-2'
      );

      expect(test1Call).toBeDefined();
      expect(test2Call).toBeDefined();
      expect(test1Call[1].testId).toBe('test-1');
      expect(test2Call[1].testId).toBe('test-2');
    });
  });

  it('respects enableAnalytics flag', async () => {
    personalization.getUserSegment.mockResolvedValue('business_traveler');
    
    render(
      <ABWrapper testId="test-1" enableAnalytics={false}>
        <div>Test Content</div>
      </ABWrapper>
    );

    await waitFor(() => {
      expect(analytics.track).not.toHaveBeenCalled();
    });
  });
});
