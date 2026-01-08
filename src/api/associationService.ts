// src/api/associationService.ts
import api from './client';
import type { components } from '@/types/schema';
import { toast } from 'sonner';

type AssociationSimple = components['schemas']['AssociationSimple'];

async function getAssociations(): Promise<AssociationSimple[]> {
  const { data, error } = await api.GET('/associations');

  if (error) {
    toast.error('Failed to fetch associations');
    console.error('Failed to fetch associations', error);
    // Return an empty array on error to prevent UI crashes
    return [];
  }

  return data || [];
}

export const associationService = {
  getAssociations,
};
