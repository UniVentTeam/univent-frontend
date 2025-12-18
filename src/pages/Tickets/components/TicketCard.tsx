// src/pages/Tickets/components/TicketCard.tsx
import React from 'react';
import { cn } from '@/utils/cn';
import { Calendar, Ticket as TicketIcon } from 'lucide-react';
import type { components } from '@/types/schema';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

type TicketResponse = components['schemas']['TicketResponse'];

interface TicketCardProps {
  ticket: TicketResponse;
}

export const TicketCard: React.FC<TicketCardProps> = ({ ticket }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formatDate = (isoString?: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    return d.toLocaleDateString('ro-RO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleTicketClick = () => {
    navigate(`/tickets/${ticket.id}`);
  };

  return (
    <article
      onClick={handleTicketClick}
      className={cn(
        'relative rounded-2xl overflow-hidden bg-card shadow-md transition-all duration-300 ease-out',
        'hover:scale-105 hover:-translate-y-1 hover:shadow-xl cursor-pointer',
      )}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <TicketIcon className="w-8 h-8 mr-4 text-primary" />
          <h2 className="text-2xl font-bold text-main">{ticket.eventTitle}</h2>
        </div>

        <div className="flex items-center mb-2 text-muted">
          <Calendar className="w-5 h-5 mr-2" />
          <time>{formatDate(ticket.eventStartAt)}</time>
        </div>

        <div className="flex items-center text-sm">
          <span
            className={cn('px-2 py-1 text-xs font-semibold rounded-full', {
              'bg-green-100 text-green-800': ticket.status === 'CONFIRMED',
              'bg-blue-100 text-blue-800': ticket.status === 'CHECKED_IN',
              'bg-red-100 text-red-800': ticket.status === 'CANCELLED',
            })}
          >
            {t(`tickets.ticket_statuses.${ticket.status}`)}
          </span>
        </div>
      </div>
    </article>
  );
};
