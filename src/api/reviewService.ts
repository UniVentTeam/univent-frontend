//Modificat Ruben

import api from './client';
import { toast } from 'sonner';

export type Review = {
  id: string;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
};

async function getReviews(eventId: string): Promise<Review[]> {
  const { data, error } = await api.GET(`/events/${eventId}/reviews`);

  if (error) {
    toast.error('Nu s-au putut încărca recenziile');
    throw new Error('Failed to load reviews');
  }

  return data ?? [];
}

async function addReview(
  eventId: string,
  payload: { rating: number; comment: string }
) {
  const { data, error } = await api.POST(`/events/${eventId}/reviews`, {
    body: payload,
  });

  if (error) {
    toast.error('Nu s-a putut adăuga recenzia');
    throw new Error('Failed to add review');
  }

  toast.success('Recenzia a fost adăugată');
  return data;
}

export const reviewService = {
  getReviews,
  addReview,
};
