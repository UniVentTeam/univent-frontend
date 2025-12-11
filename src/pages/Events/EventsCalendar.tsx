import React, { useState } from "react";
import { events as eventsData } from "..//Student/data/eventsData";

type EventType =
  | "social"
  | "academic"
  | "career"
  | "volunteering"
  | "sports";

interface Event {
  id: string;
  title: string;
  type: EventType;
  date: string; 
  time?: string;
  location?: string;
  organizer?: string;
}

const FILTERS: { label: string; value: EventType }[] = [
  { label: "Social", value: "social" },
  { label: "Academic", value: "academic" },
  { label: "Career", value: "career" },
  { label: "Volunteering", value: "volunteering" },
  { label: "Sports", value: "sports" },
];

// Transformăm datele din eventsdata.ts
const transformEvents = (rawEvents: typeof eventsData): Event[] => {
  return rawEvents.map((evt) => {
    let dateOnly = evt.date.split(" *")[0]; // ia partea de data înainte de "*"
    let time = evt.date.includes("*") ? evt.date.split("*")[1].trim() : undefined;

    return {
      id: evt.id,
      title: evt.title,
      type: evt.category as EventType,
      date: dateOnly,
      time,
      location: evt.location,
      organizer: evt.organizer,
    };
  });
};

const EVENTS: Event[] = transformEvents(eventsData);

const EventCalendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);
  const [selectedFilters, setSelectedFilters] = useState<EventType[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const toggleFilter = (value: EventType) => {
    setSelectedFilters((filters) =>
      filters.includes(value)
        ? filters.filter((f) => f !== value)
        : [...filters, value]
    );
    setSelectedDate(null);
  };

  const filteredEvents =
    selectedFilters.length === 0
      ? EVENTS
      : EVENTS.filter((evt) => selectedFilters.includes(evt.type));

  const eventsByDate: Record<string, Event[]> = {};
  filteredEvents.forEach((evt) => {
    if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
    eventsByDate[evt.date].push(evt);
  });

  const prevMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = Array.from({ length: firstDay }, () => null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  return (
    <div className="h-screen overflow-y-auto bg-gray-50 relative">
      <div className="max-w-7xl mx-auto p-4 pb-32">
        {/* Header luna + filtre */}
        <div className="flex items-center justify-between mb-4 bg-blue-600 text-white rounded-lg p-4 sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="px-2 py-1 bg-blue-400 rounded hover:bg-blue-500">
              {"<"}
            </button>
            <h2 className="text-2xl font-bold">{monthName} {year}</h2>
            <button onClick={nextMonth} className="px-2 py-1 bg-blue-400 rounded hover:bg-blue-500">
              {">"}
            </button>
          </div>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.value}
                className={`px-3 py-1 rounded-full text-sm ${
                  selectedFilters.includes(f.value)
                    ? "bg-white text-blue-600"
                    : "bg-blue-300 text-white"
                }`}
                onClick={() => toggleFilter(f.value)}
              >
                {f.label}
              </button>
            ))}
            <button
              className="px-3 py-1 rounded-full text-sm bg-blue-200 text-white"
              onClick={() => {
                setSelectedFilters([]);
                setSelectedDate(null);
              }}
            >
              Clear
            </button>
          </div>
        </div>

        {/* Calendar */}
        <div className="grid grid-cols-7 gap-0 border">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-bold text-center border-b border-r bg-blue-100 p-1 sticky top-[64px] z-5">
              {day}
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            const dateStr = day ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}` : "";
            const dayEvents = day && eventsByDate[dateStr] ? eventsByDate[dateStr] : [];

            return (
              <div
                key={idx}
                className={`h-24 border border-gray-200 p-1 flex flex-col cursor-pointer ${
                  selectedDate === dateStr ? "bg-blue-100" : "bg-white"
                }`}
                onClick={() => day && setSelectedDate(dateStr)}
              >
                <div className="text-right font-bold">{day}</div>
                <div className="flex flex-col gap-0.5 overflow-y-auto text-xs">
                  {dayEvents.slice(0, 3).map((evt) => (
                    <span
                      key={evt.id}
                      className={`px-1 rounded text-white ${
                        evt.type === "social"
                          ? "bg-pink-400"
                          : evt.type === "academic"
                          ? "bg-purple-400"
                          : evt.type === "career"
                          ? "bg-green-500"
                          : evt.type === "volunteering"
                          ? "bg-yellow-400"
                          : "bg-blue-400"
                      }`}
                    >
                      {evt.title}
                    </span>
                  ))}
                  {dayEvents.length > 3 && (
                    <span className="text-gray-500 text-[9px]">+{dayEvents.length - 3} more</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalii evenimente */}
        {selectedDate && eventsByDate[selectedDate] && (
          <div className="mt-4 p-4 border rounded shadow bg-gray-50">
            <h3 className="font-bold text-lg mb-2">
              Events on {new Date(selectedDate).toDateString()}
            </h3>
            {eventsByDate[selectedDate].map((evt) => (
              <div key={evt.id} className="mb-2 p-2 border rounded">
                <div className="font-semibold">{evt.title}</div>
                <div className="text-sm text-gray-600">{evt.type}</div>
                {evt.time && <div className="text-sm">{evt.time}</div>}
                {evt.location && <div className="text-sm">Location: {evt.location}</div>}
                {evt.organizer && <div className="text-sm">Organizer: {evt.organizer}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCalendar;
