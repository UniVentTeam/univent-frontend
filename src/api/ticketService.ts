import api from './client';
import { toast } from 'sonner';

export type Ticket = {
  id: string;
  eventId: string;
  status: string;
};

async function getMyTickets(): Promise<Ticket[]> {
  const { data, error } = await api.GET('/tickets');

  if (error) {
    toast.error('Nu s-au putut încărca biletele');
    throw new Error('Failed to load tickets');
  }

  return data ?? [];
}

export const ticketService = {
  getMyTickets,
};
