import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '@/api/authService';
import { associationService } from '@/api/associationService'; // Adăugat pentru fetch
import { UserPlus } from 'lucide-react';
import { cn } from '@/utils/cn';
import { useTranslation } from 'react-i18next';
import { SelectDropdown } from '@/components/forms/SelectDropdown'; // Componenta existentă
import { CustomCheckbox } from '@/components/forms/CustomCheckbox'; // Componenta existentă
import type { components } from '@/types/schema';

type AssociationSimple = components['schemas']['AssociationSimple'];

export default function RegisterPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // State-uri noi pentru selecție organizație
  const [isOrganizer, setIsOrganizer] = useState(false);
  const [associationId, setAssociationId] = useState<string | null>(null);
  const [associations, setAssociations] = useState<AssociationSimple[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch asociații la bifarea checkbox-ului
  useEffect(() => {
    async function fetchAssociations() {
      if (isOrganizer && associations.length === 0) {
        try {
          const fetched = await associationService.getAssociations();
          setAssociations(fetched);
        } catch (err) {
          console.error(err);
        }
      }
    }
    fetchAssociations();
  }, [isOrganizer, associations.length]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!email || !password || !fullName) {
      setError(t('auth.registerPage.requiredError'));
      return;
    }

    if (!email.includes('@') || password.length < 6) {
      setError(t('auth.registerPage.validationError'));
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        fullName,
        email,
        password,
        ...(isOrganizer && { associationId }), // Adaugă asociația doar dacă este organizator
      });

      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const associationOptions = associations.map((assoc) => ({
    value: assoc.id ?? '',
    label: assoc.name ?? '',
  }));

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

        {/* Partea de selecție organizație */}
        <CustomCheckbox
          id="isOrganizer"
          label={t('roles.organizer')}
          checked={isOrganizer}
          onChange={(e) => setIsOrganizer(e.target.checked)}
          disabled={isLoading}
        />

        {isOrganizer && (
          <div>
            <label className="label">{t('filters.association')}</label>
            <SelectDropdown
              options={associationOptions}
              selected={associationId}
              onChange={setAssociationId}
              title={t('filters.association')}
              className="mt-1"
            />
          </div>
        )}

        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        <button
          type="submit"
          className={cn('btn btn-primary w-full gap-2', isLoading && 'cursor-wait')}
          disabled={isLoading}
        >
          <UserPlus className={cn('transition-all', isLoading && 'animate-pulse')} size={16} />
          {isLoading
            ? t('auth.registerPage.submitButtonLoading')
            : t('auth.registerPage.submitButton')}
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
