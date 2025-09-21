/**
 * Test Setup Configuration
 * Global test setup and configuration for the EasyStay Retreats test suite
 */

import { expect, afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
delete window.location;
window.location = {
  href: 'http://localhost:3000',
  origin: 'http://localhost:3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: vi.fn(),
  replace: vi.fn(),
  reload: vi.fn(),
};

// Mock navigator
Object.defineProperty(window, 'navigator', {
  value: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
  },
  writable: true,
});

// Mock document.referrer
Object.defineProperty(document, 'referrer', {
  value: 'http://localhost:3000',
  writable: true,
});

// Mock console methods for cleaner test output
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks();
  
  // Reset localStorage and sessionStorage
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
  
  // Reset fetch mock
  fetch.mockClear();
  
  // Suppress console errors and warnings during tests
  console.error = vi.fn();
  console.warn = vi.fn();
});

afterEach(() => {
  // Clean up DOM after each test
  cleanup();
  
  // Restore console methods
  console.error = originalConsoleError;
  console.warn = originalConsoleWarn;
});

// Global test utilities
global.testUtils = {
  // Mock user profile
  mockUserProfile: {
    id: 'test-user-123',
    name: 'Test User',
    email: 'test@example.com',
    age: 30,
    income: 75000,
    location: 'San Francisco, CA',
    familySize: 2,
    bookingHistory: {
      totalBookings: 5,
      businessBookings: 2,
      averageSpend: 250
    }
  },

  // Mock user preferences
  mockUserPreferences: {
    budgetFriendly: true,
    luxuryAccommodations: false,
    businessTravel: false,
    familyFriendly: true,
    petFriendly: false,
    accessibility: false,
    preferredLocations: ['California', 'Oregon'],
    preferredAmenities: ['wifi', 'parking', 'kitchen']
  },

  // Mock analytics event
  mockAnalyticsEvent: {
    eventName: 'test_event',
    properties: {
      testProperty: 'testValue',
      timestamp: '2024-01-01T00:00:00.000Z'
    }
  },

  // Mock property data
  mockProperty: {
    id: 'property-123',
    title: 'Test Property',
    location: 'Test Location',
    price: 150,
    rating: 4.5,
    amenities: ['wifi', 'parking'],
    images: ['image1.jpg', 'image2.jpg']
  },

  // Wait for async operations
  waitFor: (ms = 0) => new Promise(resolve => setTimeout(resolve, ms)),

  // Mock successful fetch response
  mockFetchSuccess: (data) => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(data),
      status: 200
    });
  },

  // Mock failed fetch response
  mockFetchError: (status = 500, message = 'Internal Server Error') => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status,
      json: () => Promise.resolve({ error: message })
    });
  }
};

// Export for use in tests
export { expect, vi, describe, it, beforeEach, afterEach };
