import React, { useState } from 'react';
import { User, Edit, Heart, Home, MessageCircle, Settings, LogOut, Phone, Mail, MapPin, Star } from 'lucide-react';
import { useLanguage } from '../hooks/useLanguage';
import { useNavigate } from 'react-router-dom';

interface UserProfile {
  id: string;
  name: string;
  nameBn: string;
  email: string;
  phone: string;
  avatar: string;
  location: string;
  locationBn: string;
  joinDate: Date;
  rating: number;
  totalReviews: number;
  verified: boolean;
}

const ProfilePage: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'properties' | 'favorites' | 'settings'>('overview');

  // Mock user data
  const [user] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    nameBn: 'জন ডো',
    email: 'john.doe@example.com',
    phone: '+880 1712-345678',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150&h=150&fit=crop&crop=face',
    location: 'Dhaka, Bangladesh',
    locationBn: 'ঢাকা, বাংলাদেশ',
    joinDate: new Date('2023-01-15'),
    rating: 4.8,
    totalReviews: 24,
    verified: true
  });

  const stats = [
    {
      icon: Home,
      label: t('properties-listed', 'তালিকাভুক্ত সম্পত্তি', 'Properties Listed'),
      value: '3',
      color: 'text-teal-600'
    },
    {
      icon: Heart,
      label: t('favorites', 'পছন্দের তালিকা', 'Favorites'),
      value: '12',
      color: 'text-red-600'
    },
    {
      icon: MessageCircle,
      label: t('messages', 'বার্তা', 'Messages'),
      value: '8',
      color: 'text-blue-600'
    },
    {
      icon: Star,
      label: t('rating', 'রেটিং', 'Rating'),
      value: user.rating.toString(),
      color: 'text-yellow-600'
    }
  ];

  const menuItems = [
    {
      id: 'overview',
      icon: User,
      label: t('overview', 'সংক্ষিপ্ত বিবরণ', 'Overview')
    },
    {
      id: 'properties',
      icon: Home,
      label: t('my-properties', 'আমার সম্পত্তি', 'My Properties')
    },
    {
      id: 'favorites',
      icon: Heart,
      label: t('favorites', 'পছন্দের তালিকা', 'Favorites')
    },
    {
      id: 'settings',
      icon: Settings,
      label: t('settings', 'সেটিংস', 'Settings')
    }
  ];

  const handleEditProfile = () => {
    navigate('/profile/edit');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-gray-50 ${stat.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        <p className="text-sm text-gray-600">{stat.label}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('recent-activity', 'সাম্প্রতিক কার্যকলাপ', 'Recent Activity')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">
                    {t('activity-1', 'একটি নতুন সম্পত্তি তালিকাভুক্ত করেছেন', 'Listed a new property')} - 2 {t('days-ago', 'দিন আগে', 'days ago')}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">
                    {t('activity-2', 'একটি বার্তা পেয়েছেন', 'Received a message')} - 3 {t('days-ago', 'দিন আগে', 'days ago')}
                  </p>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <p className="text-sm text-gray-700">
                    {t('activity-3', 'একটি সম্পত্তি পছন্দের তালিকায় যোগ করেছেন', 'Added a property to favorites')} - 5 {t('days-ago', 'দিন আগে', 'days ago')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'properties':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {t('my-properties', 'আমার সম্পত্তি', 'My Properties')}
              </h3>
              <button 
                onClick={() => navigate('/add-property')}
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 transition-colors"
              >
                {t('add-property', 'সম্পত্তি যোগ করুন', 'Add Property')}
              </button>
            </div>
            <div className="text-center py-12">
              <Home className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">
                {t('no-properties-yet', 'এখনো কোন সম্পত্তি তালিকাভুক্ত করেননি', 'No properties listed yet')}
              </p>
            </div>
          </div>
        );

      case 'favorites':
        return (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              {t('favorite-properties', 'পছন্দের সম্পত্তি', 'Favorite Properties')}
            </h3>
            <div className="text-center py-12">
              <Heart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <p className="text-gray-600">
                {t('no-favorites-yet', 'এখনো কোন পছন্দের সম্পত্তি নেই', 'No favorite properties yet')}
              </p>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Account Settings */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {t('account-settings', 'অ্যাকাউন্ট সেটিংস', 'Account Settings')}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t('email-notifications', 'ইমেইল বিজ্ঞপ্তি', 'Email Notifications')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('receive-updates', 'আপডেট এবং বার্তা পান', 'Receive updates and messages')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      {t('sms-notifications', 'SMS বিজ্ঞপ্তি', 'SMS Notifications')}
                    </p>
                    <p className="text-sm text-gray-600">
                      {t('receive-sms', 'গুরুত্বপূর্ণ আপডেট SMS এ পান', 'Receive important updates via SMS')}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-teal-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-white rounded-lg border border-red-200 p-6">
              <h3 className="text-lg font-semibold text-red-900 mb-4">
                {t('danger-zone', 'বিপদজনক এলাকা', 'Danger Zone')}
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  <p className="font-medium text-red-900">
                    {t('deactivate-account', 'অ্যাকাউন্ট নিষ্ক্রিয় করুন', 'Deactivate Account')}
                  </p>
                  <p className="text-sm text-red-600">
                    {t('temporarily-disable', 'সাময়িকভাবে আপনার অ্যাকাউন্ট নিষ্ক্রিয় করুন', 'Temporarily disable your account')}
                  </p>
                </button>
                <button className="w-full text-left p-3 border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
                  <p className="font-medium text-red-900">
                    {t('delete-account', 'অ্যাকাউন্ট মুছে ফেলুন', 'Delete Account')}
                  </p>
                  <p className="text-sm text-red-600">
                    {t('permanently-delete', 'স্থায়ীভাবে আপনার অ্যাকাউন্ট মুছে ফেলুন', 'Permanently delete your account')}
                  </p>
                </button>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pb-20">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-6">
            <div className="relative">
              <img
                src={user.avatar}
                alt={language === 'bn' ? user.nameBn : user.name}
                className="w-24 h-24 rounded-full object-cover border-4 border-white/20"
              />
              {user.verified && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">
                  {language === 'bn' ? user.nameBn : user.name}
                </h1>
                {user.verified && (
                  <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                    {t('verified', 'যাচাইকৃত', 'Verified')}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  <span>{language === 'bn' ? user.locationBn : user.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} />
                  <span>{user.rating} ({user.totalReviews} {t('reviews', 'রিভিউ', 'reviews')})</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 mt-3 text-sm text-white/80">
                <div className="flex items-center gap-1">
                  <Mail size={16} />
                  <span>{user.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone size={16} />
                  <span>{user.phone}</span>
                </div>
              </div>
            </div>

            <button 
              onClick={handleEditProfile}
              className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
            >
              <Edit size={16} />
              {t('edit-profile', 'প্রোফাইল সম্পাদনা', 'Edit Profile')}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white rounded-lg border border-gray-200 p-4">
              <nav className="space-y-2">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`
                        w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left
                        ${activeTab === item.id
                          ? 'bg-teal-50 text-teal-700 border border-teal-200'
                          : 'text-gray-700 hover:bg-gray-50'
                        }
                      `}
                    >
                      <Icon size={18} />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
                
                <hr className="my-4" />
                
                <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-left text-red-600 hover:bg-red-50">
                  <LogOut size={18} />
                  <span className="font-medium">{t('logout', 'লগ আউট', 'Logout')}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;