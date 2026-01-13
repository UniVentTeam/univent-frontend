import api from './client';
import { toast } from 'sonner';
import type { components } from '../types/schema';

type TicketResponse = components['schemas']['TicketResponse'];
type CheckInRequest = components['schemas']['CheckInRequest'];

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
async function checkIn(qrContent: string, eventId: string) {
  const body: CheckInRequest = { qrContent, eventId };
  const { data, error } = await api.POST('/check-in/scan', {
    body,
  });

  if (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const errorBody = error as any;
    const message = errorBody?.message || 'Eroare la validarea biletului';
    toast.error(message);
    throw new Error(message);
  }

  if (!data) {
    throw new Error('Biletul nu a fost găsit');
  if (data?.valid) {
    toast.success(data.message);
  } else {
    toast.warning(data.message);
  }

  return data;
}

export const ticketService = {
  getMyTickets,
  getTicketById,  
  checkIn
};
