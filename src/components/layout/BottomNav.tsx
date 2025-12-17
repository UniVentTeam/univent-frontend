import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, CalendarDays, Bookmark, User, ClipboardPenLine, Ticket } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const role = useAuthStore((state) => state.role);
  const location = useLocation();

  const baseNavigationItems = [
    { id: 1, icon: Home, label: t('navigation.home'), to: '/' },
    { id: 2, icon: CalendarDays, label: t('navigation.calendar'), to: '/events/calendar' },
    { id: 3, icon: Bookmark, label: t('navigation.saved') },
    { id: 4, icon: User, label: t('navigation.profile'), to: '/profile' },
    { id: 5, icon: ClipboardPenLine, label: t('navigation.enrollments') },
  ];

  const navigationItems = [...baseNavigationItems];

  if (role === 'admin' || role === 'organizer') {
    navigationItems.push({
      id: 6,
      icon: Ticket,
      label: t('navigation.events'),
      to: '/events/verification',
    });
  }

  return (
    // PĂSTRAT STILURI ORIGINALE: bg-accent/40, rounded-t, shadow specific, z-10
    <nav className="fixed bottom-0 left-0 z-10 w-full rounded-t-[10px] bg-accent/40 py-2 shadow-[5px_5px_10px_#00000040] backdrop-blur-sm transition-all duration-300 sm:py-3">
      {/* MODIFICARE LAYOUT:
         - justify-between: Distribuie elementele egal.
         - mx-auto max-w-lg: PE MOBIL -> Centrează containerul și îl ține compact.
         - md:max-w-none md:mx-0: PE DESKTOP -> Anulează limita de lățime, întinzându-se pe tot ecranul.
         - px-4...: Padding-urile tale originale.
      */}
      <div className="mx-auto flex w-full max-w-lg items-center justify-between px-4 sm:px-8 md:mx-0 md:max-w-none md:px-12 lg:px-[15rem]">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          // Verificăm manual ruta pentru a aplica scale-ul corect
          const isActiveRoute =
            item.to === '/'
              ? location.pathname === '/'
              : item.to && location.pathname.startsWith(item.to);

          const content = (
            <>
              {/* PĂSTRAT DIMENSIUNI ORIGINALE: w-[60px] etc. */}
              <div className="relative flex h-[60px] w-[60px] items-center justify-center sm:h-[70px] sm:w-[70px]">
                <Icon className="h-[70%] w-[70%] object-contain drop-shadow-md" />
              </div>
              {/* PĂSTRAT TEXT ORIGINAL: text-primary, font-bold, drop-shadow */}
              <span className="mt-2 text-center text-base font-bold text-primary drop-shadow sm:text-sm">
                {item.label}
              </span>
            </>
          );

          // PĂSTRAT EFECTE ORIGINALE: hover:scale-110, active:scale-95
          const commonClasses = cn(
            'flex flex-col items-center w-[60px] sm:w-[70px] transition-transform duration-200 hover:scale-110 active:scale-95',
          );

          if ('to' in item && item.to) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  cn(commonClasses, {
                    'scale-110': isActive, // Păstrat efectul de mărire când e activ
                  })
                }
                aria-label={item.label}
              >
                {content}
              </NavLink>
            );
          }

          return (
            <button
              key={item.id}
              className={commonClasses}
              aria-label={item.label}
              title={`${item.label} - Coming Soon`}
            >
              {content}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
