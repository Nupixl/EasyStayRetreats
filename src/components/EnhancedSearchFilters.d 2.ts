import * as React from "react";

declare function EnhancedSearchFilters(props: {
  as?: React.ElementType;
  // Search form properties
  location?: string;
  checkInDate?: string;
  checkOutDate?: string;
  guests?: number;
  priceRange?: [number, number];
  propertyType?: string;
  amenities?: string[];
  // Event handlers
  onLocationChange?: (value: string) => void;
  onCheckInChange?: (value: string) => void;
  onCheckOutChange?: (value: string) => void;
  onGuestsChange?: (value: number) => void;
  onPriceRangeChange?: (value: [number, number]) => void;
  onPropertyTypeChange?: (value: string) => void;
  onAmenitiesChange?: (value: string[]) => void;
  onSearch?: () => void;
  onReset?: () => void;
  // UI properties
  showAdvancedFilters?: boolean;
  onToggleAdvanced?: () => void;
  isLoading?: boolean;
  // Available options
  propertyTypes?: string[];
  availableAmenities?: string[];
}): React.JSX.Element;
