//ADAUGAT Ruben

import api from './client';
import { toast } from 'sonner';

/**
 * Gestionează înscrierea unui utilizator la un eveniment.
 * @param eventId - ID-ul evenimentului
 * @throws Aruncă o eroare cu un mesaj prietenos în caz de eșec
 */
async function registerToEvent(eventId: string ) {
  const { error } = await api.POST('/tickets', {
    body: {
      eventId,
    },
  });

  if (error) {
    console.error('Event registration failed:', error);

    const errorMessage =
      (error as Error).message ||
      'A apărut o eroare la înscrierea la eveniment.';

    toast.error('Înscriere eșuată', {
      description: errorMessage,
    });

    throw new Error(errorMessage);
  }

  toast.success('Înscriere reușită', {
    description: 'Te-ai înscris cu succes la acest eveniment.',
  });
}

export const eventService = {
  registerToEvent,
};
