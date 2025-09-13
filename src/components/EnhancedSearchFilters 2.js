"use client";
import React from "react";
import * as _Builtin from "./_Builtin";

export function EnhancedSearchFilters({ 
  as: _Component = _Builtin.Section,
  // Search form properties
  location = "",
  checkInDate = "",
  checkOutDate = "",
  guests = 1,
  priceRange = [50, 1000],
  propertyType = "Any",
  amenities = [],
  // Event handlers
  onLocationChange = () => {},
  onCheckInChange = () => {},
  onCheckOutChange = () => {},
  onGuestsChange = () => {},
  onPriceRangeChange = () => {},
  onPropertyTypeChange = () => {},
  onAmenitiesChange = () => {},
  onSearch = () => {},
  onReset = () => {},
  // UI properties
  showAdvancedFilters = false,
  onToggleAdvanced = () => {},
  isLoading = false,
  // Available options
  propertyTypes = ["Any", "Cabin", "Villa", "Treehouse", "Lodge", "Retreat"],
  availableAmenities = ["WiFi", "Pool", "Spa", "Kitchen", "Gym", "Parking", "Pet Friendly", "Ocean View", "Mountain View"],
}) {
  return (
    <_Component
      grid={{
        type: "section",
      }}
      tag="section"
    >
      <_Builtin.BlockContainer
        grid={{
          type: "container",
        }}
        tag="div"
      >
        <_Builtin.Heading tag="h2">{"Search Filters"}</_Builtin.Heading>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Location"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            <_Builtin.FormTextInput
              type="text"
              placeholder="Where are you going?"
              value={location}
              onChange={(e) => onLocationChange(e.target.value)}
            />
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Check-in Date"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            <_Builtin.FormTextInput
              type="date"
              placeholder="Select check-in date"
              value={checkInDate}
              onChange={(e) => onCheckInChange(e.target.value)}
            />
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Check-out Date"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            <_Builtin.FormTextInput
              type="date"
              placeholder="Select check-out date"
              value={checkOutDate}
              onChange={(e) => onCheckOutChange(e.target.value)}
            />
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Block tag="div">
          <_Builtin.Heading tag="h4">{"Guests"}</_Builtin.Heading>
          <_Builtin.Block tag="div">
            <_Builtin.FormTextInput
              type="number"
              placeholder="Number of guests"
              value={guests}
              onChange={(e) => onGuestsChange(parseInt(e.target.value))}
              min="1"
              max="20"
            />
          </_Builtin.Block>
        </_Builtin.Block>
        <_Builtin.Link
          button={true}
          block=""
          options={{
            href: "#",
          }}
          onClick={(e) => {
            e.preventDefault();
            onSearch();
          }}
        >
          {isLoading ? "Searching..." : "Search Properties"}
        </_Builtin.Link>
      </_Builtin.BlockContainer>
    </_Component>
  );
}
