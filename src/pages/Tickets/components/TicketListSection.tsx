// src/pages/Tickets/components/TicketListSection.tsx
import React from 'react';
import type { components } from '@/types/schema';
import { TicketCard } from './TicketCard';
import { useTranslation } from 'react-i18next';

type TicketResponse = components['schemas']['TicketResponse'];

interface TicketListSectionProps {
  tickets: TicketResponse[];
}

export const TicketListSection: React.FC<TicketListSectionProps> = ({ tickets }) => {
  const { t } = useTranslation();

  if (tickets.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-lg text-center text-gray-500 col-span-full md:text-xl">
          {t('tickets.noTickets')}
        </p>
      </div>
    );
  }

  return (
    <section className="grid gap-6 px-4 py-8 md:grid-cols-2 lg:grid-cols-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </section>
  );
};
