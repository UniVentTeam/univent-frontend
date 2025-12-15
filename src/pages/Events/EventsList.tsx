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
      <div className="relative min-h-screen pb-32 bg-white">
        <SearchBarSection
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="relative z-10 w-full px-4 mx-0 -mt-20">
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
