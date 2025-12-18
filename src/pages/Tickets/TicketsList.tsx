// src/pages/Tickets/TicketsList.tsx
import { useEffect, useState } from 'react';
import { ticketService } from '@/api/ticketService';
import type { components } from '@/types/schema';
import { TicketListSection } from './components/TicketListSection';
import { useTranslation } from 'react-i18next';

type TicketResponse = components['schemas']['TicketResponse'];

const TicketsList = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState<TicketResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const myTickets = await ticketService.getMyTickets();
        setTickets(myTickets);
      } catch (error) {
        console.error('Failed to fetch tickets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  return (
    <div className="relative min-h-screen pb-32 transition-colors duration-300 bg-page text-main">
      <header className="relative z-20 w-full flex flex-col bg-accent/40 dark:bg-accent-darker/40 backdrop-blur-sm px-0 py-12 shadow-lg">
        <h1 className="mx-auto text-4xl font-bold text-center text-main">
          {t('tickets.my_tickets')}
        </h1>
      </header>

      <main
        className="relative z-10 w-full px-4 mx-0 transition-colors duration-300"
        style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-primary)' }}
      >
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <p>Se încarcă biletele...</p>
          </div>
        ) : (
          <TicketListSection tickets={tickets} />
        )}
      </main>
    </div>
  );
};

export default TicketsList;
