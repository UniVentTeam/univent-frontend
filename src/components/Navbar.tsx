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
  CalendarPlus
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
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="layout-container flex items-center justify-between h-16">

        {/* === 1. LOGO === */}
        <Link to="/" className="text-xl font-display font-bold text-main flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white">
            U
          </div>
          UniVent
        </Link>

        {/* === 2. MENIU DESKTOP === */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={getLinkClass('/')}>Home</Link>
          <Link to="/events" className={getLinkClass('/events')}>Events</Link>
          
          {isAuthenticated && (
            <>
              <Link to="/events/calendar" className={getLinkClass('/events/calendar')}>Calendar</Link>
              <Link to="/tickets" className={getLinkClass('/tickets')}>My Tickets</Link>
              <Link to="/profile" className={getLinkСlass('/profile')}>Profile</Link>
            </>
          )}
        </div>

        {/* === 3. CONTROALE DREAPTA (Desktop) === */}
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={toggleLang}
            className="btn btn-ghost w-10 h-10"
            title="Change language"
          >
            <span className="text-xs font-bold uppercase">{i18n.language}</span>
          </button>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost w-10 h-10"
            title="Change theme"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-border mx-2"></div>

          {/* Auth Buttons - REFACTORIZAT */}
          {isAuthenticated ? (
            <button onClick={handleLogout} className="btn btn-danger gap-2">
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
          className="md:hidden btn btn-ghost p-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* === 5. MENIU MOBIL (Dropdown) === */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border bg-card absolute w-full left-0 shadow-lg animate-in slide-in-from-top-2">
          <div className="p-4 space-y-2 flex flex-col">
            <Link to="/" className="text-main font-medium py-3 border-b border-border/50">Home</Link>
            <Link to="/events" className="text-main font-medium py-3 border-b border-border/50">Events</Link>

            {isAuthenticated && (
              <>
                <Link to="/events/calendar" className="text-main font-medium py-3 border-b border-border/50">Calendar</Link>
                <Link to="/tickets" className="text-main font-medium py-3 border-b border-border/50">My Tickets</Link>
                <Link to="/profile" className="flex items-center gap-2 text-main font-medium py-3 border-b border-border/50">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}

            <div className="pt-4">
              {isAuthenticated ? (
                <button onClick={handleLogout} className="btn btn-danger w-full">
                  Deconectare
                </button>
              ) : (
                <button onClick={() => navigate('/auth/login')} className="btn btn-primary w-full">
                  Intră în cont
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 pt-4">
              <button onClick={toggleLang} className="btn btn-secondary flex-1">
                {i18n.language.toUpperCase()}
              </button>
              <button onClick={toggleTheme} className="btn btn-secondary p-3">
                {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}