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

async function getTicketById(ticketId: string): Promise<TicketResponse> {
  const { data, error } = await api.GET('/tickets/{id}', {
    params: {
      path: { id: ticketId },
    },
  });

  if (error) {
    const message = error.message || 'Nu s-a putut încărca biletul';
    toast.error(message);
    throw new Error(message);
  }

  if (!data) {
    throw new Error('Biletul nu a fost găsit');
  }

  return data;
}

export const ticketService = {
  getMyTickets,
  getTicketById,   // ← adăugat aici
};