import { useState } from "react";
import { SearchBarSection } from "@/pages/Events/components/SearchBarSection";
import { EventListSection } from "@/pages/Events/components/EventListSection";
import { FilterProvider } from "@/pages/Events/components/FilterContext";
import { events } from "@/pages/Events/data/eventsData";

//  MOCK DATA
// evenimentele la care este înscris userul curent
const MOCK_REGISTERED_EVENT_IDS = ["1", "5", "8"];

const TicketsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const registeredEvents = events.filter(event =>
    MOCK_REGISTERED_EVENT_IDS.includes(event.id)
  );

  return (
    <FilterProvider>
      <div className="relative min-h-screen pb-32 text-black bg-white dark:bg-gray-900 dark:text-white">
        <SearchBarSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="relative z-10 w-full px-4 mx-0 -mt-20 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
          <EventListSection
            events={registeredEvents}
            searchQuery={searchQuery}
          />
        </main>
      </div>
    </FilterProvider>
  );
};

export default TicketsList;
