import React, { useState } from 'react';
import { Search, Filter, Users, Home as HomeIcon, Hash } from 'lucide-react';
import { SearchFilters as SearchFiltersType } from '../types';
import { useLanguage } from '../hooks/useLanguage';
import BangladeshLocationSearch from './BangladeshLocationSearch';

interface SearchFiltersProps {
  filters: SearchFiltersType;
  onFiltersChange: (filters: SearchFiltersType) => void;
  onSearch: () => void;
  showMainSearch?: boolean;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  filters,
  onFiltersChange,
  onSearch,
  showMainSearch = false
}) => {
  const { language, t } = useLanguage();

  const propertyTypes = [
    { value: 'apartment', labelBn: 'অ্যাপার্টমেন্ট', labelEn: 'Apartment' },
    { value: 'house', labelBn: 'বাড়ি', labelEn: 'House' },
    { value: 'room', labelBn: 'রুম', labelEn: 'Room' },
    { value: 'studio', labelBn: 'স্টুডিও', labelEn: 'Studio' },
    { value: 'family', labelBn: 'পরিবার', labelEn: 'Family' },
    { value: 'bachelor', labelBn: 'ব্যাচেলর', labelEn: 'Bachelor' },
    { value: 'office', labelBn: 'অফিস', labelEn: 'Office' },
    { value: 'sublet', labelBn: 'সাবলেট', labelEn: 'Sublet' },
    { value: 'hostel', labelBn: 'হোস্টেল', labelEn: 'Hostel' },
    { value: 'shop', labelBn: 'দোকান', labelEn: 'Shop' },
    { value: 'parking', labelBn: 'পার্কিং', labelEn: 'Parking' }
  ];

  const genderPreferences = [
    { value: 'any', labelBn: 'যেকোনো', labelEn: 'Any' },
    { value: 'male', labelBn: 'পুরুষ', labelEn: 'Male Only' },
    { value: 'female', labelBn: 'মহিলা', labelEn: 'Female Only' },
    { value: 'family', labelBn: 'পরিবার', labelEn: 'Family' }
  ];

  const furnishingOptions = [
    { value: 'any', labelBn: 'যেকোনো', labelEn: 'Any' },
    { value: 'furnished', labelBn: 'সাজানো', labelEn: 'Furnished' },
    { value: 'semi-furnished', labelBn: 'আংশিক সাজানো', labelEn: 'Semi-Furnished' },
    { value: 'unfurnished', labelBn: 'সাজানো নয়', labelEn: 'Unfurnished' }
  ];

  const availabilityOptions = [
    { value: 'any', labelBn: 'যেকোনো', labelEn: 'Any' },
    { value: 'immediate', labelBn: 'তাৎক্ষণিক', labelEn: 'Immediate' },
    { value: 'within-week', labelBn: 'এক সপ্তাহের মধ্যে', labelEn: 'Within a Week' },
    { value: 'within-month', labelBn: 'এক মাসের মধ্যে', labelEn: 'Within a Month' }
  ];

  if (showMainSearch) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        {/* Property ID Search */}
        <div className="mb-6">
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder={t('property-id-search', 'প্রপার্টি আইডি...', 'Property ID...')}
              value={filters.propertyId || ''}
              onChange={(e) => onFiltersChange({ ...filters, propertyId: e.target.value })}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-500"
            />
            <button
              onClick={onSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-2 rounded-lg hover:bg-teal-600 transition-colors"
            >
              <Search size={16} />
            </button>
          </div>
        </div>

        {/* OR Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500 font-medium">
              {t('or', 'অথবা', 'OR')}
            </span>
          </div>
        </div>

        {/* Bangladesh Location Search */}
        <div className="mb-6">
          <BangladeshLocationSearch
            selectedDivision={filters.division}
            selectedDistrict={filters.district}
            selectedThana={filters.thana}
            selectedArea={filters.area}
            onDivisionChange={(divisionId) => onFiltersChange({ 
              ...filters, 
              division: divisionId,
              district: '',
              thana: '',
              area: '',
              city: divisionId // Legacy compatibility
            })}
            onDistrictChange={(districtId) => onFiltersChange({ 
              ...filters, 
              district: districtId,
              thana: '',
              area: ''
            })}
            onThanaChange={(thanaId) => onFiltersChange({ 
              ...filters, 
              thana: thanaId,
              area: ''
            })}
            onAreaChange={(areaId) => onFiltersChange({ 
              ...filters, 
              area: areaId
            })}
          />
        </div>

        {/* Search Button */}
        <button
          onClick={onSearch}
          className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          {t('search', 'অনুসন্ধান', 'Search')}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Filter className="mr-2" size={20} />
          {t('advanced-filters', 'উন্নত ফিল্টার', 'Advanced Filters')}
        </h3>
      </div>

      <div className="space-y-6">
        {/* Property Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('property-type', 'প্রপার্টির ধরন', 'Property Type')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {propertyTypes.map((type) => (
              <label key={type.value} className="flex items-center">
                <input
                  type="radio"
                  name="propertyType"
                  checked={filters.type === type.value}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, type: e.target.checked ? type.value as any : undefined });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'bn' ? type.labelBn : type.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('min-price', 'ন্যূনতম মূল্য', 'Min Price')}
            </label>
            <input
              type="number"
              placeholder={t('min-price-placeholder', 'ন্যূনতম মূল্য', 'Min Price')}
              value={filters.minPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t('max-price', 'সর্বোচ্চ মূল্য', 'Max Price')}
            </label>
            <input
              type="number"
              placeholder={t('max-price-placeholder', 'সর্বোচ্চ মূল্য', 'Max Price')}
              value={filters.maxPrice || ''}
              onChange={(e) => onFiltersChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900"
            />
          </div>
        </div>

        {/* Bedrooms */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('bedrooms', 'শোবার ঘর', 'Bedrooms')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5].map((num) => (
              <label key={num} className="flex items-center">
                <input
                  type="radio"
                  name="bedrooms"
                  checked={filters.bedrooms === num}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, bedrooms: e.target.checked ? num : undefined });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">{num}+</span>
              </label>
            ))}
          </div>
        </div>

        {/* Gender Preference */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('gender-preference', 'লিঙ্গ পছন্দ', 'Gender Preference')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {genderPreferences.map((pref) => (
              <label key={pref.value} className="flex items-center">
                <input
                  type="radio"
                  name="genderPreference"
                  checked={filters.genderPreference === pref.value}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, genderPreference: e.target.checked ? pref.value as any : undefined });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'bn' ? pref.labelBn : pref.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Furnishing */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('furnishing', 'সাজসজ্জা', 'Furnishing')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {furnishingOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="furnishing"
                  checked={filters.furnishing === option.value}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, furnishing: e.target.checked ? option.value as any : undefined });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'bn' ? option.labelBn : option.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('availability', 'উপলব্ধতা', 'Availability')}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {availabilityOptions.map((option) => (
              <label key={option.value} className="flex items-center">
                <input
                  type="radio"
                  name="availability"
                  checked={filters.availability === option.value}
                  onChange={(e) => {
                    onFiltersChange({ ...filters, availability: e.target.checked ? option.value as any : undefined });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'bn' ? option.labelBn : option.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            {t('amenities', 'সুবিধা', 'Amenities')}
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { value: 'ac', labelBn: 'এসি', labelEn: 'AC' },
              { value: 'generator', labelBn: 'জেনারেটর', labelEn: 'Generator' },
              { value: 'elevator', labelBn: 'লিফট', labelEn: 'Elevator' },
              { value: 'parking', labelBn: 'পার্কিং', labelEn: 'Parking' },
              { value: 'security', labelBn: 'নিরাপত্তা', labelEn: 'Security' },
              { value: 'cctv', labelBn: 'সিসিটিভি', labelEn: 'CCTV' },
              { value: 'internet', labelBn: 'ইন্টারনেট', labelEn: 'Internet' },
              { value: 'balcony', labelBn: 'ব্যালকনি', labelEn: 'Balcony' }
            ].map((amenity) => (
              <label key={amenity.value} className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.amenities?.includes(amenity.value) || false}
                  onChange={(e) => {
                    const currentAmenities = filters.amenities || [];
                    const newAmenities = e.target.checked
                      ? [...currentAmenities, amenity.value]
                      : currentAmenities.filter(a => a !== amenity.value);
                    onFiltersChange({ ...filters, amenities: newAmenities });
                  }}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="ml-2 text-sm text-gray-700">
                  {language === 'bn' ? amenity.labelBn : amenity.labelEn}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <button
          onClick={onSearch}
          className="w-full bg-teal-500 text-white py-3 px-6 rounded-lg hover:bg-teal-600 transition-colors font-medium"
        >
          {t('apply-filters', 'ফিল্টার প্রয়োগ করুন', 'Apply Filters')}
        </button>
      </div>
    </div>
  );
};

export default SearchFilters;