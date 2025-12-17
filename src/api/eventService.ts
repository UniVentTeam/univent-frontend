// src/api/eventService.ts
import client from './client';
import type { components } from '@/types/schema';
import { toast } from 'sonner';

// type EventPreview = components['schemas']['EventPreview'];
type EventFilterQuery = components['schemas']['EventFilterQuery'];

export const getEvents = async (filters: EventFilterQuery) => {
  const { data, error } = await client.GET('/events', {
    searchParams: filters, // client should handle serializing params
  });

  if (error) {
    toast.error('Failed to fetch events list.');
    throw new Error('Could not retrieve events list.');
  }

  return data;
};
