import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Layers, Plus, Minus, Maximize2, Navigation, RotateCcw, Locate } from 'lucide-react';
import LocationPin from './LocationPin';
import { Property } from '../types';
import { useLanguage } from '../hooks/useLanguage';

interface MapViewProps {
  properties: Property[];
  selectedProperty?: string;
  onPropertySelect?: (propertyId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  properties,
  selectedProperty,
  onPropertySelect
}) => {
  const { t } = useLanguage();
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite'>('default');
  const [zoom, setZoom] = useState(12);
  const [center, setCenter] = useState({ lat: 23.8103, lng: 90.4125 }); // Dhaka center
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapOffset, setMapOffset] = useState({ x: 0, y: 0 });
  const [showPropertyDetails, setShowPropertyDetails] = useState<string | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);

  // Group properties by location for clustering (Airbnb/Foodpanda style)
  const groupedProperties = properties.reduce((acc, property) => {
    const key = `${Math.round(property.location.coordinates.lat * 1000)}-${Math.round(property.location.coordinates.lng * 1000)}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(property);
    return acc;
  }, {} as Record<string, Property[]>);

  // Handle mouse events for map dragging (Google Maps style)
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - mapOffset.x, y: e.clientY - mapOffset.y });
    document.body.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setMapOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  };

  // Touch events for mobile (like Google Maps mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - mapOffset.x, y: touch.clientY - mapOffset.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setMapOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Zoom controls (Google Maps style)
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 1, 8));
  };

  // Reset map position
  const handleResetPosition = () => {
    setMapOffset({ x: 0, y: 0 });
    setCenter({ lat: 23.8103, lng: 90.4125 });
    setZoom(12);
  };

  // Convert coordinates to pixel positions
  const coordsToPixels = (lat: number, lng: number) => {
    const scale = Math.pow(2, zoom - 10);
    const x = ((lng - center.lng) * 1000 * scale) + 200 + mapOffset.x;
    const y = ((center.lat - lat) * 1000 * scale) + 200 + mapOffset.y;
    return { x, y };
  };

  // Handle property pin click (Airbnb style)
  const handlePropertyClick = (propertyId: string) => {
    setShowPropertyDetails(propertyId);
    onPropertySelect?.(propertyId);
  };

  // Get property details for popup
  const getPropertyForPopup = (propertyId: string) => {
    return properties.find(p => p.id === propertyId);
  };

  return (
    <div className="relative h-96 bg-gray-100 rounded-xl overflow-hidden shadow-lg">
      {/* Google Maps Style Background */}
      <div 
        ref={mapRef}
        className={`
          w-full h-full relative select-none
          ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}
          ${mapStyle === 'satellite' 
            ? 'bg-gradient-to-br from-green-900 via-green-800 to-blue-900' 
            : 'bg-gradient-to-br from-gray-50 via-blue-50 to-green-50'
          }
        `}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Enhanced Google Maps Style Street Grid */}
        <div className="absolute inset-0 opacity-60">
          <svg 
            className="w-full h-full" 
            style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${Math.pow(1.2, zoom - 12)})` }}
          >
            <defs>
              {/* Street grid pattern */}
              <pattern 
                id="streetGrid" 
                x="0" 
                y="0" 
                width="80" 
                height="80" 
                patternUnits="userSpaceOnUse"
              >
                <rect 
                  width="100%" 
                  height="100%" 
                  fill={mapStyle === 'satellite' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.9)'}
                />
                {/* Major streets */}
                <path 
                  d="M 0 0 L 0 80 M 0 0 L 80 0"
                  stroke={mapStyle === 'satellite' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)'} 
                  strokeWidth="1.5"
                />
                {/* Minor streets */}
                <path 
                  d="M 40 0 L 40 80 M 0 40 L 80 40"
                  stroke={mapStyle === 'satellite' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'} 
                  strokeWidth="0.8"
                />
                {/* Local roads */}
                <path 
                  d="M 20 0 L 20 80 M 60 0 L 60 80 M 0 20 L 80 20 M 0 60 L 80 60"
                  stroke={mapStyle === 'satellite' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)'} 
                  strokeWidth="0.4"
                />
              </pattern>
              
              {/* Building pattern (Google Maps style) */}
              <pattern 
                id="buildings" 
                x="0" 
                y="0" 
                width="160" 
                height="160" 
                patternUnits="userSpaceOnUse"
              >
                {/* Residential blocks */}
                <rect x="15" y="15" width="20" height="25" fill={mapStyle === 'satellite' ? 'rgba(100,100,100,0.4)' : 'rgba(200,200,200,0.5)'} rx="2" />
                <rect x="40" y="20" width="18" height="22" fill={mapStyle === 'satellite' ? 'rgba(120,120,120,0.4)' : 'rgba(180,180,180,0.5)'} rx="2" />
                <rect x="65" y="12" width="25" height="30" fill={mapStyle === 'satellite' ? 'rgba(90,90,90,0.4)' : 'rgba(220,220,220,0.5)'} rx="2" />
                <rect x="95" y="18" width="22" height="28" fill={mapStyle === 'satellite' ? 'rgba(110,110,110,0.4)' : 'rgba(190,190,190,0.5)'} rx="2" />
                <rect x="125" y="25" width="20" height="20" fill={mapStyle === 'satellite' ? 'rgba(130,130,130,0.4)' : 'rgba(210,210,210,0.5)'} rx="2" />
                
                {/* Commercial blocks */}
                <rect x="20" y="60" width="30" height="20" fill={mapStyle === 'satellite' ? 'rgba(105,105,105,0.4)' : 'rgba(195,195,195,0.5)'} rx="2" />
                <rect x="55" y="65" width="25" height="25" fill={mapStyle === 'satellite' ? 'rgba(125,125,125,0.4)' : 'rgba(175,175,175,0.5)'} rx="2" />
                <rect x="85" y="58" width="35" height="22" fill={mapStyle === 'satellite' ? 'rgba(95,95,95,0.4)' : 'rgba(225,225,225,0.5)'} rx="2" />
                <rect x="125" y="62" width="28" height="30" fill={mapStyle === 'satellite' ? 'rgba(115,115,115,0.4)' : 'rgba(185,185,185,0.5)'} rx="2" />
                
                {/* High-rise buildings */}
                <rect x="12" y="105" width="22" height="18" fill={mapStyle === 'satellite' ? 'rgba(135,135,135,0.4)' : 'rgba(205,205,205,0.5)'} rx="2" />
                <rect x="40" y="110" width="28" height="22" fill={mapStyle === 'satellite' ? 'rgba(100,100,100,0.4)' : 'rgba(200,200,200,0.5)'} rx="2" />
                <rect x="75" y="102" width="24" height="28" fill={mapStyle === 'satellite' ? 'rgba(120,120,120,0.4)' : 'rgba(180,180,180,0.5)'} rx="2" />
                <rect x="105" y="108" width="26" height="25" fill={mapStyle === 'satellite' ? 'rgba(110,110,110,0.4)' : 'rgba(190,190,190,0.5)'} rx="2" />
                <rect x="135" y="115" width="20" height="20" fill={mapStyle === 'satellite' ? 'rgba(140,140,140,0.4)' : 'rgba(170,170,170,0.5)'} rx="2" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#streetGrid)"/>
            <rect width="100%" height="100%" fill="url(#buildings)" opacity="0.7"/>
          </svg>
        </div>

        {/* Major Roads and Highways (Google Maps style) */}
        <div className="absolute inset-0 opacity-70">
          <svg 
            className="w-full h-full" 
            style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${Math.pow(1.2, zoom - 12)})` }}
          >
            {/* Major highways (thick yellow/orange lines) */}
            <path
              d="M 0 200 Q 100 180 200 200 Q 300 220 400 200 Q 500 180 600 200"
              stroke={mapStyle === 'satellite' ? '#FFD700' : '#FF8C00'}
              strokeWidth="6"
              fill="none"
              opacity="0.9"
            />
            <path
              d="M 200 0 Q 220 100 200 200 Q 180 300 200 400 Q 220 500 200 600"
              stroke={mapStyle === 'satellite' ? '#FFD700' : '#FF8C00'}
              strokeWidth="6"
              fill="none"
              opacity="0.9"
            />
            
            {/* Secondary roads (medium orange lines) */}
            <path
              d="M 50 100 Q 150 120 250 100 Q 350 80 450 100 Q 550 120 650 100"
              stroke={mapStyle === 'satellite' ? '#FFA500' : '#FF6347'}
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            <path
              d="M 50 300 Q 150 280 250 300 Q 350 320 450 300 Q 550 280 650 300"
              stroke={mapStyle === 'satellite' ? '#FFA500' : '#FF6347'}
              strokeWidth="4"
              fill="none"
              opacity="0.8"
            />
            
            {/* Local streets (thin white/gray lines) */}
            <path
              d="M 100 50 Q 120 150 100 250 Q 80 350 100 450"
              stroke={mapStyle === 'satellite' ? '#FFFFFF' : '#808080'}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 300 50 Q 320 150 300 250 Q 280 350 300 450"
              stroke={mapStyle === 'satellite' ? '#FFFFFF' : '#808080'}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
            <path
              d="M 500 50 Q 520 150 500 250 Q 480 350 500 450"
              stroke={mapStyle === 'satellite' ? '#FFFFFF' : '#808080'}
              strokeWidth="2"
              fill="none"
              opacity="0.6"
            />
          </svg>
        </div>

        {/* Water Bodies (Google Maps blue style) */}
        <div className="absolute inset-0 opacity-60">
          <svg 
            className="w-full h-full" 
            style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${Math.pow(1.2, zoom - 12)})` }}
          >
            {/* Buriganga River */}
            <path
              d="M 0 350 Q 80 340 160 350 Q 240 360 320 350 Q 400 340 480 350 Q 560 360 640 350"
              stroke="#4285F4"
              strokeWidth="15"
              fill="none"
              opacity="0.8"
            />
            {/* Turag River */}
            <path
              d="M 350 0 Q 360 80 350 160 Q 340 240 350 320 Q 360 400 350 480"
              stroke="#4285F4"
              strokeWidth="10"
              fill="none"
              opacity="0.7"
            />
            {/* Dhanmondi Lake */}
            <ellipse cx="180" cy="180" rx="30" ry="18" fill="#4285F4" opacity="0.6"/>
            {/* Gulshan Lake */}
            <ellipse cx="320" cy="140" rx="35" ry="22" fill="#4285F4" opacity="0.6"/>
            {/* Hatirjheel */}
            <ellipse cx="280" cy="220" rx="40" ry="20" fill="#4285F4" opacity="0.6"/>
          </svg>
        </div>

        {/* Green Spaces (Google Maps green style) */}
        {mapStyle === 'default' && (
          <div className="absolute inset-0 opacity-50">
            <svg 
              className="w-full h-full" 
              style={{ transform: `translate(${mapOffset.x}px, ${mapOffset.y}px) scale(${Math.pow(1.2, zoom - 12)})` }}
            >
              {/* Ramna Park */}
              <circle cx="220" cy="200" r="35" fill="#34A853" opacity="0.7"/>
              {/* Suhrawardy Udyan */}
              <circle cx="250" cy="180" r="30" fill="#34A853" opacity="0.7"/>
              {/* Baldha Garden */}
              <circle cx="280" cy="240" r="25" fill="#34A853" opacity="0.7"/>
              {/* Chandrima Udyan */}
              <rect x="180" y="160" width="45" height="30" rx="10" fill="#34A853" opacity="0.7"/>
              {/* Botanical Garden */}
              <rect x="320" y="280" width="55" height="40" rx="12" fill="#34A853" opacity="0.7"/>
              {/* Gulshan Park */}
              <circle cx="340" cy="120" r="22" fill="#34A853" opacity="0.7"/>
              {/* Dhanmondi Park */}
              <circle cx="160" cy="200" r="28" fill="#34A853" opacity="0.7"/>
            </svg>
          </div>
        )}

        {/* Property Pins (Airbnb/Foodpanda style) */}
        {Object.entries(groupedProperties).map(([key, groupProperties]) => {
          const property = groupProperties[0];
          const isCluster = groupProperties.length > 1;
          const position = coordsToPixels(property.location.coordinates.lat, property.location.coordinates.lng);
          
          return (
            <div
              key={key}
              className="absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 hover:z-50"
              style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                zIndex: selectedProperty && groupProperties.some(p => p.id === selectedProperty) ? 40 : 30
              }}
            >
              <LocationPin
                city={property.location.city}
                coordinates={property.location.coordinates}
                isCluster={isCluster}
                count={groupProperties.length}
                isActive={selectedProperty && groupProperties.some(p => p.id === selectedProperty)}
                onClick={() => handlePropertyClick(property.id)}
                price={property.price}
                title={property.title}
                showDetails={showPropertyDetails === property.id}
              />
            </div>
          );
        })}

        {/* City Labels (Google Maps style) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${coordsToPixels(23.8103, 90.4125).x}px`, 
            top: `${coordsToPixels(23.8103, 90.4125).y}px` 
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-bold text-gray-800 shadow-lg border border-gray-200">
            {t('dhaka', 'ঢাকা', 'Dhaka')}
          </div>
        </div>
        
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${coordsToPixels(22.3569, 91.7832).x}px`, 
            top: `${coordsToPixels(22.3569, 91.7832).y}px` 
          }}
        >
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full text-lg font-bold text-gray-800 shadow-lg border border-gray-200">
            {t('chittagong', 'চট্টগ্রাম', 'Chittagong')}
          </div>
        </div>

        {/* Area Labels (Google Maps style) */}
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${coordsToPixels(23.7461, 90.3742).x}px`, 
            top: `${coordsToPixels(23.7461, 90.3742).y}px` 
          }}
        >
          <div className="bg-amber-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-800 shadow-md border border-amber-200">
            {t('dhanmondi', 'ধানমন্ডি', 'Dhanmondi')}
          </div>
        </div>
        
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ 
            left: `${coordsToPixels(23.7925, 90.4078).x}px`, 
            top: `${coordsToPixels(23.7925, 90.4078).y}px` 
          }}
        >
          <div className="bg-amber-100/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-amber-800 shadow-md border border-amber-200">
            {t('gulshan', 'গুলশান', 'Gulshan')}
          </div>
        </div>
      </div>

      {/* Google Maps Style Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        {/* Zoom Controls */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <button
            onClick={handleZoomIn}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors border-b border-gray-200"
            title={t('zoom-in', 'জুম ইন', 'Zoom In')}
          >
            <Plus size={16} className="text-gray-700" />
          </button>
          <button
            onClick={handleZoomOut}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
            title={t('zoom-out', 'জুম আউট', 'Zoom Out')}
          >
            <Minus size={16} className="text-gray-700" />
          </button>
        </div>

        {/* Map Style Toggle */}
        <button
          onClick={() => setMapStyle(mapStyle === 'default' ? 'satellite' : 'default')}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title={t('toggle-map-style', 'ম্যাপ স্টাইল পরিবর্তন করুন', 'Toggle Map Style')}
        >
          <Layers size={16} className="text-gray-700" />
        </button>

        {/* Reset Position */}
        <button
          onClick={handleResetPosition}
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title={t('reset-position', 'অবস্থান রিসেট করুন', 'Reset Position')}
        >
          <RotateCcw size={16} className="text-gray-700" />
        </button>

        {/* My Location */}
        <button
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title={t('my-location', 'আমার অবস্থান', 'My Location')}
        >
          <Locate size={16} className="text-gray-700" />
        </button>

        {/* Fullscreen */}
        <button
          className="bg-white p-2 rounded-lg shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          title={t('fullscreen', 'ফুলস্ক্রিন', 'Fullscreen')}
        >
          <Maximize2 size={16} className="text-gray-700" />
        </button>
      </div>

      {/* Google Maps Style Legend */}
      <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <div className="text-sm font-semibold text-gray-800 mb-3">
          {t('legend', 'লেজেন্ড', 'Legend')}
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-amber-600">
              ৳
            </div>
            <span className="text-xs text-gray-700">
              {t('single-property', 'একক সম্পত্তি', 'Single Property')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center text-xs font-bold text-gray-800">
              3
            </div>
            <span className="text-xs text-gray-700">
              {t('multiple-properties', 'একাধিক সম্পত্তি', 'Multiple Properties')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 bg-blue-500 rounded"></div>
            <span className="text-xs text-gray-700">
              {t('rivers', 'নদী', 'Rivers')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-1 bg-orange-500 rounded"></div>
            <span className="text-xs text-gray-700">
              {t('major-roads', 'প্রধান সড়ক', 'Major Roads')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-xs text-gray-700">
              {t('parks', 'পার্ক', 'Parks')}
            </span>
          </div>
        </div>
      </div>

      {/* Zoom Level and Coordinates Indicator (Google Maps style) */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-600 border border-gray-200">
        {t('zoom', 'জুম', 'Zoom')}: {zoom} | {center.lat.toFixed(4)}, {center.lng.toFixed(4)}
      </div>

      {/* Property Details Popup (Airbnb style) */}
      {showPropertyDetails && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-xl border border-gray-200 p-4 max-w-sm z-50">
          {(() => {
            const property = getPropertyForPopup(showPropertyDetails);
            if (!property) return null;
            
            return (
              <div>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">
                    {property.title}
                  </h3>
                  <button
                    onClick={() => setShowPropertyDetails(null)}
                    className="text-gray-400 hover:text-gray-600 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
                <div className="text-lg font-bold text-amber-600 mb-2">
                  ৳{property.price.toLocaleString()}/month
                </div>
                <div className="text-sm text-gray-600 mb-3">
                  {property.bedrooms} bed • {property.bathrooms} bath • {property.area} sqft
                </div>
                <div className="text-xs text-gray-500">
                  {property.location.area}, {property.location.city === 'dhaka' ? 'Dhaka' : 'Chittagong'}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default MapView;