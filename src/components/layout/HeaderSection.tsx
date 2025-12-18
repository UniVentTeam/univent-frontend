import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LogIn,
  LogOut,
  User,
  Menu,
  Home,
  CalendarDays,
  ClipboardPenLine,
  Ticket,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/stores/authStore';

type NavItem = {
  key: 'home' | 'calendar' | 'enrollments' | 'profile' | 'events';
  icon: React.ElementType;
  to: string;
  auth?: boolean;
  roles?: Array<'STUDENT' | 'ADMIN' | 'ORGANIZER'>;
};

export const HeaderSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const role = user?.role;

  const [userOpen, setUserOpen] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  /* ---------- scroll shadow ---------- */
  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* ---------- close on outside / ESC ---------- */
  React.useEffect(() => {
    const onDown = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu-root]')) {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        setUserOpen(false);
      }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  /* ---------- helpers ---------- */
  const getInitials = (u: any) => {
    if (!u?.fullName) return 'U';
    const parts = u.fullName.trim().split(/\s+/);
    return parts.length === 1
      ? parts[0][0].toUpperCase()
      : `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  };

  const displayName = (u: any) => (u?.fullName ? u.fullName.trim().split(/\s+/)[0] : '');

  /* ---------- navigation (logic only) ---------- */
  const navItems: NavItem[] = [
    { key: 'home', icon: Home, to: '/' },
    { key: 'calendar', icon: CalendarDays, to: '/events/calendar' },
    { key: 'enrollments', icon: ClipboardPenLine, to: '/tickets', auth: true },
    { key: 'profile', icon: User, to: '/profile', auth: true },
    {
      key: 'events',
      icon: Ticket,
      to: '/events/verification',
      auth: true,
      roles: ['ADMIN', 'ORGANIZER'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => {
    if (item.auth && !isAuthenticated) return false;
    if (item.roles && !item.roles.includes(role)) return false;
    return true;
  });

  console.log('AUTH DEBUG →', {
    isAuthenticated,
    role,
    user,
  });

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-50 w-full">
      <nav
        className={cn(
          `
            w-full flex items-center justify-between
            px-4 sm:px-8 py-3
            rounded-[14px]
            bg-[var(--bg-card)]
            border border-[var(--border-base)]
            transition-shadow duration-300
          `,
          scrolled ? 'shadow-[0_10px_30px_-18px_rgba(0,0,0,0.35)]' : 'shadow-none',
        )}
      >
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <a
            // href="/"
            onClick={() => {
              navigate('/');
            }}
            className="flex w-12 h-12 items-center justify-center rounded-2xl bg-[var(--bg-muted)] border border-[var(--border-base)] hover:shadow-md transition"
          >
            <img src="/assets/vector-25.svg" alt="UniVent" className="w-7 h-7" />
          </a>

          <div className="flex flex-col leading-tight">
            <span className="text-lg font-semibold text-[var(--text-primary)]">UniVent</span>
            <span className="text-xs text-[var(--text-secondary)]">University Events Platform</span>
          </div>
        </div>

        {/* DESKTOP NAV 
        <div className="hidden md:flex flex-1 justify-center bg-pink-500 p-3">
          {visibleNavItems.map((item) => (
            <button
              key={item.key}
              onClick={() => navigate(item.to)}
              className={cn(
                'px-3 py-2 rounded-full text-sm font-semibold transition',
                isActive(item.to)
                  ? 'bg-[var(--bg-muted)] text-[var(--text-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)]',
              )}
            >
              {t(`navigation.${item.key}`)}
            </button>
          ))}
        </div>*/}

        {/* RIGHT */}
        <div className="relative flex items-center gap-3" data-menu-root>
          {!isAuthenticated ? (
            <button
              onClick={() => navigate('/auth/login')}
              className="h-10 px-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-sm font-semibold hover:bg-[var(--btn-primary-bg-hover)] transition"
            >
              <span className="flex items-center gap-2">
                {t('header.signIn')}
                <LogIn className="w-5 h-5" />
              </span>
            </button>
          ) : (
            <>
              {/* MOBILE MENU */}
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="
    h-10 w-10
    rounded-full
    flex items-center justify-center
    bg-[var(--bg-muted)]
    border border-[var(--border-base)]
    transition
  "
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="hidden md:flex bg-red-500"></div>
              <div
                className={cn(
                  'absolute right-0 top-14 w-64 rounded-2xl p-2 bg-[var(--bg-card)] border border-[var(--border-base)] shadow-2xl transition',
                  menuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
                )}
              >
                {visibleNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        navigate(item.to);
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-3 rounded-xl text-sm hover:bg-[var(--bg-muted)]"
                    >
                      <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
                      {t(`navigation.${item.key}`)}
                    </button>
                  );
                })}
              </div>

              {/* USER */}
              <button
                onClick={() => setUserOpen((v) => !v)}
                className="flex items-center gap-2 rounded-full px-2 py-1.5 hover:bg-[var(--bg-muted)] transition"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--color-accent)] text-white font-bold flex items-center justify-center">
                  {getInitials(user)}
                </div>
                <span className="hidden sm:block text-sm font-semibold">{displayName(user)}</span>
              </button>

              <div
                className={cn(
                  'absolute right-0 top-14 w-48 rounded-2xl p-2 bg-[var(--bg-card)] border border-[var(--border-base)] shadow-2xl transition',
                  userOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none',
                )}
              >
                <button
                  onClick={() => navigate('/profile')}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl hover:bg-[var(--bg-muted)]"
                >
                  <User className="w-4 h-4" />
                  Profil
                </button>

                <button
                  onClick={() => {
                    logout();
                    navigate('/auth/login');
                  }}
                  className="flex items-center gap-3 w-full px-3 py-2 rounded-xl text-[var(--text-destructive)] hover:bg-[var(--color-red-100)]"
                >
                  <LogOut className="w-4 h-4" />
                  {t('header.signOut')}
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};
