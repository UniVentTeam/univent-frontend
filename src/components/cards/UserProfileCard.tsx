import { useAuthStore } from '@/stores/authStore';
import { useTranslation } from 'react-i18next';
import { LogOut } from 'lucide-react';
import { cn } from '@/utils/cn';

function UserProfileCard({ className }: { className?: string }) {
  const { user, isAuthenticated } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const { t } = useTranslation();

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={cn('card flex items-center justify-between', className)}>
      <div>
        <h3 className="text-h3">{user?.fullName}</h3>
        <p className="text-body-sm">{user?.email}</p>
      </div>
      <button onClick={logout} className="btn btn-secondary gap-2">
        <LogOut className="w-4 h-4" />
        <span>{t('auth.logout')}</span>
      </button>
    </div>
  );
}

export default UserProfileCard;
