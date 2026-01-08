import React, { useEffect, useState } from "react";
import { useTranslation } from 'react-i18next';
import { getEvents } from "@/api/client";
import { format } from "date-fns";

interface EventLogEntry {
  id: string;
  userInitials: string;
  userName: string;
  userDate: string;
  action: string;
  eventDate: string;
  status: string; // "PUBLISHED", "PENDING", "REJECTED"
}

export const EventLogSection = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<EventLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        // Fetch processed events (history)
        const data = await getEvents({ status: ['PUBLISHED', 'REJECTED'] }) as any;
        const events = data.events || [];

        // Map events to logs
        const mappedLogs: EventLogEntry[] = events.map((event: any) => {
          const organizer = event.organizers?.[0] || { name: "Unknown" };
          const date = new Date(event.startAt);

          let actionText = "";
          switch (event.status) {
            case "PENDING":
              actionText = "requested to organize event:";
              break;
            case "PUBLISHED":
              actionText = "published event:";
              break;
            case "REJECTED":
              actionText = "was rejected for event:";
              break;
            default:
              actionText = "created event:";
          }

          return {
            id: event.id,
            userInitials: organizer.name.substring(0, 2).toUpperCase(),
            userName: organizer.name,
            userDate: format(new Date(event.startAt), "dd-MM-yyyy"), // Using startAt as proxy for action date
            action: `${actionText} ${event.title}`,
            eventDate: format(new Date(event.startAt), "dd-MM-yyyy"),
            status: event.status
          };
        });

        setLogs(mappedLogs);
      } catch (error) {
        console.error("Failed to fetch event logs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading logs...</div>;
  }

  return (
    <section
      className="w-full max-w-[1200px] mx-auto mt-8 bg-white/80 rounded-2xl overflow-hidden p-4 md:p-6"
      aria-label="Event log section"
    >
      <h2 className="mb-4 text-2xl font-bold text-center md:text-3xl">
        {t('events.EventLog')}
      </h2>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[50px_1fr_2fr_120px] gap-4 font-medium text-black text-sm mb-2 px-3">
        <span>Org</span>
        <span>Association</span>
        <span>Action & Event</span>
        <span>Date</span>
      </div>

      {/* Event Entries */}
      <div className="flex flex-col gap-4">
        {logs.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No events found.</p>
        ) : (
          logs.map((entry) => (
            <div
              key={entry.id}
              className="grid grid-cols-[50px_1fr_2fr_120px] gap-4 items-center bg-white/50 rounded-xl p-2 md:p-3 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Initials */}
              <div className="flex items-center justify-center w-12 h-12 text-xl font-bold text-gray-600 bg-gray-200 rounded-lg">
                {entry.userInitials}
              </div>

              {/* User Name */}
              <div className="text-sm font-bold md:text-base text-gray-800">{entry.userName}</div>

              {/* Action */}
              <div className="text-sm md:text-base text-gray-700 truncate" title={entry.action}>
                {entry.action}
              </div>

              {/* Event Date */}
              <time className="text-sm md:text-base text-gray-500">{entry.eventDate}</time>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
