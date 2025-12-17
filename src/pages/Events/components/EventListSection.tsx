import React from 'react';
import { useFilters } from './FilterContext';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
// IMPORTAT: Iconițe, deoarece API-ul nu ne dă imagini pentru iconițe
import { Calendar, MapPin, User } from 'lucide-react';

// 1. Definim Event exact cum vine din API, nu cum era în Mock
interface Organizer {
  id: string;
  name: string;
  type: string;
}

interface Event {
  id: string;
  title: string;
  coverImageUrl?: string; // API trimite asta în loc de 'backgroundImage'
  startAt?: string; // API trimite asta în loc de 'date'
  locationName?: string; // API trimite asta în loc de 'location'
  organizers?: Organizer[];
  category?: string;

  // Opționale pentru filtre
  faculty?: string | null;
  associationId?: string | null;
}

interface EventListSectionProps {
  events: Event[];
  searchQuery?: string;
}

// PĂSTRAT IDENTIC: Funcția ta de tag-uri
const getTagClass = (category: string = '') => {
  switch (category.toLowerCase()) {
    case 'career':
      return 'tag-career';
    case 'academic':
      return 'tag-academic';
    case 'social':
      return 'tag-social';
    case 'volunteering':
      return 'tag-volunteering';
    case 'sports':
      return 'tag-sports';
    default:
      return 'tag';
  }
};

export const EventListSection: React.FC<EventListSectionProps> = ({ events, searchQuery = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { selectedCategories, dateRange, selectedAssociations, selectedFaculties } = useFilters();

  // --- LOGICA ADAPTATĂ PENTRU API ---
  const filteredEvents = events.filter((event) => {
    if (!event) return false;

    // 1. Search Query
    const query = searchQuery.toLowerCase();
    // Verificăm câmpurile care există în API
    const titleMatch = event.title?.toLowerCase().includes(query) || false;
    const locationMatch = event.locationName?.toLowerCase().includes(query) || false;
    const organizerMatch =
      event.organizers?.some((org) => org.name.toLowerCase().includes(query)) || false;
    const categoryMatch = event.category?.toLowerCase().includes(query) || false;

    if (query && !titleMatch && !locationMatch && !organizerMatch && !categoryMatch) {
      return false;
    }

    // 2. Date Range (Fix pentru eroarea .split('*'))
    // API-ul trimite data ISO, deci o convertim direct
    const eventDate = event.startAt ? new Date(event.startAt) : new Date();
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    if ((startDate && eventDate < startDate) || (endDate && eventDate > endDate)) {
      return false;
    }

    // 3. Category Filter
    if (selectedCategories.length > 0) {
      const eventCategory = (event.category || 'General').toUpperCase();
      if (!selectedCategories.includes(eventCategory)) {
        return false;
      }
    }

    // 4. Association & Faculty Filters
    if (selectedAssociations.length > 0) {
      const hasAssoc = event.organizers?.some((org) => selectedAssociations.includes(org.id));
      if (!hasAssoc && !selectedAssociations.includes(event.associationId || '')) return false;
    }
    if (selectedFaculties.length > 0 && !selectedFaculties.includes(event.faculty || '')) {
      return false;
    }

    return true;
  });

  // Helper pentru a formata data frumos (înlocuiește string-ul brut din Mock)
  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    // Ex: 25 Nov, 14:00
    return d.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    // PĂSTRAT IDENTIC: Grid-ul tău cu minmax(600px)
    <section className="mt-[100px] grid gap-6 px-4 py-8 grid-cols-[repeat(auto-fill,minmax(600px,1fr))]">
      {filteredEvents.map((event) => {
        // Mapăm datele din API la variabile de afișare
        const displayCategory = event.category || event.organizers?.[0]?.type || 'Eveniment';
        const displayLocation = event.locationName || 'Locație';
        const displayOrganizer = event.organizers?.[0]?.name || 'Organizator';
        const displayDate = formatDate(event.startAt);

        // MODIFICARE OBLIGATORIE: Imaginea vine ca URL, deci o punem în style
        const bgStyle = event.coverImageUrl
          ? { backgroundImage: `url(${event.coverImageUrl})` }
          : { backgroundColor: '#374151' };

        return (
          <article
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className={cn(
              // PĂSTRAT IDENTIC: Clasele tale originale
              `relative rounded-2xl overflow-hidden bg-cover bg-center h-72 md:h-80 lg:h-96`,
              // Am scos 'event.backgroundImage' de aici pentru că nu mai e o clasă CSS
              `transition-all duration-300 ease-out`,
              `hover:scale-[1.03] hover:-translate-y-1 hover:brightness-105 hover:shadow-xl`,
            )}
            style={bgStyle} // Aici aplicăm imaginea din API
          >
            {/* TAG - PĂSTRAT IDENTIC */}
            <div
              className={cn(
                'tag',
                getTagClass(displayCategory),
                'absolute top-3 left-3 px-3 py-1 rounded-md text-sm md:text-base lg:text-lg font-bold capitalize',
              )}
            >
              {displayCategory}
            </div>

            {/* OVERLAY - PĂSTRAT IDENTIC */}
            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
              <h2 className="mb-2 text-xl font-bold md:text-2xl lg:text-3xl">{event.title}</h2>

              {/* RÂNDURILE CU ICONIȚE */}
              {/* Am înlocuit <img> cu Componente React (Calendar, MapPin) dar cu aceleași clase w-4 h-4 mr-2 */}

              <div className="flex items-center mb-1 text-sm md:text-base">
                <Calendar className="w-4 h-4 mr-2" />
                <time>{displayDate}</time>
              </div>

              <div className="flex items-center mb-1 text-sm md:text-base">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{displayLocation}</span>
              </div>

              <div className="flex items-center text-sm md:text-base">
                <User className="w-4 h-4 mr-2" />
                <span>{displayOrganizer}</span>
              </div>
            </div>
          </article>
        );
      })}

      {filteredEvents.length === 0 && (
        <p className="text-lg text-center text-gray-500 col-span-full md:text-xl">
          {t('events.noEvents')}
        </p>
      )}
    </section>
  );
};
