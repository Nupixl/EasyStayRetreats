import React from 'react';

const MapLoading = () => {
  return (
    <div className="flex items-center justify-center h-full bg-gray-100">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-sm text-gray-600">Loading map...</p>
      </div>
    </div>
  );
};

export default MapLoading;
