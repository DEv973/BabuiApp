import React from 'react';
import {
  getDivisions,
  getDistrictsForDivision,
  getThanasForDistrict,
  getAreasForThana,
} from '../data/bangladeshLocations';
import { useLanguage } from '../hooks/useLanguage';

interface BangladeshLocationSearchProps {
  selectedDivision?: string;
  selectedDistrict?: string;
  selectedThana?: string;
  selectedArea?: string;
  onDivisionChange: (divisionId: string) => void;
  onDistrictChange: (districtId: string) => void;
  onThanaChange: (thanaId: string) => void;
  onAreaChange: (areaId: string) => void;
  className?: string;
}

const BangladeshLocationSearch: React.FC<BangladeshLocationSearchProps> = ({
  selectedDivision,
  selectedDistrict,
  selectedThana,
  selectedArea,
  onDivisionChange,
  onDistrictChange,
  onThanaChange,
  onAreaChange,
  className = '',
}) => {
  const { language, t } = useLanguage();

  const divisions = getDivisions();
  const districts = selectedDivision ? getDistrictsForDivision(selectedDivision) : [];
  const thanas = selectedDistrict ? getThanasForDistrict(selectedDistrict) : [];
  const areas = selectedThana ? getAreasForThana(selectedThana) : [];

  // Handlers that reset child fields when a parent changes
  const handleDivisionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const divisionId = e.target.value;
    onDivisionChange(divisionId);
    onDistrictChange('');
    onThanaChange('');
    onAreaChange('');
  };
  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const districtId = e.target.value;
    onDistrictChange(districtId);
    onThanaChange('');
    onAreaChange('');
  };
  const handleThanaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const thanaId = e.target.value;
    onThanaChange(thanaId);
    onAreaChange('');
  };
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const areaId = e.target.value;
    onAreaChange(areaId);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ${className}`}>
      {/* Division */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('division', 'বিভাগ', 'Division')}
        </label>
        <select
          value={selectedDivision || ''}
          onChange={handleDivisionChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
        >
          <option value="">{t('select-division', 'বিভাগ নির্বাচন করুন', 'Select Division')}</option>
          {divisions.map((division) => (
            <option key={division.id} value={division.id}>
              {language === 'bn' ? division.nameBn : division.name}
            </option>
          ))}
        </select>
      </div>
      {/* District */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('district', 'জেলা', 'District')}
        </label>
        <select
          value={selectedDistrict || ''}
          onChange={handleDistrictChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
          disabled={!selectedDivision}
        >
          <option value="">{t('select-district', 'জেলা নির্বাচন করুন', 'Select District')}</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {language === 'bn' ? district.nameBn : district.name}
            </option>
          ))}
        </select>
      </div>
      {/* Thana */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('thana', 'থানা', 'Thana')}
        </label>
        <select
          value={selectedThana || ''}
          onChange={handleThanaChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
          disabled={!selectedDistrict}
        >
          <option value="">{t('select-thana', 'থানা নির্বাচন করুন', 'Select Thana')}</option>
          {thanas.map((thana) => (
            <option key={thana.id} value={thana.id}>
              {language === 'bn' ? thana.nameBn : thana.name}
            </option>
          ))}
        </select>
      </div>
      {/* Area */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('area', 'এলাকা', 'Area')}
        </label>
        <select
          value={selectedArea || ''}
          onChange={handleAreaChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 bg-white"
          disabled={!selectedThana}
        >
          <option value="">{t('select-area', 'এলাকা নির্বাচন করুন', 'Select Area')}</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {language === 'bn' ? area.nameBn : area.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default BangladeshLocationSearch;