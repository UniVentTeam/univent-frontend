import React from "react";

interface EventLogEntry {
  id: number;
  userInitials: string;
  userName: string;
  userDate: string;
  action: string;
  eventDate: string;
}

export const EventLogSection = (): JSX.Element => {
  const eventLogData: EventLogEntry[] = [
    {
      id: 1,
      userInitials: "IP",
      userName: "Ion Porcilescu",
      userDate: "18-11-2025",
      action: "a solicitat organizarea unui eveniment:SPECIAL COACH USV",
      eventDate: "18-11-2025",
    },
    {
      id: 2,
      userInitials: "IP",
      userName: "Ion Porcilescu",
      userDate: "18-11-2025",
      action:
        "a fost respins la cererea organizarii evenimentului:SPECIAL COACH USV",
      eventDate: "18-11-2025",
    },
    {
      id: 3,
      userInitials: "BP",
      userName: "Bob Pantaloni",
      userDate: "20-11-2025",
      action: "a solicitat organizarea unui eveniment:SPECIAL COACH USV",
      eventDate: "20-11-2025",
    },
  ];

  return (
    <section
      className="w-full max-w-[1200px] mx-auto mt-8 bg-white/80 rounded-2xl overflow-hidden p-4 md:p-6"
      aria-label="Event log section"
    >
      <h2 className="mb-4 text-2xl font-bold text-center md:text-3xl">
        Event log
      </h2>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[50px_1fr_1fr_120px] gap-4 font-medium text-black text-sm mb-2">
        <span>User</span>
        <span>Name</span>
        <span>Action</span>
        <span>Date</span>
      </div>

      {/* Event Entries */}
      <div className="flex flex-col gap-4">
        {eventLogData.map((entry) => (
          <div
            key={entry.id}
            className="grid grid-cols-[50px_1fr_1fr_120px] gap-4 items-center bg-white/50 rounded-xl p-2 md:p-3 shadow-sm"
          >
            {/* Initials */}
            <div className="flex items-center justify-center w-12 h-12 text-xl font-light bg-gray-300 rounded-lg">
              {entry.userInitials}
            </div>

            {/* User Name */}
            <div className="text-sm font-bold md:text-base">{entry.userName}</div>

            {/* Action */}
            <div className="text-base md:text-lg">{entry.action}</div>

            {/* Event Date */}
            <time className="text-sm md:text-base">{entry.eventDate}</time>
          </div>
        ))}
      </div>
    </section>
  );
};
