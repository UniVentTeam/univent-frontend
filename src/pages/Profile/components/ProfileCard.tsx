// src/components/ProfileCard.tsx
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';
import { PenSquare, ShieldCheck, Building, Briefcase, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { LanguageToggle } from '@/components/LanguageToggle';
import ProfileField from './ProfileField';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { components } from '@/types/schema';

const ProfileCard = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null; // Or a loading/error state
  }

  const { fullName, email, role, faculty, department, preferences } = user;

  const getTagClass = (preference: components['schemas']['EnumEventType']) => {
    const classMap = {
      ACADEMIC: 'tag-academic',
      SOCIAL: 'tag-social',
      SPORTS: 'tag-sports',
      CAREER: 'tag-career',
      VOLUNTEERING: 'tag-volunteering',
      WORKSHOP: 'tag-academic', // Assuming workshop is similar to academic
    };
    return classMap[preference] || 'tag-secondary';
  };

  return (
    <div className={cn('card', className)}>
      <div className="flex justify-between items-start max-md:flex-col">
        <div className="max-md:w-full max-md:mb-4">
          <h2 className="text-h2 text-primary">{fullName}</h2>
          <p className="text-secondary mt-1">{email}</p>
        </div>
        <div className="flex items-center gap-2 max-md:justify-center max-md:w-full">
          <ThemeToggle className="max-md:flex-grow max-md:h-12" />
          <LanguageToggle className="max-md:flex-grow max-md:h-12" />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6 grid md:grid-cols-2 gap-x-6 gap-y-4">
        <ProfileField label={t('profile.role')} value={role} icon={ShieldCheck} />
        <ProfileField
          label={t('profile.faculty')}
          value={faculty ?? t('profile.not_set')}
          icon={Building}
        />
        <ProfileField
          label={t('profile.department')}
          value={department ?? t('profile.not_set')}
          icon={Briefcase}
        />
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <div className="flex items-center gap-2 mb-4">
          <Heart className="w-6 h-6 text-secondary" />
          <h3 className="text-h3 text-primary">{t('profile.preferences_title')}</h3>
        </div>
        {preferences && preferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {preferences.map((pref) => (
              <span key={pref} className={cn('tag', getTagClass(pref))}>
                {t(`event_types.${pref}`)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-secondary">{t('profile.no_preferences_set')}</p>
        )}
      </div>

      <div className="flex justify-end mt-6 max-sm:justify-center">
        <Link to="/profile/edit" className="btn btn-secondary gap-2 max-sm:w-full">
          <PenSquare className="w-4 h-4" />
          <span>{t('profile.edit_button')}</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
