import React, { useEffect, useState, useMemo } from 'react';
import { useFilters } from './FilterContext';
import { FilterDropdown } from '@/components/forms/FilterDropdown';
import { useTranslation } from 'react-i18next';
import type { components } from '@/types/schema';
import { associationService } from '@/api/associationService';
import { cn } from '@/utils/cn';

// Import ENUMs from schema for type safety
type EnumEventType = components['schemas']['EnumEventType'];
type EnumOrganizerType = components['schemas']['EnumOrganizerType'];
type EnumLocationType = components['schemas']['EnumLocationType'];
type AssociationSimple = components['schemas']['AssociationSimple'];

// --- MOCK DATA (as endpoints are not available) ---
const MOCK_FACULTIES: { value: string; label: string }[] = [
  { value: 'FIESC', label: 'FIESC' },
  { value: 'FEAA', label: 'FEAA' },
  { value: 'FMF', label: 'FMF' },
  { value: 'FLSC', label: 'FLSC' },
];
const MOCK_DEPARTMENTS: { value: string; label: string }[] = [
  { value: 'C', label: 'Calculatoare' },
  { value: 'AC', label: 'Automatică' },
];

const ALL_EVENT_TYPES: EnumEventType[] = ['ACADEMIC', 'SOCIAL', 'SPORTS', 'CAREER', 'VOLUNTEERING', 'WORKSHOP'];
const ALL_ORGANIZER_TYPES: EnumOrganizerType[] = ['STUDENT_ORG', 'UNIVERSITY_DEPT', 'COMPANY', 'OTHER'];
const ALL_LOCATION_TYPES: EnumLocationType[] = ['IN_CAMPUS', 'IN_CITY', 'OUTSIDE_CITY', 'ONLINE'];

interface SearchBarSectionProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export const SearchBarSection: React.FC<SearchBarSectionProps> = ({ searchQuery, onSearchChange }) => {
  const { t } = useTranslation();
  const [associations, setAssociations] = useState<AssociationSimple[]>([]);

  // Get all state and setters from context
  const {
    selectedCategories, setSelectedCategories, matchAll, setMatchAll,
    selectedAssociations, setSelectedAssociations,
    selectedFaculties, setSelectedFaculties,
    selectedDepartments, setSelectedDepartments,
    selectedOrganizerTypes, setSelectedOrganizerTypes,
    selectedLocationTypes, setSelectedLocationTypes,
    dateRange, updateDateRange,
  } = useFilters();

  // Fetch dynamic data
  useEffect(() => {
    const fetchAssociations = async () => {
      const data = await associationService.getAssociations();
      setAssociations(data);
    };
    fetchAssociations();
  }, []);

  // Memoize options to prevent re-computation on every render
  const categoryOptions = useMemo(() => ALL_EVENT_TYPES.map(type => ({ value: type, label: t(`event_types.${type}`) })), [t]);
  const associationOptions = useMemo(() => associations.map(assoc => ({ value: assoc.id!, label: assoc.name! })), [associations]);
  const organizerTypeOptions = useMemo(() => ALL_ORGANIZER_TYPES.map(type => ({ value: type, label: type.replace('_', ' ').toLowerCase() })), []);
  const locationTypeOptions = useMemo(() => ALL_LOCATION_TYPES.map(type => ({ value: type, label: type.replace('_', ' ').toLowerCase() })), []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateDateRange({ ...dateRange, [e.target.name]: e.target.value });
  };

  return (
    <header className="relative w-full flex flex-col bg-page/80 backdrop-blur-sm px-0 py-[50px]">
      <div className="flex mx-auto w-[90%] max-w-[1400px] h-[50px] items-center gap-2.5 px-4 py-[13px] bg-card rounded-[10px] mb-8 border border-border shadow-sm">
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={t('search.placeholder')}
          className="w-full text-xl font-light bg-transparent border-none outline-none text-main"
        />
      </div>

      <div className="mx-auto w-[90%] max-w-[1400px] flex flex-wrap items-center gap-4">
        {/* Event Type Filter */}
        <FilterDropdown
          title={t('filters.event_type')}
          options={categoryOptions}
          selected={selectedCategories}
          onChange={setSelectedCategories}
          matchAll={matchAll}
          onMatchAllChange={setMatchAll}
          className="w-48"
        />
        {/* Association Filter */}
        <FilterDropdown
          title={t('filters.association')}
          options={associationOptions}
          selected={selectedAssociations}
          onChange={setSelectedAssociations}
          className="w-48"
        />
        {/* Faculty Filter */}
        <FilterDropdown
          title={t('filters.faculty')}
          options={MOCK_FACULTIES}
          selected={selectedFaculties}
          onChange={setSelectedFaculties}
          className="w-48"
        />
        {/* Organizer Type Filter */}
        <FilterDropdown
          title={t('filters.organizer_type')}
          options={organizerTypeOptions}
          selected={selectedOrganizerTypes}
          onChange={setSelectedOrganizerTypes}
          className="w-48"
        />
        {/* Location Filter */}
        <FilterDropdown
          title={t('filters.location')}
          options={locationTypeOptions}
          selected={selectedLocationTypes}
          onChange={setSelectedLocationTypes}
          className="w-48"
        />

        {/* Date Range Filter */}
        <div className="flex items-center gap-2 w-48">
            <input
                type="date"
                name="start"
                value={dateRange.start}
                onChange={handleDateChange}
                className={cn('input-field w-full')}
            />
             <span className='text-muted'>-</span>
            <input
                type="date"
                name="end"
                value={dateRange.end}
                onChange={handleDateChange}
                className={cn('input-field w-full')}
            />
        </div>
      </div>
    </header>
  );
};