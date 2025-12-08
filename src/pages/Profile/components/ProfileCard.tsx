// src/components/ProfileCard.tsx
import { useAuthStore } from '@/stores/authStore';
import { cn } from '@/utils/cn';
import { PenSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const ProfileCard = ({ className }: { className?: string }) => {
  const { t } = useTranslation();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return null; // Or a loading/error state
  }

  const { fullName, email, role, faculty, department } = user;

  return (
    <div className={cn('card', className)}>
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-h2 text-primary">{fullName}</h2>
          <p className="text-secondary mt-1">{email}</p>
        </div>
        <Link to="/profile/edit" className="btn btn-secondary gap-2">
          <PenSquare className="w-4 h-4" />
          <span>{t('profile.edit_button')}</span>
        </Link>
      </div>

      <div className="mt-6 border-t border-border pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-secondary">{t('profile.role')}</span>
          <span className="text-primary font-medium">{role}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-secondary">{t('profile.faculty')}</span>
          <span className="text-primary font-medium">{faculty ?? t('profile.not_set')}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-secondary">{t('profile.department')}</span>
          <span className="text-primary font-medium">{department ?? t('profile.not_set')}</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
