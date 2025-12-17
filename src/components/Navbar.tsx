import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Menu,
  X,
  Sun,
  Moon,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { useAuthStore } from '@/stores/authStore';

export default function Navbar() {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout: clearAuth } = useAuthStore();

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // --- EFFECTS ---
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // --- HANDLERS ---
  const toggleTheme = () => setIsDark(!isDark);
  const toggleLang = () => i18n.changeLanguage(i18n.language === 'en' ? 'ro' : 'en');

  const handleLogout = () => {
    clearAuth();
    navigate('/');
  };

  // Helper pentru stilizarea link-urilor active
  const getLinkClass = (path: string) => cn(
    "text-sm font-medium transition-colors duration-200 hover:text-main",
    location.pathname === path ? "text-main font-bold" : "text-muted"
  );

  return (
    <nav className="sticky top-0 z-50 w-full transition-colors duration-300 border-b bg-card/80 backdrop-blur-md border-border">
      <div className="flex items-center justify-between h-14 layout-container">

        {/* === 1. LOGO === */}
        <Link to="/" className="flex items-center gap-2 text-xl font-bold font-display text-main">
          <div className="flex items-center justify-center w-8 h-8 text-white rounded-lg bg-accent">
            U
          </div>
          UniVent
        </Link>

        {/* === 2. MENIU DESKTOP === */}
        <div className="items-center hidden gap-8 md:flex">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/events" className={getLinkClass('/events')}>Events</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/events/calendar" className={getLinkClass('/events/calendar')}>Calendar</Link>
              <Link to="/tickets" className={getLinkClass('/tickets')}>My Tickets</Link>
              <Link to="/profile" className={getLinkClass('/profile')}>Profile</Link>
            </>
          )}
        </div>

        {/* === 3. CONTROALE DREAPTA (Desktop) === */}
        <div className="items-center hidden gap-2 md:flex">
          <button
            onClick={toggleLang}
            className="w-10 h-10 btn btn-ghost"
            title="Change language"
          >
            <span className="text-sm font-bold uppercase">{i18n.language}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="w-10 h-10 btn btn-ghost"
            title="Change theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 mx-2 bg-border"></div>

          {/* Auth Buttons - REFACTORIZAT */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="gap-2 btn btn-danger">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth/login')}
              className="btn btn-primary"
            >
              Login
            </button>
          )}
        </div>

        {/* === 4. BUTON HAMBURGER (Mobile Only) === */}
        <button
          className="p-2 md:hidden btn btn-ghost"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* === 5. MENIU MOBIL (Dropdown) === */}
      {isMenuOpen && (
        <div className="absolute left-0 w-full border-t shadow-lg md:hidden border-border bg-card animate-in slide-in-from-top-2">
          <div className="flex flex-col p-4 space-y-2">
            <Link to="/" className="py-3 font-medium border-b text-main border-border/50">Home</Link>
            <Link to="/events" className="py-3 font-medium border-b text-main border-border/50">Events</Link>

            {isAuthenticated && (
              <>
                <Link to="/events/calendar" className="py-3 font-medium border-b text-main border-border/50">Calendar</Link>
                <Link to="/tickets" className="py-3 font-medium border-b text-main border-border/50">My Tickets</Link>
                <Link to="/profile" className="flex items-center gap-2 py-3 font-medium border-b text-main border-border/50">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}

            <div className="pt-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="w-full btn btn-danger">
                  Deconectare
                </button>
              ) : (
                <button onClick={() => navigate('/auth/login')} className="w-full btn btn-primary">
                  Intră în cont
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={toggleLang} className="flex-1 btn btn-secondary">
                {i18n.language.toUpperCase()}
              </button>
              <button onClick={toggleTheme} className="p-3 btn btn-secondary">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}