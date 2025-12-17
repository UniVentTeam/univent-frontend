// src/pages/Events/EventsList.tsx
import { useState } from "react";
import { SearchBarSection } from "./components/SearchBarSection";
import { EventListSection } from "./components/EventListSection";
import { FilterProvider } from "./components/FilterContext";
import { events } from "./data/eventsData";

const EventsList = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FilterProvider>
      <div className="relative min-h-screen pb-32 transition-colors duration-300 bg-page text-main">
        <SearchBarSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="relative z-10 w-full px-4 mx-0 -mt-20 transition-colors duration-300"
          style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}>
          <EventListSection
            events={events}
            searchQuery={searchQuery}
          />
        </main>

      </div>
    </FilterProvider>
  );
};

export default EventsList;
