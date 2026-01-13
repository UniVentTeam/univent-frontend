// src/pages/Tickets/TicketQR.tsx
import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ticketService } from '@/api/ticketService';
import { useTranslation } from 'react-i18next';
import { QRCodeCanvas } from 'qrcode.react'; // Folosim Canvas pentru a permite download-ul

export default function TicketQR() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const qrRef = useRef<HTMLDivElement>(null); // Referință pentru zona QR

  const [ticket, setTicket] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Funcție pentru a descărca QR-ul ca imagine PNG
  const downloadQRCode = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      
      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = `Ticket_${ticket?.event?.title || 'Event'}_${ticketId}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    }
  };

  useEffect(() => {
    if (!ticketId) {
      setError(t('tickets.invalid_ticket_id'));
      setLoading(false);
      return;
    }

    const fetchTicket = async () => {
      try {
        setLoading(true);
        const data = await ticketService.getTicketById(ticketId);
        setTicket(data);
      } catch (err: any) {
        console.error('Eroare QR:', err);
        setError(t('tickets.error_loading_ticket'));
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [ticketId, t]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl animate-pulse">{t('common.loading')}</p>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-6 text-center">
        <p className="text-2xl text-red-600">{error || t('tickets.ticket_not_found', 'Biletul nu a fost găsit')}</p>
        <button
          onClick={() => navigate('/tickets')}
          className="px-10 py-5 text-xl text-white transition-colors bg-blue-600 rounded-xl hover:bg-blue-700"
        >
          {t('tickets.back_to_my_tickets')}
        </button>
      </div>
    );
  }

  const event = ticket.event || {};

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50/50">
      <div className="w-full max-w-md p-8 text-center bg-white border border-gray-100 shadow-2xl rounded-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          {t('tickets.qr_title', 'Cod QR Bilet')}
        </h1>

        <p className="mb-6 text-lg font-medium text-indigo-600">
          {event.title || t('tickets.event_information')}
        </p>

        {/* Zona QR Code cu referință pentru download */}
        <div ref={qrRef} className="inline-block p-4 mb-6 bg-white border border-gray-100 shadow-inner rounded-xl">
          <QRCodeCanvas
            value={ticket.qrCodeContent || ticket.id || ''}
            size={256}
            level="H"
            includeMargin={true}
            fgColor="#000000"
            bgColor="#ffffff"
          />
        </div>

        <div className="mb-8">
            <p className="mb-1 font-mono text-xs tracking-widest text-gray-400 uppercase">ID BILET</p>
            <p className="p-2 font-mono text-sm text-gray-600 break-all rounded bg-gray-50">
            {ticket.qrCodeContent || ticket.id || '—'}
            </p>
        </div>

        <p className="mb-8 text-sm italic text-gray-500">
          {t('tickets.qr_instruction')}
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={downloadQRCode}
            className="w-full px-6 py-4 text-lg font-bold text-white transition bg-green-600 shadow-lg rounded-xl hover:bg-green-700 shadow-green-200"
          >
            {t('tickets.download_button')}
          </button>

          <button
            onClick={() => navigate(-1)}
            className="w-full px-6 py-4 text-lg font-semibold text-gray-700 transition bg-white border-2 border-gray-200 rounded-xl hover:bg-gray-50"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    </div>
  );
}