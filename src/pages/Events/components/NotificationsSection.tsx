import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { getEvents, updateEventStatus } from '@/api/client';
import { Check, X } from 'lucide-react';

export const NotificationsSection = (): React.JSX.Element => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch PENDING events
  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await getEvents({ status: ['PENDING'] }) as any;
      setRequests(data.events || []);
    } catch (error) {
      console.error("Failed to fetch pending requests", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await updateEventStatus(id, 'PUBLISHED');
      // Remove from list or refresh
      fetchRequests();
    } catch (error) {
      console.error("Failed to approve", error);
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await updateEventStatus(id, 'REJECTED', 'Declined by admin');
      fetchRequests();
    } catch (error) {
      console.error("Failed to decline", error);
    }
  };

  if (loading) return <div className="text-center p-4">Loading requests...</div>;

  return (
    <section
      className="w-full max-w-[1200px] mx-auto mt-8 bg-white/80 rounded-2xl overflow-hidden p-4 md:p-6"
      aria-label="Notifications and Requests Section"
    >
      <h2 className="mb-4 text-2xl font-bold text-center md:text-3xl">{t('events.Requests')}</h2>

      {requests.length === 0 ? (
        <p className="text-center text-gray-500">No pending requests.</p>
      ) : (
        <>
          {/* Header Row */}
          <div className="hidden md:grid grid-cols-[50px_1fr_120px_40px_40px] gap-4 items-center text-sm font-medium text-black mb-2">
            <span>User</span>
            <span>Event</span>
            <span>Date</span>
            <span>Approve</span>
            <span>Decline</span>
          </div>

          {/* Requests */}
          <div className="flex flex-col gap-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="grid grid-cols-[50px_1fr_120px_40px_40px] gap-4 items-center bg-white/50 rounded-xl p-2 md:p-3 shadow-sm"
              >
                {/* Initials (First Letter of Title/Org) */}
                <div className="flex items-center justify-center w-12 h-12 text-xl font-light bg-gray-300 rounded-lg uppercase">
                  {request.organizers?.[0]?.name?.charAt(0) || 'E'}
                </div>

                {/* Name + Description */}
                <div>
                  <div className="text-sm font-bold">{request.organizers?.[0]?.name || 'Unknown Org'}</div>
                  <div className="text-base md:text-lg">{request.title}</div>
                </div>

                {/* Date */}
                <time className="text-sm md:text-base">{new Date(request.startAt).toLocaleDateString()}</time>

                {/* Approve */}
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex items-center justify-center w-10 h-10 transition bg-green-100 text-green-600 rounded-lg hover:bg-green-200"
                  title="Approve"
                >
                  <Check className="w-5 h-5" />
                </button>

                {/* Decline */}
                <button
                  onClick={() => handleDecline(request.id)}
                  className="flex items-center justify-center w-10 h-10 transition bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                  title="Decline"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </section>
  );
};
