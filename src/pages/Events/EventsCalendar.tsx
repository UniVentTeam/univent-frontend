import React, { useState } from "react";
import { events as eventsData } from "./data/eventsData";

/* ================= TYPES ================= */

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
  association?: string;
  faculty?: string;
}

/* ================= CONSTANTS ================= */

const FILTERS: { label: string; value: EventType }[] = [
  { label: "Social", value: "social" },
  { label: "Academic", value: "academic" },
  { label: "Career", value: "career" },
  { label: "Volunteering", value: "volunteering" },
  { label: "Sports", value: "sports" },
];

/* ================= DATA TRANSFORM ================= */

const transformEvents = (rawEvents: typeof eventsData): Event[] => {
  return rawEvents.map((evt) => {
    const dateOnly = evt.date.split(" *")[0];
    const time = evt.date.includes("*")
      ? evt.date.split("*")[1].trim()
      : undefined;

    return {
      id: evt.id,
      title: evt.title,
      type: evt.category as EventType,
      date: dateOnly,
      time,
      location: evt.location || undefined,
      organizer: evt.organizer || undefined,
      association: evt.associationId || undefined,
      faculty: evt.faculty || undefined,
    };
  });
};

const EVENTS: Event[] = transformEvents(eventsData);

const unique = (arr: (string | undefined)[]) =>
  Array.from(new Set(arr.filter(Boolean))) as string[];

/* ================= COMPONENT ================= */

const EventCalendar: React.FC = () => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState<Date>(today);

  /* ---- FILTER STATES ---- */
  const [eventType, setEventType] = useState<EventType | "">("");
  const [association, setAssociation] = useState("");
  const [faculty, setFaculty] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [location, setLocation] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  /* ---- SELECTED DAY ---- */
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  /* ---- DROPDOWN STYLE ---- */
  const dropdownClass =
    "px-2 py-1 text-xs rounded border bg-white text-black border-gray-300 " +
    "dark:bg-gray-800 dark:text-white dark:border-gray-600 " +
    "focus:outline-none focus:ring-1 focus:ring-blue-500";

  const ASSOCIATIONS = unique(EVENTS.map((e) => e.association));
  const FACULTIES = unique(EVENTS.map((e) => e.faculty));
  const ORGANIZERS = unique(EVENTS.map((e) => e.organizer));
  const LOCATIONS = unique(EVENTS.map((e) => e.location));

  /* ---- FILTER EVENTS ---- */
  const filteredEvents = EVENTS.filter((evt) => {
    if (eventType && evt.type !== eventType) return false;
    if (association && evt.association !== association) return false;
    if (faculty && evt.faculty !== faculty) return false;
    if (organizer && evt.organizer !== organizer) return false;
    if (location && evt.location !== location) return false;
    if (dateFrom && evt.date < dateFrom) return false;
    if (dateTo && evt.date > dateTo) return false;
    return true;
  });

  /* ---- GROUP BY DATE ---- */
  const eventsByDate: Record<string, Event[]> = {};
  filteredEvents.forEach((evt) => {
    if (!eventsByDate[evt.date]) eventsByDate[evt.date] = [];
    eventsByDate[evt.date].push(evt);
  });

  /* ---- CALENDAR LOGIC ---- */
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const monthName = currentMonth.toLocaleString("default", { month: "long" });

  return (
    <div className="relative h-screen overflow-y-auto bg-bg text-text">
      <div className="p-4 pb-32 mx-auto max-w-7xl">

        {/* ===== HEADER ===== */}
        <div className="sticky top-0 z-10 flex items-center justify-between p-4 mb-2 text-white bg-blue-600 rounded-lg">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}
              className="px-2 py-1 bg-blue-400 rounded"
            >
              {"<"}
            </button>

            <h2 className="text-xl font-bold">
              {monthName} {year}
            </h2>

            <button
              onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}
              className="px-2 py-1 bg-blue-400 rounded"
            >
              {">"}
            </button>
          </div>
        </div>

        {/* ===== FILTERS ===== */}
        <div className="flex flex-wrap items-center gap-1 mb-3">
          <select
            value={eventType}
            onChange={(e) => setEventType(e.target.value as EventType | "")}
            className={`${dropdownClass} w-[120px]`}
          >
            <option value="">Event type</option>
            {FILTERS.map((f) => (
              <option key={f.value} value={f.value}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            value={association}
            onChange={(e) => setAssociation(e.target.value)}
            className={`${dropdownClass} w-[140px]`}
          >
            <option value="">Association</option>
            {ASSOCIATIONS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>

          <select
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className={`${dropdownClass} w-[120px]`}
          >
            <option value="">Faculty</option>
            {FACULTIES.map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>

          <select
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
            className={`${dropdownClass} w-[140px]`}
          >
            <option value="">Organizer</option>
            {ORGANIZERS.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className={`${dropdownClass} w-[120px]`}
          >
            <option value="">Location</option>
            {LOCATIONS.map((l) => (
              <option key={l}>{l}</option>
            ))}
          </select>

          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className={`${dropdownClass} w-[120px]`}
          />

          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className={`${dropdownClass} w-[120px]`}
          />
        </div>

        {/* ===== CALENDAR ===== */}
        <div className="grid grid-cols-7 border border-gray-300 dark:border-gray-700">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-1 font-bold text-center bg-blue-100 border-b border-r dark:bg-gray-800"
            >
              {day}
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            const dateStr = day
              ? `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
              : "";

            const dayEvents =
              day && eventsByDate[dateStr] ? eventsByDate[dateStr] : [];

            return (
              <div
                key={idx}
                onClick={() => {
                  if (dayEvents.length) setSelectedDate(dateStr);
                }}
                className={`h-24 p-1 border cursor-pointer ${
                  dayEvents.length
                    ? "hover:bg-blue-50 dark:hover:bg-gray-800"
                    : ""
                }`}
              >
                <div className="font-bold text-right">{day}</div>

                <div className="flex flex-col gap-0.5 text-xs">
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
                          ? "bg-yellow-400 text-black"
                          : "bg-blue-400"
                      }`}
                    >
                      {evt.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== EVENT DETAILS ===== */}
        {selectedDate && eventsByDate[selectedDate] && (
          <div className="p-4 mt-4 bg-white border rounded-lg dark:bg-gray-900 dark:border-gray-700">
            <h3 className="mb-3 text-sm font-semibold text-gray-600 dark:text-gray-300">
              Events on {selectedDate}
            </h3>

            <div className="flex flex-col gap-3">
              {eventsByDate[selectedDate].map((evt) => (
                <div
                  key={evt.id}
                  className="p-3 border rounded-md bg-gray-50 dark:bg-gray-800 dark:border-gray-700"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{evt.title}</span>
                    {evt.time && (
                      <span className="text-xs text-gray-500">{evt.time}</span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-gray-500 space-y-0.5">
                    {evt.location && <div>📍 {evt.location}</div>}
                    {evt.organizer && <div>👤 {evt.organizer}</div>}
                    {evt.faculty && <div>🎓 {evt.faculty}</div>}
                    {evt.association && <div>🏛 {evt.association}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default EventCalendar;