import React, { useState } from 'react';
import { Camera, MapPin, Home, DollarSign, Bed, Bath, Square, Plus, X, Check, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';

interface PropertyFormData {
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  price: number;
  type: 'apartment' | 'house' | 'room' | 'studio';
  bedrooms: number;
  bathrooms: number;
  area: number;
  city: string;
  area_name: string;
  address: string;
  addressBn: string;
  amenities: string[];
  images: File[];
  genderPreference: 'male' | 'female' | 'family' | 'any';
  furnishing: 'furnished' | 'semi-furnished' | 'unfurnished';
  parking: boolean;
  availableFrom: string;
  contactName: string;
  contactNameBn: string;
  contactPhone: string;
  contactEmail: string;
}

const AddPropertyPage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    price: 0,
    type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 0,
    city: '',
    area_name: '',
    address: '',
    addressBn: '',
    amenities: [],
    images: [],
    genderPreference: 'any',
    furnishing: 'unfurnished',
    parking: false,
    availableFrom: '',
    contactName: '',
    contactNameBn: '',
    contactPhone: '',
    contactEmail: ''
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const totalSteps = 5;

  const propertyTypes = [
    { value: 'apartment', labelBn: 'অ্যাপার্টমেন্ট', labelEn: 'Apartment', icon: Home },
    { value: 'house', labelBn: 'বাড়ি', labelEn: 'House', icon: Home },
    { value: 'room', labelBn: 'রুম', labelEn: 'Room', icon: Bed },
    { value: 'studio', labelBn: 'স্টুডিও', labelEn: 'Studio', icon: Square }
  ];

  const commonAmenities = [
    { value: 'ac', labelBn: 'এয়ার কন্ডিশনার', labelEn: 'Air Conditioning' },
    { value: 'parking', labelBn: 'পার্কিং', labelEn: 'Parking' },
    { value: 'security', labelBn: 'নিরাপত্তা', labelEn: 'Security' },
    { value: 'elevator', labelBn: 'লিফট', labelEn: 'Elevator' },
    { value: 'internet', labelBn: 'ইন্টারনেট', labelEn: 'Internet' },
    { value: 'kitchen', labelBn: 'রান্নাঘর', labelEn: 'Kitchen' },
    { value: 'balcony', labelBn: 'বারান্দা', labelEn: 'Balcony' },
    { value: 'furnished', labelBn: 'সাজানো', labelEn: 'Furnished' },
    { value: 'gas', labelBn: 'গ্যাস', labelEn: 'Gas Connection' },
    { value: 'generator', labelBn: 'জেনারেটর', labelEn: 'Generator' },
    { value: 'cctv', labelBn: 'সিসিটিভি', labelEn: 'CCTV' },
    { value: 'gym', labelBn: 'জিম', labelEn: 'Gym' }
  ];

  const genderOptions = [
    { value: 'any', labelBn: 'যেকোনো', labelEn: 'Any' },
    { value: 'male', labelBn: 'পুরুষ', labelEn: 'Male Only' },
    { value: 'female', labelBn: 'মহিলা', labelEn: 'Female Only' },
    { value: 'family', labelBn: 'পরিবার', labelEn: 'Family' }
  ];

  const furnishingOptions = [
    { value: 'unfurnished', labelBn: 'সাজানো নয়', labelEn: 'Unfurnished' },
    { value: 'semi-furnished', labelBn: 'আংশিক সাজানো', labelEn: 'Semi-Furnished' },
    { value: 'furnished', labelBn: 'সাজানো', labelEn: 'Furnished' }
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...files].slice(0, 10) // Max 10 images
    }));
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Property submitted:', formData);
    
    // Show success modal
    setShowSuccessModal(true);
    
    // Simulate API call delay
    setTimeout(() => {
      setShowSuccessModal(false);
      // Navigate to property detail page (using mock ID for demo)
      navigate('/property/new-property-id');
    }, 2000);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('basic-info', 'মৌলিক তথ্য', 'Basic Information')}
            </h2>

            {/* Property Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('property-type', 'সম্পত্তির ধরন', 'Property Type')}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {propertyTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => handleInputChange('type', type.value)}
                      className={`
                        p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all
                        ${formData.type === type.value
                          ? 'border-teal-500 bg-teal-50 text-teal-700'
                          : 'border-gray-200 hover:border-gray-300'
                        }
                      `}
                    >
                      <Icon size={24} />
                      <span className="font-medium">
                        {language === 'bn' ? type.labelBn : type.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('title-english', 'শিরোনাম (ইংরেজি)', 'Title (English)')} *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Modern 3BHK Apartment"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('title-bengali', 'শিরোনাম (বাংলা)', 'Title (Bengali)')} *
                </label>
                <input
                  type="text"
                  value={formData.titleBn}
                  onChange={(e) => handleInputChange('titleBn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="আধুনিক ৩ বেডরুমের অ্যাপার্টমেন্ট"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description-english', 'বিবরণ (ইংরেজি)', 'Description (English)')} *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Describe your property..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('description-bengali', 'বিবরণ (বাংলা)', 'Description (Bengali)')} *
                </label>
                <textarea
                  value={formData.descriptionBn}
                  onChange={(e) => handleInputChange('descriptionBn', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="আপনার সম্পত্তির বিবরণ দিন..."
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('property-details', 'সম্পত্তির বিবরণ', 'Property Details')}
            </h2>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline w-4 h-4 mr-1" />
                {t('monthly-rent', 'মাসিক ভাড়া (টাকা)', 'Monthly Rent (BDT)')} *
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="25000"
                required
              />
            </div>

            {/* Room Details */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bed className="inline w-4 h-4 mr-1" />
                  {t('bedrooms', 'শোবার ঘর', 'Bedrooms')} *
                </label>
                <select
                  value={formData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Bath className="inline w-4 h-4 mr-1" />
                  {t('bathrooms', 'বাথরুম', 'Bathrooms')} *
                </label>
                <select
                  value={formData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  required
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Square className="inline w-4 h-4 mr-1" />
                  {t('area-sqft', 'এলাকা (বর্গফুট)', 'Area (sqft)')} *
                </label>
                <input
                  type="number"
                  value={formData.area}
                  onChange={(e) => handleInputChange('area', Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="1200"
                  required
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('gender-preference', 'লিঙ্গ পছন্দ', 'Gender Preference')}
                </label>
                <select
                  value={formData.genderPreference}
                  onChange={(e) => handleInputChange('genderPreference', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {genderOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'bn' ? option.labelBn : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('furnishing', 'আসবাবপত্র', 'Furnishing')}
                </label>
                <select
                  value={formData.furnishing}
                  onChange={(e) => handleInputChange('furnishing', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  {furnishingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {language === 'bn' ? option.labelBn : option.labelEn}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('available-from', 'থেকে উপলব্ধ', 'Available From')}
                </label>
                <input
                  type="date"
                  value={formData.availableFrom}
                  onChange={(e) => handleInputChange('availableFrom', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Parking */}
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.parking}
                  onChange={(e) => handleInputChange('parking', e.target.checked)}
                  className="rounded border-gray-300 text-teal-600 focus:ring-teal-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  {t('parking-available', 'পার্কিং উপলব্ধ', 'Parking Available')}
                </span>
              </label>
            </div>

            {/* Amenities */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('amenities', 'সুবিধাসমূহ', 'Amenities')}
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonAmenities.map((amenity) => (
                  <button
                    key={amenity.value}
                    type="button"
                    onClick={() => handleAmenityToggle(amenity.value)}
                    className={`
                      p-3 border rounded-lg text-sm font-medium transition-all
                      ${formData.amenities.includes(amenity.value)
                        ? 'border-teal-500 bg-teal-50 text-teal-700'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    {language === 'bn' ? amenity.labelBn : amenity.labelEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('location-info', 'অবস্থানের তথ্য', 'Location Information')}
            </h2>

            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline w-4 h-4 mr-1" />
                {t('location', 'অবস্থান', 'Location')} *
              </label>
              <LocationSearch
                selectedCity={formData.city}
                selectedArea={formData.area_name}
                onCityChange={(cityId) => handleInputChange('city', cityId)}
                onAreaChange={(areaId) => handleInputChange('area_name', areaId)}
              />
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('full-address-english', 'সম্পূর্ণ ঠিকানা (ইংরেজি)', 'Full Address (English)')} *
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="House/Road/Block details..."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('full-address-bengali', 'সম্পূর্ণ ঠিকানা (বাংলা)', 'Full Address (Bengali)')} *
                </label>
                <textarea
                  value={formData.addressBn}
                  onChange={(e) => handleInputChange('addressBn', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="বাড়ি/রোড/ব্লকের বিবরণ..."
                  required
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('contact-info', 'যোগাযোগের তথ্য', 'Contact Information')}
            </h2>

            {/* Contact Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact-name-english', 'যোগাযোগকারীর নাম (ইংরেজি)', 'Contact Name (English)')} *
                </label>
                <input
                  type="text"
                  value={formData.contactName}
                  onChange={(e) => handleInputChange('contactName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('contact-name-bengali', 'যোগাযোগকারীর নাম (বাংলা)', 'Contact Name (Bengali)')} *
                </label>
                <input
                  type="text"
                  value={formData.contactNameBn}
                  onChange={(e) => handleInputChange('contactNameBn', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="জন ডো"
                  required
                />
              </div>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('phone-number', 'ফোন নম্বর', 'Phone Number')} *
                </label>
                <input
                  type="tel"
                  value={formData.contactPhone}
                  onChange={(e) => handleInputChange('contactPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="+880 1712-345678"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('email-address', 'ইমেইল ঠিকানা', 'Email Address')}
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {/* Property Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                {t('upload-images', 'ছবি আপলোড করুন', 'Upload Images')} (সর্বোচ্চ ১০টি) *
              </label>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Camera className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <div className="space-y-2">
                  <label className="cursor-pointer">
                    <span className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors">
                      {t('choose-images', 'ছবি নির্বাচন করুন', 'Choose Images')}
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <p className="text-sm text-gray-500">
                    {t('image-formats', 'JPG, PNG, WebP (সর্বোচ্চ 5MB প্রতিটি)', 'JPG, PNG, WebP (Max 5MB each)')}
                  </p>
                </div>
              </div>

              {/* Image Preview */}
              {formData.images.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    {t('selected-images', 'নির্বাচিত ছবি', 'Selected Images')} ({formData.images.length}/10)
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Property ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900">
              {t('review-submit', 'পর্যালোচনা ও জমা দিন', 'Review & Submit')}
            </h2>

            {/* Property Summary */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('property-summary', 'সম্পত্তির সারসংক্ষেপ', 'Property Summary')}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t('title', 'শিরোনাম', 'Title')}:</span>
                    <p className="font-medium">{language === 'bn' ? formData.titleBn : formData.title}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('type', 'ধরন', 'Type')}:</span>
                    <p className="font-medium">{formData.type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('price', 'মূল্য', 'Price')}:</span>
                    <p className="font-medium text-teal-600">৳{formData.price.toLocaleString()}/মাস</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('rooms', 'রুম', 'Rooms')}:</span>
                    <p className="font-medium">{formData.bedrooms} bed, {formData.bathrooms} bath</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">{t('area', 'এলাকা', 'Area')}:</span>
                    <p className="font-medium">{formData.area} sqft</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('location', 'অবস্থান', 'Location')}:</span>
                    <p className="font-medium">{formData.area_name}, {formData.city}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('contact', 'যোগাযোগ', 'Contact')}:</span>
                    <p className="font-medium">{language === 'bn' ? formData.contactNameBn : formData.contactName}</p>
                    <p className="text-sm text-gray-600">{formData.contactPhone}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">{t('amenities', 'সুবিধা', 'Amenities')}:</span>
                    <p className="font-medium">{formData.amenities.length} selected</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900 mb-2">
                {t('terms-conditions', 'শর্তাবলী', 'Terms & Conditions')}
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• {t('term-1', 'সব তথ্য সঠিক এবং আপডেট রাখুন', 'Keep all information accurate and updated')}</li>
                <li>• {t('term-2', 'ভুয়া তথ্য প্রদান করবেন না', 'Do not provide false information')}</li>
                <li>• {t('term-3', 'আমাদের নীতিমালা মেনে চলুন', 'Follow our community guidelines')}</li>
              </ul>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('success-title', 'সফলভাবে জমা দেওয়া হয়েছে!', 'Successfully Submitted!')}
            </h3>
            <p className="text-gray-600 mb-4">
              {t('success-message', 'আপনার সম্পত্তি সফলভাবে তালিকাভুক্ত হয়েছে।', 'Your property has been successfully listed.')}
            </p>
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-teal-500 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={20} />
              <span>{t('back', 'ফিরে যান', 'Back')}</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">
              {t('add-new-property', 'নতুন সম্পত্তি যোগ করুন', 'Add New Property')}
            </h1>
            
            <div className="w-20"></div> {/* Spacer */}
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
              <span>{t('step', 'ধাপ', 'Step')} {currentStep} {t('of', 'এর', 'of')} {totalSteps}</span>
              <span>{Math.round((currentStep / totalSteps) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-8 border-t border-gray-200 mt-8">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`
                px-6 py-2 rounded-lg font-medium transition-colors
                ${currentStep === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }
              `}
            >
              {t('previous', 'পূর্ববর্তী', 'Previous')}
            </button>

            {currentStep === totalSteps ? (
              <button
                type="submit"
                className="bg-teal-500 text-white px-8 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                {t('submit-property', 'সম্পত্তি জমা দিন', 'Submit Property')}
              </button>
            ) : (
              <button
                type="button"
                onClick={nextStep}
                className="bg-teal-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-teal-600 transition-colors"
              >
                {t('next', 'পরবর্তী', 'Next')}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};

export default AddPropertyPage;