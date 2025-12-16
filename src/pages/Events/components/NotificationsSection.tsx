import React, { useState } from "react";
import vector5 from "public/assets/vector-5.svg";
import vector6 from "public/assets/vector-6.svg";

interface Request {
  id: number;
  initials: string;
  name: string;
  date: string;
  description: string;
}

export const NotificationsSection = (): JSX.Element => {
  const [requests] = useState<Request[]>([
    {
      id: 1,
      initials: "IP",
      name: "Ion Porcilescu",
      date: "18-11-2025",
      description: "solicita organizarea unui eveniment:SPECIAL COACH USV",
    },
  ]);

  const handleApprove = (id: number) => console.log(`Approved request ${id}`);
  const handleDecline = (id: number) => console.log(`Declined request ${id}`);
  const handleViewDetails = (id: number) => console.log(`View details for request ${id}`);

  return (
    <section
      className="w-full max-w-[1200px] mx-auto mt-8 bg-white/80 rounded-2xl overflow-hidden p-4 md:p-6"
      aria-label="Notifications and Requests Section"
    >
      <h2 className="mb-4 text-2xl font-bold text-center md:text-3xl">Requests</h2>

      {/* Header Row */}
      <div className="hidden md:grid grid-cols-[50px_1fr_120px_40px_40px] gap-4 items-center text-sm font-medium text-black mb-2">
        <span>User</span>
        <span>Action</span>
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
            {/* Initials */}
            <div className="flex items-center justify-center w-12 h-12 text-xl font-light bg-gray-300 rounded-lg">
              {request.initials}
            </div>

            {/* Name + Description */}
            <div>
              <div className="text-sm font-bold">{request.name}</div>
              <div className="text-base md:text-lg">{request.description}</div>
            </div>

            {/* Date */}
            <time className="text-sm md:text-base">{request.date}</time>

            {/* Approve */}
            <button
              onClick={() => handleApprove(request.id)}
              aria-label={`Approve ${request.name}'s request`}
              className="flex items-center justify-center w-10 h-10 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <img src={vector6} alt="" className="w-2/3 h-2/3" />
            </button>

            {/* Decline */}
            <button
              onClick={() => handleDecline(request.id)}
              aria-label={`Decline ${request.name}'s request`}
              className="flex items-center justify-center w-10 h-10 transition bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              <img src={vector5} alt="" className="w-2/3 h-2/3" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
