import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  // --- Integrare Store ---
  const { isAuthenticated, user } = useAuthStore();

  const [count, setCount] = useState(0);

  return (
    <div className="space-y-8">
      {/* --- HEADER (acum personalizat) --- */}
      <header className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-h1">
            {isAuthenticated ? `Welcome back, ${user?.fullName?.split(' ')[0]}!` : "UniVent Design System"}
          </h1>
          <p className="text-body-sm mt-1">
            {isAuthenticated ? "Explore the latest events or manage your profile." : "Component and theme testing ground."}
          </p>
        </div>
        <div className="flex items-center gap-1 bg-card p-1 rounded-lg border border-border shadow-sm">
          <button onClick={() => i18n.changeLanguage('en')} className={cn("btn", i18n.language === 'en' ? "btn-secondary" : "btn-ghost")}>EN</button>
          <button onClick={() => i18n.changeLanguage('ro')} className={cn("btn", i18n.language === 'ro' ? "btn-secondary" : "btn-ghost")}>RO</button>
        </div>
      </header>

      {/* --- GRID DEMONSTRATIV --- */}
      <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* CARD 1: Acțiuni contextuale (logat vs. nelogat) */}
        <section className="card space-y-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
          <div className="border-b border-border pb-2">
            <h2 className="text-h3">1. {t('welcome')}</h2>
          </div>
          <p className="text-body">
            {isAuthenticated
              ? "You are logged in. You can now manage your events and tickets."
              : "To access all features, please log in or create an account."}
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            {isAuthenticated ? (
              <>
                <button onClick={() => navigate('/events/create')} className="btn btn-primary">Create Event</button>
                <button onClick={() => navigate('/profile')} className="btn btn-secondary">My Profile</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate('/auth/login')} className="btn btn-primary">Login</button>
                <button onClick={() => navigate('/auth/register')} className="btn btn-secondary">Register</button>
              </>
            )}
          </div>
        </section>

        {/* CARD 2: Butoane și Interactivitate */}
        <section className="card space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-h3">2. Butoane & cn()</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="btn btn-primary">Primary</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-danger">Danger</button>
            <button className="btn btn-ghost">Ghost</button>
          </div>
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-body mb-2">Counter test cu stil condițional:</p>
            <button onClick={() => setCount(c => c + 1)} className={cn("btn w-full", count > 5 ? "btn-danger" : "btn-primary")}>
              Count is {count}
            </button>
          </div>
        </section>

        {/* CARD 3: Formulare (Rămâne neschimbat) */}
        <section className="card md:col-span-2 space-y-4">
          <div className="border-b border-border pb-2">
            <h2 className="text-h3">3. Formulare (Input Fields)</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Nume Utilizator</label>
              <input type="text" className="input-field" placeholder="Ex: Ioan Motrescu" />
            </div>
            <div>
              <label className="label">Parolă</label>
              <input type="password" className="input-field" placeholder="••••••••" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary px-8">Salvează</button>
          </div>
        </section>

      </main>
    </div>
  )
}