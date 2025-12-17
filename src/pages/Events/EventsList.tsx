// src/pages/Events/EventsList.tsx
import { useEffect, useState } from 'react';
import { SearchBarSection } from './components/SearchBarSection';
import { EventListSection } from './components/EventListSection';
import { FilterProvider } from './components/FilterContext';
import { events } from './data/eventsData';
import type { components } from '@/types/schema.ts';
import { eventService } from '@/api/eventService.ts';

type EventPreview = components['schemas']['EventPreview'];

const EventsList = () => {
  const [events, setEvents] = useState<EventPreview[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const filters = {
          title: searchQuery || undefined,
        };

        // Apelăm API-ul
        const response: any = await eventService.getEvents(filters);

        // FIX: Verificăm structura din imaginea ta (response.events)
        if (response && Array.isArray(response.events)) {
          setEvents(response.events);
        } else if (Array.isArray(response)) {
          // Fallback: dacă API-ul se schimbă și returnează direct lista
          setEvents(response);
        } else {
          setEvents([]); // Dacă nu găsim lista, punem array gol ca să nu crape .filter
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
  }, [searchQuery]);

  return (
    <FilterProvider>
      <div className="relative min-h-screen pb-32 transition-colors duration-300 bg-page text-main">
        <SearchBarSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />

        <main
          className="relative z-10 w-full px-4 mx-0 -mt-20 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
        >
          {/*<EventListSection events={events} searchQuery={searchQuery} />*/}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <p>Se încarcă evenimentele...</p>
              {/* Poți înlocui cu o componentă Spinner/Skeleton */}
            </div>
          ) : (
            <EventListSection
              events={events}
              searchQuery={searchQuery} // Dacă filtrarea se face pe server, acest prop ar putea fi redundant în EventListSection, depinde de implementare
            />
          )}
        </main>
      </div>
    </FilterProvider>
  );
};

export default EventsList;
