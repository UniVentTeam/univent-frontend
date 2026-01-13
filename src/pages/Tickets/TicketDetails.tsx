import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '@/api/ticketService';
import { format } from 'date-fns';
import { ro, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

import vector from 'public/assets/vector-1.svg';
import vector2 from 'public/assets/vector-29.svg';
import vector3 from 'public/assets/vector-2.svg';
import vector4 from 'public/assets/vector-21.svg';
import vector5 from 'public/assets/vector-3.svg';
import vector6 from 'public/assets/vector-23.svg';
import qrIcon from 'public/assets/qr_code.svg';

export default function TicketDetail() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Locale dinamic în funcție de limbă
  const dateLocale = i18n.language.startsWith('ro') ? ro : enUS;

  useEffect(() => {
    if (!ticketId) {
      setError(t('tickets.invalid_ticket_id', 'ID bilet lipsă'));
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTicketById(ticketId);
        setTicket(data);
      } catch (err: any) {
        console.error('Eroare la încărcarea biletului:', err);
        setError(
          err.response?.data?.message ||
            t('tickets.error_loading_ticket') ||
            'Nu am putut încărca detaliile biletului'
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, t]);

  const handleShare = async () => {
    if (!ticket) return;

    const shareData = {
      title: t('tickets.share_title', 'Event Ticket'),
      text: `${ticket.event?.title || 'Event'} – ${format(
        new Date(ticket.event?.startAt || new Date()),
        'dd MMM yyyy',
        { locale: dateLocale }
      )}`,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t('common.link_copied', 'Link copied'));
      }
    } catch (err) {
      console.warn('Share failed', err);
    }
  };

  const handleShowQR = () => {
    navigate(`/tickets/${ticketId}/qr`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg animate-pulse">{t('common.loading')}...</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-4">
        <p className="text-xl text-center text-red-600">
          {error || t('tickets.ticket_not_found')}
        </p>
        <button
          onClick={() => navigate('/tickets')}
          className="px-8 py-4 text-white transition bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          {t('tickets.back_to_my_tickets')}
        </button>
      </div>
    );
  }

  const event = ticket.event || {};
  const organizers = event.organizers || [];

  const eventDate = event.startAt
    ? format(new Date(event.startAt), 'EEEE, d MMMM yyyy', { locale: dateLocale })
    : '—';

  const eventStartTime = event.startAt
    ? format(new Date(event.startAt), 'HH:mm', { locale: dateLocale })
    : '—';

  const eventEndTime = event.endAt
    ? format(new Date(event.endAt), 'HH:mm', { locale: dateLocale })
    : '—';

  return (
    <div className="relative min-h-screen pb-24 bg-gray-50/50">
      {/* Header */}
      <div
        className="relative h-48 bg-center bg-cover md:h-64"
        style={{
          backgroundImage: `url(${event.coverImageUrl || '/default-event-banner.jpg'})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute max-w-3xl text-white bottom-8 left-6 md:left-12">
          <h1 className="text-3xl font-bold leading-tight md:text-5xl">
            {event.title || t('tickets.event')}
          </h1>
          <p className="mt-3 text-lg md:text-xl opacity-90">
            {eventDate} • {eventStartTime} – {eventEndTime}
          </p>
        </div>
      </div>

      <main className="relative z-10 max-w-5xl px-4 mx-auto -mt-16 sm:px-6 lg:px-8">
        <div className="p-6 space-y-12 bg-white shadow-xl rounded-2xl md:p-10">

          {/* Registration details */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <img src={vector} alt="" className="w-11 h-11" />
              <h2 className="text-3xl font-bold text-gray-900">
                {t('tickets.registration_details')}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.ticket_type')}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {t('tickets.standard_participation', 'Standard / Participation')}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.registered_on')}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {ticket.createdAt
                      ? format(
                          new Date(ticket.createdAt),
                          'dd MMM yyyy, HH:mm',
                          { locale: dateLocale }
                        )
                      : '—'}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.registration_code')}
                  </dt>
                  <dd className="mt-1 font-mono text-2xl font-semibold tracking-wide break-all">
                    {ticket.qrCodeContent ||
                      ticket.id?.toUpperCase().slice(0, 12) ||
                      '—'}
                  </dd>
                </div>
              </div>
            </div>
          </section>

          {/* Event info */}
          <section className="pt-10 border-t">
            <div className="flex items-center gap-4 mb-6">
              <img src={vector5} alt="" className="w-11 h-11" />
              <h2 className="text-3xl font-bold text-gray-900">
                {t('tickets.event_information')}
              </h2>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.date')}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">{eventDate}</dd>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.time')}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {eventStartTime} – {eventEndTime}
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="flex-shrink-0 w-10 h-10 mt-1" />
                <div>
                  <dt className="text-sm font-medium text-gray-600">
                    {t('tickets.location')}
                  </dt>
                  <dd className="mt-1 text-2xl font-semibold">
                    {event.locationName || '—'}
                  </dd>
                </div>
              </div>
            </div>
          </section>

          {/* Organizer */}
          <section className="pt-10 border-t">
            <div className="flex items-center gap-4 mb-6">
              <img src={vector6} alt="" className="w-11 h-11" />
              <h2 className="text-3xl font-bold text-gray-900">
                {t('tickets.organizer')}
              </h2>
            </div>

            <div className="space-y-6">
              {organizers.map((org: any) => (
                <div key={org.id} className="flex items-center gap-6">
                  <div className="w-10 h-10 mt-1" />
                  <address className="not-italic">
                    <p className="text-2xl">
                      {org.type} <strong>{org.name}</strong>
                    </p>
                    {org.logoUrl && (
                      <img
                        src={org.logoUrl}
                        alt={org.name}
                        className="object-contain w-20 h-20 mt-2"
                      />
                    )}
                  </address>
                </div>
              ))}
              {organizers.length === 0 && (
                <p className="pl-16 text-gray-500">
                  {t('tickets.organizer_unavailable')}
                </p>
              
              )}
            </div>
          </section>
        </div>

        {/* Actions */}
        <div className="flex flex-col justify-end gap-5 px-4 mt-12 sm:flex-row md:px-0">
          <button
            onClick={handleShowQR}
            className="flex items-center justify-center gap-3 px-10 py-5 text-xl font-semibold text-white transition bg-indigo-600 shadow-md hover:bg-indigo-700 rounded-xl"
          >
            <img src={qrIcon} alt="" className="w-9 h-9" />
            {t('tickets.show_qr_code')}
          </button>

          <button
            onClick={handleShare}
            className="flex items-center justify-center gap-3 px-10 py-5 text-xl font-semibold text-gray-900 transition bg-gray-200 hover:bg-gray-300 rounded-xl"
          >
            <img src={vector3} alt="" className="w-8 h-8" />
            {t('common.share')}
          </button>
        </div>
      </main>
    </div>
  );
}
