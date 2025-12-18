import api from './client';
import { toast } from 'sonner';
import type { components } from '../types/schema';

type TicketResponse = components['schemas']['TicketResponse'];

async function getMyTickets(): Promise<TicketResponse[]> {
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
