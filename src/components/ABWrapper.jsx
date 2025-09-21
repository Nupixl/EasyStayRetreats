import React, { useState, useEffect } from 'react';
import { analytics } from '../utils/analytics';
import { personalization } from '../utils/personalization';

/**
 * ABWrapper - A/B Testing and Personalization Wrapper Component
 * Provides A/B testing functionality and personalization features
 */
const ABWrapper = ({ 
  children, 
  testId, 
  variants = [], 
  defaultVariant = 0,
  onVariantChange,
  enablePersonalization = true,
  enableAnalytics = true,
  className = '',
  ...props 
}) => {
  const [selectedVariant, setSelectedVariant] = useState(defaultVariant);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userSegment, setUserSegment] = useState(null);

  useEffect(() => {
    const initializeABTest = async () => {
      try {
        // Get user segment for personalization
        if (enablePersonalization) {
          const segment = await personalization.getUserSegment();
          setUserSegment(segment);
        }

        // Determine variant based on test ID and user segment
        const variant = await determineVariant(testId, userSegment);
        setSelectedVariant(variant);

        // Track A/B test assignment
        if (enableAnalytics) {
          analytics.track('ab_test_assigned', {
            testId,
            variant,
            userSegment,
            timestamp: new Date().toISOString()
          });
        }

        // Notify parent component of variant change
        if (onVariantChange) {
          onVariantChange(variant);
        }

        setIsLoaded(true);
      } catch (error) {
        console.error('ABWrapper initialization error:', error);
        setSelectedVariant(defaultVariant);
        setIsLoaded(true);
      }
    };

    initializeABTest();
  }, [testId, userSegment, enablePersonalization, enableAnalytics, onVariantChange, defaultVariant]);

  const determineVariant = async (testId, userSegment) => {
    // Check if user has a stored variant for this test
    const storedVariant = localStorage.getItem(`ab_test_${testId}`);
    if (storedVariant !== null) {
      return parseInt(storedVariant);
    }

    // Determine variant based on user segment and test configuration
    let variant = defaultVariant;
    
    if (userSegment && variants.length > 1) {
      // Use user segment to determine variant
      const segmentHash = hashString(userSegment + testId);
      variant = segmentHash % variants.length;
    } else if (variants.length > 1) {
      // Random assignment
      variant = Math.floor(Math.random() * variants.length);
    }

    // Store the variant for consistency
    localStorage.setItem(`ab_test_${testId}`, variant.toString());
    
    return variant;
  };

  const hashString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  };

  const handleVariantClick = (event) => {
    if (enableAnalytics) {
      analytics.track('ab_test_interaction', {
        testId,
        variant: selectedVariant,
        action: 'click',
        element: event.target.tagName,
        timestamp: new Date().toISOString()
      });
    }
  };

  if (!isLoaded) {
    return (
      <div className={`ab-wrapper-loading ${className}`} {...props}>
        {children}
      </div>
    );
  }

  const currentVariant = variants[selectedVariant] || variants[defaultVariant];

  return (
    <div 
      className={`ab-wrapper ab-wrapper--variant-${selectedVariant} ${className}`}
      data-test-id={testId}
      data-variant={selectedVariant}
      data-user-segment={userSegment}
      onClick={handleVariantClick}
      {...props}
    >
      {currentVariant ? (
        <div className="ab-variant-content">
          {typeof currentVariant === 'function' 
            ? currentVariant({ variant: selectedVariant, userSegment })
            : currentVariant
          }
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default ABWrapper;
