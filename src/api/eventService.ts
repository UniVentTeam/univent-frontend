//ADAUGAT Ruben

import api from './client';
import type { components } from '@/types/schema'; // Adăugat acest import
import { toast } from 'sonner';

/**
 * Gestionează înscrierea unui utilizator la un eveniment.
 * @param eventId - ID-ul evenimentului
 * @throws Aruncă o eroare cu un mesaj prietenos în caz de eșec
 */
async function registerToEvent(eventId: string) {
  const { error } = await api.POST('/tickets', {
    body: {
      eventId,
    },
  });

  if (error) {
    console.error('Event registration failed:', error);

    const errorMessage =
      (error as Error).message || 'A apărut o eroare la înscrierea la eveniment.';

    toast.error('Înscriere eșuată', {
      description: errorMessage,
    });

    throw new Error(errorMessage);
  }

  toast.success('Înscriere reușită', {
    description: 'Te-ai înscris cu succes la acest eveniment.',
  });
}

type EventFilterQuery = components['schemas']['EventFilterQuery']; // Adăugată această declarație de tip

/**
 * Preia lista de evenimente pe baza filtrelor specificate.
 * @param filters - Obiectul de filtrare pentru evenimente.
 * @returns {Promise<components['schemas']['EventPreview'][]>} O promisiune care se rezolvă cu lista de evenimente.
 * @throws Aruncă o eroare dacă preluarea eșuează.
 */
async function getEvents(filters: EventFilterQuery) {
  // Aplicat tipul 'EventFilterQuery' parametrului 'filters'
  const { data, error } = await api.GET('/events', {
    params: {
      query: filters,
    },
  });

  if (error) {
    console.error('Failed to fetch events:', error);
    const errorMessage =
      (error as Error).message || 'A apărut o eroare la preluarea evenimentelor.';
    toast.error('Eroare la preluare', {
      description: errorMessage,
    });
    throw new Error(errorMessage);
  }

  // Handle API inconsistency: it might return { events: [...] } or { data: [...] }
  if (data && (data as any).events) {
    return (data as any).events;
  }
  if (data && (data as any).data) {
    return (data as any).data;
  }

  return data;
}

async function getEventById(eventId: string) {
  const { data, error } = await api.GET('/events/{id}', {
    params: {
      path: { id: eventId },
    },
  });

  if (error) {
    console.error('Failed to fetch event details:', error);

    const errorMessage =
      (error as Error).message || 'Nu s-au putut încărca detaliile evenimentului.';

    toast.error('Eroare', {
      description: errorMessage,
    });

    throw new Error(errorMessage);
  }

  return data;
}

/**
 * Preia lista participanților pentru un eveniment (doar pentru organizatori).
 */
async function getParticipants(eventId: string, format: 'json' | 'csv' | 'pdf' = 'json') {
  const { data, error } = await api.GET('/events/{id}/participants', {
    params: {
      path: { id: eventId },
      query: { format },
    },
  });

  if (error) {
    console.error('Failed to fetch participants:', error);
    throw new Error((error as Error).message || 'Nu s-au putut prelua participanții.');
  }

  // Dacă formatul e CSV sau PDF, backend-ul returnează un Blob/String, dar clientul nostru generic
  // încearcă să facă parse JSON. Trebuie să tratăm download-ul separat dacă api.GET nu suportă blobs nativ ușor.
  // Totuși, 'api-client' generat cu openapi-fetch returnează response-ul parsat. 
  // Pentru simplitate, momentan returnăm data.
  // În cazul CSV/PDF, va fi nevoie de un window.open sau handling de Blob manual.

  return data;
}

/**
 * Preia recenziile pentru un eveniment.
 */
async function getEventReviews(eventId: string) {
  const { data, error } = await api.GET('/events/{id}/reviews', {
    params: {
      path: { id: eventId },
    },
  });

  if (error) {
    console.error('Failed to fetch reviews:', error);
    // Nu aruncăm eroare critică pentru statistici, returnăm array gol
    return [];
  }

  return data;
}

export const eventService = {
  registerToEvent,
  getEvents,
  getEventById,
  getParticipants,
  getEventReviews,
};
