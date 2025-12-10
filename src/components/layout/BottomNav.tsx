import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, CalendarDays, Bookmark, User, ClipboardPenLine } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navigationItems = [
    { id: 1, icon: Home, label: t('navigation.home'), to: '/' },
    { id: 2, icon: CalendarDays, label: t('navigation.calendar'), to: '/events/calendar' },
    { id: 3, icon: Bookmark, label: t('navigation.saved') },
    { id: 4, icon: User, label: t('navigation.profile'), to: '/profile' },
    { id: 5, icon: ClipboardPenLine, label: t('navigation.enrollments') }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-accent/40 rounded-t-[10px] shadow-[5px_5px_10px_#00000040] z-10 px-4 sm:px-8 [@media(min-width:1400px)]:px-[15rem] py-2 sm:py-3">
      <div className="flex flex-wrap items-center justify-between gap-6 sm:gap-10 md:gap-12 lg:gap-16">
        {navigationItems.map(item => {
          const Icon = item.icon;
          const content = (
            <>
              <div className="relative w-[60px] sm:w-[70px] h-[60px] sm:h-[70px] flex items-center justify-center">
                <Icon className="w-[70%] h-[70%] object-contain drop-shadow-md" />
              </div>
              <span className="text-primary text-base sm:text-sm text-center font-bold mt-2 drop-shadow">
                {item.label}
              </span>
            </>
          );

          if ('to' in item) {
            return (
              <NavLink
                key={item.id}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'flex flex-col items-center w-[60px] sm:w-[70px] transition-transform duration-200 hover:scale-110 active:scale-95',
                    { 'scale-110': isActive }
                  )
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
              className="flex flex-col items-center w-[60px] sm:w-[70px] transition-transform duration-200 hover:scale-110 active:scale-95"
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