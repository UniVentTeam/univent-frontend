// src/pages/RegisterPage.tsx
// Rămâne aproape la fel, dar asigurăm că error handling-ul e consistent.
// Am adăugat validare simplă pentru email și parolă (opțional, dar bună practică).

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/api/authService';
import { UserPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (!email || !password || !fullName) {
      setError(t('auth.registerPage.requiredError'));
      return;
    }

    // Validare simplă suplimentară (opțional)
    if (!email.includes('@') || password.length < 6) {
      setError(t('auth.registerPage.validationError')); // Adaugă traducere pentru asta
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({ fullName, email, password });
      // The service shows a success toast
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="card bg-card p-8 space-y-6">
        <header className="text-center">
          <h1 className="text-h2">{t('auth.registerPage.title')}</h1>
          <p className="text-body-sm mt-1">{t('auth.registerPage.subtitle')}</p>
        </header>

        <div>
          <label className="label" htmlFor="fullName">
            {t('auth.registerPage.fullNameLabel')}
          </label>
          <input
            id="fullName"
            type="text"
            className="input-field"
            placeholder="Ex: Popescu Ion"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label" htmlFor="email">
            {t('auth.registerPage.emailLabel')}
          </label>
          <input
            id="email"
            type="email"
            className="input-field"
            placeholder="name@usv.ro"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <div>
          <label className="label" htmlFor="password">
            {t('auth.registerPage.passwordLabel')}
          </label>
          <input
            id="password"
            type="password"
            className="input-field"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>
        
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button type="submit" className={cn("btn btn-primary w-full gap-2", isLoading && "cursor-wait")} disabled={isLoading}>
          <UserPlus className={cn("transition-all", isLoading && "animate-pulse")} size={16} />
          {isLoading ? t('auth.registerPage.submitButtonLoading') : t('auth.registerPage.submitButton')}
        </button>

        <p className="text-center text-caption">
          {t('auth.registerPage.loginPrompt')}{' '}
          <Link to="/auth/login" className="font-medium text-blue-500 hover:underline">
            {t('auth.registerPage.loginLink')}
          </Link>
        </p>
      </form>
    </div>
  );
}