import React from 'react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, User } from 'lucide-react';
import type { components } from '@/types/schema';

type Event = components['schemas']['EventPreview'];

interface EventListSectionProps {
  events: Event[];
}

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

export const EventListSection: React.FC<EventListSectionProps> = ({ events }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="mt-[100px] grid gap-6 px-4 py-8 grid-cols-[repeat(auto-fill,minmax(600px,1fr))]">
      {events.map((event) => {
        const displayCategory = event.organizers?.[0]?.name || 'Eveniment';
        const displayLocation = event.locationName || 'Locație';
        const displayOrganizer = event.organizers?.[0]?.name || 'Organizator';
        const displayDate = formatDate(event.startAt);

        const bgStyle = event.coverImageUrl
          ? { backgroundImage: `url(${event.coverImageUrl})` }
          : { backgroundColor: '#374151' };

        return (
          <article
            key={event.id}
            onClick={() => navigate(`/events/${event.id}`)}
            className={cn(
              `relative rounded-2xl overflow-hidden bg-cover bg-center h-72 md:h-80 lg:h-96`,
              `transition-all duration-300 ease-out`,
              `hover:scale-[1.03] hover:-translate-y-1 hover:brightness-105 hover:shadow-xl`,
            )}
            style={bgStyle}
          >
            <div
              className={cn(
                'tag',
                getTagClass(displayCategory),
                'absolute top-3 left-3 px-3 py-1 rounded-md text-sm md:text-base lg:text-lg font-bold capitalize',
              )}
            >
              {displayCategory}
            </div>

            <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
              <h2 className="mb-2 text-xl font-bold md:text-2xl lg:text-3xl">{event.title}</h2>

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

      {events.length === 0 && (
        <p className="text-lg text-center text-gray-500 col-span-full md:text-xl">
          {t('events.noEvents')}
        </p>
      )}
    </section>
  );
};
