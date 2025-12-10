import React from "react";
import { useFilters } from "./FilterContext";
import { cn } from "@/utils/cn";

interface Event {
  id: string | number;
  title: string;
  date: string;
  location: string;
  organizer: string;
  category: string;
  backgroundImage: string;
  dateIcon: string;
  locationIcon: string;
  organizerIcon: string;
}

interface EventListSectionProps {
  events: Event[];
  searchQuery?: string;
}

const getTagClass = (category: string) => {
  switch (category.toLowerCase()) {
    case "career":
      return "tag-career";
    case "academic":
      return "tag-academic";
    case "social":
      return "tag-social";
    case "volunteering":
      return "tag-volunteering";
    case "sports":
      return "tag-sports";
    default:
      return "tag";
  }
};

export const EventListSection: React.FC<EventListSectionProps> = ({ events, searchQuery = "" }) => {
  const { selectedCategories, dateRange } = useFilters();

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(event.category.toLowerCase());

    const eventDate = new Date(event.date.split("*")[0].trim());
    const startDate = dateRange.start ? new Date(dateRange.start) : null;
    const endDate = dateRange.end ? new Date(dateRange.end) : null;

    const matchesDate =
      (!startDate || eventDate >= startDate) &&
      (!endDate || eventDate <= endDate);

    const query = searchQuery.toLowerCase();
    const matchesSearch =
      !query ||
      event.title.toLowerCase().includes(query) ||
      event.location.toLowerCase().includes(query) ||
      event.organizer.toLowerCase().includes(query) ||
      event.category.toLowerCase().includes(query);

    return matchesCategory && matchesDate && matchesSearch;
  });

  return (
    <section className="mt-[100px] grid gap-6 px-4 py-8 grid-cols-[repeat(auto-fill,minmax(600px,1fr))]">
  {filteredEvents.map((event) => (
    <article
  key={event.id}
  className={cn(
    `relative rounded-2xl overflow-hidden bg-cover bg-center h-72 md:h-80 lg:h-96`,
    event.backgroundImage,
    `transition-all duration-300 ease-out`,
    `hover:scale-[1.03] hover:-translate-y-1 hover:brightness-105 hover:shadow-xl`
  )}
>

      <div className={cn("tag", getTagClass(event.category), "absolute top-3 left-3 px-3 py-1 rounded-md text-sm md:text-base lg:text-lg font-bold capitalize")}>
        {event.category}
      </div>

      <div className="absolute inset-0 flex flex-col justify-end p-4 text-white bg-gradient-to-t from-black/60 to-transparent">
        <h2 className="mb-2 text-xl font-bold md:text-2xl lg:text-3xl">{event.title}</h2>

        <div className="flex items-center mb-1 text-sm md:text-base">
          <img src={event.dateIcon} className="w-4 h-4 mr-2" alt="Date" />
          <time>{event.date}</time>
        </div>

        <div className="flex items-center mb-1 text-sm md:text-base">
          <img src={event.locationIcon} className="w-4 h-4 mr-2" alt="Location" />
          <span>{event.location}</span>
        </div>

        <div className="flex items-center text-sm md:text-base">
          <img src={event.organizerIcon} className="w-4 h-4 mr-2" alt="Organizer" />
          <span>{event.organizer}</span>
        </div>
      </div>
    </article>
  ))}

  {filteredEvents.length === 0 && (
    <p className="text-lg text-center text-gray-500 col-span-full md:text-xl">
      No events match your filters.
    </p>
  )}
</section>
  );
};