import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { eventService } from '@/api/eventService';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { reviewService, type Review } from '@/api/reviewService';
import { useTranslation } from 'react-i18next';

const EventDetails = () => {
  const { t } = useTranslation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isRegistering, setIsRegistering] = useState(false);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const [event, setEvent] = useState<any>(null);
  const [isLoadingEvent, setIsLoadingEvent] = useState(true);


  useEffect(() => {
    if (!id) return;

    const loadEvent = async () => {
      try {
        const data = await eventService.getEventById(id);
        setEvent(data);

      } catch {
        // toast deja afișat
      } finally {
        setIsLoadingEvent(false);
      }
    };

    loadEvent();
  }, [id]);


  useEffect(() => {
    if (!event?.id) return;

    const loadReviews = async () => {
      try {
        const data = await reviewService.getReviews(event.id);
        setReviews(data);
      } catch {
        // toast deja afișat
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [event?.id]);




  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await eventService.registerToEvent(event.id);

      setEvent((prev: any) =>
        prev ? { ...prev, isRegistered: true } : prev
      );
    } catch {
      // toast deja afișat
    } finally {
      setIsRegistering(false);
    }
  };


  const handleAddReview = async () => {
    if (!comment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const newReview = await reviewService.addReview(event.id, {
        rating,
        comment,
      });

      setReviews((prev) => [newReview, ...prev]);
      setComment('');
      setRating(5);
    } catch {
      // toast already shown
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F5F8FB]">
        <h2 className="text-2xl font-semibold">{t('event_details.not_found')}</h2>
      </div>
    );
  }

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <p className="text-[var(--text-secondary)]">{t('event_details.loading')}</p>
      </div>
    );
  }
  else
    return (
      <div className="bg-[var(--bg-page)] min-h-screen">
        {/* ================= HERO ================= */}
        <div className="relative h-[360px] sm:h-[420px] md:h-[480px] w-full">
          {/* IMAGINE */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${event.coverImageUrl})` }}
          />


          {/* GRADIENT PENTRU CONTRAST */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

          {/* 🔽 FADE SPRE FUNDALUL PAGINII */}
          <div
            className="absolute inset-x-0 bottom-0 h-14 pointer-events-none"
            style={{
              background:
                'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, var(--bg-page) 100%)',
            }}
          />

          {/* BUTON BACK */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 z-30 rounded-full bg-white/90 px-4 py-2 text-sm font-medium shadow backdrop-blur"
          >
            {t('event_details.back')}
          </button>

          {/* ================= OVERLAY (MAI JOS) ================= */}
          <div className="absolute left-0 right-0 bottom-[-180px] sm:bottom-[-220px] lg:relative lg:bottom-auto z-40 lg:mt-[-90px]">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid lg:grid-cols-[2fr_1fr] gap-4 sm:gap-6 lg:gap-8 items-stretch">
                {/* INFO EVENIMENT */}
                <div className="bg-[var(--bg-card)] rounded-[24px] md:rounded-[28px] p-5 sm:p-7 md:p-10 shadow-xl">
                  <span
                    className="inline-flex items-center mb-4 px-3 py-1 text-xs font-semibold rounded-full capitalize"
                    style={{
                      backgroundColor: 'var(--color-academic-bg)',
                      color: 'var(--color-academic-text)',
                    }}
                  >
                    {event.type}
                  </span>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4 md:mb-6 text-[var(--text-primary)]">
                    {event.title}
                  </h1>

                  <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-x-8 sm:gap-y-4 text-sm text-[var(--text-secondary)]">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="w-5 h-5 text-[var(--color-accent)]" />
                      <span>
                        {new Date(event.startAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-[var(--color-accent)]" />
                      <span>{event.locationName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Users className="w-5 h-5 text-[var(--color-accent)]" />
                      <span>{event.organizers?.map((o: { name: string }) => o.name).join(', ')}</span>
                    </div>
                  </div>
                </div>

                {/* CARD ÎNSCRIERE */}
                {/* CARD ÎNSCRIERE */}
                <div className="bg-[var(--bg-card)] rounded-[24px] md:rounded-[28px] p-5 sm:p-7 md:p-10 shadow-xl h-full flex flex-col lg:min-w-[340px]">
                  <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">
                    {t('event_details.registration_title')}
                  </h2>

                  {!user ? (
                    <>
                      <div className="rounded-2xl bg-[var(--bg-muted)] px-6 py-14 text-center text-sm text-[var(--text-secondary)] font-medium">
                        {t('event_details.login_to_register')}
                      </div>

                      <button
                        onClick={() => navigate('/auth/login')}
                        className="mt-6 w-full rounded-xl btn-primary py-3 text-sm font-semibold"
                      >
                        {t('event_details.login')}
                      </button>
                    </>
                  ) : event.isRegistered ? (
                    <>
                      <div className="rounded-2xl bg-[var(--color-green-100)] px-6 py-10 text-center text-sm font-medium text-[var(--color-green-500)]">
                        {t('event_details.already_registered')}
                      </div>

                      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
                        {t('event_details.already_registered_info')}
                      </p>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={handleRegister}
                        disabled={isRegistering}
                        className={cn(
                          'w-full rounded-xl py-4 text-sm font-semibold transition',
                          'btn-primary',
                          isRegistering && 'opacity-70 cursor-wait'
                        )}
                      >
                        {isRegistering ? t('event_details.registering') : t('event_details.register_button')}
                      </button>

                      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
                        {t('event_details.register_info')}
                      </p>
                    </>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* ================= CONȚINUT PRINCIPAL ================= */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-[240px] sm:pt-[300px] lg:pt-16 pb-16 sm:pb-24 md:pb-28 space-y-8 sm:space-y-12 md:space-y-14">
          <section className="bg-[var(--bg-card)] rounded-[24px] md:rounded-[28px] p-5 sm:p-8 md:p-12 shadow">
            <h2 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
              {t('event_details.about_title')}
            </h2>

            {/* DESCRIERE */}
            {event.description ? (
              <p className="text-[var(--text-secondary)] leading-relaxed text-base whitespace-pre-line">
                {event.description}
              </p>
            ) : (
              <p className="text-sm text-[var(--text-secondary)] italic">
                {t('event_details.no_description')}
              </p>
            )}

            {event.agenda?.length > 0 && (
              <div className="mt-8">
                <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
                  {t('event_details.agenda_title')}
                </h3>

                <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
                  {event.agenda.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* DOCUMENT ATAȘAT */}
            {event.documentUrl && (
              <div className="mt-8 pt-8 border-t border-[var(--border-base)]">
                <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
                  Documente Atașate
                </h3>
                <a
                  href={(() => {
                    if (!event.documentUrl) return '#';

                    // Verificare de bază URL Cloudinary
                    if (!event.documentUrl.includes('/upload/')) return event.documentUrl;

                    // Dacă avem un nume, încercăm să forțăm descărcarea cu acel nume
                    if (event.documentName) {
                      try {
                        const parts = event.documentUrl.split('/upload/');
                        if (parts.length === 2) {
                          // Eliminăm extensia din nume pentru a evita duplicarea dacă Cloudinary o adaugă
                          const nameWithoutExt = event.documentName.lastIndexOf('.') !== -1
                            ? event.documentName.substring(0, event.documentName.lastIndexOf('.'))
                            : event.documentName;

                          // Curățare strictă: doar caractere alfanumerice
                          const safeName = nameWithoutExt.replace(/[^a-zA-Z0-9_-]/g, '_');

                          // Folosim fl_attachment:nume
                          return `${parts[0]}/upload/fl_attachment:${safeName}/${parts[1]}`;
                        }
                      } catch (e) {
                        return event.documentUrl;
                      }
                    }

                    // Fallback: forțăm descărcarea generică
                    const parts = event.documentUrl.split('/upload/');
                    return `${parts[0]}/upload/fl_attachment/${parts[1]}`;
                  })()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-[var(--bg-muted)] hover:bg-[var(--bg-muted-hover)] rounded-xl transition group w-full sm:w-fit"
                >
                  <div className="bg-red-100 text-red-600 p-2 rounded-lg group-hover:bg-red-200 transition">
                    {/* Using Type icon from lucide-react if imported, or generic FileText if available. We have Users, MapPin... let's check imports. Type is imported in EditEvent but not here. */}
                    {/* Importing FileText or Download would be good. Let's just use what we have or add import. */}
                    {/* I see MapPin, CalendarDays, Users. I should add FileText to imports. */}
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /></svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-[var(--text-primary)] group-hover:text-blue-600 transition">
                      {event.documentName || "Descarcă Document"}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">Click pentru a vizualiza/descărca</span>
                  </div>
                </a>
              </div>
            )}
          </section>





          {/* RECENZII */}
          {/* RECENZII */}
          <section className="bg-[var(--bg-card)] rounded-[24px] md:rounded-[28px] p-5 sm:p-8 md:p-12 shadow">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-6 sm:mb-8">
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">{t('event_details.reviews_title')}</h2>

              {reviews.length > 0 && (
                <span className="text-yellow-500 font-medium">
                  {'★'.repeat(Math.round(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length))}{' '}
                  {(reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)}
                </span>
              )}
            </div>

            {/* CTA – NEAUTENTIFICAT */}
            {!user && (
              <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-[var(--bg-muted)] px-6 py-6 text-center">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  {t('event_details.login_to_review')}
                </p>

                <button
                  onClick={() => navigate('/auth/login')}
                  className="rounded-xl btn-primary px-6 py-2 text-sm font-semibold"
                >
                  {t('event_details.login')}
                </button>
              </div>
            )}

            {/* CTA – LOGAT DAR NEÎNSCRIS */}
            {user && !event.isRegistered && (
              <div className="mb-8 rounded-xl bg-[var(--bg-muted)] py-3 text-center text-sm text-gray-600">
                {t('event_details.only_participants_review')}
              </div>
            )}

            {/* FORMULAR – DOAR PARTICIPANȚI */}
            {user && event.isRegistered && (
              <div className="mb-10 rounded-2xl bg-[var(--bg-muted)] p-6">
                <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">{t('event_details.leave_review_title')}</h3>

                {/* STELE */}
                <div className="flex items-center gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={cn(
                        'text-xl transition',
                        star <= rating ? 'text-yellow-400' : 'text-gray-300',
                      )}
                    >
                      ★
                    </button>
                  ))}
                </div>

                {/* COMENTARIU */}
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('event_details.review_placeholder')}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />

                {/* SUBMIT */}
                <button
                  onClick={handleAddReview}
                  disabled={isSubmittingReview || !comment.trim()}
                  className="mt-4 rounded-xl btn-primary px-6 py-2 text-sm font-semibold text-white hover:btn-primary transition disabled:opacity-60"
                >
                  {isSubmittingReview ? t('event_details.sending_review') : t('event_details.submit_review')}
                </button>
              </div>
            )}

            {/* LOADING */}
            {isLoadingReviews && <p className="text-sm text-[var(--text-secondary)]">{t('event_details.loading_reviews')}</p>}

            {/* EMPTY */}
            {!isLoadingReviews && reviews.length === 0 && (
              <p className="text-sm text-[var(--text-secondary)]">{t('event_details.no_reviews')}</p>
            )}

            {/* LISTA RECENZII */}
            <div className="space-y-8">
              {reviews.map((review) => (
                <div key={review.id} className="flex gap-4 sm:gap-5 border-t border-[var(--border-base)] pt-6 sm:pt-8">
                  {/* AVATAR */}
                  <div className="w-12 h-12 rounded-full bg-[var(--bg-muted)] flex items-center justify-center font-semibold">
                    {review.userName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .slice(0, 2)}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-[var(--text-primary)]">
                        {review.userName}
                      </span>

                      <span className="text-yellow-500 text-sm">{'★'.repeat(review.rating)}</span>

                      <span className="text-xs text-[var(--text-secondary)]">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p className="mt-2 text-[var(--text-secondary)] text-sm">{review.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div >
    );
};

export default EventDetails;
