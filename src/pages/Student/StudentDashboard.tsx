// src/pages/student/StudentDashboard.tsx
import { useState } from "react";
import { HeaderSection } from "./components/HeaderSection";
import { SearchBarSection } from "./components/SearchBarSection";
import { EventListSection } from "./components/EventListSection";
import { FilterProvider } from "./components/FilterContext";
import { events } from "./data/eventsData";
import { BottomNav } from "./components/BottomNav";

export const StudentDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <FilterProvider>
      <div className="relative min-h-screen pb-32 bg-white">
        <HeaderSection />
        <SearchBarSection searchQuery={searchQuery} onSearchChange={setSearchQuery} />
        <main className="relative z-10 w-full px-4 mx-0 -mt-20">
          <EventListSection events={events} searchQuery={searchQuery} />
        </main>
        <BottomNav />
      </div>
    </FilterProvider>
  );
};