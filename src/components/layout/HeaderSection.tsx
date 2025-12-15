import { useAuthStore } from '@/stores/authStore';
import { useNavigate } from 'react-router-dom';
import { LogIn, LogOut, User } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export const HeaderSection: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleAuthClick = () => {
    if (isAuthenticated) {
      logout(); // curățăm user-ul și token-ul
      navigate('/auth/login'); // redirect la login
    } else {
      navigate('/auth/login'); // redirect la login
    }
  };

  return (
    <header className="relative flex flex-col w-full shadow-md bg-page">
      <nav className="w-full flex items-center justify-between bg-accent/40 rounded-[10px] px-4 sm:px-8 py-1 gap-4 sm:gap-0">
        {/* LEFT */}
        <div className="flex items-center gap-4 sm:gap-8">
          <a
            href="/"
            className="flex w-16 sm:w-20 h-16 sm:h-20 items-center justify-center p-2 sm:p-5 bg-card/40 rounded-[20px] shadow-lg relative"
            aria-label="UniVent Home"
          >
            <img
              className="object-contain w-full h-full"
              alt="UniVent Logo"
              src="/assets/vector-25.svg"
            />
          </a>

          <div className="text-xl font-normal text-primary sm:text-2xl md:text-3xl">UniVent</div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2 sm:gap-6">
          {isAuthenticated && (
            <button
              className={cn('btn btn-secondary', 'w-auto h-10 sm:h-11 rounded-full')}
              type="button"
              onClick={() => navigate('/profile')}
              aria-label={t('header.student')}
            >
              <span className="text-sm font-bold sm:text-2xl">{t('header.student')}</span>
              <User className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          )}

          <button
            className="btn btn-secondary h-10 sm:h-11 rounded-full px-4 sm:px-6 min-w-[120px] flex items-center justify-center gap-2"
            type="button"
            onClick={handleAuthClick}
            aria-label={isAuthenticated ? t('header.signOut') : t('header.signIn')}
          >
            <span className="text-sm font-bold sm:text-2xl">
              {isAuthenticated ? t('header.signOut') : t('header.signIn')}
            </span>
            {isAuthenticated ? (
              <LogOut className="w-5 h-5 sm:w-6 sm:h-6" />
            ) : (
              <LogIn className="w-5 h-5 sm:w-6 sm:h-6" />
            )}
          </button>
        </div>
      </nav>
    </header>
  );
};