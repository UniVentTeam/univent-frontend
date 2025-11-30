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

export default function Navbar() {
  const { i18n } = useTranslation(); // t e pentru traduceri, dacă le folosești
  const location = useLocation();
  const navigate = useNavigate();

  // --- STATE ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Verificăm Auth (Simulare cu localStorage)
  // Nota: În producție, asta ar veni dintr-un AuthContext
  const isAuthenticated = localStorage.getItem('token') !== null;

  // Inițializare Dark Mode din localStorage
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // --- EFFECTS ---

  // 1. Aplică clasa .dark pe <html> când se schimbă state-ul
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

  // 2. Închide meniul de mobil automat când schimbăm pagina
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // --- HANDLERS ---

  const toggleTheme = () => setIsDark(!isDark);

  const toggleLang = () => {
    const newLang = i18n.language === 'en' ? 'ro' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // Refresh forțat pentru a reseta toată aplicația la starea "nelogat"
    window.location.href = "/";
  };

  // Helper pentru stilizarea link-urilor active
  const getLinkClass = (path: string) => cn(
    "text-sm font-medium transition-colors duration-200 hover:text-primary",
    location.pathname === path ? "text-primary font-bold" : "text-muted"
  );

  return (
    <nav className="sticky top-0 z-50 w-full bg-card/80 backdrop-blur-md border-b border-border transition-colors duration-300">
      <div className="layout-container flex items-center justify-between h-16">

        {/* === 1. LOGO === */}
        <Link to="/" className="text-xl font-display font-bold text-primary flex items-center gap-2">
          {/* Poți pune un icon mic aici */}
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
            U
          </div>
          UniVent
        </Link>

        {/* === 2. MENIU DESKTOP (Hidden on Mobile) === */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className={getLinkClass('/')}>
            Home
          </Link>

          {/* Link-uri vizibile DOAR dacă ești logat */}
          {isAuthenticated && (
            <>
              <Link to="/events/create" className={getLinkClass('/events/create')}>
                Create Event
              </Link>
              <Link to="/profile" className={getLinkClass('/profile')}>
                Profile
              </Link>
            </>
          )}
        </div>

        {/* === 3. CONTROALE DREAPTA (Desktop) === */}
        <div className="hidden md:flex items-center gap-3">
          {/* Buton Limbă */}
          <button
            onClick={toggleLang}
            className="btn btn-ghost p-2 h-9 w-9 rounded-full"
            title="Schimbă limba"
          >
            <span className="text-xs font-bold uppercase">{i18n.language}</span>
          </button>

          {/* Buton Temă */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost p-2 h-9 w-9 rounded-full text-main"
            title="Schimbă tema"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <div className="w-px h-6 bg-border mx-1"></div>

          {/* Auth Buttons */}
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="btn btn-ghost text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth/login')}
              className="btn btn-primary btn-sm"
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
          <div className="p-4 space-y-4 flex flex-col">

            {/* Link-uri Mobil */}
            <Link to="/" className="text-main py-2 border-b border-border/50">Home</Link>

            {isAuthenticated && (
              <>
                <Link to="/events/create" className="text-main py-2 border-b border-border/50 flex items-center gap-2">
                  <CalendarPlus className="w-4 h-4" /> Create Event
                </Link>
                <Link to="/profile" className="text-main py-2 border-b border-border/50 flex items-center gap-2">
                  <User className="w-4 h-4" /> Profile
                </Link>
              </>
            )}

            {/* Controale Mobil */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex gap-2">
                <button onClick={toggleLang} className="btn btn-secondary text-xs px-3 py-1">
                  {i18n.language.toUpperCase()}
                </button>
                <button onClick={toggleTheme} className="btn btn-secondary p-2">
                  {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>

              {isAuthenticated ? (
                <button onClick={handleLogout} className="text-red-500 font-medium text-sm">
                  Deconectare
                </button>
              ) : (
                <button onClick={() => navigate('/auth/login')} className="btn btn-primary w-full max-w-[120px]">
                  Intră în cont
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </nav>
  );
}