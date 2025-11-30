import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/utils/cn'; // Importăm funcția helper

export default function HomePage() {
  // 1. Hook-ul de traducere
  const { t, i18n } = useTranslation();

  // 2. State pentru Counter și Temă
  const [count, setCount] = useState(0);
  const [isDark, setIsDark] = useState(false);

  // 3. Logică Dark Mode (adaugă clasa 'dark' pe html)
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDark]);

  return (
    // Folosim clasele semantice: bg-page (se schimbă singur pe dark)
    <div className="min-h-screen bg-page transition-colors duration-300 py-10">

      {/* Container centrat (clasa .layout-container definită în index.css) */}
      <div className="layout-container space-y-8">

        {/* --- HEADER --- */}
        <header className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            {/* Testăm clasa .text-h1 (Font Jakarta) */}
            <h1 className="text-h1">UniVent Design System</h1>
            {/* Testăm clasa .text-body-sm (Font Inter + culoare secundară) */}
            <p className="text-body-sm mt-1">Testarea componentelor și a temei</p>
          </div>

          {/* Controale (Limbă & Temă) */}
          <div className="flex items-center gap-3 bg-card p-2 rounded-lg border border-border shadow-sm">
            <button
              onClick={() => i18n.changeLanguage('en')}
              className={cn("px-3 py-1 rounded text-sm font-medium transition", i18n.language === 'en' ? "bg-primary text-white" : "text-main hover:bg-gray-100 dark:hover:bg-gray-800")}
            >
              EN
            </button>
            <button
              onClick={() => i18n.changeLanguage('ro')}
              className={cn("px-3 py-1 rounded text-sm font-medium transition", i18n.language === 'ro' ? "bg-primary text-white" : "text-main hover:bg-gray-100 dark:hover:bg-gray-800")}
            >
              RO
            </button>
            <div className="w-px h-6 bg-border mx-1"></div>
            <button
              onClick={() => setIsDark(!isDark)}
              className="btn btn-ghost text-xl p-2"
              title="Schimbă tema"
            >
              {isDark ? '🌙' : '☀️'}
            </button>
          </div>
        </header>

        {/* --- GRID DEMONSTRATIV --- */}
        <main className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* CARD 1: Traduceri și Tipografie */}
          <section className="card space-y-4">
            <div className="border-b border-border pb-2">
              <h2 className="text-h3">1. Traduceri (i18n)</h2>
            </div>
            <p className="text-body">
              Text tradus: <span className="font-bold text-primary">{t('welcome')}</span>
            </p>
            <p className="text-body">
              Text auth: <span className="font-bold text-primary">{t('auth.login')}</span>
            </p>
            <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-md border border-blue-200 dark:border-blue-800">
              <p className="text-caption text-blue-800 dark:text-blue-200">
                Acest card își schimbă fundalul automat pe Dark Mode datorită clasei <code>.card</code>.
              </p>
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
              <button
                onClick={() => setCount(c => c + 1)}
                className={cn(
                  "btn w-full transition-all duration-300",
                  // Condiție complexă în cn:
                  count > 5
                    ? "bg-green-500 hover:bg-green-600 text-white shadow-lg scale-105"
                    : "btn-primary"
                )}
              >
                Count is {count} {count > 5 && "(High!)"}
              </button>
            </div>
          </section>

          {/* CARD 3: Formulare */}
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
    </div>
  )
}