import { useParams, useNavigate } from 'react-router-dom';
import { events } from './data/eventsData';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';
import { useEffect, useState } from 'react';
import { eventService } from '@/api/eventService';
import { CalendarDays, MapPin, Users } from 'lucide-react';
import { reviewService, type Review } from '@/api/reviewService';
import { ticketService } from '@/api/ticketService';

const EventDetails = () => {
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

  const event = events.find((e) => String(e.id) === String(id));

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const data = await reviewService.getReviews(event.id);
        setReviews(data);
      } catch {
        // toast already shown
      } finally {
        setIsLoadingReviews(false);
      }
    };

    loadReviews();
  }, [event.id]);

  useEffect(() => {
    if (!user) {
      setIsCheckingRegistration(false);
      setIsRegistered(false);
      return;
    }

    const checkRegistration = async () => {
      try {
        const tickets = await ticketService.getMyTickets();

        const registered = tickets.some(
          (ticket) => ticket.eventId === event.id && ticket.status === 'CONFIRMED',
        );

        setIsRegistered(registered);
      } catch {
        // toast deja afișat în service
      } finally {
        setIsCheckingRegistration(false);
      }
    };

    checkRegistration();
  }, [user, event.id]);

  const handleRegister = async () => {
    setIsRegistering(true);
    try {
      await eventService.registerToEvent(event.id);
      setIsRegistered(true);
    } catch {
      // toast-ul e deja afișat în service
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

  return (
    <div className="bg-[#F5F8FB] min-h-screen">
      {/* ================= HERO ================= */}
      <div className="relative h-[480px] w-full">
        {/* IMAGINE */}
        <div className={cn('absolute inset-0 bg-cover bg-center', event.backgroundImage)} />

        {/* GRADIENT PENTRU CONTRAST */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

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
              <div className="bg-white rounded-[28px] p-10 shadow-xl">
                <span className="inline-flex items-center mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-blue-50 text-blue-600 capitalize">
                  {event.category}
                </span>

                <h1 className="text-4xl font-bold tracking-tight mb-6 text-gray-900">
                  {event.title}
                </h1>

                <div className="flex flex-wrap gap-x-10 gap-y-5 text-sm text-gray-600">
                  {/* DATA */}
                  <div className="flex items-center gap-3">
                    <CalendarDays className="w-5 h-5 text-blue-600" />
                    <span>{event.date}</span>
                  </div>

                  {/* LOCAȚIE */}
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    <span>{event.location}</span>
                  </div>

                  {/* ORGANIZATOR */}
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <span>{event.organizer}</span>
                  </div>
                </div>
              </div>

              {/* CARD ÎNSCRIERE */}
              {/* CARD ÎNSCRIERE */}
              <div className="bg-white rounded-[28px] p-10 shadow-xl h-full flex flex-col">
                <h2 className="text-lg font-semibold mb-6 text-gray-900">Înscriere la eveniment</h2>

                {!user ? (
                  <>
                    <div className="rounded-2xl bg-blue-50 px-6 py-14 text-center text-sm text-gray-700 font-medium">
                      Autentifică-te pentru a te putea înscrie la acest eveniment
                    </div>

                    <button
                      onClick={() => navigate('/auth/login')}
                      className="mt-6 w-full rounded-xl btn-primary text-white py-3 text-sm font-semibold hover:btn-primary transition"
                    >
                      Autentificare
                    </button>
                  </>
                ) : isCheckingRegistration ? (
                  // ⏳ verificăm biletele din backend
                  <p className="text-center text-sm text-gray-500">Se verifică înscrierea...</p>
                ) : (
                  <>
                    <button
                      onClick={handleRegister}
                      disabled={isRegistering || isRegistered}
                      className={cn(
                        'w-full rounded-xl py-4 text-sm font-semibold transition',
                        isRegistered
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : 'bg-green-600 text-white hover:bg-green-700',
                        isRegistering && 'opacity-70 cursor-wait',
                      )}
                    >
                      {isRegistered
                        ? 'Ești deja înscris'
                        : isRegistering
                          ? 'Se face înscrierea...'
                          : 'Înscrie-te la eveniment'}
                    </button>

                    {!isRegistered && (
                      <p className="mt-4 text-center text-sm text-gray-500">
                        Vei primi o notificare de confirmare după înscriere.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CONȚINUT PRINCIPAL ================= */}
      <div className="max-w-5xl mx-auto px-6 pt-[340px] md:pt-[160px] pb-28 space-y-14">
        {/* DESPRE */}
        <section className="bg-white rounded-[28px] p-12 shadow">
          <h2 className="text-xl font-semibold mb-6 text-gray-900">Despre acest eveniment</h2>

          <p className="text-gray-700 leading-relaxed text-base">
            Acest workshop îți oferă oportunitatea de a-ți realiza fotografii profesionale de
            profil, dar și variante creative, ideale pentru rețelele sociale, CV sau alte scopuri.
            <br />
            <br />
            De asemenea, vei putea descoperi cum funcționează un studio foto profesionist și vei
            interacționa cu echipamente moderne.
          </p>

          <div className="mt-8">
            <h3 className="font-semibold mb-3 text-gray-900">Agenda evenimentului</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Echipamente foto profesionale</li>
              <li>Setup-uri de iluminare</li>
              <li>Tutoriale de fotografie</li>
              <li>Sesiuni foto creative</li>
            </ul>
          </div>
        </section>

        {/* RECENZII */}
       {/* RECENZII */}
<section className="bg-white rounded-[28px] p-12 shadow">
  {/* HEADER */}
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-xl font-semibold text-gray-900">Recenzii</h2>

    {reviews.length > 0 && (
      <span className="text-yellow-500 font-medium">
        {'★'.repeat(
          Math.round(
            reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
          )
        )}{' '}
        {(
          reviews.reduce((a, r) => a + r.rating, 0) / reviews.length
        ).toFixed(1)}
      </span>
    )}
  </div>

  {/* CTA – NEAUTENTIFICAT */}
  {!user && (
    <div className="mb-8 flex flex-col items-center gap-4 rounded-2xl bg-blue-50 px-6 py-6 text-center">
      <p className="text-sm font-medium text-gray-700">
        Autentifică-te pentru a lăsa o recenzie
      </p>

      <button
        onClick={() => navigate('/auth/login')}
        className="rounded-xl btn-primary px-6 py-2 text-sm font-semibold text-white transition"
      >
        Autentificare
      </button>
    </div>
  )}

  {/* CTA – LOGAT DAR NEÎNSCRIS */}
  {user && !isRegistered && (
    <div className="mb-8 rounded-xl bg-gray-50 py-3 text-center text-sm text-gray-600">
      Doar participanții pot lăsa recenzii la acest eveniment.
    </div>
  )}

  {/* FORMULAR – DOAR PARTICIPANȚI */}
  {user && isRegistered && (
    <div className="mb-10 rounded-2xl bg-blue-50 p-6">
      <h3 className="mb-4 text-sm font-semibold text-gray-900">
        Lasă o recenzie
      </h3>

      {/* STELE */}
      <div className="flex items-center gap-2 mb-4">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={cn(
              'text-xl transition',
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
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
  {isLoadingReviews && (
    <p className="text-sm text-gray-500">Se încarcă recenziile...</p>
  )}

  {/* EMPTY */}
  {!isLoadingReviews && reviews.length === 0 && (
    <p className="text-sm text-gray-500">
      Acest eveniment nu are încă recenzii.
    </p>
  )}

  {/* LISTA RECENZII */}
  <div className="space-y-8">
    {reviews.map((review) => (
      <div key={review.id} className="flex gap-5 border-t pt-8">
        {/* AVATAR */}
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
          {review.userName
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
        </div>

        {/* CONTENT */}
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-gray-900">
              {review.userName}
            </span>

            <span className="text-yellow-500 text-sm">
              {'★'.repeat(review.rating)}
            </span>

            <span className="text-xs text-gray-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>

          <p className="mt-2 text-gray-700 text-sm">
            {review.comment}
          </p>
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
