// src/pages/Events/EventsList.tsx
import { useEffect, useState } from 'react';
import { SearchBarSection } from './components/SearchBarSection';
import { EventListSection } from './components/EventListSection';
import { FilterProvider, useFilters } from './components/FilterContext';
import type { components } from '@/types/schema.ts';
import { eventService } from '@/api/eventService.ts';

type EventPreview = components['schemas']['EventPreview'];
type EventFilterQuery = components['schemas']['EventFilterQuery'];

const EventsList = () => {
  const [events, setEvents] = useState<EventPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    selectedCategories,
    matchAll,
    selectedAssociations,
    selectedFaculties,
    selectedDepartments,
    selectedOrganizerTypes,
    selectedLocationTypes,
    dateRange,
  } = useFilters();

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);

      try {
        console.log('filters');

        const filters: EventFilterQuery = {
          page: 1,
          limit: 20,
          search: searchQuery || undefined,
          types: selectedCategories.length > 0 ? selectedCategories : undefined,
          matchAllTypes: matchAll,
          associationIds: selectedAssociations.length > 0 ? selectedAssociations : undefined,
          organizerTypes: selectedOrganizerTypes.length > 0 ? selectedOrganizerTypes : undefined,
          locationTypes: selectedLocationTypes.length > 0 ? selectedLocationTypes : undefined,
          faculties: selectedFaculties.length > 0 ? selectedFaculties : undefined,
          departments: selectedDepartments.length > 0 ? selectedDepartments : undefined,
          dateFrom: dateRange.start || undefined,
          dateTo: dateRange.end || undefined,
          status: ['PUBLISHED'],
        };

        console.log('fff', filters);

        const response = await eventService.getEvents(filters);

        if (Array.isArray(response)) {
          setEvents(response);
        } else {
          setEvents([]);
        }
      } catch (error) {
        console.error('Eroare events:', error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    searchQuery,
    selectedCategories,
    matchAll,
    selectedAssociations,
    selectedFaculties,
    selectedDepartments,
    selectedOrganizerTypes,
    selectedLocationTypes,
    dateRange,
  ]);

  return (
    <div className="relative min-h-screen pb-32 transition-colors duration-300 bg-page text-main">
      <SearchBarSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <main
        className="relative z-10 w-full px-4 mx-0 -mt-20 transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p>Se încarcă evenimentele...</p>
          </div>
        ) : (
          <EventListSection events={events} />
        )}
      </main>
    </div>
  );
};

const EventsListWrapper = () => (
  <FilterProvider>
    <EventsList />
  </FilterProvider>
);

export default EventsListWrapper;
