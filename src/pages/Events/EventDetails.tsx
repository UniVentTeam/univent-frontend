import { useParams, useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { eventService } from '@/api/eventService';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { reviewService, type Review } from '@/api/reviewService';
import { ticketService } from '@/api/ticketService';

const EventDetails = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);
  
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [isRegistering, setIsRegistering] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isCheckingRegistration, setIsCheckingRegistration] = useState(true);

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
      setIsRegistered(data.isRegistered);
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

    setEvent((prev) =>
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
        <h2 className="text-2xl font-semibold">Evenimentul nu a fost găsit</h2>
      </div>
    );
  }

  if (isLoadingEvent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-page)]">
        <p className="text-[var(--text-secondary)]">Se încarcă evenimentul...</p>
      </div>
    );
  }
  else
  return (
    <div className="bg-[var(--bg-page)] min-h-screen">
      {/* ================= HERO ================= */}
      <div className="relative h-[480px] w-full">
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
    ← Înapoi
  </button>

        {/* ================= OVERLAY (MAI JOS) ================= */}
        <div className="absolute left-0 right-0 bottom-[-260px] md:bottom-[-90px] z-40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-[2fr_1fr] gap-8 items-stretch">
              {/* INFO EVENIMENT */}
              <div className="bg-[var(--bg-card)] rounded-[28px] p-10 shadow-xl">
                <span
                  className="inline-flex items-center mb-4 px-3 py-1 text-xs font-semibold rounded-full capitalize"
                  style={{
                    backgroundColor: 'var(--color-academic-bg)',
                    color: 'var(--color-academic-text)',
                  }}
                >
                  {event.type}
                </span>

                <h1 className="text-4xl font-bold tracking-tight mb-6 text-[var(--text-primary)]">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-x-10 gap-y-5 text-sm text-[var(--text-secondary)]">
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
                    <span>{event.organizers.map(o => o.name).join(', ')}</span>
                    </div>
                </div>
              </div>

              {/* CARD ÎNSCRIERE */}
              {/* CARD ÎNSCRIERE */}
              <div className="bg-[var(--bg-card)] rounded-[28px] p-10 shadow-xl h-full flex flex-col">
  <h2 className="text-lg font-semibold mb-6 text-[var(--text-primary)]">
    Înscriere la eveniment
  </h2>

  {!user ? (
    <>
      <div className="rounded-2xl bg-[var(--bg-muted)] px-6 py-14 text-center text-sm text-[var(--text-secondary)] font-medium">
        Autentifică-te pentru a te putea înscrie la acest eveniment
      </div>

      <button
        onClick={() => navigate('/auth/login')}
        className="mt-6 w-full rounded-xl btn-primary py-3 text-sm font-semibold"
      >
        Autentificare
      </button>
    </>
  ) : event.isRegistered ? (
    <>
      <div className="rounded-2xl bg-[var(--color-green-100)] px-6 py-10 text-center text-sm font-medium text-[var(--color-green-500)]">
        Ești deja înscris la acest eveniment
      </div>

      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
        Vei primi notificări și acces la eveniment.
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
        {isRegistering ? 'Se face înscrierea...' : 'Înscrie-te la eveniment'}
      </button>

      <p className="mt-4 text-center text-sm text-[var(--text-secondary)]">
        Vei primi o notificare de confirmare după înscriere.
      </p>
    </>
  )}
</div>

            </div>
          </div>
        </div>
      </div>

      {/* ================= CONȚINUT PRINCIPAL ================= */}
      <div className="max-w-5xl mx-auto px-6 pt-[340px] md:pt-[160px] pb-28 space-y-14">
      <section className="bg-[var(--bg-card)] rounded-[28px] p-12 shadow">
  <h2 className="text-xl font-semibold mb-6 text-[var(--text-primary)]">
    Despre acest eveniment
  </h2>

  {/* DESCRIERE */}
  {event.description ? (
    <p className="text-[var(--text-secondary)] leading-relaxed text-base whitespace-pre-line">
      {event.description}
    </p>
  ) : (
    <p className="text-sm text-[var(--text-secondary)] italic">
      Nu există o descriere pentru acest eveniment.
    </p>
  )}

  {/* AGENDA */}
  {event.agenda?.length > 0 && (
    <div className="mt-8">
      <h3 className="font-semibold mb-3 text-[var(--text-primary)]">
        Agenda evenimentului
      </h3>

      <ul className="list-disc list-inside space-y-2 text-[var(--text-secondary)]">
        {event.agenda.map((item: string, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )}
</section>


        {/* RECENZII */}
        {/* RECENZII */}
        <section className="bg-[var(--bg-card)] rounded-[28px] p-12 shadow">
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-[var(--text-primary)]">Recenzii</h2>

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
                Autentifică-te pentru a lăsa o recenzie
              </p>

              <button
                onClick={() => navigate('/auth/login')}
                className="rounded-xl btn-primary px-6 py-2 text-sm font-semibold"
              >
                Autentificare
              </button>
            </div>
          )}

          {/* CTA – LOGAT DAR NEÎNSCRIS */}
          {user && !event.isRegistered&& (
            <div className="mb-8 rounded-xl bg-[var(--bg-muted)] py-3 text-center text-sm text-gray-600">
              Doar participanții pot lăsa recenzii la acest eveniment.
            </div>
          )}

          {/* FORMULAR – DOAR PARTICIPANȚI */}
          {user && event.isRegistered && (
            <div className="mb-10 rounded-2xl bg-[var(--bg-muted)] p-6">
              <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">Lasă o recenzie</h3>

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
                placeholder="Scrie părerea ta despre eveniment..."
                className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />

              {/* SUBMIT */}
              <button
                onClick={handleAddReview}
                disabled={isSubmittingReview || !comment.trim()}
                className="mt-4 rounded-xl btn-primary px-6 py-2 text-sm font-semibold text-white hover:btn-primary transition disabled:opacity-60"
              >
                {isSubmittingReview ? 'Se trimite...' : 'Trimite recenzia'}
              </button>
            </div>
          )}

          {/* LOADING */}
          {isLoadingReviews && <p className="text-sm text-[var(--text-secondary)]">Se încarcă recenziile...</p>}

          {/* EMPTY */}
          {!isLoadingReviews && reviews.length === 0 && (
            <p className="text-sm text-[var(--text-secondary)]">Acest eveniment nu are încă recenzii.</p>
          )}

          {/* LISTA RECENZII */}
          <div className="space-y-8">
            {reviews.map((review) => (
              <div key={review.id} className="flex gap-5 border-t border-[var(--border-base)] pt-8">
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
    </div>
  );
};

export default EventDetails;
